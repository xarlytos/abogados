// ============================================
// DATOS MOCK PARA FIRMA ELECTRÓNICA AVANZADA
// Compatible con FNMT, DNIe, firma múltiple secuencial y sellado de tiempo
// ============================================

import type { 
  SignatureRequest, 
  SignedDocument, 
  SignatureField,
  SignatureConfig,
  Timestamp
} from '@/types/signature';

// ============================================
// SELLOS DE TIEMPO MOCK
// ============================================

const mockTimestamps: Record<string, Timestamp> = {
  'ts-001': {
    id: 'ts-001',
    authority: 'FNMT TSA',
    timestamp: '2024-01-15T10:30:00Z',
    serialNumber: 'SN-20240115103000-ABC123',
    hashAlgorithm: 'SHA-256',
    hashedMessage: 'a1b2c3d4e5f6...',
    token: 'MIIXbwYJKoZIhvcNAQcCoIIXYDCCF1wCAQMxDzANBglghkgBZQMEAgEFADCB...',
    accuracy: 1000,
    ordering: true,
  },
  'ts-002': {
    id: 'ts-002',
    authority: 'AC TSA',
    timestamp: '2024-01-10T09:15:00Z',
    serialNumber: 'SN-20240110091500-XYZ789',
    hashAlgorithm: 'SHA-256',
    hashedMessage: 'f6e5d4c3b2a1...',
    token: 'MIIXbwYJKoZIhvcNAQcCoIIXYDCCF1wCAQMxDzANBglghkgBZQMEAgEFADCB...',
    accuracy: 500,
    ordering: true,
  },
};

// ============================================
// SOLICITUDES DE FIRMA MOCK (ampliadas)
// ============================================

export const mockSignatureRequests: SignatureRequest[] = [
  {
    id: 'sig-req-001',
    documentId: 'EXP-2024-001',
    documentName: 'Contrato de Servicios Legales.pdf',
    documentType: 'application/pdf',
    documentHash: 'sha256:a1b2c3d4e5f6...',
    status: 'in_progress',
    signatureType: 'fnmt',
    workflow: 'sequential',
    sequentialConfig: {
      enabled: true,
      notifyNextSigner: true,
      waitTimeBetweenSigners: 0,
      allowSkipping: false,
      requireAllSigners: true,
      expirationPerSigner: 72,
    },
    signers: [
      {
        id: 'signer-001',
        email: 'abogado@bufete.com',
        name: 'Carlos Méndez',
        role: 'abogado',
        order: 1,
        status: 'signed',
        signedAt: '2024-01-15T10:30:00Z',
        certificateInfo: {
          issuer: 'FNMT-RCM',
          subject: 'CN=Carlos Méndez, SERIALNUMBER=12345678A, C=ES',
          serialNumber: 'FNMT123456',
          validFrom: '2023-01-01',
          validTo: '2026-12-31',
          fingerprint: 'AB:CD:EF:12:34:56:78:90',
          fingerprintAlgorithm: 'SHA-256',
          certificateType: 'fnmt',
          keyUsage: ['digitalSignature', 'nonRepudiation'],
          ocspUrl: 'http://ocsp.fnmt.es',
        },
      },
      {
        id: 'signer-002',
        email: 'cliente@ejemplo.com',
        name: 'Juan Pérez',
        role: 'cliente',
        order: 2,
        status: 'pending',
        requiredSignatureType: 'dnie',
      },
      {
        id: 'signer-003',
        email: 'socio@bufete.com',
        name: 'Dr. García',
        role: 'socio',
        order: 3,
        status: 'pending',
        requiredSignatureType: 'fnmt',
      },
    ],
    signatures: [
      {
        id: 'sig-001',
        signerId: 'signer-001',
        signerName: 'Carlos Méndez',
        signerEmail: 'abogado@bufete.com',
        type: 'fnmt',
        signedAt: '2024-01-15T10:30:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        certificateInfo: {
          issuer: 'FNMT-RCM',
          subject: 'CN=Carlos Méndez, SERIALNUMBER=12345678A, C=ES',
          serialNumber: 'FNMT123456',
          validFrom: '2023-01-01',
          validTo: '2026-12-31',
          fingerprint: 'AB:CD:EF:12:34:56:78:90',
          fingerprintAlgorithm: 'SHA-256',
          certificateType: 'fnmt',
          keyUsage: ['digitalSignature', 'nonRepudiation'],
          ocspUrl: 'http://ocsp.fnmt.es',
        },
        timestamp: mockTimestamps['ts-001'],
        signatureValue: 'SIGNATURE_VALUE_FNMT_CARLOS',
        ocspResponse: 'OCSP_GOOD',
        crlChecked: true,
        crlCheckDate: '2024-01-15T10:30:00Z',
      },
    ],
    message: 'Por favor, revise y firme el contrato de servicios legales adjunto. Se requiere firma con certificado FNMT o DNIe.',
    createdBy: 'super_admin',
    createdAt: '2024-01-15T09:00:00Z',
    expiresAt: '2024-01-22T09:00:00Z',
    reminderDays: [7, 3, 1],
    autoReminders: true,
    enableTimestamp: true,
    timestampAuthority: 'fnmt_tsa',
  },
  {
    id: 'sig-req-002',
    documentId: 'EXP-2024-002',
    documentName: 'Presupuesto Proceso Judicial.pdf',
    documentType: 'application/pdf',
    documentHash: 'sha256:f6e5d4c3b2a1...',
    status: 'completed',
    signatureType: 'dnie',
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
        certificateInfo: {
          issuer: 'DGP-Police',
          subject: 'CN=María López, SERIALNUMBER=87654321B, C=ES',
          serialNumber: 'DNIe987654',
          validFrom: '2022-06-15',
          validTo: '2027-06-15',
          fingerprint: 'B2:C3:D4:E5:F6:A1:...',
          fingerprintAlgorithm: 'SHA-256',
          certificateType: 'dnie',
          keyUsage: ['digitalSignature', 'nonRepudiation', 'keyEncipherment'],
          ocspUrl: 'http://ocsp.dnie.es',
        },
      },
      {
        id: 'signer-005',
        email: 'testigo@ejemplo.com',
        name: 'Pedro Sánchez',
        role: 'testigo',
        order: 1,
        status: 'signed',
        signedAt: '2024-01-14T16:45:00Z',
      },
    ],
    signatures: [
      {
        id: 'sig-002',
        signerId: 'signer-004',
        signerName: 'María López',
        signerEmail: 'maria@cliente.com',
        type: 'dnie',
        signedAt: '2024-01-14T15:20:00Z',
        ipAddress: '192.168.1.105',
        certificateInfo: {
          issuer: 'DGP-Police',
          subject: 'CN=María López, SERIALNUMBER=87654321B, C=ES',
          serialNumber: 'DNIe987654',
          validFrom: '2022-06-15',
          validTo: '2027-06-15',
          fingerprint: 'B2:C3:D4:E5:F6:A1:...',
          fingerprintAlgorithm: 'SHA-256',
          certificateType: 'dnie',
          keyUsage: ['digitalSignature', 'nonRepudiation', 'keyEncipherment'],
          ocspUrl: 'http://ocsp.dnie.es',
        },
        timestamp: mockTimestamps['ts-002'],
        signatureValue: 'SIGNATURE_VALUE_DNIE_MARIA',
        ocspResponse: 'OCSP_GOOD',
        crlChecked: true,
        crlCheckDate: '2024-01-14T15:20:00Z',
      },
      {
        id: 'sig-003',
        signerId: 'signer-005',
        signerName: 'Pedro Sánchez',
        signerEmail: 'testigo@ejemplo.com',
        type: 'biometric',
        signedAt: '2024-01-14T16:45:00Z',
        ipAddress: '192.168.1.110',
        biometricData: {
          pressurePoints: 245,
          speed: 1.2,
          acceleration: 0.8,
          deviceType: 'tablet',
        },
        signatureImage: 'data:image/png;base64,SIGNATURE_IMAGE...',
      },
    ],
    message: 'Aceptación del presupuesto presentado para el proceso judicial.',
    createdBy: 'abogado_senior_1',
    createdAt: '2024-01-13T11:00:00Z',
    completedAt: '2024-01-14T16:45:00Z',
    expiresAt: '2024-01-20T11:00:00Z',
    reminderDays: [3, 1],
    autoReminders: true,
    enableTimestamp: true,
    timestampAuthority: 'ac_tsa',
  },
  {
    id: 'sig-req-003',
    documentId: 'EXP-2024-003',
    documentName: 'Escrito de Demanda.pdf',
    documentType: 'application/pdf',
    documentHash: 'sha256:9a8b7c6d5e4f...',
    status: 'completed',
    signatureType: 'qualified',
    workflow: 'sequential',
    sequentialConfig: {
      enabled: true,
      notifyNextSigner: true,
      requireAllSigners: true,
    },
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
        id: 'sig-004',
        signerId: 'signer-006',
        signerName: 'Laura Torres',
        signerEmail: 'laura@bufete.com',
        type: 'qualified',
        signedAt: '2024-01-10T09:15:00Z',
        ipAddress: '192.168.1.110',
        certificateInfo: {
          issuer: 'FNMT-RCM',
          subject: 'CN=Laura Torres, SN=TORRES, GIVENNAME=LAURA, SERIALNUMBER=12345678A',
          serialNumber: 'FNMT789012',
          validFrom: '2023-01-01',
          validTo: '2025-12-31',
          fingerprint: 'CD:EF:12:34:56:78:90:AB',
          fingerprintAlgorithm: 'SHA-256',
          certificateType: 'fnmt',
          keyUsage: ['digitalSignature', 'nonRepudiation'],
          ocspUrl: 'http://ocsp.fnmt.es',
        },
        timestamp: {
          id: 'ts-003',
          authority: 'AC TSA',
          timestamp: '2024-01-10T09:15:00Z',
          serialNumber: 'SN-20240110091500-LT001',
          hashAlgorithm: 'SHA-256',
          hashedMessage: 'hash-laura-001...',
          token: 'MIIXbwYJKoZIhvcNAQcCoIIXYDCCF1wCAQMxDzANBgl...',
          accuracy: 1000,
          ordering: true,
        },
        signatureValue: 'SIGNATURE_VALUE_QUALIFIED_LAURA',
      },
      {
        id: 'sig-005',
        signerId: 'signer-007',
        signerName: 'Empresa ABC SL',
        signerEmail: 'cliente@empresa.com',
        type: 'qualified',
        signedAt: '2024-01-10T14:30:00Z',
        ipAddress: '192.168.1.120',
        certificateInfo: {
          issuer: 'CAMERFIRMA',
          subject: 'CN=Empresa ABC SL, O=Empresa ABC SL, C=ES',
          serialNumber: 'CAMER123456',
          validFrom: '2023-06-01',
          validTo: '2025-05-31',
          fingerprint: '12:34:56:78:90:AB:CD:EF',
          fingerprintAlgorithm: 'SHA-256',
          certificateType: 'other',
          keyUsage: ['digitalSignature', 'nonRepudiation'],
        },
        timestamp: {
          id: 'ts-004',
          authority: 'CATCert TSA',
          timestamp: '2024-01-10T14:30:00Z',
          serialNumber: 'SN-20240110143000-ABC002',
          hashAlgorithm: 'SHA-256',
          hashedMessage: 'hash-abc-002...',
          token: 'MIIXbwYJKoZIhvcNAQcCoIIXYDCCF1wCAQMxDzANBgl...',
          accuracy: 500,
          ordering: true,
        },
        signatureValue: 'SIGNATURE_VALUE_QUALIFIED_ABC',
      },
    ],
    message: 'Escrito de demanda para presentación ante el Juzgado. Requiere firma cualificada de ambas partes.',
    createdBy: 'abogado_senior_2',
    createdAt: '2024-01-09T16:00:00Z',
    completedAt: '2024-01-10T14:30:00Z',
    reminderDays: [7, 3, 1],
    autoReminders: true,
    enableTimestamp: true,
    timestampAuthority: 'ac_tsa',
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
    enableTimestamp: false,
  },
  {
    id: 'sig-req-005',
    documentId: 'PLT-001',
    documentName: 'Contrato de Confidencialidad.docx',
    documentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'draft',
    signatureType: 'advanced',
    workflow: 'sequential',
    sequentialConfig: {
      enabled: true,
      notifyNextSigner: true,
      requireAllSigners: true,
      expirationPerSigner: 48,
    },
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
    enableTimestamp: true,
    timestampAuthority: 'ac_tsa',
  },
  {
    id: 'sig-req-006',
    documentId: 'EXP-2024-010',
    documentName: 'Contrato de Arrendamiento Comercial.pdf',
    documentType: 'application/pdf',
    documentHash: 'sha256:1a2b3c4d5e6f...',
    status: 'in_progress',
    signatureType: 'fnmt',
    workflow: 'sequential',
    sequentialConfig: {
      enabled: true,
      notifyNextSigner: true,
      requireAllSigners: true,
    },
    signers: [
      {
        id: 'signer-010',
        email: 'arrendador@inmo.com',
        name: 'Inmobiliaria Sol',
        role: 'cliente',
        order: 1,
        status: 'signed',
        signedAt: '2024-01-18T11:00:00Z',
        certificateInfo: {
          issuer: 'FNMT-RCM',
          subject: 'CN=Inmobiliaria Sol SL, O=Inmobiliaria Sol SL, C=ES',
          serialNumber: 'FNMTcorp001',
          validFrom: '2023-03-01',
          validTo: '2026-02-28',
          fingerprint: 'AA:BB:CC:DD:EE:FF:00:11',
          fingerprintAlgorithm: 'SHA-256',
          certificateType: 'fnmt',
          keyUsage: ['digitalSignature', 'nonRepudiation'],
        },
      },
      {
        id: 'signer-011',
        email: 'arrendatario@negocio.com',
        name: 'María Emprendedora',
        role: 'cliente',
        order: 2,
        status: 'pending',
        requiredSignatureType: 'fnmt',
      },
      {
        id: 'signer-012',
        email: 'fiador@banco.com',
        name: 'Banco Garantía',
        role: 'otro',
        order: 3,
        status: 'pending',
        requiredSignatureType: 'cloud',
      },
    ],
    signatures: [
      {
        id: 'sig-006',
        signerId: 'signer-010',
        signerName: 'Inmobiliaria Sol',
        signerEmail: 'arrendador@inmo.com',
        type: 'fnmt',
        signedAt: '2024-01-18T11:00:00Z',
        ipAddress: '192.168.2.50',
        certificateInfo: {
          issuer: 'FNMT-RCM',
          subject: 'CN=Inmobiliaria Sol SL, O=Inmobiliaria Sol SL, C=ES',
          serialNumber: 'FNMTcorp001',
          validFrom: '2023-03-01',
          validTo: '2026-02-28',
          fingerprint: 'AA:BB:CC:DD:EE:FF:00:11',
          fingerprintAlgorithm: 'SHA-256',
          certificateType: 'fnmt',
          keyUsage: ['digitalSignature', 'nonRepudiation'],
        },
        timestamp: {
          id: 'ts-005',
          authority: 'FNMT TSA',
          timestamp: '2024-01-18T11:00:00Z',
          serialNumber: 'SN-20240118110000-INM001',
          hashAlgorithm: 'SHA-256',
          hashedMessage: 'hash-inmo-001...',
          token: 'MIIXbwYJKoZIhvcNAQcCoIIXYDCCF1wCAQMxDzANBgl...',
          accuracy: 1000,
          ordering: true,
        },
        signatureValue: 'SIGNATURE_VALUE_FNMT_INMO',
      },
    ],
    message: 'Contrato de arrendamiento comercial con garantía bancaria. Se requiere firma secuencial: primero el arrendador, luego el arrendatario y finalmente el fiador.',
    createdBy: 'socio_1',
    createdAt: '2024-01-17T09:00:00Z',
    expiresAt: '2024-01-31T09:00:00Z',
    reminderDays: [7, 3, 1],
    autoReminders: true,
    enableTimestamp: true,
    timestampAuthority: 'fnmt_tsa',
  },
];

// ============================================
// DOCUMENTOS FIRMADOS MOCK
// ============================================

export const mockSignedDocuments: SignedDocument[] = [
  {
    id: 'sig-doc-001',
    originalDocumentId: 'EXP-2024-002',
    name: 'Presupuesto Proceso Judicial_FIRMADO.pdf',
    url: '/documents/signed/presupuesto_firmado.pdf',
    signedAt: '2024-01-14T16:45:00Z',
    signatures: [
      {
        id: 'sig-002',
        signerId: 'signer-004',
        signerName: 'María López',
        signerEmail: 'maria@cliente.com',
        type: 'dnie',
        signedAt: '2024-01-14T15:20:00Z',
        certificateInfo: {
          issuer: 'DGP-Police',
          subject: 'CN=María López, SERIALNUMBER=87654321B, C=ES',
          serialNumber: 'DNIe987654',
          validFrom: '2022-06-15',
          validTo: '2027-06-15',
          fingerprint: 'B2:C3:D4:E5:F6:A1:...',
          fingerprintAlgorithm: 'SHA-256',
          certificateType: 'dnie',
          keyUsage: ['digitalSignature', 'nonRepudiation', 'keyEncipherment'],
        },
        timestamp: mockTimestamps['ts-002'],
      },
      {
        id: 'sig-003',
        signerId: 'signer-005',
        signerName: 'Pedro Sánchez',
        signerEmail: 'testigo@ejemplo.com',
        type: 'biometric',
        signedAt: '2024-01-14T16:45:00Z',
        biometricData: {
          pressurePoints: 245,
          speed: 1.2,
          acceleration: 0.8,
          deviceType: 'tablet',
        },
      },
    ],
    auditTrailUrl: '/documents/audit/presupuesto_audit.pdf',
    certificateUrl: '/documents/certificates/presupuesto_cert.pdf',
    timestampTokenUrl: '/documents/timestamps/presupuesto_tst.tsr',
    documentWithSignaturesUrl: '/documents/signed/presupuesto_visual.pdf',
  },
  {
    id: 'sig-doc-002',
    originalDocumentId: 'EXP-2024-003',
    name: 'Escrito de Demanda_FIRMADO.pdf',
    url: '/documents/signed/escrito_demanda_firmado.pdf',
    signedAt: '2024-01-10T14:30:00Z',
    signatures: [
      {
        id: 'sig-004',
        signerId: 'signer-006',
        signerName: 'Laura Torres',
        signerEmail: 'laura@bufete.com',
        type: 'qualified',
        signedAt: '2024-01-10T09:15:00Z',
        certificateInfo: {
          issuer: 'FNMT-RCM',
          subject: 'CN=Laura Torres, SERIALNUMBER=12345678A, C=ES',
          serialNumber: 'FNMT789012',
          validFrom: '2023-01-01',
          validTo: '2025-12-31',
          fingerprint: 'CD:EF:12:34:56:78:90:AB',
          fingerprintAlgorithm: 'SHA-256',
          certificateType: 'fnmt',
          keyUsage: ['digitalSignature', 'nonRepudiation'],
        },
      },
      {
        id: 'sig-005',
        signerId: 'signer-007',
        signerName: 'Empresa ABC SL',
        signerEmail: 'cliente@empresa.com',
        type: 'qualified',
        signedAt: '2024-01-10T14:30:00Z',
        certificateInfo: {
          issuer: 'CAMERFIRMA',
          subject: 'CN=Empresa ABC SL, O=Empresa ABC SL, C=ES',
          serialNumber: 'CAMER123456',
          validFrom: '2023-06-01',
          validTo: '2025-05-31',
          fingerprint: '12:34:56:78:90:AB:CD:EF',
          fingerprintAlgorithm: 'SHA-256',
          certificateType: 'other',
          keyUsage: ['digitalSignature', 'nonRepudiation'],
        },
      },
    ],
    auditTrailUrl: '/documents/audit/escrito_demanda_audit.pdf',
    certificateUrl: '/documents/certificates/escrito_demanda_cert.pdf',
    timestampTokenUrl: '/documents/timestamps/escrito_demanda_tst.tsr',
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
    { id: 'field-005', page: 1, x: 350, y: 550, width: 200, height: 50, signerId: 'signer-005', signed: true },
  ],
  'EXP-2024-010': [
    { id: 'field-006', page: 3, x: 100, y: 700, width: 200, height: 50, signerId: 'signer-010', signed: true },
    { id: 'field-007', page: 3, x: 350, y: 700, width: 200, height: 50, signerId: 'signer-011', signed: false },
    { id: 'field-008', page: 3, x: 100, y: 600, width: 200, height: 50, signerId: 'signer-012', signed: false },
  ],
};

// ============================================
// CONFIGURACIONES MOCK (ampliadas)
// ============================================

export const mockSignatureConfigs: Record<string, SignatureConfig> = {
  default: {
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
    defaultTimestampAuthority: 'ac_tsa',
  },
  cliente_externo: {
    defaultType: 'simple',
    defaultWorkflow: 'parallel',
    allowBiometric: true,
    allowCertificate: true,
    allowFNMT: true,
    allowDNIe: true,
    requireAuthentication: false,
    reminderDays: [3, 1],
    expirationDays: 15,
    enableTimestampByDefault: true,
    defaultTimestampAuthority: 'ac_tsa',
  },
  abogado_junior: {
    defaultType: 'simple',
    defaultWorkflow: 'sequential',
    allowBiometric: true,
    allowCertificate: false,
    allowFNMT: false,
    allowDNIe: false,
    requireAuthentication: true,
    reminderDays: [7, 3, 1],
    expirationDays: 30,
    enableTimestampByDefault: false,
  },
  socio: {
    defaultType: 'qualified',
    defaultWorkflow: 'sequential',
    allowBiometric: true,
    allowCertificate: true,
    allowFNMT: true,
    allowDNIe: true,
    requireAuthentication: true,
    reminderDays: [7, 3, 1],
    expirationDays: 30,
    enableTimestampByDefault: true,
    defaultTimestampAuthority: 'fnmt_tsa',
  },
};

// ============================================
// ESTADÍSTICAS MOCK (ampliadas)
// ============================================

export const mockSignatureStats = {
  totalRequests: 68,
  completed: 52,
  pending: 12,
  expired: 3,
  cancelled: 1,
  byType: {
    simple: 15,
    advanced: 20,
    qualified: 18,
    biometric: 5,
    certificate: 3,
    fnmt: 15,
    dnie: 8,
    cloud: 4,
  },
  byMonth: [
    { month: 'Enero', requests: 12, completed: 10 },
    { month: 'Febrero', requests: 15, completed: 14 },
    { month: 'Marzo', requests: 18, completed: 14 },
    { month: 'Abril', requests: 23, completed: 20 },
  ],
  averageCompletionTime: 2.3, // días
  withTimestamp: 45, // documentos con sello de tiempo
  sequentialWorkflows: 28, // flujos secuenciales
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

// Helper para obtener el sello de tiempo
export function getTimestampById(id: string): Timestamp | undefined {
  return mockTimestamps[id];
}

// Helper para verificar si un firmante puede firmar en flujo secuencial
export function canSignSequential(request: SignatureRequest, signerId: string): boolean {
  if (request.workflow !== 'sequential') return true;
  
  const pendingSigners = request.signers
    .filter(s => s.status === 'pending')
    .sort((a, b) => a.order - b.order);
  
  const nextSigner = pendingSigners[0];
  return nextSigner?.id === signerId;
}
