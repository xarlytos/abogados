import { motion } from 'framer-motion';
import { Video, Calendar, Clock, Users } from 'lucide-react';

interface WebinarCardProps {
  title: string;
  date: string;
  time: string;
  speaker: string;
  topic: string;
  attendees: number;
  delay: number;
}

export function WebinarCard({ title, date, time, speaker, topic, attendees, delay }: WebinarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="p-6 bg-theme-secondary/60 border border-theme rounded-2xl hover:border-accent/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
          <Video className="w-6 h-6 text-accent" />
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-medium rounded-full">
          Gratuito
        </span>
      </div>

      <h3 className="font-bold text-theme-primary mb-2 group-hover:text-accent transition-colors">{title}</h3>
      <p className="text-theme-secondary text-sm mb-4">{topic}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-theme-secondary">
          <Calendar className="w-4 h-4 text-accent" />
          {date}
        </div>
        <div className="flex items-center gap-2 text-sm text-theme-secondary">
          <Clock className="w-4 h-4 text-accent" />
          {time}
        </div>
        <div className="flex items-center gap-2 text-sm text-theme-secondary">
          <Users className="w-4 h-4 text-accent" />
          {attendees} inscritos
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-theme">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent flex items-center justify-center text-xs font-bold text-theme-primary">
          {speaker.charAt(0)}
        </div>
        <span className="text-sm text-theme-secondary">{speaker}</span>
      </div>
    </motion.div>
  );
}
