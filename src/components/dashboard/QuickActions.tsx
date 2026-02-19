import type { LucideIcon } from 'lucide-react';
import { quickActions } from '@/data/dashboardData';

interface QuickAction {
  icon: LucideIcon;
  label: string;
  color: string;
}

export function QuickActions() {
  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h2>
      <div className="grid grid-cols-2 gap-3">
        {(quickActions as QuickAction[]).map((action) => (
          <button
            key={action.label}
            className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-amber-500/30 hover:bg-slate-800/50 transition-all text-center group"
          >
            <action.icon className={`w-6 h-6 mx-auto mb-2 transition-transform group-hover:scale-110 ${
              action.color === 'blue' ? 'text-blue-500' :
              action.color === 'purple' ? 'text-purple-500' :
              action.color === 'emerald' ? 'text-emerald-500' :
              'text-amber-500'
            }`} />
            <span className="text-xs text-slate-300">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
