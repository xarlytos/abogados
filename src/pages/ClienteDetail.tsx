import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, User, Building2, Mail, Phone, MapPin, Calendar,
  FileText, FolderOpen, Clock, CheckCircle2, AlertCircle,
  Download, Upload, Edit2, MoreVertical, X,
  Euro, TrendingUp, TrendingDown, Wallet, Receipt, History,
  Users, Tag, Star, Copy, Share2,
  Archive, MessageSquare, PhoneCall, Video,
  Eye, ChevronRight
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRole } from '@/hooks/useRole';
import {
  getClienteById,
  getStatusColor,
  getStatusText,
  getExpedienteColor,
  getActividadColor,
  getFacturaEstadoColor,
  type ClienteDetail
} from '@/data/clientesDetailData';

// ============================================
// TIPOS Y CONSTANTES
// ============================================

type TabType = 'general' | 'expedientes' | 'documentos' | 'facturas' | 'actividad' | 'contactos';

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

const CategoryBadge = ({ categoria }: { categoria: string }) => {
  const colors: Record<string, string> = {
    'VIP': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Corporativo': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Estándar': 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${colors[categoria] || colors['Estándar']}`}>
      {categoria}
    </span>
  );
};

const InfoCard = ({ icon: Icon, label, value, subvalue, onClick }: { 
  icon: any; 
  label: string; 
  value: string; 
  subvalue?: string;
  onClick?: () => void;
}) => (
  <div 
    className={`p-4 bg-theme-tertiary/50 rounded-xl ${onClick ? 'cursor-pointer hover:bg-theme-hover transition-colors' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-2 text-theme-secondary mb-2">
      <Icon className="w-4 h-4" />
      <span className="text-xs">{label}</span>
    </div>
    <p className="text-sm font-medium text-theme-primary">{value}</p>
    {subvalue && <p className="text-xs text-theme-tertiary mt-1">{subvalue}</p>}
  </div>
);

const StatCard = ({ icon: Icon, label, value, color, trend }: {
  icon: any;
  label: string;
  value: string;
  color: 'blue' | 'emerald' | 'amber' | 'purple' | 'red';
  trend?: 'up' | 'down';
}) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/20 text-purple-400',
    red: 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="p-5 bg-theme-card/60 border border-theme rounded-2xl hover:border-amber-500/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-theme-primary mb-0.5">{value}</h3>
      <p className="text-theme-secondary text-sm">{label}</p>
    </div>
  );
};

const ExpedienteIcon = ({ tipo }: { tipo: string }) => {
  const colorClass = getExpedienteColor(tipo);
  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${colorClass}`}>
      {tipo.slice(0, 2).toUpperCase()}
    </div>
  );
};

const ActividadIcon = ({ tipo }: { tipo: string }) => {
  const colorClass = getActividadColor(tipo);
  const icons: Record<string, React.ReactNode> = {
    llamada: <PhoneCall className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    reunion: <Users className="w-4 h-4" />,
    documento: <FileText className="w-4 h-4" />,
    expediente: <FolderOpen className="w-4 h-4" />,
    pago: <Euro className="w-4 h-4" />
  };
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
      {icons[tipo] || <Clock className="w-4 h-4" />}
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ClienteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role, roleConfig } = useRole();
  
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [cliente, setCliente] = useState<ClienteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  
  // Formularios
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newDocName, setNewDocName] = useState('');
  
  // Edición
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notas: '',
    categoria: ''
  });

  const optionsRef = useRef<HTMLDivElement>(null);

  // Cargar cliente
  useEffect(() => {
    if (id) {
      const data = getClienteById(id);
      if (data) {
        setCliente(data);
        setEditData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          notas: data.notas,
          categoria: data.categoria
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
  const handleCopyEmail = () => {
    if (cliente?.email) {
      navigator.clipboard.writeText(cliente.email);
      showToast('Email copiado al portapapeles', 'success');
    }
  };

  const handleCopyPhone = () => {
    if (cliente?.phone) {
      navigator.clipboard.writeText(cliente.phone);
      showToast('Teléfono copiado al portapapeles', 'success');
    }
  };

  const handleSendEmail = () => {
    if (cliente?.email) {
      window.location.href = `mailto:${cliente.email}`;
    }
  };

  const handleCall = () => {
    if (cliente?.phone) {
      window.location.href = `tel:${cliente.phone}`;
    }
  };

  const handleSaveEdit = () => {
    setCliente(prev => prev ? {
      ...prev,
      name: editData.name,
      email: editData.email,
      phone: editData.phone,
      address: editData.address,
      notas: editData.notas,
      categoria: editData.categoria
    } : null);
    setShowEditModal(false);
    showToast('Cliente actualizado correctamente', 'success');
  };

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      showToast('La nota no puede estar vacía', 'error');
      return;
    }
    setNewNoteContent('');
    setShowContactModal(false);
    showToast('Nota guardada correctamente', 'success');
  };

  const handleAddDocument = () => {
    if (!newDocName.trim()) {
      showToast('El nombre del documento es obligatorio', 'error');
      return;
    }
    setNewDocName('');
    setShowNewDocModal(false);
    showToast('Documento subido correctamente', 'success');
  };

  const handleViewExpediente = (expId: string) => {
    navigate(`/expedientes/${expId}`);
  };

  const handleExportPDF = () => {
    showToast('Generando PDF del cliente...', 'info');
    setTimeout(() => {
      showToast('PDF descargado', 'success');
    }, 1500);
    setShowOptionsDropdown(false);
  };

  const handleShare = () => {
    showToast('Enlace copiado al portapapeles', 'success');
    setShowOptionsDropdown(false);
  };

  // Permisos según rol
  const permissions = {
    canEdit: role === 'super_admin' || role === 'socio' || role === 'administrador' || role === 'abogado_senior' || role === 'abogado_junior',
    canDelete: role === 'super_admin' || role === 'socio',
    canUploadDocs: role !== 'contador' && role !== 'recepcionista',
    canViewFinancialData: roleConfig.permissions.canViewFinancialData,
    canViewAllExpedientes: role === 'super_admin' || role === 'socio' || role === 'administrador'
  };

  if (!loading && !cliente) {
    return (
      <AppLayout title="Cliente no encontrado" subtitle="">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-theme-tertiary rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-theme-tertiary" />
            </div>
            <h2 className="text-2xl font-bold text-theme-primary mb-2">Cliente no encontrado</h2>
            <p className="text-theme-secondary mb-6">El cliente {id} no existe o no tienes acceso.</p>
            <button
              onClick={() => navigate('/clientes')}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-xl hover:bg-amber-400 transition-colors"
            >
              Volver a Clientes
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
    { id: 'general', label: 'General', icon: User },
    { id: 'expedientes', label: 'Expedientes', icon: FolderOpen, count: cliente?.expedientes.length },
    { id: 'documentos', label: 'Documentos', icon: FileText, count: cliente?.documentos.length },
    ...(permissions.canViewFinancialData ? [{ id: 'facturas' as TabType, label: 'Facturas', icon: Receipt, count: cliente?.facturas.length }] : []),
    { id: 'actividad', label: 'Actividad', icon: History, count: cliente?.actividades.length },
    ...(cliente?.type === 'Empresa' && cliente?.contactos ? [{ id: 'contactos' as TabType, label: 'Contactos', icon: Users, count: cliente.contactos.length }] : [])
  ];

  return (
    <AppLayout
      title={cliente?.name || ''}
      subtitle={cliente?.id}
      headerActions={
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/clientes')}
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
                  'bg-theme-card text-theme-primary border border-theme'
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
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-theme-tertiary to-theme-hover rounded-xl flex items-center justify-center border border-theme">
                  {cliente!.type === 'Empresa' ? (
                    <Building2 className="w-8 h-8 text-theme-primary" />
                  ) : (
                    <User className="w-8 h-8 text-theme-primary" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <StatusBadge status={cliente!.status} />
                    <CategoryBadge categoria={cliente!.categoria} />
                    <span className="px-3 py-1 text-xs font-medium rounded-full border border-theme text-theme-secondary">
                      {cliente!.type}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-theme-primary mb-1">{cliente!.name}</h1>
                  <p className="text-theme-secondary text-sm">{cliente!.id} • NIF: {cliente!.nif}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSendEmail}
                  className="flex items-center gap-2 px-4 py-2 bg-theme-tertiary hover:bg-theme-hover text-theme-primary rounded-xl transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Email</span>
                </button>
                <button
                  onClick={handleCall}
                  className="flex items-center gap-2 px-4 py-2 bg-theme-tertiary hover:bg-theme-hover text-theme-primary rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Llamar</span>
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-theme-tertiary hover:bg-theme-hover text-theme-primary rounded-xl transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Nota</span>
                </button>
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
                          onClick={handleCopyEmail}
                          className="w-full px-4 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copiar email
                        </button>
                        <button
                          onClick={handleCopyPhone}
                          className="w-full px-4 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copiar teléfono
                        </button>
                        <button
                          onClick={handleShare}
                          className="w-full px-4 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4" />
                          Compartir
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
                            onClick={() => {
                              setShowOptionsDropdown(false);
                              showToast('Función de archivo en desarrollo', 'info');
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-amber-400 hover:bg-theme-tertiary flex items-center gap-2"
                          >
                            <Archive className="w-4 h-4" />
                            Archivar cliente
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={FolderOpen}
              label="Expedientes"
              value={cliente!.stats.totalExpedientes.toString()}
              color="blue"
            />
            <StatCard
              icon={Clock}
              label="Activos"
              value={cliente!.stats.expedientesActivos.toString()}
              color="amber"
            />
            {permissions.canViewFinancialData && (
              <>
                <StatCard
                  icon={Euro}
                  label="Total Facturado"
                  value={cliente!.stats.totalFacturado}
                  color="emerald"
                  trend="up"
                />
                <StatCard
                  icon={Wallet}
                  label="Pendiente Cobro"
                  value={cliente!.stats.pendienteCobro}
                  color="red"
                />
              </>
            )}
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
            {activeTab === 'general' && <GeneralTab cliente={cliente!} permissions={permissions} />}
            {activeTab === 'expedientes' && (
              <ExpedientesTab 
                cliente={cliente!} 
                onViewExpediente={handleViewExpediente}
              />
            )}
            {activeTab === 'documentos' && (
              <DocumentosTab 
                cliente={cliente!} 
                permissions={permissions}
                onUpload={() => setShowNewDocModal(true)}
              />
            )}
            {activeTab === 'facturas' && permissions.canViewFinancialData && <FacturasTab cliente={cliente!} />}
            {activeTab === 'actividad' && <ActividadTab cliente={cliente!} />}
            {activeTab === 'contactos' && cliente!.type === 'Empresa' && <ContactosTab cliente={cliente!} />}
          </div>
        </motion.div>
      </main>

      {/* MODALES */}

      {/* Modal Editar Cliente */}
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
              className="bg-theme-secondary border border-theme rounded-2xl w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-theme flex items-center justify-between">
                <h3 className="text-lg font-semibold text-theme-primary">Editar Cliente</h3>
                <button onClick={() => setShowEditModal(false)} className="text-theme-tertiary hover:text-theme-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Nombre</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-theme-secondary mb-2">Email</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-theme-secondary mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Dirección</label>
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Categoría</label>
                  <select
                    value={editData.categoria}
                    onChange={(e) => setEditData({...editData, categoria: e.target.value})}
                    className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500"
                  >
                    <option value="Estándar">Estándar</option>
                    <option value="Corporativo">Corporativo</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Notas</label>
                  <textarea
                    value={editData.notas}
                    onChange={(e) => setEditData({...editData, notas: e.target.value})}
                    className="w-full h-24 bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary focus:outline-none focus:border-amber-500 resize-none"
                  />
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

      {/* Modal Nueva Nota */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-theme-secondary border border-theme rounded-2xl w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-theme flex items-center justify-between">
                <h3 className="text-lg font-semibold text-theme-primary">Nueva Nota</h3>
                <button onClick={() => setShowContactModal(false)} className="text-theme-tertiary hover:text-theme-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Escribe tu nota aquí..."
                  className="w-full h-32 bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500 resize-none"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowContactModal(false)}
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

      {/* Modal Subir Documento */}
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
              className="bg-theme-secondary border border-theme rounded-2xl w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-theme flex items-center justify-between">
                <h3 className="text-lg font-semibold text-theme-primary">Subir Documento</h3>
                <button onClick={() => setShowNewDocModal(false)} className="text-theme-tertiary hover:text-theme-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Nombre del documento</label>
                  <input
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="Ej: Contrato, DNI, etc."
                    className="w-full bg-theme-tertiary border border-theme rounded-xl p-3 text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500"
                  />
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
    </AppLayout>
  );
}

// ============================================
// TABS
// ============================================

function GeneralTab({ cliente, permissions }: { cliente: ClienteDetail; permissions: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-theme-card border border-theme rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard icon={Mail} label="Email" value={cliente.email} />
            <InfoCard icon={Phone} label="Teléfono" value={cliente.phone} />
            <InfoCard icon={MapPin} label="Dirección" value={cliente.address} />
            <InfoCard icon={Calendar} label="Cliente desde" value={cliente.joinDate} />
          </div>
        </div>

        <div className="bg-theme-card border border-theme rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-500" />
            Información Adicional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard icon={Building2} label="Tipo" value={cliente.type} />
            <InfoCard icon={Star} label="Categoría" value={cliente.categoria} />
            <InfoCard icon={Users} label="Referido por" value={cliente.referidoPor} />
            <InfoCard icon={Clock} label="Última actividad" value={cliente.lastActivity} />
          </div>
        </div>

        <div className="bg-theme-card border border-theme rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-500" />
            Notas
          </h3>
          <p className="text-theme-secondary leading-relaxed">{cliente.notas}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-theme-card border border-theme rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-4">Resumen</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-secondary">Expedientes totales</span>
              <span className="text-sm font-medium text-theme-primary">{cliente.stats.totalExpedientes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-secondary">Expedientes activos</span>
              <span className="text-sm font-medium text-amber-400">{cliente.stats.expedientesActivos}</span>
            </div>
            {permissions.canViewFinancialData && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-theme-secondary">Total facturado</span>
                  <span className="text-sm font-medium text-emerald-400">{cliente.stats.totalFacturado}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-theme-secondary">Pendiente de cobro</span>
                  <span className="text-sm font-medium text-red-400">{cliente.stats.pendienteCobro}</span>
                </div>
              </>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-secondary">Documentos</span>
              <span className="text-sm font-medium text-theme-primary">{cliente.documentos.length}</span>
            </div>
          </div>
        </div>

        {cliente.stats.proximaAudiencia && (
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-theme-primary mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              Próxima Audiencia
            </h3>
            <p className="text-2xl font-bold text-amber-400">{cliente.stats.proximaAudiencia}</p>
            <p className="text-sm text-theme-secondary mt-2">Recuerda preparar la documentación necesaria</p>
          </div>
        )}

        <div className="bg-theme-card border border-theme rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-4">Acciones Rápidas</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 bg-theme-tertiary hover:bg-theme-hover rounded-xl transition-colors text-left">
              <Mail className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-theme-primary">Enviar email</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-theme-tertiary hover:bg-theme-hover rounded-xl transition-colors text-left">
              <PhoneCall className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-theme-primary">Registrar llamada</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-theme-tertiary hover:bg-theme-hover rounded-xl transition-colors text-left">
              <Video className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-theme-primary">Programar videollamada</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpedientesTab({ cliente, onViewExpediente }: { 
  cliente: ClienteDetail; 
  onViewExpediente: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {cliente.expedientes.length === 0 ? (
        <div className="text-center py-12 bg-theme-card border border-theme rounded-2xl">
          <FolderOpen className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
          <p className="text-theme-secondary">No hay expedientes asociados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cliente.expedientes.map(exp => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-theme-card border border-theme rounded-2xl hover:border-amber-500/30 transition-all cursor-pointer group"
              onClick={() => onViewExpediente(exp.id)}
            >
              <div className="flex items-start gap-4">
                <ExpedienteIcon tipo={exp.tipo} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-theme-primary group-hover:text-amber-500 transition-colors">
                      {exp.titulo}
                    </h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(exp.estado)}`}>
                      {getStatusText(exp.estado)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-theme-tertiary">
                    <span>{exp.id}</span>
                    <span>•</span>
                    <span>{exp.fechaInicio}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-theme-secondary">{exp.tipo}</span>
                    <span className="text-sm font-medium text-emerald-400">{exp.valorEstimado}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-theme-tertiary group-hover:text-amber-500 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentosTab({ cliente, permissions, onUpload }: {
  cliente: ClienteDetail;
  permissions: any;
  onUpload: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-theme-secondary">
          {cliente.documentos.length} documentos
        </span>
        {permissions.canUploadDocs && (
          <button
            onClick={onUpload}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-xl hover:bg-amber-400 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Subir
          </button>
        )}
      </div>

      {cliente.documentos.length === 0 ? (
        <div className="text-center py-12 bg-theme-card border border-theme rounded-2xl">
          <FileText className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
          <p className="text-theme-secondary">No hay documentos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cliente.documentos.map(doc => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-theme-card border border-theme rounded-xl hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-theme-primary truncate">{doc.nombre}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-theme-tertiary">
                    <span>{doc.tamaño}</span>
                    <span>•</span>
                    <span>{doc.fecha}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-theme-tertiary hover:bg-theme-hover text-theme-secondary rounded-lg transition-colors">
                  <Eye className="w-3 h-3" />
                  Ver
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-theme-tertiary hover:bg-theme-hover text-theme-secondary rounded-lg transition-colors">
                  <Download className="w-3 h-3" />
                  Descargar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function FacturasTab({ cliente }: { cliente: ClienteDetail }) {
  const totalFacturado = cliente.facturas.reduce((sum, f) => {
    const value = parseFloat(f.importe.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const pendiente = cliente.facturas
    .filter(f => f.estado === 'pendiente')
    .reduce((sum, f) => {
      const value = parseFloat(f.importe.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-theme-card border border-theme rounded-xl">
          <div className="flex items-center gap-2 text-theme-secondary mb-2">
            <Receipt className="w-4 h-4" />
            <span className="text-xs">Total Facturado</span>
          </div>
          <p className="text-xl font-bold text-theme-primary">€{totalFacturado.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-theme-card border border-theme rounded-xl">
          <div className="flex items-center gap-2 text-theme-secondary mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">Cobrado</span>
          </div>
          <p className="text-xl font-bold text-emerald-400">€{(totalFacturado - pendiente).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-theme-card border border-theme rounded-xl">
          <div className="flex items-center gap-2 text-theme-secondary mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Pendiente</span>
          </div>
          <p className="text-xl font-bold text-amber-400">€{pendiente.toLocaleString()}</p>
        </div>
      </div>

      {cliente.facturas.length === 0 ? (
        <div className="text-center py-12 bg-theme-card border border-theme rounded-2xl">
          <Receipt className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
          <p className="text-theme-secondary">No hay facturas</p>
        </div>
      ) : (
        <div className="bg-theme-card border border-theme rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-theme-tertiary/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-theme-secondary">Número</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-theme-secondary">Concepto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-theme-secondary">Fecha</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-theme-secondary">Importe</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-theme-secondary">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {cliente.facturas.map(factura => (
                <tr key={factura.id} className="hover:bg-theme-hover transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-theme-primary">{factura.numero}</td>
                  <td className="px-4 py-3 text-sm text-theme-secondary">{factura.concepto}</td>
                  <td className="px-4 py-3 text-sm text-theme-secondary">{factura.fecha}</td>
                  <td className="px-4 py-3 text-sm font-medium text-theme-primary text-right">{factura.importe}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getFacturaEstadoColor(factura.estado)}`}>
                      {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ActividadTab({ cliente }: { cliente: ClienteDetail }) {
  return (
    <div className="space-y-4">
      {cliente.actividades.length === 0 ? (
        <div className="text-center py-12 bg-theme-card border border-theme rounded-2xl">
          <History className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
          <p className="text-theme-secondary">No hay actividades registradas</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-theme" />
          
          <div className="space-y-4">
            {cliente.actividades.map((act, index) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-12"
              >
                <div className="absolute left-0 top-0">
                  <ActividadIcon tipo={act.tipo} />
                </div>
                <div className="p-4 bg-theme-card border border-theme rounded-xl">
                  <p className="text-sm text-theme-primary">{act.descripcion}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-theme-tertiary">
                    <span>{act.fecha}</span>
                    <span>•</span>
                    <span>{act.autor}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContactosTab({ cliente }: { cliente: ClienteDetail }) {
  const contactos = cliente.contactos || [];

  return (
    <div className="space-y-4">
      {contactos.length === 0 ? (
        <div className="text-center py-12 bg-theme-card border border-theme rounded-2xl">
          <Users className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
          <p className="text-theme-secondary">No hay contactos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactos.map(contacto => (
            <motion.div
              key={contacto.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-theme-card border border-theme rounded-2xl"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-theme-tertiary rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-theme-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-theme-primary">{contacto.nombre}</h4>
                    <p className="text-xs text-theme-secondary">{contacto.cargo}</p>
                  </div>
                </div>
                {contacto.esPrincipal && (
                  <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full">
                    Principal
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-theme-secondary">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${contacto.email}`} className="hover:text-amber-500 transition-colors">
                    {contacto.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-theme-secondary">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${contacto.telefono}`} className="hover:text-amber-500 transition-colors">
                    {contacto.telefono}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-theme-tertiary hover:bg-theme-hover text-theme-secondary rounded-lg transition-colors">
                  <Mail className="w-3 h-3" />
                  Email
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-theme-tertiary hover:bg-theme-hover text-theme-secondary rounded-lg transition-colors">
                  <Phone className="w-3 h-3" />
                  Llamar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}