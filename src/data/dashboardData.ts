import {
  FolderOpen,
  CreditCard,
  Clock,
  Users,
  Timer,
  Target,
  LayoutDashboard,
  Calendar,
  BarChart3,
  MessageSquare,
  BookOpen,
  CheckCircle2,
  X,
  Scale,
  AlertTriangle,
  Calendar as CalendarIcon,
} from 'lucide-react';

// ============================================
// DATOS DE EJEMPLO EXPANDIDOS
// ============================================

export const stats = [
  { label: 'Expedientes Activos', value: '127', change: '+12', trend: 'up', icon: FolderOpen, color: 'blue', subtext: 'vs mes anterior' },
  { label: 'Facturación Mes', value: '€45.2K', change: '+23%', trend: 'up', icon: CreditCard, color: 'emerald', subtext: 'objetivo: €50K' },
  { label: 'Plazos Esta Semana', value: '8', change: '2 urgentes', trend: 'down', icon: Clock, color: 'amber', subtext: '3 completados' },
  { label: 'Clientes Nuevos', value: '12', change: '+5', trend: 'up', icon: Users, color: 'purple', subtext: 'este mes' },
  { label: 'Horas Facturables', value: '164h', change: '+18h', trend: 'up', icon: Timer, color: 'rose', subtext: 'esta semana' },
  { label: 'Tasa de Éxito', value: '94%', change: '+2%', trend: 'up', icon: Target, color: 'cyan', subtext: 'casos ganados' },
];

export const recentCases = [
  { id: 'EXP-2024-001', title: 'Reclamación deuda Banco Santander', client: 'Juan Martínez', status: 'active', date: '15 Ene 2026', amount: '€15,000', priority: 'high', progress: 75, type: 'Civil' },
  { id: 'EXP-2024-002', title: 'Divorcio contencioso', client: 'María García', status: 'pending', date: '18 Ene 2026', amount: '€8,500', priority: 'medium', progress: 30, type: 'Familiar' },
  { id: 'EXP-2024-003', title: 'Despido improcedente TechCorp', client: 'Carlos López', status: 'active', date: '20 Ene 2026', amount: '€45,000', priority: 'high', progress: 60, type: 'Laboral' },
  { id: 'EXP-2024-004', title: 'Reclamación seguro hogar', client: 'Ana Rodríguez', status: 'closed', date: '10 Ene 2026', amount: '€12,000', priority: 'low', progress: 100, type: 'Civil' },
  { id: 'EXP-2024-005', title: 'Constitución SL Innovatech', client: 'Pedro Sánchez', status: 'active', date: '22 Ene 2026', amount: '€3,500', priority: 'medium', progress: 45, type: 'Mercantil' },
  { id: 'EXP-2024-006', title: 'Delito fiscal Hacienda', client: 'Empresa XYZ', status: 'urgent', date: '25 Ene 2026', amount: '€85,000', priority: 'high', progress: 15, type: 'Penal' },
];

export const upcomingDeadlines = [
  { title: 'Presentación escrito alegaciones', case: 'EXP-2024-001', caseTitle: 'Reclamación Banco Santander', date: 'Hoy, 14:00', urgent: true, type: 'Escrito', completed: false },
  { title: 'Vista oral juicio verbal', case: 'EXP-2024-003', caseTitle: 'Despido TechCorp', date: 'Mañana, 10:00', urgent: true, type: 'Vista', completed: false },
  { title: 'Entrega documentación cliente', case: 'EXP-2024-002', caseTitle: 'Divorcio García', date: '18 Ene, 16:00', urgent: false, type: 'Entrega', completed: false },
  { title: 'Reunión preparatoria', case: 'EXP-2024-005', caseTitle: 'Constitución SL', date: '20 Ene, 09:30', urgent: false, type: 'Reunión', completed: true },
  { title: 'Plazo prescripción recurso', case: 'EXP-2024-006', caseTitle: 'Delito fiscal XYZ', date: '22 Ene, 23:59', urgent: true, type: 'Plazo', completed: false },
];

export const notifications = [
  { id: 1, title: 'Nuevo expediente asignado', message: 'Se te ha asignado el caso EXP-2024-006 - Delito fiscal', time: '5 min', read: false, type: 'case', icon: FolderOpen },
  { id: 2, title: 'Plazo próximo crítico', message: 'Vence plazo en EXP-2024-001 en 2 horas', time: '1 h', read: false, type: 'urgent', icon: AlertTriangle },
  { id: 3, title: 'Pago recibido', message: 'El cliente Juan Martínez ha pagado la factura #234 - €5,000', time: '3 h', read: true, type: 'payment', icon: CreditCard },
  { id: 4, title: 'Nuevo mensaje', message: 'María García te ha enviado un mensaje', time: '5 h', read: true, type: 'message', icon: MessageSquare },
  { id: 5, title: 'Audiencia confirmada', message: 'Se ha confirmado la audiencia para el 25/01/2026', time: '1 d', read: true, type: 'calendar', icon: CalendarIcon },
];

export const tasks = [
  { id: 1, title: 'Revisar contrato de adhesión', completed: false, priority: 'high', dueDate: 'Hoy', case: 'EXP-2024-001' },
  { id: 2, title: 'Preparar informe pericial', completed: false, priority: 'medium', dueDate: 'Mañana', case: 'EXP-2024-003' },
  { id: 3, title: 'Llamar a cliente García', completed: true, priority: 'low', dueDate: 'Ayer', case: 'EXP-2024-002' },
  { id: 4, title: 'Actualizar estado expediente', completed: false, priority: 'medium', dueDate: '18 Ene', case: 'EXP-2024-005' },
  { id: 5, title: 'Solicitar documentación', completed: false, priority: 'high', dueDate: '19 Ene', case: 'EXP-2024-006' },
];

export const recentActivity = [
  { id: 1, user: 'Tú', action: 'actualizó', target: 'EXP-2024-001', time: '10 min', type: 'update' },
  { id: 2, user: 'Sistema', action: 'recordatorio de plazo', target: 'EXP-2024-003', time: '1 h', type: 'reminder' },
  { id: 3, user: 'María García', action: 'comentó en', target: 'EXP-2024-002', time: '2 h', type: 'comment' },
  { id: 4, user: 'Tú', action: 'subió documento a', target: 'EXP-2024-005', time: '3 h', type: 'upload' },
  { id: 5, user: 'Carlos López', action: 'pagó factura', target: '#234', time: '5 h', type: 'payment' },
];

export const financialData = {
  monthlyRevenue: [
    { month: 'Ene', value: 35000, target: 40000 },
    { month: 'Feb', value: 42000, target: 40000 },
    { month: 'Mar', value: 38000, target: 40000 },
    { month: 'Abr', value: 45000, target: 42000 },
    { month: 'May', value: 52000, target: 45000 },
    { month: 'Jun', value: 48000, target: 45000 },
    { month: 'Jul', value: 55000, target: 48000 },
    { month: 'Ago', value: 51000, target: 48000 },
    { month: 'Sep', value: 58000, target: 50000 },
    { month: 'Oct', value: 62000, target: 52000 },
    { month: 'Nov', value: 59000, target: 52000 },
    { month: 'Dic', value: 45200, target: 50000 },
  ],
  caseTypes: [
    { type: 'Civil', count: 45, percentage: 35, color: 'bg-blue-500' },
    { type: 'Laboral', count: 32, percentage: 25, color: 'bg-emerald-500' },
    { type: 'Penal', count: 24, percentage: 19, color: 'bg-red-500' },
    { type: 'Mercantil', count: 18, percentage: 14, color: 'bg-purple-500' },
    { type: 'Familiar', count: 9, percentage: 7, color: 'bg-amber-500' },
  ],
};

export const teamMembers = [
  { id: 1, name: 'Ana Martínez', role: 'Abogada Senior', avatar: 'AM', status: 'online', cases: 12 },
  { id: 2, name: 'Carlos Ruiz', role: 'Abogado', avatar: 'CR', status: 'busy', cases: 8 },
  { id: 3, name: 'Laura Soto', role: 'Paralegal', avatar: 'LS', status: 'online', cases: 15 },
  { id: 4, name: 'Pedro Gómez', role: 'Practicante', avatar: 'PG', status: 'offline', cases: 5 },
];

export const quickStats = [
  { label: 'Ganados', value: '47', color: 'emerald', icon: CheckCircle2 },
  { label: 'Perdidos', value: '3', color: 'red', icon: X },
  { label: 'Pendientes', value: '23', color: 'amber', icon: Clock },
];

export const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', active: true },
  { icon: FolderOpen, label: 'Expedientes', path: '/expedientes', active: false, badge: 6 },
  { icon: Calendar, label: 'Calendario', path: '/calendario', active: false, badge: 8 },
  { icon: Users, label: 'Clientes', path: '/clientes', active: false },
  { icon: BarChart3, label: 'Informes', path: '/informes', active: false },
  { icon: MessageSquare, label: 'Mensajes', path: '/mensajes', active: false, badge: 3 },
  { icon: CreditCard, label: 'Facturación', path: '/facturacion', active: false },
  { icon: BookOpen, label: 'Biblioteca', path: '/biblioteca', active: false },
];

export const quickActions = [
  { icon: FolderOpen, label: 'Nuevo expediente', color: 'blue' },
  { icon: Scale, label: 'Nuevo documento', color: 'purple' },
  { icon: Users, label: 'Nuevo cliente', color: 'emerald' },
  { icon: CreditCard, label: 'Nueva factura', color: 'amber' },
];

export const searchHistory = ['EXP-2024-001', 'María García', 'Divorcio', 'Reclamación banco'];
