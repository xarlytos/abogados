// ============================================
// TIPOS PARA FIRMA ELECTRÓNICA AVANZADA
// ============================================

import type { UserRole } from './roles';

// Tipos de firma soportados (ampliados con FNMT y DNIe)
export type SignatureType = 
  | 'simple' 
  | 'advanced' 
  | 'qualified' 
  | 'biometric' 
  | 'certificate'
  | 'fnmt'           // Certificado FNMT
  | 'dnie'           // DNI Electrónico
  | 'cloud';         // Firma en la nube

// Tipos de certificado específicos
export type CertificateType = 'fnmt' | 'dnie' | 'cam' | 'other';

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
 * Sello de tiempo (Timestamp) - RFC 3161
 */
export interface Timestamp {
  id: string;
  authority: string;           // Autoridad de sellado de tiempo (TSA)
  timestamp: string;           // Fecha/hora del sello
  serialNumber: string;        // Número de serie del sello
  hashAlgorithm: string;       // Algoritmo de hash utilizado
  hashedMessage: string;       // Hash del documento sellado
  token: string;               // Token del sello de tiempo
  accuracy?: number;           // Precisión en milisegundos
  ordering?: boolean;          // Si garantiza ordenación
}

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
  requiredSignatureType?: SignatureType;  // Tipo de firma requerido para este firmante
  certificateInfo?: CertificateInfo;      // Info del certificado utilizado
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
  signatureImage?: string;      // Base64 de la firma dibujada
  timestamp?: Timestamp;        // Sello de tiempo RFC 3161
  signatureValue?: string;      // Valor de la firma digital
  ocspResponse?: string;        // Respuesta OCSP de validación
  crlChecked?: boolean;         // Si se verificó lista de revocación
  crlCheckDate?: string;        // Fecha de verificación CRL
}

/**
 * Información del certificado digital (ampliada)
 */
export interface CertificateInfo {
  issuer: string;
  subject: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  fingerprint: string;
  fingerprintAlgorithm: string;   // SHA-256, SHA-1, etc.
  certificateType: CertificateType;
  keyUsage: string[];             // Usos de la clave
  extendedKeyUsage?: string[];    // Usos extendidos
  subjectAlternativeName?: string[]; // Nombres alternativos (emails, etc.)
  authorityKeyIdentifier?: string;   // Identificador de la autoridad
  subjectKeyIdentifier?: string;     // Identificador del sujeto
  crlDistributionPoint?: string;     // Punto de distribución CRL
  ocspUrl?: string;                  // URL del responder OCSP
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
 * Configuración de firma múltiple secuencial
 */
export interface SequentialSignatureConfig {
  enabled: boolean;
  notifyNextSigner: boolean;           // Notificar al siguiente firmante
  waitTimeBetweenSigners?: number;     // Tiempo de espera entre firmantes (minutos)
  allowSkipping?: boolean;             // Permitir saltar orden
  requireAllSigners: boolean;          // Requerir todos los firmantes
  expirationPerSigner?: number;        // Expiración por firmante (horas)
}

/**
 * Solicitud de firma completa (ampliada)
 */
export interface SignatureRequest {
  id: string;
  documentId: string;
  documentName: string;
  documentUrl?: string;
  documentType: string;
  documentHash?: string;               // Hash del documento para integridad
  status: SignatureRequestStatus;
  signatureType: SignatureType;
  workflow: SignatureWorkflow;
  sequentialConfig?: SequentialSignatureConfig;  // Config específica para secuencial
  signers: Signer[];
  signatures: Signature[];
  message?: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  completedAt?: string;
  reminderDays: number[];
  autoReminders: boolean;
  enableTimestamp: boolean;            // Habilitar sellado de tiempo
  timestampAuthority?: string;         // Autoridad de sellado preferida
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
  timestampTokenUrl?: string;          // URL del token de sellado de tiempo
  documentWithSignaturesUrl?: string;  // PDF con firmas visibles
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
 * Configuración de firma por defecto (ampliada)
 */
export interface SignatureConfig {
  defaultType: SignatureType;
  defaultWorkflow: SignatureWorkflow;
  allowBiometric: boolean;
  allowCertificate: boolean;
  allowFNMT: boolean;                  // Permitir certificados FNMT
  allowDNIe: boolean;                  // Permitir DNIe
  requireAuthentication: boolean;
  reminderDays: number[];
  expirationDays: number;
  enableTimestampByDefault: boolean;   // Sellar por defecto
  defaultTimestampAuthority?: string;  // Autoridad de sellado por defecto
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
  sequentialConfig?: SequentialSignatureConfig;
  message?: string;
  enableTimestamp?: boolean;
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
 * Props para el selector de certificado
 */
export interface CertificateSelectorProps {
  value?: CertificateType;
  onChange: (type: CertificateType, info?: CertificateInfo) => void;
  allowedTypes?: CertificateType[];
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
  allowSignatureTypePerSigner?: boolean;  // Permitir tipo de firma por firmante
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
  enableTimestamp?: boolean;
  onComplete: (result: SignedDocument | SignatureRequest) => void;
}

// ============================================
// TIPOS PARA CREACIÓN DE SOLICITUDES
// ============================================

/**
 * Datos para crear una nueva solicitud de firma
 */
export interface CreateSignatureRequestData {
  documentId: string;
  documentName: string;
  documentUrl?: string;
  documentHash?: string;
  signers: Partial<Signer>[];
  signatureType: SignatureType;
  workflow: SignatureWorkflow;
  sequentialConfig?: SequentialSignatureConfig;
  message?: string;
  expiresAt?: string;
  autoReminders?: boolean;
  enableTimestamp?: boolean;
  timestampAuthority?: string;
}

/**
 * Datos para firmar un documento
 */
export interface SignDocumentData {
  type: SignatureType;
  signatureImage?: string;           // Base64 para firma biométrica/simple
  certificateData?: string;          // Datos del certificado
  certificateType?: CertificateType; // Tipo de certificado
  biometricData?: {
    pressurePoints: number;
    speed: number;
    acceleration: number;
    deviceType: string;
  };
  ipAddress?: string;
  userAgent?: string;
  timestamp?: Timestamp;             // Sello de tiempo
  signatureValue?: string;           // Valor de firma digital
  ocspResponse?: string;             // Respuesta OCSP
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
  allowTimestamp: boolean;           // Permiso para usar sellado de tiempo
  allowDNIe: boolean;                // Permiso para usar DNIe
  allowFNMT: boolean;                // Permiso para usar FNMT
}

// Permisos de firma por rol
export const SIGNATURE_PERMISSIONS: Record<UserRole, SignaturePermissions> = {
  super_admin: {
    canSign: true,
    canRequestSignatures: true,
    canManageCertificates: true,
    canDeleteRequests: true,
    allowedTypes: ['simple', 'advanced', 'qualified', 'biometric', 'certificate', 'fnmt', 'dnie', 'cloud'],
    maxSignersPerRequest: 50,
    allowExternalSigners: true,
    allowTimestamp: true,
    allowDNIe: true,
    allowFNMT: true,
  },
  socio: {
    canSign: true,
    canRequestSignatures: true,
    canManageCertificates: true,
    canDeleteRequests: true,
    allowedTypes: ['simple', 'advanced', 'qualified', 'biometric', 'certificate', 'fnmt', 'dnie', 'cloud'],
    maxSignersPerRequest: 50,
    allowExternalSigners: true,
    allowTimestamp: true,
    allowDNIe: true,
    allowFNMT: true,
  },
  abogado_senior: {
    canSign: true,
    canRequestSignatures: true,
    canManageCertificates: false,
    canDeleteRequests: false,
    allowedTypes: ['simple', 'advanced', 'biometric', 'certificate', 'fnmt', 'dnie'],
    maxSignersPerRequest: 20,
    allowExternalSigners: true,
    allowTimestamp: true,
    allowDNIe: true,
    allowFNMT: true,
  },
  abogado_junior: {
    canSign: true,
    canRequestSignatures: true,
    allowedTypes: ['simple', 'advanced', 'biometric', 'certificate'],
    maxSignersPerRequest: 10,
    allowExternalSigners: true,
    canManageCertificates: false,
    canDeleteRequests: false,
    allowTimestamp: false,
    allowDNIe: false,
    allowFNMT: false,
  },
  paralegal: {
    canSign: false,
    canRequestSignatures: false,
    canManageCertificates: false,
    canDeleteRequests: false,
    allowedTypes: [],
    maxSignersPerRequest: 0,
    allowExternalSigners: false,
    allowTimestamp: false,
    allowDNIe: false,
    allowFNMT: false,
  },
  secretario: {
    canSign: false,
    canRequestSignatures: true,
    canManageCertificates: false,
    canDeleteRequests: false,
    allowedTypes: ['simple'],
    maxSignersPerRequest: 5,
    allowExternalSigners: true,
    allowTimestamp: false,
    allowDNIe: false,
    allowFNMT: false,
  },
  administrador: {
    canSign: true,
    canRequestSignatures: true,
    canManageCertificates: true,
    canDeleteRequests: true,
    allowedTypes: ['simple', 'advanced', 'qualified', 'biometric', 'certificate', 'fnmt', 'dnie', 'cloud'],
    maxSignersPerRequest: 30,
    allowExternalSigners: true,
    allowTimestamp: true,
    allowDNIe: true,
    allowFNMT: true,
  },
  contador: {
    canSign: true,
    canRequestSignatures: true,
    canManageCertificates: false,
    canDeleteRequests: false,
    allowedTypes: ['simple', 'advanced', 'certificate', 'fnmt', 'dnie'],
    maxSignersPerRequest: 10,
    allowExternalSigners: true,
    allowTimestamp: true,
    allowDNIe: true,
    allowFNMT: true,
  },
  recepcionista: {
    canSign: false,
    canRequestSignatures: false,
    canManageCertificates: false,
    canDeleteRequests: false,
    allowedTypes: [],
    maxSignersPerRequest: 0,
    allowExternalSigners: false,
    allowTimestamp: false,
    allowDNIe: false,
    allowFNMT: false,
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
  allowFNMT: true,
  allowDNIe: true,
  requireAuthentication: true,
  reminderDays: [7, 3, 1],
  expirationDays: 30,
  enableTimestampByDefault: true,
  defaultTimestampAuthority: 'AC TSA',
};

// Descripciones de tipos de firma (ampliadas)
export const SIGNATURE_TYPE_DESCRIPTIONS: Record<SignatureType, { name: string; description: string; icon: string; legalValue: 'low' | 'medium' | 'high' | 'maximum' }> = {
  simple: {
    name: 'Firma Simple',
    description: 'Firma básica con validez legal limitada. Ideal para documentos internos.',
    icon: 'Pencil',
    legalValue: 'low',
  },
  advanced: {
    name: 'Firma Avanzada',
    description: 'Mayor seguridad y trazabilidad. Vinculada al firmante de forma única.',
    icon: 'Shield',
    legalValue: 'medium',
  },
  qualified: {
    name: 'Firma Cualificada (eIDAS)',
    description: 'Máxima validez jurídica equivalente a firma manuscrita. Certificado cualificado.',
    icon: 'Award',
    legalValue: 'maximum',
  },
  biometric: {
    name: 'Firma Biométrica',
    description: 'Captura datos biométricos de la firma (presión, velocidad).',
    icon: 'Fingerprint',
    legalValue: 'medium',
  },
  certificate: {
    name: 'Certificado Digital',
    description: 'Firma con certificado digital de cualquier autoridad.',
    icon: 'Key',
    legalValue: 'high',
  },
  fnmt: {
    name: 'Certificado FNMT',
    description: 'Firma con certificado de la Fábrica Nacional de Moneda y Timbre. Máxima seguridad.',
    icon: 'Landmark',
    legalValue: 'maximum',
  },
  dnie: {
    name: 'DNI Electrónico',
    description: 'Firma utilizando tu DNIe. Requiere lector de tarjetas.',
    icon: 'IdCard',
    legalValue: 'maximum',
  },
  cloud: {
    name: 'Firma en la Nube',
    description: 'Firma utilizando certificado almacenado en la nube de forma segura.',
    icon: 'Cloud',
    legalValue: 'high',
  },
};

// Descripciones de certificados
export const CERTIFICATE_TYPE_DESCRIPTIONS: Record<CertificateType, { name: string; description: string; issuer: string; }> = {
  fnmt: {
    name: 'Certificado FNMT',
    description: 'Certificado de persona física emitido por la FNMT-RCM',
    issuer: 'FNMT-RCM',
  },
  dnie: {
    name: 'DNI Electrónico',
    description: 'Certificado incluido en tu Documento Nacional de Identidad',
    issuer: 'DGP-Police',
  },
  cam: {
    name: 'Certificado CAM',
    description: 'Certificado de la Comunidad Autónoma de Madrid u otra CCAA',
    issuer: 'CCAA',
  },
  other: {
    name: 'Otro Certificado',
    description: 'Otro certificado digital válido reconocido',
    issuer: 'Varios',
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

// Configuración por defecto para firma secuencial
export const DEFAULT_SEQUENTIAL_CONFIG: SequentialSignatureConfig = {
  enabled: true,
  notifyNextSigner: true,
  waitTimeBetweenSigners: 0,
  allowSkipping: false,
  requireAllSigners: true,
  expirationPerSigner: 72, // 72 horas
};

// Autoridades de sellado de tiempo reconocidas
export const TIMESTAMP_AUTHORITIES = [
  { id: 'ac_tsa', name: 'AC TSA', url: 'http://tsa.ac/tsa' },
  { id: 'fnmt_tsa', name: 'FNMT TSA', url: 'http://tsa.fnmt.es' },
  { id: 'dnte_tsa', name: 'DNIE TSA', url: 'http://tsa.dnie.es' },
  { id: 'catcert', name: 'CATCert TSA', url: 'http://tsa.catcert.cat' },
] as const;
