import { motion } from 'framer-motion';
import { comparisonData } from '../data';
import { Check, X } from 'lucide-react';

export function ComparisonSection() {
  return (
    <section id="comparativa" className="py-20 bg-theme-secondary/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
            Comparativa
          </h2>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Por qué los despachos eligen DerechGo
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-theme-card rounded-xl shadow-lg border border-theme overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-theme-secondary text-theme-primary">
                  <th className="px-6 py-4 text-left font-semibold">Característica</th>
                  <th className="px-6 py-4 text-center font-semibold text-accent">DerechGo</th>
                  <th className="px-6 py-4 text-center font-semibold">{comparisonData.competitors[0]}</th>
                  <th className="px-6 py-4 text-center font-semibold">{comparisonData.competitors[1]}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.features.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-theme-card' : 'bg-theme-secondary/20'}
                  >
                    <td className="px-6 py-4 text-theme-secondary font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.derechgo === true ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : row.derechgo === false ? (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-accent font-semibold">{row.derechgo}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.competitor1 === true ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : row.competitor1 === false ? (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-theme-secondary">{row.competitor1}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.competitor2 === true ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : row.competitor2 === false ? (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-theme-secondary">{row.competitor2}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
