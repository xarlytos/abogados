// ============================================
// SELECTOR DE TIPO DE FIRMA
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pencil, Shield, Award, Fingerprint, Key,
  Landmark, IdCard, Cloud,
  ChevronDown, Info, CheckCircle2
} from 'lucide-react';
import type { SignatureType, SignatureTypeSelectorProps } from '@/types/signature';
import { SIGNATURE_TYPE_DESCRIPTIONS } from '@/types/signature';

const typeIcons: Record<SignatureType, typeof Pencil> = {
  simple: Pencil,
  advanced: Shield,
  qualified: Award,
  biometric: Fingerprint,
  certificate: Key,
  fnmt: Landmark,
  dnie: IdCard,
  cloud: Cloud,
};

const typeColors: Record<SignatureType, { bg: string; border: string; text: string; icon: string }> = {
  simple: {
    bg: 'bg-theme-tertiary',
    border: 'border-theme',
    text: 'text-theme-primary',
    icon: 'text-theme-secondary',
  },
  advanced: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    icon: 'text-emerald-500',
  },
  qualified: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    icon: 'text-amber-500',
  },
  biometric: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    icon: 'text-purple-500',
  },
  certificate: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    icon: 'text-blue-500',
  },
  fnmt: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    icon: 'text-emerald-500',
  },
  dnie: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    icon: 'text-blue-500',
  },
  cloud: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    icon: 'text-cyan-500',
  },
};

export function SignatureTypeSelector({
  value,
  onChange,
  allowedTypes = ['simple', 'advanced', 'qualified', 'biometric', 'certificate'],
  disabled = false,
}: SignatureTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState<SignatureType | null>(null);

  const selectedType = value;
  const SelectedIcon = typeIcons[selectedType];
  const selectedColors = typeColors[selectedType];

  const availableTypes = allowedTypes.filter(type => type !== value);

  return (
    <div className="relative">
      {/* Selector principal */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-4 border rounded-xl text-left transition-all ${
          disabled 
            ? 'opacity-50 cursor-not-allowed border-theme bg-theme-secondary/30' 
            : 'border-theme-hover hover:border-theme bg-theme-tertiary/50 cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${selectedColors.bg}`}>
            <SelectedIcon className={`w-5 h-5 ${selectedColors.icon}`} />
          </div>
          <div className="flex-1">
            <p className={`font-medium ${selectedColors.text}`}>
              {SIGNATURE_TYPE_DESCRIPTIONS[selectedType].name}
            </p>
                      <p className="text-xs text-theme-muted">
              {SIGNATURE_TYPE_DESCRIPTIONS[selectedType].description.slice(0, 60)}...
            </p>
          </div>
          {!disabled && availableTypes.length > 0 && (
            <ChevronDown className={`w-5 h-5 text-theme-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && availableTypes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-theme-secondary border border-theme-hover rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {availableTypes.map((type) => {
              const Icon = typeIcons[type];
              const colors = typeColors[type];
              
              return (
                <div
                  key={type}
                  className="group"
                >
                  <button
                    onClick={() => {
                      onChange(type);
                      setIsOpen(false);
                    }}
                    className="w-full p-4 flex items-center gap-3 hover:bg-theme-tertiary/50 transition-colors text-left"
                  >
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${colors.text}`}>
                        {SIGNATURE_TYPE_DESCRIPTIONS[type].name}
                      </p>
            <p className="text-xs text-theme-muted">
                        {SIGNATURE_TYPE_DESCRIPTIONS[type].description}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInfo(showInfo === type ? null : type);
                      }}
                      className="p-2 text-theme-muted hover:text-theme-primary rounded-lg hover:bg-theme-tertiary"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </button>

                  {/* Info expandible */}
                  <AnimatePresence>
                    {showInfo === type && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-theme-tertiary/30"
                      >
                        <div className="p-4 pt-0">
                          <div className="p-3 bg-theme-tertiary/50 rounded-lg">
                            <p className="text-xs text-theme-secondary">
                              {SIGNATURE_TYPE_DESCRIPTIONS[type].description}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span className="text-xs text-theme-muted">Validez jurídica garantizada</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para cerrar al hacer click fuera */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Versión compacta (badges)
export function SignatureTypeBadge({ 
  type, 
  size = 'md',
  showLabel = true 
}: { 
  type: SignatureType; 
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}) {
  const Icon = typeIcons[type];
  const colors = typeColors[type];
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${colors.bg} ${colors.border} ${colors.text} ${sizeClasses[size]}`}>
      <Icon className={`${iconSizes[size]} ${colors.icon}`} />
      {showLabel && SIGNATURE_TYPE_DESCRIPTIONS[type].name}
    </span>
  );
}

// Grid de tipos (para selección visual)
export function SignatureTypeGrid({
  value,
  onChange,
  allowedTypes = ['simple', 'advanced', 'qualified', 'biometric', 'certificate'],
}: SignatureTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {allowedTypes.map((type) => {
        const Icon = typeIcons[type];
        const colors = typeColors[type];
        const isSelected = value === type;

        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`p-4 border rounded-xl text-left transition-all ${
              isSelected
                ? `${colors.border} ${colors.bg} ring-1 ring-${colors.text.split('-')[1]}-500/50`
                : 'border-theme hover:border-theme-hover bg-theme-secondary/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${isSelected ? colors.bg : 'bg-theme-tertiary'}`}>
                <Icon className={`w-5 h-5 ${isSelected ? colors.icon : 'text-theme-muted'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${isSelected ? colors.text : 'text-theme-primary'}`}>
                  {SIGNATURE_TYPE_DESCRIPTIONS[type].name}
                </p>
                <p className="text-xs text-theme-muted mt-1 line-clamp-2">
                  {SIGNATURE_TYPE_DESCRIPTIONS[type].description}
                </p>
              </div>
              {isSelected && (
                <div className={`w-5 h-5 rounded-full ${colors.bg} ${colors.border} flex items-center justify-center`}>
                  <CheckCircle2 className={`w-3 h-3 ${colors.icon}`} />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default SignatureTypeSelector;
