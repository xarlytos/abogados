import { motion } from 'framer-motion';
import { Twitter, Linkedin, Mail } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  delay: number;
  socials: { twitter?: string; linkedin?: string; email?: string };
}

export function TeamMember({ name, role, bio, image, delay, socials }: TeamMemberProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group text-center"
    >
      <div className="relative w-32 h-32 mx-auto mb-4">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accent to-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="relative w-full h-full bg-gradient-to-br from-theme-tertiary to-theme-secondary rounded-full flex items-center justify-center text-4xl border-2 border-theme group-hover:border-accent transition-colors overflow-hidden">
          {image}
        </div>
      </div>
      <h3 className="font-bold text-theme-primary text-lg">{name}</h3>
      <p className="text-accent text-sm mb-2">{role}</p>
      <p className="text-theme-secondary text-sm max-w-xs mx-auto mb-4">{bio}</p>
      <div className="flex justify-center gap-3">
        {socials.twitter && (
          <a href={socials.twitter} className="w-8 h-8 bg-theme-tertiary rounded-full flex items-center justify-center text-theme-secondary hover:bg-accent hover:text-theme-primary transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
        )}
        {socials.linkedin && (
          <a href={socials.linkedin} className="w-8 h-8 bg-theme-tertiary rounded-full flex items-center justify-center text-theme-secondary hover:bg-accent hover:text-theme-primary transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {socials.email && (
          <a href={socials.email} className="w-8 h-8 bg-theme-tertiary rounded-full flex items-center justify-center text-theme-secondary hover:bg-accent hover:text-theme-primary transition-colors">
            <Mail className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
