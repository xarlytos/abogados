/**
 * Servicio de Merge de Plantillas
 * 
 * Permite generar documentos pre-rellenados combinando plantillas con datos de expedientes.
 * Soporta mapeo automático de variables y generación de documentos DOCX/PDF.
 */

import { Document, Paragraph, TextRun, Packer, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import type { Plantilla } from '@/data/plantillasData';
import type { ExpedienteDetail } from '@/data/expedientesDetailData';

// Interfaz para el resultado del merge
export interface MergeResult {
  success: boolean;
  document?: Blob;
  filename?: string;
  preview?: string;
  errors?: string[];
  mappedVariables: MappedVariable[];
}

// Interfaz para variables mapeadas
export interface MappedVariable {
  name: string;
  value: string;
  source: 'expediente' | 'cliente' | 'juzgado' | 'default' | 'manual' | 'empty';
  description: string;
}

// Mapeo de variables de plantilla a campos de expediente
const VARIABLE_MAPPING: Record<string, {
  path: string;
  source: 'expediente' | 'cliente' | 'juzgado' | 'finanzas' | 'equipo';
  description: string;
}> = {
  // Datos del expediente
  'numero_expediente': { path: 'id', source: 'expediente', description: 'Número de expediente' },
  'expediente_id': { path: 'id', source: 'expediente', description: 'ID del expediente' },
  'titulo_expediente': { path: 'titulo', source: 'expediente', description: 'Título del expediente' },
  'tipo_expediente': { path: 'tipo', source: 'expediente', description: 'Tipo de expediente' },
  'estado_expediente': { path: 'estado', source: 'expediente', description: 'Estado del expediente' },
  'fecha_inicio': { path: 'fechaInicio', source: 'expediente', description: 'Fecha de inicio' },
  'fecha_actualizacion': { path: 'fechaActualizacion', source: 'expediente', description: 'Fecha de actualización' },
  'descripcion': { path: 'descripcion', source: 'expediente', description: 'Descripción del caso' },
  'progreso': { path: 'progreso', source: 'expediente', description: 'Porcentaje de progreso' },
  'numero_procedimiento': { path: 'numeroProcedimiento', source: 'expediente', description: 'Número de procedimiento' },
  
  // Datos del cliente
  'nombre_cliente': { path: 'cliente', source: 'expediente', description: 'Nombre del cliente' },
  'cliente_nombre': { path: 'cliente', source: 'expediente', description: 'Nombre del cliente' },
  'cliente_email': { path: 'clienteEmail', source: 'expediente', description: 'Email del cliente' },
  'cliente_telefono': { path: 'clienteTelefono', source: 'expediente', description: 'Teléfono del cliente' },
  
  // Datos del juzgado
  'juzgado': { path: 'juzgado', source: 'expediente', description: 'Juzgado' },
  'nombre_juzgado': { path: 'juzgado', source: 'expediente', description: 'Nombre del juzgado' },
  
  // Datos financieros
  'importe_total': { path: 'importeTotal', source: 'finanzas', description: 'Importe total' },
  'cantidad_reclamada': { path: 'importeTotal', source: 'finanzas', description: 'Cantidad reclamada' },
  'honorarios': { path: 'importeTotal', source: 'finanzas', description: 'Honorarios' },
  'gastos': { path: 'gastos', source: 'finanzas', description: 'Gastos' },
  'facturado': { path: 'facturado', source: 'finanzas', description: 'Facturado' },
  'cobrado': { path: 'cobrado', source: 'finanzas', description: 'Cobrado' },
  'pendiente_cobro': { path: 'pendienteCobro', source: 'finanzas', description: 'Pendiente de cobro' },
  
  // Datos del equipo
  'abogado_asignado': { path: 'abogadoAsignado.nombre', source: 'equipo', description: 'Abogado asignado' },
  'nombre_abogado': { path: 'abogadoAsignado.nombre', source: 'equipo', description: 'Nombre del abogado' },
  'email_abogado': { path: 'abogadoAsignado.email', source: 'equipo', description: 'Email del abogado' },
  'supervisor': { path: 'supervisor.nombre', source: 'equipo', description: 'Supervisor' },
  
  // Variables comunes de demandas
  'nombre_demandante': { path: 'cliente', source: 'expediente', description: 'Nombre del demandante' },
  'nombre_demandado': { path: 'titulo', source: 'expediente', description: 'Nombre del demandado (derivado del título)' },
  'fecha_hoy': { path: 'fechaHoy', source: 'expediente', description: 'Fecha actual' },
  'fecha_actual': { path: 'fechaHoy', source: 'expediente', description: 'Fecha actual' },
};

// Mapeos específicos por tipo de plantilla
const SPECIFIC_MAPPINGS: Record<string, Record<string, string>> = {
  'PLANT-002': {
    // Demanda de Despido Improcedente
    'nombre_demandante': 'cliente',
    'nombre_demandado': 'titulo',
    'fecha_alta': 'fechaInicio',
  },
  'PLANT-003': {
    // Escrito de Demanda Civil
    'nombre_demandante': 'cliente',
    'objeto_proceso': 'descripcion',
  },
  'PLANT-010': {
    // Contrato de Honorarios
    'nombre_cliente': 'cliente',
    'materia_servicio': 'tipo',
  },
};

/**
 * Obtiene el valor de un objeto por path anidado (e.g., 'abogadoAsignado.nombre')
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let value: unknown = obj;
  
  for (const key of keys) {
    if (value === null || value === undefined) return undefined;
    value = (value as Record<string, unknown>)[key];
  }
  
  return value !== undefined && value !== null ? String(value) : undefined;
}

/**
 * Extrae datos del expediente según la fuente
 */
function extractExpedienteData(
  expediente: ExpedienteDetail,
  source: 'expediente' | 'cliente' | 'juzgado' | 'finanzas' | 'equipo'
): Record<string, unknown> {
  switch (source) {
    case 'expediente':
    case 'cliente':
    case 'juzgado':
      return expediente as unknown as Record<string, unknown>;
    case 'finanzas':
      return (expediente.finanzas || {}) as unknown as Record<string, unknown>;
    case 'equipo':
      return (expediente.equipo || {}) as unknown as Record<string, unknown>;
    default:
      return {};
  }
}

/**
 * Mapea una variable de plantilla a su valor correspondiente del expediente
 */
function mapVariable(
  variable: { name: string; description: string; type: string; required: boolean; defaultValue?: string },
  expediente: ExpedienteDetail,
  plantillaId: string,
  manualValues?: Record<string, string>
): MappedVariable {
  const varName = variable.name.toLowerCase();
  
  // 1. Verificar valores manuales proporcionados
  if (manualValues?.[variable.name]) {
    return {
      name: variable.name,
      value: manualValues[variable.name],
      source: 'manual',
      description: variable.description,
    };
  }
  
  // 2. Verificar mapeo específico por plantilla
  const specificMapping = SPECIFIC_MAPPINGS[plantillaId]?.[varName];
  if (specificMapping) {
    const value = getNestedValue(expediente as unknown as Record<string, unknown>, specificMapping);
    if (value) {
      return {
        name: variable.name,
        value,
        source: 'expediente',
        description: variable.description,
      };
    }
  }
  
  // 3. Verificar mapeo general
  const mapping = VARIABLE_MAPPING[varName];
  if (mapping) {
    const data = extractExpedienteData(expediente, mapping.source);
    const value = getNestedValue(data, mapping.path);
    if (value) {
      return {
        name: variable.name,
        value,
        source: mapping.source === 'juzgado' ? 'juzgado' : 
                mapping.source === 'equipo' ? 'expediente' : 'expediente',
        description: variable.description,
      };
    }
  }
  
  // 4. Fecha actual
  if (varName.includes('fecha') && (varName.includes('hoy') || varName.includes('actual'))) {
    return {
      name: variable.name,
      value: new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      source: 'default',
      description: variable.description,
    };
  }
  
  // 5. Usar valor por defecto si existe
  if (variable.defaultValue) {
    return {
      name: variable.name,
      value: variable.defaultValue,
      source: 'default',
      description: variable.description,
    };
  }
  
  // 6. Retornar vacío si es requerido o con placeholder
  return {
    name: variable.name,
    value: variable.required ? `[${variable.name.toUpperCase()}]` : '',
    source: 'empty',
    description: variable.description,
  };
}

/**
 * Realiza el merge de una plantilla con los datos de un expediente
 */
export function mergeTemplateWithExpediente(
  plantilla: Plantilla,
  expediente: ExpedienteDetail,
  manualValues?: Record<string, string>
): MergeResult {
  const errors: string[] = [];
  const mappedVariables: MappedVariable[] = [];
  
  // Mapear todas las variables
  for (const variable of plantilla.variables) {
    const mapped = mapVariable(variable, expediente, plantilla.id, manualValues);
    mappedVariables.push(mapped);
    
    // Registrar error si es requerido y está vacío
    if (variable.required && (mapped.source === 'empty' || !mapped.value)) {
      errors.push(`La variable "${variable.name}" es requerida pero no tiene valor`);
    }
  }
  
  // Generar preview del contenido
  const preview = generatePreview(plantilla, mappedVariables);
  
  return {
    success: errors.length === 0,
    preview,
    errors: errors.length > 0 ? errors : undefined,
    mappedVariables,
  };
}

/**
 * Genera una previsualización del contenido mergeado
 */
function generatePreview(plantilla: Plantilla, mappedVariables: MappedVariable[]): string {
  let content = `\n`;
  content += `================================================\n`;
  content += `  ${plantilla.title.toUpperCase()}\n`;
  content += `================================================\n\n`;
  
  content += `EXPEDIENTE: {{numero_expediente}}\n`;
  content += `CLIENTE: {{nombre_cliente}}\n`;
  content += `FECHA: {{fecha_hoy}}\n\n`;
  content += `------------------------------------------------\n\n`;
  
  // Agregar contenido de ejemplo basado en la categoría
  switch (plantilla.category) {
    case 'contract':
      content += generateContractPreview();
      break;
    case 'court':
      content += generateCourtPreview();
      break;
    case 'communication':
      content += generateCommunicationPreview();
      break;
    default:
      content += generateGenericPreview(mappedVariables);
  }
  
  content += `\n\n------------------------------------------------\n`;
  content += `Documento generado automáticamente\n`;
  content += `================================================\n`;
  
  // Reemplazar variables
  for (const mv of mappedVariables) {
    content = content.replace(new RegExp(`{{${mv.name}}}`, 'g'), mv.value);
  }
  
  return content;
}

function generateContractPreview(): string {
  return `CONTRATO\n\n` +
    `En {{fecha_hoy}}, entre:\n\n` +
    `PARTE A: {{nombre_cliente}}\n` +
    `PARTE B: [PARTE CONTRARIA]\n\n` +
    `Se acuerda lo siguiente...\n`;
}

function generateCourtPreview(): string {
  return `DILIGENCIA\n\n` +
    `{{juzgado}}\n\n` +
    `Número de expediente: {{numero_expediente}}\n\n` +
    `D./Dña. {{nombre_cliente}}, como demandante, comparece y dice:\n\n` +
    `...\n`;
}

function generateCommunicationPreview(): string {
  return `Estimado/a {{nombre_cliente}}:\n\n` +
    `Por medio de la presente...\n\n` +
    `Referente al expediente {{numero_expediente}}...\n`;
}

function generateGenericPreview(mappedVariables: MappedVariable[]): string {
  return mappedVariables.map(v => `${v.name}: ${v.value}`).join('\n');
}

/**
 * Genera un documento DOCX con los datos mergeados
 */
export async function generateDocxDocument(
  plantilla: Plantilla,
  expediente: ExpedienteDetail,
  mappedVariables: MappedVariable[]
): Promise<Blob> {
  // Crear contenido del documento
  const children: Paragraph[] = [
    new Paragraph({
      text: plantilla.title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Expediente: ', bold: true }),
        new TextRun({ text: getVariableValue(mappedVariables, 'numero_expediente') || getVariableValue(mappedVariables, 'expediente_id') || expediente.id }),
      ],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Cliente: ', bold: true }),
        new TextRun({ text: getVariableValue(mappedVariables, 'nombre_cliente') || getVariableValue(mappedVariables, 'cliente_nombre') || expediente.cliente }),
      ],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Fecha: ', bold: true }),
        new TextRun({ text: getVariableValue(mappedVariables, 'fecha_hoy') || getVariableValue(mappedVariables, 'fecha_actual') || new Date().toLocaleDateString('es-ES') }),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: '═══════════════════════════════════════════════════════════',
      spacing: { after: 400 },
    }),
  ];
  
  // Agregar párrafos según el tipo de plantilla
  switch (plantilla.category) {
    case 'court':
      children.push(...generateCourtParagraphs(mappedVariables, expediente));
      break;
    case 'contract':
      children.push(...generateContractParagraphs(mappedVariables, expediente));
      break;
    case 'communication':
      children.push(...generateCommunicationParagraphs(mappedVariables, expediente));
      break;
    default:
      children.push(...generateGenericParagraphs(mappedVariables));
  }
  
  // Pie de página
  children.push(
    new Paragraph({ text: '', spacing: { after: 400 } }),
    new Paragraph({
      text: '───────────────────────────────────────────────────────────',
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Documento generado automáticamente por ', italics: true }),
        new TextRun({ text: 'ERP Bufete', italics: true, bold: true }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ 
          text: `Fecha de generación: ${new Date().toLocaleString('es-ES')}`,
          italics: true,
          size: 18,
        }),
      ],
      alignment: AlignmentType.CENTER,
    })
  );
  
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440,    // 1 inch
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      children,
    }],
  });
  
  return await Packer.toBlob(doc);
}

function getVariableValue(mappedVariables: MappedVariable[], name: string): string | undefined {
  return mappedVariables.find(v => v.name === name)?.value;
}

function generateCourtParagraphs(mappedVariables: MappedVariable[], expediente: ExpedienteDetail): Paragraph[] {
  const juzgado = getVariableValue(mappedVariables, 'juzgado') || getVariableValue(mappedVariables, 'nombre_juzgado') || expediente.juzgado || '[JUZGADO]';
  const cliente = getVariableValue(mappedVariables, 'nombre_demandante') || getVariableValue(mappedVariables, 'nombre_cliente') || getVariableValue(mappedVariables, 'cliente_nombre') || expediente.cliente;
  
  return [
    new Paragraph({
      text: juzgado,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Número de procedimiento: ', bold: true }),
        new TextRun({ text: expediente.numeroProcedimiento || '[PENDIENTE]' }),
      ],
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: 'DILIGENCIA',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `D./Dña. ${cliente}` }),
        new TextRun({ text: ', mayor de edad, comparece y, como mejor proceda en Derecho, DICE:', italics: true }),
      ],
      spacing: { after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      text: `PRIMERO.- Que por medio del presente escrito, en nombre y representación de ${cliente}, comparezco ante este Juzgado en el procedimiento referido en el encabezamiento.`,
      spacing: { after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      text: `SEGUNDO.- [Contenido específico del escrito judicial...]`,
      spacing: { after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({ text: '', spacing: { after: 400 } }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Por todo lo expuesto, SUPLICO AL JUZGADO:', bold: true }),
      ],
      spacing: { after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      text: `Que teniendo por presentado este escrito, por hechos y fundamentos de derecho en él expuestos, se sirva admitirlo y, en su día, estimar las pretensiones formuladas.`,
      spacing: { after: 400 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `${getVariableValue(mappedVariables, 'nombre_abogado') || getVariableValue(mappedVariables, 'abogado_asignado') || '[ABOGADO]'}`, bold: true }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Letrado del demandante', italics: true }),
      ],
      alignment: AlignmentType.RIGHT,
    }),
  ];
}

function generateContractParagraphs(mappedVariables: MappedVariable[], expediente: ExpedienteDetail): Paragraph[] {
  const cliente = getVariableValue(mappedVariables, 'nombre_cliente') || getVariableValue(mappedVariables, 'cliente_nombre') || expediente.cliente;
  
  return [
    new Paragraph({
      text: 'CONTRATO DE PRESTACIÓN DE SERVICIOS LEGALES',
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: 'REUNIDOS',
      heading: HeadingLevel.HEADING_3,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'De una parte, ' }),
        new TextRun({ text: cliente, bold: true }),
        new TextRun({ text: ', en adelante el "CLIENTE", con domicilio en [DIRECCIÓN].' }),
      ],
      spacing: { after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'De otra parte, el bufete de abogados representado por ' }),
        new TextRun({ text: getVariableValue(mappedVariables, 'abogado_asignado') || getVariableValue(mappedVariables, 'nombre_abogado') || '[ABOGADO]', bold: true }),
        new TextRun({ text: ', en adelante el "BUFETE".' }),
      ],
      spacing: { after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Ambas partes acuerdan celebrar el presente contrato de acuerdo con las siguientes' }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: 'CLAUSULAS',
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'PRIMERA.- Objeto: ', bold: true }),
        new TextRun({ text: `El BUFETE se compromete a prestar servicios legales en materia de ${expediente.tipo} referente a ${expediente.titulo}.` }),
      ],
      spacing: { after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'SEGUNDA.- Honorarios: ', bold: true }),
        new TextRun({ text: `El importe de los honorarios es de ${getVariableValue(mappedVariables, 'honorarios') || getVariableValue(mappedVariables, 'importe_total') || expediente.finanzas?.importeTotal || '[IMPORTE]'}.` }),
      ],
      spacing: { after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
  ];
}

function generateCommunicationParagraphs(mappedVariables: MappedVariable[], expediente: ExpedienteDetail): Paragraph[] {
  const cliente = getVariableValue(mappedVariables, 'nombre_cliente') || getVariableValue(mappedVariables, 'cliente_nombre') || expediente.cliente;
  
  return [
    new Paragraph({
      text: `Estimado/a ${cliente}:`,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: `Por medio de la presente, nos ponemos en contacto con usted en relación con el expediente ${expediente.id} referente a ${expediente.titulo}.`,
      spacing: { after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      text: '[Contenido de la comunicación...]',
      spacing: { after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      text: 'Quedamos a su disposición para cualquier consulta adicional.',
      spacing: { after: 400 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      text: 'Atentamente,',
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: getVariableValue(mappedVariables, 'nombre_abogado') || getVariableValue(mappedVariables, 'abogado_asignado') || '[ABOGADO]' }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ 
          text: getVariableValue(mappedVariables, 'email_abogado') || expediente.equipo?.abogadoAsignado?.email || '',
          italics: true,
          size: 20,
        }),
      ],
    }),
  ];
}

function generateGenericParagraphs(mappedVariables: MappedVariable[]): Paragraph[] {
  return mappedVariables.map(v => 
    new Paragraph({
      children: [
        new TextRun({ text: `${v.description}: `, bold: true }),
        new TextRun({ text: v.value || '[No especificado]' }),
      ],
      spacing: { after: 150 },
    })
  );
}

/**
 * Descarga el documento generado
 */
export function downloadDocument(blob: Blob, filename: string): void {
  saveAs(blob, filename);
}

/**
 * Genera el nombre de archivo para el documento
 */
export function generateFilename(plantilla: Plantilla, expediente: ExpedienteDetail): string {
  const date = new Date().toISOString().split('T')[0];
  const sanitizedExpId = expediente.id.replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedTitle = plantilla.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 30);
  return `${sanitizedTitle}_${sanitizedExpId}_${date}.docx`;
}

/**
 * Obtiene la lista de variables sugeridas para una plantilla
 */
export function getSuggestedVariables(plantilla: Plantilla): string[] {
  const baseVars = [
    'numero_expediente',
    'nombre_cliente',
    'fecha_hoy',
  ];
  
  switch (plantilla.category) {
    case 'court':
      return [...baseVars, 'juzgado', 'numero_procedimiento', 'nombre_demandante', 'nombre_demandado', 'abogado_asignado'];
    case 'contract':
      return [...baseVars, 'importe_total', 'fecha_inicio', 'nombre_abogado'];
    case 'communication':
      return [...baseVars, 'cliente_email', 'cliente_telefono'];
    default:
      return baseVars;
  }
}
