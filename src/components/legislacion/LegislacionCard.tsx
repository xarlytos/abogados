/**
 * Componente de tarjeta para mostrar documentos de legislación
 */

import { motion } from 'framer-motion';
import {
  FileText,
  Scale,
  BookOpen,
  Gavel,
  Building2,
  Calendar,
  ExternalLink,
  Download,
  Bookmark,
  Share2,
} from 'lucide-react';
import type { LegislacionBase, TipoDocumento, Materia } from '@/types/legislacion';
import { formatearCita, getUrlConsultaPublica } from '@/types/legislacion';

interface LegislacionCardProps {
  documento: LegislacionBase;
  onClick?: () => void;
  compact?: boolean;
}

export function LegislacionCard({ documento, onClick, compact = false }: LegislacionCardProps) {
  const Icon = getIconByTipo(documento.tipo);
  const colorClass = getColorByMateria(documento.materia);
  const urlConsulta = getUrlConsultaPublica(documento);
  const cita = formatearCita(documento);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className="p-4 bg-theme-secondary border border-theme rounded-xl hover:border-amber-500/50 cursor-pointer transition-colors group"
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${colorClass.bg}`}>
            <Icon className={`w-4 h-4 ${colorClass.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-theme-primary truncate group-hover:text-amber-400 transition-colors">
              {documento.titulo}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-theme-secondary">
              <span>{cita}</span>
              <span>•</span>
              <span>{documento.fechaPublicacion.toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="p-5 bg-theme-secondary border border-theme rounded-xl hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-xl ${colorClass.bg}`}>
            <Icon className={`w-6 h-6 ${colorClass.text}`} />
          </div>
          <div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass.badge}`}>
              {getTipoLabel(documento.tipo)}
            </span>
            <h3 className="font-semibold text-theme-primary mt-2 group-hover:text-amber-400 transition-colors line-clamp-2">
              {documento.titulo}
            </h3>
          </div>
        </div>
      </div>

      {/* Cita y fecha */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1.5 text-theme-secondary">
          <Scale className="w-4 h-4" />
          <span className="font-medium">{cita}</span>
        </div>
        <div className="flex items-center gap-1.5 text-theme-secondary">
          <Calendar className="w-4 h-4" />
          <span>{documento.fechaPublicacion.toLocaleDateString('es-ES')}</span>
        </div>
      </div>

      {/* Resumen */}
      {documento.resumen && (
        <p className="text-sm text-theme-secondary line-clamp-2 mb-4">
          {documento.resumen}
        </p>
      )}

      {/* Keywords */}
      {documento.palabrasClave && documento.palabrasClave.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {documento.palabrasClave.slice(0, 5).map((kw, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-theme-tertiary/50 text-theme-secondary text-xs rounded-md"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-theme">
        <div className="flex items-center gap-1">
          <span className={`text-xs px-2 py-1 rounded-full ${getVigenciaColor(documento.vigencia)}`}>
            {getVigenciaLabel(documento.vigencia)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 text-theme-secondary hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
            title="Guardar en favoritos"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-theme-secondary hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
            title="Compartir"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {documento.urlPdf && (
            <a
              href={documento.urlPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-theme-secondary hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
              title="Descargar PDF"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
          <a
            href={urlConsulta}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-theme-secondary hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
            title="Ver en fuente oficial"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// HELPERS
// ============================================

function getIconByTipo(tipo: TipoDocumento) {
  switch (tipo) {
    case 'constitucion':
    case 'codigo':
      return BookOpen;
    case 'sentencia':
    case 'auto':
    case 'providencia':
      return Gavel;
    case 'jurisprudencia':
      return Scale;
    case 'real_decreto':
    case 'real_decreto_ley':
    case 'real_decreto_legislativo':
    case 'ley':
      return Building2;
    default:
      return FileText;
  }
}

function getColorByMateria(materia: Materia) {
  const colors: Record<Materia, { bg: string; text: string; badge: string }> = {
    constitucional: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
    civil: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    penal: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      badge: 'bg-red-500/10 text-red-400 border-red-500/30',
    },
    mercantil: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    laboral: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    },
    administrativo: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    tributario: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    },
    procesal: {
      bg: 'bg-pink-500/10',
      text: 'text-pink-400',
      badge: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    },
    internacional_privado: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    },
    union_europea: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    derechos_humanos: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
  };

  return colors[materia] || colors.administrativo;
}

function getTipoLabel(tipo: TipoDocumento): string {
  const labels: Partial<Record<TipoDocumento, string>> = {
    constitucion: 'Constitución',
    codigo: 'Código',
    ley: 'Ley',
    real_decreto: 'Real Decreto',
    real_decreto_ley: 'Real Decreto-Ley',
    real_decreto_legislativo: 'Real Decreto Legislativo',
    orden: 'Orden',
    resolucion: 'Resolución',
    circular: 'Circular',
    convenio: 'Convenio',
    doctrina: 'Doctrina',
    jurisprudencia: 'Jurisprudencia',
    sentencia: 'Sentencia',
    auto: 'Auto',
    providencia: 'Providencia',
    disposicion: 'Disposición',
    anuncio: 'Anuncio',
    contrato: 'Contrato',
    autoridad: 'Autoridad',
    decreto: 'Decreto',
  };
  return labels[tipo] || tipo;
}

function getVigenciaColor(vigencia: string): string {
  switch (vigencia) {
    case 'vigente':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'modificado':
      return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    case 'derogado':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    case 'pendiente':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
  }
}

function getVigenciaLabel(vigencia: string): string {
  switch (vigencia) {
    case 'vigente':
      return 'Vigente';
    case 'modificado':
      return 'Modificado';
    case 'derogado':
      return 'Derogado';
    case 'pendiente':
      return 'Pendiente';
    default:
      return vigencia;
  }
}
