import { motion } from 'framer-motion';
import { blogPosts } from '../data';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export function BlogSection() {
  return (
    <section id="blog" className="py-20 bg-theme-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            Blog Legal
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Artículos, guías y recursos para modernizar tu despacho
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-theme-card rounded-xl shadow-sm border border-theme overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-6xl">
                {post.image}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-theme-tertiary mb-3">
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-theme-primary mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-theme-secondary text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {post.author.avatar}
                    </div>
                    <span className="text-sm text-theme-secondary">{post.author.name}</span>
                  </div>
                  <button className="text-accent hover:text-accent flex items-center gap-1 text-sm font-medium">
                    Leer <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
