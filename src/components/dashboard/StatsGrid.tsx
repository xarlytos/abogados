import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { stats } from '@/data/dashboardData';
import { getColorClass } from '@/lib/utils';

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: string;
  subtext: string;
}

export function StatsGrid() {
  return (
    <div className="px-6 lg:px-8 pb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {(stats as Stat[]).map((stat, index: number) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 bg-theme-secondary/60 border border-theme rounded-2xl hover:border-accent/30 transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColorClass(stat.color, 'bg')}`}>
                <stat.icon className={`w-5 h-5 ${getColorClass(stat.color, 'text')}`} />
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-medium ${
                stat.trend === 'up' ? 'text-emerald-500' : 'text-amber-500'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-xl font-bold text-theme-primary mb-0.5">{stat.value}</h3>
            <p className="text-theme-secondary text-xs">{stat.label}</p>
            <p className="text-theme-tertiary text-[10px] mt-1">{stat.subtext}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
