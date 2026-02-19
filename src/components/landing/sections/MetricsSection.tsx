import { motion } from 'framer-motion';
import { metrics } from '../data';

export function MetricsSection() {
  return (
    <section id="metricas" className="py-20 bg-theme-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            Métricas que importan
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Resultados reales de despachos que usan DerechGo
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-theme-secondary to-theme-tertiary p-8 rounded-xl text-theme-primary"
              >
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-4xl font-bold text-accent mb-2">
                  {metric.value}{metric.suffix}
                </div>
                <p className="text-theme-secondary">{metric.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
