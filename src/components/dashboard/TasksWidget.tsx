import { CheckCircle2, Plus } from 'lucide-react';
import { getPriorityColor, getPriorityLabel } from '@/lib/utils';

export type TaskPriority = 'high' | 'medium' | 'low';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate: string;
  case: string;
}

interface TasksWidgetProps {
  tasks: Task[];
  onToggle: (id: number) => void;
}

export function TasksWidget({ tasks, onToggle }: TasksWidgetProps) {
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-semibold text-white">Tareas</h2>
        </div>
        <span className="text-xs text-slate-400">
          {completedCount}/{tasks.length} completadas
        </span>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer group ${
              task.completed ? 'bg-slate-800/30 opacity-60' : 'bg-slate-800/50 hover:bg-slate-800'
            }`}
            onClick={() => onToggle(task.id)}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.completed 
                ? 'bg-emerald-500 border-emerald-500' 
                : 'border-slate-600 group-hover:border-amber-500'
            }`}>
              {task.completed && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-500">{task.case}</span>
                <span className="text-[10px] text-slate-600">•</span>
                <span className={`text-[10px] ${getPriorityColor(task.priority)}`}>
                  {getPriorityLabel(task.priority)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 text-sm text-amber-500 hover:text-amber-400 font-medium flex items-center justify-center gap-2 transition-colors">
        <Plus className="w-4 h-4" />
        Añadir tarea
      </button>
    </div>
  );
}
