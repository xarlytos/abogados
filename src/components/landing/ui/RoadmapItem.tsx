import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';

interface RoadmapItemProps {
  quarter: string;
  title: string;
  items: string[];
  completed: boolean;
  delay: number;
  isLast: boolean;
}

export function RoadmapItem({ quarter, title, items, completed, delay, isLast }: RoadmapItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`relative pl-8 ${isLast ? '' : 'pb-8'} border-l-2 ${completed ? 'border-accent' : 'border-theme'}`}
    >
      <motion.div
        className={`absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full border-2 ${completed ? 'bg-accent border-accent' : 'bg-theme-primary border-theme-tertiary'}`}
        whileHover={{ scale: 1.3 }}
        transition={{ duration: 0.2 }}
      />
      <div className="flex items-center gap-3 mb-2">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${completed ? 'bg-accent/20 text-accent' : 'bg-theme-tertiary text-theme-secondary'}`}>{quarter}</span>
        {completed && <CheckCircle className="w-4 h-4 text-emerald-500" />}
        {!completed && <Clock className="w-4 h-4 text-theme-tertiary" />}
      </div>
      <h4 className="font-bold text-theme-primary mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className={`text-sm flex items-center gap-2 ${completed ? 'text-theme-secondary' : 'text-theme-tertiary'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${completed ? 'bg-accent' : 'bg-theme-tertiary'}`} />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
