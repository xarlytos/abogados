// ============================================
// SELECTOR DE CERTIFICADO DIGITAL (FNMT, DNIe, etc.)
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, IdCard, Building2, Key,
  ChevronDown, Info, CheckCircle2, Shield,
  AlertCircle, Download, ExternalLink
} from 'lucide-react';
import type { CertificateType, CertificateInfo, CertificateSelectorProps } from '@/types/signature';
import { CERTIFICATE_TYPE_DESCRIPTIONS } from '@/types/signature';

const certificateIcons: Record<CertificateType, typeof Key> = {
  fnmt: Landmark,
  dnie: IdCard,
  cam: Building2,
  other: Key,
};

const certificateColors: Record<CertificateType, { bg: string; border: string; text: string; icon: string; gradient: string }> = {
  fnmt: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    icon: 'text-emerald-500',
    gradient: 'from-emerald-500/20 to-emerald-600/10',
  },
  dnie: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    icon: 'text-blue-500',
    gradient: 'from-blue-500/20 to-blue-600/10',
  },
  cam: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    icon: 'text-purple-500',
    gradient: 'from-purple-500/20 to-purple-600/10',
  },
  other: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    icon: 'text-amber-500',
    gradient: 'from-amber-500/20 to-amber-600/10',
  },
};

// Mock de certificados detectados (en producción vendría del navegador/keystore)
const mockDetectedCertificates: CertificateInfo[] = [
  {
    issuer: 'FNMT-RCM',
    subject: 'CN=Juan García López, SERIALNUMBER=12345678A, C=ES',
    serialNumber: '1234567890ABC',
    validFrom: '2024-01-01',
    validTo: '2026-12-31',
    fingerprint: 'A1:B2:C3:D4:E5:F6:...',
    fingerprintAlgorithm: 'SHA-256',
    certificateType: 'fnmt',
    keyUsage: ['digitalSignature', 'nonRepudiation'],
    extendedKeyUsage: ['clientAuth', 'emailProtection'],
    subjectAlternativeName: ['juan.garcia@email.com'],
    ocspUrl: 'http://ocsp.fnmt.es',
  },
  {
    issuer: 'DGP-Police',
    subject: 'CN=María López Sánchez, SERIALNUMBER=87654321B, C=ES',
    serialNumber: 'DNIe987654321',
    validFrom: '2023-06-15',
    validTo: '2028-06-15',
    fingerprint: 'B2:C3:D4:E5:F6:A1:...',
    fingerprintAlgorithm: 'SHA-256',
    certificateType: 'dnie',
    keyUsage: ['digitalSignature', 'nonRepudiation', 'keyEncipherment'],
    ocspUrl: 'http://ocsp.dnie.es',
  },
];

export function CertificateSelector({
  value,
  onChange,
  allowedTypes = ['fnmt', 'dnie', 'cam', 'other'],
  disabled = false,
}: CertificateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [detectedCerts, setDetectedCerts] = useState<CertificateInfo[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateInfo | null>(null);

  const selectedType = value;
  const SelectedIcon = selectedType ? certificateIcons[selectedType] : Key;
  const selectedColors = selectedType ? certificateColors[selectedType] : certificateColors.other;



  // Simular escaneo de certificados (filtrados por tipos permitidos)
  const scanCertificates = async () => {
    setIsScanning(true);
    // Simular tiempo de detección
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Filtrar certificados según los tipos permitidos
    const filtered = mockDetectedCertificates.filter(cert => 
      allowedTypes.includes(cert.certificateType)
    );
    setDetectedCerts(filtered);
    setIsScanning(false);
  };

  const handleSelectCertificate = (cert: CertificateInfo) => {
    setSelectedCert(cert);
    onChange(cert.certificateType, cert);
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Selector principal */}
      <div className="relative">
        <label className="block text-sm font-medium text-theme-primary mb-2">
          Seleccionar Certificado
        </label>
        
        <button
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              if (detectedCerts.length === 0 && !isScanning) {
                scanCertificates();
              }
            }
          }}
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
              {selectedCert ? (
                <>
                  <p className={`font-medium ${selectedColors.text}`}>
                    {CERTIFICATE_TYPE_DESCRIPTIONS[selectedCert.certificateType].name}
                  </p>
                  <p className="text-xs text-theme-muted">
                    {selectedCert.subject.split('CN=')[1]?.split(',')[0] || 'Certificado seleccionado'}
                  </p>
                  <p className="text-xs text-emerald-400 mt-1">
                    Válido hasta: {new Date(selectedCert.validTo).toLocaleDateString('es-ES')}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-theme-primary">
                    {selectedType ? CERTIFICATE_TYPE_DESCRIPTIONS[selectedType].name : 'Seleccionar certificado...'}
                  </p>
                  <p className="text-xs text-theme-muted">
                    {selectedType ? 'Haz clic para seleccionar un certificado específico' : 'Haz clic para ver certificados disponibles'}
                  </p>
                </>
              )}
            </div>
            {!disabled && (
              <ChevronDown className={`w-5 h-5 text-theme-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            )}
          </div>
        </button>

        {/* Dropdown de certificados detectados */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-theme-secondary border border-theme-hover rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-theme bg-theme-tertiary/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-theme-primary">Certificados detectados</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      scanCertificates();
                    }}
                    disabled={isScanning}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    {isScanning ? (
                      <>
                        <div className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3" />
                        Actualizar
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Lista de certificados */}
              <div className="max-h-64 overflow-y-auto">
                {isScanning ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 border-3 border-theme-tertiary border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-sm text-theme-secondary">Detectando certificados...</p>
                    <p className="text-xs text-theme-muted mt-1">Conectando con el almacén de claves</p>
                  </div>
                ) : detectedCerts.length === 0 ? (
                  <div className="p-6 text-center">
                    <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm text-theme-secondary">No se detectaron certificados</p>
                    <p className="text-xs text-theme-muted mt-1">
                      Asegúrate de tener tu DNIe insertado o certificado instalado
                    </p>
                    <button
                      onClick={() => window.open('https://www.sede.fnmt.gob.es/', '_blank')}
                      className="mt-3 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mx-auto"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Obtener certificado FNMT
                    </button>
                  </div>
                ) : (
                  detectedCerts.map((cert, index) => {
                    const Icon = certificateIcons[cert.certificateType];
                    const colors = certificateColors[cert.certificateType];
                    const isSelected = selectedCert?.serialNumber === cert.serialNumber;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectCertificate(cert)}
                        className={`w-full p-4 flex items-start gap-3 hover:bg-theme-tertiary/50 transition-colors text-left border-b border-theme last:border-0 ${
                          isSelected ? 'bg-blue-500/10' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${colors.bg}`}>
                          <Icon className={`w-5 h-5 ${colors.icon}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${colors.text}`}>
                              {CERTIFICATE_TYPE_DESCRIPTIONS[cert.certificateType].name}
                            </p>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                          <p className="text-sm text-theme-primary truncate">
                            {cert.subject.split('CN=')[1]?.split(',')[0] || 'Sin nombre'}
                          </p>
                          <p className="text-xs text-theme-muted">
                            {cert.subject.match(/SERIALNUMBER=([^,]+)/)?.[1] || 'Sin NIF'}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-emerald-400">
                              Válido hasta: {new Date(cert.validTo).toLocaleDateString('es-ES')}
                            </span>
                            <span className="text-xs text-theme-muted">
                              {cert.issuer}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer con información */}
              <div className="px-4 py-3 border-t border-theme bg-theme-tertiary/30">
                <div className="flex items-center gap-2 text-xs text-theme-muted">
                  <Info className="w-3 h-3" />
                  <span>Los certificados se leen directamente de tu sistema</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay para cerrar */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Información del certificado seleccionado */}
      {selectedCert && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-theme-tertiary/50 border border-theme-hover rounded-xl space-y-3"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-theme-primary">Información del certificado</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-theme-muted">Emisor:</span>
              <p className="text-theme-secondary">{selectedCert.issuer}</p>
            </div>
            <div>
              <span className="text-theme-muted">Algoritmo:</span>
              <p className="text-theme-secondary">{selectedCert.fingerprintAlgorithm}</p>
            </div>
            <div>
              <span className="text-theme-muted">Válido desde:</span>
              <p className="text-theme-secondary">{new Date(selectedCert.validFrom).toLocaleDateString('es-ES')}</p>
            </div>
            <div>
              <span className="text-theme-muted">Válido hasta:</span>
              <p className="text-theme-secondary">{new Date(selectedCert.validTo).toLocaleDateString('es-ES')}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-theme">
            <span className="text-xs text-theme-muted">Usos permitidos:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedCert.keyUsage.map((usage) => (
                <span 
                  key={usage}
                  className="px-2 py-0.5 bg-theme-secondary text-[10px] text-theme-secondary rounded"
                >
                  {usage === 'digitalSignature' ? 'Firma digital' :
                   usage === 'nonRepudiation' ? 'No repudio' :
                   usage === 'keyEncipherment' ? 'Cifrado' : usage}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Guía de instalación */}
      <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
        <div className="flex items-start gap-2">
          <Download className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-blue-400">¿No tienes certificado digital?</p>
            <p className="text-xs text-theme-muted mt-1">
              Puedes obtener uno gratuito de la{' '}
              <a 
                href="https://www.sede.fnmt.gob.es/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                FNMT
              </a>
              {' '}o usar tu{' '}
              <a 
                href="https://www.dnielectronico.es/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                DNIe
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Selector compacto para badges
export function CertificateTypeBadge({ 
  type, 
  size = 'md',
  showLabel = true 
}: { 
  type: CertificateType; 
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}) {
  const Icon = certificateIcons[type];
  const colors = certificateColors[type];
  
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
      {showLabel && CERTIFICATE_TYPE_DESCRIPTIONS[type].name}
    </span>
  );
}

export default CertificateSelector;
