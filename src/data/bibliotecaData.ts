import { 
  UserCircle, Scroll, CreditCard, FileSignature, Building, Award,
  ShieldCheck, ShieldAlert, HelpCircle, FileText
} from 'lucide-react';

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

export const allFiles = [
  { id: 1, name: 'DNI_Juan_Martinez_Garcia_12345678A.pdf', type: 'pdf', size: '2.4 MB', category: 'dni', subcategory: 'dni-real', status: 'verified', confidence: 98, modified: '15 Ene 2026', author: 'Sistema', tags: ['chip', 'holograma', 'uv'], notes: 'Documento verificado mediante lectura de chip NFC y holograma' },
  { id: 2, name: 'DNI_Maria_Lopez_Santos_23456789B.pdf', type: 'pdf', size: '2.1 MB', category: 'dni', subcategory: 'dni-real', status: 'verified', confidence: 99, modified: '14 Ene 2026', author: 'Ana Martínez', tags: ['chip', 'holograma', 'microtexto'], notes: 'Verificación completa. Todos los elementos de seguridad presentes' },
  { id: 3, name: 'DNI_Carlos_Ruiz_Fernandez_34567890C.pdf', type: 'pdf', size: '2.3 MB', category: 'dni', subcategory: 'dni-real', status: 'verified', confidence: 97, modified: '13 Ene 2026', author: 'Sistema', tags: ['chip', 'holograma'], notes: 'Documento auténtico. Validado en DGP' },
  { id: 4, name: 'DNI_Pedro_Sanchez_FAKE_45678901D.pdf', type: 'pdf', size: '1.8 MB', category: 'dni', subcategory: 'dni-fake', status: 'fake', confidence: 95, modified: '12 Ene 2026', author: 'Ana Martínez', tags: ['sin_chip', 'holograma_falso', 'tipografia'], notes: 'FALSO DETECTADO: Holograma de baja calidad, sin chip NFC, tipografía incorrecta' },
  { id: 5, name: 'DNI_Laura_Torres_FALSE_56789012E.pdf', type: 'pdf', size: '2.0 MB', category: 'dni', subcategory: 'dni-fake', status: 'fake', confidence: 92, modified: '11 Ene 2026', author: 'Carlos Ruiz', tags: ['foto_manipulada', 'numero_invalido'], notes: 'Número de soporte no existe en base de datos. Foto manipulada digitalmente' },
  { id: 6, name: 'DNI_Anonimo_Sospechoso_67890123F.pdf', type: 'pdf', size: '1.9 MB', category: 'dni', subcategory: 'dni-fake', status: 'fake', confidence: 88, modified: '10 Ene 2026', author: 'Sistema', tags: ['mala_calidad', 'sin_seguridad'], notes: 'Documento de impresión casera. Carece de todos los elementos de seguridad' },
  { id: 7, name: 'DNI_Miguel_Angel_Perez_78901234G.pdf', type: 'pdf', size: '2.2 MB', category: 'dni', subcategory: 'dni-doubt', status: 'doubt', confidence: 65, modified: '16 Ene 2026', author: 'Laura Soto', tags: ['deteriorado', 'chip_dañado'], notes: 'Documento muy deteriorado. Chip no legible. Requiere verificación presencial' },
  { id: 8, name: 'DNI_Carmen_Diaz_Ramos_89012345H.pdf', type: 'pdf', size: '2.0 MB', category: 'dni', subcategory: 'dni-doubt', status: 'doubt', confidence: 72, modified: '15 Ene 2026', author: 'Pedro Gómez', tags: ['holograma_dudoso'], notes: 'Holograma presenta anomalías. Posible falsificación o desgaste severo' },
  { id: 9, name: 'DNI_Roberto_Nunez_Silva_90123456I.pdf', type: 'pdf', size: '2.1 MB', category: 'dni', subcategory: 'dni-doubt', status: 'doubt', confidence: 58, modified: '14 Ene 2026', author: 'Sistema', tags: ['revision_manual'], notes: 'Inconsistencias en microtexto. Pendiente de análisis forense avanzado' },
  { id: 10, name: 'Pasaporte_Elena_Vargas_AA123456.pdf', type: 'pdf', size: '4.5 MB', category: 'passport', subcategory: 'pass-real', status: 'verified', confidence: 99, modified: '10 Ene 2026', author: 'Sistema', tags: ['biometrico', 'chip', 'mrz_valido'], notes: 'Pasaporte biométrico válido. MRZ verificado. Chip funcional' },
  { id: 11, name: 'Pasaporte_Falso_BB654321.pdf', type: 'pdf', size: '3.8 MB', category: 'passport', subcategory: 'pass-fake', status: 'fake', confidence: 94, modified: '08 Ene 2026', author: 'Ana Martínez', tags: ['mrz_invalido', 'foto_sustituida'], notes: 'MRZ no coincide con datos visuales. Foto sustituida. Páginas falsas' },
  { id: 12, name: 'Pasaporte_Dudoso_CC789012.pdf', type: 'pdf', size: '4.2 MB', category: 'passport', subcategory: 'pass-doubt', status: 'doubt', confidence: 70, modified: '05 Ene 2026', author: 'Carlos Ruiz', tags: ['sellos_sospechosos'], notes: 'Sellos de entrada/salida presentan inconsistencias. Requiere verificación interpol' },
  { id: 13, name: 'Carnet_Antonio_Moreno_B.pdf', type: 'pdf', size: '1.5 MB', category: 'license', subcategory: 'lic-real', status: 'verified', confidence: 98, modified: '12 Ene 2026', author: 'Sistema', tags: ['dgt_valida', 'qr_valido'], notes: 'Carnet válido. Código QR verificado en DGT' },
  { id: 14, name: 'Carnet_Falso_Sofia_Ramos_C.pdf', type: 'pdf', size: '1.2 MB', category: 'license', subcategory: 'lic-fake', status: 'fake', confidence: 91, modified: '09 Ene 2026', author: 'Laura Soto', tags: ['qr_falso', 'categoria_inexistente'], notes: 'QR no direcciona a DGT. Categoría C inexistente para titular' },
  { id: 15, name: 'Carnet_Dudoso_Manuel_Ortega_A.pdf', type: 'pdf', size: '1.4 MB', category: 'license', subcategory: 'lic-doubt', status: 'doubt', confidence: 68, modified: '07 Ene 2026', author: 'Pedro Gómez', tags: ['fecha_dudosa'], notes: 'Fecha de expedición inconsistente con normativa vigente' },
  { id: 16, name: 'Contrato_Compraventa_Autentico.pdf', type: 'pdf', size: '3.2 MB', category: 'contracts', subcategory: 'cont-real', status: 'verified', confidence: 100, modified: '11 Ene 2026', author: 'Notaría', tags: ['firma_notarial', 'registro'], notes: 'Escritura pública auténtica. Firmas notariales verificadas' },
  { id: 17, name: 'Contrato_Falsificado_Firma.pdf', type: 'pdf', size: '2.8 MB', category: 'contracts', subcategory: 'cont-fake', status: 'fake', confidence: 89, modified: '06 Ene 2026', author: 'Ana Martínez', tags: ['firma_falsa', 'sello_copiado'], notes: 'Firma fraudulenta detectada mediante análisis caligráfico. Sello escaneado' },
  { id: 18, name: 'Contrato_Pendiente_Verificacion.pdf', type: 'pdf', size: '3.0 MB', category: 'contracts', subcategory: 'cont-doubt', status: 'doubt', confidence: 75, modified: '04 Ene 2026', author: 'Carlos Ruiz', tags: ['anomalia_pagina'], notes: 'Anomalías en numeración de páginas. Posible manipulación' },
  { id: 19, name: 'Escritura_Sociedad_TechCorp.pdf', type: 'pdf', size: '5.6 MB', category: 'company', subcategory: 'comp-real', status: 'verified', confidence: 100, modified: '13 Ene 2026', author: 'Registro Mercantil', tags: ['registro_mercantil', 'inscripcion'], notes: 'Escritura inscrita en Registro Mercantil. Número de protocolo verificado' },
  { id: 20, name: 'Documento_Sociedad_Falsa_Innova.pdf', type: 'pdf', size: '4.2 MB', category: 'company', subcategory: 'comp-fake', status: 'fake', confidence: 87, modified: '03 Ene 2026', author: 'Sistema', tags: ['sociedad_inexistente', 'cif_falso'], notes: 'CIF no corresponde a sociedad real. Documentación apócrifa' },
  { id: 21, name: 'Modificaciones_Estatutos_Dudosas.pdf', type: 'pdf', size: '4.8 MB', category: 'company', subcategory: 'comp-doubt', status: 'doubt', confidence: 62, modified: '01 Ene 2026', author: 'Laura Soto', tags: ['fechas_inconsistentes'], notes: 'Inconsistencias en fechas de acuerdos sociales. Requiere auditoría' },
  { id: 22, name: 'Titulo_Universitario_Autentico_UCM.pdf', type: 'pdf', size: '2.1 MB', category: 'certificates', subcategory: 'cert-real', status: 'verified', confidence: 99, modified: '14 Ene 2026', author: 'Universidad', tags: ['qr_uni', 'sello_electronico'], notes: 'Título oficial verificado. QR de la UCM válido. Sello electrónico presente' },
  { id: 23, name: 'Master_Falso_Harvard_Diploma.pdf', type: 'pdf', size: '1.9 MB', category: 'certificates', subcategory: 'cert-fake', status: 'fake', confidence: 96, modified: '02 Ene 2026', author: 'Ana Martínez', tags: ['diploma_mill', 'registro_inexistente'], notes: 'Diploma de diploma mill. Harvard no tiene registro del alumno' },
  { id: 24, name: 'Certificado_Idiomas_Cambridge.pdf', type: 'pdf', size: '1.3 MB', category: 'certificates', subcategory: 'cert-doubt', status: 'doubt', confidence: 71, modified: '30 Dic 2025', author: 'Pedro Gómez', tags: ['formato_antiguo'], notes: 'Formato antiguo, posible válido pero requiere verificación con Cambridge' },
];

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
