import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

export function LossCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(12);
  const [hourlyRate, setHourlyRate] = useState(180);
  const yearlyLoss = hoursPerWeek * hourlyRate * 52;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-theme-secondary/80 backdrop-blur-xl border border-theme rounded-3xl p-8 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
          <Calculator className="w-6 h-6 text-theme-primary" />
        </div>
        <div>
          <h3 className="font-bold text-theme-primary text-lg">Calculadora de Pérdidas</h3>
          <p className="text-sm text-theme-secondary">Descubre tu ROI potencial</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-theme-secondary mb-3">Horas semanales en administración</label>
          <input
            type="range"
            min="5"
            max="40"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
            className="w-full h-2 bg-theme-tertiary rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-theme-tertiary">5h</span>
            <span className="font-mono text-accent font-bold text-lg">{hoursPerWeek}h/semana</span>
            <span className="text-theme-tertiary">40h</span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-theme-secondary mb-3">Tarifa hora (€)</label>
          <div className="flex gap-2 flex-wrap">
            {[100, 150, 180, 250, 300].map((rate) => (
              <button
                key={rate}
                onClick={() => setHourlyRate(rate)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  hourlyRate === rate
                    ? 'bg-accent text-theme-primary'
                    : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-tertiary'
                }`}
              >
                {rate}€
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-theme">
          <div className="text-sm text-theme-secondary mb-2">Pérdida anual estimada:</div>
          <motion.div
            key={yearlyLoss}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold text-red-500 mb-2"
          >
            {yearlyLoss.toLocaleString('es-ES')}€
          </motion.div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-theme-tertiary">Con Derecho.ERP:</span>
            <span className="text-emerald-500 font-bold">Ahorra hasta {Math.round(yearlyLoss * 0.85).toLocaleString('es-ES')}€</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
