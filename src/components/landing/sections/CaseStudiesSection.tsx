import { motion } from 'framer-motion';
import { caseStudies } from '../data';
import { Quote, TrendingUp } from 'lucide-react';

export function CaseStudiesSection() {
  return (
    <section id="casos" className="py-20 bg-theme-secondary text-theme-primary scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Casos de Éxito
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Descubre cómo otros despachos transformaron su práctica legal
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-theme-tertiary rounded-xl p-6 border border-theme hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3 mb-4">
                <Quote className="w-8 h-8 text-accent flex-shrink-0" />
              </div>
              <p className="text-theme-secondary mb-6 italic">"{study.quote}"</p>
              
              <div className="mb-4">
                <p className="font-semibold text-theme-primary">{study.author}</p>
                <p className="text-sm text-theme-tertiary">{study.role}</p>
                <p className="text-sm text-accent">{study.company}</p>
              </div>

              <div className="pt-4 border-t border-theme">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-theme-secondary">Resultados:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {study.results.map((result, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
