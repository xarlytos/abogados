import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock } from 'lucide-react';
import { searchHistory } from '@/data/dashboardData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center gap-4">
              <Search className="w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar expedientes, clientes, documentos..."
                className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-lg"
                autoFocus
              />
              <kbd className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">ESC</kbd>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-500 uppercase font-medium mb-3">Búsquedas recientes</p>
              <div className="space-y-2">
                {searchHistory.map((term: string) => (
                  <button
                    key={term}
                    className="w-full flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-left"
                  >
                    <Clock className="w-4 h-4 text-slate-500" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
