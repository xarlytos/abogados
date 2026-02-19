import { motion } from 'framer-motion';
import { team } from '../data';
import { Linkedin, Twitter } from 'lucide-react';

export function TeamSection() {
  return (
    <section id="equipo" className="py-20 bg-theme-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            Nuestro equipo
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Expertos en derecho y tecnología trabajando para ti
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <h3 className="font-semibold text-theme-primary">{member.name}</h3>
              <p className="text-accent text-sm mb-2">{member.role}</p>
              <p className="text-theme-secondary text-sm mb-4 line-clamp-2">{member.bio}</p>
              <div className="flex justify-center gap-3">
                {member.linkedin && (
                  <a href={member.linkedin} className="text-theme-tertiary hover:text-accent transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} className="text-theme-tertiary hover:text-accent transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
