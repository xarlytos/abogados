/**
 * Modal de Merge de Plantillas
 * 
 * Permite seleccionar un expediente y generar un documento pre-rellenado
 * con los datos del expediente mergeados en la plantilla.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  X, FileText, Search, Check, AlertCircle, ChevronRight,
  FileDown, Eye, Edit2, RefreshCw, Loader2, CheckCircle2,
  ArrowRight, ArrowLeft, Building2, Gavel, FileSignature,
  Calendar, Euro, User, Hash
} from 'lucide-react';
import type { Plantilla, Variable } from '@/data/plantillasData';
import { expedientesDetailData } from '@/data/expedientesDetailData';
import {
  mergeTemplateWithExpediente,
  generateDocxDocument,
  downloadDocument,
  generateFilename,
  type MappedVariable,
  type MergeResult,
} from '@/services/templateMergeService';

interface TemplateMergeModalProps {
  plantilla: Plantilla;
  onClose: () => void;
}

type Step = 'select' | 'preview' | 'edit' | 'generate';

export function TemplateMergeModal({ plantilla, onClose }: TemplateMergeModalProps) {
  // Estados
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedExpedienteId, setSelectedExpedienteId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mergeResult, setMergeResult] = useState<MergeResult | null>(null);
  const [manualValues, setManualValues] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener lista de expedientes
  const expedientes = useMemo(() => {
    return Object.values(expedientesDetailData);
  }, []);

  // Filtrar expedientes
  const filteredExpedientes = useMemo(() => {
    return expedientes.filter(exp =>
      exp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.tipo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [expedientes, searchQuery]);

  // Expediente seleccionado
  const selectedExpediente = useMemo(() => {
    return selectedExpedienteId ? expedientesDetailData[selectedExpedienteId] : null;
  }, [selectedExpedienteId]);

  // Realizar merge al seleccionar expediente
  const handleExpedienteSelect = (expedienteId: string) => {
    setSelectedExpedienteId(expedienteId);
    setError(null);
    
    const expediente = expedientesDetailData[expedienteId];
    if (!expediente) return;

    const result = mergeTemplateWithExpediente(plantilla, expediente, manualValues);
    setMergeResult(result);
    
    // Inicializar valores manuales con los valores mapeados
    const initialManualValues: Record<string, string> = {};
    result.mappedVariables.forEach(v => {
      initialManualValues[v.name] = v.value;
    });
    setManualValues(initialManualValues);
    
    setCurrentStep('preview');
  };

  // Actualizar valor manual
  const handleManualValueChange = (varName: string, value: string) => {
    setManualValues(prev => ({ ...prev, [varName]: value }));
  };

  // Recalcular merge con valores manuales
  const recalculateMerge = () => {
    if (!selectedExpediente) return;
    
    const result = mergeTemplateWithExpediente(plantilla, selectedExpediente, manualValues);
    setMergeResult(result);
  };

  // Generar documento
  const handleGenerate = async () => {
    if (!selectedExpediente || !mergeResult) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Recalcular con valores finales
      const finalResult = mergeTemplateWithExpediente(plantilla, selectedExpediente, manualValues);
      
      // Generar documento DOCX
      const blob = await generateDocxDocument(plantilla, selectedExpediente, finalResult.mappedVariables);
      
      // Descargar
      const filename = generateFilename(plantilla, selectedExpediente);
      downloadDocument(blob, filename);
      
      setIsComplete(true);
    } catch (err) {
      setError('Error al generar el documento. Por favor, inténtelo de nuevo.');
      console.error('Error generando documento:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Obtener icono según el tipo de variable
  const getVariableIcon = (type: Variable['type']) => {
    switch (type) {
      case 'date': return Calendar;
      case 'number': return Euro;
      case 'select': return FileSignature;
      default: return FileText;
    }
  };

  // Obtener color según la fuente del mapeo
  const getSourceColor = (source: MappedVariable['source']) => {
    switch (source) {
      case 'expediente': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'juzgado': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'default': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'manual': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'empty': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getSourceLabel = (source: MappedVariable['source']) => {
    switch (source) {
      case 'expediente': return 'Expediente';
      case 'juzgado': return 'Juzgado';
      case 'default': return 'Por defecto';
      case 'manual': return 'Manual';
      case 'empty': return 'Vacío';
      default: return 'Desconocido';
    }
  };

  // Renderizar paso de selección
  const renderSelectStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/20 rounded-full flex items-center justify-center">
          <Building2 className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-theme-primary mb-2">
          Seleccionar Expediente
        </h3>
        <p className="text-theme-secondary">
          Elige el expediente del que se extraerán los datos para rellenar la plantilla
        </p>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
        <input
          type="text"
          placeholder="Buscar por número, título, cliente o tipo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-theme-primary border border-theme rounded-xl text-theme-primary placeholder-theme-muted focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      {/* Lista de expedientes */}
      <div className="max-h-[400px] overflow-y-auto space-y-2">
        {filteredExpedientes.map((exp) => (
          <button
            key={exp.id}
            onClick={() => handleExpedienteSelect(exp.id)}
            className={`w-full p-4 text-left rounded-xl border transition-all hover:scale-[1.01] ${
              selectedExpedienteId === exp.id
                ? 'bg-amber-500/10 border-amber-500/50'
                : 'bg-theme-tertiary/50 border-theme hover:border-amber-500/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="w-4 h-4 text-theme-muted" />
                  <span className="text-sm font-medium text-amber-400">{exp.id}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    exp.estado === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    exp.estado === 'urgent' ? 'bg-red-500/20 text-red-400' :
                    exp.estado === 'closed' ? 'bg-slate-500/20 text-slate-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {exp.estado === 'active' ? 'Activo' :
                     exp.estado === 'urgent' ? 'Urgente' :
                     exp.estado === 'closed' ? 'Cerrado' : 'Pendiente'}
                  </span>
                </div>
                <h4 className="font-medium text-theme-primary truncate">{exp.titulo}</h4>
                <div className="flex items-center gap-3 mt-2 text-sm text-theme-secondary">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {exp.cliente}
                  </span>
                  <span className="flex items-center gap-1">
                    <Gavel className="w-3.5 h-3.5" />
                    {exp.tipo}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-theme-muted" />
            </div>
          </button>
        ))}

        {filteredExpedientes.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-theme-tertiary rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-theme-muted" />
            </div>
            <p className="text-theme-secondary">
              No se encontraron expedientes con &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar paso de preview
  const renderPreviewStep = () => {
    if (!mergeResult || !selectedExpediente) return null;

    const autoFilledCount = mergeResult.mappedVariables.filter(
      v => v.source === 'expediente' || v.source === 'juzgado'
    ).length;
    const manualCount = mergeResult.mappedVariables.filter(
      v => v.source === 'manual' || v.source === 'default'
    ).length;
    const emptyCount = mergeResult.mappedVariables.filter(
      v => v.source === 'empty'
    ).length;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <Eye className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-theme-primary mb-2">
            Previsualizar Datos
          </h3>
          <p className="text-theme-secondary">
            Revisa cómo se han mapeado las variables del expediente
          </p>
        </div>

        {/* Resumen del expediente */}
        <div className="p-4 bg-theme-tertiary/50 rounded-xl border border-theme">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-theme-muted">Expediente seleccionado</p>
              <p className="font-medium text-theme-primary">{selectedExpediente.id} - {selectedExpediente.titulo}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <p className="text-2xl font-bold text-emerald-400">{autoFilledCount}</p>
              <p className="text-xs text-emerald-300">Auto-completados</p>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <p className="text-2xl font-bold text-amber-400">{manualCount}</p>
              <p className="text-xs text-amber-300">Por defecto/Manual</p>
            </div>
            <div className={`p-2 rounded-lg ${emptyCount > 0 ? 'bg-red-500/10' : 'bg-slate-500/10'}`}>
              <p className={`text-2xl font-bold ${emptyCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                {emptyCount}
              </p>
              <p className={`text-xs ${emptyCount > 0 ? 'text-red-300' : 'text-slate-300'}`}>Vacíos</p>
            </div>
          </div>
        </div>

        {/* Lista de variables mapeadas */}
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {mergeResult.mappedVariables.map((variable) => {
            const Icon = getVariableIcon(
              plantilla.variables.find(v => v.name === variable.name)?.type || 'text'
            );
            
            return (
              <div
                key={variable.name}
                className={`p-3 rounded-xl border ${getSourceColor(variable.source)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className="w-4 h-4 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono">{'{{'}{variable.name}{'}}'}</code>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">
                          {getSourceLabel(variable.source)}
                        </span>
                        {plantilla.variables.find(v => v.name === variable.name)?.required && (
                          <span className="text-xs text-red-400">*Requerido</span>
                        )}
                      </div>
                      <p className="text-sm opacity-80 mt-1">{variable.description}</p>
                    </div>
                  </div>
                  <div className="text-right max-w-[200px]">
                    <p className="font-medium truncate" title={variable.value}>
                      {variable.value || '(vacío)'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alertas */}
        {mergeResult.errors && mergeResult.errors.length > 0 && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-400 mb-1">Faltan datos requeridos</p>
                <ul className="text-sm text-red-300 space-y-1">
                  {mergeResult.errors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Preview del contenido */}
        {mergeResult.preview && (
          <div className="p-4 bg-slate-950 rounded-xl border border-theme">
            <p className="text-xs text-theme-muted mb-2">Vista previa del contenido:</p>
            <pre className="text-xs text-theme-secondary overflow-x-auto whitespace-pre-wrap font-mono">
              {mergeResult.preview}
            </pre>
          </div>
        )}
      </div>
    );
  };

  // Renderizar paso de edición
  const renderEditStep = () => {
    if (!mergeResult) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Edit2 className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-theme-primary mb-2">
            Editar Valores
          </h3>
          <p className="text-theme-secondary">
            Modifica los valores antes de generar el documento
          </p>
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-3">
          {plantilla.variables.map((variable) => {
            const mappedVar = mergeResult.mappedVariables.find(v => v.name === variable.name);
            const Icon = getVariableIcon(variable.type);
            
            return (
              <div key={variable.name} className="p-3 bg-theme-tertiary/50 rounded-xl border border-theme">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-theme-primary rounded-lg">
                    <Icon className="w-4 h-4 text-theme-secondary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-sm font-mono text-amber-400">
                        {'{{'}{variable.name}{'}}'}
                      </code>
                      {variable.required && (
                        <span className="text-xs text-red-400">*Requerido</span>
                      )}
                    </div>
                    <p className="text-sm text-theme-secondary mb-2">{variable.description}</p>
                    
                    {variable.type === 'select' && variable.options ? (
                      <select
                        value={manualValues[variable.name] || ''}
                        onChange={(e) => handleManualValueChange(variable.name, e.target.value)}
                        className="w-full px-3 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
                      >
                        <option value="">Seleccionar...</option>
                        {variable.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : variable.type === 'date' ? (
                      <input
                        type="date"
                        value={manualValues[variable.name] || ''}
                        onChange={(e) => handleManualValueChange(variable.name, e.target.value)}
                        className="w-full px-3 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
                      />
                    ) : variable.type === 'number' ? (
                      <input
                        type="number"
                        value={manualValues[variable.name] || ''}
                        onChange={(e) => handleManualValueChange(variable.name, e.target.value)}
                        placeholder={variable.defaultValue || '0'}
                        className="w-full px-3 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={manualValues[variable.name] || ''}
                        onChange={(e) => handleManualValueChange(variable.name, e.target.value)}
                        placeholder={variable.defaultValue || `Ingresar ${variable.description.toLowerCase()}...`}
                        className="w-full px-3 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-amber-500"
                      />
                    )}
                    
                    {mappedVar?.source === 'expediente' && (
                      <p className="text-xs text-emerald-400 mt-1">
                        Valor original del expediente: {mappedVar.value}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={recalculateMerge}
          className="w-full py-2 text-sm text-amber-400 hover:text-amber-300 flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar previsualización
        </button>
      </div>
    );
  };

  // Renderizar paso de generación
  const renderGenerateStep = () => (
    <div className="space-y-6">
      {!isComplete ? (
        <>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
              <FileDown className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-theme-primary mb-2">
              Generar Documento
            </h3>
            <p className="text-theme-secondary">
              El documento se descargará automáticamente
            </p>
          </div>

          {/* Resumen */}
          <div className="p-4 bg-theme-tertiary/50 rounded-xl border border-theme">
            <h4 className="font-medium text-theme-primary mb-3">Resumen del documento</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-theme-secondary">Plantilla:</span>
                <span className="text-theme-primary font-medium">{plantilla.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-theme-secondary">Expediente:</span>
                <span className="text-theme-primary font-medium">{selectedExpediente?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-theme-secondary">Cliente:</span>
                <span className="text-theme-primary font-medium">{selectedExpediente?.cliente}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-theme-secondary">Variables:</span>
                <span className="text-theme-primary font-medium">{plantilla.variables.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-theme-secondary">Formato:</span>
                <span className="text-theme-primary font-medium">DOCX (Word)</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Botón generar */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-accent text-slate-950 font-medium rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando documento...
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                Generar y Descargar DOCX
              </>
            )}
          </button>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-theme-primary mb-2">
            ¡Documento Generado!
          </h3>
          <p className="text-theme-secondary mb-6">
            El documento se ha descargado correctamente
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-500 text-slate-950 font-medium rounded-xl hover:bg-emerald-400 transition-colors"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );

  // Renderizar contenido según el paso
  const renderStepContent = () => {
    switch (currentStep) {
      case 'select': return renderSelectStep();
      case 'preview': return renderPreviewStep();
      case 'edit': return renderEditStep();
      case 'generate': return renderGenerateStep();
      default: return null;
    }
  };

  // Indicador de pasos
  const steps: { id: Step; label: string; icon: typeof Building2 }[] = [
    { id: 'select', label: 'Expediente', icon: Building2 },
    { id: 'preview', label: 'Revisar', icon: Eye },
    { id: 'edit', label: 'Editar', icon: Edit2 },
    { id: 'generate', label: 'Generar', icon: FileDown },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-theme-secondary border border-theme rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-theme bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-theme-primary">
                  Generar Documento con Merge
                </h2>
                <p className="text-sm text-theme-secondary">
                  {plantilla.title} • {plantilla.variables.length} variables
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-theme-muted hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Steps indicator */}
        {!isComplete && (
          <div className="px-6 py-4 border-b border-theme bg-theme-tertiary/30">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isPast = steps.findIndex(s => s.id === currentStep) > index;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => {
                        // Solo permitir navegar hacia atrás o al paso actual
                        const currentIndex = steps.findIndex(s => s.id === currentStep);
                        if (index <= currentIndex && step.id !== 'generate') {
                          setCurrentStep(step.id);
                        }
                      }}
                      disabled={index > steps.findIndex(s => s.id === currentStep)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-400'
                          : isPast
                          ? 'text-emerald-400'
                          : 'text-theme-muted'
                      } ${index > steps.findIndex(s => s.id === currentStep) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-theme-hover'}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isActive
                          ? 'bg-amber-500 text-slate-950'
                          : isPast
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-theme-primary text-theme-muted'
                      }`}>
                        {isPast ? <Check className="w-3.5 h-3.5" /> : index + 1}
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-theme-muted mx-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {renderStepContent()}
        </div>

        {/* Footer */}
        {!isComplete && (
          <div className="p-6 border-t border-theme flex justify-between">
            <button
              onClick={() => {
                const currentIndex = steps.findIndex(s => s.id === currentStep);
                if (currentIndex > 0) {
                  setCurrentStep(steps[currentIndex - 1].id);
                }
              }}
              disabled={currentStep === 'select'}
              className="px-4 py-2 text-theme-secondary hover:text-theme-primary transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>
            
            {currentStep !== 'generate' && (
              <button
                onClick={() => {
                  const currentIndex = steps.findIndex(s => s.id === currentStep);
                  if (currentIndex < steps.length - 1) {
                    setCurrentStep(steps[currentIndex + 1].id);
                  }
                }}
                disabled={currentStep === 'select' && !selectedExpediente}
                className="px-4 py-2 bg-accent text-slate-950 font-medium rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
