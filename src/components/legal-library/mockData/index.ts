// Exportar todos los datos mock de la Biblioteca Legal

export { constitucionEspanola } from './constitucion';
export { codigosLegales } from './codigos';
export { boeHoy, boeHistory, searchBOE } from './boe';
export { jurisprudencias, searchJurisprudencia, filterByTribunal } from './jurisprudencia';

// Re-exportar tipos útiles
export type {
  Constitution,
  LegalCode,
  LegalTitle,
  LegalChapter,
  LegalArticle,
  BOEDay,
  BOEDocument,
  Jurisprudence,
  SearchResult,
  LegalFavorite,
} from '../types';
