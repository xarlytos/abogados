import { motion } from 'framer-motion';
import { 
  UserCheck, Timer, ClipboardList, Clock,
  MessageSquare, FileText, Calendar, CheckCircle,
  TrendingUp
} from 'lucide-react';
import { abogadoSeniorStats, casosJuniorSupervision } from '@/data/rolesDashboardData';
import { upcomingDeadlines, tasks } from '@/data/dashboardData';
import { UpcomingPrescriptionsWidget } from '@/components/prescripciones/UpcomingPrescriptionsWidget';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function AbogadoSeniorDashboard() {
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
          <h2 className="text-2xl font-bold text-theme-primary">Mi Espacio de Trabajo</h2>
          <p className="text-theme-secondary">Gestión de casos y supervisión</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm hover:bg-blue-500/20 transition-colors">
            Registrar Tiempo
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {abogadoSeniorStats.map((stat, index) => {
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
                    <span className={`text-sm ${
                      stat.trend === 'up' ? 'text-emerald-400' : 
                      stat.trend === 'down' ? 'text-red-400' : 'text-theme-secondary'
                    }`}>
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

      {/* Prescripciones Próximas - Alertas Críticas */}
      <motion.div variants={itemVariants}>
        <UpcomingPrescriptionsWidget maxItems={3} showViewAll={true} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - My Cases & Tasks */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Junior Supervision */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-500" />
                Casos de Junior a Supervisar
              </h3>
              <button className="text-theme-secondary hover:text-theme-primary text-sm">Ver todos</button>
            </div>
            <div className="space-y-3">
              {casosJuniorSupervision.map((caso, index) => (
                <div key={index} className="p-4 bg-theme-tertiary/30 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-theme-primary font-medium">{caso.title}</p>
                      <p className="text-theme-secondary text-sm">{caso.id} • Asignado a: <span className="text-blue-400">{caso.junior}</span></p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      caso.estado === 'revisión' ? 'bg-amber-500/10 text-amber-400' :
                      caso.estado === 'borrador' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-slate-500/10 text-theme-secondary'
                    }`}>
                      {caso.estado}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-theme-tertiary rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${caso.progreso}%` }} />
                      </div>
                      <span className="text-theme-secondary text-xs">{caso.progreso}%</span>
                    </div>
                    <span className="text-theme-tertiary text-xs">{caso.ultimaActividad}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                Próximos Vencimientos
              </h3>
              <button className="text-theme-secondary hover:text-theme-primary text-sm">Ver calendario</button>
            </div>
            <div className="space-y-2">
              {upcomingDeadlines.slice(0, 4).map((deadline, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    deadline.urgent ? 'bg-red-500/10 border border-red-500/20' : 'bg-theme-tertiary/30'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${deadline.urgent ? 'bg-red-500/20' : 'bg-theme-tertiary'}`}>
                    <Clock className={`w-4 h-4 ${deadline.urgent ? 'text-red-400' : 'text-theme-secondary'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${deadline.urgent ? 'text-red-400' : 'text-theme-primary'}`}>
                      {deadline.title}
                    </p>
                    <p className="text-theme-tertiary text-xs">{deadline.case} • {deadline.caseTitle}</p>
                  </div>
                  <span className={`text-xs ${deadline.urgent ? 'text-red-400' : 'text-theme-secondary'}`}>
                    {deadline.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Today's Tasks */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-500" />
                Mis Tareas
              </h3>
              <button className="text-blue-400 text-sm hover:text-blue-300">+ Nueva</button>
            </div>
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <div 
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-theme-tertiary/30 rounded-lg group hover:bg-theme-tertiary/50 transition-colors"
                >
                  <button className={`mt-0.5 w-5 h-5 rounded border ${
                    task.completed ? 'bg-blue-500 border-blue-500' : 'border-theme-secondary'
                  } flex items-center justify-center`}>
                    {task.completed && <CheckCircle className="w-3.5 h-3.5 text-theme-primary" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${task.completed ? 'text-theme-tertiary line-through' : 'text-theme-primary'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                        task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-500/10 text-theme-secondary'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-theme-tertiary text-xs">{task.case}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Timer, label: 'Tiempo', color: 'bg-blue-500/10 text-blue-400' },
                { icon: FileText, label: 'Documento', color: 'bg-emerald-500/10 text-emerald-400' },
                { icon: ClipboardList, label: 'Tarea', color: 'bg-amber-500/10 text-amber-400' },
                { icon: MessageSquare, label: 'Mensaje', color: 'bg-purple-500/10 text-purple-400' },
                { icon: Calendar, label: 'Audiencia', color: 'bg-cyan-500/10 text-cyan-400' },
                { icon: UserCheck, label: 'Revisar', color: 'bg-rose-500/10 text-rose-400' },
              ].map((action, i) => (
                <button
                  key={i}
                  className="flex flex-col items-center gap-2 p-3 bg-theme-tertiary/30 hover:bg-theme-tertiary/50 rounded-lg transition-colors"
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-theme-secondary text-xs">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Progreso Semanal
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-theme-secondary">Horas Facturables</span>
                  <span className="text-theme-primary">38/40h</span>
                </div>
                <div className="h-2 bg-theme-tertiary rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-theme-secondary">Tareas Completadas</span>
                  <span className="text-theme-primary">12/15</span>
                </div>
                <div className="h-2 bg-theme-tertiary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-theme-secondary">Casos Avanzados</span>
                  <span className="text-theme-primary">8/10</span>
                </div>
                <div className="h-2 bg-theme-tertiary rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
