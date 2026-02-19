import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  firm: string;
  content: string;
  rating: number;
  image: string;
  featured?: boolean;
}

export function TestimonialCard({ name, role, firm, content, rating, image, featured = false }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`p-6 bg-theme-secondary border ${featured ? 'border-accent/50' : 'border-theme'} rounded-2xl hover:border-accent/30 transition-all duration-300 backdrop-blur-sm relative`}
    >
      {featured && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-accent text-theme-primary text-xs font-bold rounded-full">
          DESTACADO
        </div>
      )}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-accent fill-accent' : 'text-theme-tertiary'}`} />
        ))}
      </div>
      <Quote className="w-8 h-8 text-accent/20 mb-4" />
      <p className="text-theme-secondary mb-6 leading-relaxed italic">&ldquo;{content}&rdquo;</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent flex items-center justify-center text-theme-primary font-bold text-lg">
          {image}
        </div>
        <div>
          <div className="font-semibold text-theme-primary">{name}</div>
          <div className="text-sm text-theme-secondary">{role}</div>
          <div className="text-xs text-accent">{firm}</div>
        </div>
      </div>
    </motion.div>
  );
}
