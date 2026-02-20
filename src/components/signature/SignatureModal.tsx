// ============================================
// MODAL PRINCIPAL DE FIRMA ELECTRÓNICA AVANZADA
// Compatible con FNMT, DNIe, firma múltiple secuencial y sellado de tiempo
// ============================================

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, FileText, Send, CheckCircle, AlertCircle, 
  ChevronRight, ChevronLeft, Pen, Users,
  Clock, Shield, Key, Landmark, IdCard,
  Timer, Fingerprint, Award, Cloud
} from 'lucide-react';
import type { 
  SignatureModalProps, 
  SignatureType,
  SignatureWorkflow,
  Signer,
  SignedDocument,
  CertificateInfo,
  SequentialSignatureConfig,
  Timestamp
} from '@/types/signature';
import { 
  SIGNATURE_TYPE_DESCRIPTIONS, 
  WORKFLOW_DESCRIPTIONS,
  DEFAULT_SEQUENTIAL_CONFIG,
  TIMESTAMP_AUTHORITIES
} from '@/types/signature';
import { useSignature } from '@/hooks/useSignature';
import { useRole } from '@/hooks/useRole';
import { SignatureTypeSelector } from './SignatureTypeSelector';
import { CertificateSelector } from './CertificateSelector';
import { SignerList } from './SignerList';
import { SignaturePad } from './SignaturePad';

// Pasos del wizard
type WizardStep = 'config' | 'signers' | 'preview' | 'sign' | 'complete';

export function SignatureModal({
  isOpen,
  onClose,
  mode = 'request',
  documentId,
  documentName,
  documentUrl,
  requestId,
  enableTimestamp: initialEnableTimestamp = true,
  onComplete,
}: SignatureModalProps) {
  const { role, roleConfig } = useRole();
  const signature = useSignature(role, 'usuario@bufete.com');

  // Estado del wizard
  const [currentStep, setCurrentStep] = useState<WizardStep>(mode === 'sign' ? 'sign' : 'config');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Datos del formulario
  const [signatureType, setSignatureType] = useState<SignatureType>(signature.config.defaultType);
  const [workflow, setWorkflow] = useState<SignatureWorkflow>(signature.config.defaultWorkflow);
  const [message, setMessage] = useState('');
  const [signers, setSigners] = useState<Partial<Signer>[]>([]);
  const [signatureImage, setSignatureImage] = useState<string>('');
  
  // Nuevos estados para certificados y sellado de tiempo
  const [certificateInfo, setCertificateInfo] = useState<CertificateInfo | null>(null);
  const [enableTimestamp, setEnableTimestamp] = useState(initialEnableTimestamp);
  const [timestampAuthority, setTimestampAuthority] = useState<string>(TIMESTAMP_AUTHORITIES[0].id);
  const [sequentialConfig, setSequentialConfig] = useState<SequentialSignatureConfig>(DEFAULT_SEQUENTIAL_CONFIG);

  // Resetear estado al abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(mode === 'sign' ? 'sign' : 'config');
      setSignatureType(signature.config.defaultType);
      setWorkflow(signature.config.defaultWorkflow);
      setMessage('');
      setSigners([]);
      setSignatureImage('');
      setCertificateInfo(null);
      setEnableTimestamp(initialEnableTimestamp && signature.permissions.allowTimestamp);
      setTimestampAuthority(TIMESTAMP_AUTHORITIES[0].id);
      setSequentialConfig(DEFAULT_SEQUENTIAL_CONFIG);
      setError(null);
    }
  }, [isOpen, mode, signature.config, signature.permissions.allowTimestamp, initialEnableTimestamp]);

  // Navegación del wizard
  const nextStep = useCallback(() => {
    const steps: WizardStep[] = mode === 'request' 
      ? ['config', 'signers', 'preview', 'complete']
      : ['sign', 'complete'];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep, mode]);

  const prevStep = useCallback(() => {
    const steps: WizardStep[] = mode === 'request'
      ? ['config', 'signers', 'preview', 'complete']
      : ['sign', 'complete'];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep, mode]);

  // Handlers para firmantes
  const handleAddSigner = useCallback((signer: Partial<Signer>) => {
    setSigners(prev => [...prev, { ...signer, order: prev.length + 1 }]);
  }, []);

  const handleRemoveSigner = useCallback((signerId: string) => {
    setSigners(prev => {
      const filtered = prev.filter((_, index) => `signer-temp-${index}` !== signerId);
      // Reordenar
      return filtered.map((s, i) => ({ ...s, order: i + 1 }));
    });
  }, []);

  const handleUpdateSigner = useCallback((signerId: string, updates: Partial<Signer>) => {
    setSigners(prev => prev.map((signer, index) => 
      `signer-temp-${index}` === signerId ? { ...signer, ...updates } : signer
    ));
  }, []);

  const handleReorderSigners = useCallback((newSigners: Signer[]) => {
    setSigners(newSigners);
  }, []);

  // Handler para crear solicitud
  const handleCreateRequest = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signature.createRequest({
        documentId,
        documentName,
        documentUrl,
        signers: signers.map((s, i) => ({ ...s, order: i + 1 })),
        signatureType,
        workflow,
        sequentialConfig: workflow === 'sequential' ? sequentialConfig : undefined,
        message,
        enableTimestamp,
        timestampAuthority,
      });

      nextStep();
      onComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  }, [signature, documentId, documentName, documentUrl, signers, signatureType, workflow, sequentialConfig, message, enableTimestamp, timestampAuthority, nextStep, onComplete]);

  // Handler para firmar
  const handleSign = useCallback(async () => {
    if (!requestId) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Generar sello de tiempo si está habilitado
      let timestamp: Timestamp | undefined;
      if (enableTimestamp && signature.permissions.allowTimestamp) {
        const authority = TIMESTAMP_AUTHORITIES.find(a => a.id === timestampAuthority);
        timestamp = {
          id: `ts-${Date.now()}`,
          authority: authority?.name || 'TSA',
          timestamp: new Date().toISOString(),
          serialNumber: `SN-${Date.now()}`,
          hashAlgorithm: 'SHA-256',
          hashedMessage: `hash-${Date.now()}`, // En producción: hash real del documento
          token: `token-${Date.now()}`,
          accuracy: 1000,
          ordering: true,
        };
      }

      await signature.signDocument(requestId, {
        type: signatureType,
        signatureImage: signatureType === 'biometric' || signatureType === 'simple' ? signatureImage : undefined,
        certificateData: certificateInfo ? JSON.stringify(certificateInfo) : undefined,
        certificateType: certificateInfo?.certificateType,
        timestamp,
        signatureValue: `sig-${Date.now()}`, // En producción: valor real de firma
      });

      nextStep();
      onComplete({} as SignedDocument);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al firmar el documento');
    } finally {
      setIsSubmitting(false);
    }
  }, [signature, requestId, signatureType, signatureImage, certificateInfo, enableTimestamp, timestampAuthority, nextStep, onComplete]);

  // Renderizar pasos
  const renderStep = () => {
    switch (currentStep) {
      case 'config':
        return (
          <ConfigStep
            signatureType={signatureType}
            onTypeChange={setSignatureType}
            workflow={workflow}
            onWorkflowChange={setWorkflow}
            sequentialConfig={sequentialConfig}
            onSequentialConfigChange={setSequentialConfig}
            message={message}
            onMessageChange={setMessage}
            enableTimestamp={enableTimestamp}
            onEnableTimestampChange={setEnableTimestamp}
            timestampAuthority={timestampAuthority}
            onTimestampAuthorityChange={setTimestampAuthority}
            allowedTypes={signature.permissions.allowedTypes}
            allowTimestamp={signature.permissions.allowTimestamp}
          />
        );
      
      case 'signers':
        return (
          <SignersStep
            signers={signers}
            workflow={workflow}
            onAddSigner={handleAddSigner}
            onRemoveSigner={handleRemoveSigner}
            onUpdateSigner={handleUpdateSigner}
            onReorderSigners={workflow === 'sequential' ? handleReorderSigners : undefined}
            maxSigners={signature.permissions.maxSignersPerRequest}
          />
        );
      
      case 'preview':
        return (
          <PreviewStep
            documentName={documentName}
            signatureType={signatureType}
            workflow={workflow}
            sequentialConfig={sequentialConfig}
            signers={signers}
            message={message}
            enableTimestamp={enableTimestamp}
            timestampAuthority={timestampAuthority}
          />
        );
      
      case 'sign':
        return (
          <SignStep
            documentName={documentName}
            signatureType={signatureType}
            signatureImage={signatureImage}
            onSignatureChange={setSignatureImage}
            certificateInfo={certificateInfo}
            onCertificateChange={setCertificateInfo}
            allowedTypes={signature.permissions.allowedTypes}
            onTypeChange={setSignatureType}
            enableTimestamp={enableTimestamp}
            onEnableTimestampChange={setEnableTimestamp}
            allowTimestamp={signature.permissions.allowTimestamp}
            allowDNIe={signature.permissions.allowDNIe}
            allowFNMT={signature.permissions.allowFNMT}
          />
        );
      
      case 'complete':
        return <CompleteStep mode={mode} />;
      
      default:
        return null;
    }
  };

  // Títulos según paso
  const stepTitles: Record<WizardStep, string> = {
    config: 'Configurar Firma',
    signers: 'Agregar Firmantes',
    preview: 'Vista Previa',
    sign: mode === 'request' ? 'Firmar Documento' : 'Firmar',
    complete: mode === 'request' ? 'Solicitud Enviada' : 'Documento Firmado',
  };

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
          className="w-full max-w-2xl max-h-[90vh] bg-theme-secondary border border-theme rounded-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${roleConfig.bgColor}`}>
                {mode === 'request' ? (
                  <Send className={`w-5 h-5 ${roleConfig.textColor}`} />
                ) : (
                  <Pen className={`w-5 h-5 ${roleConfig.textColor}`} />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-theme-primary">{stepTitles[currentStep]}</h2>
                <p className="text-sm text-theme-secondary">{documentName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar (solo en modo request) */}
          {mode === 'request' && currentStep !== 'complete' && (
            <div className="px-6 py-3 bg-theme-secondary/50 border-b border-theme">
              <div className="flex items-center gap-2">
                {(['config', 'signers', 'preview'] as WizardStep[]).map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step 
                          ? 'bg-amber-500 text-theme-secondary' 
                        : ['signers', 'preview', 'complete'].includes(currentStep) && index < ['config', 'signers', 'preview'].indexOf(currentStep) + 1
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-theme-tertiary text-theme-muted'
                    }`}>
                      {['signers', 'preview', 'complete'].includes(currentStep) && index < ['config', 'signers', 'preview'].indexOf(currentStep) + 1 ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 2 && (
                      <div className={`w-12 h-0.5 ${
                        ['signers', 'preview', 'complete'].includes(currentStep) && index < ['config', 'signers', 'preview'].indexOf(currentStep)
                          ? 'bg-emerald-500/50'
                          : 'bg-theme-tertiary'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            {renderStep()}
          </div>

          {/* Footer */}
          {currentStep !== 'complete' && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-theme bg-theme-secondary/50">
              <button
                onClick={currentStep === 'config' ? onClose : prevStep}
                className="px-4 py-2 text-theme-secondary hover:text-theme-primary transition-colors flex items-center gap-2"
              >
                {currentStep !== 'config' && <ChevronLeft className="w-4 h-4" />}
                {currentStep === 'config' ? 'Cancelar' : 'Anterior'}
              </button>

              {currentStep === 'preview' && mode === 'request' && (
                <button
                  onClick={handleCreateRequest}
                  disabled={isSubmitting || signers.length === 0}
                  className="px-6 py-2 bg-amber-500 text-theme-secondary font-medium rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-theme-secondary/30 border-t-theme-secondary rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Solicitud
                    </>
                  )}
                </button>
              )}

              {currentStep === 'sign' && (
                <button
                  onClick={handleSign}
                  disabled={isSubmitting || (signatureType === 'biometric' && !signatureImage) || ((signatureType === 'fnmt' || signatureType === 'dnie' || signatureType === 'certificate') && !certificateInfo)}
                  className="px-6 py-2 bg-amber-500 text-theme-secondary font-medium rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-theme-secondary/30 border-t-theme-secondary rounded-full animate-spin" />
                      Firmando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Confirmar Firma
                    </>
                  )}
                </button>
              )}

              {currentStep !== 'preview' && currentStep !== 'sign' && (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-amber-500 text-theme-secondary font-medium rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================
// SUB-COMPONENTES DE PASOS
// ============================================

interface ConfigStepProps {
  signatureType: SignatureType;
  onTypeChange: (type: SignatureType) => void;
  workflow: SignatureWorkflow;
  onWorkflowChange: (workflow: SignatureWorkflow) => void;
  sequentialConfig: SequentialSignatureConfig;
  onSequentialConfigChange: (config: SequentialSignatureConfig) => void;
  message: string;
  onMessageChange: (message: string) => void;
  enableTimestamp: boolean;
  onEnableTimestampChange: (enable: boolean) => void;
  timestampAuthority: string;
  onTimestampAuthorityChange: (authority: string) => void;
  allowedTypes: SignatureType[];
  allowTimestamp: boolean;
}

function ConfigStep({
  signatureType,
  onTypeChange,
  workflow,
  onWorkflowChange,
  sequentialConfig,
  onSequentialConfigChange,
  message,
  onMessageChange,
  enableTimestamp,
  onEnableTimestampChange,
  timestampAuthority,
  onTimestampAuthorityChange,
  allowedTypes,
  allowTimestamp,
}: ConfigStepProps) {
  return (
    <div className="space-y-6">
      {/* Tipo de firma */}
      <div>
        <label className="block text-sm font-medium text-theme-primary mb-3">
          Tipo de Firma
        </label>
        <SignatureTypeSelector
          value={signatureType}
          onChange={onTypeChange}
          allowedTypes={allowedTypes}
        />
      </div>

      {/* Flujo de firma */}
      <div>
        <label className="block text-sm font-medium text-theme-primary mb-3">
          Flujo de Firma
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(WORKFLOW_DESCRIPTIONS) as SignatureWorkflow[]).map((wf) => {
            const Icon = wf === 'parallel' ? Users : Clock;
            return (
              <button
                key={wf}
                onClick={() => onWorkflowChange(wf)}
                className={`p-4 border rounded-xl text-left transition-all ${
                  workflow === wf
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-theme hover:border-theme-hover bg-theme-secondary/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${workflow === wf ? 'text-amber-500' : 'text-theme-secondary'}`} />
                  <span className={`font-medium ${workflow === wf ? 'text-theme-primary' : 'text-theme-secondary'}`}>
                    {WORKFLOW_DESCRIPTIONS[wf].name}
                  </span>
                </div>
                <p className="text-xs text-theme-muted">{WORKFLOW_DESCRIPTIONS[wf].description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuración de firma secuencial */}
      {workflow === 'sequential' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-3"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-theme-primary">Configuración secuencial</span>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sequentialConfig.notifyNextSigner}
                onChange={(e) => onSequentialConfigChange({ ...sequentialConfig, notifyNextSigner: e.target.checked })}
                className="rounded border-theme text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-theme-secondary">Notificar al siguiente firmante automáticamente</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sequentialConfig.requireAllSigners}
                onChange={(e) => onSequentialConfigChange({ ...sequentialConfig, requireAllSigners: e.target.checked })}
                className="rounded border-theme text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-theme-secondary">Requerir todos los firmantes para completar</span>
            </label>
          </div>
        </motion.div>
      )}

      {/* Sellado de tiempo */}
      {allowTimestamp && (
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-theme-primary">Sellado de tiempo (RFC 3161)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableTimestamp}
                onChange={(e) => onEnableTimestampChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-theme-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          
          {enableTimestamp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <label className="text-xs text-theme-secondary">Autoridad de sellado de tiempo</label>
              <select
                value={timestampAuthority}
                onChange={(e) => onTimestampAuthorityChange(e.target.value)}
                className="w-full px-3 py-2 bg-theme-tertiary border border-theme-hover rounded-lg text-sm text-theme-primary focus:outline-none focus:border-emerald-500"
              >
                {TIMESTAMP_AUTHORITIES.map((auth) => (
                  <option key={auth.id} value={auth.id}>{auth.name}</option>
                ))}
              </select>
              <p className="text-xs text-theme-muted">
                El sello de tiempo proporciona prueba fehaciente de la fecha y hora exacta de la firma.
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Mensaje opcional */}
      <div>
        <label className="block text-sm font-medium text-theme-primary mb-2">
          Mensaje para los firmantes (opcional)
        </label>
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Escribe un mensaje que recibirán los firmantes junto con la solicitud..."
          rows={3}
          className="w-full px-4 py-3 bg-theme-tertiary border border-theme-hover rounded-xl text-theme-primary placeholder-theme-muted focus:outline-none focus:border-amber-500 transition-colors resize-none"
        />
      </div>
    </div>
  );
}

interface SignersStepProps {
  signers: Partial<Signer>[];
  workflow: SignatureWorkflow;
  onAddSigner: (signer: Partial<Signer>) => void;
  onRemoveSigner: (signerId: string) => void;
  onUpdateSigner: (signerId: string, updates: Partial<Signer>) => void;
  onReorderSigners?: (signers: Signer[]) => void;
  maxSigners: number;
}

function SignersStep({
  signers,
  workflow,
  onAddSigner,
  onRemoveSigner,
  onUpdateSigner,
  onReorderSigners,
  maxSigners,
}: SignersStepProps) {
  return (
    <SignerList
      signers={signers.map((s, i) => ({ ...s, id: `signer-temp-${i}` } as Signer))}
      workflow={workflow}
      onAddSigner={onAddSigner}
      onRemoveSigner={onRemoveSigner}
      onUpdateSigner={onUpdateSigner}
      onReorderSigners={onReorderSigners}
      maxSigners={maxSigners}
    />
  );
}

interface PreviewStepProps {
  documentName: string;
  signatureType: SignatureType;
  workflow: SignatureWorkflow;
  sequentialConfig?: SequentialSignatureConfig;
  signers: Partial<Signer>[];
  message: string;
  enableTimestamp: boolean;
  timestampAuthority: string;
}

function PreviewStep({
  documentName,
  signatureType,
  workflow,
  sequentialConfig,
  signers,
  message,
  enableTimestamp,
  timestampAuthority,
}: PreviewStepProps) {
  const authority = TIMESTAMP_AUTHORITIES.find(a => a.id === timestampAuthority);

  return (
    <div className="space-y-6">
      {/* Documento */}
      <div className="p-4 bg-theme-tertiary/50 border border-theme-hover rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-amber-500" />
          <div>
            <p className="font-medium text-theme-primary">{documentName}</p>
            <p className="text-sm text-theme-secondary">PDF Document</p>
          </div>
        </div>
      </div>

      {/* Configuración */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-theme-primary">Configuración</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-theme-tertiary/50 rounded-lg">
            <p className="text-xs text-theme-muted mb-1">Tipo de firma</p>
            <div className="flex items-center gap-2">
              {signatureType === 'fnmt' && <Landmark className="w-4 h-4 text-emerald-400" />}
              {signatureType === 'dnie' && <IdCard className="w-4 h-4 text-blue-400" />}
              {signatureType === 'certificate' && <Key className="w-4 h-4 text-blue-400" />}
              {signatureType === 'biometric' && <Fingerprint className="w-4 h-4 text-purple-400" />}
              {signatureType === 'qualified' && <Award className="w-4 h-4 text-amber-400" />}
              {signatureType === 'cloud' && <Cloud className="w-4 h-4 text-cyan-400" />}
              {signatureType === 'advanced' && <Shield className="w-4 h-4 text-emerald-400" />}
              {signatureType === 'simple' && <Pen className="w-4 h-4 text-theme-secondary" />}
              <p className="text-sm text-theme-primary">{SIGNATURE_TYPE_DESCRIPTIONS[signatureType].name}</p>
            </div>
          </div>
          <div className="p-3 bg-theme-tertiary/50 rounded-lg">
            <p className="text-xs text-theme-muted mb-1">Flujo</p>
            <p className="text-sm text-theme-primary">{WORKFLOW_DESCRIPTIONS[workflow].name}</p>
            {workflow === 'sequential' && sequentialConfig && (
              <p className="text-xs text-theme-muted mt-1">
                {sequentialConfig.notifyNextSigner ? 'Notificación automática' : 'Notificación manual'}
              </p>
            )}
          </div>
        </div>
        
        {enableTimestamp && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-emerald-400" />
              <p className="text-sm text-theme-primary">Sellado de tiempo habilitado</p>
            </div>
            <p className="text-xs text-theme-muted mt-1">Autoridad: {authority?.name}</p>
          </div>
        )}
      </div>

      {/* Firmantes */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-theme-primary">Firmantes ({signers.length})</h3>
        <div className="space-y-2">
          {signers.map((signer, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-theme-tertiary/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-medium">
                {signer.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm text-theme-primary">{signer.name}</p>
                <p className="text-xs text-theme-secondary">{signer.email}</p>
              </div>
              {workflow === 'sequential' && (
                <span className="text-xs text-theme-muted">Orden: {signer.order}</span>
              )}
              <span className="text-xs text-theme-muted capitalize">{signer.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mensaje */}
      {message && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-theme-primary">Mensaje</h3>
          <p className="p-3 bg-theme-tertiary/50 rounded-lg text-sm text-theme-secondary">{message}</p>
        </div>
      )}
    </div>
  );
}

interface SignStepProps {
  documentName: string;
  signatureType: SignatureType;
  signatureImage: string;
  onSignatureChange: (signature: string) => void;
  certificateInfo: CertificateInfo | null;
  onCertificateChange: (info: CertificateInfo | null) => void;
  allowedTypes: SignatureType[];
  onTypeChange: (type: SignatureType) => void;
  enableTimestamp: boolean;
  onEnableTimestampChange: (enable: boolean) => void;
  allowTimestamp: boolean;
  allowDNIe: boolean;
  allowFNMT: boolean;
}

function SignStep({
  documentName,
  signatureType,
  signatureImage: _signatureImage,
  onSignatureChange,
  certificateInfo,
  onCertificateChange,
  allowedTypes,
  onTypeChange,
  enableTimestamp,
  onEnableTimestampChange,
  allowTimestamp,
  allowDNIe,
  allowFNMT,
}: SignStepProps) {
  return (
    <div className="space-y-6">
      {/* Documento */}
      <div className="p-4 bg-theme-tertiary/50 border border-theme-hover rounded-xl">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-amber-500" />
          <div>
            <p className="font-medium text-theme-primary">{documentName}</p>
            <p className="text-sm text-theme-secondary">Revisa el documento antes de firmar</p>
          </div>
        </div>
      </div>

      {/* Selector de tipo si hay múltiples opciones */}
      {allowedTypes.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-theme-primary mb-3">Método de firma</label>
          <SignatureTypeSelector
            value={signatureType}
            onChange={onTypeChange}
            allowedTypes={allowedTypes}
          />
        </div>
      )}

      {/* Área de firma según tipo */}
      {(signatureType === 'simple' || signatureType === 'biometric') && (
        <div>
          <label className="block text-sm font-medium text-theme-primary mb-3">Tu firma</label>
          <SignaturePad
            onSignature={onSignatureChange}
            onClear={() => onSignatureChange('')}
            width={500}
            height={200}
          />
        </div>
      )}

      {(signatureType === 'fnmt' || signatureType === 'dnie' || signatureType === 'certificate') && (
        <CertificateSelector
          value={certificateInfo?.certificateType}
          onChange={(_type, info) => onCertificateChange(info || null)}
          allowedTypes={[
            ...(allowFNMT ? ['fnmt' as const] : []),
            ...(allowDNIe ? ['dnie' as const] : []),
            'other' as const
          ]}
        />
      )}

      {signatureType === 'cloud' && (
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <Cloud className="w-6 h-6 text-cyan-400" />
            <div>
              <p className="text-sm text-theme-primary font-medium">Firma en la nube</p>
              <p className="text-xs text-theme-secondary">Se utilizará tu certificado almacenado de forma segura</p>
            </div>
          </div>
        </div>
      )}

      {signatureType === 'advanced' && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-sm text-theme-primary font-medium">Firma avanzada</p>
              <p className="text-xs text-theme-secondary">Se utilizará tu firma registrada en el sistema con autenticación adicional</p>
            </div>
          </div>
        </div>
      )}

      {/* Opción de sellado de tiempo en firma */}
      {allowTimestamp && (
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm text-theme-primary font-medium">Incluir sello de tiempo</p>
                <p className="text-xs text-theme-secondary">RFC 3161 - Prueba fehaciente de fecha y hora</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableTimestamp}
              onChange={(e) => onEnableTimestampChange(e.target.checked)}
              className="w-5 h-5 rounded border-theme text-emerald-500 focus:ring-emerald-500"
            />
          </label>
        </div>
      )}
    </div>
  );
}

interface CompleteStepProps {
  mode: 'sign' | 'request';
}

function CompleteStep({ mode }: CompleteStepProps) {
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-emerald-500" />
      </div>
      <h3 className="text-xl font-semibold text-theme-primary mb-2">
        {mode === 'request' ? '¡Solicitud enviada!' : '¡Documento firmado!'}
      </h3>
      <p className="text-theme-secondary max-w-sm mx-auto">
        {mode === 'request'
          ? 'Los firmantes recibirán una notificación por email para proceder con la firma del documento.'
          : 'Tu firma ha sido registrada correctamente con sello de tiempo. El documento firmado está disponible para descargar.'}
      </p>
    </div>
  );
}

export default SignatureModal;
