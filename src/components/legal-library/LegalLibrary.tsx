import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  Scale,
  ScrollText,
  Gavel,
  Star,
  ChevronRight,
  Scale3D,
  AlertCircle,
} from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import type { LegalSection } from './types';

// Importar componentes de secciones
import SearchLegal from './SearchLegal';
import Constitution from './Constitution';
import LegalCodes from './LegalCodes';
import BOEViewer from './BOEViewer';
import Jurisprudencia from './Jurisprudencia';
import FavoritesLegal from './FavoritesLegal';

// Menú de navegación
const menuItems: { id: LegalSection; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'search', label: 'Búsqueda Rápida', icon: Search, color: 'text-amber-500' },
  { id: 'constitution', label: 'Constitución Española', icon: BookOpen, color: 'text-purple-500' },
  { id: 'codes', label: 'Códigos Legales', icon: Scale, color: 'text-blue-500' },
  { id: 'boe', label: 'BOE Oficial', icon: ScrollText, color: 'text-emerald-500' },
  { id: 'jurisprudencia', label: 'Jurisprudencia', icon: Gavel, color: 'text-rose-500' },
  { id: 'favorites', label: 'Mis Favoritos', icon: Star, color: 'text-amber-400' },
];

// Componente de acceso denegado
const AccesoDenegado = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
    <div className="w-24 h-24 bg-theme-tertiary rounded-full flex items-center justify-center mb-6">
      <AlertCircle className="w-12 h-12 text-theme-tertiary" />
    </div>
    <h2 className="text-2xl font-bold text-theme-primary mb-2">Acceso Restringido</h2>
    <p className="text-theme-tertiary text-center max-w-md">
      Tu rol no tiene permisos para acceder a la Biblioteca Legal. 
      Contacta al administrador si necesitas consultar legislación oficial.
    </p>
  </div>
);

export default function LegalLibrary() {
  const [activeSection, setActiveSection] = useState<LegalSection>('search');
  const { role, roleConfig } = useRole();

  // Determinar si el rol tiene acceso a la biblioteca legal
  // Según la documentación: Recepcionista NO tiene acceso
  const hasAccess = role !== 'recepcionista';

  if (!hasAccess) {
    return <AccesoDenegado />;
  }

  // Renderizar el componente activo
  const renderSection = () => {
    switch (activeSection) {
      case 'search':
        return <SearchLegal onNavigate={setActiveSection} />;
      case 'constitution':
        return <Constitution />;
      case 'codes':
        return <LegalCodes />;
      case 'boe':
        return <BOEViewer />;
      case 'jurisprudencia':
        return <Jurisprudencia />;
      case 'favorites':
        return <FavoritesLegal />;
      default:
        return <SearchLegal onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar de Navegación */}
      <div className="w-72 bg-theme-secondary border-r border-theme overflow-y-auto">
        {/* Header del Sidebar */}
        <div className="p-4 border-b border-theme">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
              <Scale3D className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-theme-primary">Biblioteca Legal</h2>
              <p className="text-xs text-theme-tertiary">Legislación oficial</p>
            </div>
          </div>
        </div>

        {/* Menú de navegación */}
        <div className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-accent/20 text-accent'
                    : 'text-theme-tertiary hover:bg-theme-tertiary hover:text-theme-primary'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />
                <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'rotate-90 text-accent' : ''
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Información del rol */}
        <div className={`mx-4 mt-4 p-3 rounded-xl border ${roleConfig.bgColor} ${roleConfig.textColor.replace('text-', 'border-').replace('400', '500/20')}`}>
          <p className={`text-xs ${roleConfig.textColor}`}>
            Accediendo como: <span className="font-medium capitalize">{role.replace('_', ' ')}</span>
          </p>
          <p className={`text-[10px] mt-1 opacity-80`}>
            Algunas funciones pueden estar limitadas según tu rol
          </p>
        </div>

        {/* Ayuda rápida */}
        <div className="p-4 mt-4">
          <div className="p-4 bg-theme-tertiary/50 rounded-xl border border-theme">
            <p className="text-xs text-theme-secondary mb-2">
              <span className="text-accent font-medium">💡 Consejo:</span>
            </p>
            <p className="text-xs text-theme-tertiary">
              Usa la Búsqueda Rápida para encontrar artículos específicos por número o palabra clave.
            </p>
          </div>
        </div>
      </div>

      {/* Área de contenido */}
      <div className="flex-1 flex flex-col min-w-0 bg-theme-primary">
        {/* Breadcrumb/Header */}
        <div className="h-16 border-b border-theme flex items-center px-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-theme-tertiary">Biblioteca</span>
            <ChevronRight className="w-4 h-4 text-theme-tertiary" />
            <span className="text-theme-tertiary">Legislación Oficial</span>
            <ChevronRight className="w-4 h-4 text-theme-tertiary" />
            <span className="text-accent font-medium">
              {menuItems.find(item => item.id === activeSection)?.label}
            </span>
          </div>
        </div>

        {/* Contenido dinámico */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto"
        >
          {renderSection()}
        </motion.div>
      </div>
    </div>
  );
}
