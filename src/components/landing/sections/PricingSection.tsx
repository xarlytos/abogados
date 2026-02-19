import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '29',
    description: 'Para despachos pequeños',
    features: [
      'Hasta 3 usuarios',
      '100 expedientes',
      'Calendario judicial',
      'Facturación básica',
      'Soporte por email'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: '59',
    description: 'Para despachos en crecimiento',
    features: [
      'Hasta 10 usuarios',
      'Expedientes ilimitados',
      'IA Legal básica',
      'Integraciones avanzadas',
      'Soporte prioritario',
      'App móvil completa'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '99',
    description: 'Para grandes bufetes',
    features: [
      'Usuarios ilimitados',
      'Todo lo de Professional',
      'IA Legal avanzada',
      'API completa',
      'Onboarding dedicado',
      'SLA garantizado'
    ],
    popular: false
  }
];

export function PricingSection() {
  return (
    <section id="precios" className="py-20 bg-theme-secondary/20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            Planes simples y transparentes
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Sin sorpresas. Sin costes ocultos. Cancela cuando quieras.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-theme-secondary text-theme-primary ring-4 ring-amber-500/20'
                  : 'bg-theme-card border border-theme'
              }`}
            >
              {plan.popular && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-accent text-theme-primary rounded-full text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  Más popular
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className={`text-sm mb-4 ${plan.popular ? 'text-theme-secondary' : 'text-theme-secondary'}`}>
                {plan.description}
              </p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">€{plan.price}</span>
                <span className={`text-sm ${plan.popular ? 'text-theme-tertiary' : 'text-theme-tertiary'}`}>
                  /usuario/mes
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.popular ? 'text-accent' : 'text-green-500'}`} />
                    <span className={plan.popular ? 'text-theme-secondary' : 'text-theme-secondary'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-accent text-theme-primary hover:bg-accent/90'
                    : 'bg-theme-secondary text-theme-primary hover:bg-theme-tertiary'
                }`}
              >
                Empezar prueba
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
