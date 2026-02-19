import { motion } from 'framer-motion';
import { integrations } from '../data';

export function IntegrationsSection() {
  return (
    <section id="integraciones" className="py-20 bg-theme-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            Integraciones
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Conecta DerechGo con las herramientas que ya usas
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-theme-card p-6 rounded-xl border border-theme hover:border-accent/50 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-theme-secondary/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                  <Icon className="w-6 h-6 text-theme-secondary group-hover:text-amber-600" />
                </div>
                <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                  {integration.category}
                </span>
                <h3 className="font-semibold text-theme-primary mt-1 mb-2">{integration.name}</h3>
                <p className="text-sm text-theme-secondary">{integration.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
