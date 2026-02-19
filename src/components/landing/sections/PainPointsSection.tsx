import { motion } from 'framer-motion';
import { painPoints } from '../data';
import { AlertTriangle } from 'lucide-react';

export function PainPointsSection() {
  return (
    <section id="problema" className="py-20 bg-theme-card scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4">
            <AlertTriangle className="w-4 h-4" />
            El problema
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            ¿Te suena familiar?
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Los problemas que frenan el crecimiento de tu despacho
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-theme-card p-8 rounded-xl shadow-sm border border-theme"
              >
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-theme-primary mb-3">
                  {point.title}
                </h3>
                <p className="text-theme-secondary mb-4">{point.description}</p>
                <div className="pt-4 border-t border-theme/50">
                  <span className="text-red-600 font-semibold">{point.cost}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
