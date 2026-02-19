// ============================================
// DATOS DE DASHBOARD ESPECÍFICOS POR ROL
// ============================================

import type { UserRole } from '@/types/roles';
import {
  Users,
  FolderOpen,
  CreditCard,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Server,
  Shield,
  Database,
  Activity,
  Gavel,
  FileText,
  Calendar,
  Phone,
  Timer,
  Target,
  Calculator,
  ClipboardList,
  Archive,
  BookOpen,
  MessageSquare,
  Receipt,
  Wallet,
  PieChart,
  BarChart3,
  UserCheck,
  Briefcase,
} from 'lucide-react';

// ============================================
// SUPER ADMINISTRADOR
// ============================================

export const superAdminStats = [
  { label: 'Usuarios Activos', value: '47', change: '+3', trend: 'up', icon: Users, color: 'blue', subtext: 'sesiones hoy' },
  { label: 'Uptime Sistema', value: '99.9%', change: '0.01%', trend: 'up', icon: Server, color: 'emerald', subtext: 'últimos 30 días' },
  { label: 'Último Backup', value: '2h', change: 'Exitoso', trend: 'up', icon: Database, color: 'amber', subtext: 'automático' },
  { label: 'Alertas Críticas', value: '0', change: '-2', trend: 'up', icon: AlertTriangle, color: 'red', subtext: 'requieren atención' },
  { label: 'Peticiones/seg', value: '1,240', change: '+12%', trend: 'up', icon: Activity, color: 'purple', subtext: 'promedio' },
  { label: 'Espacio Usado', value: '68%', change: '+5%', trend: 'down', icon: Database, color: 'cyan', subtext: 'de 500GB' },
];

export const superAdminQuickActions = [
  { icon: Users, label: 'Crear Usuario', color: 'blue' },
  { icon: Database, label: 'Backup Manual', color: 'emerald' },
  { icon: Shield, label: 'Ver Logs', color: 'amber' },
  { icon: Activity, label: 'Monitoreo', color: 'purple' },
  { icon: Server, label: 'Reiniciar Servicio', color: 'red' },
  { icon: Database, label: 'Configuración', color: 'cyan' },
];

export const superAdminActivities = [
  { id: 1, user: 'Sistema', action: 'backup automático completado', target: '', time: '2 min', type: 'success' },
  { id: 2, user: 'admin@derecho.erp', action: 'creó usuario', target: 'nuevo@bufete.com', time: '15 min', type: 'user' },
  { id: 3, user: 'Sistema', action: 'detectó intento de acceso', target: 'IP: 192.168.1.100', time: '1 h', type: 'warning' },
  { id: 4, user: 'Sistema', action: 'actualización completada', target: 'v2.4.1', time: '3 h', type: 'success' },
  { id: 5, user: 'superadmin@derecho.erp', action: 'modificó permisos de', target: 'admin@derecho.erp', time: '5 h', type: 'user' },
];

// ============================================
// SOCIO / DIRECTOR
// ============================================

export const socioStats = [
  { label: 'Ingresos del Mes', value: '€85.4K', change: '+18%', trend: 'up', icon: TrendingUp, color: 'emerald', subtext: 'vs mes anterior' },
  { label: 'Casos Activos', value: '127', change: '+12', trend: 'up', icon: FolderOpen, color: 'blue', subtext: 'en progreso' },
  { label: 'Por Cobrar', value: '€125K', change: '5 vencidas', trend: 'down', icon: CreditCard, color: 'amber', subtext: 'facturas pendientes' },
  { label: 'Productividad', value: '87%', change: '+5%', trend: 'up', icon: Target, color: 'purple', subtext: 'horas facturables' },
  { label: 'Clientes Nuevos', value: '8', change: '+3', trend: 'up', icon: Users, color: 'cyan', subtext: 'este mes' },
  { label: 'Margen Utilidad', value: '42%', change: '+2%', trend: 'up', icon: PieChart, color: 'rose', subtext: 'vs presupuesto' },
];

export const socioQuickActions = [
  { icon: FolderOpen, label: 'Nuevo Caso', color: 'blue' },
  { icon: CheckCircle, label: 'Aprobar Cotización', color: 'emerald' },
  { icon: CreditCard, label: 'Autorizar Descuento', color: 'amber' },
  { icon: BarChart3, label: 'Reporte Ejecutivo', color: 'purple' },
  { icon: Users, label: 'Asignar Caso', color: 'cyan' },
  { icon: Gavel, label: 'Casos Críticos', color: 'red' },
];

export const casosAltoValor = [
  { id: 'EXP-2024-015', title: 'Fusión Corporativa ABC Corp', cliente: 'ABC Corporation', valor: '€450,000', abogado: 'Ana Martínez', progreso: 65 },
  { id: 'EXP-2024-012', title: 'Arbitraje Internacional', cliente: 'Global Industries', valor: '€320,000', abogado: 'Carlos Ruiz', progreso: 40 },
  { id: 'EXP-2024-008', title: 'Demanda Clase Action', cliente: 'Grupo Consumidores', valor: '€280,000', abogado: 'Laura Soto', progreso: 25 },
  { id: 'EXP-2024-003', title: 'Propiedad Intelectual Tech', cliente: 'Innovatech SL', valor: '€195,000', abogado: 'Pedro Gómez', progreso: 80 },
];

// ============================================
// ABOGADO SENIOR
// ============================================

export const abogadoSeniorStats = [
  { label: 'Mis Casos', value: '12', change: '+2', trend: 'up', icon: Briefcase, color: 'blue', subtext: 'activos' },
  { label: 'Casos Junior', value: '5', change: 'a supervisar', trend: 'neutral', icon: UserCheck, color: 'amber', subtext: 'bajo mi mentoría' },
  { label: 'Horas Semana', value: '38h', change: '+6h', trend: 'up', icon: Timer, color: 'emerald', subtext: 'de 40h meta' },
  { label: 'Tareas Pendientes', value: '8', change: '3 urgentes', trend: 'down', icon: ClipboardList, color: 'red', subtext: 'por completar' },
  { label: 'Audiencias', value: '3', change: 'esta semana', trend: 'neutral', icon: Gavel, color: 'purple', subtext: 'programadas' },
  { label: 'Tiempo Respuesta', value: '2.4h', change: '-0.5h', trend: 'up', icon: Clock, color: 'cyan', subtext: 'promedio a clientes' },
];

export const abogadoSeniorQuickActions = [
  { icon: Timer, label: 'Registrar Tiempo', color: 'blue' },
  { icon: FileText, label: 'Subir Documento', color: 'emerald' },
  { icon: ClipboardList, label: 'Crear Tarea', color: 'amber' },
  { icon: MessageSquare, label: 'Mensaje Cliente', color: 'purple' },
  { icon: Calendar, label: 'Programar Audiencia', color: 'cyan' },
  { icon: UserCheck, label: 'Revisar Junior', color: 'rose' },
];

export const casosJuniorSupervision = [
  { id: 'EXP-2024-020', title: 'Contrato de Arrendamiento', junior: 'Pedro Gómez', estado: 'revisión', ultimaActividad: 'Hace 2h', progreso: 60 },
  { id: 'EXP-2024-021', title: 'Reclamación Seguro', junior: 'María López', estado: 'borrador', ultimaActividad: 'Ayer', progreso: 30 },
  { id: 'EXP-2024-022', title: 'Divorcio de Mutuo Acuerdo', junior: 'Juan Pérez', estado: 'esperando', ultimaActividad: 'Hace 3 días', progreso: 45 },
];

// ============================================
// ABOGADO JUNIOR
// ============================================

export const abogadoJuniorStats = [
  { label: 'Mis Casos', value: '5', change: 'asignados', trend: 'neutral', icon: Briefcase, color: 'blue', subtext: 'activos' },
  { label: 'Tareas Hoy', value: '4', change: '2 completadas', trend: 'up', icon: CheckCircle, color: 'emerald', subtext: 'pendientes' },
  { label: 'Horas Semana', value: '28h', change: '+4h', trend: 'up', icon: Timer, color: 'amber', subtext: 'registradas' },
  { label: 'En Revisión', value: '2', change: 'documentos', trend: 'neutral', icon: FileText, color: 'purple', subtext: 'esperando aprobación' },
  { label: 'Investigaciones', value: '3', change: 'pendientes', trend: 'down', icon: BookOpen, color: 'cyan', subtext: 'por entregar' },
];

export const abogadoJuniorQuickActions = [
  { icon: Timer, label: 'Iniciar Timer', color: 'blue' },
  { icon: CheckCircle, label: 'Completar Tarea', color: 'emerald' },
  { icon: FileText, label: 'Subir Borrador', color: 'amber' },
  { icon: MessageSquare, label: 'Solicitar Ayuda', color: 'purple' },
  { icon: BookOpen, label: 'Ver Plantilla', color: 'cyan' },
  { icon: Gavel, label: 'Agregar Nota', color: 'rose' },
];

// ============================================
// PARALEGAL
// ============================================

export const paralegalStats = [
  { label: 'Trámites Activos', value: '15', change: '3 urgentes', trend: 'down', icon: ClipboardList, color: 'amber', subtext: 'en proceso' },
  { label: 'Documentos', value: '23', change: 'por organizar', trend: 'down', icon: FileText, color: 'blue', subtext: 'pendientes archivo' },
  { label: 'Casos Apoyo', value: '8', change: 'colaborando', trend: 'neutral', icon: Users, color: 'emerald', subtext: 'activos' },
  { label: 'Trámites Completados', value: '12', change: 'esta semana', trend: 'up', icon: CheckCircle, color: 'purple', subtext: 'exitosos' },
];

export const paralegalQuickActions = [
  { icon: FileText, label: 'Subir Documento', color: 'blue' },
  { icon: ClipboardList, label: 'Actualizar Trámite', color: 'emerald' },
  { icon: BookOpen, label: 'Descargar Plantilla', color: 'amber' },
  { icon: Calendar, label: 'Programar Cita', color: 'purple' },
  { icon: MessageSquare, label: 'Enviar Recordatorio', color: 'cyan' },
  { icon: Archive, label: 'Organizar Archivo', color: 'rose' },
];

export const tramitesEnCurso = [
  { id: 'TRAM-001', tipo: 'Inscripción Registro Mercantil', caso: 'EXP-2024-005', estado: 'en_proceso', fechaLimite: '18 Ene', prioridad: 'alta' },
  { id: 'TRAM-002', tipo: 'Solicitud Certificación', caso: 'EXP-2024-012', estado: 'pendiente', fechaLimite: '20 Ene', prioridad: 'media' },
  { id: 'TRAM-003', tipo: 'Entrega Documentación', caso: 'EXP-2024-003', estado: 'urgente', fechaLimite: 'Hoy', prioridad: 'alta' },
  { id: 'TRAM-004', tipo: 'Registro Propiedad Intelectual', caso: 'EXP-2024-008', estado: 'en_proceso', fechaLimite: '25 Ene', prioridad: 'media' },
];

// ============================================
// SECRETARIO/A
// ============================================

export const secretarioStats = [
  { label: 'Citas Hoy', value: '8', change: '2 pendientes', trend: 'neutral', icon: Calendar, color: 'blue', subtext: 'programadas' },
  { label: 'Audiencias Semana', value: '5', change: 'por preparar', trend: 'down', icon: Gavel, color: 'amber', subtext: 'expedientes' },
  { label: 'Llamadas', value: '12', change: 'atendidas hoy', trend: 'up', icon: Phone, color: 'emerald', subtext: '3 por devolver' },
  { label: 'Pendientes Archivo', value: '18', change: 'documentos', trend: 'down', icon: Archive, color: 'purple', subtext: 'por digitalizar' },
];

export const secretarioQuickActions = [
  { icon: Calendar, label: 'Nueva Cita', color: 'blue' },
  { icon: Phone, label: 'Registrar Llamada', color: 'emerald' },
  { icon: FileText, label: 'Digitalizar Doc', color: 'amber' },
  { icon: MessageSquare, label: 'Enviar Recordatorio', color: 'purple' },
  { icon: Gavel, label: 'Preparar Audiencia', color: 'cyan' },
  { icon: Users, label: 'Actualizar Directorio', color: 'rose' },
];

export const agendaGeneral = [
  { hora: '09:00', evento: 'Audiencia - Reclamación Banco', sala: 'Juzgado 5', abogado: 'Ana Martínez', estado: 'confirmado' },
  { hora: '11:00', evento: 'Reunión Cliente - Divorcio', sala: 'Sala A', abogado: 'Carlos Ruiz', estado: 'confirmado' },
  { hora: '14:00', evento: 'Entrega Documentación', sala: 'Oficina', abogado: 'Laura Soto', estado: 'pendiente' },
  { hora: '16:00', evento: 'Vista Oral - Despido', sala: 'Juzgado 3', abogado: 'Ana Martínez', estado: 'confirmado' },
];

// ============================================
// ADMINISTRADOR
// ============================================

export const administradorStats = [
  { label: 'Ingresos Mes', value: '€85.4K', change: '+12%', trend: 'up', icon: TrendingUp, color: 'emerald', subtext: 'facturado' },
  { label: 'Por Cobrar', value: '€125K', change: '8 facturas', trend: 'down', icon: CreditCard, color: 'amber', subtext: 'vencidas' },
  { label: 'Nómina Total', value: '€32K', change: '15 empleados', trend: 'neutral', icon: Users, color: 'blue', subtext: 'próximo pago' },
  { label: 'Gastos Mes', value: '€48K', change: '+5%', trend: 'down', icon: TrendingDown, color: 'red', subtext: 'vs presupuesto' },
  { label: 'Proveedores', value: '6', change: 'por pagar', trend: 'down', icon: Receipt, color: 'purple', subtext: 'esta semana' },
  { label: 'Presupuesto', value: '78%', change: 'ejecutado', trend: 'neutral', icon: PieChart, color: 'cyan', subtext: 'del mes' },
];

export const administradorQuickActions = [
  { icon: Receipt, label: 'Generar Factura', color: 'blue' },
  { icon: Wallet, label: 'Registrar Pago', color: 'emerald' },
  { icon: CheckCircle, label: 'Aprobar Gasto', color: 'amber' },
  { icon: Users, label: 'Generar Nómina', color: 'purple' },
  { icon: BarChart3, label: 'Reporte Financiero', color: 'cyan' },
  { icon: Receipt, label: 'Gestionar Proveedor', color: 'rose' },
];

// ============================================
// CONTADOR
// ============================================

export const contadorStats = [
  { label: 'Ingresos Acumulados', value: '€85.4K', change: '+15%', trend: 'up', icon: TrendingUp, color: 'emerald', subtext: 'del mes' },
  { label: 'Egresos', value: '€52.1K', change: '+8%', trend: 'down', icon: TrendingDown, color: 'red', subtext: 'del mes' },
  { label: 'Utilidad Neta', value: '€33.3K', change: '+28%', trend: 'up', icon: Wallet, color: 'blue', subtext: 'margen 39%' },
  { label: 'CxC Total', value: '€125K', change: 'prom 45 días', trend: 'down', icon: CreditCard, color: 'amber', subtext: 'por cobrar' },
  { label: 'CFDIs Emitidos', value: '45', change: '0 errores', trend: 'up', icon: Receipt, color: 'purple', subtext: 'este mes' },
  { label: 'Impuestos', value: '€12.5K', change: 'estimado', trend: 'neutral', icon: Calculator, color: 'cyan', subtext: 'por pagar' },
];

export const contadorQuickActions = [
  { icon: Receipt, label: 'Emitir CFDI', color: 'blue' },
  { icon: BookOpen, label: 'Generar Póliza', color: 'emerald' },
  { icon: FileText, label: 'Asiento Contable', color: 'amber' },
  { icon: CheckCircle, label: 'Conciliar Banco', color: 'purple' },
  { icon: Calculator, label: 'Calcular Impuestos', color: 'cyan' },
  { icon: BarChart3, label: 'Exportar Balanza', color: 'rose' },
];

export const cumplimientoFiscal = [
  { obligacion: 'Declaración IVA', fecha: '20 Ene', estado: 'pendiente', diasRestantes: 9 },
  { obligacion: 'Declaración ISR', fecha: '17 Feb', estado: 'pendiente', diasRestantes: 36 },
  { obligacion: 'Declaración DIOT', fecha: '17 Feb', estado: 'pendiente', diasRestantes: 36 },
  { obligacion: 'Opinión de Cumplimiento', fecha: 'Mensual', estado: 'vigente', diasRestantes: 0 },
];

// ============================================
// RECEPCIONISTA
// ============================================

export const recepcionistaStats = [
  { label: 'Citas Hoy', value: '8', change: '2 confirmadas', trend: 'neutral', icon: Calendar, color: 'blue', subtext: 'programadas' },
  { label: 'En Sala Espera', value: '2', change: '15 min espera', trend: 'neutral', icon: Users, color: 'amber', subtext: 'visitantes' },
  { label: 'Llamadas Pendientes', value: '4', change: 'por devolver', trend: 'down', icon: Phone, color: 'emerald', subtext: 'mensajes' },
  { label: 'Abogados Disp.', value: '5/8', change: 'en oficina', trend: 'neutral', icon: UserCheck, color: 'purple', subtext: 'disponibles' },
];

export const recepcionistaQuickActions = [
  { icon: Users, label: 'Registrar Visita', color: 'blue' },
  { icon: Calendar, label: 'Programar Cita', color: 'emerald' },
  { icon: Phone, label: 'Registrar Llamada', color: 'amber' },
  { icon: UserCheck, label: 'Nuevo Prospecto', color: 'purple' },
  { icon: MessageSquare, label: 'Notificar Llegada', color: 'cyan' },
  { icon: CheckCircle, label: 'Confirmar Cita', color: 'rose' },
];

export const salaEspera = [
  { nombre: 'Juan Martínez', horaLlegada: '09:30', motivo: 'Entrega documentos', abogado: 'Ana Martínez', tiempoEspera: '15 min' },
  { nombre: 'María García', horaLlegada: '09:45', motivo: 'Consulta inicial', abogado: 'Carlos Ruiz', tiempoEspera: '5 min' },
];

// Helper para obtener datos según rol
export function getDashboardData(role: UserRole) {
  switch (role) {
    case 'super_admin':
      return {
        stats: superAdminStats,
        quickActions: superAdminQuickActions,
        activities: superAdminActivities,
      };
    case 'socio':
      return {
        stats: socioStats,
        quickActions: socioQuickActions,
        casosAltoValor,
      };
    case 'abogado_senior':
      return {
        stats: abogadoSeniorStats,
        quickActions: abogadoSeniorQuickActions,
        casosJuniorSupervision,
      };
    case 'abogado_junior':
      return {
        stats: abogadoJuniorStats,
        quickActions: abogadoJuniorQuickActions,
      };
    case 'paralegal':
      return {
        stats: paralegalStats,
        quickActions: paralegalQuickActions,
        tramitesEnCurso,
      };
    case 'secretario':
      return {
        stats: secretarioStats,
        quickActions: secretarioQuickActions,
        agendaGeneral,
      };
    case 'administrador':
      return {
        stats: administradorStats,
        quickActions: administradorQuickActions,
      };
    case 'contador':
      return {
        stats: contadorStats,
        quickActions: contadorQuickActions,
        cumplimientoFiscal,
      };
    case 'recepcionista':
      return {
        stats: recepcionistaStats,
        quickActions: recepcionistaQuickActions,
        salaEspera,
      };
    default:
      return {
        stats: abogadoJuniorStats,
        quickActions: abogadoJuniorQuickActions,
      };
  }
}
