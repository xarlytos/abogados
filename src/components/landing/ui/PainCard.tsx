import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PainCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  stat: string;
  delay?: number;
}

export function PainCard({ icon, title, description, stat, delay = 0 }: PainCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-theme-secondary border border-theme rounded-2xl p-6 hover:border-accent/50 transition-all duration-500"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-transparent rounded-2xl transition-all duration-500" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-4 text-accent group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <h3 className="text-xl font-bold text-theme-primary mb-2 group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-theme-secondary text-sm mb-4 leading-relaxed">
          {description}
        </p>
        
        <div className="pt-4 border-t border-theme">
          <span className="text-2xl font-bold text-accent">{stat}</span>
        </div>
      </div>
    </motion.div>
  );
}
