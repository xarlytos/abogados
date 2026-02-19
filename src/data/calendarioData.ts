export interface EventoCalendario {
  id: string;
  title: string;
  case?: string;
  caseTitle: string;
  date: string;
  time: string;
  duration?: string;
  type: 'vista' | 'plazo' | 'reunion' | 'entrega';
  location: string;
  urgent: boolean;
  completed: boolean;
}

export const eventosData: EventoCalendario[] = [
  { id: '1', title: 'Vista oral juicio verbal', case: 'EXP-2024-003', caseTitle: 'Despido TechCorp', date: '2026-02-11', time: '10:00', duration: '2h', type: 'vista', location: 'Juzgado de lo Social nº 3', urgent: true, completed: false },
  { id: '2', title: 'Entrega documentación cliente', case: 'EXP-2024-002', caseTitle: 'Divorcio García', date: '2026-02-12', time: '16:00', duration: '1h', type: 'entrega', location: 'Despacho principal', urgent: false, completed: false },
  { id: '3', title: 'Reunión preparatoria', case: 'EXP-2024-005', caseTitle: 'Constitución SL', date: '2026-02-14', time: '09:30', duration: '1.5h', type: 'reunion', location: 'Sala de reuniones A', urgent: false, completed: true },
  { id: '4', title: 'Plazo prescripción recurso', case: 'EXP-2024-006', caseTitle: 'Delito fiscal XYZ', date: '2026-02-16', time: '23:59', duration: '', type: 'plazo', location: 'Presentación telemática', urgent: true, completed: false },
  { id: '5', title: 'Declaración testigos', case: 'EXP-2024-010', caseTitle: 'Accidente tráfico Pérez', date: '2026-02-18', time: '11:00', duration: '3h', type: 'vista', location: 'Juzgado Primera Instancia nº 5', urgent: false, completed: false },
  { id: '6', title: 'Junta de acreedores', case: 'EXP-2024-012', caseTitle: 'Concurso PYME Tecnológica', date: '2026-02-20', time: '12:00', duration: '2h', type: 'reunion', location: 'Registro Mercantil', urgent: true, completed: false },
  { id: '7', title: 'Ratificación documento', case: 'EXP-2024-001', caseTitle: 'Reclamación Banco Santander', date: '2026-02-11', time: '14:00', duration: '30min', type: 'plazo', location: 'Registro Propiedad', urgent: true, completed: false },
  { id: '8', title: 'Mediación familiar', case: 'EXP-2024-009', caseTitle: 'Modificación medidas Torres', date: '2026-02-13', time: '10:00', duration: '1.5h', type: 'vista', location: 'Servicio Mediación Familiar', urgent: false, completed: false },
];

export const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'vista': return 'bg-blue-500';
    case 'plazo': return 'bg-red-500';
    case 'reunion': return 'bg-purple-500';
    case 'entrega': return 'bg-emerald-500';
    default: return 'bg-amber-500';
  }
};

export const getEventTypeLabel = (type: string) => {
  switch (type) {
    case 'vista': return 'Vista';
    case 'plazo': return 'Plazo';
    case 'reunion': return 'Reunión';
    case 'entrega': return 'Entrega';
    default: return 'Otro';
  }
};
