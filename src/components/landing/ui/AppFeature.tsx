import { motion } from 'framer-motion';
import type { ElementType } from 'react';

interface AppFeatureProps {
  icon: ElementType;
  title: string;
  description: string;
}

export function AppFeature({ icon: Icon, title, description }: AppFeatureProps) {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      className="flex items-start gap-4 p-4 rounded-xl hover:bg-theme-tertiary/50 transition-colors"
    >
      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <div>
        <h4 className="font-semibold text-theme-primary text-sm mb-1">{title}</h4>
        <p className="text-theme-secondary text-xs">{description}</p>
      </div>
    </motion.div>
  );
}
