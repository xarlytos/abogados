// ============================================
// DATOS MOCK PARA FIRMA ELECTRÓNICA
// ============================================

import type { 
  SignatureRequest, 
  SignedDocument, 
  SignatureField,
  Signer,
  SignatureConfig 
} from '@/types/signature';

// ============================================
// SOLICITUDES DE FIRMA MOCK
// ============================================

export const mockSignatureRequests: SignatureRequest[] = [
  {
    id: 'sig-req-001',
    documentId: 'EXP-2024-001',
    documentName: 'Contrato de Servicios Legales.pdf',
    documentType: 'application/pdf',
    status: 'pending',
    signatureType: 'advanced',
    workflow: 'sequential',
    signers: [
      {
        id: 'signer-001',
        email: 'abogado@bufete.com',
        name: 'Carlos Méndez',
        role: 'abogado',
        order: 1,
        status: 'signed',
        signedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: 'signer-002',
        email: 'cliente@ejemplo.com',
        name: 'Juan Pérez',
        role: 'cliente',
        order: 2,
        status: 'pending',
      },
      {
        id: 'signer-003',
        email: 'socio@bufete.com',
        name: 'Dr. García',
        role: 'socio',
        order: 3,
        status: 'pending',
      },
    ],
    signatures: [
      {
        id: 'sig-001',
        signerId: 'signer-001',
        signerName: 'Carlos Méndez',
        signerEmail: 'abogado@bufete.com',
        type: 'advanced',
        signedAt: '2024-01-15T10:30:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    ],
    message: 'Por favor, revise y firme el contrato de servicios legales adjunto. Si tiene alguna duda, no dude en contactarnos.',
    createdBy: 'super_admin',
    createdAt: '2024-01-15T09:00:00Z',
    expiresAt: '2024-01-22T09:00:00Z',
    reminderDays: [7, 3, 1],
    autoReminders: true,
  },
  {
    id: 'sig-req-002',
    documentId: 'EXP-2024-002',
    documentName: 'Presupuesto Proceso Judicial.pdf',
    documentType: 'application/pdf',
    status: 'in_progress',
    signatureType: 'simple',
    workflow: 'parallel',
    signers: [
      {
        id: 'signer-004',
        email: 'maria@cliente.com',
        name: 'María López',
        role: 'cliente',
        order: 1,
        status: 'signed',
        signedAt: '2024-01-14T15:20:00Z',
      },
      {
        id: 'signer-005',
        email: 'testigo@ejemplo.com',
        name: 'Pedro Sánchez',
        role: 'testigo',
        order: 1,
        status: 'pending',
      },
    ],
    signatures: [
      {
        id: 'sig-002',
        signerId: 'signer-004',
        signerName: 'María López',
        signerEmail: 'maria@cliente.com',
        type: 'biometric',
        signedAt: '2024-01-14T15:20:00Z',
        ipAddress: '192.168.1.105',
        biometricData: {
          pressurePoints: 245,
          speed: 1.2,
          acceleration: 0.8,
          deviceType: 'tablet',
        },
      },
    ],
    message: 'Aceptación del presupuesto presentado para el proceso judicial.',
    createdBy: 'abogado_senior_1',
    createdAt: '2024-01-13T11:00:00Z',
    expiresAt: '2024-01-20T11:00:00Z',
    reminderDays: [3, 1],
    autoReminders: true,
  },
  {
    id: 'sig-req-003',
    documentId: 'EXP-2024-003',
    documentName: 'Escrito de Demandaa.pdf',
    documentType: 'application/pdf',
    status: 'completed',
    signatureType: 'qualified',
    workflow: 'sequential',
    signers: [
      {
        id: 'signer-006',
        email: 'laura@bufete.com',
        name: 'Laura Torres',
        role: 'abogado',
        order: 1,
        status: 'signed',
        signedAt: '2024-01-10T09:15:00Z',
      },
      {
        id: 'signer-007',
        email: 'cliente@empresa.com',
        name: 'Empresa ABC SL',
        role: 'cliente',
        order: 2,
        status: 'signed',
        signedAt: '2024-01-10T14:30:00Z',
      },
    ],
    signatures: [
      {
        id: 'sig-003',
        signerId: 'signer-006',
        signerName: 'Laura Torres',
        signerEmail: 'laura@bufete.com',
        type: 'qualified',
        signedAt: '2024-01-10T09:15:00Z',
        ipAddress: '192.168.1.110',
        certificateInfo: {
          issuer: 'FNMT-RCM',
          subject: 'CN=Laura Torres, SN=TORRES, GIVENNAME=LAURA, SERIALNUMBER=12345678A',
          serialNumber: '1234567890ABC',
          validFrom: '2023-01-01T00:00:00Z',
          validTo: '2025-12-31T23:59:59Z',
          fingerprint: 'AB:CD:EF:12:34:56:78:90',
        },
      },
      {
        id: 'sig-004',
        signerId: 'signer-007',
        signerName: 'Empresa ABC SL',
        signerEmail: 'cliente@empresa.com',
        type: 'qualified',
        signedAt: '2024-01-10T14:30:00Z',
        ipAddress: '192.168.1.120',
        certificateInfo: {
          issuer: 'CAMERFIRMA',
          subject: 'CN=Empresa ABC SL, O=Empresa ABC SL, C=ES',
          serialNumber: '9876543210XYZ',
          validFrom: '2023-06-01T00:00:00Z',
          validTo: '2025-05-31T23:59:59Z',
          fingerprint: '12:34:56:78:90:AB:CD:EF',
        },
      },
    ],
    message: 'Escrito de demanda para presentación ante el Juzgado.',
    createdBy: 'abogado_senior_2',
    createdAt: '2024-01-09T16:00:00Z',
    completedAt: '2024-01-10T14:30:00Z',
    reminderDays: [7, 3, 1],
    autoReminders: true,
  },
  {
    id: 'sig-req-004',
    documentId: 'FAC-2024-015',
    documentName: 'Factura F-2024-015.pdf',
    documentType: 'application/pdf',
    status: 'expired',
    signatureType: 'simple',
    workflow: 'parallel',
    signers: [
      {
        id: 'signer-008',
        email: 'admin@empresa.com',
        name: 'Admin Empresa',
        role: 'cliente',
        order: 1,
        status: 'expired',
      },
    ],
    signatures: [],
    message: 'Por favor, confirme la recepción de la factura.',
    createdBy: 'contador_1',
    createdAt: '2023-12-01T10:00:00Z',
    expiresAt: '2023-12-08T10:00:00Z',
    reminderDays: [3, 1],
    autoReminders: true,
  },
  {
    id: 'sig-req-005',
    documentId: 'PLT-001',
    documentName: 'Contrato de Confidencialidad.docx',
    documentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'draft',
    signatureType: 'advanced',
    workflow: 'sequential',
    signers: [
      {
        id: 'signer-009',
        email: 'nuevo@cliente.com',
        name: 'Nuevo Cliente',
        role: 'cliente',
        order: 1,
        status: 'pending',
      },
    ],
    signatures: [],
    message: 'Contrato de confidencialidad para iniciar la relación profesional.',
    createdBy: 'socio_1',
    createdAt: '2024-01-20T08:00:00Z',
    expiresAt: '2024-01-27T08:00:00Z',
    reminderDays: [7, 3, 1],
    autoReminders: true,
  },
];

// ============================================
// DOCUMENTOS FIRMADOS MOCK
// ============================================

export const mockSignedDocuments: SignedDocument[] = [
  {
    id: 'sig-doc-001',
    originalDocumentId: 'EXP-2024-003',
    name: 'Escrito de Demanda_FIRMADO.pdf',
    url: '/documents/signed/escrito_demanda_firmado.pdf',
    signedAt: '2024-01-10T14:30:00Z',
    signatures: [
      {
        id: 'sig-003',
        signerId: 'signer-006',
        signerName: 'Laura Torres',
        signerEmail: 'laura@bufete.com',
        type: 'qualified',
        signedAt: '2024-01-10T09:15:00Z',
        certificateInfo: {
          issuer: 'FNMT-RCM',
          subject: 'CN=Laura Torres, SN=TORRES, GIVENNAME=LAURA',
          serialNumber: '1234567890ABC',
          validFrom: '2023-01-01T00:00:00Z',
          validTo: '2025-12-31T23:59:59Z',
          fingerprint: 'AB:CD:EF:12:34:56:78:90',
        },
      },
      {
        id: 'sig-004',
        signerId: 'signer-007',
        signerName: 'Empresa ABC SL',
        signerEmail: 'cliente@empresa.com',
        type: 'qualified',
        signedAt: '2024-01-10T14:30:00Z',
      },
    ],
    auditTrailUrl: '/documents/audit/escrito_demanda_audit.pdf',
    certificateUrl: '/documents/certificates/escrito_demanda_cert.pdf',
  },
];

// ============================================
// CAMPOS DE FIRMA MOCK (posiciones en documentos)
// ============================================

export const mockSignatureFields: Record<string, SignatureField[]> = {
  'EXP-2024-001': [
    { id: 'field-001', page: 1, x: 100, y: 600, width: 200, height: 50, signerId: 'signer-001', signed: true, signatureImage: 'data:image/png;base64,...' },
    { id: 'field-002', page: 1, x: 350, y: 600, width: 200, height: 50, signerId: 'signer-002', signed: false },
    { id: 'field-003', page: 1, x: 100, y: 500, width: 200, height: 50, signerId: 'signer-003', signed: false },
  ],
  'EXP-2024-002': [
    { id: 'field-004', page: 1, x: 100, y: 550, width: 200, height: 50, signerId: 'signer-004', signed: true },
    { id: 'field-005', page: 1, x: 350, y: 550, width: 200, height: 50, signerId: 'signer-005', signed: false },
  ],
};

// ============================================
// CONFIGURACIONES MOCK
// ============================================

export const mockSignatureConfigs: Record<string, SignatureConfig> = {
  default: {
    defaultType: 'advanced',
    defaultWorkflow: 'parallel',
    allowBiometric: true,
    allowCertificate: true,
    requireAuthentication: true,
    reminderDays: [7, 3, 1],
    expirationDays: 30,
  },
  cliente_externo: {
    defaultType: 'simple',
    defaultWorkflow: 'parallel',
    allowBiometric: true,
    allowCertificate: false,
    requireAuthentication: false,
    reminderDays: [3, 1],
    expirationDays: 15,
  },
  abogado_junior: {
    defaultType: 'simple',
    defaultWorkflow: 'sequential',
    allowBiometric: true,
    allowCertificate: false,
    requireAuthentication: true,
    reminderDays: [7, 3, 1],
    expirationDays: 30,
  },
};

// ============================================
// ESTADÍSTICAS MOCK
// ============================================

export const mockSignatureStats = {
  totalRequests: 45,
  completed: 38,
  pending: 4,
  expired: 2,
  cancelled: 1,
  byType: {
    simple: 20,
    advanced: 15,
    qualified: 8,
    biometric: 2,
  },
  byMonth: [
    { month: 'Enero', requests: 12, completed: 10 },
    { month: 'Febrero', requests: 15, completed: 14 },
    { month: 'Marzo', requests: 18, completed: 14 },
  ],
  averageCompletionTime: 2.5, // días
};

// ============================================
// HELPERS
// ============================================

export function getSignatureRequestById(id: string): SignatureRequest | undefined {
  return mockSignatureRequests.find(req => req.id === id);
}

export function getSignatureRequestsByDocumentId(documentId: string): SignatureRequest[] {
  return mockSignatureRequests.filter(req => req.documentId === documentId);
}

export function getPendingSignaturesForUser(email: string): SignatureRequest[] {
  return mockSignatureRequests.filter(req => 
    req.signers.some(signer => 
      signer.email === email && signer.status === 'pending'
    )
  );
}

export function getSignatureFieldsByDocumentId(documentId: string): SignatureField[] {
  return mockSignatureFields[documentId] || [];
}
