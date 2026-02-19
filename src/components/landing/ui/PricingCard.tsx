import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  delay: number;
}

export function PricingCard({ name, price, period, description, features, highlighted, cta, delay }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className={`relative p-8 rounded-3xl transition-all duration-300 ${highlighted
        ? 'bg-gradient-to-br from-accent to-accent text-theme-primary scale-105 shadow-2xl shadow-accent/30 z-10'
        : 'bg-theme-secondary/80 border border-theme hover:border-theme backdrop-blur-sm'
      }`}
    >
      {highlighted && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-theme-primary text-accent text-xs font-bold rounded-full border border-accent/30"
        >
          MÁS POPULAR
        </motion.div>
      )}
      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-2 ${highlighted ? 'text-theme-primary' : 'text-theme-primary'}`}>{name}</h3>
        <p className={`text-sm ${highlighted ? 'text-theme-secondary/80' : 'text-theme-secondary'}`}>{description}</p>
      </div>
      <div className="mb-6">
        <span className={`text-5xl font-bold ${highlighted ? 'text-theme-primary' : 'text-theme-primary'}`}>{price}</span>
        <span className={`text-sm ${highlighted ? 'text-theme-secondary/80' : 'text-theme-secondary'}`}>{period}</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${highlighted ? 'bg-theme-primary/20' : 'bg-accent/20'}`}>
              <CheckCircle className={`w-3.5 h-3.5 ${highlighted ? 'text-theme-primary' : 'text-accent'}`} />
            </div>
            <span className={`text-sm ${highlighted ? 'text-theme-secondary' : 'text-theme-secondary'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-4 rounded-xl font-bold transition-all ${highlighted
          ? 'bg-theme-primary text-accent hover:bg-theme-primary shadow-lg'
          : 'bg-accent text-theme-primary hover:bg-accent/80'
        }`}
      >
        {cta}
      </motion.button>
    </motion.div>
  );
}
