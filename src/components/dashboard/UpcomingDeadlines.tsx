import { Clock, CheckCircle2, Calendar } from 'lucide-react';

interface Deadline {
  title: string;
  case: string;
  caseTitle: string;
  date: string;
  urgent: boolean;
  type: string;
  completed: boolean;
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-white">Plazos Próximos</h2>
        </div>
        <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs font-medium rounded-full">3 urgentes</span>
      </div>
      <div className="space-y-3">
        {deadlines.map((deadline, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              deadline.completed 
                ? 'bg-slate-800/30 border-slate-800 opacity-60' 
                : deadline.urgent 
                  ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40' 
                  : 'bg-slate-800/50 border-slate-800 hover:border-amber-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                deadline.completed ? 'bg-slate-700' :
                deadline.urgent ? 'bg-red-500/20' : 'bg-amber-500/20'
              }`}>
                {deadline.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Clock className={`w-5 h-5 ${deadline.urgent ? 'text-red-500' : 'text-amber-500'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium truncate ${deadline.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {deadline.title}
                  </p>
                  {deadline.urgent && !deadline.completed && (
                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-500 text-[10px] font-bold rounded uppercase">Urgente</span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{deadline.caseTitle}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium ${deadline.completed ? 'text-slate-500' : deadline.urgent ? 'text-red-400' : 'text-amber-400'}`}>
                    {deadline.date}
                  </span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-slate-500">{deadline.type}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2">
        <Calendar className="w-4 h-4" />
        Ver calendario completo
      </button>
    </div>
  );
}
