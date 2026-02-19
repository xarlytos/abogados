import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, FileText, User, Calendar, DollarSign, CheckCircle2,
  AlertCircle, Clock, FolderOpen, Download, Upload, Plus,
  Edit2, MoreVertical, Phone, Mail, MapPin,
  CheckSquare, AlertTriangle, MessageSquare, History,
  Gavel, Users, Briefcase, FileSignature,
  TrendingUp, TrendingDown, Wallet, Receipt,
  Scale, Bookmark, Eye, Pen, X, Trash2, Link, Share2, Printer,
  Archive, Copy
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRole } from '@/hooks/useRole';

import {
  getExpedienteById,
  getDocumentColor,
  getActivityColor,
  type ExpedienteDetail,
  type Documento,
  type Tarea,
  type Nota,
  type Actividad
} from '@/data/expedientesDetailData';
import { getStatusColor, getStatusText } from '@/data/expedientesData';

// ============================================
// TIPOS Y CONSTANTES
// ============================================

type TabType = 'general' | 'documentos' | 'actividad' | 'tareas' | 'audiencias' | 'notas' | 'finanzas';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
    {getStatusText(status)}
  </span>
);

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors = {
    high: 'text-red-400 bg-red-500/10 border-red-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  };
  const labels = { high: 'Alta', medium: 'Media', low: 'Baja' };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${colors[priority as keyof typeof colors]}`}>
      {labels[priority as keyof typeof labels]}
    </span>
  );
};

const DocumentIcon = ({ tipo }: { tipo: string }) => {
  const colorClass = getDocumentColor(tipo);
  const label = tipo.toUpperCase();
  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${colorClass}`}>
      {label.slice(0, 3)}
    </div>
  );
};

const ActivityIcon = ({ tipo }: { tipo: string }) => {
  const colorClass = getActivityColor(tipo);
  const icons: Record<string, React.ReactNode> = {
    creacion: <Plus className="w-4 h-4" />,
    edicion: <Edit2 className="w-4 h-4" />,
    documento: <FileText className="w-4 h-4" />,
    tarea: <CheckSquare className="w-4 h-4" />,
    audiencia: <Calendar className="w-4 h-4" />,
    nota: <MessageSquare className="w-4 h-4" />,
    estado: <Clock className="w-4 h-4" />
  };
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
      {icons[tipo] || <Clock className="w-4 h-4" />}
    </div>
  );
};

const ProgressBar = ({ progress, onChange }: { progress: number; onChange?: (val: number) => void }) => (
  <div className="w-full">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-theme-secondary">Progreso</span>
      <span className="text-sm font-medium text-theme-primary">{progress}%</span>
    </div>
    <div className="h-2 bg-theme-tertiary rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`h-full rounded-full ${
          progress === 100 ? 'bg-emerald-500' :
          progress > 50 ? 'bg-amber-500' :
          'bg-blue-500'
        }`}
      />
    </div>
    {onChange && (
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-2 accent-amber-500"
      />
    )}
  </div>
);

const InfoCard = ({ icon: Icon, label, value, subvalue }: { icon: any, label: string, value: string, subvalue?: string }) => (
  <div className="p-4 bg-theme-tertiary/50 rounded-xl">
    <div className="flex items-center gap-2 text-theme-secondary mb-2">
      <Icon className="w-4 h-4" />
      <span className="text-xs">{label}</span>
    </div>
    <p className="text-sm font-medium text-theme-primary">{value}</p>
    {subvalue && <p className="text-xs text-theme-tertiary mt-1">{subvalue}</p>}
  </div>
);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ExpedienteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role, roleConfig } = useRole();
  
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [expediente, setExpediente] = useState<ExpedienteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Modales
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Formularios
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState<Nota['tipo']>('general');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Tarea['prioridad']>('media');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<Documento['categoria']>('otro');
  
  // Edición
  const [editData, setEditData] = useState({
    titulo: '',
    descripcion: '',
    estado: '',
    prioridad: '',
    progreso: 0,
    clienteEmail: '',
    clienteTelefono: ''
  });

  const optionsRef = useRef<HTMLDivElement>(null);

  // Cargar expediente
  useEffect(() => {
    if (id) {
      const data = getExpedienteById(id);
      if (data) {
        setExpediente(data);
        setEditData({
          titulo: data.titulo,
          descripcion: data.descripcion,
          estado: data.estado,
          prioridad: data.prioridad,
          progreso: data.progreso,
          clienteEmail: data.clienteEmail || '',
          clienteTelefono: data.clienteTelefono || ''
        });
      }
      setLoading(false);
    }
  }, [id]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptionsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const toastId = Date.now();
    setToasts(prev => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 3000);
  };

  // Handlers
  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      showToast('La nota no puede estar vacía', 'error');
      return;
    }
    
    const newNota: Nota = {
      id: `nota-${Date.now()}`,
      contenido: newNoteContent,
      fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      autor: 'Usuario Actual',
      tipo: newNoteType
    };
    
    setExpediente(prev => prev ? {
      ...prev,
      notas: [newNota, ...prev.notas]
    } : null);
    
    // Agregar actividad
    const newActividad: Actividad = {
      id: `act-${Date.now()}`,
      tipo: 'nota',
      descripcion: 'Nota añadida al expediente',
      fecha: new Date().toLocaleString('es-ES'),
      autor: 'Usuario Actual'
    };
    
    setExpediente(prev => prev ? {
      ...prev,
      actividades: [newActividad, ...prev.actividades]
    } : null);
    
    setNewNoteContent('');
    setShowNewNoteModal(false);
    showToast('Nota guardada correctamente', 'success');
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      showToast('El título de la tarea es obligatorio', 'error');
      return;
    }
    
    const newTarea: Tarea = {
      id: `task-${Date.now()}`,
      titulo: newTaskTitle,
      descripcion: newTaskDesc,
      estado: 'pendiente',
      prioridad: newTaskPriority,
      fechaLimite: newTaskDueDate || new Date().toLocaleDateString('es-ES'),
      asignadoA: newTaskAssignee || expediente?.equipo.abogadoAsignado.nombre || 'Sin asignar',
      creadoPor: 'Usuario Actual'
    };
    
    setExpediente(prev => prev ? {
      ...prev,
      tareas: [newTarea, ...prev.tareas]
    } : null);
    
    // Agregar actividad
    const newActividad: Actividad = {
      id: `act-${Date.now()}`,
      tipo: 'tarea',
      descripcion: `Tarea creada: ${newTaskTitle}`,
      fecha: new Date().toLocaleString('es-ES'),
      autor: 'Usuario Actual'
    };
    
    setExpediente(prev => prev ? {
      ...prev,
      actividades: [newActividad, ...prev.actividades]
    } : null);
    
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowNewTaskModal(false);
    showToast('Tarea creada correctamente', 'success');
  };

  const handleToggleTask = (taskId: string) => {
    setExpediente(prev => {
      if (!prev) return null;
      const tarea = prev.tareas.find(t => t.id === taskId);
      if (!tarea) return prev;
      
      const newEstado = tarea.estado === 'completada' ? 'pendiente' : 'completada';
      
      // Agregar actividad
      const newActividad: Actividad = {
        id: `act-${Date.now()}`,
        tipo: 'tarea',
        descripcion: `Tarea "${tarea.titulo}" marcada como ${newEstado === 'completada' ? 'completada' : 'pendiente'}`,
        fecha: new Date().toLocaleString('es-ES'),
        autor: 'Usuario Actual'
      };
      
      return {
        ...prev,
        tareas: prev.tareas.map(t => t.id === taskId ? { ...t, estado: newEstado } : t),
        actividades: [newActividad, ...prev.actividades]
      };
    });
    
    showToast('Estado de tarea actualizado', 'success');
  };

  const handleAddDocument = () => {
    if (!newDocName.trim()) {
      showToast('El nombre del documento es obligatorio', 'error');
      return;
    }
    
    const newDoc: Documento = {
      id: `doc-${Date.now()}`,
      nombre: newDocName.endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
      tipo: 'pdf',
      tamaño: '0 KB',
      fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      autor: 'Usuario Actual',
      categoria: newDocCategory,
      firmado: false
    };
    
    setExpediente(prev => prev ? {
      ...prev,
      documentos: [newDoc, ...prev.documentos]
    } : null);
    
    // Agregar actividad
    const newActividad: Actividad = {
      id: `act-${Date.now()}`,
      tipo: 'documento',
      descripcion: `Documento subido: ${newDoc.nombre}`,
      fecha: new Date().toLocaleString('es-ES'),
      autor: 'Usuario Actual'
    };
    
    setExpediente(prev => prev ? {
      ...prev,
      actividades: [newActividad, ...prev.actividades]
    } : null);
    
    setNewDocName('');
    setShowNewDocModal(false);
    showToast('Documento registrado correctamente', 'success');
  };

  const handleViewDocument = (doc: Documento) => {
    showToast(`Abriendo ${doc.nombre}...`, 'info');
    // Simulamos abrir el documento
    setTimeout(() => {
      window.open('#', '_blank');
    }, 500);
  };

  const handleDownloadDocument = (doc: Documento) => {
    showToast(`Descargando ${doc.nombre}...`, 'info');
    // Simulamos la descarga
    const link = document.createElement('a');
    link.href = '#';
    link.download = doc.nombre;
    link.click();
    
    setTimeout(() => {
      showToast(`${doc.nombre} descargado`, 'success');
    }, 1000);
  };

  const handleSignDocument = (doc: Documento) => {
    if (doc.firmado) {
      showToast('Este documento ya está firmado', 'error');
      return;
    }
    
    setExpediente(prev => {
      if (!prev) return null;
      return {
        ...prev,
        documentos: prev.documentos.map(d => 
          d.id === doc.id ? { ...d, firmado: true } : d
        )
      };
    });
    
    // Agregar actividad
    const newActividad: Actividad = {
      id: `act-${Date.now()}`,
      tipo: 'documento',
      descripcion: `Documento firmado: ${doc.nombre}`,
      fecha: new Date().toLocaleString('es-ES'),
      autor: 'Usuario Actual'
    };
    
    setExpediente(prev => prev ? {
      ...prev,
      actividades: [newActividad, ...prev.actividades]
    } : null);
    
    showToast(`Documento ${doc.nombre} firmado correctamente`, 'success');
  };

  const handleDeleteDocument = (docId: string) => {
    if (!confirm('¿Estás seguro de eliminar este documento?')) return;
    
    setExpediente(prev => {
      if (!prev) return null;
      const doc = prev.documentos.find(d => d.id === docId);
      
      // Agregar actividad
      const newActividad: Actividad = {
        id: `act-${Date.now()}`,
        tipo: 'documento',
        descripcion: `Documento eliminado: ${doc?.nombre || docId}`,
        fecha: new Date().toLocaleString('es-ES'),
        autor: 'Usuario Actual'
      };
      
      return {
        ...prev,
        documentos: prev.documentos.filter(d => d.id !== docId),
        actividades: [newActividad, ...prev.actividades]
      };
    });
    
    showToast('Documento eliminado', 'success');
  };

  const handleSaveEdit = () => {
    setExpediente(prev => {
      if (!prev) return null;
      
      const cambios: string[] = [];
      if (prev.titulo !== editData.titulo) cambios.push('título');
      if (prev.descripcion !== editData.descripcion) cambios.push('descripción');
      if (prev.estado !== editData.estado) cambios.push('estado');
      if (prev.prioridad !== editData.prioridad) cambios.push('prioridad');
      if (prev.progreso !== editData.progreso) cambios.push('progreso');
      
      // Agregar actividad
      const newActividad: Actividad = {
        id: `act-${Date.now()}`,
        tipo: 'edicion',
        descripcion: cambios.length > 0 
          ? `Expediente editado: ${cambios.join(', ')}`
          : 'Expediente editado',
        fecha: new Date().toLocaleString('es-ES'),
        autor: 'Usuario Actual'
      };
      
      return {
        ...prev,
        titulo: editData.titulo,
        descripcion: editData.descripcion,
        estado: editData.estado as any,
        prioridad: editData.prioridad as any,
        progreso: editData.progreso,
        clienteEmail: editData.clienteEmail,
        clienteTelefono: editData.clienteTelefono,
        actividades: [newActividad, ...prev.actividades]
      };
    });
    
    setShowEditModal(false);
    showToast('Expediente actualizado correctamente', 'success');
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast('Enlace copiado al portapapeles', 'success');
    setShowOptionsDropdown(false);
  };

  const handleShare = () => {
    setShowShareModal(true);
    setShowOptionsDropdown(false);
  };

  const handlePrint = () => {
    window.print();
    setShowOptionsDropdown(false);
  };

  const handleArchive = () => {
    if (!confirm('¿Estás seguro de archivar este expediente?')) return;
    
    setExpediente(prev => prev ? { ...prev, estado: 'closed' } : null);
    setEditData(prev => ({ ...prev, estado: 'closed' }));
    
    const newActividad: Actividad = {
      id: `act-${Date.now()}`,
      tipo: 'estado',
      descripcion: 'Expediente archivado',
      fecha: new Date().toLocaleString('es-ES'),
      autor: 'Usuario Actual'
    };
    
    setExpediente(prev => prev ? {
      ...prev,
      actividades: [newActividad, ...prev.actividades]
    } : null);
    
    setShowOptionsDropdown(false);
    showToast('Expediente archivado', 'success');
  };

  const handleExportPDF = () => {
    showToast('Generando PDF del expediente...', 'info');
    setTimeout(() => {
      showToast('PDF descargado', 'success');
    }, 1500);
    setShowOptionsDropdown(false);
  };

  // Permisos según rol
  const permissions = {
    canEdit: role === 'super_admin' || role === 'socio' || role === 'abogado_senior' || role === 'abogado_junior',
    canDelete: role === 'super_admin' || role === 'socio',
    canUploadDocs: role !== 'contador' && role !== 'recepcionista',
    canCreateTasks: role === 'super_admin' || role === 'socio' || role === 'abogado_senior',
    canAddNotes: role !== 'recepcionista',
    canViewFinancialData: roleConfig.permissions.canViewFinancialData,
    canViewHistory: role === 'super_admin' || role === 'socio' || role === 'abogado_senior'
  };

  if (!loading && !expediente) {
    return (
      <AppLayout title="Expediente no encontrado" subtitle="">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-theme-tertiary rounded-full flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-theme-tertiary" />
            </div>
            <h2 className="text-2xl font-bold text-theme-primary mb-2">Expediente no encontrado</h2>
            <p className="text-theme-secondary mb-6">El expediente {id} no existe o no tienes acceso.</p>
            <button
              onClick={() => navigate('/expedientes')}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-xl hover:bg-amber-400 transition-colors"
            >
              Volver a Expedientes
            </button>
          </motion.div>
        </main>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout title="Cargando..." subtitle="">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
      </AppLayout>
    );
  }

  const tabs: { id: TabType; label: string; icon: any; count?: number }[] = [
    { id: 'general', label: 'General', icon: FileText },
    { id: 'documentos', label: 'Documentos', icon: FolderOpen, count: expediente?.documentos.length },
    { id: 'actividad', label: 'Actividad', icon: History, count: expediente?.actividades.length },
    { id: 'tareas', label: 'Tareas', icon: CheckSquare, count: expediente?.tareas.length },
    { id: 'audiencias', label: 'Audiencias', icon: Calendar, count: expediente?.audiencias.length },
    { id: 'notas', label: 'Notas', icon: MessageSquare, count: expediente?.notas.length },
    ...(permissions.canViewFinancialData ? [{ id: 'finanzas' as TabType, label: 'Finanzas', icon: DollarSign }] : []),
  ];

  return (
    <AppLayout
      title={expediente?.titulo || ''}
      subtitle={expediente?.id}
      headerActions={
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/expedientes')}
            className="flex items-center gap-2 px-4 py-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver</span>
          </button>
          {permissions.canEdit && (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span className="hidden sm:inline">Editar</span>
            </button>
          )}
        </div>
      }
    >
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Toasts */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          <AnimatePresence>
            {toasts.map(toast => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
                  toast.type === 'success' ? 'bg-emerald-500 text-white' :
                  toast.type === 'error' ? 'bg-red-500 text-white' :
                  'bg-slate-800 text-white border border-slate-700'
                }`}
              >
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                {toast.type === 'info' && <FileText className="w-5 h-5" />}
                {toast.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header con información principal */}
          <div className="bg-theme-card border border-theme rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <StatusBadge status={expediente!.estado} />
                  <PriorityBadge priority={expediente!.prioridad} />
                  <span className="px-3 py-1 text-xs font-medium rounded-full border border-theme text-theme-secondary">
                    {expediente!.tipo}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-theme-primary mb-2">{expediente!.titulo}</h1>
                <p className="text-theme-secondary">{expediente!.descripcion}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
                <ProgressBar progress={expediente!.progreso} />
                <div className="flex gap-2">
                  {permissions.canUploadDocs && (
                    <button
                      onClick={() => setShowNewDocModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-theme-tertiary hover:bg-theme-hover text-theme-primary rounded-xl transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Subir</span>
                    </button>
                  )}
                  <div className="relative" ref={optionsRef}>
                    <button
                      onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                      className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-xl transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    <AnimatePresence>
                      {showOptionsDropdown && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 mt-2 w-56 bg-theme-card border border-theme rounded-xl shadow-xl z-50 py-1"
                        >
                          <button
                            onClick={handleCopyLink}
                            className="w-full px-4 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
                          >
                            <Link className="w-4 h-4" />
                            Copiar enlace
                          </button>
                          <button
                            onClick={handleShare}
                            className="w-full px-4 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
                          >
                            <Share2 className="w-4 h-4" />
                            Compartir
                          </button>
                          <button
                            onClick={handlePrint}
                            className="w-full px-4 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
                          >
                            <Printer className="w-4 h-4" />
                            Imprimir
                          </button>
                          <button
                            onClick={handleExportPDF}
                            className="w-full px-4 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Exportar PDF
                          </button>
                          <div className="border-t border-theme my-1" />
                          {permissions.canDelete && (
                            <button
                              onClick={handleArchive}
                              className="w-full px-4 py-2 text-left text-sm text-amber-400 hover:bg-theme-tertiary flex items-center gap-2"
                            >
                              <Archive className="w-4 h-4" />
                              Archivar expediente
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs de navegación */}
          <div className="border-b border-theme">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-500'
                        : 'border-transparent text-theme-secondary hover:text-theme-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id ? 'bg-amber-500/20' : 'bg-theme-tertiary'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenido según tab activa */}
          <div className="min-h-[400px]">
            {activeTab === 'general' && <GeneralTab expediente={expediente!} />}
            {activeTab === 'documentos' && (
              <DocumentosTab 
                expediente={expediente!} 
                permissions={permissions}
                onView={handleViewDocument}
                onDownload={handleDownloadDocument}
                onSign={handleSignDocument}
                onDelete={handleDeleteDocument}
              />
            )}
            {activeTab === 'actividad' && <ActividadTab expediente={expediente!} />}
            {activeTab === 'tareas' && (
              <TareasTab 
                expediente={expediente!} 
                permissions={permissions}
                onNewTask={() => setShowNewTaskModal(true)}
                onToggleTask={handleToggleTask}
              />
            )}
            {activeTab === 'audiencias' && <AudienciasTab expediente={expediente!} />}
            {activeTab === 'notas' && (
              <NotasTab 
                expediente={expediente!} 
                permissions={permissions}
                onNewNote={() => setShowNewNoteModal(true)}
              />
            )}
            {activeTab === 'finanzas' && permissions.canViewFinancialData && <FinanzasTab expediente={expediente!} />}
          </div>
        </motion.div>
      </main>

      {/* MODALES */}

      {/* Modal Nueva Nota */}
      <AnimatePresence>
        {showNewNoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewNoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-theme-card border border-theme rounded-2xl w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-theme flex items-center justify-between">
                <h3 className="text-lg font-semibold text-theme-primary">Nueva Nota</h3>
                <button onClick={() => setShowNewNoteModal(false)} className="text-theme-secondary hover:text-theme-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Tipo de nota</label>
                  <select
                    value={newNoteType}
                    onChange={(e) => setNewNoteType(e.target.value as Nota['tipo'])}
                    className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                  >
                    <option value="general">General</option>
                    <option value="estrategia">Estrategia</option>
                    <option value="cliente">Cliente</option>
                    <option value="interna">Interna</option>
                  </select>
                </div>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Escribe tu nota aquí..."
                  className="w-full h-32 bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500 resize-none"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowNewNoteModal(false)}
                    className="px-4 py-2 text-theme-secondary hover:text-theme-primary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-xl hover:bg-amber-400"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Nueva Tarea */}
      <AnimatePresence>
        {showNewTaskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewTaskModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-theme-card border border-theme rounded-2xl w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-theme flex items-center justify-between">
                <h3 className="text-lg font-semibold text-theme-primary">Nueva Tarea</h3>
                <button onClick={() => setShowNewTaskModal(false)} className="text-theme-secondary hover:text-theme-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Título *</label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Título de la tarea"
                    className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Descripción</label>
                  <textarea
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Descripción de la tarea"
                    className="w-full h-20 bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-theme-secondary mb-2">Prioridad</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as Tarea['prioridad'])}
                      className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                    >
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-theme-secondary mb-2">Fecha límite</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Asignar a</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Seleccionar...</option>
                    <option value={expediente?.equipo.abogadoAsignado.nombre}>
                      {expediente?.equipo.abogadoAsignado.nombre} (Abogado)
                    </option>
                    {expediente?.equipo.colaboradores.map(c => (
                      <option key={c.id} value={c.nombre}>{c.nombre} ({c.rol})</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowNewTaskModal(false)}
                    className="px-4 py-2 text-theme-secondary hover:text-theme-primary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddTask}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-xl hover:bg-amber-400"
                  >
                    Crear
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Nuevo Documento */}
      <AnimatePresence>
        {showNewDocModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewDocModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-theme-card border border-theme rounded-2xl w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-theme flex items-center justify-between">
                <h3 className="text-lg font-semibold text-theme-primary">Subir Documento</h3>
                <button onClick={() => setShowNewDocModal(false)} className="text-theme-secondary hover:text-theme-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Nombre del documento *</label>
                  <input
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="Ej: Demanda, Escritura, etc."
                    className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Categoría</label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as Documento['categoria'])}
                    className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                  >
                    <option value="demanda">Demanda</option>
                    <option value="escritura">Escritura</option>
                    <option value="evidencia">Evidencia</option>
                    <option value="correspondencia">Correspondencia</option>
                    <option value="factura">Factura</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="border-2 border-dashed border-theme rounded-xl p-8 text-center">
                  <Upload className="w-10 h-10 text-theme-tertiary mx-auto mb-3" />
                  <p className="text-sm text-theme-secondary mb-2">Arrastra archivos aquí o haz click para seleccionar</p>
                  <p className="text-xs text-theme-tertiary">PDF, DOC, DOCX, JPG, PNG (max. 10MB)</p>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowNewDocModal(false)}
                    className="px-4 py-2 text-theme-secondary hover:text-theme-primary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddDocument}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-xl hover:bg-amber-400"
                  >
                    Subir Documento
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Editar Expediente */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-theme-card border border-theme rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-theme flex items-center justify-between">
                <h3 className="text-lg font-semibold text-theme-primary">Editar Expediente</h3>
                <button onClick={() => setShowEditModal(false)} className="text-theme-secondary hover:text-theme-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Título</label>
                  <input
                    type="text"
                    value={editData.titulo}
                    onChange={(e) => setEditData({...editData, titulo: e.target.value})}
                    className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Descripción</label>
                  <textarea
                    value={editData.descripcion}
                    onChange={(e) => setEditData({...editData, descripcion: e.target.value})}
                    className="w-full h-24 bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-theme-secondary mb-2">Estado</label>
                    <select
                      value={editData.estado}
                      onChange={(e) => setEditData({...editData, estado: e.target.value})}
                      className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                    >
                      <option value="active">Activo</option>
                      <option value="pending">Pendiente</option>
                      <option value="urgent">Urgente</option>
                      <option value="closed">Cerrado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-theme-secondary mb-2">Prioridad</label>
                    <select
                      value={editData.prioridad}
                      onChange={(e) => setEditData({...editData, prioridad: e.target.value})}
                      className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                    >
                      <option value="high">Alta</option>
                      <option value="medium">Media</option>
                      <option value="low">Baja</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Progreso ({editData.progreso}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editData.progreso}
                    onChange={(e) => setEditData({...editData, progreso: Number(e.target.value)})}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-theme-secondary mb-2">Email del cliente</label>
                    <input
                      type="email"
                      value={editData.clienteEmail}
                      onChange={(e) => setEditData({...editData, clienteEmail: e.target.value})}
                      className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-theme-secondary mb-2">Teléfono del cliente</label>
                    <input
                      type="tel"
                      value={editData.clienteTelefono}
                      onChange={(e) => setEditData({...editData, clienteTelefono: e.target.value})}
                      className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-theme-secondary hover:text-theme-primary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-xl hover:bg-amber-400"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Compartir */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-theme-card border border-theme rounded-2xl w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-theme flex items-center justify-between">
                <h3 className="text-lg font-semibold text-theme-primary">Compartir Expediente</h3>
                <button onClick={() => setShowShareModal(false)} className="text-theme-secondary hover:text-theme-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Enlace del expediente</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={window.location.href}
                      readOnly
                      className="flex-1 bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2 bg-theme-tertiary hover:bg-theme-hover rounded-xl transition-colors"
                    >
                      <Copy className="w-5 h-5 text-theme-secondary" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Compartir con</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="px-4 py-2 text-theme-secondary hover:text-theme-primary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      showToast('Invitación enviada', 'success');
                      setShowShareModal(false);
                    }}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-xl hover:bg-amber-400"
                  >
                    Enviar Invitación
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

// ============================================
// TABS
// ============================================

function GeneralTab({ expediente }: { expediente: ExpedienteDetail }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-theme-card border border-theme rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Información del Caso
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard icon={User} label="Cliente" value={expediente.cliente} />
            <InfoCard icon={TagIcon} label="Tipo" value={expediente.tipo} />
            <InfoCard icon={Calendar} label="Fecha Inicio" value={expediente.fechaInicio} />
            <InfoCard icon={Clock} label="Última Actualización" value={expediente.fechaActualizacion} />
          </div>
          
          {expediente.numeroProcedimiento && (
            <div className="mt-4 p-4 bg-theme-tertiary/50 rounded-xl">
              <div className="flex items-center gap-2 text-theme-secondary mb-1">
                <Scale className="w-4 h-4" />
                <span className="text-xs">Número de Procedimiento</span>
              </div>
              <p className="text-sm font-medium text-theme-primary">{expediente.numeroProcedimiento}</p>
              {expediente.juzgado && (
                <p className="text-xs text-theme-tertiary mt-1">{expediente.juzgado}</p>
              )}
            </div>
          )}
          
          {expediente.clienteEmail && (
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={`mailto:${expediente.clienteEmail}`} className="flex items-center gap-2 px-3 py-2 bg-theme-tertiary hover:bg-theme-hover rounded-lg text-sm text-theme-secondary transition-colors">
                <Mail className="w-4 h-4" />
                {expediente.clienteEmail}
              </a>
              {expediente.clienteTelefono && (
                <a href={`tel:${expediente.clienteTelefono}`} className="flex items-center gap-2 px-3 py-2 bg-theme-tertiary hover:bg-theme-hover rounded-lg text-sm text-theme-secondary transition-colors">
                  <Phone className="w-4 h-4" />
                  {expediente.clienteTelefono}
                </a>
              )}
            </div>
          )}
        </div>

        <div className="bg-theme-card border border-theme rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500" />
            Descripción Detallada
          </h3>
          <p className="text-theme-secondary leading-relaxed">{expediente.descripcion}</p>
        </div>

        {expediente.antecedentes && (
          <div className="bg-theme-card border border-theme rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-amber-500" />
              Antecedentes
            </h3>
            <p className="text-theme-secondary leading-relaxed">{expediente.antecedentes}</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-theme-card border border-theme rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            Equipo
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-theme-tertiary/50 rounded-xl">
              <span className="text-xs text-theme-tertiary uppercase tracking-wider">Abogado Asignado</span>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-theme-primary">{expediente.equipo.abogadoAsignado.nombre}</p>
                  <p className="text-xs text-theme-secondary">{expediente.equipo.abogadoAsignado.rol}</p>
                </div>
              </div>
            </div>

            {expediente.equipo.supervisor && (
              <div className="p-4 bg-theme-tertiary/50 rounded-xl">
                <span className="text-xs text-theme-tertiary uppercase tracking-wider">Supervisor</span>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Gavel className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-theme-primary">{expediente.equipo.supervisor.nombre}</p>
                    <p className="text-xs text-theme-secondary">Socio</p>
                  </div>
                </div>
              </div>
            )}

            {expediente.equipo.colaboradores.length > 0 && (
              <div className="p-4 bg-theme-tertiary/50 rounded-xl">
                <span className="text-xs text-theme-tertiary uppercase tracking-wider">Colaboradores</span>
                <div className="space-y-3 mt-2">
                  {expediente.equipo.colaboradores.map(colab => (
                    <div key={colab.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-theme-tertiary rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-theme-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-theme-primary">{colab.nombre}</p>
                        <p className="text-xs text-theme-secondary">{colab.rol}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-theme-card border border-theme rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-4">Resumen</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-secondary">Documentos</span>
              <span className="text-sm font-medium text-theme-primary">{expediente.documentos.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-secondary">Tareas</span>
              <span className="text-sm font-medium text-theme-primary">
                {expediente.tareas.filter(t => t.estado === 'completada').length}/{expediente.tareas.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-secondary">Audiencias</span>
              <span className="text-sm font-medium text-theme-primary">{expediente.audiencias.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-secondary">Notas</span>
              <span className="text-sm font-medium text-theme-primary">{expediente.notas.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentosTab({ 
  expediente, 
  permissions,
  onView,
  onDownload,
  onSign,
  onDelete
}: { 
  expediente: ExpedienteDetail; 
  permissions: any;
  onView: (doc: Documento) => void;
  onDownload: (doc: Documento) => void;
  onSign: (doc: Documento) => void;
  onDelete: (docId: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | Documento['categoria']>('all');
  
  const filteredDocs = filter === 'all' 
    ? expediente.documentos 
    : expediente.documentos.filter(d => d.categoria === filter);

  const categories: { id: Documento['categoria'] | 'all'; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'demanda', label: 'Demandas' },
    { id: 'escritura', label: 'Escrituras' },
    { id: 'evidencia', label: 'Evidencias' },
    { id: 'correspondencia', label: 'Correspondencia' },
    { id: 'factura', label: 'Facturas' },
    { id: 'otro', label: 'Otros' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={`px-4 py-2 text-sm rounded-xl transition-colors ${
              filter === cat.id
                ? 'bg-amber-500 text-slate-950'
                : 'bg-theme-tertiary text-theme-secondary hover:text-theme-primary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filteredDocs.length === 0 ? (
        <div className="text-center py-12 bg-theme-card border border-theme rounded-2xl">
          <FolderOpen className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
          <p className="text-theme-secondary">No hay documentos en esta categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map(doc => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-theme-card border border-theme rounded-2xl hover:bg-theme-hover transition-colors group"
            >
              <div className="flex items-start gap-4">
                <DocumentIcon tipo={doc.tipo} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-theme-primary truncate">{doc.nombre}</h4>
                    {doc.firmado && (
                      <span className="flex-shrink-0 px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 rounded-full flex items-center gap-1">
                        <FileSignature className="w-3 h-3" />
                        Firmado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-theme-tertiary">
                    <span>{doc.tamaño}</span>
                    <span>•</span>
                    <span>{doc.fecha}</span>
                    <span>•</span>
                    <span>{doc.autor}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <button
                      onClick={() => onView(doc)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-theme-tertiary hover:bg-theme-hover text-theme-secondary rounded-lg transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      Ver
                    </button>
                    <button
                      onClick={() => onDownload(doc)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-theme-tertiary hover:bg-theme-hover text-theme-secondary rounded-lg transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Descargar
                    </button>
                    {!doc.firmado && permissions.canUploadDocs && (
                      <button
                        onClick={() => onSign(doc)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors"
                      >
                        <Pen className="w-3 h-3" />
                        Firmar
                      </button>
                    )}
                    {permissions.canDelete && (
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActividadTab({ expediente }: { expediente: ExpedienteDetail }) {
  return (
    <div className="space-y-4">
      {expediente.actividades.length === 0 ? (
        <div className="text-center py-12 bg-theme-card border border-theme rounded-2xl">
          <History className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
          <p className="text-theme-secondary">No hay actividades registradas</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-theme" />
          
          <div className="space-y-4">
            {expediente.actividades.map((act, index) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-12"
              >
                <div className="absolute left-0 top-0">
                  <ActivityIcon tipo={act.tipo} />
                </div>
                <div className="p-4 bg-theme-card border border-theme rounded-xl">
                  <p className="text-sm text-theme-primary">{act.descripcion}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-theme-tertiary">
                    <span>{act.fecha}</span>
                    <span>•</span>
                    <span>{act.autor}</span>
                  </div>
                  {act.metadata && Object.keys(act.metadata).length > 0 && (
                    <div className="mt-3 p-2 bg-theme-tertiary/50 rounded-lg">
                      {Object.entries(act.metadata).map(([key, value]) => (
                        <div key={key} className="text-xs">
                          <span className="text-theme-tertiary">{key}:</span>
                          <span className="text-theme-secondary ml-1">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TareasTab({ 
  expediente, 
  permissions,
  onNewTask,
  onToggleTask
}: { 
  expediente: ExpedienteDetail; 
  permissions: any;
  onNewTask: () => void;
  onToggleTask: (taskId: string) => void;
}) {
  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'completada': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'en_progreso': return <Clock className="w-5 h-5 text-amber-400" />;
      case 'pendiente': return <AlertCircle className="w-5 h-5 text-slate-400" />;
      default: return null;
    }
  };

  const getPriorityBadge = (prioridad: string) => {
    const colors = {
      alta: 'text-red-400 bg-red-500/10',
      media: 'text-amber-400 bg-amber-500/10',
      baja: 'text-emerald-400 bg-emerald-500/10'
    };
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full ${colors[prioridad as keyof typeof colors]}`}>
        {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-theme-secondary">
            <span className="text-theme-primary font-medium">{expediente.tareas.filter(t => t.estado === 'completada').length}</span> de {expediente.tareas.length} completadas
          </div>
          <div className="h-2 w-24 bg-theme-tertiary rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${expediente.tareas.length > 0 ? (expediente.tareas.filter(t => t.estado === 'completada').length / expediente.tareas.length) * 100 : 0}%` }}
            />
          </div>
        </div>
        {permissions.canCreateTasks && (
          <button
            onClick={onNewTask}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-xl hover:bg-amber-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Tarea
          </button>
        )}
      </div>

      {expediente.tareas.length === 0 ? (
        <div className="text-center py-12 bg-theme-card border border-theme rounded-2xl">
          <CheckSquare className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
          <p className="text-theme-secondary">No hay tareas registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expediente.tareas.map(tarea => (
            <motion.div
              key={tarea.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 bg-theme-card border rounded-xl flex items-start gap-4 ${
                tarea.estado === 'completada' ? 'border-theme opacity-60' : 'border-theme'
              }`}
            >
              <button 
                onClick={() => onToggleTask(tarea.id)}
                className="mt-0.5 hover:scale-110 transition-transform"
              >
                {getStatusIcon(tarea.estado)}
              </button>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className={`text-sm font-medium ${tarea.estado === 'completada' ? 'text-theme-tertiary line-through' : 'text-theme-primary'}`}>
                      {tarea.titulo}
                    </h4>
                    <p className="text-sm text-theme-secondary mt-1">{tarea.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(tarea.prioridad)}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-theme-tertiary">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Límite: {tarea.fechaLimite}
                  </span>
                  <span>•</span>
                  <span>Asignado a: {tarea.asignadoA}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function AudienciasTab({ expediente }: { expediente: ExpedienteDetail }) {
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'audiencia': return <Gavel className="w-4 h-4" />;
      case 'mediacion': return <Users className="w-4 h-4" />;
      case 'declaracion': return <FileText className="w-4 h-4" />;
      case 'vista': return <Eye className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'programada':
        return <span className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-400 rounded-full">Programada</span>;
      case 'realizada':
        return <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 rounded-full">Realizada</span>;
      case 'cancelada':
        return <span className="px-2 py-0.5 text-xs bg-red-500/10 text-red-400 rounded-full">Cancelada</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {expediente.audiencias.length === 0 ? (
        <div className="text-center py-12 bg-theme-card border border-theme rounded-2xl">
          <Calendar className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
          <p className="text-theme-secondary">No hay audiencias programadas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expediente.audiencias.map(audiencia => (
            <motion.div
              key={audiencia.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-theme-card border border-theme rounded-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                    {getTipoIcon(audiencia.tipo)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-theme-primary">{audiencia.titulo}</h4>
                    <p className="text-xs text-theme-tertiary capitalize">{audiencia.tipo}</p>
                  </div>
                </div>
                {getEstadoBadge(audiencia.estado)}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-theme-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>{audiencia.fecha} a las {audiencia.hora}</span>
                </div>
                <div className="flex items-center gap-2 text-theme-secondary">
                  <MapPin className="w-4 h-4" />
                  <span>{audiencia.lugar}</span>
                </div>
              </div>

              {audiencia.notas && (
                <div className="mt-4 p-3 bg-theme-tertiary/50 rounded-lg">
                  <p className="text-xs text-theme-secondary">
                    <span className="text-theme-tertiary">Notas:</span> {audiencia.notas}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotasTab({ 
  expediente, 
  permissions,
  onNewNote
}: { 
  expediente: ExpedienteDetail; 
  permissions: any;
  onNewNote: () => void;
}) {
  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      general: 'text-theme-secondary bg-theme-tertiary',
      estrategia: 'text-purple-400 bg-purple-500/10',
      cliente: 'text-blue-400 bg-blue-500/10',
      interna: 'text-amber-400 bg-amber-500/10'
    };
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full ${colors[tipo] || colors.general}`}>
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-theme-secondary">
          {expediente.notas.length} notas registradas
        </span>
        {permissions.canAddNotes && (
          <button
            onClick={onNewNote}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-xl hover:bg-amber-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Nota
          </button>
        )}
      </div>

      {expediente.notas.length === 0 ? (
        <div className="text-center py-12 bg-theme-card border border-theme rounded-2xl">
          <MessageSquare className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
          <p className="text-theme-secondary">No hay notas registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expediente.notas.map(nota => (
            <motion.div
              key={nota.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-theme-card border border-theme rounded-2xl"
            >
              <div className="flex items-start justify-between mb-3">
                {getTipoBadge(nota.tipo)}
                <span className="text-xs text-theme-tertiary">{nota.fecha}</span>
              </div>
              <p className="text-sm text-theme-secondary leading-relaxed">{nota.contenido}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-theme-tertiary">
                <User className="w-3 h-3" />
                <span>{nota.autor}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function FinanzasTab({ expediente }: { expediente: ExpedienteDetail }) {
  const finanzas = expediente.finanzas;
  
  const importeTotal = parseFloat(finanzas.importeTotal.replace(/[^0-9.]/g, ''));
  const gastos = parseFloat(finanzas.gastos.replace(/[^0-9.]/g, ''));
  const facturado = parseFloat(finanzas.facturado.replace(/[^0-9.]/g, ''));
  const cobrado = parseFloat(finanzas.cobrado.replace(/[^0-9.]/g, ''));
  const pendiente = parseFloat(finanzas.pendienteCobro.replace(/[^0-9.]/g, ''));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center gap-2 text-theme-secondary mb-2">
              <Wallet className="w-4 h-4" />
              <span className="text-xs">Importe Total</span>
            </div>
            <p className="text-lg font-bold text-theme-primary">{finanzas.importeTotal}</p>
          </div>
          <div className="p-4 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center gap-2 text-theme-secondary mb-2">
              <Receipt className="w-4 h-4" />
              <span className="text-xs">Gastos</span>
            </div>
            <p className="text-lg font-bold text-red-400">{finanzas.gastos}</p>
          </div>
          <div className="p-4 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center gap-2 text-theme-secondary mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Cobrado</span>
            </div>
            <p className="text-lg font-bold text-emerald-400">{finanzas.cobrado}</p>
          </div>
          <div className="p-4 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center gap-2 text-theme-secondary mb-2">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs">Pendiente</span>
            </div>
            <p className="text-lg font-bold text-amber-400">{finanzas.pendienteCobro}</p>
          </div>
        </div>

        <div className="bg-theme-card border border-theme rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-6">Desglose Financiero</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-theme-tertiary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-theme-primary">Facturado</p>
                  <p className="text-xs text-theme-secondary">Total emitido en facturas</p>
                </div>
              </div>
              <span className="text-lg font-bold text-theme-primary">{finanzas.facturado}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-theme-tertiary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-theme-primary">Cobrado</p>
                  <p className="text-xs text-theme-secondary">Pagos recibidos</p>
                </div>
              </div>
              <span className="text-lg font-bold text-emerald-400">{finanzas.cobrado}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-theme-tertiary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-theme-primary">Pendiente de Cobro</p>
                  <p className="text-xs text-theme-secondary">Facturas pendientes de pago</p>
                </div>
              </div>
              <span className="text-lg font-bold text-amber-400">{finanzas.pendienteCobro}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-theme-tertiary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-theme-primary">Gastos</p>
                  <p className="text-xs text-theme-secondary">Gastos asociados al caso</p>
                </div>
              </div>
              <span className="text-lg font-bold text-red-400">{finanzas.gastos}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-theme-card border border-theme rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-4">Estado de Cobro</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-theme-secondary">% Cobrado</span>
                <span className="text-sm font-medium text-theme-primary">
                  {facturado > 0 ? Math.round((cobrado / facturado) * 100) : 0}%
                </span>
              </div>
              <div className="h-2 bg-theme-tertiary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${facturado > 0 ? (cobrado / facturado) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-theme">
              <div className="flex items-center justify-between">
                <span className="text-sm text-theme-secondary">Rentabilidad estimada</span>
                <span className={`text-sm font-medium ${
                  (importeTotal - gastos) > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {finanzas.moneda === 'EUR' ? '€' : '$'}
                  {(importeTotal - gastos).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-theme-card border border-theme rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-4">Información</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-theme-secondary">Moneda</span>
              <span className="text-theme-primary">{finanzas.moneda}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-theme-secondary">Estado</span>
              <span className={`${pendiente > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {pendiente > 0 ? 'Pendientes de cobro' : 'Al día'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}
