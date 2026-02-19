import { motion } from 'framer-motion';

interface RevenueData {
  month: string;
  value: number;
  target: number;
}

interface FinancialChartProps {
  data: RevenueData[];
}

export function FinancialChart({ data }: FinancialChartProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Facturación Anual</h2>
          <p className="text-sm text-slate-400 mt-1">Comparativa con objetivos mensuales</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-slate-400">Real</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-slate-600 rounded-full" />
            <span className="text-slate-400">Objetivo</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 flex items-end gap-2">
        {data.map((item, i) => (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative w-full flex items-end justify-center gap-1 h-48">
              <div 
                className="w-2 bg-slate-700/50 rounded-full"
                style={{ height: `${(item.target / 70000) * 100}%` }}
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / 70000) * 100}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className={`w-4 rounded-full cursor-pointer transition-all ${
                  item.value >= item.target ? 'bg-emerald-500' : 'bg-amber-500'
                } group-hover:opacity-80`}
              />
            </div>
            <span className="text-xs text-slate-500">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
