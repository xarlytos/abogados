import { motion } from 'framer-motion';
import type { ElementType } from 'react';

interface IntegrationCardProps {
  name: string;
  category: string;
  icon: ElementType;
  description: string;
  delay: number;
}

export function IntegrationCard({ name, category, icon: Icon, description, delay }: IntegrationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
      className="p-5 bg-theme-secondary/60 border border-theme rounded-xl hover:border-accent/30 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-theme-tertiary rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
          <Icon className="w-6 h-6 text-theme-secondary group-hover:text-accent transition-colors" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-accent mb-1">{category}</div>
          <h4 className="font-semibold text-theme-primary">{name}</h4>
          <p className="text-theme-secondary text-sm mt-1">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
