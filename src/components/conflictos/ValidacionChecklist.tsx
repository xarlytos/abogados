import { Check, Clock, AlertCircle, User, Scale, Briefcase, FileText } from 'lucide-react';
import type { ItemChecklist, ValidacionExpediente } from '@/types/conflictos';

interface ValidacionChecklistProps {
  validacion: ValidacionExpediente;
  onToggleItem: (itemId: string, completado: boolean, notas?: string) => void;
  readOnly?: boolean;
}

const categoriaConfig = {
  cliente: { icon: User, label: 'Cliente', color: 'text-blue-400' },
  parte_contraria: { icon: Scale, label: 'Parte Contraria', color: 'text-purple-400' },
  abogado: { icon: Briefcase, label: 'Abogado', color: 'text-green-400' },
  materia: { icon: FileText, label: 'Materia', color: 'text-orange-400' },
  otro: { icon: AlertCircle, label: 'Otro', color: 'text-gray-400' }
};

export function ValidacionChecklist({ validacion, onToggleItem, readOnly = false }: ValidacionChecklistProps) {
  const itemsRequeridos = validacion.checklist.filter(item => item.requerido);
  const itemsCompletados = itemsRequeridos.filter(item => item.completado);
  const progreso = itemsRequeridos.length > 0 
    ? Math.round((itemsCompletados.length / itemsRequeridos.length) * 100) 
    : 0;

  const getCategoriaIcon = (categoria: ItemChecklist['categoria']) => {
    const Icon = categoriaConfig[categoria].icon;
    return <Icon className={`w-4 h-4 ${categoriaConfig[categoria].color}`} />;
  };

  return (
    <div className="space-y-4">
      {/* Progreso */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">
            Progreso de Validación
          </span>
          <span className="text-sm font-bold text-amber-400">
            {progreso}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {itemsCompletados.length} de {itemsRequeridos.length} items requeridos completados
        </p>
      </div>

      {/* Items del checklist */}
      <div className="space-y-2">
        {validacion.checklist.map((item) => (
          <div 
            key={item.id}
            className={`
              flex items-start gap-3 p-3 rounded-lg border transition-all
              ${item.completado 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }
              ${readOnly ? 'cursor-default' : 'cursor-pointer'}
            `}
            onClick={() => !readOnly && onToggleItem(item.id, !item.completado)}
          >
            <div className={`
              flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center mt-0.5
              ${item.completado 
                ? 'bg-emerald-500 border-emerald-500' 
                : item.requerido 
                  ? 'border-amber-500' 
                  : 'border-gray-600'
              }
            `}>
              {item.completado && <Check className="w-3.5 h-3.5 text-white" />}
              {!item.completado && item.requerido && (
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getCategoriaIcon(item.categoria)}
                <span className={`text-sm ${item.completado ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                  {item.descripcion}
                </span>
                {item.requerido && (
                  <span className="text-xs text-amber-500 font-medium">*</span>
                )}
              </div>

              {item.completado && item.verificadoPor && (
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                  <Check className="w-3 h-3" />
                  <span>Verificado por {item.verificadoPor}</span>
                  {item.fechaVerificacion && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.fechaVerificacion).toLocaleDateString('es-ES')}
                    </span>
                  )}
                </div>
              )}

              {item.notas && (
                <p className="text-xs text-gray-500 mt-1.5 italic">
                  Nota: {item.notas}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ValidacionChecklist;
