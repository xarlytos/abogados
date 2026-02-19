import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Scale, LayoutDashboard, FolderOpen, Calendar, Users,
  BarChart3, MessageSquare, Settings, Bell,
  LogOut, ChevronDown, CreditCard, BookOpen, CheckSquare, UserCircle,
  Gavel, DollarSign, Receipt, FileText, Activity, Building2,
  Menu, X
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import type { UserRole } from '@/types/roles';
import { ThemeToggleSimple } from '@/components/ThemeToggle';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
  roles: UserRole[];
  badge?: number;
}

// Definición de items de navegación con permisos por rol
const sidebarItems: SidebarItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard',
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario', 'administrador', 'contador', 'recepcionista'],
  },
  {
    icon: FolderOpen,
    label: 'Expedientes',
    path: '/expedientes',
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario'],
    badge: 6
  },
  {
    icon: Calendar,
    label: 'Calendario',
    path: '/calendario',
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario', 'administrador', 'recepcionista'],
    badge: 8
  },
  {
    icon: Users,
    label: 'Clientes',
    path: '/clientes',
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario', 'administrador', 'recepcionista'],
  },
  {
    icon: BarChart3,
    label: 'Informes',
    path: '/informes',
    roles: ['super_admin', 'socio', 'abogado_senior', 'administrador', 'contador'],
  },
  {
    icon: MessageSquare,
    label: 'Mensajes',
    path: '/mensajes',
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario', 'administrador', 'contador', 'recepcionista'],
    badge: 3
  },
  {
    icon: CreditCard,
    label: 'Facturación',
    path: '/facturacion',
    roles: ['super_admin', 'socio', 'administrador', 'contador'],
  },
  {
    icon: BookOpen,
    label: 'Biblioteca',
    path: '/biblioteca',
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario', 'administrador', 'contador'],
  },
  {
    icon: CheckSquare,
    label: 'Tareas',
    path: '/tareas',
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario'],
    badge: 3
  },
  {
    icon: UserCircle,
    label: 'Portal Cliente',
    path: '/portal-cliente',
    roles: ['super_admin', 'socio', 'administrador'],
  },
  {
    icon: Gavel,
    label: 'Audiencias',
    path: '/audiencias',
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario'],
    badge: 4
  },
  {
    icon: DollarSign,
    label: 'Cobranza',
    path: '/cobranza',
    roles: ['super_admin', 'socio', 'administrador', 'contador'],
  },
  {
    icon: Receipt,
    label: 'Gastos',
    path: '/gastos',
    roles: ['super_admin', 'socio', 'abogado_senior', 'administrador', 'contador'],
  },
  {
    icon: FileText,
    label: 'Plantillas',
    path: '/plantillas',
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario', 'administrador'],
  },
  {
    icon: Bell,
    label: 'Notificaciones',
    path: '/notificaciones',
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario', 'administrador', 'contador', 'recepcionista'],
    badge: 5
  },
  {
    icon: Activity,
    label: 'Bitácora',
    path: '/bitacora',
    roles: ['super_admin', 'socio', 'abogado_senior', 'administrador'],
  },
  {
    icon: Building2,
    label: 'Proveedores',
    path: '/proveedores',
    roles: ['super_admin', 'socio', 'administrador', 'contador'],
  },
];

const notifications = [
  { id: 1, title: 'Nuevo expediente asignado', message: 'Se te ha asignado el caso EXP-2024-006 - Delito fiscal', time: '5 min', read: false, type: 'case' },
  { id: 2, title: 'Plazo próximo crítico', message: 'Vence plazo en EXP-2024-001 en 2 horas', time: '1 h', read: false, type: 'urgent' },
  { id: 3, title: 'Pago recibido', message: 'El cliente Juan Martínez ha pagado la factura #234 - €5,000', time: '3 h', read: true, type: 'payment' },
];

export function AppLayout({ children, title, subtitle, headerActions }: AppLayoutProps) {
  // En móvil, la sidebar empieza cerrada; en desktop, abierta
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { role, roleConfig, roleName, isLoading } = useRole();

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // En desktop (no móvil), sidebar abierta por defecto
      // En móvil, sidebar cerrada por defecto
      if (!mobile) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cerrar sidebar al navegar en móvil
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Obtener datos del usuario desde localStorage
  const userEmail = localStorage.getItem('userEmail') || 'usuario@derecho.erp';

  // Generar iniciales a partir del email
  const userInitials = useMemo(() => {
    const emailParts = userEmail.split('@')[0].split(/[._-]/);
    if (emailParts.length >= 2) {
      return (emailParts[0][0] + emailParts[1][0]).toUpperCase();
    }
    return userEmail.substring(0, 2).toUpperCase();
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRoleName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Filtrar items según el rol actual
  const filteredItems = sidebarItems.filter(item => item.roles.includes(role));

  // Mostrar loading mientras se carga el rol
  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-primary flex overflow-hidden">
      {/* Overlay oscuro para móvil cuando la sidebar está abierta */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 280 : 0,
          x: sidebarOpen ? 0 : -280
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`bg-theme-secondary border-r border-theme flex flex-col flex-shrink-0 z-50 
          ${isMobile ? 'fixed inset-y-0 left-0' : 'fixed inset-y-0 left-0'}`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-theme justify-between">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Scale className="w-6 h-6 text-theme-primary" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold text-xl text-theme-primary whitespace-nowrap"
                >
                  DERECHO<span className="text-accent">.ERP</span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Botón cerrar en móvil */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors lg:hidden"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                  ? 'bg-gradient-to-r from-accent to-amber-600 text-theme-primary font-semibold shadow-lg shadow-accent/20'
                  : 'text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary'
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 text-left whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {sidebarOpen && item.badge && (
                <span className="px-2 py-0.5 bg-red-500 text-theme-primary text-xs font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-theme space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary rounded-xl transition-all">
            <Settings className="w-5 h-5" />
            <AnimatePresence>
              {sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Configuración</motion.span>}
            </AnimatePresence>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Cerrar sesión</motion.span>}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.div 
        className="flex-1 flex flex-col min-w-0"
        animate={{
          marginLeft: sidebarOpen ? 280 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <header className="h-20 bg-theme-secondary/80 backdrop-blur-xl border-b border-theme flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Botón de menú hamburguesa para móvil */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {isMobile ? (
                <Menu className="w-5 h-5" />
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            <div>
              <h1 className="text-xl font-bold text-theme-primary">{title}</h1>
              {subtitle && <p className="text-sm text-theme-secondary">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Custom Header Actions */}
            {headerActions}

            {/* Theme Toggle */}
            <ThemeToggleSimple />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-96 bg-theme-secondary border border-theme rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-theme flex items-center justify-between">
                      <h3 className="font-semibold text-theme-primary">Notifsicaciones</h3>
                      <button className="text-xs text-accent hover:text-amber-400">Marcar todas leídas</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-theme hover:bg-theme-tertiary/50 cursor-pointer transition-colors ${!notif.read ? 'bg-accent/5' : ''
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${notif.type === 'urgent' ? 'bg-red-500/20' :
                                notif.type === 'payment' ? 'bg-emerald-500/20' :
                                  'bg-blue-500/20'
                              }`}>
                              <span className={`w-2 h-2 rounded-full ${notif.type === 'urgent' ? 'bg-red-500' :
                                  notif.type === 'payment' ? 'bg-emerald-500' :
                                    'bg-blue-500'
                                }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-theme-primary">{notif.title}</p>
                              <p className="text-xs text-theme-secondary mt-1">{notif.message}</p>
                              <p className="text-xs text-theme-tertiary mt-1">{notif.time}</p>
                            </div>
                            {!notif.read && <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-theme-tertiary rounded-xl transition-colors"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${roleConfig.color} rounded-full flex items-center justify-center text-theme-primary font-bold`}>
                  {userInitials}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-theme-primary">{userEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className={`text-xs ${roleConfig.textColor}`}>{roleName}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-theme-secondary hidden md:block" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-theme-secondary border border-theme rounded-2xl shadow-2xl z-50 py-2 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-theme">
                      <p className="text-sm font-medium text-theme-primary">{userEmail}</p>
                      <p className={`text-xs ${roleConfig.textColor}`}>{roleName}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary transition-colors">
                      <Users className="w-4 h-4" />
                      Mi Perfil
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary transition-colors">
                      <Settings className="w-4 h-4" />
                      Configuración
                    </Link>
                    <div className="border-t border-theme my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </motion.div>
    </div>
  );
}
