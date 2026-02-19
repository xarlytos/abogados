import { motion } from 'framer-motion';
import { appFeatures } from '../data';
import { Download, Apple, Smartphone } from 'lucide-react';

export function MobileAppSection() {
  return (
    <section id="movil" className="py-20 bg-theme-secondary text-theme-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lleva tu despacho en el bolsillo
            </h2>
            <p className="text-lg text-theme-secondary mb-8">
              App nativa para iOS y Android. Accede a tus expedientes desde cualquier lugar.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {appFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-theme-primary">{feature.title}</h4>
                      <p className="text-sm text-theme-tertiary">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 px-6 py-3 bg-theme-card text-theme-secondary rounded-xl hover:bg-theme-hover transition-colors">
                <Apple className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">Descargar en</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-theme-card text-theme-secondary rounded-xl hover:bg-theme-hover transition-colors">
                <Download className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">Descargar en</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-[500px] bg-theme-tertiary rounded-[3rem] border-8 border-theme shadow-2xl flex items-center justify-center">
                <div className="text-center">
                  <Smartphone className="w-16 h-16 text-accent mx-auto mb-4" />
                  <p className="text-theme-tertiary">Mockup App Móvil</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500 rounded-full opacity-20 blur-xl" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-amber-500 rounded-full opacity-10 blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
