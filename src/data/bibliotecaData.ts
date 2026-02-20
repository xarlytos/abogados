import { 
  UserCircle, Scroll, CreditCard, FileSignature, Building, Award,
  ShieldCheck, ShieldAlert, HelpCircle, FileText
} from 'lucide-react';

// ============================================
// TIPOS
// ============================================

export interface VerificationHistoryItem {
  id: string;
  date: string;
  user: string;
  action: 'upload' | 'verify' | 'reject' | 'analyze' | 'export' | 'attach';
  result?: string;
  notes?: string;
  confidence?: number;
  expedienteId?: string;
  expedienteTitle?: string;
}

export interface FileItem {
  id: number;
  name: string;
  type: string;
  size: string;
  category: string;
  subcategory: string;
  status: 'verified' | 'fake' | 'doubt';
  confidence: number;
  modified: string;
  author: string;
  tags: string[];
  notes: string;
  verificationHistory: VerificationHistoryItem[];
  linkedExpedientes?: { id: string; title: string; date: string }[];
}

// ============================================
// ESTRUCTURA DE CARPETAS
// ============================================

export const folderStructure = [
  {
    id: 'dni',
    name: 'Documentos de Identidad',
    icon: UserCircle,
    color: 'blue',
    count: 156,
    subfolders: [
      { id: 'dni-real', name: '✓ Documentos Verificados', status: 'verified', count: 89, color: 'emerald' },
      { id: 'dni-fake', name: '✗ Documentos Falsificados', status: 'fake', count: 42, color: 'red' },
      { id: 'dni-doubt', name: '? Requieren Análisis', status: 'doubt', count: 25, color: 'amber' },
    ]
  },
  {
    id: 'passport',
    name: 'Pasaportes',
    icon: Scroll,
    color: 'purple',
    count: 78,
    subfolders: [
      { id: 'pass-real', name: '✓ Pasaportes Válidos', status: 'verified', count: 56, color: 'emerald' },
      { id: 'pass-fake', name: '✗ Pasaportes Falsos', status: 'fake', count: 12, color: 'red' },
      { id: 'pass-doubt', name: '? En Revisión', status: 'doubt', count: 10, color: 'amber' },
    ]
  },
  {
    id: 'license',
    name: 'Permisos de Conducir',
    icon: CreditCard,
    color: 'cyan',
    count: 134,
    subfolders: [
      { id: 'lic-real', name: '✓ Carnets Válidos', status: 'verified', count: 98, color: 'emerald' },
      { id: 'lic-fake', name: '✗ Carnets Falsificados', status: 'fake', count: 24, color: 'red' },
      { id: 'lic-doubt', name: '? Verificación Pendiente', status: 'doubt', count: 12, color: 'amber' },
    ]
  },
  {
    id: 'contracts',
    name: 'Contratos y Documentos',
    icon: FileSignature,
    color: 'amber',
    count: 423,
    subfolders: [
      { id: 'cont-real', name: '✓ Documentos Auténticos', status: 'verified', count: 312, color: 'emerald' },
      { id: 'cont-fake', name: '✗ Documentos Fraudulentos', status: 'fake', count: 67, color: 'red' },
      { id: 'cont-doubt', name: '? Análisis Forense Pendiente', status: 'doubt', count: 44, color: 'amber' },
    ]
  },
  {
    id: 'company',
    name: 'Documentos Empresariales',
    icon: Building,
    color: 'rose',
    count: 89,
    subfolders: [
      { id: 'comp-real', name: '✓ Documentos Verificados', status: 'verified', count: 67, color: 'emerald' },
      { id: 'comp-fake', name: '✗ Documentos Sospechosos', status: 'fake', count: 14, color: 'red' },
      { id: 'comp-doubt', name: '? Auditoría en Curso', status: 'doubt', count: 8, color: 'amber' },
    ]
  },
  {
    id: 'certificates',
    name: 'Títulos y Certificados',
    icon: Award,
    color: 'emerald',
    count: 203,
    subfolders: [
      { id: 'cert-real', name: '✓ Certificados Válidos', status: 'verified', count: 156, color: 'emerald' },
      { id: 'cert-fake', name: '✗ Certificados Falsos', status: 'fake', count: 34, color: 'red' },
      { id: 'cert-doubt', name: '? Validación Pendiente', status: 'doubt', count: 13, color: 'amber' },
    ]
  },
];

// ============================================
// DATOS DE ARCHIVOS CON HISTORIAL DE VERIFICACIÓN
// ============================================

const generateVerificationHistory = (fileId: number, status: string, confidence: number): VerificationHistoryItem[] => {
  const baseDate = new Date('2026-01-15');
  const history: VerificationHistoryItem[] = [
    {
      id: `vh-${fileId}-1`,
      date: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
      user: 'Sistema',
      action: 'upload',
      notes: 'Documento cargado al sistema para análisis'
    },
    {
      id: `vh-${fileId}-2`,
      date: new Date(baseDate.getTime() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
      user: 'Ana Martínez',
      action: status === 'verified' ? 'verify' : status === 'fake' ? 'reject' : 'analyze',
      result: status === 'verified' ? 'Documento verificado como auténtico' : 
              status === 'fake' ? 'Documento identificado como falsificación' : 'Requiere análisis adicional',
      notes: status === 'verified' ? 'Todos los elementos de seguridad verificados correctamente' : 
             status === 'fake' ? 'Se detectaron anomalías en elementos de seguridad' : 'Inconcluso - requiere revisión manual',
      confidence
    }
  ];

  // Agregar algunos items adicionales para variedad
  if (status === 'verified') {
    history.push({
      id: `vh-${fileId}-3`,
      date: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
      user: 'Carlos Ruiz',
      action: 'verify',
      result: 'Verificación secundaria completada',
      notes: 'Validación cruzada con bases de datos oficiales',
      confidence
    });
  }

  return history;
};

export const allFiles: FileItem[] = [
  { 
    id: 1, 
    name: 'DNI_Juan_Martinez_Garcia_12345678A.pdf', 
    type: 'pdf', 
    size: '2.4 MB', 
    category: 'dni', 
    subcategory: 'dni-real', 
    status: 'verified', 
    confidence: 98, 
    modified: '15 Ene 2026', 
    author: 'Sistema', 
    tags: ['chip', 'holograma', 'uv'], 
    notes: 'Documento verificado mediante lectura de chip NFC y holograma',
    verificationHistory: generateVerificationHistory(1, 'verified', 98),
    linkedExpedientes: [{ id: 'EXP-2024-001', title: 'Reclamación deuda Banco Santander', date: '10 Ene 2026' }]
  },
  { 
    id: 2, 
    name: 'DNI_Maria_Lopez_Santos_23456789B.pdf', 
    type: 'pdf', 
    size: '2.1 MB', 
    category: 'dni', 
    subcategory: 'dni-real', 
    status: 'verified', 
    confidence: 99, 
    modified: '14 Ene 2026', 
    author: 'Ana Martínez', 
    tags: ['chip', 'holograma', 'microtexto'], 
    notes: 'Verificación completa. Todos los elementos de seguridad presentes',
    verificationHistory: generateVerificationHistory(2, 'verified', 99),
    linkedExpedientes: []
  },
  { 
    id: 3, 
    name: 'DNI_Carlos_Ruiz_Fernandez_34567890C.pdf', 
    type: 'pdf', 
    size: '2.3 MB', 
    category: 'dni', 
    subcategory: 'dni-real', 
    status: 'verified', 
    confidence: 97, 
    modified: '13 Ene 2026', 
    author: 'Sistema', 
    tags: ['chip', 'holograma'], 
    notes: 'Documento auténtico. Validado en DGP',
    verificationHistory: generateVerificationHistory(3, 'verified', 97),
    linkedExpedientes: [{ id: 'EXP-2024-003', title: 'Despido improcedente TechCorp', date: '12 Ene 2026' }]
  },
  { 
    id: 4, 
    name: 'DNI_Pedro_Sanchez_FAKE_45678901D.pdf', 
    type: 'pdf', 
    size: '1.8 MB', 
    category: 'dni', 
    subcategory: 'dni-fake', 
    status: 'fake', 
    confidence: 95, 
    modified: '12 Ene 2026', 
    author: 'Ana Martínez', 
    tags: ['sin_chip', 'holograma_falso', 'tipografia'], 
    notes: 'FALSO DETECTADO: Holograma de baja calidad, sin chip NFC, tipografía incorrecta',
    verificationHistory: [
      ...generateVerificationHistory(4, 'fake', 95),
      {
        id: 'vh-4-export',
        date: '12 Ene 2026',
        user: 'Ana Martínez',
        action: 'export',
        notes: 'Informe pericial de falsificación exportado en PDF'
      }
    ],
    linkedExpedientes: [{ id: 'EXP-2024-006', title: 'Delito fiscal Hacienda', date: '11 Ene 2026' }]
  },
  { 
    id: 5, 
    name: 'DNI_Laura_Torres_FALSE_56789012E.pdf', 
    type: 'pdf', 
    size: '2.0 MB', 
    category: 'dni', 
    subcategory: 'dni-fake', 
    status: 'fake', 
    confidence: 92, 
    modified: '11 Ene 2026', 
    author: 'Carlos Ruiz', 
    tags: ['foto_manipulada', 'numero_invalido'], 
    notes: 'Número de soporte no existe en base de datos. Foto manipulada digitalmente',
    verificationHistory: generateVerificationHistory(5, 'fake', 92),
    linkedExpedientes: []
  },
  { 
    id: 6, 
    name: 'DNI_Anonimo_Sospechoso_67890123F.pdf', 
    type: 'pdf', 
    size: '1.9 MB', 
    category: 'dni', 
    subcategory: 'dni-fake', 
    status: 'fake', 
    confidence: 88, 
    modified: '10 Ene 2026', 
    author: 'Sistema', 
    tags: ['mala_calidad', 'sin_seguridad'], 
    notes: 'Documento de impresión casera. Carece de todos los elementos de seguridad',
    verificationHistory: generateVerificationHistory(6, 'fake', 88),
    linkedExpedientes: []
  },
  { 
    id: 7, 
    name: 'DNI_Miguel_Angel_Perez_78901234G.pdf', 
    type: 'pdf', 
    size: '2.2 MB', 
    category: 'dni', 
    subcategory: 'dni-doubt', 
    status: 'doubt', 
    confidence: 65, 
    modified: '16 Ene 2026', 
    author: 'Laura Soto', 
    tags: ['deteriorado', 'chip_dañado'], 
    notes: 'Documento muy deteriorado. Chip no legible. Requiere verificación presencial',
    verificationHistory: generateVerificationHistory(7, 'doubt', 65),
    linkedExpedientes: [{ id: 'EXP-2024-010', title: 'Accidente de tráfico', date: '15 Ene 2026' }]
  },
  { 
    id: 8, 
    name: 'DNI_Carmen_Diaz_Ramos_89012345H.pdf', 
    type: 'pdf', 
    size: '2.0 MB', 
    category: 'dni', 
    subcategory: 'dni-doubt', 
    status: 'doubt', 
    confidence: 72, 
    modified: '15 Ene 2026', 
    author: 'Pedro Gómez', 
    tags: ['holograma_dudoso'], 
    notes: 'Holograma presenta anomalías. Posible falsificación o desgaste severo',
    verificationHistory: generateVerificationHistory(8, 'doubt', 72),
    linkedExpedientes: []
  },
  { 
    id: 9, 
    name: 'DNI_Roberto_Nunez_Silva_90123456I.pdf', 
    type: 'pdf', 
    size: '2.1 MB', 
    category: 'dni', 
    subcategory: 'dni-doubt', 
    status: 'doubt', 
    confidence: 58, 
    modified: '14 Ene 2026', 
    author: 'Sistema', 
    tags: ['revision_manual'], 
    notes: 'Inconsistencias en microtexto. Pendiente de análisis forense avanzado',
    verificationHistory: generateVerificationHistory(9, 'doubt', 58),
    linkedExpedientes: []
  },
  { 
    id: 10, 
    name: 'Pasaporte_Elena_Vargas_AA123456.pdf', 
    type: 'pdf', 
    size: '4.5 MB', 
    category: 'passport', 
    subcategory: 'pass-real', 
    status: 'verified', 
    confidence: 99, 
    modified: '10 Ene 2026', 
    author: 'Sistema', 
    tags: ['biometrico', 'chip', 'mrz_valido'], 
    notes: 'Pasaporte biométrico válido. MRZ verificado. Chip funcional',
    verificationHistory: generateVerificationHistory(10, 'verified', 99),
    linkedExpedientes: [{ id: 'EXP-2024-002', title: 'Divorcio contencioso', date: '09 Ene 2026' }]
  },
  { 
    id: 11, 
    name: 'Pasaporte_Falso_BB654321.pdf', 
    type: 'pdf', 
    size: '3.8 MB', 
    category: 'passport', 
    subcategory: 'pass-fake', 
    status: 'fake', 
    confidence: 94, 
    modified: '08 Ene 2026', 
    author: 'Ana Martínez', 
    tags: ['mrz_invalido', 'foto_sustituida'], 
    notes: 'MRZ no coincide con datos visuales. Foto sustituida. Páginas falsas',
    verificationHistory: generateVerificationHistory(11, 'fake', 94),
    linkedExpedientes: [{ id: 'EXP-2024-006', title: 'Delito fiscal Hacienda', date: '07 Ene 2026' }]
  },
  { 
    id: 12, 
    name: 'Pasaporte_Dudoso_CC789012.pdf', 
    type: 'pdf', 
    size: '4.2 MB', 
    category: 'passport', 
    subcategory: 'pass-doubt', 
    status: 'doubt', 
    confidence: 70, 
    modified: '05 Ene 2026', 
    author: 'Carlos Ruiz', 
    tags: ['sellos_sospechosos'], 
    notes: 'Sellos de entrada/salida presentan inconsistencias. Requiere verificación interpol',
    verificationHistory: generateVerificationHistory(12, 'doubt', 70),
    linkedExpedientes: []
  },
  { 
    id: 13, 
    name: 'Carnet_Antonio_Moreno_B.pdf', 
    type: 'pdf', 
    size: '1.5 MB', 
    category: 'license', 
    subcategory: 'lic-real', 
    status: 'verified', 
    confidence: 98, 
    modified: '12 Ene 2026', 
    author: 'Sistema', 
    tags: ['dgt_valida', 'qr_valido'], 
    notes: 'Carnet válido. Código QR verificado en DGT',
    verificationHistory: generateVerificationHistory(13, 'verified', 98),
    linkedExpedientes: [{ id: 'EXP-2024-010', title: 'Accidente de tráfico', date: '11 Ene 2026' }]
  },
  { 
    id: 14, 
    name: 'Carnet_Falso_Sofia_Ramos_C.pdf', 
    type: 'pdf', 
    size: '1.2 MB', 
    category: 'license', 
    subcategory: 'lic-fake', 
    status: 'fake', 
    confidence: 91, 
    modified: '09 Ene 2026', 
    author: 'Laura Soto', 
    tags: ['qr_falso', 'categoria_inexistente'], 
    notes: 'QR no direcciona a DGT. Categoría C inexistente para titular',
    verificationHistory: generateVerificationHistory(14, 'fake', 91),
    linkedExpedientes: []
  },
  { 
    id: 15, 
    name: 'Carnet_Dudoso_Manuel_Ortega_A.pdf', 
    type: 'pdf', 
    size: '1.4 MB', 
    category: 'license', 
    subcategory: 'lic-doubt', 
    status: 'doubt', 
    confidence: 68, 
    modified: '07 Ene 2026', 
    author: 'Pedro Gómez', 
    tags: ['fecha_dudosa'], 
    notes: 'Fecha de expedición inconsistente con normativa vigente',
    verificationHistory: generateVerificationHistory(15, 'doubt', 68),
    linkedExpedientes: []
  },
  { 
    id: 16, 
    name: 'Contrato_Compraventa_Autentico.pdf', 
    type: 'pdf', 
    size: '3.2 MB', 
    category: 'contracts', 
    subcategory: 'cont-real', 
    status: 'verified', 
    confidence: 100, 
    modified: '11 Ene 2026', 
    author: 'Notaría', 
    tags: ['firma_notarial', 'registro'], 
    notes: 'Escritura pública auténtica. Firmas notariales verificadas',
    verificationHistory: generateVerificationHistory(16, 'verified', 100),
    linkedExpedientes: [{ id: 'EXP-2024-001', title: 'Reclamación deuda Banco Santander', date: '10 Ene 2026' }]
  },
  { 
    id: 17, 
    name: 'Contrato_Falsificado_Firma.pdf', 
    type: 'pdf', 
    size: '2.8 MB', 
    category: 'contracts', 
    subcategory: 'cont-fake', 
    status: 'fake', 
    confidence: 89, 
    modified: '06 Ene 2026', 
    author: 'Ana Martínez', 
    tags: ['firma_falsa', 'sello_copiado'], 
    notes: 'Firma fraudulenta detectada mediante análisis caligráfico. Sello escaneado',
    verificationHistory: generateVerificationHistory(17, 'fake', 89),
    linkedExpedientes: [{ id: 'EXP-2024-008', title: 'Reclamación deuda comercial', date: '05 Ene 2026' }]
  },
  { 
    id: 18, 
    name: 'Contrato_Pendiente_Verificacion.pdf', 
    type: 'pdf', 
    size: '3.0 MB', 
    category: 'contracts', 
    subcategory: 'cont-doubt', 
    status: 'doubt', 
    confidence: 75, 
    modified: '04 Ene 2026', 
    author: 'Carlos Ruiz', 
    tags: ['anomalia_pagina'], 
    notes: 'Anomalías en numeración de páginas. Posible manipulación',
    verificationHistory: generateVerificationHistory(18, 'doubt', 75),
    linkedExpedientes: []
  },
  { 
    id: 19, 
    name: 'Escritura_Sociedad_TechCorp.pdf', 
    type: 'pdf', 
    size: '5.6 MB', 
    category: 'company', 
    subcategory: 'comp-real', 
    status: 'verified', 
    confidence: 100, 
    modified: '13 Ene 2026', 
    author: 'Registro Mercantil', 
    tags: ['registro_mercantil', 'inscripcion'], 
    notes: 'Escritura inscrita en Registro Mercantil. Número de protocolo verificado',
    verificationHistory: generateVerificationHistory(19, 'verified', 100),
    linkedExpedientes: [{ id: 'EXP-2024-005', title: 'Constitución SL Innovatech', date: '12 Ene 2026' }]
  },
  { 
    id: 20, 
    name: 'Documento_Sociedad_Falsa_Innova.pdf', 
    type: 'pdf', 
    size: '4.2 MB', 
    category: 'company', 
    subcategory: 'comp-fake', 
    status: 'fake', 
    confidence: 87, 
    modified: '03 Ene 2026', 
    author: 'Sistema', 
    tags: ['sociedad_inexistente', 'cif_falso'], 
    notes: 'CIF no corresponde a sociedad real. Documentación apócrifa',
    verificationHistory: generateVerificationHistory(20, 'fake', 87),
    linkedExpedientes: [{ id: 'EXP-2024-006', title: 'Delito fiscal Hacienda', date: '02 Ene 2026' }]
  },
  { 
    id: 21, 
    name: 'Modificaciones_Estatutos_Dudosas.pdf', 
    type: 'pdf', 
    size: '4.8 MB', 
    category: 'company', 
    subcategory: 'comp-doubt', 
    status: 'doubt', 
    confidence: 62, 
    modified: '01 Ene 2026', 
    author: 'Laura Soto', 
    tags: ['fechas_inconsistentes'], 
    notes: 'Inconsistencias en fechas de acuerdos sociales. Requiere auditoría',
    verificationHistory: generateVerificationHistory(21, 'doubt', 62),
    linkedExpedientes: []
  },
  { 
    id: 22, 
    name: 'Titulo_Universitario_Autentico_UCM.pdf', 
    type: 'pdf', 
    size: '2.1 MB', 
    category: 'certificates', 
    subcategory: 'cert-real', 
    status: 'verified', 
    confidence: 99, 
    modified: '14 Ene 2026', 
    author: 'Universidad', 
    tags: ['qr_uni', 'sello_electronico'], 
    notes: 'Título oficial verificado. QR de la UCM válido. Sello electrónico presente',
    verificationHistory: generateVerificationHistory(22, 'verified', 99),
    linkedExpedientes: [{ id: 'EXP-2024-003', title: 'Despido improcedente TechCorp', date: '13 Ene 2026' }]
  },
  { 
    id: 23, 
    name: 'Master_Falso_Harvard_Diploma.pdf', 
    type: 'pdf', 
    size: '1.9 MB', 
    category: 'certificates', 
    subcategory: 'cert-fake', 
    status: 'fake', 
    confidence: 96, 
    modified: '02 Ene 2026', 
    author: 'Ana Martínez', 
    tags: ['diploma_mill', 'registro_inexistente'], 
    notes: 'Diploma de diploma mill. Harvard no tiene registro del alumno',
    verificationHistory: generateVerificationHistory(23, 'fake', 96),
    linkedExpedientes: []
  },
  { 
    id: 24, 
    name: 'Certificado_Idiomas_Cambridge.pdf', 
    type: 'pdf', 
    size: '1.3 MB', 
    category: 'certificates', 
    subcategory: 'cert-doubt', 
    status: 'doubt', 
    confidence: 71, 
    modified: '30 Dic 2025', 
    author: 'Pedro Gómez', 
    tags: ['formato_antiguo'], 
    notes: 'Formato antiguo, posible válido pero requiere verificación con Cambridge',
    verificationHistory: generateVerificationHistory(24, 'doubt', 71),
    linkedExpedientes: []
  },
];

// ============================================
// FUNCIONES AUXILIARES
// ============================================

export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'verified':
      return { 
        icon: ShieldCheck, 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-500/20', 
        border: 'border-emerald-500/30',
        label: 'Verificado',
        badge: 'bg-emerald-500'
      };
    case 'fake':
      return { 
        icon: ShieldAlert, 
        color: 'text-red-400', 
        bg: 'bg-red-500/20', 
        border: 'border-red-500/30',
        label: 'Falsificado',
        badge: 'bg-red-500'
      };
    case 'doubt':
      return { 
        icon: HelpCircle, 
        color: 'text-amber-400', 
        bg: 'bg-amber-500/20', 
        border: 'border-amber-500/30',
        label: 'En Análisis',
        badge: 'bg-amber-500'
      };
    default:
      return { 
        icon: FileText, 
        color: 'text-slate-400', 
        bg: 'bg-slate-500/20', 
        border: 'border-slate-500/30',
        label: 'Desconocido',
        badge: 'bg-slate-500'
      };
  }
};

export const getFileStats = () => {
  return {
    total: allFiles.length,
    verified: allFiles.filter(f => f.status === 'verified').length,
    fake: allFiles.filter(f => f.status === 'fake').length,
    doubt: allFiles.filter(f => f.status === 'doubt').length,
  };
};

// ============================================
// FUNCIÓN PARA GENERAR INFORME PERICIAL PDF
// ============================================

export const generateForensicReport = (file: FileItem): string => {
  const statusConfig = getStatusConfig(file.status);
  const reportDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe Pericial - ${file.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #1e293b;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1e293b;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header .subtitle {
      color: #64748b;
      font-size: 16px;
    }
    .badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 14px;
      margin: 10px 0;
    }
    .badge.verified { background: #d1fae5; color: #065f46; }
    .badge.fake { background: #fee2e2; color: #991b1b; }
    .badge.doubt { background: #fef3c7; color: #92400e; }
    .section {
      margin: 25px 0;
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
    }
    .section h2 {
      color: #1e293b;
      font-size: 18px;
      margin-bottom: 15px;
      border-left: 4px solid #f59e0b;
      padding-left: 10px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .info-item {
      padding: 10px;
      background: white;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    .info-item .label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-item .value {
      font-size: 14px;
      color: #1e293b;
      font-weight: 600;
      margin-top: 5px;
    }
    .confidence-bar {
      width: 100%;
      height: 20px;
      background: #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
      margin: 10px 0;
    }
    .confidence-fill {
      height: 100%;
      border-radius: 10px;
      transition: width 0.3s;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    .tag {
      padding: 4px 12px;
      background: #e2e8f0;
      border-radius: 12px;
      font-size: 12px;
      color: #475569;
    }
    .history-item {
      padding: 12px;
      margin: 10px 0;
      background: white;
      border-radius: 6px;
      border-left: 3px solid #f59e0b;
    }
    .history-item .date {
      font-size: 12px;
      color: #64748b;
    }
    .history-item .action {
      font-weight: 600;
      color: #1e293b;
      margin: 5px 0;
    }
    .history-item .notes {
      font-size: 13px;
      color: #475569;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
    }
    .signature-section {
      margin-top: 40px;
      padding: 30px;
      border: 2px dashed #cbd5e1;
      border-radius: 8px;
      text-align: center;
    }
    .signature-line {
      width: 300px;
      border-bottom: 1px solid #334155;
      margin: 60px auto 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📋 INFORME PERICIAL DE DOCUMENTO</h1>
    <p class="subtitle">Biblioteca Forense - Bufete de Abogados</p>
    <p style="color: #94a3b8; font-size: 12px; margin-top: 10px;">Generado el ${reportDate}</p>
  </div>

  <div style="text-align: center;">
    <span class="badge ${file.status}">
      ${statusConfig.label.toUpperCase()} - ${file.confidence}% CONFIANZA
    </span>
  </div>

  <div class="section">
    <h2>📄 Información del Documento</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="label">Nombre del archivo</div>
        <div class="value">${file.name}</div>
      </div>
      <div class="info-item">
        <div class="label">Tipo de documento</div>
        <div class="value">${file.type.toUpperCase()}</div>
      </div>
      <div class="info-item">
        <div class="label">Tamaño</div>
        <div class="value">${file.size}</div>
      </div>
      <div class="info-item">
        <div class="label">Fecha de modificación</div>
        <div class="value">${file.modified}</div>
      </div>
      <div class="info-item">
        <div class="label">Autor/Verificador</div>
        <div class="value">${file.author}</div>
      </div>
      <div class="info-item">
        <div class="label">Categoría</div>
        <div class="value">${file.category}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>🔍 Análisis Forense</h2>
    <p style="margin-bottom: 15px;"><strong>Nivel de confianza:</strong> ${file.confidence}%</p>
    <div class="confidence-bar">
      <div class="confidence-fill" style="width: ${file.confidence}%; background: ${file.confidence >= 90 ? '#10b981' : file.confidence >= 70 ? '#f59e0b' : '#ef4444'};"></div>
    </div>
    <p style="margin-top: 15px;"><strong>Observaciones:</strong></p>
    <p style="background: white; padding: 15px; border-radius: 6px; margin-top: 10px;">${file.notes}</p>
    
    <p style="margin-top: 15px;"><strong>Elementos de seguridad analizados:</strong></p>
    <div class="tags">
      ${file.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
  </div>

  <div class="section">
    <h2>📜 Historial de Verificaciones</h2>
    ${file.verificationHistory.map(vh => `
      <div class="history-item">
        <div class="date">📅 ${vh.date} - Por: ${vh.user}</div>
        <div class="action">${getActionLabel(vh.action)}${vh.result ? `: ${vh.result}` : ''}</div>
        ${vh.notes ? `<div class="notes">${vh.notes}</div>` : ''}
        ${vh.confidence ? `<div style="margin-top: 8px; font-size: 12px; color: #059669;">Confianza: ${vh.confidence}%</div>` : ''}
      </div>
    `).join('')}
  </div>

  ${file.linkedExpedientes && file.linkedExpedientes.length > 0 ? `
  <div class="section">
    <h2>📁 Expedientes Vinculados</h2>
    ${file.linkedExpedientes.map(exp => `
      <div class="history-item" style="border-left-color: #3b82f6;">
        <div class="action">${exp.id}: ${exp.title}</div>
        <div class="date">Vinculado el ${exp.date}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="signature-section">
    <p style="color: #64748b; margin-bottom: 20px;">Firma del Perito/Responsable de Verificación</p>
    <div class="signature-line"></div>
    <p style="font-size: 12px; color: #94a3b8;">Nombre y cargo del verificador</p>
  </div>

  <div class="footer">
    <p>Este informe ha sido generado automáticamente por el sistema de Biblioteca Forense.</p>
    <p>Bufete de Abogados - Documento generado el ${reportDate}</p>
    <p style="margin-top: 10px; font-size: 10px;">El presente informe tiene carácter técnico y está sujeto a revisión profesional.</p>
  </div>
</body>
</html>
  `;

  return htmlContent;
};

const getActionLabel = (action: string): string => {
  const labels: Record<string, string> = {
    upload: '📤 Carga de documento',
    verify: '✅ Verificación exitosa',
    reject: '❌ Documento rechazado',
    analyze: '🔍 Análisis en curso',
    export: '📄 Exportación de informe',
    attach: '📎 Vinculación a expediente'
  };
  return labels[action] || action;
};

// ============================================
// EXPEDIENTES DISPONIBLES PARA VINCULACIÓN
// ============================================

export const availableExpedientes = [
  { id: 'EXP-2024-001', title: 'Reclamación deuda Banco Santander', client: 'Juan Martínez', type: 'Civil' },
  { id: 'EXP-2024-002', title: 'Divorcio contencioso', client: 'María García', type: 'Familiar' },
  { id: 'EXP-2024-003', title: 'Despido improcedente TechCorp', client: 'Carlos López', type: 'Laboral' },
  { id: 'EXP-2024-004', title: 'Reclamación seguro hogar', client: 'Ana Rodríguez', type: 'Civil' },
  { id: 'EXP-2024-005', title: 'Constitución SL Innovatech', client: 'Pedro Sánchez', type: 'Mercantil' },
  { id: 'EXP-2024-006', title: 'Delito fiscal Hacienda', client: 'Empresa XYZ', type: 'Penal' },
  { id: 'EXP-2024-007', title: 'Herencia y testamentaría', client: 'Familia Ruiz', type: 'Sucesiones' },
  { id: 'EXP-2024-008', title: 'Reclamación deuda comercial', client: 'Constructora ABC', type: 'Mercantil' },
  { id: 'EXP-2024-009', title: 'Modificación de medidas', client: 'Laura Torres', type: 'Familiar' },
  { id: 'EXP-2024-010', title: 'Accidente de tráfico', client: 'Miguel Ángel Pérez', type: 'Civil' },
  { id: 'EXP-2024-011', title: 'Contrato de arrendamiento', client: 'Inmobiliaria Sol', type: 'Civil' },
  { id: 'EXP-2024-012', title: 'Reestructuración de deuda', client: 'PYME Tecnológica SL', type: 'Mercantil' },
];
