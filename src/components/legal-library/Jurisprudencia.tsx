import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gavel,
  Scale,
  Building2,
  Crown,
  Search,
  Filter,
  Star,
  ChevronLeft,
  User,
  Calendar,
  Bookmark,
} from 'lucide-react';
import { jurisprudencias } from './mockData';
import type { Jurisprudence } from './types';

const tribunalInfo = {
  'supremo': { name: 'Tribunal Supremo', icon: Scale, color: 'text-rose-500' },
  'audiencia-nacional': { name: 'Audiencia Nacional', icon: Building2, color: 'text-blue-500' },
  'constitucional': { name: 'Tribunal Constitucional', icon: Crown, color: 'text-purple-500' },
};

const salas = [
  'Todas',
  'Sala de lo Civil',
  'Sala de lo Penal',
  'Sala de lo Social',
  'Sala de lo Contencioso-Administrativo',
  'Sala de lo Militar',
  'Pleno',
];

export default function Jurisprudencia() {
  const [selectedItem, setSelectedItem] = useState<Jurisprudence | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTribunal, setSelectedTribunal] = useState<Jurisprudence['tribunal'] | 'all'>('all');
  const [selectedSala, setSelectedSala] = useState('Todas');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Filtrar jurisprudencias
  const filteredItems = jurisprudencias.filter(item => {
    const matchesTribunal = selectedTribunal === 'all' || item.tribunal === selectedTribunal;
    const matchesSala = selectedSala === 'Todas' || item.sala === selectedSala;
    const matchesSearch = !searchQuery ||
      item.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.materia.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ponente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTribunal && matchesSala && matchesSearch;
  });

  if (selectedItem) {
    const tribunal = tribunalInfo[selectedItem.tribunal];
    const TribunalIcon = tribunal.icon;

    return (
      <div className="p-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <button
                onClick={() => setSelectedItem(null)}
                className="flex items-center gap-2 text-theme-tertiary hover:text-theme-primary mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Volver al listado</span>
              </button>
              <div className="flex items-center gap-2 mb-2">
                <TribunalIcon className={`w-4 h-4 ${tribunal.color}`} />
                <span className="text-sm text-theme-secondary">{tribunal.name}</span>
                <span className="text-theme-tertiary">•</span>
                <span className="text-sm text-theme-secondary">{selectedItem.sala}</span>
              </div>
              <h1 className="text-2xl font-bold text-theme-primary">{selectedItem.number}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(selectedItem.id)}
                className={`p-2 rounded-lg transition-colors ${
                  favorites.includes(selectedItem.id)
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-theme-tertiary hover:text-amber-400 hover:bg-theme-tertiary'
                }`}
              >
                <Star className={`w-5 h-5 ${favorites.includes(selectedItem.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-theme-secondary border border-theme rounded-xl">
              <div className="flex items-center gap-2 text-theme-tertiary mb-1">
                <User className="w-4 h-4" />
                <span className="text-sm">Ponente</span>
              </div>
              <p className="text-theme-primary">{selectedItem.ponente}</p>
            </div>
            <div className="p-4 bg-theme-secondary border border-theme rounded-xl">
              <div className="flex items-center gap-2 text-theme-tertiary mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Fecha</span>
              </div>
              <p className="text-theme-primary">{selectedItem.date}</p>
            </div>
          </div>

          {/* Materia */}
          <div className="p-4 bg-theme-secondary border border-theme rounded-xl mb-6">
            <div className="flex items-center gap-2 text-theme-tertiary mb-2">
              <Bookmark className="w-4 h-4" />
              <span className="text-sm">Materia</span>
            </div>
            <p className="text-theme-primary">{selectedItem.materia}</p>
          </div>

          {/* Resumen/Fallo */}
          <div className="p-6 bg-theme-secondary border border-theme rounded-xl">
            <h2 className="text-lg font-medium text-theme-primary mb-4">Resumen de la sentencia</h2>
            <p className="text-theme-secondary leading-relaxed whitespace-pre-line">
              {selectedItem.summary}
            </p>
          </div>

          {/* Acciones */}
          <div className="mt-6 flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors border border-rose-500/20">
              <Bookmark className="w-4 h-4" />
              <span className="text-sm">Vincular a expediente</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-theme">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center">
            <Gavel className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-theme-primary">Jurisprudencia</h1>
            <p className="text-sm text-theme-tertiary">Sentencias del Tribunal Supremo y Audiencia Nacional</p>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por número, materia, ponente..."
            className="w-full pl-10 pr-4 py-2.5 bg-theme-secondary border border-theme rounded-xl text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3">
          {/* Tribunal */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-theme-tertiary" />
            <select
              value={selectedTribunal}
              onChange={(e) => setSelectedTribunal(e.target.value as Jurisprudence['tribunal'] | 'all')}
              className="bg-theme-secondary border border-theme text-theme-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
            >
              <option value="all">Todos los tribunales</option>
              <option value="supremo">Tribunal Supremo</option>
              <option value="audiencia-nacional">Audiencia Nacional</option>
              <option value="constitucional">Tribunal Constitucional</option>
            </select>
          </div>

          {/* Sala */}
          <select
            value={selectedSala}
            onChange={(e) => setSelectedSala(e.target.value)}
            className="bg-theme-secondary border border-theme text-theme-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
          >
            {salas.map(sala => (
              <option key={sala} value={sala}>{sala}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Listado */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-theme-secondary">
            {filteredItems.length} sentencias encontradas
          </p>
        </div>

        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const tribunal = tribunalInfo[item.tribunal];
            const TribunalIcon = tribunal.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="p-4 bg-theme-secondary border border-theme rounded-xl cursor-pointer hover:border-rose-500/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 bg-theme-tertiary rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <TribunalIcon className={`w-5 h-5 ${tribunal.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-theme-primary group-hover:text-rose-400 transition-colors">
                        {item.number}
                      </span>
                      <span className="text-xs text-theme-tertiary">{item.date}</span>
                    </div>
                    <p className="text-sm text-theme-secondary mb-2">{item.materia}</p>
                    <div className="flex items-center gap-3 text-xs text-theme-tertiary">
                      <span>{tribunal.name}</span>
                      <span>•</span>
                      <span>{item.sala}</span>
                      <span>•</span>
                      <span>{item.ponente}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="p-2 text-theme-tertiary hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${favorites.includes(item.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Gavel className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
            <p className="text-theme-secondary">No se encontraron sentencias</p>
            <p className="text-theme-tertiary text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
