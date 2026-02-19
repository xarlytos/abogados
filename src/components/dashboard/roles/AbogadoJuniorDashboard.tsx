import { motion } from 'framer-motion';
import { 
  Briefcase, CheckCircle, Timer, FileText, BookOpen, MessageSquare,
  Play, Pause
} from 'lucide-react';
import { abogadoJuniorStats } from '@/data/rolesDashboardData';
import { tasks } from '@/data/dashboardData';
import { UpcomingPrescriptionsWidget } from '@/components/prescripciones/UpcomingPrescriptionsWidget';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function AbogadoJuniorDashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-theme-primary">Mi Dashboard</h2>
        <p className="text-theme-secondary">Tareas y casos asignados</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {abogadoJuniorStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-theme-card border border-theme rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 bg-${stat.color}-500/10 rounded-lg`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-500`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-theme-primary">{stat.value}</p>
                  <p className="text-theme-secondary text-xs">{stat.label}</p>
                </div>
              </div>
              <p className="text-theme-tertiary text-xs mt-2">{stat.subtext}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Prescripciones Próximas */}
      <motion.div variants={itemVariants}>
        <UpcomingPrescriptionsWidget maxItems={3} showViewAll={true} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Active Timer */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                  <Timer className="w-5 h-5 text-cyan-500" />
                  Registro de Tiempo
                </h3>
                <p className="text-theme-secondary text-sm mt-1">EXP-2024-003 - Despido TechCorp</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-3xl font-mono font-bold text-theme-primary">02:34:18</p>
                  <p className="text-theme-tertiary text-xs">Tiempo registrado hoy: 4h 15m</p>
                </div>
                <button className="p-4 bg-cyan-500 hover:bg-cyan-400 rounded-full transition-colors">
                  <Pause className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* My Cases */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              Mis Casos Asignados
            </h3>
            <div className="space-y-3">
              {[
                { id: 'EXP-2024-018', title: 'Revisión contrato arrendamiento', cliente: 'Inmobiliaria XYZ', progreso: 45, estado: 'en_proceso', senior: 'Ana Martínez' },
                { id: 'EXP-2024-019', title: 'Investigación jurisprudencia laboral', cliente: 'Caso TechCorp', progreso: 70, estado: 'investigacion', senior: 'Ana Martínez' },
                { id: 'EXP-2024-020', title: 'Preparación demanda civil', cliente: 'Juan Pérez', progreso: 25, estado: 'borrador', senior: 'Carlos Ruiz' },
                { id: 'EXP-2024-021', title: 'Análisis de documentación', cliente: 'Empresa ABC', progreso: 15, estado: 'inicio', senior: 'Laura Soto' },
              ].map((caso, index) => (
                <div key={index} className="p-4 bg-theme-tertiary/30 rounded-lg hover:bg-theme-tertiary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 text-sm font-medium">{caso.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          caso.estado === 'en_proceso' ? 'bg-emerald-500/10 text-emerald-400' :
                          caso.estado === 'investigacion' ? 'bg-blue-500/10 text-blue-400' :
                          caso.estado === 'borrador' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-theme-tertiary text-theme-secondary'
                        }`}>
                          {caso.estado}
                        </span>
                      </div>
                      <p className="text-theme-primary font-medium mt-1">{caso.title}</p>
                      <p className="text-theme-secondary text-sm">{caso.cliente}</p>
                      <p className="text-theme-tertiary text-xs mt-1">Supervisor: <span className="text-amber-400">{caso.senior}</span></p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-theme-secondary mb-1">
                      <span>Progreso</span>
                      <span>{caso.progreso}%</span>
                    </div>
                    <div className="h-1.5 bg-theme-tertiary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${caso.progreso}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents in Review */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Documentos en Revisión
            </h3>
            <div className="space-y-3">
              {[
                { nombre: 'Escrito de demanda - EXP-2024-018', estado: 'en_revision', fecha: 'Enviado hace 2 días', senior: 'Ana Martínez' },
                { nombre: 'Informe de investigación - EXP-2024-019', estado: 'aprobado', fecha: 'Aprobado ayer', senior: 'Ana Martínez' },
              ].map((doc, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-theme-tertiary/30 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    doc.estado === 'aprobado' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                  }`}>
                    <FileText className={`w-4 h-4 ${
                      doc.estado === 'aprobado' ? 'text-emerald-400' : 'text-amber-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-theme-primary text-sm">{doc.nombre}</p>
                    <p className="text-theme-tertiary text-xs">{doc.fecha} • {doc.senior}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    doc.estado === 'aprobado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {doc.estado === 'aprobado' ? 'Aprobado' : 'En revisión'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Today's Tasks */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-primary">Tareas de Hoy</h3>
              <span className="text-emerald-400 text-sm">2/4</span>
            </div>
            <div className="space-y-2">
              {tasks.slice(0, 4).map((task) => (
                <div 
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-theme-tertiary/30 rounded-lg"
                >
                  <button className={`mt-0.5 w-5 h-5 rounded border ${
                    task.completed ? 'bg-cyan-500 border-cyan-500' : 'border-theme-secondary'
                  } flex items-center justify-center`}>
                    {task.completed && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm ${task.completed ? 'text-theme-tertiary line-through' : 'text-theme-primary'}`}>
                      {task.title}
                    </p>
                    <span className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${
                      task.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                      task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-theme-tertiary text-theme-secondary'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Acciones</h3>
            <div className="space-y-2">
              {[
                { icon: Play, label: 'Iniciar Timer', color: 'text-cyan-400' },
                { icon: CheckCircle, label: 'Completar Tarea', color: 'text-emerald-400' },
                { icon: FileText, label: 'Subir Borrador', color: 'text-amber-400' },
                { icon: MessageSquare, label: 'Solicitar Ayuda', color: 'text-purple-400' },
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

          {/* Templates */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Plantillas Útiles
            </h3>
            <div className="space-y-2">
              {[
                'Contrato de arrendamiento',
                'Demanda civil - formato',
                'Carta de formalización',
                'Minuta de reunión',
              ].map((template, i) => (
                <button
                  key={i}
                  className="w-full text-left p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary/50 rounded-lg transition-colors text-sm"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
