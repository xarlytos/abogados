import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Sparkles, Check, Gift } from 'lucide-react';
import { SectionBadge, SectionTitle } from '../ui';
import { fadeInUp, staggerContainer } from '../animations';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section id="newsletter" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="bg-gradient-to-br from-theme-secondary to-theme-secondary/50 border border-theme rounded-3xl p-8 md:p-12 lg:p-16 text-center"
        >
          <motion.div variants={fadeInUp}>
            <SectionBadge className="mx-auto">
              <Mail className="w-4 h-4" />
              Newsletter
            </SectionBadge>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-6">
            <SectionTitle>
              Mantente al día con{' '}
              <span className="text-accent">DerechoGo</span>
            </SectionTitle>
          </motion.div>

          <motion.p 
            variants={fadeInUp}
            className="mt-6 text-lg text-theme-tertiary max-w-2xl mx-auto"
          >
            Suscríbete a nuestro newsletter y recibe las últimas noticias sobre 
            tecnología legal, consejos de gestión y actualizaciones del producto.
          </motion.p>

          {/* Benefits */}
          <motion.div 
            variants={fadeInUp}
            className="mt-8 flex flex-wrap justify-center gap-6"
          >
            <div className="flex items-center gap-2 text-sm text-theme-tertiary">
              <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-500" />
              </div>
              Contenido exclusivo
            </div>
            <div className="flex items-center gap-2 text-sm text-theme-tertiary">
              <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-500" />
              </div>
              Sin spam
            </div>
            <div className="flex items-center gap-2 text-sm text-theme-tertiary">
              <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-500" />
              </div>
              Cancela cuando quieras
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeInUp} className="mt-10">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-tertiary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-theme-tertiary border border-theme rounded-xl text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-accent transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-accent text-theme-secondary font-semibold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      Suscribirme
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 max-w-md mx-auto"
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="text-lg font-semibold text-theme-primary mb-2">
                  ¡Gracias por suscribirte!
                </h4>
                <p className="text-theme-tertiary">
                  Recibirás nuestras próximas actualizaciones en tu correo.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Gift mention */}
          <motion.div 
            variants={fadeInUp}
            className="mt-8 flex items-center justify-center gap-2 text-sm text-theme-tertiary"
          >
            <Gift className="w-4 h-4 text-accent" />
            <span>Recibe una guía gratuita de gestión de despachos al suscribirte</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
