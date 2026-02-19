import { motion } from 'framer-motion';
import type { ElementType } from 'react';

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  icon: ElementType;
  delay: number;
}

export function ProcessStep({ number, title, description, icon: Icon, delay }: ProcessStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="relative"
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          className="relative w-20 h-20 mb-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl blur-xl" />
          <div className="relative w-full h-full bg-gradient-to-br from-theme-tertiary to-theme-secondary rounded-2xl flex items-center justify-center border border-theme">
            <Icon className="w-8 h-8 text-accent" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-theme-primary font-bold text-sm">
            {number}
          </div>
        </motion.div>
        <h3 className="font-bold text-theme-primary text-lg mb-2">{title}</h3>
        <p className="text-theme-secondary text-sm max-w-xs">{description}</p>
      </div>
    </motion.div>
  );
}
