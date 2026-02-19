import { useState, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, Plus, PanelLeft, PanelRight, 
  ChevronDown, Users, Settings, LogOut, Menu
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { notifications } from '@/data/dashboardData';
import { useRole } from '@/hooks/useRole';
import { ThemeToggleSimple } from '@/components/ThemeToggle';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
  icon: LucideIcon;
}

interface HeaderProps {
  sidebarOpen: boolean;
  isMobile?: boolean;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
}

export function Header({ sidebarOpen, isMobile = false, onToggleSidebar, onOpenSearch }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { roleConfig, roleName } = useRole();

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

  return (
    <header 
      className="h-20 backdrop-blur-xl border-b flex items-center justify-between px-4 lg:px-8"
      style={{ 
        backgroundColor: 'rgba(var(--bg-secondary-rgb), 0.8)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex items-center gap-3 lg:gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Toggle sidebar"
        >
          {isMobile ? (
            <Menu className="w-5 h-5" />
          ) : (
            sidebarOpen ? <PanelLeft className="w-5 h-5" /> : <PanelRight className="w-5 h-5" />
          )}
        </button>
        
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Buscar... (Ctrl+K)"
            onClick={onOpenSearch}
            className="w-80 lg:w-96 pl-12 pr-4 py-2.5 rounded-xl cursor-pointer transition-colors"
            style={{ 
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
            readOnly
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggleSimple />

        {/* New Button */}
        <button 
          className="hidden sm:flex items-center gap-2 px-4 py-2 font-medium rounded-xl transition-colors"
          style={{ 
            backgroundColor: 'var(--accent-primary)', 
            color: 'white'
          }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden lg:inline">Nuevo</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
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
                className="absolute right-0 top-full mt-2 w-96 rounded-2xl shadow-2xl z-50 overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div 
                  className="p-4 flex items-center justify-between"
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                >
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notificaciones</h3>
                  <button style={{ color: 'var(--accent-primary)' }} className="text-xs hover:opacity-80">Marcar todas leídas</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {(notifications as Notification[]).map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 cursor-pointer transition-colors"
                      style={{ 
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: !notif.read ? 'rgba(245, 158, 11, 0.05)' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = !notif.read ? 'rgba(245, 158, 11, 0.05)' : 'transparent';
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: notif.type === 'urgent' ? 'rgba(239, 68, 68, 0.2)' :
                              notif.type === 'payment' ? 'rgba(16, 185, 129, 0.2)' :
                              notif.type === 'case' ? 'rgba(59, 130, 246, 0.2)' :
                              'var(--bg-tertiary)'
                          }}
                        >
                          <notif.icon 
                            className="w-5 h-5"
                            style={{
                              color: notif.type === 'urgent' ? '#ef4444' :
                                notif.type === 'payment' ? '#10b981' :
                                notif.type === 'case' ? '#3b82f6' :
                                'var(--text-secondary)'
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{notif.title}</p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{notif.message}</p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div 
                            className="w-2 h-2 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: 'var(--accent-primary)' }}
                          />
                        )}
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
            className="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div 
              className={`w-10 h-10 bg-gradient-to-br ${roleConfig.color} rounded-full flex items-center justify-center text-white font-bold`}
            >
              {userInitials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {userEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <p className={`text-xs ${roleConfig.textColor}`}>{roleName}</p>
            </div>
            <ChevronDown className="w-4 h-4 hidden md:block" style={{ color: 'var(--text-secondary)' }} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div 
                  className="px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                >
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{userEmail}</p>
                  <p className={`text-xs ${roleConfig.textColor}`}>{roleName}</p>
                </div>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Users className="w-4 h-4" />
                  Mi Perfil
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Settings className="w-4 h-4" />
                  Configuración
                </Link>
                <div className="my-2" style={{ borderTop: '1px solid var(--border-color)' }} />
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
  );
}
