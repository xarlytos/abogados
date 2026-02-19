import { motion } from 'framer-motion';
import { roadmap } from '../data';
import { Check, Clock, Circle } from 'lucide-react';

export function RoadmapSection() {
  return (
    <section id="roadmap" className="py-20 bg-theme-secondary/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            Roadmap
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Lo que hemos logrado y lo que viene
          </p>
        </motion.div>

        <div className="space-y-6">
          {roadmap.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border ${
                item.status === 'completed'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : item.status === 'in-progress'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-theme-secondary border-theme'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    item.status === 'completed'
                      ? 'bg-emerald-500/20'
                      : item.status === 'in-progress'
                      ? 'bg-amber-500/20'
                      : 'bg-theme-tertiary'
                  }`}
                >
                  {item.status === 'completed' ? (
                    <Check className="w-5 h-5 text-emerald-500" />
                  ) : item.status === 'in-progress' ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-theme-tertiary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-theme-primary">{item.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : item.status === 'in-progress'
                          ? 'bg-amber-500/20 text-amber-500'
                          : 'bg-theme-tertiary text-theme-secondary'
                      }`}
                    >
                      {item.quarter}
                    </span>
                  </div>
                  <p className="text-theme-secondary mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-theme-tertiary rounded-full text-sm text-theme-secondary border border-theme"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
