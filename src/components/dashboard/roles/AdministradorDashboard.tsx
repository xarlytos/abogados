import { motion } from 'framer-motion';
import { 
  Users, Receipt, PieChart,
  Wallet, CheckCircle, Clock, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { administradorStats } from '@/data/rolesDashboardData';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ingresosGastosData = [
  { mes: 'Ene', ingresos: 65000, gastos: 42000 },
  { mes: 'Feb', ingresos: 72000, gastos: 45000 },
  { mes: 'Mar', ingresos: 68000, gastos: 43000 },
  { mes: 'Abr', ingresos: 78000, gastos: 48000 },
  { mes: 'May', ingresos: 82000, gastos: 50000 },
  { mes: 'Jun', ingresos: 85400, gastos: 48000 },
];

export function AdministradorDashboard() {
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
          <h2 className="text-2xl font-bold text-theme-primary">Administración</h2>
          <p className="text-theme-secondary">Gestión operativa y financiera</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-theme-card border border-theme rounded-lg text-theme-secondary text-sm">
            <option>Enero 2026</option>
            <option>Febrero 2026</option>
            <option>Marzo 2026</option>
          </select>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {administradorStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
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
                    <TrendIcon className={`w-4 h-4 ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`} />
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-theme-tertiary text-xs mt-1">{stat.subtext}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-500/10 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Ingresos vs Gastos */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Ingresos vs Gastos</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ingresosGastosData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="mes" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}
                    labelStyle={{ color: '#94A3B8' }}
                  />
                  <Bar dataKey="ingresos" fill="#10B981" name="Ingresos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gastos" fill="#EF4444" name="Gastos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Facturas Pendientes */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                Facturación Pendiente
              </h3>
              <button className="text-amber-400 text-sm hover:text-amber-300">Ver todas</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-theme">
                    <th className="pb-3 text-theme-secondary text-sm font-medium">Factura</th>
                    <th className="pb-3 text-theme-secondary text-sm font-medium">Cliente</th>
                    <th className="pb-3 text-theme-secondary text-sm font-medium">Monto</th>
                    <th className="pb-3 text-theme-secondary text-sm font-medium">Vencimiento</th>
                    <th className="pb-3 text-theme-secondary text-sm font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    { id: 'FAC-2026-045', cliente: 'Empresa ABC', monto: '€12,500', vencimiento: '15 Ene', estado: 'vencida', dias: 5 },
                    { id: 'FAC-2026-044', cliente: 'TechCorp', monto: '€8,300', vencimiento: '18 Ene', estado: 'pendiente', dias: 0 },
                    { id: 'FAC-2026-043', cliente: 'Inmobiliaria XYZ', monto: '€15,000', vencimiento: '20 Ene', estado: 'pendiente', dias: 0 },
                    { id: 'FAC-2026-042', cliente: 'García & Asociados', monto: '€5,200', vencimiento: '10 Ene', estado: 'vencida', dias: 10 },
                  ].map((factura, index) => (
                    <tr key={index}>
                      <td className="py-3 text-theme-secondary text-sm">{factura.id}</td>
                      <td className="py-3 text-theme-secondary text-sm">{factura.cliente}</td>
                      <td className="py-3 text-theme-primary text-sm font-medium">{factura.monto}</td>
                      <td className="py-3 text-theme-secondary text-sm">{factura.vencimiento}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          factura.estado === 'vencida' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {factura.estado === 'vencida' ? `Vencida (${factura.dias}d)` : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                { icon: Receipt, label: 'Generar Factura', color: 'text-blue-400' },
                { icon: Wallet, label: 'Registrar Pago', color: 'text-emerald-400' },
                { icon: CheckCircle, label: 'Aprobar Gasto', color: 'text-amber-400' },
                { icon: Users, label: 'Generar Nómina', color: 'text-purple-400' },
                { icon: PieChart, label: 'Reporte Financiero', color: 'text-cyan-400' },
                { icon: Receipt, label: 'Gestionar Proveedor', color: 'text-rose-400' },
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

          {/* Próximos Pagos */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              Próximos Pagos
            </h3>
            <div className="space-y-3">
              {[
                { concepto: 'Nómina empleados', fecha: '15 Ene', monto: '€32,000', tipo: 'nomina' },
                { concepto: 'Renta oficina', fecha: '20 Ene', monto: '€4,500', tipo: 'gasto' },
                { concepto: 'Servicios AWS', fecha: '22 Ene', monto: '€450', tipo: 'servicio' },
                { concepto: 'Proveedor papelería', fecha: '25 Ene', monto: '€1,200', tipo: 'proveedor' },
              ].map((pago, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-theme-tertiary/30 rounded-lg">
                  <div>
                    <p className="text-theme-primary text-sm">{pago.concepto}</p>
                    <p className="text-theme-tertiary text-xs">{pago.fecha}</p>
                  </div>
                  <span className="text-theme-primary text-sm font-medium">{pago.monto}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Presupuesto */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyan-500" />
              Ejecución Presupuestal
            </h3>
            <div className="space-y-4">
              {[
                { area: 'Gastos operativos', ejecutado: 85, total: 100 },
                { area: 'Marketing', ejecutado: 60, total: 100 },
                { area: 'Capacitación', ejecutado: 40, total: 100 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-theme-secondary">{item.area}</span>
                    <span className="text-theme-primary">{item.ejecutado}%</span>
                  </div>
                  <div className="h-2 bg-theme-tertiary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.ejecutado > 90 ? 'bg-red-500' : 
                        item.ejecutado > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.ejecutado}%` }}
                    />
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
