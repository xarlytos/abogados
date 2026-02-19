import { motion } from 'framer-motion';
import { Scale, CheckCircle } from 'lucide-react';

const features = [
  { name: 'Gestión de expedientes', derecho: true, competitors: 'Básica' },
  { name: 'Sincronización con tribunales', derecho: true, competitors: 'No' },
  { name: 'Memoria forense IA', derecho: true, competitors: 'No' },
  { name: 'Facturación integrada', derecho: true, competitors: 'Parcial' },
  { name: 'App móvil nativa', derecho: true, competitors: 'Web-only' },
  { name: 'Soporte 24/7 humano', derecho: true, competitors: 'Bot' },
  { name: 'Implementación', derecho: '48h', competitors: 'Semanas' },
  { name: 'Migración de datos', derecho: 'Incluida', competitors: 'Coste extra' },
];

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-theme">
            <th className="text-left py-4 px-4 text-theme-secondary font-medium">Característica</th>
            <th className="text-center py-4 px-4">
              <div className="flex items-center justify-center gap-2">
                <Scale className="w-5 h-5 text-accent" />
                <span className="text-accent font-bold">Derecho.ERP</span>
              </div>
            </th>
            <th className="text-center py-4 px-4 text-theme-secondary">Competencia</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-theme/50 hover:bg-theme-secondary/30 transition-colors"
            >
              <td className="py-4 px-4 text-theme-secondary">{feature.name}</td>
              <td className="py-4 px-4 text-center">
                {feature.derecho === true ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                ) : (
                  <span className="text-emerald-500 font-medium">{feature.derecho}</span>
                )}
              </td>
              <td className="py-4 px-4 text-center text-theme-tertiary">{feature.competitors}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
