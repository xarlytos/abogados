import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Clock, Users } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from '../animations';

export function FinalCTASection() {
  return (
    <section id="cta" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background - usa colores del tema */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-theme-secondary to-theme-primary" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Empieza gratis hoy
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2 
            variants={fadeInUp}
            className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold text-theme-primary leading-tight"
          >
            ¿Listo para transformar{' '}
            <span className="text-accent">tu despacho</span>?
          </motion.h2>

          <motion.p 
            variants={fadeInUp}
            className="mt-6 text-xl text-theme-secondary max-w-2xl mx-auto"
          >
            Únete a miles de abogados que ya han modernizado su práctica legal. 
            Prueba DerechoGo gratis durante 14 días, sin tarjeta de crédito.
          </motion.p>

          {/* Trust indicators */}
          <motion.div 
            variants={fadeInUp}
            className="mt-10 flex flex-wrap justify-center gap-8"
          >
            <div className="flex items-center gap-2 text-theme-secondary">
              <div className="w-10 h-10 bg-theme-tertiary rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-sm">Datos seguros</span>
            </div>
            <div className="flex items-center gap-2 text-theme-secondary">
              <div className="w-10 h-10 bg-theme-tertiary rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm">Setup en minutos</span>
            </div>
            <div className="flex items-center gap-2 text-theme-secondary">
              <div className="w-10 h-10 bg-theme-tertiary rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm">Soporte incluido</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={fadeInUp}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold text-lg rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/25"
            >
              Comenzar prueba gratuita
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-theme-tertiary text-theme-primary font-medium rounded-xl hover:bg-theme-hover transition-colors border border-theme"
            >
              Ver demo
            </motion.a>
          </motion.div>

          {/* No credit card required */}
          <motion.p 
            variants={fadeInUp}
            className="mt-6 text-sm text-theme-tertiary"
          >
            No se requiere tarjeta de crédito • Cancela cuando quieras
          </motion.p>

          {/* Stats */}
          <motion.div 
            variants={fadeInUp}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: '10K+', label: 'Usuarios activos' },
              { value: '500+', label: 'Bufetes' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9/5', label: 'Valoración' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-theme-primary">{stat.value}</p>
                <p className="text-sm text-theme-tertiary mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
