// ============================================
// EXPORTACIONES DEL MÓDULO DE FIRMA
// ============================================

// Componentes principales
export { SignatureModal } from './SignatureModal';
export { SignatureTypeSelector, SignatureTypeBadge, SignatureTypeGrid } from './SignatureTypeSelector';
export { SignaturePad, SignaturePadCompact } from './SignaturePad';
export { SignerList, SignerListCompact, SignatureStatusBadge } from './SignerList';

// Tipos (re-exportados para conveniencia)
export type {
  SignatureType,
  SignatureWorkflow,
  SignerStatus,
  SignatureRequestStatus,
  SignerRole,
  Signer,
  Signature,
  CertificateInfo,
  BiometricData,
  SignatureRequest,
  SignedDocument,
  SignatureField,
  SignatureConfig,
  SignatureWidgetProps,
  SignatureTypeSelectorProps,
  SignerListProps,
  SignaturePadProps,
  SignatureModalProps,
  SignaturePermissions,
  CreateSignatureRequestData,
  SignDocumentData,
} from '@/types/signature';

// Constantes
export {
  SIGNATURE_PERMISSIONS,
  DEFAULT_SIGNATURE_CONFIG,
  SIGNATURE_TYPE_DESCRIPTIONS,
  WORKFLOW_DESCRIPTIONS,
} from '@/types/signature';

// Hook
export { useSignature } from '@/hooks/useSignature';
export type { UseSignatureReturn } from '@/hooks/useSignature';

// Datos mock (para desarrollo)
export {
  mockSignatureRequests,
  mockSignedDocuments,
  mockSignatureFields,
  mockSignatureConfigs,
  mockSignatureStats,
  getSignatureRequestById,
  getSignatureRequestsByDocumentId,
  getPendingSignaturesForUser,
  getSignatureFieldsByDocumentId,
} from '@/data/signatureData';
