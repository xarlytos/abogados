interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  cases: number;
}

interface TeamSectionProps {
  members: TeamMember[];
}

export function TeamSection({ members }: TeamSectionProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Equipo</h2>
        <button className="text-sm text-amber-500 hover:text-amber-400">Ver todo</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {members.map((member) => (
          <div key={member.id} className="p-4 bg-slate-800/50 rounded-xl text-center hover:bg-slate-800 transition-colors cursor-pointer group">
            <div className="relative w-14 h-14 mx-auto mb-3">
              <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-slate-950 font-bold text-lg">
                {member.avatar}
              </div>
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-800 ${
                member.status === 'online' ? 'bg-emerald-500' :
                member.status === 'busy' ? 'bg-red-500' :
                'bg-slate-500'
              }`} />
            </div>
            <p className="text-sm font-medium text-white group-hover:text-amber-500 transition-colors">{member.name}</p>
            <p className="text-xs text-slate-400">{member.role}</p>
            <p className="text-xs text-slate-500 mt-2">{member.cases} casos</p>
          </div>
        ))}
      </div>
    </div>
  );
}
