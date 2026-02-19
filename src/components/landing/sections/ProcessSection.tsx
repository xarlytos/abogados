import { motion } from 'framer-motion';
import { processSteps } from '../data';

export function ProcessSection() {
  return (
    <section id="solucion" className="py-20 bg-theme-card scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            Implementación en 48 horas
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Un proceso simple para transformar tu despacho
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-theme -z-10" />
                )}
                <div className="w-24 h-24 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Icon className="w-10 h-10 text-amber-600" />
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-amber-500 text-white rounded-full font-bold mb-3">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-theme-primary mb-2">{step.title}</h3>
                  <p className="text-theme-secondary text-sm">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
