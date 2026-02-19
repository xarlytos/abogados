import { Clock4 } from 'lucide-react';

interface Activity {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  type: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock4 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300">
                <span className="font-medium text-white">{activity.user}</span>{' '}
                {activity.action}{' '}
                <span className="text-amber-500">{activity.target}</span>
              </p>
              <p className="text-xs text-slate-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
