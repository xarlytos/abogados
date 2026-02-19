import { motion } from 'framer-motion';
import { webinars } from '../data';
import { Calendar, Clock, Users, Play } from 'lucide-react';

export function WebinarsSection() {
  return (
    <section id="webinars" className="py-20 bg-theme-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            Webinars gratuitos
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Formación continua con los mejores expertos legales
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {webinars.map((webinar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-theme-secondary/30 rounded-xl p-6 border border-theme hover:border-accent/50 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                <Play className="w-7 h-7 text-accent" />
              </div>
              
              <h3 className="text-xl font-semibold text-theme-primary mb-2">
                {webinar.title}
              </h3>
              <p className="text-theme-secondary mb-4">{webinar.topic}</p>
              
              <div className="space-y-2 text-sm text-theme-tertiary mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {webinar.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {webinar.time}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {webinar.attendees} inscritos
                </div>
              </div>

              <div className="pt-4 border-t border-theme">
                <p className="text-sm text-theme-secondary mb-3">
                  Ponente: <span className="font-medium text-theme-primary">{webinar.speaker}</span>
                </p>
                <button className="w-full py-2 bg-accent text-theme-primary rounded-lg font-medium hover:bg-amber-400 transition-colors">
                  Registrarme gratis
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
