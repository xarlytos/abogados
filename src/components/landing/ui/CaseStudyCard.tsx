import { motion } from 'framer-motion';

interface CaseStudyCardProps {
  firm: string;
  sector: string;
  results: { metric: string; value: string }[];
  quote: string;
  image: string;
  delay: number;
}

export function CaseStudyCard({ firm, sector, results, quote, image, delay }: CaseStudyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="p-6 bg-theme-secondary border border-theme rounded-2xl hover:border-accent/30 transition-all group"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-theme-tertiary to-theme-secondary rounded-xl flex items-center justify-center text-3xl border border-theme">
          {image}
        </div>
        <div>
          <h3 className="font-bold text-theme-primary">{firm}</h3>
          <p className="text-accent text-sm">{sector}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {results.map((result, i) => (
          <div key={i} className="text-center p-3 bg-theme-primary/50 rounded-xl">
            <div className="text-xl font-bold text-emerald-500">{result.value}</div>
            <div className="text-xs text-theme-tertiary">{result.metric}</div>
          </div>
        ))}
      </div>

      <blockquote className="text-theme-secondary text-sm italic border-l-2 border-accent/30 pl-4">
        &ldquo;{quote}&rdquo;
      </blockquote>
    </motion.div>
  );
}
