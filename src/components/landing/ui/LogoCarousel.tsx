import { motion } from 'framer-motion';
import { Building2, Scale, Gavel, Landmark, Briefcase, Users, Target, Award, Cpu } from 'lucide-react';

export function LogoCarousel() {
  const logos = [
    { name: 'Gómez & Asoc.', icon: Building2 },
    { name: 'Martínez Legal', icon: Scale },
    { name: 'Ruiz Abogados', icon: Gavel },
    { name: 'Bufete Central', icon: Landmark },
    { name: 'LegalPro', icon: Briefcase },
    { name: 'Justicia Digital', icon: Scale },
    { name: 'Lex Partners', icon: Users },
    { name: 'Derecho Avanzado', icon: Target },
    { name: 'Abogados Elite', icon: Award },
    { name: 'LegalTech Pro', icon: Cpu },
  ];

  return (
    <div className="relative overflow-hidden py-8">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-theme-primary to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-theme-primary to-transparent z-10" />
      <motion.div
        animate={{ x: [0, -1920] }}
        transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="flex gap-16 items-center"
      >
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <div key={i} className="flex items-center gap-3 text-theme-tertiary hover:text-theme-secondary transition-colors whitespace-nowrap">
            <logo.icon className="w-6 h-6" />
            <span className="font-semibold text-lg">{logo.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
