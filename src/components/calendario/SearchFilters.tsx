import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, ChevronDown, 
  AlertTriangle
} from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
  searchQuery: string;
  filters: FilterState;
}

export interface FilterState {
  types: string[];
  urgent: boolean | null;
  dateRange: { start: string; end: string } | null;
}

const eventTypes = [
  { id: 'vista', label: 'Vista/Audiencia', color: 'bg-blue-500' },
  { id: 'plazo', label: 'Plazo', color: 'bg-red-500' },
  { id: 'reunion', label: 'Reunión', color: 'bg-purple-500' },
  { id: 'entrega', label: 'Entrega', color: 'bg-emerald-500' },
];

export function SearchFilters({
  onSearch,
  onFilterChange,
  searchQuery,
  filters,
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleType = (typeId: string) => {
    const newTypes = filters.types.includes(typeId)
      ? filters.types.filter(t => t !== typeId)
      : [...filters.types, typeId];
    onFilterChange({ ...filters, types: newTypes });
  };

  const clearFilters = () => {
    onFilterChange({
      types: [],
      urgent: null,
      dateRange: null,
    });
  };

  const hasActiveFilters = filters.types.length > 0 || filters.urgent !== null || filters.dateRange !== null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar eventos, expedientes, clientes..."
            className="w-full pl-10 pr-4 py-2.5 bg-theme-card border border-theme rounded-xl text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-theme-muted hover:text-theme-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors
            ${showFilters || hasActiveFilters 
              ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
              : 'bg-theme-card border-theme text-theme-secondary hover:text-theme-primary'
            }
          `}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filtros</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-amber-500 text-slate-950 text-xs font-bold rounded-full flex items-center justify-center">
              {filters.types.length + (filters.urgent !== null ? 1 : 0)}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </motion.button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-theme-card/80 border border-theme rounded-xl p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-theme-muted uppercase tracking-wider mb-2 block">
                  Tipo de evento
                </label>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                        ${filters.types.includes(type.id)
                          ? `${type.color} text-white`
                          : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-hover'
                        }
                      `}
                    >
                      <span className={`w-2 h-2 rounded-full ${type.color.replace('bg-', 'bg-')}`} />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-theme-muted uppercase tracking-wider mb-2 block">
                  Estado
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onFilterChange({ 
                      ...filters, 
                      urgent: filters.urgent === true ? null : true 
                    })}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                      ${filters.urgent === true
                        ? 'bg-red-500 text-white'
                        : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-hover'
                      }
                    `}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Solo urgentes
                  </button>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-amber-500 hover:text-amber-400 font-medium"
                >
                  Limpiar todos los filtros
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
