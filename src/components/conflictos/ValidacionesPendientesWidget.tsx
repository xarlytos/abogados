import { Link } from 'react-router-dom';
import { AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { useValidacion } from '@/hooks/useValidacion';
import { RiesgoBadge } from './RiesgoBadge';

export function ValidacionesPendientesWidget() {
  const { estadisticas, validaciones } = useValidacion();

  const validacionesPendientes = validaciones.filter(v => 
    v.estadoValidacion === 'pendiente' || 
    v.estadoValidacion === 'en_proceso' || 
    v.estadoValidacion === 'escalado'
  ).slice(0, 5);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Validaciones Pendientes</h3>
            <p className="text-sm text-gray-400">{estadisticas.pendientes + estadisticas.enProceso + estadisticas.escaladas} casos por revisar</p>
          </div>
        </div>
        <Link 
          to="/conflictos/analisis"
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium"
        >
          Ver todas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {validacionesPendientes.map((validacion) => (
          <div 
            key={validacion.id}
            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
          >
            <div>
              <p className="font-medium text-white">{validacion.expedienteId}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{new Date(validacion.fechaSolicitud).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
            <RiesgoBadge nivel={validacion.nivelRiesgo} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ValidacionesPendientesWidget;
