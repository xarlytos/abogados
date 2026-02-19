import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'red' | 'green' | 'blue';
  icon?: ReactNode;
  className?: string;
}

const variants = {
  default: 'bg-accent/10 text-accent border-accent/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  blue: 'bg-[#4A90E2]/10 text-[#4A90E2] border-[#4A90E2]/20',
};

export function Badge({ children, variant = 'default', icon, className = '' }: BadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${variants[variant]} ${className}`}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </motion.span>
  );
}
