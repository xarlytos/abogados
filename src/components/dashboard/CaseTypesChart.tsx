interface CaseType {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

interface CaseTypesChartProps {
  types: CaseType[];
}

export function CaseTypesChart({ types }: CaseTypesChartProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Distribución por Tipo</h2>
      <div className="space-y-3">
        {types.map((type) => (
          <div key={type.type} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-300">{type.type}</span>
                <span className="text-xs text-slate-400">{type.count} casos</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${type.color} rounded-full`} style={{ width: `${type.percentage}%` }} />
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400 w-8">{type.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
