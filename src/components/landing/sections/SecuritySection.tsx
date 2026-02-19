import { motion } from 'framer-motion';
import { securityBadges } from '../data';
import { Shield } from 'lucide-react';

export function SecuritySection() {
  return (
    <section id="seguridad" className="py-20 bg-theme-secondary text-theme-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Seguridad de nivel bancario
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Tu información y la de tus clientes está protegida con los más altos estándares
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-theme-tertiary p-6 rounded-xl border border-theme hover:border-accent/50 transition-colors"
              >
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{badge.title}</h3>
                <p className="text-theme-tertiary">{badge.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
