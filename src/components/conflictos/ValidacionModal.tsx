import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle, AlertTriangle, Shield
} from 'lucide-react';
import { ValidacionChecklist } from './ValidacionChecklist';
import { RiesgoBadge } from './RiesgoBadge';
import type { ValidacionExpediente } from '@/types/conflictos';

interface ValidacionModalProps {
  validacion: ValidacionExpediente | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleChecklist: (itemId: string, completado: boolean, notas?: string) => void;
  onAprobar: (justificacion: string) => void;
  onRechazar: (justificacion: string) => void;
  onEscalar: (justificacion: string) => void;
  puedeAprobar: boolean;
  puedeRechazar: boolean;
  puedeEscalar: boolean;
  checklistCompleto: boolean;
}

const estadoConfig = {
  pendiente: { label: 'Pendiente', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  en_proceso: { label: 'En Proceso', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  aprobado: { label: 'Aprobado', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  rechazado: { label: 'Rechazado', color: 'text-red-400', bg: 'bg-red-500/20' },
  escalado: { label: 'Escalado', color: 'text-purple-400', bg: 'bg-purple-500/20' }
};

export function ValidacionModal({
  validacion,
  isOpen,
  onClose,
  onToggleChecklist,
  onAprobar: _onAprobar,
  onRechazar: _onRechazar,
  onEscalar: _onEscalar,
  puedeAprobar: _puedeAprobar,
  puedeRechazar: _puedeRechazar,
  puedeEscalar: _puedeEscalar,
  checklistCompleto: _checklistCompleto
}: ValidacionModalProps) {
  // const [justificacion, setJustificacion] = useState('');
  const [activeTab, setActiveTab] = useState<'checklist' | 'conflictos' | 'historial'>('checklist');

  if (!validacion) return null;

  const estado = estadoConfig[validacion.estadoValidacion];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-10 bg-gray-900 rounded-xl border border-gray-700 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/50">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${estado.bg}`}>
                  <Shield className={`w-6 h-6 ${estado.color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Validación de Expediente
                  </h2>
                  <p className="text-sm text-gray-400">
                    {validacion.expedienteId} • {validacion.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RiesgoBadge nivel={validacion.nivelRiesgo} size="md" />
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${estado.bg} ${estado.color}`}>
                  {estado.label}
                </span>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Sidebar Tabs */}
              <div className="w-64 border-r border-gray-700 bg-gray-800/30 p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('checklist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'checklist' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Checklist</span>
                </button>
                <button
                  onClick={() => setActiveTab('conflictos')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'conflictos' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Conflictos</span>
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'checklist' && (
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Checklist de Validación
                    </h3>
                    <ValidacionChecklist
                      validacion={validacion}
                      onToggleItem={onToggleChecklist}
                      readOnly={validacion.estadoValidacion === 'aprobado' || validacion.estadoValidacion === 'rechazado'}
                    />
                  </div>
                )}

                {activeTab === 'conflictos' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Conflictos Detectados ({validacion.conflictosDetectados.length})
                    </h3>
                    {validacion.conflictosDetectados.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No se detectaron conflictos</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {validacion.conflictosDetectados.map((conflicto) => (
                          <div key={conflicto.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-xs text-gray-500">{conflicto.id}</span>
                                <p className="text-gray-200 mt-1">{conflicto.descripcion}</p>
                              </div>
                              <RiesgoBadge 
                                nivel={conflicto.severidad === 'critica' ? 'critico' : 
                                       conflicto.severidad === 'alta' ? 'alto' : 
                                       conflicto.severidad === 'media' ? 'medio' : 'bajo'} 
                                size="sm" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ValidacionModal;
