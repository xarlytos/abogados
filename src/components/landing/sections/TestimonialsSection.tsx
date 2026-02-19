import { motion } from 'framer-motion';
import { testimonials } from '../data';
import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="py-20 bg-theme-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Historias reales de despachos que transformaron su práctica
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-theme-card p-6 rounded-xl border ${
                testimonial.featured
                  ? 'border-accent/50 shadow-lg ring-1 ring-accent/20'
                  : 'border-theme'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <Quote className="w-8 h-8 text-accent flex-shrink-0" />
                <div className="flex">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-theme-secondary mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-semibold text-theme-primary">{testimonial.name}</p>
                  <p className="text-sm text-theme-secondary">{testimonial.role}</p>
                  <p className="text-sm text-accent">{testimonial.firm}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
