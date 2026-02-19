import { motion } from 'framer-motion';
import { whyChooseUs } from '../data';

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-theme-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            ¿Por qué elegir DerechGo?
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            La diferencia está en los detalles
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-theme-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-theme-secondary text-sm">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
