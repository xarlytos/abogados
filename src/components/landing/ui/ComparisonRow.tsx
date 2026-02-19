import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface ComparisonRowProps {
  feature: string;
  derechgo: boolean | string;
  competitor1: boolean | string;
  competitor2: boolean | string;
  highlight?: boolean;
  delay?: number;
}

export function ComparisonRow({ feature, derechgo, competitor1, competitor2, highlight = false, delay = 0 }: ComparisonRowProps) {
  const renderValue = (value: boolean | string) => {
    if (typeof value === 'string') {
      return <span className="text-sm text-gray-700">{value}</span>;
    }
    return value ? (
      <Check className="w-5 h-5 text-green-500 mx-auto" />
    ) : (
      <X className="w-5 h-5 text-red-400 mx-auto" />
    );
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className={`${highlight ? 'bg-blue-50/50' : 'hover:bg-gray-50'} transition-colors`}
    >
      <td className="py-4 px-4 text-sm font-medium text-gray-900">{feature}</td>
      <td className="py-4 px-4 text-center bg-blue-50/30">
        {typeof derechgo === 'boolean' && derechgo ? (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-4 h-4 text-white" />
          </div>
        ) : typeof derechgo === 'string' ? (
          <span className="text-sm font-semibold text-blue-600">{derechgo}</span>
        ) : (
          <X className="w-5 h-5 text-red-400 mx-auto" />
        )}
      </td>
      <td className="py-4 px-4 text-center">{renderValue(competitor1)}</td>
      <td className="py-4 px-4 text-center">{renderValue(competitor2)}</td>
    </motion.tr>
  );
}
