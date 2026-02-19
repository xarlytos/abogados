import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import type { ElementType } from 'react';

interface MetricCardProps {
  value: string;
  label: string;
  sublabel: string;
  icon: ElementType;
  delay: number;
}

export function MetricCard({ value, label, sublabel, icon: Icon, delay }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="p-6 bg-theme-secondary/60 border border-theme rounded-2xl hover:border-accent/30 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-accent" />
        </div>
        <div className="flex items-center gap-1 text-sm text-emerald-500">
          <TrendingUp className="w-4 h-4" />
          <span>+12%</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-theme-primary mb-1">{value}</div>
      <div className="text-theme-secondary text-sm">{label}</div>
      <div className="text-theme-tertiary text-xs mt-2">{sublabel}</div>
    </motion.div>
  );
}
