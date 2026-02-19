import { motion } from 'framer-motion';
import { LogoCarousel } from '../ui/LogoCarousel';
import { fadeInUp } from '../animations';

export function LogoCarouselSection() {
  return (
    <section className="relative py-16 bg-theme-primary border-y border-theme/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-theme-tertiary/60 text-sm font-medium uppercase tracking-wider">
            Confían en nosotros
          </p>
        </motion.div>
        
        <LogoCarousel />
      </div>
    </section>
  );
}
