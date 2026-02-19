import { motion } from 'framer-motion';
import { 
  ClipboardList, FileText, Users, BookOpen, Calendar,
  MessageSquare, Archive, AlertCircle, Clock
} from 'lucide-react';
import { paralegalStats, tramitesEnCurso } from '@/data/rolesDashboardData';
import { UpcomingPrescriptionsWidget } from '@/components/prescripciones/UpcomingPrescriptionsWidget';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function ParalegalDashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-theme-primary">Panel de Trámites</h2>
        <p className="text-theme-secondary">Gestión de documentación y apoyo legal</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {paralegalStats.map((stat, index) => {
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
          {/* Trámites en Curso */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-teal-500" />
                Trámites en Curso
              </h3>
              <button className="text-teal-400 text-sm hover:text-teal-300">Ver todos</button>
            </div>
            <div className="space-y-3">
              {tramitesEnCurso.map((tramite, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${
                    tramite.prioridad === 'alta' ? 'bg-red-500/5 border border-red-500/20' : 'bg-theme-tertiary/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-teal-400 text-sm font-medium">{tramite.id}</span>
                        {tramite.prioridad === 'alta' && (
                          <span className="flex items-center gap-1 text-xs text-red-400">
                            <AlertCircle className="w-3 h-3" />
                            Urgente
                          </span>
                        )}
                      </div>
                      <p className="text-theme-primary font-medium mt-1">{tramite.tipo}</p>
                      <p className="text-theme-secondary text-sm">{tramite.caso}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        tramite.estado === 'en_proceso' ? 'bg-blue-500/10 text-blue-400' :
                        tramite.estado === 'pendiente' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {tramite.estado}
                      </span>
                      <p className="text-theme-tertiary text-xs mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tramite.fechaLimite}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documentos Pendientes */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Documentos para Organizar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { nombre: 'Escritura compraventa.pdf', caso: 'EXP-2024-015', fecha: 'Recibido hoy' },
                { nombre: 'Poder notarial.pdf', caso: 'EXP-2024-012', fecha: 'Recibido ayer' },
                { nombre: 'Contrato de trabajo.pdf', caso: 'EXP-2024-003', fecha: 'Recibido hace 2 días' },
                { nombre: 'Facturas gastos.pdf', caso: 'EXP-2024-008', fecha: 'Recibido hace 3 días' },
              ].map((doc, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-theme-tertiary/30 rounded-lg">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <FileText className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-theme-primary text-sm truncate">{doc.nombre}</p>
                    <p className="text-theme-tertiary text-xs">{doc.caso} • {doc.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Quick Actions */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: FileText, label: 'Subir Doc', color: 'bg-blue-500/10 text-blue-400' },
                { icon: ClipboardList, label: 'Actualizar', color: 'bg-emerald-500/10 text-emerald-400' },
                { icon: BookOpen, label: 'Plantilla', color: 'bg-amber-500/10 text-amber-400' },
                { icon: Calendar, label: 'Cita', color: 'bg-purple-500/10 text-purple-400' },
                { icon: MessageSquare, label: 'Recordar', color: 'bg-cyan-500/10 text-cyan-400' },
                { icon: Archive, label: 'Archivar', color: 'bg-rose-500/10 text-rose-400' },
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

          {/* Cases I'm Supporting */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Casos de Apoyo
            </h3>
            <div className="space-y-2">
              {[
                { id: 'EXP-2024-001', titulo: 'Reclamación Banco', abogado: 'Ana Martínez' },
                { id: 'EXP-2024-003', titulo: 'Despido TechCorp', abogado: 'Ana Martínez' },
                { id: 'EXP-2024-005', titulo: 'Constitución SL', abogado: 'Laura Soto' },
                { id: 'EXP-2024-008', titulo: 'Propiedad Intelectual', abogado: 'Pedro Gómez' },
              ].map((caso, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-theme-tertiary/30 rounded-lg">
                  <div>
                    <p className="text-theme-primary text-sm">{caso.id}</p>
                    <p className="text-theme-secondary text-xs">{caso.titulo}</p>
                  </div>
                  <span className="text-theme-tertiary text-xs">{caso.abogado}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vencimientos */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Vencimientos Próximos
            </h3>
            <div className="space-y-2">
              {[
                { tramite: 'Entrega documentación', fecha: 'Hoy', caso: 'EXP-2024-003' },
                { tramite: 'Inscripción Registro', fecha: '18 Ene', caso: 'EXP-2024-005' },
                { tramite: 'Solicitud certificación', fecha: '20 Ene', caso: 'EXP-2024-012' },
              ].map((venc, i) => (
                <div key={i} className="flex items-center justify-between p-2 text-sm">
                  <div>
                    <p className="text-theme-secondary">{venc.tramite}</p>
                    <p className="text-theme-tertiary text-xs">{venc.caso}</p>
                  </div>
                  <span className={`text-xs ${venc.fecha === 'Hoy' ? 'text-red-400' : 'text-amber-400'}`}>
                    {venc.fecha}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
