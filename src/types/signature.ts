// ============================================
// TIPOS PARA FIRMA ELECTRÓNICA
// ============================================

import type { UserRole } from './roles';

// Tipos de firma soportados
export type SignatureType = 'simple' | 'advanced' | 'qualified' | 'biometric' | 'certificate';

// Tipos de flujo de firma
export type SignatureWorkflow = 'parallel' | 'sequential';

// Estados de un firmante
export type SignerStatus = 'pending' | 'signed' | 'rejected' | 'expired';

// Estados de una solicitud de firma
export type SignatureRequestStatus = 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'expired';

// Roles de firmante
export type SignerRole = 'cliente' | 'abogado' | 'socio' | 'testigo' | 'administrador' | 'contador' | 'otro';

// ============================================
// INTERFACES PRINCIPALES
// ============================================

/**
 * Representa un firmante en el sistema de firma
 */
export interface Signer {
  id: string;
  email: string;
  name: string;
  role: SignerRole;
  order: number;
  status: SignerStatus;
  signedAt?: string;
  rejectedReason?: string;
  avatar?: string;
}

/**
 * Datos de una firma realizada
 */
export interface Signature {
  id: string;
  signerId: string;
  signerName: string;
  signerEmail: string;
  type: SignatureType;
  signedAt: string;
  ipAddress?: string;
  userAgent?: string;
  certificateInfo?: CertificateInfo;
  biometricData?: BiometricData;
  signatureImage?: string; // Base64 de la firma dibujada
}

/**
 * Información del certificado digital
 */
export interface CertificateInfo {
  issuer: string;
  subject: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  fingerprint: string;
}

/**
 * Datos biométricos de la firma
 */
export interface BiometricData {
  pressurePoints: number;
  speed: number;
  acceleration: number;
  deviceType: string;
}

/**
 * Solicitud de firma completa
 */
export interface SignatureRequest {
  id: string;
  documentId: string;
  documentName: string;
  documentUrl?: string;
  documentType: string;
  status: SignatureRequestStatus;
  signatureType: SignatureType;
  workflow: SignatureWorkflow;
  signers: Signer[];
  signatures: Signature[];
  message?: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  completedAt?: string;
  reminderDays: number[];
  autoReminders: boolean;
}

/**
 * Documento firmado resultante
 */
export interface SignedDocument {
  id: string;
  originalDocumentId: string;
  name: string;
  url: string;
  signedAt: string;
  signatures: Signature[];
  auditTrailUrl?: string;
  certificateUrl?: string;
}

/**
 * Campo de firma en un documento (posición)
 */
export interface SignatureField {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  signerId: string;
  signed: boolean;
  signatureImage?: string;
}

/**
 * Configuración de firma por defecto
 */
export interface SignatureConfig {
  defaultType: SignatureType;
  defaultWorkflow: SignatureWorkflow;
  allowBiometric: boolean;
  allowCertificate: boolean;
  requireAuthentication: boolean;
  reminderDays: number[];
  expirationDays: number;
}

// ============================================
// PROPS DE COMPONENTES
// ============================================

/**
 * Props para el componente SignatureWidget
 */
export interface SignatureWidgetProps {
  documentId: string;
  documentName: string;
  documentUrl?: string;
  signers?: Partial<Signer>[];
  signatureType?: SignatureType;
  workflow?: SignatureWorkflow;
  message?: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: SignedDocument | SignatureRequest) => void;
  onCancel?: () => void;
  mode?: 'sign' | 'request'; // 'sign' para firmar, 'request' para solicitar firmas
}

/**
 * Props para el selector de tipo de firma
 */
export interface SignatureTypeSelectorProps {
  value: SignatureType;
  onChange: (type: SignatureType) => void;
  allowedTypes?: SignatureType[];
  disabled?: boolean;
}

/**
 * Props para la lista de firmantes
 */
export interface SignerListProps {
  signers: Signer[];
  workflow: SignatureWorkflow;
  onAddSigner: (signer: Partial<Signer>) => void;
  onRemoveSigner: (signerId: string) => void;
  onUpdateSigner: (signerId: string, updates: Partial<Signer>) => void;
  onReorderSigners?: (signers: Signer[]) => void;
  readOnly?: boolean;
  maxSigners?: number;
}

/**
 * Props para el pad de firma biométrica
 */
export interface SignaturePadProps {
  onSignature: (signatureData: string) => void;
  onClear: () => void;
  width?: number;
  height?: number;
  penColor?: string;
  backgroundColor?: string;
  disabled?: boolean;
}

/**
 * Props para el modal de firma
 */
export interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'sign' | 'request';
  documentId: string;
  documentName: string;
  documentUrl?: string;
  requestId?: string;
  onComplete: (result: SignedDocument | SignatureRequest) => void;
}

// ============================================
// PERMISOS POR ROL
// ============================================

export interface SignaturePermissions {
  canSign: boolean;
  canRequestSignatures: boolean;
  canManageCertificates: boolean;
  canDeleteRequests: boolean;
  allowedTypes: SignatureType[];
  maxSignersPerRequest: number;
  allowExternalSigners: boolean;
}

// Permisos de firma por rol
export const SIGNATURE_PERMISSIONS: Record<UserRole, SignaturePermissions> = {
  super_admin: {
    canSign: true,
    canRequestSignatures: true,
    canManageCertificates: true,
    canDeleteRequests: true,
    allowedTypes: ['simple', 'advanced', 'qualified', 'biometric', 'certificate'],
    maxSignersPerRequest: 50,
    allowExternalSigners: true,
  },
  socio: {
    canSign: true,
    canRequestSignatures: true,
    canManageCertificates: true,
    canDeleteRequests: true,
    allowedTypes: ['simple', 'advanced', 'qualified', 'biometric', 'certificate'],
    maxSignersPerRequest: 50,
    allowExternalSigners: true,
  },
  abogado_senior: {
    canSign: true,
    canRequestSignatures: true,
    canManageCertificates: false,
    canDeleteRequests: false,
    allowedTypes: ['simple', 'advanced', 'biometric', 'certificate'],
    maxSignersPerRequest: 20,
    allowExternalSigners: true,
  },
  abogado_junior: {
    canSign: true,
    canRequestSignatures: true, // Limitado
    canManageCertificates: false,
    canDeleteRequests: false,
    allowedTypes: ['simple', 'advanced', 'biometric'],
    maxSignersPerRequest: 10,
    allowExternalSigners: true,
  },
  paralegal: {
    canSign: false,
    canRequestSignatures: false,
    canManageCertificates: false,
    canDeleteRequests: false,
    allowedTypes: [],
    maxSignersPerRequest: 0,
    allowExternalSigners: false,
  },
  secretario: {
    canSign: false,
    canRequestSignatures: true, // Solo enviar solicitudes
    canManageCertificates: false,
    canDeleteRequests: false,
    allowedTypes: ['simple'],
    maxSignersPerRequest: 5,
    allowExternalSigners: true,
  },
  administrador: {
    canSign: true,
    canRequestSignatures: true,
    canManageCertificates: true,
    canDeleteRequests: true,
    allowedTypes: ['simple', 'advanced', 'qualified', 'biometric', 'certificate'],
    maxSignersPerRequest: 30,
    allowExternalSigners: true,
  },
  contador: {
    canSign: true,
    canRequestSignatures: true, // Solo docs financieros
    canManageCertificates: false,
    canDeleteRequests: false,
    allowedTypes: ['simple', 'advanced', 'certificate'],
    maxSignersPerRequest: 10,
    allowExternalSigners: true,
  },
  recepcionista: {
    canSign: false,
    canRequestSignatures: false,
    canManageCertificates: false,
    canDeleteRequests: false,
    allowedTypes: [],
    maxSignersPerRequest: 0,
    allowExternalSigners: false,
  },
};

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================

export const DEFAULT_SIGNATURE_CONFIG: SignatureConfig = {
  defaultType: 'advanced',
  defaultWorkflow: 'parallel',
  allowBiometric: true,
  allowCertificate: true,
  requireAuthentication: true,
  reminderDays: [7, 3, 1],
  expirationDays: 30,
};

// Descripciones de tipos de firma
export const SIGNATURE_TYPE_DESCRIPTIONS: Record<SignatureType, { name: string; description: string; icon: string }> = {
  simple: {
    name: 'Firma Simple',
    description: 'Firma básica con validez legal limitada. Ideal para documentos internos.',
    icon: 'Pencil',
  },
  advanced: {
    name: 'Firma Avanzada',
    description: 'Mayor seguridad y trazabilidad. Vinculada al firmante de forma única.',
    icon: 'Shield',
  },
  qualified: {
    name: 'Firma Cualificada (eIDAS)',
    description: 'Máxima validez jurídica equivalente a firma manuscrita. Certificado cualificado.',
    icon: 'Award',
  },
  biometric: {
    name: 'Firma Biométrica',
    description: 'Captura datos biométricos de la firma (presión, velocidad).',
    icon: 'Fingerprint',
  },
  certificate: {
    name: 'Certificado Digital',
    description: 'Firma con certificado digital (DNIe, FNMT, etc.).',
    icon: 'Key',
  },
};

// Descripciones de flujos de trabajo
export const WORKFLOW_DESCRIPTIONS: Record<SignatureWorkflow, { name: string; description: string; icon: string }> = {
  parallel: {
    name: 'Paralelo',
    description: 'Todos los firmantes pueden firmar simultáneamente, sin orden específico.',
    icon: 'Users',
  },
  sequential: {
    name: 'Secuencial',
    description: 'Los firmantes firman en orden. Cada uno recibe la notificación cuando le toca.',
    icon: 'ArrowRight',
  },
};
