import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Filter, Download, Mail, Phone, MapPin, Eye, MoreVertical, 
  Users, Building2, CheckCircle2, Euro, FileText, PhoneCall, 
  Calendar, Crown, ClipboardList, UserCircle,
  AlertCircle, Search, X, Edit2, Trash2, Tag,
  FileUp, History, ChevronRight, Clock, LayoutGrid, List,
  ChevronLeft
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { clientesData, getStatusColor, getStatusText } from '@/data/clientesData';

interface Cliente {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  cases: number;
  totalBilled: string;
  lastActivity: string;
  address: string;
  joinDate: string;
}
import { useRole } from '@/hooks/useRole';
import type { UserRole } from '@/types/roles';

// ============================================
// DATOS SIMULADOS POR ROL
// ============================================

// Clientes filtrados según el rol
const getClientesPorRol = (role: UserRole): Cliente[] => {
  switch (role) {
    case 'super_admin':
    case 'socio':
    case 'administrador':
      // Acceso completo a todos los clientes
      return clientesData;
    
    case 'abogado_senior':
      // Clientes de sus casos (simulado: los primeros 8)
      return clientesData.slice(0, 8).map(c => ({
        ...c,
        cases: Math.floor(Math.random() * 5) + 1
      }));
    
    case 'abogado_junior':
      // Clientes de sus casos asignados (simulado: algunos clientes)
      return clientesData.slice(2, 6).map(c => ({
        ...c,
        cases: Math.floor(Math.random() * 3) + 1
      }));
    
    case 'paralegal':
      // Clientes de casos donde colabora (simulado)
      return clientesData.filter((_, idx) => idx % 2 === 0).slice(0, 4);
    
    case 'secretario':
    case 'recepcionista':
      // Información básica de todos los clientes (sin datos financieros se maneja en la UI)
      return clientesData;
    
    case 'contador':
      // Sin acceso según PAGINAS_POR_ROL.md
      return [];
    
    default:
      return clientesData;
  }
};

// Configuración de vistas por rol
const getConfigPorRol = (role: UserRole) => {
  const configs: Record<UserRole, {
    title: string;
    subtitle: string;
    puedeCrear: boolean;
    puedeEditar: boolean;
    puedeEliminar: boolean;
    puedeExportar: boolean;
    puedeVerFinanciero: boolean;
    puedeVerTodos: boolean;
    puedeFusionar: boolean;
    mensajeBienvenida: string;
    camposVisibles: ('email' | 'phone' | 'address' | 'cases' | 'billed' | 'status')[];
  }> = {
    super_admin: {
      title: 'Base de Datos de Clientes',
      subtitle: 'Gestión completa del directorio',
      puedeCrear: true,
      puedeEditar: true,
      puedeEliminar: true,
      puedeExportar: true,
      puedeVerFinanciero: true,
      puedeVerTodos: true,
      puedeFusionar: true,
      mensajeBienvenida: 'Acceso completo a todos los clientes y su información',
      camposVisibles: ['email', 'phone', 'address', 'cases', 'billed', 'status']
    },
    socio: {
      title: 'Directorio de Clientes',
      subtitle: 'Base de datos completa del bufete',
      puedeCrear: true,
      puedeEditar: true,
      puedeEliminar: true,
      puedeExportar: true,
      puedeVerFinanciero: true,
      puedeVerTodos: true,
      puedeFusionar: true,
      mensajeBienvenida: 'Gestión completa de la cartera de clientes',
      camposVisibles: ['email', 'phone', 'address', 'cases', 'billed', 'status']
    },
    administrador: {
      title: 'Gestión de Clientes',
      subtitle: 'Administración de la cartera',
      puedeCrear: true,
      puedeEditar: true,
      puedeEliminar: false,
      puedeExportar: true,
      puedeVerFinanciero: true,
      puedeVerTodos: true,
      puedeFusionar: false,
      mensajeBienvenida: 'Gestión administrativa de clientes y categorías',
      camposVisibles: ['email', 'phone', 'address', 'cases', 'billed', 'status']
    },
    abogado_senior: {
      title: 'Mis Clientes',
      subtitle: 'Clientes de tus casos',
      puedeCrear: true,
      puedeEditar: true,
      puedeEliminar: false,
      puedeExportar: false,
      puedeVerFinanciero: false,
      puedeVerTodos: false,
      puedeFusionar: false,
      mensajeBienvenida: 'Gestiona tus clientes y sus expedientes',
      camposVisibles: ['email', 'phone', 'address', 'cases', 'status']
    },
    abogado_junior: {
      title: 'Mis Clientes Asignados',
      subtitle: 'Clientes de tus casos',
      puedeCrear: false,
      puedeEditar: true, // Solo datos de contacto
      puedeEliminar: false,
      puedeExportar: false,
      puedeVerFinanciero: false,
      puedeVerTodos: false,
      puedeFusionar: false,
      mensajeBienvenida: 'Información de clientes asignados a tus casos',
      camposVisibles: ['email', 'phone', 'address', 'cases', 'status']
    },
    paralegal: {
      title: 'Clientes - Casos Asignados',
      subtitle: 'Información de contacto',
      puedeCrear: false,
      puedeEditar: false,
      puedeEliminar: false,
      puedeExportar: false,
      puedeVerFinanciero: false,
      puedeVerTodos: false,
      puedeFusionar: false,
      mensajeBienvenida: 'Clientes de los casos en los que colaboras',
      camposVisibles: ['email', 'phone', 'status']
    },
    secretario: {
      title: 'Directorio de Clientes',
      subtitle: 'Información de contacto',
      puedeCrear: true, // Clientes potenciales
      puedeEditar: true, // Datos de contacto
      puedeEliminar: false,
      puedeExportar: false,
      puedeVerFinanciero: false,
      puedeVerTodos: true,
      puedeFusionar: false,
      mensajeBienvenida: 'Gestión de contactos y registro de comunicaciones',
      camposVisibles: ['email', 'phone', 'address', 'status']
    },
    recepcionista: {
      title: 'Directorio de Clientes',
      subtitle: 'Información básica',
      puedeCrear: true, // Registro de visitas
      puedeEditar: true, // Actualizar contacto
      puedeEliminar: false,
      puedeExportar: false,
      puedeVerFinanciero: false,
      puedeVerTodos: true,
      puedeFusionar: false,
      mensajeBienvenida: 'Consulta de datos para atención al cliente',
      camposVisibles: ['email', 'phone', 'address', 'status']
    },
    contador: {
      title: 'Sin Acceso',
      subtitle: 'No tienes permisos para ver clientes',
      puedeCrear: false,
      puedeEditar: false,
      puedeEliminar: false,
      puedeExportar: false,
      puedeVerFinanciero: false,
      puedeVerTodos: false,
      puedeFusionar: false,
      mensajeBienvenida: 'Contacta al administrador si necesitas acceso',
      camposVisibles: []
    }
  };
  
  return configs[role] || configs.abogado_junior;
};

// Componente para acceso denegado
const AccesoDenegado = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
    <div className="w-24 h-24 bg-theme-tertiary rounded-full flex items-center justify-center mb-6">
      <UserCircle className="w-12 h-12 text-theme-tertiary" />
    </div>
    <h2 className="text-2xl font-bold text-theme-primary mb-2">Acceso Restringido</h2>
    <p className="text-theme-secondary text-center max-w-md">
      Tu rol no tiene permisos para acceder al directorio de clientes. 
      Si necesitas ver información de clientes, contacta a tu supervisor.
    </p>
  </div>
);

// Estadísticas por rol
const getStatsPorRol = (clientes: Cliente[], role: UserRole, config: ReturnType<typeof getConfigPorRol>) => {
  type StatColor = 'blue' | 'emerald' | 'purple' | 'amber';
  
  const baseStats: Array<{ label: string; value: string | number; icon: typeof Users; color: StatColor }> = [
    { 
      label: role === 'abogado_senior' || role === 'abogado_junior' ? 'Mis Clientes' : 'Total Clientes', 
      value: clientes.length, 
      icon: Users, 
      color: 'blue'
    },
    { 
      label: 'Activos', 
      value: clientes.filter(c => c.status === 'active').length, 
      icon: CheckCircle2, 
      color: 'emerald'
    },
    { 
      label: 'Empresas', 
      value: clientes.filter(c => c.type === 'Empresa').length, 
      icon: Building2, 
      color: 'purple'
    },
  ];

  // Solo roles con acceso financiero ven la facturación
  if (config.puedeVerFinanciero) {
    const totalFacturado = clientes.reduce((sum, c) => {
      const value = parseFloat(c.totalBilled.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    
    baseStats.push({
      label: 'Facturación Total',
      value: `€${totalFacturado.toFixed(1)}K`,
      icon: Euro,
      color: 'amber'
    });
  } else if (role === 'abogado_senior' || role === 'abogado_junior') {
    // Abogados ven cantidad de expedientes en lugar de facturación
    const totalCases = clientes.reduce((sum, c) => sum + c.cases, 0);
    baseStats.push({
      label: 'Total Expedientes',
      value: totalCases.toString(),
      icon: FileText,
      color: 'amber'
    });
  } else if (role === 'secretario' || role === 'recepcionista') {
    // Secretarios ven contactos recientes
    baseStats.push({
      label: 'Contactos Hoy',
      value: '12',
      icon: PhoneCall,
      color: 'amber'
    });
  }

  return baseStats;
};

// ============================================
// COMPONENTES DE MODALES
// ============================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-theme-secondary border border-theme rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
            <h3 className="text-lg font-semibold text-theme-primary">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 text-theme-tertiary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function Clientes() {
  const { role, roleConfig } = useRole();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [detailTab, setDetailTab] = useState<'info' | 'expedientes' | 'actividad' | 'facturacion'>('info');
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 12;
  
  // Estados para modales
  const [modalNuevoCliente, setModalNuevoCliente] = useState(false);
  const [modalVerDetalle, setModalVerDetalle] = useState<Cliente | null>(null);
  const [modalEditar, setModalEditar] = useState<Cliente | null>(null);
  const [modalEliminar, setModalEliminar] = useState<Cliente | null>(null);
  const [modalLlamada, setModalLlamada] = useState<Cliente | null>(null);
  const [modalCita, setModalCita] = useState<Cliente | null>(null);
  const [modalFusionar, setModalFusionar] = useState(false);
  const [modalExportar, setModalExportar] = useState(false);
  const [modalCategorias, setModalCategorias] = useState(false);
  const [modalBajas, setModalBajas] = useState(false);
  const [modalMasOpciones, setModalMasOpciones] = useState<Cliente | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Obtener configuración según el rol
  const config = useMemo(() => getConfigPorRol(role), [role]);
  
  // Obtener clientes según el rol
  const clientesDelRol = useMemo(() => getClientesPorRol(role), [role]);

  // Filtrar clientes según búsqueda y filtros
  const filteredClientes = useMemo(() => {
    return clientesDelRol.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           client.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      const matchesType = typeFilter === 'all' || client.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || 
        (categoryFilter === 'vip' && client.name.includes('Corp')) ||
        (categoryFilter === 'empresa' && client.type === 'Empresa') ||
        (categoryFilter === 'particular' && client.type === 'Particular');
      return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });
  }, [clientesDelRol, searchQuery, statusFilter, typeFilter, categoryFilter]);

  // Clientes paginados
  const paginatedClientes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClientes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClientes, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  // Handlers para selección múltiple
  const toggleSelectClient = (id: string) => {
    const newSelected = new Set(selectedClients);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedClients(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedClients.size === paginatedClientes.length) {
      setSelectedClients(new Set());
    } else {
      setSelectedClients(new Set(paginatedClientes.map(c => c.id)));
    }
  };

  // Estadísticas según rol
  const stats = useMemo(() => getStatsPorRol(clientesDelRol, role, config), [clientesDelRol, role, config]);

  // Mostrar toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers
  const handleEnviarEmail = (cliente: Cliente) => {
    window.location.href = `mailto:${cliente.email}?subject=Contacto desde el Bufete&body=Estimado/a ${cliente.name},`;
  };

  const handleExportar = (formato: 'csv' | 'excel' | 'pdf') => {
    showToast(`Exportando base de datos en formato ${formato.toUpperCase()}...`);
    setModalExportar(false);
    // Simulación de exportación
    setTimeout(() => {
      showToast(`¡Exportación completada! Archivo descargado.`);
    }, 2000);
  };

  const handleGuardarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(role === 'secretario' || role === 'recepcionista' ? 'Contacto registrado correctamente' : 'Cliente creado correctamente');
    setModalNuevoCliente(false);
  };

  const handleActualizarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Información actualizada correctamente');
    setModalEditar(null);
  };

  const handleEliminarCliente = () => {
    if (modalEliminar) {
      showToast(`Cliente ${modalEliminar.name} eliminado correctamente`);
      setModalEliminar(null);
    }
  };

  const handleRegistrarLlamada = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Llamada registrada correctamente');
    setModalLlamada(null);
  };

  const handleProgramarCita = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Cita programada correctamente');
    setModalCita(null);
  };

  // Si es contador, mostrar acceso denegado
  if (role === 'contador') {
    return (
      <AppLayout title={config.title} subtitle={config.subtitle}>
        <AccesoDenegado />
      </AppLayout>
    );
  }

  const headerActions = (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Selector de vista */}
      <div className="flex items-center gap-1 p-1 bg-theme-card border border-theme rounded-xl">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-amber-500 text-theme-primary shadow-lg shadow-amber-500/20' : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary'}`}
          title="Vista de cuadrícula"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-amber-500 text-theme-primary shadow-lg shadow-amber-500/20' : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary'}`}
          title="Vista de lista"
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {config.puedeCrear && (
        <button 
          onClick={() => setModalNuevoCliente(true)}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-500 text-theme-primary font-medium rounded-xl hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden lg:inline">
            {role === 'secretario' || role === 'recepcionista' ? 'Nuevo Contacto' : 'Nuevo Cliente'}
          </span>
        </button>
      )}
    </div>
  );

  return (
      <AppLayout 
        title={config.title}
        subtitle={`${filteredClientes.length} ${filteredClientes.length === 1 ? 'cliente' : 'clientes'}${currentPage > 1 ? ` • Página ${currentPage} de ${totalPages}` : ''}`}
        headerActions={headerActions}
      >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 px-6 py-3 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje de bienvenida según rol */}
      <div className={`mx-6 lg:mx-8 mb-4 p-4 rounded-xl border ${roleConfig.bgColor} ${roleConfig.textColor.replace('text-', 'border-').replace('400', '500/20')}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-slate-900/50`}>
            <Users className={`w-5 h-5 ${roleConfig.textColor}`} />
          </div>
          <div>
            <p className={`font-medium ${roleConfig.textColor}`}>{config.mensajeBienvenida}</p>
            <p className="text-sm text-slate-400">
              {role === 'super_admin' && 'Puedes crear, editar, eliminar y fusionar registros'}
              {role === 'socio' && 'Tienes acceso completo a la gestión de clientes'}
              {role === 'administrador' && 'Gestiona categorías y exporta listados'}
              {role === 'abogado_senior' && 'Puedes crear nuevos clientes y editar información'}
              {role === 'abogado_junior' && 'Puedes actualizar datos de contacto de tus clientes'}
              {role === 'paralegal' && 'Vista de solo lectura de información de contacto'}
              {role === 'secretario' && 'Registra comunicaciones y actualiza contactos'}
              {role === 'recepcionista' && 'Consulta información para atención al cliente'}
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Stats */}
        <div className={`grid gap-4 mb-6 ${stats.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 bg-theme-card/60 border border-theme rounded-2xl hover:border-amber-500/30 transition-all group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                stat.color === 'blue' ? 'bg-blue-500/20' :
                stat.color === 'emerald' ? 'bg-emerald-500/20' :
                stat.color === 'purple' ? 'bg-purple-500/20' :
                'bg-amber-500/20'
              }`}>
                <stat.icon className={`w-5 h-5 ${
                  stat.color === 'blue' ? 'text-blue-500' :
                  stat.color === 'emerald' ? 'text-emerald-500' :
                  stat.color === 'purple' ? 'text-purple-500' :
                  'text-amber-500'
                }`} />
              </div>
              <h3 className="text-2xl font-bold text-theme-primary mb-0.5">{stat.value}</h3>
              <p className="text-theme-secondary text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={
                  role === 'secretario' || role === 'recepcionista' 
                    ? "Buscar cliente por nombre o teléfono..."
                    : "Buscar por nombre, email o ID de cliente..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-theme-tertiary border border-theme rounded-xl text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500 transition-colors"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-tertiary" />
            </div>

            <div className="flex gap-3 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-theme-tertiary border border-theme rounded-xl text-theme-primary focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="pending">Pendientes</option>
                <option value="inactive">Inactivos</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 bg-theme-tertiary border border-theme rounded-xl text-theme-primary focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="all">Todos los tipos</option>
                <option value="Particular">Particulares</option>
                <option value="Empresa">Empresas</option>
              </select>

              <button 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`p-3 border rounded-xl transition-colors ${
                  showAdvancedFilters 
                    ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                    : 'bg-theme-tertiary border-theme text-theme-tertiary hover:text-theme-primary hover:border-amber-500'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>

              {config.puedeExportar && (
                <button 
                  onClick={() => setModalExportar(true)}
                  className="p-3 bg-theme-tertiary border border-theme rounded-xl text-theme-tertiary hover:text-theme-primary hover:border-amber-500 transition-colors" 
                  title="Exportar base de datos"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Panel de Filtros Avanzados */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-theme-card/60 border border-theme rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-theme-primary">Filtros Avanzados</h3>
                    <button 
                      onClick={() => {
                        setCategoryFilter('all');
                        setDateFromFilter('');
                        setDateToFilter('');
                      }}
                      className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-theme-secondary mb-1">Categoría</label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="all">Todas las categorías</option>
                        <option value="vip">VIP</option>
                        <option value="empresa">Empresas</option>
                        <option value="particular">Particulares</option>
                        <option value="potencial">Potenciales</option>
                        <option value="historico">Históricos</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-theme-secondary mb-1">Fecha desde</label>
                      <input
                        type="date"
                        value={dateFromFilter}
                        onChange={(e) => setDateFromFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-theme-secondary mb-1">Fecha hasta</label>
                      <input
                        type="date"
                        value={dateToFilter}
                        onChange={(e) => setDateToFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filters badges */}
          {(statusFilter !== 'all' || typeFilter !== 'all' || categoryFilter !== 'all') && (
            <div className="flex flex-wrap gap-2">
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-500">
                  {getStatusText(statusFilter)}
                  <button onClick={() => setStatusFilter('all')} className="hover:text-amber-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {typeFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-500">
                  {typeFilter}
                  <button onClick={() => setTypeFilter('all')} className="hover:text-blue-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {categoryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-500">
                  {categoryFilter}
                  <button onClick={() => setCategoryFilter('all')} className="hover:text-purple-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Skeleton Loading */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'overflow-x-auto'}>
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <div 
                key={i} 
                className={`bg-theme-card/60 border border-theme rounded-2xl p-5 ${viewMode === 'list' ? 'min-w-[800px]' : ''}`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-theme-tertiary rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-theme-tertiary rounded animate-pulse" />
                    <div className="h-3 w-20 bg-theme-tertiary rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-theme-tertiary rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-theme-tertiary rounded animate-pulse" />
                </div>
                <div className="pt-4 border-t border-theme flex justify-between">
                  <div className="h-8 w-16 bg-theme-tertiary rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-theme-tertiary rounded-lg animate-pulse" />
                    <div className="h-8 w-8 bg-theme-tertiary rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedClientes.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`relative p-5 bg-theme-card/60 border rounded-2xl transition-all group hover:border-amber-500/30 ${
                  client.status === 'active' ? 'border-emerald-500/20' :
                  client.status === 'pending' ? 'border-amber-500/20' :
                  'border-theme'
                }`}
              >
                {/* Selection checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSelectClient(client.id); }}
                    className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                      selectedClients.has(client.id)
                        ? 'bg-amber-500 border-amber-500'
                        : 'border-theme-tertiary hover:border-amber-500'
                    }`}
                  >
                    {selectedClients.has(client.id) && <CheckCircle2 className="w-3.5 h-3.5 text-theme-primary" />}
                  </button>
                </div>

                {/* Status indicator */}
                <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
                  client.status === 'active' ? 'bg-emerald-500' :
                  client.status === 'pending' ? 'bg-amber-500' :
                  'bg-slate-500'
                }`} title={getStatusText(client.status)} />

                <div className="flex items-start justify-between mb-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border ${
                      client.type === 'Empresa' 
                        ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400'
                        : 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400'
                    }`}>
                      {client.type === 'Empresa' ? <Building2 className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-theme-primary group-hover:text-amber-500 transition-colors line-clamp-1">{client.name}</h3>
                      <p className="text-sm text-theme-tertiary">{client.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {(config.camposVisibles.includes('email')) && (
                    <div className="flex items-center gap-2 text-sm text-theme-secondary">
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  
                  {(config.camposVisibles.includes('phone')) && (
                    <div className="flex items-center gap-2 text-sm text-theme-secondary">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  
                  {(config.camposVisibles.includes('address')) && (
                    <div className="flex items-center gap-2 text-sm text-theme-secondary">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-theme">
                  <div className="flex items-center gap-4">
                    {(config.camposVisibles.includes('cases')) && (
                      <div className="text-center">
                        <p className="text-lg font-bold text-theme-primary">{client.cases}</p>
                        <p className="text-xs text-theme-tertiary">Expedientes</p>
                      </div>
                    )}
                    
                    {(config.camposVisibles.includes('billed')) && config.puedeVerFinanciero && (
                      <div className="text-center">
                        <p className="text-lg font-bold text-emerald-500">{client.totalBilled}</p>
                        <p className="text-xs text-theme-tertiary">Facturado</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {(role === 'secretario' || role === 'recepcionista') && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setModalLlamada(client); }}
                        className="p-2 text-theme-tertiary hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="Registrar llamada"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button 
                      onClick={() => navigate(`/clientes/${client.id}`)}
                      className="p-2 text-theme-tertiary hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEnviarEmail(client); }}
                      className="p-2 text-theme-tertiary hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                      title="Enviar email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    
                    {(config.puedeEditar || config.puedeEliminar) && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setModalMasOpciones(client); }}
                        className="p-2 text-theme-tertiary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
                        title="Más opciones"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Vista de Lista */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-theme bg-theme-card/80">
                  <th className="py-4 px-4 w-12">
                    <button
                      onClick={toggleSelectAll}
                      className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                        selectedClients.size === paginatedClientes.length && paginatedClientes.length > 0
                          ? 'bg-amber-500 border-amber-500'
                          : 'border-theme-tertiary hover:border-amber-500'
                      }`}
                    >
                      {selectedClients.size === paginatedClientes.length && paginatedClientes.length > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-theme-primary" />}
                    </button>
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-theme-secondary uppercase">
                    Cliente
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-theme-secondary uppercase hidden md:table-cell">
                    Tipo
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-theme-secondary uppercase hidden lg:table-cell">
                    Contacto
                  </th>
                  {(config.camposVisibles.includes('cases')) && (
                    <th className="text-left py-4 px-4 text-xs font-medium text-theme-secondary uppercase">
                      Expedientes
                    </th>
                  )}
                  {(config.camposVisibles.includes('billed')) && config.puedeVerFinanciero && (
                    <th className="text-left py-4 px-4 text-xs font-medium text-theme-secondary uppercase hidden md:table-cell">
                      Facturado
                    </th>
                  )}
                  <th className="text-left py-4 px-4 text-xs font-medium text-theme-secondary uppercase">
                    Estado
                  </th>
                  <th className="text-right py-4 px-4 text-xs font-medium text-theme-secondary uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme">
                {paginatedClientes.map((client, index) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-theme-tertiary/30 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/clientes/${client.id}`)}
                  >
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleSelectClient(client.id)}
                        className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                          selectedClients.has(client.id)
                            ? 'bg-amber-500 border-amber-500'
                            : 'border-theme-tertiary hover:border-amber-500'
                        }`}
                      >
                        {selectedClients.has(client.id) && <CheckCircle2 className="w-3.5 h-3.5 text-theme-primary" />}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                          client.type === 'Empresa' 
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {client.type === 'Empresa' ? <Building2 className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-theme-primary group-hover:text-amber-500 transition-colors">{client.name}</p>
                          <p className="text-xs text-theme-tertiary">{client.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        client.type === 'Empresa' 
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {client.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <div className="space-y-1">
                        <p className="text-sm text-theme-secondary truncate max-w-[150px]">{client.email}</p>
                        <p className="text-xs text-theme-tertiary">{client.phone}</p>
                      </div>
                    </td>
                    {(config.camposVisibles.includes('cases')) && (
                      <td className="py-4 px-4">
                        <span className="text-lg font-bold text-theme-primary">{client.cases}</span>
                      </td>
                    )}
                    {(config.camposVisibles.includes('billed')) && config.puedeVerFinanciero && (
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-emerald-500 font-medium">{client.totalBilled}</span>
                      </td>
                    )}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
                        {getStatusText(client.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(role === 'secretario' || role === 'recepcionista') && (
                          <button 
                            onClick={() => setModalLlamada(client)}
                            className="p-2 text-theme-tertiary hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Registrar llamada"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleEnviarEmail(client)}
                          className="p-2 text-theme-tertiary hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="Enviar email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        {(config.puedeEditar || config.puedeEliminar) && (
                          <button 
                            onClick={() => setModalMasOpciones(client)}
                            className="p-2 text-theme-tertiary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
                            title="Más opciones"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-theme">
            <p className="text-sm text-theme-secondary">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredClientes.length)} de {filteredClientes.length} clientes
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-theme text-theme-secondary hover:text-theme-primary hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page 
                      ? 'bg-amber-500 text-theme-primary' 
                      : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-theme text-theme-secondary hover:text-theme-primary hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rotate-180"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredClientes.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-theme-tertiary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-theme-primary mb-2">
              {role === 'abogado_senior' || role === 'abogado_junior' 
                ? 'No tienes clientes asignados'
                : 'No se encontraron clientes'}
            </h3>
            <p className="text-theme-secondary">
              {config.puedeCrear 
                ? 'Intenta ajustar los filtros o crea un nuevo cliente'
                : 'Intenta ajustar los filtros de búsqueda'}
            </p>
          </div>
        )}

        {/* Panel de acciones rápidas para Secretario/Recepcionista */}
        {(role === 'secretario' || role === 'recepcionista') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl"
          >
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-500" />
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => setModalLlamada({ id: 'new', name: 'Nueva llamada' } as Cliente)}
                className="flex items-center gap-3 p-4 bg-theme-card/60 rounded-xl hover:bg-theme-tertiary transition-colors text-left"
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <PhoneCall className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium text-theme-primary">Registrar Llamada</p>
                  <p className="text-xs text-theme-tertiary">Nueva comunicación</p>
                </div>
              </button>
              
              <button 
                onClick={() => setModalCita({ id: 'new', name: 'Nueva cita' } as Cliente)}
                className="flex items-center gap-3 p-4 bg-theme-card/60 rounded-xl hover:bg-theme-tertiary transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-theme-primary">Programar Cita</p>
                  <p className="text-xs text-theme-tertiary">Agendar visita</p>
                </div>
              </button>
              
              <button 
                onClick={() => setModalNuevoCliente(true)}
                className="flex items-center gap-3 p-4 bg-theme-card/60 rounded-xl hover:bg-theme-tertiary transition-colors text-left"
              >
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium text-theme-primary">Nuevo Prospecto</p>
                  <p className="text-xs text-theme-tertiary">Registrar potencial</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Panel de gestión para Super Admin/Socio */}
        {(role === 'super_admin' || role === 'socio') && config.puedeFusionar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl"
          >
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-500" />
              Herramientas de Administración
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <button 
                onClick={() => setModalFusionar(true)}
                className="flex items-center gap-3 p-4 bg-theme-card/60 rounded-xl hover:bg-theme-tertiary transition-colors text-left"
              >
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium text-theme-primary">Fusionar Registros</p>
                  <p className="text-xs text-theme-tertiary">Unificar duplicados</p>
                </div>
              </button>
              
              <button 
                onClick={() => setModalCategorias(true)}
                className="flex items-center gap-3 p-4 bg-theme-card/60 rounded-xl hover:bg-theme-tertiary transition-colors text-left"
              >
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-theme-primary">Categorías</p>
                  <p className="text-xs text-theme-tertiary">Gestionar etiquetas</p>
                </div>
              </button>
              
              <button 
                onClick={() => setModalExportar(true)}
                className="flex items-center gap-3 p-4 bg-theme-card/60 rounded-xl hover:bg-theme-tertiary transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-theme-primary">Exportar Todo</p>
                  <p className="text-xs text-theme-tertiary">Base completa</p>
                </div>
              </button>
              
              <button 
                onClick={() => setModalBajas(true)}
                className="flex items-center gap-3 p-4 bg-theme-card/60 rounded-xl hover:bg-theme-tertiary transition-colors text-left"
              >
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-theme-primary">Bajas</p>
                  <p className="text-xs text-theme-tertiary">Clientes inactivos</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* ============================================
          MODALES
      ============================================ */}

      {/* Modal Nuevo Cliente / Nuevo Contacto */}
      <Modal
        isOpen={modalNuevoCliente}
        onClose={() => setModalNuevoCliente(false)}
        title={role === 'secretario' || role === 'recepcionista' ? 'Nuevo Contacto' : 'Nuevo Cliente'}
      >
        <form onSubmit={handleGuardarCliente} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">Nombre completo / Empresa</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
              placeholder="Ej: María García o Tech Solutions SL"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">Tipo</label>
              <select className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500">
                <option value="Particular">Particular</option>
                <option value="Empresa">Empresa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">Estado</label>
              <select className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500">
                <option value="active">Activo</option>
                <option value="pending">Pendiente</option>
                <option value="prospect">Prospecto</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
              placeholder="cliente@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">Teléfono</label>
            <input 
              type="tel" 
              className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
              placeholder="+34 612 345 678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">Dirección</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
              placeholder="Calle Principal 123, Madrid"
            />
          </div>
          {(role === 'secretario' || role === 'recepcionista') && (
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">Notas de contacto</label>
              <textarea 
                rows={3}
                className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
                placeholder="Motivo de la visita o llamada..."
              />
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setModalNuevoCliente(false)}
              className="flex-1 px-4 py-2 bg-theme-tertiary text-theme-primary rounded-lg hover:bg-theme-hover transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-lg hover:bg-amber-400 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Ver Detalles con Pestañas */}
      <Modal
        isOpen={!!modalVerDetalle}
        onClose={() => setModalVerDetalle(null)}
        title="Detalles del Cliente"
      >
        {modalVerDetalle && (
          <div className="space-y-4">
            {/* Header del cliente */}
            <div className="flex items-center gap-4 pb-4 border-b border-theme">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${
                modalVerDetalle.type === 'Empresa' 
                  ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30'
                  : 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30'
              }`}>
                {modalVerDetalle.type === 'Empresa' 
                  ? <Building2 className="w-7 h-7 text-purple-400" /> 
                  : <Users className="w-7 h-7 text-blue-400" />}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-theme-primary">{modalVerDetalle.name}</h4>
                <p className="text-sm text-theme-secondary">{modalVerDetalle.id} • {modalVerDetalle.type}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(modalVerDetalle.status)}`}>
                {getStatusText(modalVerDetalle.status)}
              </span>
            </div>

            {/* Pestañas */}
            <div className="flex gap-1 p-1 bg-theme-tertiary rounded-lg">
              {[
                { id: 'info', label: 'Información', icon: Users },
                { id: 'expedientes', label: 'Expedientes', icon: FileText },
                { id: 'actividad', label: 'Actividad', icon: History },
                ...(config.puedeVerFinanciero ? [{ id: 'facturacion', label: 'Facturación', icon: Euro }] : [])
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id as typeof detailTab)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    detailTab === tab.id
                      ? 'bg-theme-card text-theme-primary shadow-sm'
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Contenido de las pestañas */}
            <div className="min-h-[280px]">
              {detailTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-theme-tertiary rounded-xl">
                      <p className="text-xs text-theme-tertiary mb-1">Expedientes</p>
                      <p className="text-xl font-bold text-theme-primary">{modalVerDetalle.cases}</p>
                    </div>
                    {config.puedeVerFinanciero && (
                      <div className="p-3 bg-theme-tertiary rounded-xl">
                        <p className="text-xs text-theme-tertiary mb-1">Total Facturado</p>
                        <p className="text-xl font-bold text-emerald-500">{modalVerDetalle.totalBilled}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-theme-primary">Contacto</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-theme-secondary">
                        <Mail className="w-4 h-4" />
                        <span className="text-theme-primary">{modalVerDetalle.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-theme-secondary">
                        <Phone className="w-4 h-4" />
                        <span className="text-theme-primary">{modalVerDetalle.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-theme-secondary">
                        <MapPin className="w-4 h-4" />
                        <span className="text-theme-primary">{modalVerDetalle.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-theme-primary">Datos Adicionales</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-theme-secondary">Fecha de alta</span>
                        <span className="text-theme-primary">{modalVerDetalle.joinDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-theme-secondary">Última actividad</span>
                        <span className="text-theme-primary">{modalVerDetalle.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'expedientes' && (
                <div className="space-y-3">
                  {modalVerDetalle.cases > 0 ? (
                    Array.from({ length: Math.min(modalVerDetalle.cases, 3) }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-theme-tertiary rounded-xl hover:bg-theme-hover transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-theme-primary">Expediente {modalVerDetalle.id}-{String(i + 1).padStart(3, '0')}</p>
                          <p className="text-xs text-theme-secondary">Caso legal • Estado activo</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-theme-tertiary" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-theme-tertiary mx-auto mb-2" />
                      <p className="text-theme-secondary">No hay expedientes asociados</p>
                    </div>
                  )}
                  {modalVerDetalle.cases > 3 && (
                    <button className="w-full text-center text-sm text-amber-500 hover:text-amber-400 transition-colors">
                      Ver todos los {modalVerDetalle.cases} expedientes →
                    </button>
                  )}
                </div>
              )}

              {detailTab === 'actividad' && (
                <div className="space-y-3">
                  {[
                    { date: 'Hoy', action: 'Llamada recibida', icon: PhoneCall },
                    { date: 'Ayer', action: 'Email enviado', icon: Mail },
                    { date: 'Hace 3 días', action: 'Expediente actualizado', icon: FileText },
                    { date: 'Hace 1 semana', action: 'Cita programada', icon: Calendar },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-theme-tertiary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-theme-secondary" />
                      </div>
                      <div className="flex-1 pb-3 border-b border-theme">
                        <p className="text-sm text-theme-primary">{item.action}</p>
                        <p className="text-xs text-theme-tertiary">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {detailTab === 'facturacion' && config.puedeVerFinanciero && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <p className="text-xs text-emerald-400 mb-1">Total Facturado</p>
                      <p className="text-2xl font-bold text-emerald-500">{modalVerDetalle.totalBilled}</p>
                    </div>
                    <div className="p-4 bg-theme-tertiary rounded-xl">
                      <p className="text-xs text-theme-tertiary mb-1">Pendiente</p>
                      <p className="text-2xl font-bold text-theme-primary">€0</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-theme-primary">Últimas facturas</p>
                    {['Factura #001 - €1,500', 'Factura #002 - €2,300', 'Factura #003 - €800'].map((factura, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-theme-tertiary rounded-lg text-sm">
                        <span className="text-theme-secondary">{factura}</span>
                        <span className="text-emerald-500 font-medium">Pagada</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-4 border-t border-theme">
              <button 
                onClick={() => {
                  setModalVerDetalle(null);
                  setModalEditar(modalVerDetalle);
                }}
                className="flex-1 px-4 py-2 bg-amber-500 text-theme-primary font-medium rounded-lg hover:bg-amber-400 transition-colors"
              >
                Editar
              </button>
              <button 
                onClick={() => handleEnviarEmail(modalVerDetalle)}
                className="p-2 bg-theme-tertiary text-theme-secondary hover:text-theme-primary rounded-lg transition-colors"
                title="Enviar email"
              >
                <Mail className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setModalVerDetalle(null)}
                className="p-2 bg-theme-tertiary text-theme-secondary hover:text-theme-primary rounded-lg transition-colors"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Editar Cliente */}
      <Modal
        isOpen={!!modalEditar}
        onClose={() => setModalEditar(null)}
        title="Editar Cliente"
      >
        {modalEditar && (
          <form onSubmit={handleActualizarCliente} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">Nombre</label>
              <input 
                type="text" 
                defaultValue={modalEditar.name}
                className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">Email</label>
              <input 
                type="email" 
                defaultValue={modalEditar.email}
                className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">Teléfono</label>
              <input 
                type="tel" 
                defaultValue={modalEditar.phone}
                className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">Dirección</label>
              <input 
                type="text" 
                defaultValue={modalEditar.address}
                className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
              />
            </div>
            {config.puedeEditar && role !== 'abogado_junior' && (
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-1">Estado</label>
                <select defaultValue={modalEditar.status} className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500">
                  <option value="active">Activo</option>
                  <option value="pending">Pendiente</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setModalEditar(null)}
                className="flex-1 px-4 py-2 bg-theme-tertiary text-theme-primary rounded-lg hover:bg-theme-hover transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-2 bg-amber-500 text-theme-primary font-medium rounded-lg hover:bg-amber-400 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal Eliminar Cliente */}
      <Modal
        isOpen={!!modalEliminar}
        onClose={() => setModalEliminar(null)}
        title="Confirmar Eliminación"
      >
        {modalEliminar && (
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400">
                ¿Estás seguro de que deseas eliminar a <strong className="text-theme-primary">{modalEliminar.name}</strong>?
              </p>
              <p className="text-sm text-red-400/70 mt-2">
                Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al cliente.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setModalEliminar(null)}
                className="flex-1 px-4 py-2 bg-theme-tertiary text-theme-primary rounded-lg hover:bg-theme-hover transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleEliminarCliente}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-400 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Registrar Llamada */}
      <Modal
        isOpen={!!modalLlamada}
        onClose={() => setModalLlamada(null)}
        title="Registrar Llamada"
      >
        <form onSubmit={handleRegistrarLlamada} className="space-y-4">
          {modalLlamada && modalLlamada.id !== 'new' && (
            <div className="p-3 bg-theme-tertiary rounded-lg">
              <p className="text-sm text-theme-secondary">Cliente</p>
              <p className="font-medium text-theme-primary">{modalLlamada.name}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">Tipo de llamada</label>
            <select className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500">
              <option>Entrante</option>
              <option>Saliente</option>
              <option>No contesta</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">Motivo</label>
            <select className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500">
              <option>Consulta general</option>
              <option>Seguimiento de caso</option>
              <option>Agendar cita</option>
              <option>Información de facturación</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">Notas</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
              placeholder="Resumen de la conversación..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setModalLlamada(null)}
              className="flex-1 px-4 py-2 bg-theme-tertiary text-theme-primary rounded-lg hover:bg-theme-hover transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-400 transition-colors"
            >
              Registrar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Programar Cita */}
      <Modal
        isOpen={!!modalCita}
        onClose={() => setModalCita(null)}
        title="Programar Cita"
      >
        <form onSubmit={handleProgramarCita} className="space-y-4">
          {modalCita && modalCita.id !== 'new' && (
            <div className="p-3 bg-theme-tertiary rounded-lg">
              <p className="text-sm text-theme-secondary">Cliente</p>
              <p className="font-medium text-theme-primary">{modalCita.name}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">Fecha</label>
            <input 
              type="date" 
              required
              className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">Hora</label>
            <input 
              type="time" 
              required
              className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">Motivo</label>
            <select className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500">
              <option>Consulta inicial</option>
              <option>Seguimiento</option>
              <option>Entrega de documentos</option>
              <option>Firma de contrato</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">Abogado (opcional)</label>
            <select className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500">
              <option value="">Sin preferencia</option>
              <option>Dr. Carlos Rodríguez</option>
              <option>Dra. Ana Martínez</option>
              <option>Dr. Luis Hernández</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">Notas adicionales</label>
            <textarea 
              rows={2}
              className="w-full px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
              placeholder="Información adicional..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setModalCita(null)}
              className="flex-1 px-4 py-2 bg-theme-tertiary text-theme-primary rounded-lg hover:bg-theme-hover transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-400 transition-colors"
            >
              Programar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Más Opciones */}
      <Modal
        isOpen={!!modalMasOpciones}
        onClose={() => setModalMasOpciones(null)}
        title="Opciones del Cliente"
      >
        {modalMasOpciones && (
          <div className="space-y-2">
            <div className="p-3 bg-theme-tertiary rounded-lg mb-4">
              <p className="font-medium text-theme-primary">{modalMasOpciones.name}</p>
              <p className="text-sm text-theme-secondary">{modalMasOpciones.id}</p>
            </div>
            
            {config.puedeEditar && (
              <button 
                onClick={() => {
                  setModalMasOpciones(null);
                  setModalEditar(modalMasOpciones);
                }}
                className="w-full flex items-center gap-3 p-3 bg-theme-tertiary hover:bg-theme-hover rounded-xl transition-colors text-left"
              >
                <Edit2 className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-medium text-theme-primary">Editar información</p>
                  <p className="text-xs text-theme-secondary">Modificar datos del cliente</p>
                </div>
              </button>
            )}
            
            <button 
              onClick={() => {
                setModalMasOpciones(null);
                setModalVerDetalle(modalMasOpciones);
              }}
              className="w-full flex items-center gap-3 p-3 bg-theme-tertiary hover:bg-theme-hover rounded-xl transition-colors text-left"
            >
              <Eye className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-theme-primary">Ver detalles completos</p>
                <p className="text-xs text-theme-secondary">Información completa del cliente</p>
              </div>
            </button>
            
            {(role === 'abogado_senior' || role === 'super_admin' || role === 'socio') && (
              <button 
                onClick={() => {
                  setModalMasOpciones(null);
                  showToast('Redirigiendo a expedientes del cliente...');
                }}
                className="w-full flex items-center gap-3 p-3 bg-theme-tertiary hover:bg-theme-hover rounded-xl transition-colors text-left"
              >
                <FileText className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-theme-primary">Ver expedientes</p>
                  <p className="text-xs text-theme-secondary">{modalMasOpciones.cases} expedientes activos</p>
                </div>
              </button>
            )}
            
            {(role === 'abogado_senior' || role === 'super_admin' || role === 'socio') && (
              <button 
                onClick={() => {
                  setModalMasOpciones(null);
                  showToast('Función de subir documentos - en desarrollo');
                }}
                className="w-full flex items-center gap-3 p-3 bg-theme-tertiary hover:bg-theme-hover rounded-xl transition-colors text-left"
              >
                <FileUp className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="font-medium text-theme-primary">Subir documento</p>
                  <p className="text-xs text-theme-secondary">Agregar archivo al cliente</p>
                </div>
              </button>
            )}
            
            {config.puedeEliminar && (
              <button 
                onClick={() => {
                  setModalMasOpciones(null);
                  setModalEliminar(modalMasOpciones);
                }}
                className="w-full flex items-center gap-3 p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors text-left"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-400">Eliminar cliente</p>
                  <p className="text-xs text-red-400/70">Esta acción no se puede deshacer</p>
                </div>
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* Modal Fusionar Registros */}
      <Modal
        isOpen={modalFusionar}
        onClose={() => setModalFusionar(false)}
        title="Fusionar Registros Duplicados"
      >
        <div className="space-y-4">
          <p className="text-theme-secondary text-sm">
            Selecciona los registros que deseas fusionar en uno solo. Los datos del registro principal se conservarán.
          </p>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {clientesDelRol.slice(0, 5).map((cliente, idx) => (
              <div key={cliente.id} className="flex items-center gap-3 p-3 bg-theme-tertiary rounded-lg">
                <input type="checkbox" className="w-4 h-4 rounded border-theme bg-theme-hover text-amber-500 focus:ring-amber-500" />
                <div className="flex-1">
                  <p className="font-medium text-theme-primary">{cliente.name}</p>
                  <p className="text-xs text-theme-secondary">{cliente.email}</p>
                </div>
                {idx === 0 && (
                  <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-500 rounded-full">Principal</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-400">
              <strong>Nota:</strong> Al fusionar, los expedientes y documentos de todos los registros se asignarán al registro principal.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => setModalFusionar(false)}
              className="flex-1 px-4 py-2 bg-theme-tertiary text-theme-primary rounded-lg hover:bg-theme-hover transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                showToast('Registros fusionados correctamente');
                setModalFusionar(false);
              }}
              className="flex-1 px-4 py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-400 transition-colors"
            >
              Fusionar Seleccionados
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Exportar */}
      <Modal
        isOpen={modalExportar}
        onClose={() => setModalExportar(false)}
        title="Exportar Base de Datos"
      >
        <div className="space-y-4">
          <p className="text-theme-secondary text-sm">
            Selecciona el formato de exportación para los {filteredClientes.length} clientes.
          </p>
          
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => handleExportar('excel')}
              className="flex items-center gap-3 p-4 bg-theme-tertiary hover:bg-theme-hover rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-theme-primary">Excel (.xlsx)</p>
                <p className="text-xs text-theme-secondary">Formato editable con todas las columnas</p>
              </div>
              <ChevronRight className="w-5 h-5 text-theme-tertiary" />
            </button>
            
            <button 
              onClick={() => handleExportar('csv')}
              className="flex items-center gap-3 p-4 bg-theme-tertiary hover:bg-theme-hover rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-theme-primary">CSV</p>
                <p className="text-xs text-theme-secondary">Formato compatible con cualquier sistema</p>
              </div>
              <ChevronRight className="w-5 h-5 text-theme-tertiary" />
            </button>
            
            <button 
              onClick={() => handleExportar('pdf')}
              className="flex items-center gap-3 p-4 bg-theme-tertiary hover:bg-theme-hover rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-theme-primary">PDF</p>
                <p className="text-xs text-theme-secondary">Formato para imprimir o compartir</p>
              </div>
              <ChevronRight className="w-5 h-5 text-theme-tertiary" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-theme-tertiary rounded-lg">
            <input type="checkbox" id="export-all" className="w-4 h-4 rounded border-theme bg-theme-hover text-amber-500" defaultChecked />
            <label htmlFor="export-all" className="text-sm text-theme-secondary">Incluir clientes inactivos</label>
          </div>
        </div>
      </Modal>

      {/* Modal Categorías */}
      <Modal
        isOpen={modalCategorias}
        onClose={() => setModalCategorias(false)}
        title="Gestionar Categorías"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nueva categoría..."
              className="flex-1 px-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
            />
            <button 
              onClick={() => showToast('Categoría creada')}
              className="px-4 py-2 bg-amber-500 text-theme-primary font-medium rounded-lg hover:bg-amber-400 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            {['VIP', 'Empresa', 'Particular', 'Potencial', 'Histórico'].map((cat) => (
              <div key={cat} className="flex items-center gap-3 p-3 bg-theme-tertiary rounded-lg">
                <Tag className="w-5 h-5 text-amber-500" />
                <span className="flex-1 text-theme-primary">{cat}</span>
                <span className="text-xs text-theme-secondary">{Math.floor(Math.random() * 20)} clientes</span>
                <button 
                  onClick={() => showToast(`Categoría ${cat} eliminada`)}
                  className="p-1 text-theme-tertiary hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setModalCategorias(false)}
            className="w-full px-4 py-2 bg-theme-tertiary text-theme-primary rounded-lg hover:bg-theme-hover transition-colors"
          >
            Cerrar
          </button>
        </div>
      </Modal>

      {/* Modal Bajas / Clientes Inactivos */}
      <Modal
        isOpen={modalBajas}
        onClose={() => setModalBajas(false)}
        title="Clientes Inactivos (Bajas)"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-theme-tertiary rounded-xl text-center">
              <p className="text-2xl font-bold text-theme-primary">12</p>
              <p className="text-xs text-theme-secondary">Inactivos este año</p>
            </div>
            <div className="p-4 bg-theme-tertiary rounded-xl text-center">
              <p className="text-2xl font-bold text-red-400">3</p>
              <p className="text-xs text-theme-secondary">Bajas pendientes</p>
            </div>
            <div className="p-4 bg-theme-tertiary rounded-xl text-center">
              <p className="text-2xl font-bold text-emerald-400">5</p>
              <p className="text-xs text-theme-secondary">Reactivados</p>
            </div>
          </div>
          
          <h4 className="font-medium text-theme-primary flex items-center gap-2">
            <Clock className="w-4 h-4 text-theme-tertiary" />
            Últimas bajas
          </h4>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {clientesDelRol.filter(c => c.status === 'inactive').slice(0, 3).map((cliente) => (
              <div key={cliente.id} className="flex items-center gap-3 p-3 bg-theme-tertiary rounded-lg">
                <div className="w-10 h-10 bg-theme-hover rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-theme-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-theme-primary">{cliente.name}</p>
                  <p className="text-xs text-theme-secondary">Baja: {cliente.lastActivity}</p>
                </div>
                <button 
                  onClick={() => showToast(`Cliente ${cliente.name} reactivado`)}
                  className="px-3 py-1 text-xs bg-emerald-500/20 text-emerald-500 rounded-full hover:bg-emerald-500/30 transition-colors"
                >
                  Reactivar
                </button>
              </div>
            ))}
            {clientesDelRol.filter(c => c.status === 'inactive').length === 0 && (
              <p className="text-center text-theme-tertiary py-4">No hay clientes inactivos</p>
            )}
          </div>
          
          <button 
            onClick={() => setModalBajas(false)}
            className="w-full px-4 py-2 bg-theme-tertiary text-theme-primary rounded-lg hover:bg-theme-hover transition-colors"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </AppLayout>
  );
}
