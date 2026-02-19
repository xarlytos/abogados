// ============================================
// MODAL PRINCIPAL DE FIRMA ELECTRÓNICA
// ============================================

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, FileText, Send, CheckCircle, AlertCircle, 
  ChevronRight, ChevronLeft, Pen, Users, Settings,
  Clock, Shield, Award, Pencil, Key, Fingerprint
} from 'lucide-react';
import type { 
  SignatureModalProps, 
  SignatureRequest, 
  SignedDocument,
  SignatureType,
  SignatureWorkflow,
  Signer
} from '@/types/signature';
import { SIGNATURE_TYPE_DESCRIPTIONS, WORKFLOW_DESCRIPTIONS } from '@/types/signature';
import { useSignature } from '@/hooks/useSignature';
import { useRole } from '@/hooks/useRole';
import { SignatureTypeSelector } from './SignatureTypeSelector';
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
  onComplete,
}: SignatureModalProps) {
  const { role, roleConfig } = useRole();
  const signature = useSignature(role, 'usuario@bufete.com'); // Email del usuario actual

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

  // Resetear estado al abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(mode === 'sign' ? 'sign' : 'config');
      setSignatureType(signature.config.defaultType);
      setWorkflow(signature.config.defaultWorkflow);
      setMessage('');
      setSigners([]);
      setSignatureImage('');
      setError(null);
    }
  }, [isOpen, mode, signature.config]);

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
    setSigners(prev => prev.filter((_, index) => `signer-temp-${index}` !== signerId));
  }, []);

  const handleUpdateSigner = useCallback((signerId: string, updates: Partial<Signer>) => {
    setSigners(prev => prev.map((signer, index) => 
      `signer-temp-${index}` === signerId ? { ...signer, ...updates } : signer
    ));
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
        message,
      });

      nextStep();
      onComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  }, [signature, documentId, documentName, documentUrl, signers, signatureType, workflow, message, nextStep, onComplete]);

  // Handler para firmar
  const handleSign = useCallback(async () => {
    if (!requestId) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await signature.signDocument(requestId, {
        type: signatureType,
        signatureImage: signatureType === 'biometric' || signatureType === 'simple' ? signatureImage : undefined,
      });

      nextStep();
      onComplete({} as SignedDocument); // En producción, obtener el documento firmado real
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al firmar el documento');
    } finally {
      setIsSubmitting(false);
    }
  }, [signature, requestId, signatureType, signatureImage, nextStep, onComplete]);

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
            message={message}
            onMessageChange={setMessage}
            allowedTypes={signature.permissions.allowedTypes}
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
            maxSigners={signature.permissions.maxSignersPerRequest}
          />
        );
      
      case 'preview':
        return (
          <PreviewStep
            documentName={documentName}
            signatureType={signatureType}
            workflow={workflow}
            signers={signers}
            message={message}
          />
        );
      
      case 'sign':
        return (
          <SignStep
            documentName={documentName}
            signatureType={signatureType}
            signatureImage={signatureImage}
            onSignatureChange={setSignatureImage}
            allowedTypes={signature.permissions.allowedTypes}
            onTypeChange={setSignatureType}
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
                  disabled={isSubmitting || (signatureType === 'biometric' && !signatureImage)}
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
  message: string;
  onMessageChange: (message: string) => void;
  allowedTypes: SignatureType[];
}

function ConfigStep({
  signatureType,
  onTypeChange,
  workflow,
  onWorkflowChange,
  message,
  onMessageChange,
  allowedTypes,
}: ConfigStepProps) {
  const typeIcons: Record<SignatureType, typeof Pencil> = {
    simple: Pencil,
    advanced: Shield,
    qualified: Award,
    biometric: Fingerprint,
    certificate: Key,
  };

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
  maxSigners: number;
}

function SignersStep({
  signers,
  workflow,
  onAddSigner,
  onRemoveSigner,
  onUpdateSigner,
  maxSigners,
}: SignersStepProps) {
  return (
    <SignerList
      signers={signers.map((s, i) => ({ ...s, id: `signer-temp-${i}` } as Signer))}
      workflow={workflow}
      onAddSigner={onAddSigner}
      onRemoveSigner={onRemoveSigner}
      onUpdateSigner={onUpdateSigner}
      maxSigners={maxSigners}
    />
  );
}

interface PreviewStepProps {
  documentName: string;
  signatureType: SignatureType;
  workflow: SignatureWorkflow;
  signers: Partial<Signer>[];
  message: string;
}

function PreviewStep({
  documentName,
  signatureType,
  workflow,
  signers,
  message,
}: PreviewStepProps) {
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
            <p className="text-sm text-theme-primary">{SIGNATURE_TYPE_DESCRIPTIONS[signatureType].name}</p>
          </div>
          <div className="p-3 bg-theme-tertiary/50 rounded-lg">
            <p className="text-xs text-theme-muted mb-1">Flujo</p>
            <p className="text-sm text-theme-primary">{WORKFLOW_DESCRIPTIONS[workflow].name}</p>
          </div>
        </div>
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
  allowedTypes: SignatureType[];
  onTypeChange: (type: SignatureType) => void;
}

function SignStep({
  documentName,
  signatureType,
  signatureImage,
  onSignatureChange,
  allowedTypes,
  onTypeChange,
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

      {signatureType === 'certificate' && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-sm text-theme-primary font-medium">Firma con certificado digital</p>
              <p className="text-xs text-theme-secondary">Se abrirá el selector de certificados de tu sistema</p>
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
          : 'Tu firma ha sido registrada correctamente. El documento firmado está disponible para descargar.'}
      </p>
    </div>
  );
}

export default SignatureModal;
