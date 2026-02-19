import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  BookOpen,
  Scale,
  ScrollText,
  Gavel,
  ArrowRight,
  Clock,
} from 'lucide-react';
import type { LegalSection, SearchResult } from './types';
import {
  constitucionEspanola,
  codigosLegales,
  boeHoy,
  boeHistory,
  jurisprudencias,
} from './mockData';

interface SearchLegalProps {
  onNavigate?: (section: LegalSection) => void;
}

// Fuentes de búsqueda
const searchSources = [
  { id: 'constitution', label: 'Constitución', icon: BookOpen, color: 'text-purple-500' },
  { id: 'codes', label: 'Códigos', icon: Scale, color: 'text-blue-500' },
  { id: 'boe', label: 'BOE', icon: ScrollText, color: 'text-emerald-500' },
  { id: 'jurisprudencia', label: 'Jurisprudencia', icon: Gavel, color: 'text-rose-500' },
];

export default function SearchLegal({ onNavigate }: SearchLegalProps) {
  const [query, setQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([
    'constitution', 'codes', 'boe', 'jurisprudencia'
  ]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Función de búsqueda en todas las fuentes
  const searchResults: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Buscar en Constitución
    if (selectedSources.includes('constitution')) {
      constitucionEspanola.titles.forEach(title => {
        // Buscar en artículos del título
        title.articles?.forEach(article => {
          if (
            article.number.toLowerCase().includes(lowerQuery) ||
            article.content.toLowerCase().includes(lowerQuery) ||
            (article.title && article.title.toLowerCase().includes(lowerQuery))
          ) {
            results.push({
              id: article.id,
              type: 'constitution',
              title: `${title.number} - ${article.number}`,
              excerpt: article.content.slice(0, 150) + '...',
              source: 'Constitución Española',
            });
          }
        });

        // Buscar en capítulos
        title.chapters?.forEach(chapter => {
          chapter.articles.forEach(article => {
            if (
              article.number.toLowerCase().includes(lowerQuery) ||
              article.content.toLowerCase().includes(lowerQuery)
            ) {
              results.push({
                id: article.id,
                type: 'constitution',
                title: `${title.number} - ${article.number}`,
                excerpt: article.content.slice(0, 150) + '...',
                source: 'Constitución Española',
              });
            }
          });
        });
      });
    }

    // Buscar en Códigos
    if (selectedSources.includes('codes')) {
      codigosLegales.forEach(code => {
        code.titles.forEach(title => {
          title.chapters?.forEach(chapter => {
            chapter.articles.forEach(article => {
              if (
                article.number.toLowerCase().includes(lowerQuery) ||
                article.content.toLowerCase().includes(lowerQuery)
              ) {
                results.push({
                  id: article.id,
                  type: 'code',
                  title: `${code.shortName} - ${article.number}`,
                  excerpt: article.content.slice(0, 150) + '...',
                  source: code.name,
                });
              }
            });
          });
        });
      });
    }

    // Buscar en BOE
    if (selectedSources.includes('boe')) {
      const allBOE = [boeHoy, ...boeHistory];
      allBOE.forEach(day => {
        day.documents.forEach(doc => {
          if (
            doc.title.toLowerCase().includes(lowerQuery) ||
            doc.number.toLowerCase().includes(lowerQuery) ||
            doc.summary.toLowerCase().includes(lowerQuery)
          ) {
            results.push({
              id: doc.id,
              type: 'boe',
              title: doc.number,
              excerpt: doc.title,
              source: `BOE ${day.number} - ${day.date}`,
              date: day.date,
            });
          }
        });
      });
    }

    // Buscar en Jurisprudencia
    if (selectedSources.includes('jurisprudencia')) {
      jurisprudencias.forEach(item => {
        if (
          item.number.toLowerCase().includes(lowerQuery) ||
          item.materia.toLowerCase().includes(lowerQuery) ||
          item.summary.toLowerCase().includes(lowerQuery) ||
          item.ponente.toLowerCase().includes(lowerQuery)
        ) {
          results.push({
            id: item.id,
            type: 'jurisprudencia',
            title: item.number,
            excerpt: item.materia + ' - ' + item.summary.slice(0, 100) + '...',
            source: item.sala,
            date: item.date,
          });
        }
      });
    }

    return results.slice(0, 20); // Limitar a 20 resultados
  }, [query, selectedSources]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim() && !searchHistory.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev].slice(0, 10));
    }
  };

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleResultClick = (result: SearchResult) => {
    if (onNavigate) {
      onNavigate(result.type as LegalSection);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-theme-primary mb-2">Búsqueda Rápida Legal</h1>
        <p className="text-theme-tertiary">
          Busca en la Constitución, Códigos Legales, BOE y Jurisprudencia
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-tertiary" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar artículos, leyes, sentencias..."
            className="w-full pl-12 pr-4 py-4 bg-theme-secondary border border-theme rounded-xl text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Filtros de fuentes */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-theme-tertiary" />
          <span className="text-sm text-theme-secondary">Buscar en:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {searchSources.map((source) => {
            const Icon = source.icon;
            const isSelected = selectedSources.includes(source.id);
            
            return (
              <button
                key={source.id}
                onClick={() => toggleSource(source.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  isSelected
                    ? 'bg-theme-tertiary text-theme-primary border border-theme'
                    : 'bg-theme-secondary/50 text-theme-tertiary border border-theme'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? source.color : ''}`} />
                <span>{source.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Historial de búsquedas */}
      {searchHistory.length > 0 && !query && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-theme-tertiary" />
            <span className="text-sm text-theme-secondary">Búsquedas recientes:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSearch(item)}
                className="px-3 py-1.5 bg-theme-secondary/50 text-theme-tertiary text-sm rounded-lg hover:bg-theme-tertiary hover:text-theme-primary transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultados */}
      {query && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-theme-primary">
              Resultados {searchResults.length > 0 && `(${searchResults.length})`}
            </h3>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-theme-tertiary mx-auto mb-4" />
              <p className="text-theme-secondary">No se encontraron resultados para "{query}"</p>
              <p className="text-theme-tertiary text-sm mt-2">
                Intenta con otros términos o ajusta los filtros de búsqueda
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleResultClick(result)}
                  className="p-4 bg-theme-secondary border border-theme rounded-xl cursor-pointer hover:border-accent/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-theme-tertiary rounded-lg flex items-center justify-center flex-shrink-0">
                      {result.type === 'constitution' && <BookOpen className="w-5 h-5 text-purple-500" />}
                      {result.type === 'code' && <Scale className="w-5 h-5 text-blue-500" />}
                      {result.type === 'boe' && <ScrollText className="w-5 h-5 text-emerald-500" />}
                      {result.type === 'jurisprudencia' && <Gavel className="w-5 h-5 text-rose-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-theme-primary group-hover:text-accent transition-colors">
                          {result.title}
                        </h4>
                        <ArrowRight className="w-4 h-4 text-theme-tertiary group-hover:text-accent transition-colors" />
                      </div>
                      <p className="text-sm text-theme-secondary mb-2">{result.excerpt}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-theme-tertiary">{result.source}</span>
                        {result.date && (
                          <>
                            <span className="text-theme-tertiary">•</span>
                            <span className="text-xs text-theme-tertiary">{result.date}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Acceso rápido cuando no hay búsqueda */}
      {!query && (
        <div>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Acceso Rápido</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchSources.map((source, index) => {
              const Icon = source.icon;
              return (
                <motion.button
                  key={source.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onNavigate?.(source.id as LegalSection)}
                  className="p-6 bg-theme-secondary border border-theme rounded-xl hover:border-accent/50 transition-all group text-left"
                >
                  <div className={`w-12 h-12 bg-theme-tertiary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${source.color}`} />
                  </div>
                  <h4 className="font-medium text-theme-primary mb-1">{source.label}</h4>
                  <p className="text-sm text-theme-tertiary">Consultar {source.label.toLowerCase()}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
