import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { 
  Scale, Settings, LogOut, LayoutDashboard, FolderOpen, Calendar, 
  Users, BarChart3, MessageSquare, CreditCard, BookOpen,
  Clock, Shield, Calculator, CheckSquare, UserCircle, Gavel, DollarSign,
  Receipt, FileText, Bell, Activity, Building2, X, FileSignature,
  Timer, ShieldAlert
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import type { UserRole } from '@/types/roles';

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
    icon: FileSignature, 
    label: 'Firmas', 
    path: '/firmas', 
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'administrador', 'contador'],
    badge: 2
  },
  { 
    icon: BookOpen, 
    label: 'Biblioteca', 
    path: '/biblioteca', 
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario', 'administrador', 'contador'],
  },
  // Módulos específicos por rol
  { 
    icon: Calculator, 
    label: 'Contabilidad', 
    path: '/contabilidad', 
    roles: ['super_admin', 'socio', 'administrador', 'contador'],
  },
  { 
    icon: Clock, 
    label: 'Tiempo', 
    path: '/tiempo', 
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal'],
  },
  // Módulo de Conflictos
  { 
    icon: ShieldAlert, 
    label: 'Análisis Validación', 
    path: '/conflictos/analisis', 
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal'],
    badge: 5
  },
  { 
    icon: ShieldAlert, 
    label: 'Partes Contrarias', 
    path: '/conflictos/partes', 
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario'],
  },
  { 
    icon: Shield, 
    label: 'Administración', 
    path: '/admin', 
    roles: ['super_admin'],
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
  { 
    icon: Timer, 
    label: 'Prescripciones', 
    path: '/prescripciones', 
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario'],
    badge: 4
  },
  { 
    icon: ShieldAlert, 
    label: 'Conflictos', 
    path: '/conflictos', 
    roles: ['super_admin', 'socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'administrador'],
    badge: 3
  },
];

interface SidebarProps {
  isOpen: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, isMobile = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, roleConfig } = useRole();

  // Cerrar sidebar al navegar en móvil
  useEffect(() => {
    if (isMobile && onClose) {
      onClose();
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRoleName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  // Filtrar items según el rol actual
  const filteredItems = sidebarItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Overlay oscuro para móvil cuando la sidebar está abierta */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? (isOpen ? 280 : 0) : (isOpen ? 280 : 80),
          x: isMobile ? (isOpen ? 0 : -280) : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`bg-theme-secondary border-r border-theme flex flex-col flex-shrink-0 z-50 h-screen overflow-y-auto
          ${isMobile ? 'fixed inset-y-0 left-0' : 'relative'}`}
      >
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-theme justify-between">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent rounded-xl flex items-center justify-center flex-shrink-0">
            <Scale className="w-6 h-6 text-theme-primary" />
          </div>
          <AnimatePresence>
            {isOpen && (
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
            onClick={onClose}
            className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-colors lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Indicator */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 border-b border-theme"
          >
            <div className={`px-3 py-2 rounded-lg ${roleConfig.bgColor} border border-theme`}>
              <p className="text-xs text-theme-secondary">Accediendo como</p>
              <p className={`text-sm font-medium ${roleConfig.textColor}`}>{roleConfig.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-accent to-accent text-theme-primary font-semibold shadow-lg shadow-accent/20' 
                  : 'text-theme-secondary hover:bg-theme-hover hover:text-theme-primary'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {isOpen && (
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
              {isOpen && item.badge && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-theme space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-theme-secondary hover:bg-theme-hover hover:text-theme-primary rounded-xl transition-all">
          <Settings className="w-5 h-5" />
          <AnimatePresence>
            {isOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Configuración</motion.span>}
          </AnimatePresence>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence>
            {isOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Cerrar sesión</motion.span>}
          </AnimatePresence>
        </button>
      </div>
      </motion.aside>
    </>
  );
}
