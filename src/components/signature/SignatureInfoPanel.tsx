// ============================================
// PANEL INFORMATIVO DE OPCIONES DE FIRMA
// Para el Portal del Cliente
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, IdCard, Key, Shield, Fingerprint,
  Award, Cloud, X, CheckCircle, AlertCircle,
  ChevronRight, ExternalLink, Timer
} from 'lucide-react';
import { useState } from 'react';
import type { SignatureType } from '@/types/signature';
import { SIGNATURE_TYPE_DESCRIPTIONS } from '@/types/signature';

interface SignatureOption {
  type: SignatureType;
  icon: typeof Key;
  color: string;
  requirements: string[];
  setupUrl?: string;
}

const signatureOptions: SignatureOption[] = [
  {
    type: 'fnmt',
    icon: Landmark,
    color: 'text-emerald-400',
    requirements: [
      'Tener certificado de la FNMT-RCM vigente',
      'Tener instalado el software Autofirma',
      'Conexión con el servidor de la FNMT',
    ],
    setupUrl: 'https://www.sede.fnmt.gob.es/certificados/persona-fisica',
  },
  {
    type: 'dnie',
    icon: IdCard,
    color: 'text-blue-400',
    requirements: [
      'DNI Electrónico vigente',
      'Lector de tarjetas compatible',
      'Drivers del DNIe instalados',
    ],
    setupUrl: 'https://www.dnielectronico.es/',
  },
  {
    type: 'cloud',
    icon: Cloud,
    color: 'text-cyan-400',
    requirements: [
      'Cuenta verificada en el servicio',
      'Autenticación de doble factor',
      'Acceso a internet',
    ],
  },
  {
    type: 'qualified',
    icon: Award,
    color: 'text-amber-400',
    requirements: [
      'Certificado cualificado de eIDAS',
      'Software de firma compatible',
      'Clave privada accesible',
    ],
  },
  {
    type: 'advanced',
    icon: Shield,
    color: 'text-emerald-400',
    requirements: [
      'Verificación de identidad previa',
      'Acceso a la plataforma',
    ],
  },
  {
    type: 'biometric',
    icon: Fingerprint,
    color: 'text-purple-400',
    requirements: [
      'Dispositivo con pantalla táctil o ratón',
      'Navegador compatible',
    ],
  },
];

interface SignatureInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignatureInfoPanel({ isOpen, onClose }: SignatureInfoPanelProps) {
  const [selectedOption, setSelectedOption] = useState<SignatureOption | null>(null);
  const [showTimestampInfo, setShowTimestampInfo] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-theme-primary/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-3xl max-h-[85vh] bg-theme-secondary border border-theme rounded-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme bg-gradient-to-r from-amber-500/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-xl">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-theme-primary">Opciones de Firma Digital</h2>
                <p className="text-sm text-theme-secondary">Elige el método que mejor se adapte a tus necesidades</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Introducción */}
            <div className="mb-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
              <p className="text-sm text-theme-secondary">
                <strong className="text-theme-primary">¿Necesitas firmar un documento?</strong> {' '}
                Nuestra plataforma soporta múltiples métodos de firma electrónica, desde el DNIe hasta certificados 
                de la FNMT. Todos ellos tienen validez legal según el Reglamento eIDAS.
              </p>
            </div>

            {/* Opciones de firma */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-medium text-theme-primary mb-3">Métodos disponibles</h3>
              {signatureOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedOption?.type === option.type;
                
                return (
                  <motion.button
                    key={option.type}
                    onClick={() => setSelectedOption(isSelected ? null : option)}
                    className={`w-full p-4 border rounded-xl text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-theme hover:border-theme-hover bg-theme-tertiary/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-theme-secondary ${option.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-theme-primary">
                            {SIGNATURE_TYPE_DESCRIPTIONS[option.type].name}
                          </h4>
                          <ChevronRight className={`w-5 h-5 text-theme-muted transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                        </div>
                        <p className="text-sm text-theme-secondary mt-1">
                          {SIGNATURE_TYPE_DESCRIPTIONS[option.type].description}
                        </p>
                        
                        {/* Requisitos expandibles */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 space-y-3">
                                <div>
                                  <p className="text-xs font-medium text-theme-primary mb-2">Requisitos:</p>
                                  <ul className="space-y-1">
                                    {option.requirements.map((req, idx) => (
                                      <li key={idx} className="flex items-center gap-2 text-xs text-theme-secondary">
                                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                {option.setupUrl && (
                                  <a
                                    href={option.setupUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    Cómo obtener o configurar
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Sellado de tiempo */}
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
              <button
                onClick={() => setShowTimestampInfo(!showTimestampInfo)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Timer className="w-5 h-5 text-emerald-400" />
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-theme-primary">Sellado de tiempo RFC 3161</h3>
                    <p className="text-xs text-theme-secondary">Prueba fehaciente de la fecha y hora de firma</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-theme-muted transition-transform ${showTimestampInfo ? 'rotate-90' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showTimestampInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-3 border-t border-emerald-500/10 mt-4">
                      <p className="text-xs text-theme-secondary">
                        El sellado de tiempo es un sello digital emitido por una Autoridad de Sellado de Tiempo (TSA) 
                        acreditada que garantiza la fecha y hora exacta en que se realizó la firma.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-theme-secondary/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            <span className="text-xs font-medium text-theme-primary">Validez legal</span>
                          </div>
                          <p className="text-xs text-theme-muted">
                            Reconocido en toda la UE según eIDAS
                          </p>
                        </div>
                        <div className="p-3 bg-theme-secondary/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            <span className="text-xs font-medium text-theme-primary">Integridad</span>
                          </div>
                          <p className="text-xs text-theme-muted">
                            Vinculado al contenido exacto del documento
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Firma múltiple */}
            <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-theme-primary">Firma múltiple secuencial</h3>
                  <p className="text-xs text-theme-secondary mt-1">
                    Cuando un documento requiere varias firmas, puedes configurar el orden en que los firmantes 
                    deben actuar. Cada persona recibe una notificación cuando le toca firmar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-theme bg-theme-tertiary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-theme-muted">
                <AlertCircle className="w-4 h-4" />
                <span>¿Problemas con tu certificado? Contacta con soporte</span>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-amber-500 text-theme-secondary font-medium rounded-xl hover:bg-amber-400 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Botón flotante de ayuda para el portal del cliente
export function SignatureHelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all"
      title="Ayuda sobre firmas digitales"
    >
      <Shield className="w-6 h-6" />
    </button>
  );
}

export default SignatureInfoPanel;
