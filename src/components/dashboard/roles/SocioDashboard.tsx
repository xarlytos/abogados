import { motion } from 'framer-motion';
import { 
  TrendingUp, FolderOpen, CreditCard, Users, Target,
  ArrowUpRight, ArrowDownRight, AlertCircle
} from 'lucide-react';
import { socioStats, casosAltoValor } from '@/data/rolesDashboardData';
import { financialData } from '@/data/dashboardData';
import { UpcomingPrescriptionsWidget } from '@/components/prescripciones/UpcomingPrescriptionsWidget';
import { AlertasEscalonadasPanel } from '@/components/prescripciones/AlertasEscalonadasPanel';
import { ConflictosAlertWidget } from '@/components/conflictos/ConflictosAlertWidget';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B'];

export function SocioDashboard() {
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
          <h2 className="text-2xl font-bold text-theme-primary">Dashboard Ejecutivo</h2>
          <p className="text-theme-secondary">Visión general del bufete</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-theme-card border border-theme rounded-lg text-theme-secondary text-sm">
            <option>Este Mes</option>
            <option>Último Trimestre</option>
            <option>Este Año</option>
          </select>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socioStats.map((stat, index) => {
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

      {/* Alertas Escalonadas Panel */}
      <motion.div variants={itemVariants}>
        <AlertasEscalonadasPanel />
      </motion.div>

      {/* Prescripciones Widget */}
      <motion.div variants={itemVariants}>
        <UpcomingPrescriptionsWidget maxItems={5} showViewAll={true} />
      </motion.div>

      {/* Conflictos Widget */}
      <motion.div variants={itemVariants}>
        <ConflictosAlertWidget />
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="p-5 bg-theme-card border border-theme rounded-xl">
          <h3 className="text-lg font-semibold text-theme-primary mb-4">Ingresos vs Objetivos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}
                  labelStyle={{ color: '#94A3B8' }}
                />
                <Area type="monotone" dataKey="value" stroke="#F59E0B" fillOpacity={1} fill="url(#colorValue)" name="Ingresos" />
                <Area type="monotone" dataKey="target" stroke="#3B82F6" fill="none" strokeDasharray="5 5" name="Objetivo" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Case Types Distribution */}
        <div className="p-5 bg-theme-card border border-theme rounded-xl">
          <h3 className="text-lg font-semibold text-theme-primary mb-4">Distribución por Tipo de Caso</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialData.caseTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {financialData.caseTypes.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {financialData.caseTypes.map((type, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-theme-secondary text-sm">{type.type}</span>
                  <span className="text-theme-primary text-sm font-medium">{type.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* High Value Cases */}
      <motion.div variants={itemVariants}>
        <div className="p-5 bg-theme-card border border-theme rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" />
              Casos de Alto Valor
            </h3>
            <button className="text-amber-500 text-sm hover:text-amber-400">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-theme">
                  <th className="pb-3 text-theme-secondary text-sm font-medium">Expediente</th>
                  <th className="pb-3 text-theme-secondary text-sm font-medium">Caso</th>
                  <th className="pb-3 text-theme-secondary text-sm font-medium">Cliente</th>
                  <th className="pb-3 text-theme-secondary text-sm font-medium">Valor</th>
                  <th className="pb-3 text-theme-secondary text-sm font-medium">Abogado</th>
                  <th className="pb-3 text-theme-secondary text-sm font-medium">Progreso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {casosAltoValor.map((caso, index) => (
                  <tr key={index} className="group">
                    <td className="py-3 text-amber-500 text-sm font-medium">{caso.id}</td>
                    <td className="py-3 text-theme-primary text-sm">{caso.title}</td>
                    <td className="py-3 text-theme-secondary text-sm">{caso.cliente}</td>
                    <td className="py-3 text-emerald-400 text-sm font-medium">{caso.valor}</td>
                    <td className="py-3 text-theme-secondary text-sm">{caso.abogado}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-theme-tertiary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${caso.progreso}%` }}
                          />
                        </div>
                        <span className="text-theme-secondary text-xs">{caso.progreso}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Alerts & Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Alerts */}
        <div className="lg:col-span-2 p-5 bg-theme-card border border-theme rounded-xl">
          <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Alertas que Requieren Atención
          </h3>
          <div className="space-y-3">
            {[
              { type: 'critical', message: 'Factura #234 vencida hace 45 días - Cliente: García & Asociados', time: 'Hace 2h' },
              { type: 'warning', message: 'Plazo próximo a vencer en EXP-2024-006 (Delito fiscal)', time: 'Hace 4h' },
              { type: 'warning', message: 'Abogado Senior con baja productividad esta semana', time: 'Hace 1d' },
            ].map((alert, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                alert.type === 'critical' ? 'bg-red-500/10 border border-red-500/20' : 'bg-amber-500/10 border border-amber-500/20'
              }`}>
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${alert.type === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                <div className="flex-1">
                  <p className="text-theme-primary text-sm">{alert.message}</p>
                  <p className="text-theme-tertiary text-xs mt-1">{alert.time}</p>
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
              { icon: FolderOpen, label: 'Nuevo Caso', color: 'text-blue-400' },
              { icon: CreditCard, label: 'Aprobar Cotización', color: 'text-emerald-400' },
              { icon: TrendingUp, label: 'Reporte Ejecutivo', color: 'text-amber-400' },
              { icon: Users, label: 'Asignar Caso', color: 'text-purple-400' },
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
      </motion.div>
    </motion.div>
  );
}
