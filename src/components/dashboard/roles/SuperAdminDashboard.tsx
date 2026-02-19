import { motion } from 'framer-motion';
import { 
  Shield, Database, Activity, Users, AlertTriangle,
  CheckCircle, RefreshCw, HardDrive, Clock
} from 'lucide-react';
import { superAdminStats, superAdminActivities } from '@/data/rolesDashboardData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function SuperAdminDashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-theme-primary">Panel de Sistema</h2>
          <p className="text-theme-secondary">Monitoreo y administración del ERP</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Sistema Operativo
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {superAdminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-5 bg-theme-card border border-theme rounded-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-theme-secondary text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-theme-primary mt-1">{stat.value}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                    <span className="text-theme-tertiary text-xs">{stat.subtext}</span>
                  </div>
                </div>
                <div className={`p-3 bg-${stat.color}-500/10 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              Estado de Servicios
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Servidor Web', status: 'online', uptime: '99.99%', response: '45ms' },
                { name: 'Base de Datos', status: 'online', uptime: '99.95%', response: '12ms' },
                { name: 'API de Facturación', status: 'online', uptime: '99.90%', response: '120ms' },
                { name: 'Servicio de Email', status: 'warning', uptime: '98.50%', response: '450ms' },
                { name: 'Backup Automático', status: 'online', uptime: '100%', response: 'N/A' },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-theme-tertiary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      service.status === 'online' ? 'bg-emerald-500' : 
                      service.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <span className="text-theme-primary">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-theme-secondary">Uptime: <span className="text-theme-primary">{service.uptime}</span></span>
                    <span className="text-theme-secondary">Respuesta: <span className="text-theme-primary">{service.response}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              Logs de Auditoría
            </h3>
            <div className="space-y-3">
              {superAdminActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-theme-tertiary/30 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'success' ? 'bg-emerald-500/10' :
                    activity.type === 'warning' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                  }`}>
                    {activity.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> :
                     activity.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> :
                     <Users className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-theme-primary text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                      {activity.target && <span className="text-theme-secondary"> {activity.target}</span>}
                    </p>
                    <p className="text-theme-tertiary text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar Info */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* System Resources */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-purple-500" />
              Recursos del Sistema
            </h3>
            <div className="space-y-4">
              {[
                { label: 'CPU', value: 42, color: 'bg-blue-500' },
                { label: 'Memoria RAM', value: 68, color: 'bg-purple-500' },
                { label: 'Almacenamiento', value: 68, color: 'bg-amber-500' },
                { label: 'Red', value: 35, color: 'bg-emerald-500' },
              ].map((resource, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-theme-secondary">{resource.label}</span>
                    <span className="text-theme-primary">{resource.value}%</span>
                  </div>
                  <div className="h-2 bg-theme-tertiary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${resource.color} rounded-full transition-all duration-500`}
                      style={{ width: `${resource.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              {[
                { icon: Users, label: 'Crear Usuario', color: 'text-blue-400' },
                { icon: Database, label: 'Backup Manual', color: 'text-emerald-400' },
                { icon: Shield, label: 'Ver Logs', color: 'text-amber-400' },
                { icon: RefreshCw, label: 'Reiniciar Servicio', color: 'text-red-400' },
              ].map((action, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-3 text-theme-secondary hover:bg-theme-hover rounded-lg transition-colors text-left"
                >
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Sessions */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Sesiones Activas
            </h3>
            <div className="space-y-3">
              {[
                { user: 'Ana Martínez', role: 'Abogada Senior', time: '2h 15m', device: 'Chrome / Windows' },
                { user: 'Carlos Ruiz', role: 'Abogado', time: '45m', device: 'Safari / Mac' },
                { user: 'admin@derecho.erp', role: 'Administrador', time: '5h 30m', device: 'Chrome / Windows' },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-theme-tertiary/30 rounded-lg">
                  <div>
                    <p className="text-theme-primary text-sm font-medium">{session.user}</p>
                    <p className="text-theme-tertiary text-xs">{session.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-theme-secondary text-xs">{session.time}</p>
                    <p className="text-theme-tertiary text-xs">{session.device}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
