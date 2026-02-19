import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ScrollText,
  Calendar,
  Filter,
  Download,
  Star,
  ChevronLeft,
  ChevronRight,
  Building2,
  FileText,
  Bell,
  Search,
} from 'lucide-react';
import { boeHoy, boeHistory, searchBOE } from './mockData';
import type { BOEDay, BOEDocument } from './types';

const tipoColors: Record<BOEDocument['type'], { bg: string; text: string; label: string }> = {
  'ley': { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Ley' },
  'real-decreto': { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Real Decreto' },
  'orden': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Orden' },
  'resolucion': { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Resolución' },
  'circular': { bg: 'bg-slate-500/10', text: 'text-slate-400', label: 'Circular' },
};

export default function BOEViewer() {
  const [selectedDay, setSelectedDay] = useState<BOEDay>(boeHoy);
  const [selectedDocument, setSelectedDocument] = useState<BOEDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<BOEDocument['type'] | 'all'>('all');
  const [showAlerts, setShowAlerts] = useState(false);

  const toggleFavorite = (docId: string) => {
    setFavorites(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  // Filtrar documentos
  const filteredDocuments = selectedDay.documents.filter(doc => {
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.ministry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Buscar en todo el historial
  const searchResults = searchQuery.length > 2 ? searchBOE(searchQuery) : [];

  // Cambiar de fecha
  const changeDate = (direction: 'prev' | 'next') => {
    const currentIndex = boeHistory.findIndex(day => day.date === selectedDay.date);
    if (direction === 'prev' && currentIndex < boeHistory.length - 1) {
      setSelectedDay(boeHistory[currentIndex + 1]);
    } else if (direction === 'next' && currentIndex > 0) {
      setSelectedDay(boeHistory[currentIndex - 1]);
    }
    setSelectedDocument(null);
  };

  if (selectedDocument) {
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
                onClick={() => setSelectedDocument(null)}
                className="flex items-center gap-2 text-theme-tertiary hover:text-theme-primary mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Volver al sumario</span>
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 text-xs rounded ${tipoColors[selectedDocument.type].bg} ${tipoColors[selectedDocument.type].text}`}>
                  {tipoColors[selectedDocument.type].label}
                </span>
                <span className="text-sm text-theme-tertiary">{selectedDocument.date}</span>
              </div>
              <h1 className="text-2xl font-bold text-theme-primary">{selectedDocument.number}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open(selectedDocument.pdfUrl, '_blank')}
                className="flex items-center gap-2 px-3 py-2 bg-theme-tertiary text-theme-secondary rounded-lg hover:bg-theme-hover transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">PDF</span>
              </button>
              <button
                onClick={() => toggleFavorite(selectedDocument.id)}
                className={`p-2 rounded-lg transition-colors ${
                  favorites.includes(selectedDocument.id)
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-theme-tertiary hover:text-amber-400 hover:bg-theme-tertiary'
                }`}
              >
                <Star className={`w-5 h-5 ${favorites.includes(selectedDocument.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 bg-theme-secondary border border-theme rounded-xl">
            <h2 className="text-lg font-medium text-theme-primary mb-4">{selectedDocument.title}</h2>
            <div className="flex items-center gap-2 text-sm text-theme-tertiary mb-6">
              <Building2 className="w-4 h-4" />
              <span>{selectedDocument.ministry}</span>
            </div>
            <p className="text-theme-secondary leading-relaxed">{selectedDocument.summary}</p>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-theme-secondary/60 border border-theme rounded-lg">
            <h3 className="text-sm font-medium text-theme-primary mb-2">Información del BOE</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-theme-tertiary">Boletín:</span>
                <span className="text-theme-secondary ml-2">Nº {selectedDay.number}</span>
              </div>
              <div>
                <span className="text-theme-tertiary">Fecha:</span>
                <span className="text-theme-secondary ml-2">{selectedDay.date}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header del BOE */}
      <div className="p-6 border-b border-theme">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-theme-primary">Boletín Oficial del Estado</h1>
              <p className="text-sm text-theme-tertiary">Legislación oficial del Estado español</p>
            </div>
          </div>
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="flex items-center gap-2 px-3 py-2 bg-theme-tertiary text-theme-secondary rounded-lg hover:bg-theme-hover transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="text-sm">Alertas</span>
          </button>
        </div>

        {/* Navegador de fechas y búsqueda */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Navegador de fechas */}
          <div className="flex items-center gap-2 bg-theme-secondary border border-theme rounded-xl p-1">
            <button
              onClick={() => changeDate('prev')}
              className="p-2 hover:bg-theme-tertiary rounded-lg text-theme-tertiary hover:text-theme-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-4">
              <Calendar className="w-4 h-4 text-theme-tertiary" />
              <span className="text-theme-primary font-medium">{selectedDay.date}</span>
              <span className="text-theme-tertiary">•</span>
              <span className="text-theme-secondary">BOE Nº {selectedDay.number}</span>
            </div>
            <button
              onClick={() => changeDate('next')}
              className="p-2 hover:bg-theme-tertiary rounded-lg text-theme-tertiary hover:text-theme-primary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Buscador */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en BOE histórico..."
              className="w-full pl-10 pr-4 py-2.5 bg-theme-secondary border border-theme rounded-xl text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Filtros */}
        {!searchQuery && (
          <div className="flex items-center gap-2 mt-4">
            <Filter className="w-4 h-4 text-theme-tertiary" />
            <span className="text-sm text-theme-secondary mr-2">Filtrar por:</span>
            {(['all', 'ley', 'real-decreto', 'orden', 'resolucion'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filterType === type
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-theme-secondary text-theme-tertiary border border-theme hover:border-theme-hover'
                }`}
              >
                {type === 'all' ? 'Todos' : tipoColors[type].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Resultados de búsqueda histórica */}
        {searchQuery ? (
          <div>
            <h2 className="text-lg font-medium text-theme-primary mb-4">
              Resultados de búsqueda ({searchResults.length})
            </h2>
            <div className="space-y-3">
              {searchResults.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedDocument(doc)}
                  className="p-4 bg-theme-secondary border border-theme rounded-xl cursor-pointer hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span className={`px-2 py-0.5 text-xs rounded ${tipoColors[doc.type].bg} ${tipoColors[doc.type].text}`}>
                      {tipoColors[doc.type].label}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-medium text-theme-primary mb-1">{doc.number}</h3>
                      <p className="text-sm text-theme-secondary mb-2">{doc.title}</p>
                      <div className="flex items-center gap-2 text-xs text-theme-tertiary">
                        <Building2 className="w-3 h-3" />
                        <span>{doc.ministry}</span>
                        <span>•</span>
                        <span>{doc.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Sumario del día */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-theme-primary">Sumario del BOE</h2>
              <span className="text-sm text-theme-tertiary">
                {filteredDocuments.length} disposiciones
              </span>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
                <p className="text-theme-secondary">No hay disposiciones con los filtros seleccionados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Agrupar por ministerio */}
                {Array.from(new Set(filteredDocuments.map(d => d.ministry))).map(ministry => (
                  <div key={ministry}>
                    <h3 className="text-sm font-medium text-theme-secondary mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {ministry}
                    </h3>
                    <div className="space-y-2">
                      {filteredDocuments
                        .filter(d => d.ministry === ministry)
                        .map((doc, index) => (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedDocument(doc)}
                            className="p-4 bg-theme-secondary/60 border border-theme rounded-lg cursor-pointer hover:border-emerald-500/30 transition-all group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-2 py-0.5 text-xs rounded ${tipoColors[doc.type].bg} ${tipoColors[doc.type].text}`}>
                                    {tipoColors[doc.type].label}
                                  </span>
                                  <span className="text-xs text-theme-tertiary">{doc.number}</span>
                                </div>
                                <h4 className="text-theme-primary group-hover:text-emerald-400 transition-colors">
                                  {doc.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(doc.id);
                                  }}
                                  className="p-1.5 text-theme-tertiary hover:text-amber-400 transition-colors"
                                >
                                  <Star className={`w-4 h-4 ${favorites.includes(doc.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
