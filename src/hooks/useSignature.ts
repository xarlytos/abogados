// ============================================
// HOOK PARA GESTIÓN DE FIRMA ELECTRÓNICA
// ============================================

import { useState, useCallback, useMemo } from 'react';
import type { 
  SignatureRequest, 
  SignedDocument, 
  Signer, 
  SignatureType, 
  SignatureWorkflow,
  SignaturePermissions,
  SignatureField,
  SignatureConfig,
  Signature
} from '@/types/signature';
import { SIGNATURE_PERMISSIONS, DEFAULT_SIGNATURE_CONFIG } from '@/types/signature';
import type { UserRole } from '@/types/roles';
import { 
  mockSignatureRequests, 
  mockSignedDocuments,
  mockSignatureFields,
  mockSignatureConfigs 
} from '@/data/signatureData';

// ============================================
// HOOK PRINCIPAL
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
  
  // Utilidades
  canSign: (request: SignatureRequest) => boolean;
  isRequestCompleted: (request: SignatureRequest) => boolean;
  getNextSigner: (request: SignatureRequest) => Signer | undefined;
  validateSigners: (signers: Partial<Signer>[]) => { valid: boolean; errors: string[] };
}

export interface CreateSignatureRequestData {
  documentId: string;
  documentName: string;
  documentUrl?: string;
  signers: Partial<Signer>[];
  signatureType: SignatureType;
  workflow: SignatureWorkflow;
  message?: string;
  expiresAt?: string;
  autoReminders?: boolean;
}

export interface SignDocumentData {
  type: SignatureType;
  signatureImage?: string; // Base64 para firma biométrica/simple
  certificateData?: string; // Datos del certificado
  biometricData?: {
    pressurePoints: number;
    speed: number;
    acceleration: number;
    deviceType: string;
  };
  ipAddress?: string;
  userAgent?: string;
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
   * Crear una nueva solicitud de firma
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

      // Crear objeto de solicitud
      const newRequest: SignatureRequest = {
        id: `sig-req-${Date.now()}`,
        documentId: data.documentId,
        documentName: data.documentName,
        documentUrl: data.documentUrl,
        documentType: 'application/pdf',
        status: 'pending',
        signatureType: data.signatureType,
        workflow: data.workflow,
        signers: data.signers.map((s, index) => ({
          id: `signer-${Date.now()}-${index}`,
          email: s.email || '',
          name: s.name || '',
          role: s.role || 'otro',
          order: s.order || index + 1,
          status: 'pending',
        })),
        signatures: [],
        message: data.message,
        createdBy: role,
        createdAt: new Date().toISOString(),
        expiresAt: data.expiresAt,
        reminderDays: config.reminderDays,
        autoReminders: data.autoReminders ?? true,
      };

      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(prev => [newRequest, ...prev]);
      setCurrentRequest(newRequest);
      
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
   * Firmar un documento
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

      // Crear objeto de firma
      const newSignature: Signature = {
        id: `sig-${Date.now()}`,
        signerId: 'current-user', // En producción, ID del usuario actual
        signerName: 'Usuario Actual',
        signerEmail: userEmail || 'usuario@bufete.com',
        type: signatureData.type,
        signedAt: new Date().toISOString(),
        ipAddress: signatureData.ipAddress,
        userAgent: signatureData.userAgent,
        signatureImage: signatureData.signatureImage,
        biometricData: signatureData.biometricData,
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

      // Solo puede cancelar quien la creó o tiene permisos
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

      // Simular envío
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
   * Obtener el siguiente firmante en cola
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
    validateSigners,
  };
}

export default useSignature;
