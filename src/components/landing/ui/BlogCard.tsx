import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  delay: number;
  author: { name: string; avatar: string };
}

export function BlogCard({ title, excerpt, category, date, readTime, image, delay, author }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group bg-theme-secondary/60 border border-theme rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="h-48 bg-gradient-to-br from-theme-tertiary to-theme-secondary relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {image}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-theme-secondary to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-xs text-theme-tertiary mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {date}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readTime}</span>
        </div>
        <h3 className="font-semibold text-theme-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-theme-secondary text-sm mb-4 line-clamp-2">{excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent flex items-center justify-center text-xs font-bold text-theme-primary">
              {author.avatar}
            </div>
            <span className="text-xs text-theme-secondary">{author.name}</span>
          </div>
          <a href="#" className="inline-flex items-center gap-1 text-accent text-sm font-medium hover:gap-2 transition-all">
            Leer más <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
