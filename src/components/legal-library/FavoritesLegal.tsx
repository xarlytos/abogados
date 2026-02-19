import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  BookOpen,
  Scale,
  ScrollText,
  Gavel,
  Search,
  Folder,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import type { LegalFavorite } from './types';

// Datos de ejemplo para favoritos
const mockFavorites: LegalFavorite[] = [
  {
    id: 'fav-1',
    type: 'constitution',
    title: 'Artículo 14 - Derecho a la igualdad',
    reference: 'Constitución Española, Título I',
    dateAdded: '2025-01-15',
    notes: 'Fundamental para casos de discriminación laboral',
    folder: 'Derechos Fundamentales',
  },
  {
    id: 'fav-2',
    type: 'code',
    title: 'Artículo 1089 - Fuentes de las obligaciones',
    reference: 'Código Civil, Libro IV, Título II',
    dateAdded: '2025-02-01',
    notes: 'Base para reclamaciones contractuales',
    folder: 'Obligaciones y Contratos',
  },
  {
    id: 'fav-3',
    type: 'boe',
    title: 'Ley Orgánica 2/2026',
    reference: 'BOE Nº 45 - 14/02/2026',
    dateAdded: '2025-02-14',
    notes: 'Modificación del Código Penal - ciberseguridad',
  },
  {
    id: 'fav-4',
    type: 'jurisprudencia',
    title: 'STS 245/2025',
    reference: 'Tribunal Supremo, Sala de lo Civil',
    dateAdded: '2025-01-20',
    notes: 'Doctrina sobre pensión de alimentos e IPC',
    folder: 'Familia',
  },
  {
    id: 'fav-5',
    type: 'constitution',
    title: 'Artículo 24 - Derecho a la tutela judicial efectiva',
    reference: 'Constitución Española, Título I',
    dateAdded: '2025-02-10',
    folder: 'Derechos Fundamentales',
  },
];

const typeConfig = {
  constitution: { icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Constitución' },
  code: { icon: Scale, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Código' },
  boe: { icon: ScrollText, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'BOE' },
  jurisprudencia: { icon: Gavel, color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Jurisprudencia' },
};

export default function FavoritesLegal() {
  const [favorites, setFavorites] = useState<LegalFavorite[]>(mockFavorites);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | 'all'>('all');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Obtener carpetas únicas
  const folders = Array.from(new Set(favorites.filter(f => f.folder).map(f => f.folder!)));

  // Filtrar favoritos
  const filteredFavorites = favorites.filter(fav => {
    const matchesFolder = selectedFolder === 'all' || fav.folder === selectedFolder;
    const matchesSearch = !searchQuery ||
      fav.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fav.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fav.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const addFolder = () => {
    if (newFolderName.trim()) {
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Carpetas */}
      <div className="w-64 border-r border-theme bg-theme-secondary overflow-y-auto">
        <div className="p-4 border-b border-theme">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            <h2 className="font-semibold text-theme-primary">Mis Favoritos</h2>
          </div>
        </div>

        <div className="p-2">
          <button
            onClick={() => setSelectedFolder('all')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              selectedFolder === 'all' ? 'bg-amber-500/20 text-amber-400' : 'text-theme-tertiary hover:bg-theme-tertiary'
            }`}
          >
            <Star className="w-4 h-4" />
            <span className="text-sm">Todos</span>
            <span className="ml-auto text-xs text-theme-tertiary">{favorites.length}</span>
          </button>

          <div className="mt-4">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs text-theme-tertiary uppercase font-medium">Carpetas</span>
              <button
                onClick={() => setShowNewFolderModal(true)}
                className="p-1 hover:bg-theme-tertiary rounded text-theme-tertiary hover:text-theme-primary transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            
            {folders.map(folder => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedFolder === folder ? 'bg-amber-500/20 text-amber-400' : 'text-theme-tertiary hover:bg-theme-tertiary'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span className="text-sm truncate flex-1 text-left">{folder}</span>
                <span className="text-xs text-theme-tertiary">
                  {favorites.filter(f => f.folder === folder).length}
                </span>
              </button>
            ))}

            {folders.length === 0 && (
              <p className="px-3 py-2 text-xs text-theme-tertiary">Sin carpetas</p>
            )}
          </div>

          <div className="mt-6 px-3">
            <div className="p-3 bg-theme-tertiary/50 rounded-lg">
              <p className="text-xs text-theme-secondary">
                <span className="text-amber-400">💡</span> Organiza tus favoritos en carpetas para acceder más rápido
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-theme-primary mb-2">
            {selectedFolder === 'all' ? 'Todos los favoritos' : selectedFolder}
          </h1>
          <p className="text-theme-secondary">
            {filteredFavorites.length} documento{filteredFavorites.length !== 1 ? 's' : ''} guardado{filteredFavorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Buscador */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en favoritos..."
            className="w-full pl-10 pr-4 py-2.5 bg-theme-secondary border border-theme rounded-xl text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Lista de favoritos */}
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
            <p className="text-theme-secondary">
              {favorites.length === 0 
                ? 'No tienes favoritos guardados' 
                : 'No se encontraron favoritos con estos filtros'}
            </p>
            {favorites.length === 0 && (
              <p className="text-theme-tertiary text-sm mt-2">
                Navega por la Biblioteca Legal y marca artículos como favoritos
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFavorites.map((fav, index) => {
              const config = typeConfig[fav.type];
              const Icon = config.icon;

              return (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-theme-secondary border border-theme rounded-xl hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-theme-primary">{fav.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-theme-secondary mb-2">{fav.reference}</p>
                      {fav.notes && (
                        <p className="text-sm text-theme-tertiary italic mb-2">"{fav.notes}"</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-theme-tertiary">
                        <span>Guardado el {fav.dateAdded}</span>
                        {fav.folder && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Folder className="w-3 h-3" />
                              {fav.folder}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {}}
                        className="p-2 text-theme-tertiary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
                        title="Ver documento"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFavorite(fav.id)}
                        className="p-2 text-theme-tertiary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Eliminar de favoritos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal nueva carpeta */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-theme-secondary border border-theme rounded-2xl p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Nueva carpeta</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nombre de la carpeta"
              className="w-full px-4 py-2.5 bg-theme-tertiary border border-theme rounded-xl text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="flex-1 py-2.5 bg-theme-tertiary text-theme-primary rounded-xl hover:bg-theme-hover transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addFolder}
                className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-medium rounded-xl hover:bg-amber-400 transition-colors"
              >
                Crear
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
