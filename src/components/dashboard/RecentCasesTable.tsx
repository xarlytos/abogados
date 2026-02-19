import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Plus, ArrowRight } from 'lucide-react';
import { recentCases, quickStats } from '@/data/dashboardData';
import { getStatusColor, getStatusText } from '@/lib/utils';

interface QuickStat {
  label: string;
  value: string;
  color: string;
  icon: LucideIcon;
}

interface Case {
  id: string;
  title: string;
  client: string;
  status: string;
  date: string;
  amount: string;
  priority: string;
  progress: number;
  type: string;
}

export function RecentCasesTable() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Vista general' },
    { id: 'cases', label: 'Expedientes' },
    { id: 'finance', label: 'Finanzas' },
  ];

  return (
    <div className="bg-theme-secondary/60 border border-theme rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-theme-primary">Expedientes Recientes</h2>
          <p className="text-sm text-theme-secondary mt-1">6 expedientes activos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {(quickStats as QuickStat[]).map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-theme-tertiary rounded-lg">
                <stat.icon className={`w-3.5 h-3.5 ${
                  stat.color === 'emerald' ? 'text-emerald-500' :
                  stat.color === 'red' ? 'text-red-500' :
                  'text-amber-500'
                }`} />
                <span className="text-xs font-medium text-theme-primary">{stat.value}</span>
              </div>
            ))}
          </div>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-amber-600 transition-colors">
            <Plus className="w-4 h-4" />
            Nuevo
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-theme">
        <div className="flex items-center gap-2 p-1 bg-theme-secondary/60 border border-theme rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-theme">
              <th className="text-left py-4 px-6 text-xs font-medium text-theme-secondary uppercase">Expediente</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-theme-secondary uppercase">Cliente</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-theme-secondary uppercase hidden md:table-cell">Tipo</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-theme-secondary uppercase">Estado</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-theme-secondary uppercase">Progreso</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-theme-secondary uppercase">Importe</th>
            </tr>
          </thead>
          <tbody>
            {(recentCases as Case[]).map((case_) => (
              <tr 
                key={case_.id} 
                className="border-b border-theme/50 hover:bg-theme-hover/30 transition-colors cursor-pointer group"
              >
                <td className="py-4 px-6">
                  <div>
                    <p className="text-sm font-medium text-theme-primary group-hover:text-accent transition-colors">{case_.title}</p>
                    <p className="text-xs text-theme-tertiary">{case_.id}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-theme-tertiary to-theme-hover rounded-full flex items-center justify-center text-xs font-medium text-theme-secondary border border-theme">
                      {case_.client.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <span className="text-sm text-theme-secondary">{case_.client}</span>
                  </div>
                </td>
                <td className="py-4 px-6 hidden md:table-cell">
                  <span className="text-xs text-theme-secondary px-2 py-1 bg-theme-tertiary rounded-full">{case_.type}</span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(case_.status)}`}>
                    {getStatusText(case_.status)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-theme-tertiary rounded-full overflow-hidden w-20">
                      <div 
                        className={`h-full rounded-full ${
                          case_.progress === 100 ? 'bg-emerald-500' :
                          case_.progress > 50 ? 'bg-amber-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${case_.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-theme-tertiary w-8">{case_.progress}%</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-medium text-theme-primary">{case_.amount}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-theme">
        <button className="w-full py-3 text-sm text-accent hover:text-amber-600 font-medium flex items-center justify-center gap-2 transition-colors">
          Ver todos los expedientes
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
