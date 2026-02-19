import { motion } from 'framer-motion';
import { 
  Wallet, CreditCard, Receipt, Calculator,
  BookOpen, FileText, CheckCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { contadorStats, cumplimientoFiscal } from '@/data/rolesDashboardData';
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const flujoCajaData = [
  { dia: '1', entradas: 15000, salidas: 8000 },
  { dia: '5', entradas: 12000, salidas: 5000 },
  { dia: '10', entradas: 18000, salidas: 12000 },
  { dia: '15', entradas: 25000, salidas: 15000 },
  { dia: '20', entradas: 14000, salidas: 10000 },
  { dia: '25', entradas: 20000, salidas: 8000 },
  { dia: '30', entradas: 22000, salidas: 14000 },
];



export function ContadorDashboard() {
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
          <h2 className="text-2xl font-bold text-theme-primary">Contabilidad y Finanzas</h2>
          <p className="text-theme-secondary">Gestión contable y cumplimiento fiscal</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-theme-card border border-theme rounded-lg text-theme-secondary text-sm">
            <option>Enero 2026</option>
            <option>Febrero 2026</option>
          </select>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contadorStats.map((stat, index) => {
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
          {/* Flujo de Caja */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Flujo de Caja del Mes</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flujoCajaData}>
                  <defs>
                    <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSalidas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="dia" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}
                    labelStyle={{ color: '#94A3B8' }}
                  />
                  <Area type="monotone" dataKey="entradas" stroke="#10B981" fillOpacity={1} fill="url(#colorEntradas)" name="Entradas" />
                  <Area type="monotone" dataKey="salidas" stroke="#EF4444" fillOpacity={1} fill="url(#colorSalidas)" name="Salidas" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cuentas por Cobrar */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                Antigüedad de Saldos
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-theme">
                    <th className="pb-3 text-theme-secondary text-sm font-medium">Rango</th>
                    <th className="pb-3 text-theme-secondary text-sm font-medium">Monto</th>
                    <th className="pb-3 text-theme-secondary text-sm font-medium">%</th>
                    <th className="pb-3 text-theme-secondary text-sm font-medium">Clientes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    { rango: '0-30 días', monto: '€45,000', porcentaje: 36, clientes: 8 },
                    { rango: '31-60 días', monto: '€35,000', porcentaje: 28, clientes: 5 },
                    { rango: '61-90 días', monto: '€28,000', porcentaje: 22, clientes: 4 },
                    { rango: '> 90 días', monto: '€17,000', porcentaje: 14, clientes: 3 },
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="py-3 text-theme-secondary text-sm">{row.rango}</td>
                      <td className="py-3 text-theme-primary text-sm font-medium">{row.monto}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-theme-tertiary rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                index === 3 ? 'bg-red-500' : index === 2 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${row.porcentaje}%` }}
                            />
                          </div>
                          <span className="text-theme-secondary text-xs">{row.porcentaje}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-theme-secondary text-sm">{row.clientes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Cumplimiento Fiscal */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-green-500" />
              Cumplimiento Fiscal
            </h3>
            <div className="space-y-3">
              {cumplimientoFiscal.map((obligacion, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${
                    obligacion.diasRestantes <= 5 && obligacion.diasRestantes > 0 ? 'bg-red-500/10 border border-red-500/20' : 
                    obligacion.estado === 'vigente' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                    'bg-theme-tertiary/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-theme-primary text-sm">{obligacion.obligacion}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      obligacion.estado === 'vigente' ? 'bg-emerald-500/20 text-emerald-400' :
                      obligacion.diasRestantes <= 5 ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {obligacion.estado === 'vigente' ? 'Vigente' : `${obligacion.diasRestantes} días`}
                    </span>
                  </div>
                  <p className="text-theme-tertiary text-xs mt-1">{obligacion.fecha}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              {[
                { icon: Receipt, label: 'Emitir CFDI', color: 'text-blue-400' },
                { icon: BookOpen, label: 'Generar Póliza', color: 'text-emerald-400' },
                { icon: FileText, label: 'Asiento Contable', color: 'text-amber-400' },
                { icon: CheckCircle, label: 'Conciliar Banco', color: 'text-purple-400' },
                { icon: Calculator, label: 'Calcular Impuestos', color: 'text-cyan-400' },
                { icon: Wallet, label: 'Exportar Balanza', color: 'text-rose-400' },
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

          {/* CFDIs del Mes */}
          <div className="p-5 bg-theme-card border border-theme rounded-xl">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-cyan-500" />
              CFDIs Emitidos
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-theme-secondary">Emitidos</span>
                <span className="text-emerald-400">45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-theme-secondary">Cancelados</span>
                <span className="text-red-400">2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-theme-secondary">Con errores</span>
                <span className="text-amber-400">0</span>
              </div>
              <div className="pt-2 border-t border-theme">
                <div className="flex justify-between text-sm">
                  <span className="text-theme-secondary font-medium">Total timbrado</span>
                  <span className="text-theme-primary font-medium">€85,400</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
