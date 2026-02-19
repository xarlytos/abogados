import { motion } from 'framer-motion';
import { 
  Calendar, Users, Phone, UserCheck, Clock, MessageSquare,
  CheckCircle, Briefcase
} from 'lucide-react';
import { recepcionistaStats, salaEspera } from '@/data/rolesDashboardData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function RecepcionistaDashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-theme-primary">Recepción</h2>
        <p className="text-theme-secondary">Atención a visitantes y gestión de citas</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recepcionistaStats.map((stat, index) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Sala de Espera */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                Sala de Espera
              </h3>
              <button className="px-3 py-1.5 bg-pink-500/10 text-pink-400 rounded-lg text-sm hover:bg-pink-500/20 transition-colors">
                + Registrar Visita
              </button>
            </div>
            {salaEspera.length > 0 ? (
              <div className="space-y-3">
                {salaEspera.map((visitante, index) => (
                  <div key={index} className="p-4 bg-theme-tertiary/30 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-theme-primary font-medium">{visitante.nombre}</p>
                        <p className="text-theme-secondary text-sm">{visitante.motivo}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-theme-tertiary">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Llegó: {visitante.horaLlegada}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {visitante.abogado}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded ${
                          parseInt(visitante.tiempoEspera) > 15 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {visitante.tiempoEspera} espera
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm hover:bg-blue-500/20 transition-colors">
                        Notificar Llegada
                      </button>
                      <button className="flex-1 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/20 transition-colors">
                        Atendido
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-theme-tertiary">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay visitantes en sala de espera</p>
              </div>
            )}
          </div>

          {/* Agenda del Día */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Agenda de Hoy
              </h3>
              <button className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-sm hover:bg-blue-500/20 transition-colors">
                + Nueva Cita
              </button>
            </div>
            <div className="space-y-2">
              {[
                { hora: '09:00', cliente: 'Juan Martínez', tipo: 'Entrega documentos', abogado: 'Ana Martínez', estado: 'confirmada' },
                { hora: '10:30', cliente: 'Empresa ABC', tipo: 'Consulta inicial', abogado: 'Carlos Ruiz', estado: 'confirmada' },
                { hora: '12:00', cliente: 'María García', tipo: 'Seguimiento caso', abogado: 'Pendiente asignar', estado: 'pendiente' },
                { hora: '16:00', cliente: 'Pedro Sánchez', tipo: 'Revisión contrato', abogado: 'Laura Soto', estado: 'confirmada' },
              ].map((cita, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-theme-tertiary/30 rounded-lg">
                  <div className="w-14 text-center">
                    <p className="text-blue-400 font-medium text-sm">{cita.hora}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-theme-primary font-medium">{cita.cliente}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        cita.estado === 'confirmada' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {cita.estado}
                      </span>
                    </div>
                    <p className="text-theme-secondary text-sm">{cita.tipo}</p>
                    <p className="text-theme-tertiary text-xs">{cita.abogado}</p>
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
                { icon: Users, label: 'Registrar Visita', color: 'text-blue-400' },
                { icon: Calendar, label: 'Programar Cita', color: 'text-emerald-400' },
                { icon: Phone, label: 'Registrar Llamada', color: 'text-amber-400' },
                { icon: UserCheck, label: 'Nuevo Prospecto', color: 'text-purple-400' },
                { icon: MessageSquare, label: 'Notificar Llegada', color: 'text-cyan-400' },
                { icon: CheckCircle, label: 'Confirmar Cita', color: 'text-rose-400' },
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

          {/* Abogados Disponibles */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-500" />
              Disponibilidad
            </h3>
            <div className="space-y-2">
              {[
                { nombre: 'Ana Martínez', rol: 'Senior', disponible: true },
                { nombre: 'Carlos Ruiz', rol: 'Abogado', disponible: true },
                { nombre: 'Laura Soto', rol: 'Paralegal', disponible: true },
                { nombre: 'Pedro Gómez', rol: 'Junior', disponible: false },
              ].map((abogado, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-theme-tertiary/30 rounded-lg">
                  <div>
                    <p className="text-theme-primary text-sm">{abogado.nombre}</p>
                    <p className="text-theme-tertiary text-xs">{abogado.rol}</p>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${abogado.disponible ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Llamadas Pendientes */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-500" />
              Llamadas Pendientes
            </h3>
            <div className="space-y-2">
              {[
                { nombre: 'Juan Pérez', asunto: 'Consulta disponibilidad', hora: '10:00' },
                { nombre: 'Empresa XYZ', asunto: 'Solicitar cita', hora: '11:30' },
                { nombre: 'María López', asunto: 'Confirmar dirección', hora: '14:00' },
                { nombre: 'Desconocido', asunto: 'Dejó mensaje', hora: '15:00' },
              ].map((llamada, i) => (
                <div key={i} className="flex items-center justify-between p-2 text-sm">
                  <div>
                    <p className="text-theme-secondary">{llamada.nombre}</p>
                    <p className="text-theme-tertiary text-xs">{llamada.asunto}</p>
                  </div>
                  <span className="text-theme-secondary text-xs">{llamada.hora}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
