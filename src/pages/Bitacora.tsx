import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Eye, Plus, Edit2, Trash2, Download,
  LogIn, LogOut, CheckCircle2, XCircle, FileText, AlertTriangle,
  Search, Shield, FileDown,
  Clock, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Lock, Crown, Briefcase, Users, Calendar, RefreshCw,
  LayoutList, List, X
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  bitacoraData,
  getActionColor,
  getActionText,
  getModuleText,
  getSeverityColor,
  getSeverityText,
  type ActionType,
  type ModuleType
} from '@/data/bitacoraData';
import { useRole } from '@/hooks/useRole';
import type { UserRole } from '@/types/roles';

const ITEMS_PER_PAGE = 20;

const getCurrentUserId = (role: UserRole): string => {
  const userIds: Record<UserRole, string> = {
    super_admin: 'super_admin',
    socio: 'user-001',
    abogado_senior: 'user-002',
    abogado_junior: 'user-004',
    paralegal: 'user-006',
    secretario: 'user-005',
    administrador: 'user-003',
    contador: 'user-007',
    recepcionista: 'recepcionista_1',
  };
  return userIds[role] || 'unknown';
};

const ADMIN_MODULES: ModuleType[] = ['facturacion', 'cobranza', 'gastos', 'usuarios', 'configuracion'];

const RELEVANT_MODULES: ModuleType[] = [
  'expedientes', 'clientes', 'facturacion', 'cobranza', 'gastos', 
  'documentos', 'tareas', 'audiencias', 'usuarios'
];

const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
    'bg-amber-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-rose-500'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function Bitacora() {
  const { role, roleConfig } = useRole();
  const currentUserId = getCurrentUserId(role);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<ActionType | 'all'>('all');
  const [moduleFilter, setModuleFilter] = useState<ModuleType | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const permissions = useMemo(() => {
    return {
      hasAccess: ['super_admin', 'socio', 'abogado_senior', 'administrador'].includes(role),
      canViewAll: role === 'super_admin',
      canViewOwnCases: role === 'abogado_senior',
      canViewAdmin: role === 'administrador',
      canViewRelevant: role === 'socio',
      canExport: role === 'super_admin' || role === 'socio',
    };
  }, [role]);

  const filteredEntries = useMemo(() => {
    let filtered = bitacoraData;

    switch (role) {
      case 'super_admin':
        break;
      case 'socio':
        filtered = bitacoraData.filter(entry => 
          entry.userRole !== 'system' && 
          RELEVANT_MODULES.includes(entry.module)
        );
        break;
      case 'abogado_senior':
        filtered = bitacoraData.filter(entry => 
          entry.userId === currentUserId || 
          entry.userRole === 'abogado_junior' ||
          (entry.entityType === 'expediente' && entry.module === 'expedientes')
        );
        break;
      case 'administrador':
        filtered = bitacoraData.filter(entry => 
          ADMIN_MODULES.includes(entry.module) ||
          entry.module === 'usuarios' ||
          entry.module === 'configuracion'
        );
        break;
      default:
        filtered = [];
    }

    filtered = filtered.filter(entry => {
      const matchesSearch = 
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.entityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAction = actionFilter === 'all' || entry.action === actionFilter;
      const matchesModule = moduleFilter === 'all' || entry.module === moduleFilter;
      const matchesSeverity = severityFilter === 'all' || entry.severity === severityFilter;
      
      let matchesDate = true;
      if (dateRange) {
        const entryDate = new Date(entry.timestamp);
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59);
        matchesDate = entryDate >= start && entryDate <= end;
      }
      
      return matchesSearch && matchesAction && matchesModule && matchesSeverity && matchesDate;
    });

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [role, currentUserId, searchQuery, actionFilter, moduleFilter, severityFilter, dateRange]);

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEntries, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, actionFilter, moduleFilter, severityFilter, dateRange]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: filteredEntries.length,
      today: filteredEntries.filter(l => new Date(l.timestamp).toDateString() === today).length,
      warning: filteredEntries.filter(l => l.severity === 'warning').length,
      error: filteredEntries.filter(l => l.severity === 'error' || l.severity === 'critical').length,
    };
  }, [filteredEntries]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (actionFilter !== 'all') count++;
    if (moduleFilter !== 'all') count++;
    if (severityFilter !== 'all') count++;
    if (dateRange) count++;
    return count;
  }, [actionFilter, moduleFilter, severityFilter, dateRange]);

  const clearFilters = () => {
    setSearchQuery('');
    setActionFilter('all');
    setModuleFilter('all');
    setSeverityFilter('all');
    setDateRange(null);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return LogIn;
      case 'logout': return LogOut;
      case 'create': return Plus;
      case 'update': return Edit2;
      case 'delete': return Trash2;
      case 'view': return Eye;
      case 'export':
      case 'download': return FileDown;
      case 'upload':
      case 'import': return Download;
      case 'approve': return CheckCircle2;
      case 'reject': return XCircle;
      default: return Activity;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const setQuickDateFilter = (days: number | null) => {
    if (days === null) {
      setDateRange(null);
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days);
      setDateRange({
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      });
    }
  };

  const getRoleMessage = () => {
    const messages: Record<UserRole, { title: string; description: string; actions: string[] }> = {
      super_admin: {
        title: 'Log Completo del Sistema',
        description: 'Acceso total a todas las actividades registradas en el sistema.',
        actions: ['Ver logs de todos los usuarios', 'Monitorear actividades críticas', 'Exportar registros', 'Auditar cambios']
      },
      socio: {
        title: 'Actividades del Bufete',
        description: 'Vista de las actividades relevantes del bufete, excluyendo logs de sistema.',
        actions: ['Supervisar actividades del equipo', 'Ver cambios en expedientes', 'Monitorear acciones importantes', 'Generar reportes']
      },
      abogado_senior: {
        title: 'Actividades de Mis Casos',
        description: 'Solo puedes ver actividades relacionadas con tus casos y equipo.',
        actions: ['Ver actividades de tus expedientes', 'Supervisar acciones del equipo', 'Revisar cambios realizados', 'Monitorear documentos']
      },
      administrador: {
        title: 'Actividades Administrativas',
        description: 'Acceso a logs de facturación, pagos, usuarios y actividades administrativas.',
        actions: ['Auditar facturación', 'Revisar logs de pagos', 'Monitorear usuarios', 'Generar reportes administrativos']
      },
      abogado_junior: {
        title: 'Sin Acceso a Bitácora',
        description: 'Tu rol no tiene acceso al módulo de bitácora.',
        actions: ['Accede a tus expedientes', 'Gestiona tus tareas', 'Revisa documentos', 'Actualiza tu calendario']
      },
      paralegal: {
        title: 'Sin Acceso a Bitácora',
        description: 'Tu rol no tiene acceso al módulo de bitácora.',
        actions: ['Accede a tareas asignadas', 'Gestiona documentos', 'Apoya en casos', 'Revisa expedientes']
      },
      secretario: {
        title: 'Sin Acceso a Bitácora',
        description: 'Tu rol no tiene acceso al módulo de bitácora.',
        actions: ['Gestiona agenda', 'Administra documentos', 'Atiende llamadas', 'Organiza archivos']
      },
      contador: {
        title: 'Sin Acceso a Bitácora',
        description: 'Tu rol no tiene acceso al módulo de bitácora.',
        actions: ['Accede a Contabilidad', 'Revisa facturación', 'Genera reportes fiscales', 'Gestiona cobranza']
      },
      recepcionista: {
        title: 'Sin Acceso a Bitácora',
        description: 'Tu rol no tiene acceso al módulo de bitácora.',
        actions: ['Gestiona citas', 'Atiende llamadas', 'Actualiza contactos', 'Recibe visitas']
      },
    };
    return messages[role] || messages.recepcionista;
  };

  if (!permissions.hasAccess) {
    const message = getRoleMessage();
    return (
      <AppLayout 
        title="Bitácora de Actividades"
        subtitle="Acceso restringido"
      >
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-12"
          >
            <div className="p-8 bg-theme-card/60 border border-theme rounded-2xl text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-theme-tertiary rounded-full flex items-center justify-center">
                <Lock className="w-10 h-10 text-theme-tertiary" />
              </div>
              <h2 className="text-2xl font-bold text-theme-primary mb-2">{message.title}</h2>
              <p className="text-theme-secondary mb-6">{message.description}</p>
              
              <div className="p-4 bg-theme-tertiary/50 rounded-xl text-left">
                <p className="text-sm font-medium text-theme-secondary mb-3">Acciones disponibles para tu rol:</p>
                <ul className="space-y-2">
                  {message.actions.map((action, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-theme-secondary">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </main>
      </AppLayout>
    );
  }

  const getRoleIcon = () => {
    switch (role) {
      case 'super_admin': return <Crown className="w-5 h-5" />;
      case 'socio': return <Briefcase className="w-5 h-5" />;
      case 'abogado_senior': return <Shield className="w-5 h-5" />;
      case 'administrador': return <Users className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getPageInfo = () => {
    switch (role) {
      case 'super_admin': return { title: 'Log Completo del Sistema', subtitle: 'Todas las actividades registradas' };
      case 'socio': return { title: 'Actividades del Bufete', subtitle: 'Supervisión de actividades relevantes' };
      case 'abogado_senior': return { title: 'Actividades de Mis Casos', subtitle: 'Logs de expedientes bajo tu responsabilidad' };
      case 'administrador': return { title: 'Actividades Administrativas', subtitle: 'Logs de facturación, pagos y usuarios' };
      default: return { title: 'Bitácora de Actividades', subtitle: '' };
    }
  };

  const pageInfo = getPageInfo();

  const headerActions = (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleRefresh}
        className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-colors"
        title="Actualizar"
      >
        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
      </button>
      {permissions.canExport && (
        <button className="flex items-center gap-2 px-4 py-2 bg-theme-card text-theme-primary font-medium rounded-xl hover:bg-theme-hover transition-colors border border-theme">
          <FileDown className="w-4 h-4" />
          <span className="hidden lg:inline">Exportar</span>
        </button>
      )}
    </div>
  );

  const renderTimelineEntry = (entry: typeof bitacoraData[0], index: number) => {
    const Icon = getActionIcon(entry.action);
    const isExpanded = expandedEntry === entry.id;
    
    const severityBorder = {
      critical: 'border-l-red-500',
      error: 'border-l-red-400',
      warning: 'border-l-amber-500',
      info: 'border-l-emerald-500'
    }[entry.severity] || 'border-l-theme';

    return (
      <motion.div
        key={entry.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
        className={`bg-theme-card/60 border border-theme rounded-xl overflow-hidden hover:border-theme-hover transition-all ${severityBorder} border-l-4`}
      >
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getActionColor(entry.action).replace('border', 'bg').replace('text-', 'text-').replace('bg-', 'bg-')}`}>
              <Icon className={`w-5 h-5 ${getActionColor(entry.action).split(' ').find(c => c.startsWith('text-')) || 'text-theme-primary'}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-medium text-theme-primary line-clamp-2">{entry.description}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColor(entry.severity)}`}>
                      {getSeverityText(entry.severity)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-theme-secondary flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-full ${getAvatarColor(entry.userName)} flex items-center justify-center text-white text-xs font-medium`}>
                        {getInitials(entry.userName)}
                      </div>
                      {entry.userName}
                    </span>
                    <span className="flex items-center gap-1 text-theme-tertiary">
                      <Clock className="w-3.5 h-3.5" />
                      {formatRelativeTime(entry.timestamp)}
                    </span>
                    <span className="px-2 py-0.5 bg-theme-tertiary/50 rounded text-xs">
                      {getModuleText(entry.module)}
                    </span>
                  </div>

                  {entry.entityName && (
                    <p className="text-sm text-theme-tertiary mt-1.5 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {entry.entityName}
                    </p>
                  )}
                </div>

                <button 
                  onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                  className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors flex-shrink-0"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-theme space-y-3"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-2.5 bg-theme-tertiary/30 rounded-lg">
                        <p className="text-xs text-theme-tertiary mb-0.5">ID Registro</p>
                        <p className="text-sm text-theme-secondary font-mono">{entry.id}</p>
                      </div>
                      <div className="p-2.5 bg-theme-tertiary/30 rounded-lg">
                        <p className="text-xs text-theme-tertiary mb-0.5">Usuario</p>
                        <p className="text-sm text-theme-secondary">{entry.userName}</p>
                      </div>
                      <div className="p-2.5 bg-theme-tertiary/30 rounded-lg">
                        <p className="text-xs text-theme-tertiary mb-0.5">Fecha</p>
                        <p className="text-sm text-theme-secondary">{new Date(entry.timestamp).toLocaleString('es-ES')}</p>
                      </div>
                      <div className="p-2.5 bg-theme-tertiary/30 rounded-lg">
                        <p className="text-xs text-theme-tertiary mb-0.5">IP</p>
                        <p className="text-sm text-theme-secondary font-mono text-xs">{entry.ipAddress}</p>
                      </div>
                    </div>

                    {entry.oldValue && (
                      <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                        <p className="text-xs text-red-400 mb-1">Valor Anterior</p>
                        <p className="text-sm text-theme-secondary">{entry.oldValue}</p>
                      </div>
                    )}

                    {entry.newValue && (
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                        <p className="text-xs text-emerald-400 mb-1">Nuevo Valor</p>
                        <p className="text-sm text-theme-secondary">{entry.newValue}</p>
                      </div>
                    )}

                    {entry.details && (
                      <div className="p-3 bg-theme-tertiary/30 rounded-lg">
                        <p className="text-xs text-theme-tertiary mb-1">Detalles</p>
                        <p className="text-sm text-theme-secondary">{entry.details}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderTableEntry = (entry: typeof bitacoraData[0], index: number) => {
    const Icon = getActionIcon(entry.action);
    const isExpanded = expandedEntry === entry.id;

    return (
      <motion.tr
        key={entry.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.01 }}
        className={`hover:bg-theme-hover/30 cursor-pointer transition-colors ${entry.severity === 'critical' || entry.severity === 'error' ? 'bg-red-500/5' : ''}`}
        onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActionColor(entry.action).replace('border', 'bg').replace('text-', 'text-').replace('bg-', 'bg-')}`}>
              <Icon className={`w-4 h-4 ${getActionColor(entry.action).split(' ').find(c => c.startsWith('text-')) || 'text-theme-primary'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-theme-primary line-clamp-1">{entry.description}</p>
              <p className="text-xs text-theme-tertiary">{entry.id}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full ${getAvatarColor(entry.userName)} flex items-center justify-center text-white text-xs font-medium`}>
              {getInitials(entry.userName)}
            </div>
            <span className="text-sm text-theme-secondary">{entry.userName}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-theme-secondary">{entry.userRole}</span>
        </td>
        <td className="px-4 py-3">
          <span className="px-2 py-1 bg-theme-tertiary/50 rounded text-xs">{getModuleText(entry.module)}</span>
        </td>
        <td className="px-4 py-3">
          <span className={`px-2 py-1 text-xs rounded-full ${getActionColor(entry.action)}`}>
            {getActionText(entry.action)}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(entry.severity)}`}>
            {getSeverityText(entry.severity)}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-theme-tertiary">{formatRelativeTime(entry.timestamp)}</span>
        </td>
        <td className="px-4 py-3">
          {entry.entityName && <span className="text-sm text-theme-secondary line-clamp-1 max-w-[150px]">{entry.entityName}</span>}
        </td>
        <td className="px-4 py-3">
          <button className="p-1 hover:bg-theme-tertiary rounded">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </td>
      </motion.tr>
    );
  };

  return (
    <AppLayout 
      title={pageInfo.title}
      subtitle={`${filteredEntries.length} registros${pageInfo.subtitle ? ` • ${pageInfo.subtitle}` : ''}`}
      headerActions={headerActions}
    >
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'slate', icon: Activity, desc: 'registros' },
            { label: 'Hoy', value: stats.today, color: 'blue', icon: Calendar, desc: 'hoy' },
            { label: 'Advertencias', value: stats.warning, color: 'amber', icon: AlertTriangle, desc: 'warnings' },
            { label: 'Errores', value: stats.error, color: 'red', icon: Shield, desc: 'errors' },
          ].map((stat) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-theme-card/60 border border-theme rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-theme-primary">{stat.value}</p>
                  <p className="text-xs text-theme-secondary">{stat.label}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-theme-card/40 border border-theme rounded-xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
              <input
                type="text"
                placeholder="Buscar por descripción, usuario, entidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-theme-primary border border-theme rounded-lg text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500 transition-colors text-sm"
              />
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value as ActionType | 'all')}
                className="px-3 py-2.5 bg-theme-primary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500 transition-colors text-sm"
              >
                <option value="all">Acciones</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="create">Crear</option>
                <option value="update">Actualizar</option>
                <option value="delete">Eliminar</option>
                <option value="view">Ver</option>
                <option value="export">Exportar</option>
                <option value="approve">Aprobar</option>
                <option value="reject">Rechazar</option>
              </select>

              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value as ModuleType | 'all')}
                className="px-3 py-2.5 bg-theme-primary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500 transition-colors text-sm"
              >
                <option value="all">Módulos</option>
                <option value="auth">Auth</option>
                <option value="expedientes">Expedientes</option>
                <option value="clientes">Clientes</option>
                <option value="facturacion">Facturación</option>
                <option value="cobranza">Cobranza</option>
                <option value="gastos">Gastos</option>
                <option value="documentos">Documentos</option>
                <option value="usuarios">Usuarios</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2.5 bg-theme-primary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500 transition-colors text-sm"
              >
                <option value="all">Severidad</option>
                <option value="info">Info</option>
                <option value="warning">Advertencia</option>
                <option value="error">Error</option>
                <option value="critical">Crítico</option>
              </select>

              <input
                type="date"
                value={dateRange?.start || ''}
                onChange={(e) => setDateRange(prev => ({ start: e.target.value, end: prev?.end || e.target.value }))}
                className="px-3 py-2.5 bg-theme-primary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500 transition-colors text-sm"
              />
              <input
                type="date"
                value={dateRange?.end || ''}
                onChange={(e) => setDateRange(prev => ({ start: prev?.start || e.target.value, end: e.target.value }))}
                className="px-3 py-2.5 bg-theme-primary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500 transition-colors text-sm"
              />

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Limpiar ({activeFiltersCount})</span>
                </button>
              )}

              <div className="flex border border-theme rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`p-2.5 transition-colors ${viewMode === 'timeline' ? 'bg-amber-500/10 text-amber-400' : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'}`}
                  title="Vista Timeline"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2.5 transition-colors ${viewMode === 'table' ? 'bg-amber-500/10 text-amber-400' : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'}`}
                  title="Vista Tabla"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-theme">
            <span className="text-xs text-theme-tertiary">Filtros rápidos:</span>
            <button
              onClick={() => setQuickDateFilter(0)}
              className="px-2 py-1 text-xs bg-theme-tertiary/50 hover:bg-theme-hover rounded-lg transition-colors text-theme-secondary"
            >
              Hoy
            </button>
            <button
              onClick={() => setQuickDateFilter(7)}
              className="px-2 py-1 text-xs bg-theme-tertiary/50 hover:bg-theme-hover rounded-lg transition-colors text-theme-secondary"
            >
              7 días
            </button>
            <button
              onClick={() => setQuickDateFilter(30)}
              className="px-2 py-1 text-xs bg-theme-tertiary/50 hover:bg-theme-hover rounded-lg transition-colors text-theme-secondary"
            >
              30 días
            </button>
            <button
              onClick={() => setQuickDateFilter(null)}
              className="px-2 py-1 text-xs bg-theme-tertiary/50 hover:bg-theme-hover rounded-lg transition-colors text-theme-secondary"
            >
              Todo
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-theme-secondary">
            Mostrando <span className="text-theme-primary font-medium">{paginatedEntries.length}</span> de{' '}
            <span className="text-theme-primary font-medium">{filteredEntries.length}</span> registros
            {currentPage > 1 && (
              <span className="text-theme-tertiary"> (página {currentPage} de {totalPages})</span>
            )}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'timeline' ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {paginatedEntries.map(renderTimelineEntry)}
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-theme-card/60 border border-theme rounded-xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-theme-tertiary/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">Acción</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">Usuario</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">Rol</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">Módulo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">Severidad</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">Tiempo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">Entidad</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme">
                    {paginatedEntries.map(renderTableEntry)}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredEntries.length === 0 && (
          <div className="p-12 text-center">
            <Activity className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
            <p className="text-theme-secondary">No se encontraron registros</p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-sm text-amber-400 hover:text-amber-300"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-theme rounded-lg text-theme-secondary hover:bg-theme-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'border border-theme text-theme-secondary hover:bg-theme-hover'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-theme rounded-lg text-theme-secondary hover:bg-theme-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-theme-card/40 border border-theme rounded-xl"
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${roleConfig.bgColor}`}>
              {getRoleIcon()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-theme-primary">{getRoleMessage().title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${roleConfig.bgColor} ${roleConfig.textColor}`}>
                  {roleConfig.name}
                </span>
              </div>
              <p className="text-xs text-theme-secondary mt-1">{getRoleMessage().description}</p>
            </div>
          </div>
        </motion.div>
      </main>
    </AppLayout>
  );
}
