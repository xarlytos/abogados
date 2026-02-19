import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Copy,
  Star,
  Search,
  Scroll,
} from 'lucide-react';
import { constitucionEspanola } from './mockData';
import type { LegalArticle, LegalTitle } from './types';

export default function Constitution() {
  const [selectedTitle, setSelectedTitle] = useState<LegalTitle | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<LegalArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const constitution = constitucionEspanola;

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

  // Filtrar artículos por búsqueda
  const filteredArticles = searchQuery
    ? constitution.titles.flatMap(title => [
        ...(title.articles || []),
        ...(title.chapters?.flatMap(ch => ch.articles) || []),
      ]).filter(article =>
        article.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="flex h-full">
      {/* Sidebar - Índice */}
      <div className="w-80 border-r border-theme bg-theme-secondary overflow-y-auto">
        <div className="p-4 border-b border-theme">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-purple-500" />
            <div>
              <h2 className="font-semibold text-theme-primary">Constitución Española</h2>
              <p className="text-xs text-theme-tertiary">1978</p>
            </div>
          </div>
          
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar artículo..."
              className="w-full pl-9 pr-3 py-2 bg-theme-tertiary border border-theme rounded-lg text-sm text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Lista de títulos */}
        {!searchQuery && (
          <div className="p-2">
            {/* Preámbulo */}
            <button
              onClick={() => { setSelectedTitle(null); setSelectedArticle(null); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                !selectedTitle && !selectedArticle ? 'bg-purple-500/20 text-purple-400' : 'text-theme-tertiary hover:bg-theme-tertiary'
              }`}
            >
              <Scroll className="w-4 h-4" />
              <span className="text-sm">Preámbulo</span>
            </button>

            {/* Títulos */}
            {constitution.titles.map((title) => (
              <div key={title.id}>
                <button
                  onClick={() => setSelectedTitle(selectedTitle?.id === title.id ? null : title)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    selectedTitle?.id === title.id ? 'bg-theme-tertiary text-theme-primary' : 'text-theme-tertiary hover:bg-theme-tertiary'
                  }`}
                >
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedTitle?.id === title.id ? 'rotate-90' : ''}`} />
                  <span className="text-sm font-medium">{title.number}</span>
                </button>

                <AnimatePresence>
                  {selectedTitle?.id === title.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pr-2 py-1 space-y-1">
                        {/* Capítulos */}
                        {title.chapters?.map(chapter => (
                          <div key={chapter.id} className="mb-2">
                            <p className="text-xs text-theme-tertiary px-3 py-1">{chapter.number}</p>
                            {chapter.articles.map(article => (
                              <button
                                key={article.id}
                                onClick={() => setSelectedArticle(article)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                  selectedArticle?.id === article.id
                                    ? 'bg-purple-500/20 text-purple-400'
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

                        {/* Artículos directos del título */}
                        {title.articles?.map(article => (
                          <button
                            key={article.id}
                            onClick={() => setSelectedArticle(article)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedArticle?.id === article.id
                                ? 'bg-purple-500/20 text-purple-400'
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {/* Resultados de búsqueda */}
        {searchQuery && (
          <div className="p-2">
            <p className="text-xs text-theme-tertiary px-3 py-2">
              {filteredArticles.length} resultados
            </p>
            {filteredArticles.map(article => (
              <button
                key={article.id}
                onClick={() => {
                  setSelectedArticle(article);
                  setSearchQuery('');
                }}
                className="w-full text-left px-3 py-2 text-sm text-theme-tertiary hover:bg-theme-tertiary rounded-lg"
              >
                <span className="text-purple-400">{article.number}</span>
                <p className="text-xs text-theme-tertiary truncate">{article.content.slice(0, 60)}...</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto p-8">
        {!selectedArticle ? (
          // Vista del Preámbulo o bienvenida
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-theme-primary mb-4">
                Constitución Española
              </h1>
              <div className="flex items-center gap-4 text-sm text-theme-secondary">
                <span>Aprobada el 6 de diciembre de 1978</span>
                <span>•</span>
                <span>Referéndum: 1,7 millones de votos</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="p-6 bg-theme-secondary border border-theme rounded-xl">
                <h2 className="text-lg font-medium text-purple-400 mb-4">Preámbulo</h2>
                <p className="text-theme-secondary leading-relaxed whitespace-pre-line">
                  {constitution.preamble}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-theme-secondary/60 border border-theme rounded-lg">
                  <h3 className="font-medium text-theme-primary mb-2">Estructura</h3>
                  <p className="text-sm text-theme-secondary">
                    La Constitución se compone de un Preámbulo, 10 Títulos, 169 artículos, 
                    y Disposiciones Adicionales, Transitorias, Derogatorias y Finales.
                  </p>
                </div>
                <div className="p-4 bg-theme-secondary/60 border border-theme rounded-lg">
                  <h3 className="font-medium text-theme-primary mb-2">Principios fundamentales</h3>
                  <p className="text-sm text-theme-secondary">
                    Estado social y democrático de Derecho, soberanía nacional, 
                    monarquía parlamentaria y derechos fundamentales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Vista del artículo seleccionado
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            {/* Header del artículo */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex items-center gap-2 text-theme-tertiary hover:text-theme-primary mb-4"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">Volver al índice</span>
                </button>
                <h1 className="text-2xl font-bold text-theme-primary">
                  {selectedArticle.number}
                </h1>
                {selectedArticle.title && (
                  <p className="text-purple-400 mt-1">{selectedArticle.title}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(`${selectedArticle.number}\n${selectedArticle.content}`)}
                  className="p-2 text-theme-tertiary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
                  title="Copiar texto"
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
                  title="Añadir a favoritos"
                >
                  <Star className={`w-5 h-5 ${favorites.includes(selectedArticle.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Contenido del artículo */}
            <div className="p-6 bg-theme-secondary border border-theme rounded-xl">
              <p className="text-theme-secondary leading-relaxed whitespace-pre-line text-lg">
                {selectedArticle.content}
              </p>
            </div>

            {/* Información adicional */}
            <div className="mt-6 flex items-center gap-4 text-sm text-theme-tertiary">
              <span>Fuente: Constitución Española de 1978</span>
              <span>•</span>
              <span>Actualizado: Diciembre 1978</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
