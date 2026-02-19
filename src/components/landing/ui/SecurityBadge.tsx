import { motion } from 'framer-motion';
import type { ElementType } from 'react';

interface SecurityBadgeProps {
  icon: ElementType;
  title: string;
  description: string;
}

export function SecurityBadge({ icon: Icon, title, description }: SecurityBadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-3 p-4 bg-theme-secondary/60 border border-theme rounded-xl hover:border-emerald-500/30 transition-colors"
    >
      <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-emerald-500" />
      </div>
      <div>
        <h4 className="font-semibold text-theme-primary text-sm">{title}</h4>
        <p className="text-theme-secondary text-xs">{description}</p>
      </div>
    </motion.div>
  );
}
