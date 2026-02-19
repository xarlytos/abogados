import { motion } from 'framer-motion';
import { features } from '../data';

export function FeaturesSection() {
  return (
    <section id="caracteristicas" className="py-20 bg-theme-card scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            Todo lo que necesita tu despacho
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Herramientas diseñadas específicamente para la práctica legal moderna
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-xl bg-theme-secondary/30 border border-theme/50 hover:border-accent/30 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors">
                  <Icon className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-theme-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-theme-secondary">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
