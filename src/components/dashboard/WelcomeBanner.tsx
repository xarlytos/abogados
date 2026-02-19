import { Calendar, Zap } from 'lucide-react';

export function WelcomeBanner() {
  return (
    <div className="px-6 lg:px-8 pt-8 pb-6">
      <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-theme-secondary border border-accent/20 rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-theme-primary mb-2">¡Buenos días, Juan!</h1>
            <p className="text-theme-secondary">
              Tienes <span className="text-accent font-semibold">3 plazos críticos</span> esta semana y <span className="text-accent font-semibold">2 mensajes</span> pendientes.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-theme-secondary border border-theme text-theme-primary rounded-xl hover:border-accent/30 transition-colors">
              <Calendar className="w-4 h-4" />
              Ver agenda
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors">
              <Zap className="w-4 h-4" />
              Acción rápida
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
