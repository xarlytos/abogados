import { motion } from 'framer-motion';
import { 
  Calendar, Gavel, Phone, Archive, Clock,
  MessageSquare, Users, FileText, MapPin
} from 'lucide-react';
import { secretarioStats, agendaGeneral } from '@/data/rolesDashboardData';
import { UpcomingPrescriptionsWidget } from '@/components/prescripciones/UpcomingPrescriptionsWidget';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function SecretarioDashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-theme-primary">Gestión de Agenda</h2>
        <p className="text-theme-secondary">Organización y archivo del bufete</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secretarioStats.map((stat, index) => {
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
          {/* Agenda del Día */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                Agenda de Hoy
              </h3>
              <button className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/20 transition-colors">
                + Nueva Cita
              </button>
            </div>
            <div className="space-y-3">
              {agendaGeneral.map((evento, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-theme-tertiary/30 rounded-lg">
                  <div className="w-16 text-center">
                    <p className="text-emerald-400 font-bold">{evento.hora}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-theme-primary font-medium">{evento.evento}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        evento.estado === 'confirmado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {evento.estado}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-theme-secondary">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {evento.sala}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {evento.abogado}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audiencias de la Semana */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Gavel className="w-5 h-5 text-amber-500" />
              Audiencias de la Semana
            </h3>
            <div className="space-y-3">
              {[
                { fecha: 'Lunes 13', hora: '09:00', juzgado: 'Juzgado 5°, Civil', caso: 'EXP-2024-001', abogado: 'Ana Martínez', preparado: true },
                { fecha: 'Martes 14', hora: '10:00', juzgado: 'Juzgado 3°, Laboral', caso: 'EXP-2024-003', abogado: 'Ana Martínez', preparado: false },
                { fecha: 'Jueves 16', hora: '11:30', juzgado: 'Juzgado 1°, Penal', caso: 'EXP-2024-006', abogado: 'Carlos Ruiz', preparado: false },
              ].map((audiencia, index) => (
                <div key={index} className={`p-4 rounded-lg ${
                  !audiencia.preparado ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-theme-tertiary/30'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-medium">{audiencia.fecha}, {audiencia.hora}</span>
                        {!audiencia.preparado && (
                          <span className="flex items-center gap-1 text-xs text-amber-400">
                            <Clock className="w-3 h-3" />
                            Pendiente preparar
                          </span>
                        )}
                      </div>
                      <p className="text-theme-primary mt-1">{audiencia.juzgado}</p>
                      <p className="text-theme-secondary text-sm">{audiencia.caso} • {audiencia.abogado}</p>
                    </div>
                    <button className={`px-3 py-1 rounded text-sm ${
                      audiencia.preparado 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                    }`}>
                      {audiencia.preparado ? 'Preparado' : 'Preparar'}
                    </button>
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
            <div className="space-y-2">
              {[
                { icon: Calendar, label: 'Nueva Cita', color: 'text-emerald-400' },
                { icon: Phone, label: 'Registrar Llamada', color: 'text-blue-400' },
                { icon: FileText, label: 'Digitalizar Doc', color: 'text-amber-400' },
                { icon: MessageSquare, label: 'Enviar Recordatorio', color: 'text-purple-400' },
                { icon: Gavel, label: 'Preparar Audiencia', color: 'text-cyan-400' },
                { icon: Users, label: 'Actualizar Directorio', color: 'text-rose-400' },
              ].map((action, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-3 text-theme-secondary hover:bg-theme-tertiary rounded-lg transition-colors text-left"
                >
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Llamadas Pendientes */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-500" />
              Llamadas por Devolver
            </h3>
            <div className="space-y-2">
              {[
                { nombre: 'Juan Martínez', asunto: 'Consulta sobre EXP-2024-001', hora: '10:30' },
                { nombre: 'María García', asunto: 'Confirmar cita', hora: '11:00' },
                { nombre: 'Juzgado 5°', asunto: 'Requerimiento documentación', hora: '12:00' },
                { nombre: 'Notaría Pérez', asunto: 'Escritura lista', hora: '16:00' },
              ].map((llamada, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-theme-tertiary/30 rounded-lg">
                  <div>
                    <p className="text-theme-primary text-sm">{llamada.nombre}</p>
                    <p className="text-theme-tertiary text-xs">{llamada.asunto}</p>
                  </div>
                  <span className="text-theme-secondary text-xs">{llamada.hora}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Archivo Pendiente */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Archive className="w-5 h-5 text-purple-500" />
              Pendientes de Archivo
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-theme-secondary">Por digitalizar</span>
                <span className="text-theme-primary font-medium">18</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-theme-secondary">Por clasificar</span>
                <span className="text-theme-primary font-medium">7</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-theme-secondary">Por subir al sistema</span>
                <span className="text-theme-primary font-medium">12</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
