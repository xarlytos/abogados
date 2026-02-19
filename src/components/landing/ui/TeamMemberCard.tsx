import { motion } from 'framer-motion';
import { Linkedin, Twitter } from 'lucide-react';

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  linkedin?: string;
  twitter?: string;
  delay?: number;
}

export function TeamMemberCard({ name, role, bio, imageUrl, linkedin, twitter, delay = 0 }: TeamMemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-300">{name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 flex gap-2">
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            )}
            {twitter && (
              <a href={twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                <Twitter className="w-4 h-4 text-white" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-blue-600 mb-2">{role}</p>
        <p className="text-sm text-gray-600 line-clamp-3">{bio}</p>
      </div>
    </motion.div>
  );
}
