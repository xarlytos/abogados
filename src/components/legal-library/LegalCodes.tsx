import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  ChevronRight,
  ChevronLeft,
  Copy,
  Star,
  Search,
  BookOpen,
} from 'lucide-react';
import { codigosLegales } from './mockData';
import type { LegalCode, LegalArticle, LegalTitle } from './types';

export default function LegalCodes() {
  const [selectedCode, setSelectedCode] = useState<LegalCode | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<LegalTitle | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<LegalArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const toggleFavorite = (articleId: string) => {
    setFavorites(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Buscar artículos en el código seleccionado
  const searchInCode = (code: LegalCode, query: string): LegalArticle[] => {
    const results: LegalArticle[] = [];
    const lowerQuery = query.toLowerCase();

    code.titles.forEach(title => {
      title.chapters?.forEach(chapter => {
        chapter.articles.forEach(article => {
          if (
            article.number.toLowerCase().includes(lowerQuery) ||
            article.content.toLowerCase().includes(lowerQuery)
          ) {
            results.push(article);
          }
        });
      });
    });

    return results;
  };

  const currentSearchResults = selectedCode && searchQuery
    ? searchInCode(selectedCode, searchQuery)
    : [];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r border-theme bg-theme-secondary overflow-y-auto">
        <div className="p-4 border-b border-theme">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="font-semibold text-theme-primary">Códigos Legales</h2>
              <p className="text-xs text-theme-tertiary">{codigosLegales.length} códigos disponibles</p>
            </div>
          </div>
        </div>

        {!selectedCode ? (
          // Lista de códigos
          <div className="p-2 space-y-2">
            {codigosLegales.map(code => (
              <button
                key={code.id}
                onClick={() => setSelectedCode(code)}
                className="w-full p-3 bg-theme-tertiary/50 hover:bg-theme-tertiary border border-theme hover:border-blue-500/30 rounded-lg text-left transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-theme-primary group-hover:text-blue-400 transition-colors">
                      {code.name}
                    </h3>
                    <p className="text-xs text-theme-tertiary mt-1 truncate">{code.description}</p>
                    <p className="text-xs text-theme-tertiary mt-1">{code.date}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-theme-tertiary group-hover:text-blue-400" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Navegación dentro del código seleccionado
          <div className="p-2">
            <button
              onClick={() => {
                setSelectedCode(null);
                setSelectedTitle(null);
                setSelectedArticle(null);
                setSearchQuery('');
              }}
              className="flex items-center gap-2 text-theme-tertiary hover:text-theme-primary mb-4 px-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Volver a códigos</span>
            </button>

            <div className="px-2 mb-4">
              <h3 className="font-medium text-theme-primary">{selectedCode.name}</h3>
              <p className="text-xs text-theme-tertiary">{selectedCode.shortName}</p>
            </div>

            {/* Buscador */}
            <div className="relative mb-4 px-2">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artículo..."
                className="w-full pl-9 pr-3 py-2 bg-theme-tertiary border border-theme rounded-lg text-sm text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Resultados de búsqueda */}
            {searchQuery ? (
              <div className="space-y-1 px-2">
                <p className="text-xs text-theme-tertiary py-2">
                  {currentSearchResults.length} resultados
                </p>
                {currentSearchResults.map(article => (
                  <button
                    key={article.id}
                    onClick={() => {
                      setSelectedArticle(article);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-theme-tertiary hover:bg-theme-tertiary rounded-lg"
                  >
                    <span className="text-blue-400">{article.number}</span>
                    <p className="text-xs text-theme-tertiary truncate">{article.content.slice(0, 50)}...</p>
                  </button>
                ))}
              </div>
            ) : (
              // Índice del código
              <div className="space-y-1">
                {selectedCode.titles.map(title => (
                  <div key={title.id}>
                    <button
                      onClick={() => setSelectedTitle(selectedTitle?.id === title.id ? null : title)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors"
                    >
                      <ChevronRight className={`w-4 h-4 text-theme-tertiary transition-transform ${selectedTitle?.id === title.id ? 'rotate-90' : ''}`} />
                      <span className="text-sm text-theme-secondary">{title.number}</span>
                    </button>

                    <AnimatePresence>
                      {selectedTitle?.id === title.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-6 pr-2 space-y-1">
                            {title.chapters?.map(chapter => (
                              <div key={chapter.id} className="mb-2">
                                <p className="text-xs text-theme-tertiary px-2 py-1">{chapter.number}</p>
                                {chapter.articles.map(article => (
                                  <button
                                    key={article.id}
                                    onClick={() => setSelectedArticle(article)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                      selectedArticle?.id === article.id
                                        ? 'bg-blue-500/20 text-blue-400'
                                        : 'text-theme-tertiary hover:bg-theme-tertiary hover:text-theme-secondary'
                                    }`}
                                  >
                                    <span>{article.number}</span>
                                    {favorites.includes(article.id) && (
                                      <Star className="w-3 h-3 text-amber-400 fill-current ml-auto" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto p-8">
        {!selectedCode ? (
          // Vista de bienvenida
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-theme-primary mb-4">Códigos Legales</h1>
              <p className="text-theme-secondary max-w-2xl">
                Consulta los principales códigos legales españoles: Civil, Penal, 
                Procesales y Laboral. Selecciona un código para explorar su contenido.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {codigosLegales.map((code, index) => (
                <motion.button
                  key={code.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedCode(code)}
                  className="p-6 bg-theme-secondary border border-theme rounded-xl hover:border-blue-500/50 transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Scale className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="text-xs text-theme-tertiary bg-theme-tertiary px-2 py-1 rounded">
                      {code.date}
                    </span>
                  </div>
                  <h3 className="font-semibold text-theme-primary mb-2 group-hover:text-blue-400 transition-colors">
                    {code.name}
                  </h3>
                  <p className="text-sm text-theme-secondary">{code.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-blue-400">
                    <span>Explorar código</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : selectedArticle ? (
          // Vista del artículo
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex items-center gap-2 text-theme-tertiary hover:text-theme-primary mb-4"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">Volver al índice</span>
                </button>
                <div className="flex items-center gap-2 text-sm text-theme-tertiary mb-2">
                  <span>{selectedCode.name}</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{selectedTitle?.number}</span>
                </div>
                <h1 className="text-2xl font-bold text-theme-primary">
                  {selectedArticle.number}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(`${selectedArticle.number}\n${selectedArticle.content}`)}
                  className="p-2 text-theme-tertiary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
                >
                  {copied ? <span className="text-emerald-400 text-xs">¡Copiado!</span> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => toggleFavorite(selectedArticle.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    favorites.includes(selectedArticle.id)
                      ? 'text-amber-400 bg-amber-400/10'
                      : 'text-theme-tertiary hover:text-amber-400 hover:bg-theme-tertiary'
                  }`}
                >
                  <Star className={`w-5 h-5 ${favorites.includes(selectedArticle.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            <div className="p-6 bg-theme-secondary border border-theme rounded-xl">
              <p className="text-theme-secondary leading-relaxed whitespace-pre-line text-lg">
                {selectedArticle.content}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm text-theme-tertiary">
              <span>Fuente: {selectedCode.name}</span>
              <span>•</span>
              <span>Actualizado: {selectedCode.date}</span>
            </div>
          </motion.div>
        ) : (
          // Vista del código seleccionado (sin artículo específico)
          <div>
            <div className="mb-8">
              <button
                onClick={() => setSelectedCode(null)}
                className="flex items-center gap-2 text-theme-tertiary hover:text-theme-primary mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Volver a códigos</span>
              </button>
              <h1 className="text-3xl font-bold text-theme-primary mb-2">{selectedCode.name}</h1>
              <p className="text-theme-secondary">{selectedCode.description}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-theme-primary">Estructura</h2>
              {selectedCode.titles.map((title, index) => (
                <motion.div
                  key={title.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedTitle(title)}
                  className="p-4 bg-theme-secondary/60 border border-theme rounded-lg hover:border-blue-500/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-theme-primary">{title.number}</h3>
                      <p className="text-sm text-theme-tertiary">{title.title}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-theme-tertiary" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
