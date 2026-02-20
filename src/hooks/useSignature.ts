// ============================================
// HOOK PARA GESTIÓN DE FIRMA ELECTRÓNICA AVANZADA
// Compatible con FNMT, DNIe, firma múltiple secuencial y sellado de tiempo
// ============================================

import { useState, useCallback, useMemo } from 'react';
import type { 
  SignatureRequest, 
  SignatureType, 
  SignatureWorkflow,
  SignaturePermissions,
  SignatureConfig,
  Signature,
  Signer,
  SignatureField,
  Timestamp,
  SequentialSignatureConfig
} from '@/types/signature';
import { SIGNATURE_PERMISSIONS, DEFAULT_SIGNATURE_CONFIG } from '@/types/signature';
import type { UserRole } from '@/types/roles';
import { 
  mockSignatureRequests,
  mockSignatureConfigs,
  mockSignatureFields
} from '@/data/signatureData';

// ============================================
// INTERFACES
// ============================================

export interface UseSignatureReturn {
  // Estado
  requests: SignatureRequest[];
  currentRequest: SignatureRequest | null;
  isLoading: boolean;
  error: string | null;
  
  // Permisos
  permissions: SignaturePermissions;
  config: SignatureConfig;
  
  // Acciones
  createRequest: (data: CreateSignatureRequestData) => Promise<SignatureRequest>;
  signDocument: (requestId: string, signatureData: SignDocumentData) => Promise<Signature>;
  cancelRequest: (requestId: string) => Promise<void>;
  deleteRequest: (requestId: string) => Promise<void>;
  sendReminder: (requestId: string, signerId?: string) => Promise<void>;
  
  // Consultas
  getRequestById: (id: string) => SignatureRequest | undefined;
  getRequestsByDocument: (documentId: string) => SignatureRequest[];
  getPendingForCurrentUser: () => SignatureRequest[];
  getSignatureFields: (documentId: string) => SignatureField[];
  
  // Utilidades de firma secuencial
  canSign: (request: SignatureRequest) => boolean;
  isRequestCompleted: (request: SignatureRequest) => boolean;
  getNextSigner: (request: SignatureRequest) => Signer | undefined;
  getCurrentSigner: (request: SignatureRequest) => Signer | undefined;
  advanceSequentialWorkflow: (requestId: string) => Promise<void>;
  validateSigners: (signers: Partial<Signer>[]) => { valid: boolean; errors: string[] };
  
  // Utilidades de sellado de tiempo
  generateTimestamp: (documentHash: string, authority?: string) => Promise<Timestamp>;
  verifyTimestamp: (timestamp: Timestamp) => Promise<boolean>;
}

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

export interface SignDocumentData {
  type: SignatureType;
  signatureImage?: string;           // Base64 para firma biométrica/simple
  certificateData?: string;          // Datos del certificado (JSON)
  certificateType?: string;          // Tipo de certificado
  biometricData?: {
    pressurePoints: number;
    speed: number;
    acceleration: number;
    deviceType: string;
  };
  ipAddress?: string;
  userAgent?: string;
  timestamp?: Timestamp;             // Sello de tiempo RFC 3161
  signatureValue?: string;           // Valor de firma digital
  ocspResponse?: string;             // Respuesta OCSP
}

export function useSignature(role: UserRole, userEmail?: string): UseSignatureReturn {
  // Estado local (simulado - en producción vendría de API/Context)
  const [requests, setRequests] = useState<SignatureRequest[]>(mockSignatureRequests);
  const [currentRequest, setCurrentRequest] = useState<SignatureRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Permisos según rol
  const permissions = useMemo(() => SIGNATURE_PERMISSIONS[role], [role]);
  
  // Configuración según rol
  const config = useMemo(() => {
    const configKey = role === 'abogado_junior' ? 'abogado_junior' : 'default';
    return mockSignatureConfigs[configKey] || DEFAULT_SIGNATURE_CONFIG;
  }, [role]);

  // ============================================
  // ACCIONES
  // ============================================

  /**
   * Crear una nueva solicitud de firma con soporte para firma secuencial y sellado de tiempo
   */
  const createRequest = useCallback(async (data: CreateSignatureRequestData): Promise<SignatureRequest> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validaciones
      if (!permissions.canRequestSignatures) {
        throw new Error('No tienes permisos para solicitar firmas');
      }

      if (data.signers.length > permissions.maxSignersPerRequest) {
        throw new Error(`Máximo ${permissions.maxSignersPerRequest} firmantes permitidos`);
      }

      if (!permissions.allowedTypes.includes(data.signatureType)) {
        throw new Error('Tipo de firma no permitido para tu rol');
      }

      // Validar signers
      const validation = validateSigners(data.signers);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Validar sellado de tiempo
      if (data.enableTimestamp && !permissions.allowTimestamp) {
        throw new Error('No tienes permisos para usar sellado de tiempo');
      }

      // Generar hash del documento si no se proporciona
      const documentHash = data.documentHash || `hash-${Date.now()}-${data.documentId}`;

      // Generar sello de tiempo si está habilitado
      if (data.enableTimestamp) {
        await generateTimestamp(documentHash, data.timestampAuthority);
      }

      // Crear objeto de solicitud
      const newRequest: SignatureRequest = {
        id: `sig-req-${Date.now()}`,
        documentId: data.documentId,
        documentName: data.documentName,
        documentUrl: data.documentUrl,
        documentType: 'application/pdf',
        documentHash,
        status: 'pending',
        signatureType: data.signatureType,
        workflow: data.workflow,
        sequentialConfig: data.workflow === 'sequential' && data.sequentialConfig ? {
          enabled: true,
          notifyNextSigner: data.sequentialConfig.notifyNextSigner ?? true,
          waitTimeBetweenSigners: data.sequentialConfig.waitTimeBetweenSigners ?? 0,
          allowSkipping: data.sequentialConfig.allowSkipping ?? false,
          requireAllSigners: data.sequentialConfig.requireAllSigners ?? true,
          expirationPerSigner: data.sequentialConfig.expirationPerSigner ?? 72,
        } : undefined,
        signers: data.signers.map((s, index) => ({
          id: `signer-${Date.now()}-${index}`,
          email: s.email || '',
          name: s.name || '',
          role: s.role || 'otro',
          order: s.order || index + 1,
          status: 'pending',
          requiredSignatureType: s.requiredSignatureType || data.signatureType,
        })),
        signatures: [],
        message: data.message,
        createdBy: role,
        createdAt: new Date().toISOString(),
        expiresAt: data.expiresAt,
        reminderDays: config.reminderDays,
        autoReminders: data.autoReminders ?? true,
        enableTimestamp: data.enableTimestamp ?? false,
        timestampAuthority: data.timestampAuthority,
      };

      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(prev => [newRequest, ...prev]);
      setCurrentRequest(newRequest);
      
      // Si es flujo secuencial, notificar al primer firmante
      if (data.workflow === 'sequential' && newRequest.sequentialConfig?.notifyNextSigner) {
        const firstSigner = newRequest.signers.sort((a, b) => a.order - b.order)[0];
        if (firstSigner) {
          console.log(`[SECUENCIAL] Notificando al primer firmante: ${firstSigner.email}`);
          // En producción: enviar email/SMS
        }
      }
      
      return newRequest;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [permissions, config, role]);

  /**
   * Firmar un documento con soporte para certificados y sellado de tiempo
   */
  const signDocument = useCallback(async (
    requestId: string, 
    signatureData: SignDocumentData
  ): Promise<Signature> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!permissions.canSign) {
        throw new Error('No tienes permisos para firmar documentos');
      }

      const request = requests.find(r => r.id === requestId);
      if (!request) {
        throw new Error('Solicitud de firma no encontrada');
      }

      if (!canSign(request)) {
        throw new Error('No puedes firmar este documento en este momento');
      }

      // Validar tipo de firma requerido
      const currentSigner = request.signers.find(s => s.email === userEmail);
      if (currentSigner?.requiredSignatureType && currentSigner.requiredSignatureType !== signatureData.type) {
        throw new Error(`Se requiere tipo de firma: ${currentSigner.requiredSignatureType}`);
      }

      // Generar sello de tiempo adicional si no viene incluido
      let timestamp = signatureData.timestamp;
      if (request.enableTimestamp && !timestamp) {
        const documentHash = request.documentHash || `hash-${requestId}`;
        timestamp = await generateTimestamp(documentHash, request.timestampAuthority);
      }

      // Crear objeto de firma
      const newSignature: Signature = {
        id: `sig-${Date.now()}`,
        signerId: currentSigner?.id || 'current-user',
        signerName: currentSigner?.name || 'Usuario Actual',
        signerEmail: userEmail || 'usuario@bufete.com',
        type: signatureData.type,
        signedAt: new Date().toISOString(),
        ipAddress: signatureData.ipAddress,
        userAgent: signatureData.userAgent,
        signatureImage: signatureData.signatureImage,
        biometricData: signatureData.biometricData,
        certificateInfo: signatureData.certificateData ? JSON.parse(signatureData.certificateData) : undefined,
        timestamp,
        signatureValue: signatureData.signatureValue,
        ocspResponse: signatureData.ocspResponse,
        crlChecked: true,
        crlCheckDate: new Date().toISOString(),
      };

      // Actualizar estado
      await new Promise(resolve => setTimeout(resolve, 500));

      setRequests(prev => prev.map(r => {
        if (r.id !== requestId) return r;

        const updatedSignatures = [...r.signatures, newSignature];
        const updatedSigners = r.signers.map(s => {
          if (s.email === userEmail) {
            return { ...s, status: 'signed' as const, signedAt: newSignature.signedAt };
          }
          return s;
        });

        // Verificar si está completado
        const allSigned = updatedSigners.every(s => s.status === 'signed');
        
        // Avanzar flujo secuencial
        if (r.workflow === 'sequential' && !allSigned) {
          const nextPending = updatedSigners
            .filter(s => s.status === 'pending')
            .sort((a, b) => a.order - b.order)[0];
          
          if (nextPending && r.sequentialConfig?.notifyNextSigner) {
            console.log(`[SECUENCIAL] Notificando al siguiente firmante: ${nextPending.email}`);
            // En producción: enviar email/SMS
          }
        }
        
        return {
          ...r,
          signers: updatedSigners,
          signatures: updatedSignatures,
          status: allSigned ? 'completed' : 'in_progress',
          completedAt: allSigned ? newSignature.signedAt : undefined,
        };
      }));

      return newSignature;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [permissions, requests, userEmail]);

  /**
   * Cancelar una solicitud de firma
   */
  const cancelRequest = useCallback(async (requestId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) {
        throw new Error('Solicitud no encontrada');
      }

      if (request.createdBy !== role && !permissions.canDeleteRequests) {
        throw new Error('No tienes permisos para cancelar esta solicitud');
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      setRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: 'cancelled' } : r
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [requests, role, permissions]);

  /**
   * Eliminar una solicitud de firma
   */
  const deleteRequest = useCallback(async (requestId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!permissions.canDeleteRequests) {
        throw new Error('No tienes permisos para eliminar solicitudes');
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [permissions]);

  /**
   * Enviar recordatorio a firmantes
   */
  const sendReminder = useCallback(async (requestId: string, signerId?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) {
        throw new Error('Solicitud no encontrada');
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Recordatorio enviado para solicitud ${requestId}${signerId ? ` al firmante ${signerId}` : ''}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [requests]);

  // ============================================
  // CONSULTAS
  // ============================================

  const getRequestById = useCallback((id: string): SignatureRequest | undefined => {
    return requests.find(r => r.id === id);
  }, [requests]);

  const getRequestsByDocument = useCallback((documentId: string): SignatureRequest[] => {
    return requests.filter(r => r.documentId === documentId);
  }, [requests]);

  const getPendingForCurrentUser = useCallback((): SignatureRequest[] => {
    if (!userEmail) return [];
    return requests.filter(r => 
      r.signers.some(s => s.email === userEmail && s.status === 'pending')
    );
  }, [requests, userEmail]);

  const getSignatureFields = useCallback((documentId: string): SignatureField[] => {
    return mockSignatureFields[documentId] || [];
  }, []);

  // ============================================
  // UTILIDADES
  // ============================================

  /**
   * Verificar si el usuario actual puede firmar una solicitud
   */
  const canSign = useCallback((request: SignatureRequest): boolean => {
    if (!permissions.canSign) return false;
    if (!userEmail) return false;

    const signer = request.signers.find(s => s.email === userEmail);
    if (!signer) return false;
    if (signer.status !== 'pending') return false;

    // En flujo secuencial, verificar si es el turno del firmante
    if (request.workflow === 'sequential') {
      const pendingSigners = request.signers.filter(s => s.status === 'pending');
      const nextSigner = pendingSigners.sort((a, b) => a.order - b.order)[0];
      if (nextSigner?.id !== signer.id) return false;
    }

    return true;
  }, [permissions, userEmail]);

  /**
   * Verificar si una solicitud está completamente firmada
   */
  const isRequestCompleted = useCallback((request: SignatureRequest): boolean => {
    return request.signers.every(s => s.status === 'signed');
  }, []);

  /**
   * Obtener el siguiente firmante en cola (para flujo secuencial)
   */
  const getNextSigner = useCallback((request: SignatureRequest): Signer | undefined => {
    if (request.workflow === 'sequential') {
      return request.signers
        .filter(s => s.status === 'pending')
        .sort((a, b) => a.order - b.order)[0];
    }
    // En paralelo, cualquier pendiente
    return request.signers.find(s => s.status === 'pending');
  }, []);

  /**
   * Obtener el firmante actual (para el usuario logueado)
   */
  const getCurrentSigner = useCallback((request: SignatureRequest): Signer | undefined => {
    if (!userEmail) return undefined;
    return request.signers.find(s => s.email === userEmail);
  }, [userEmail]);

  /**
   * Avanzar el flujo de firma secuencial manualmente
   */
  const advanceSequentialWorkflow = useCallback(async (requestId: string): Promise<void> => {
    const request = requests.find(r => r.id === requestId);
    if (!request) throw new Error('Solicitud no encontrada');
    if (request.workflow !== 'sequential') throw new Error('No es un flujo secuencial');

    const nextSigner = getNextSigner(request);
    if (nextSigner) {
      console.log(`[SECUENCIAL] Avanzando al siguiente firmante: ${nextSigner.email}`);
      // En producción: enviar notificación al siguiente firmante
    }
  }, [requests, getNextSigner]);

  /**
   * Validar lista de firmantes
   */
  const validateSigners = useCallback((signers: Partial<Signer>[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (signers.length === 0) {
      errors.push('Debe haber al menos un firmante');
    }

    if (signers.length > permissions.maxSignersPerRequest) {
      errors.push(`Máximo ${permissions.maxSignersPerRequest} firmantes permitidos`);
    }

    signers.forEach((signer, index) => {
      if (!signer.email) {
        errors.push(`Firmante ${index + 1}: Email requerido`);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signer.email)) {
        errors.push(`Firmante ${index + 1}: Email inválido`);
      }

      if (!signer.name) {
        errors.push(`Firmante ${index + 1}: Nombre requerido`);
      }
    });

    // Verificar emails duplicados
    const emails = signers.map(s => s.email);
    const duplicates = emails.filter((item, index) => emails.indexOf(item) !== index);
    if (duplicates.length > 0) {
      errors.push(`Emails duplicados: ${duplicates.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }, [permissions.maxSignersPerRequest]);

  /**
   * Generar sello de tiempo RFC 3161
   */
  const generateTimestamp = useCallback(async (
    documentHash: string, 
    authority?: string
  ): Promise<Timestamp> => {
    // Simulación de generación de sello de tiempo
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const now = new Date();
    const timestamp: Timestamp = {
      id: `ts-${Date.now()}`,
      authority: authority || 'AC TSA',
      timestamp: now.toISOString(),
      serialNumber: `SN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      hashAlgorithm: 'SHA-256',
      hashedMessage: documentHash,
      token: `tst-${Buffer.from(documentHash).toString('base64')}-${Date.now()}`,
      accuracy: 1000, // 1 segundo de precisión
      ordering: true,
    };
    
    return timestamp;
  }, []);

  /**
   * Verificar validez de un sello de tiempo
   */
  const verifyTimestamp = useCallback(async (timestamp: Timestamp): Promise<boolean> => {
    // Simulación de verificación
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Verificar que el token no esté vacío
    if (!timestamp.token || !timestamp.hashedMessage) {
      return false;
    }
    
    // Verificar que no haya expirado (sellos de tiempo no expiran técnicamente,
    // pero verificamos que el certificado de la TSA sea válido)
    return true;
  }, []);

  return {
    requests,
    currentRequest,
    isLoading,
    error,
    permissions,
    config,
    createRequest,
    signDocument,
    cancelRequest,
    deleteRequest,
    sendReminder,
    getRequestById,
    getRequestsByDocument,
    getPendingForCurrentUser,
    getSignatureFields,
    canSign,
    isRequestCompleted,
    getNextSigner,
    getCurrentSigner,
    advanceSequentialWorkflow,
    validateSigners,
    generateTimestamp,
    verifyTimestamp,
  };
}

export default useSignature;
