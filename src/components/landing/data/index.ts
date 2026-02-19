// Features
export { features } from './features';

// Integrations
export { integrations } from './integrations';

// Comparison
export { comparisonData } from './comparison';

// Metrics
export { metrics } from './metrics';

// Case Studies
export { caseStudies } from './caseStudies';

// Team
export { team } from './team';

// Roadmap
export { roadmapItems as roadmap } from './roadmap';

// Security
export { securityFeatures, certifications } from './security';

// Demo Tabs
export { demoTabs } from './demoTabs';

// ============================================
// Additional data needed by sections
// ============================================

import {
  Building2,
  FolderOpen,
  TrendingUp,
  Clock,
  FolderOpen as PainFolder,
  Users,
  Clock as PainClock,
  Zap,
  Heart,
  Target,
  Award,
  Video,
  UploadCloud,
  Settings,
  BookOpen,
  Mail,
  Twitter,
  Linkedin,
  Github,
  Server,
  FileCheck,
  Fingerprint,
  KeyRound,
  EyeOff,
  Smartphone,
  WifiOff,
  Bell,
  Mic,
  ShieldPlus,
} from 'lucide-react';

// Stats
export const stats = [
  { value: 500, suffix: '+', label: 'Despachos activos', icon: Building2 },
  { value: 2.5, suffix: 'M', label: 'Expedientes gestionados', icon: FolderOpen },
  { value: 35, suffix: '%', label: 'Aumento facturación media', icon: TrendingUp },
  { value: 48, suffix: 'h', label: 'Implementación', icon: Clock },
];

// Pain Points
export const painPoints = [
  {
    icon: PainFolder,
    title: 'Expedientes dispersos en múltiples carpetas',
    description: '45 minutos buscando entre locales, emails y USBs. El cliente espera mientras pierdes credibilidad.',
    cost: '187€ facturables perdidos',
  },
  {
    icon: Users,
    title: 'Falta de coordinación entre el equipo',
    description: 'Tres emails internos. Dos llamadas. Una hora perdida. El cliente percibe desorganización.',
    cost: 'Fuga de cliente: -3.200€/año',
  },
  {
    icon: PainClock,
    title: 'Plazos de prescripción olvidados',
    description: 'El calendario de uno falló. El backup era un Post-it. Ahora hay consecuencias legales graves.',
    cost: 'Indemnización: 15.000€ + reputación',
  },
];

// Why Choose Us
export const whyChooseUs = [
  { icon: Zap, title: 'Implementación Express', description: '48 horas y tu despacho está operativo. Sin downtime, sin migrañas.' },
  { icon: Heart, title: 'Soporte Humano Real', description: 'Expertos legal-tech que entienden tu negocio, no robots genéricos.' },
  { icon: Target, title: 'Diseñado por Abogados', description: 'Creado con feedback de 200+ despachos. Sabemos lo que necesitas.' },
  { icon: Award, title: 'Garantía de Resultados', description: 'Si no reduces horas admin en 30 días, te devolvemos el dinero.' },
];

// Process Steps
export const processSteps = [
  { number: 1, title: 'Demo Personalizada', description: 'Conoce la plataforma con un especialista que entiende tus necesidades específicas.', icon: Video },
  { number: 2, title: 'Migración de Datos', description: 'Nosotros importamos toda tu información histórica. Cero trabajo para tu equipo.', icon: UploadCloud },
  { number: 3, title: 'Configuración', description: 'Personalizamos workflows, plantillas y permisos según tu forma de trabajar.', icon: Settings },
  { number: 4, title: 'Capacitación', description: 'Formación completa para tu equipo con sesiones grabadas y documentación.', icon: BookOpen },
];

// Testimonials
export const testimonials = [
  { name: 'María González', role: 'Socia Fundadora', firm: 'González & Asociados', content: 'Pasamos de perder expedientes constantemente a tener todo centralizado. Hemos aumentado nuestra facturación un 35% en solo 6 meses.', rating: 5, image: 'MG', featured: true },
  { name: 'Carlos Ruiz', role: 'Director Legal', firm: 'Ruiz Abogados', content: 'La sincronización con e-CIFT nos ha salvado de perder plazos críticos más de una vez. El ROI se pagó solo en la primera semana.', rating: 5, image: 'CR' },
  { name: 'Ana Martínez', role: 'Abogada Senior', firm: 'Martínez Legal', content: 'Finalmente un software que entiende cómo trabajamos los abogados. La búsqueda por conceptos jurídicos es una revolución.', rating: 5, image: 'AM' },
  { name: 'Javier López', role: 'Socio', firm: 'López & Partners', content: 'Implementación impecable en 48 horas. El equipo de soporte realmente entiende el sector legal.', rating: 5, image: 'JL' },
  { name: 'Patricia Soto', role: 'Directora General', firm: 'Soto Abogados', content: 'Hemos reducido el tiempo de gestión administrativa en un 60%. Ahora podemos dedicarnos a lo que realmente importa.', rating: 5, image: 'PS' },
];

// FAQs
export const faqs = [
  { question: '¿Es seguro con datos de clientes?', answer: 'Cifrado AES-256 en tránsito y en reposo. Servidores exclusivos en la UE (Frankfurt). Cumplimiento LOPD/GDPR por diseño, con acuerdos de tratamiento de datos específicos para despachos. Además, contamos con certificación ISO 27001.' },
  { question: '¿Y si somos solo 3 personas?', answer: 'Plan boutique escalable. Empiezas con lo esencial: gestión de expedientes, calendario de plazos y facturación integrada. Añades módulos cuando creces. Perfecto para despachos en crecimiento.' },
  { question: '¿Migrar los datos será un dolor?', answer: 'Nosotros migramos tus Excel, Word y PDFs existentes. Tú no tocas nada. Importación automatizada + revisión humana de nuestro equipo legal-tech. Garantía de migración completa o te devolvemos el dinero.' },
  { question: '¿Cuánto tiempo tarda la implementación?', answer: 'Implementación completa en 48 horas. Incluye migración de datos, configuración personalizada y capacitación del equipo. Empiezas a usarlo el mismo día. Soporte dedicado durante las primeras 2 semanas.' },
  { question: '¿Funciona en móvil y tablet?', answer: 'Sí, plataforma 100% responsive con apps nativas para iOS y Android. Accede a tus expedientes desde cualquier lugar, incluso en el juzgado. Modo offline disponible.' },
  { question: '¿Qué pasa si quiero cancelar?', answer: 'Sin permanencia. Puedes exportar todos tus datos en cualquier momento en formatos estándar (Excel, PDF, etc). Tu información siempre es tuya. Exportación completa garantizada.' },
];

// Blog Posts
export const blogPosts = [
  { title: 'Cómo reducir 10 horas semanales de administración en tu despacho', excerpt: 'Descubre las 5 tácticas que usan los despachos más eficientes para eliminar tareas repetitivas.', category: 'Productividad', date: '8 Feb 2026', readTime: '5 min', image: '⏱️', author: { name: 'Carmen Ruiz', avatar: 'CR' } },
  { title: 'GDPR en despachos de abogados: Guía completa 2026', excerpt: 'Todo lo que necesitas saber para cumplir con la normativa de protección de datos en tu práctica legal.', category: 'Compliance', date: '5 Feb 2026', readTime: '8 min', image: '🔒', author: { name: 'Alejandro Torres', avatar: 'AT' } },
  { title: 'El futuro de la abogacía: IA y automatización legal', excerpt: 'Cómo la inteligencia artificial está transformando el sector y cómo puedes aprovecharla.', category: 'Tecnología', date: '1 Feb 2026', readTime: '6 min', image: '🤖', author: { name: 'Miguel Sánchez', avatar: 'MS' } },
];

// Security Badges
export const securityBadges = [
  { icon: ShieldPlus, title: 'Cifrado AES-256', description: 'En tránsito y reposo' },
  { icon: Server, title: 'Servidores UE', description: 'Frankfurt & Madrid' },
  { icon: FileCheck, title: 'ISO 27001', description: 'Certificación internacional' },
  { icon: Fingerprint, title: 'GDPR Compliant', description: 'LOPD española' },
  { icon: KeyRound, title: '2FA', description: 'Doble factor autenticación' },
  { icon: EyeOff, title: 'Auditoría Logs', description: 'Trazabilidad completa' },
];

// App Features
export const appFeatures = [
  { icon: Smartphone, title: 'App Nativa iOS & Android', description: 'Experiencia fluida optimizada para cada plataforma' },
  { icon: WifiOff, title: 'Modo Offline', description: 'Trabaja sin conexión y sincroniza al recuperarla' },
  { icon: Bell, title: 'Notificaciones Push', description: 'Alertas instantáneas de plazos y mensajes' },
  { icon: Fingerprint, title: 'Face ID / Touch ID', description: 'Acceso seguro biométrico a tu información' },
  { icon: FileCheck, title: 'Escáner de Documentos', description: 'Digitaliza y sube documentos con la cámara' },
  { icon: Mic, title: 'Notas de Voz', description: 'Dicta memoriales y notas que se transcriben automáticamente' },
];

// Webinars
export const webinars = [
  { title: 'Productividad Legal 2026', date: '15 Feb 2026', time: '16:00 CET', speaker: 'Dra. Carmen Ruiz', topic: 'Tácticas avanzadas de gestión del tiempo para abogados', attendees: 234 },
  { title: 'IA en el Derecho', date: '22 Feb 2026', time: '17:00 CET', speaker: 'Miguel Sánchez', topic: 'Cómo aprovechar la IA sin perder el toque humano', attendees: 189 },
  { title: 'Compliance Digital', date: '1 Mar 2026', time: '16:00 CET', speaker: 'Dr. Alejandro Torres', topic: 'Protección de datos y seguridad en despachos modernos', attendees: 156 },
];

// Navigation Links
export const navLinks = [
  { id: 'producto', label: 'Producto', href: '#producto' },
  { id: 'solucion', label: 'Solución', href: '#solucion' },
  { id: 'caracteristicas', label: 'Características', href: '#caracteristicas' },
  { id: 'casos', label: 'Casos', href: '#casos' },
  { id: 'precios', label: 'Precios', href: '#precios' },
  { id: 'recursos', label: 'Recursos', href: '#recursos' },
];

// Footer Links
export const footerLinks = [
  {
    title: 'Producto',
    links: ['Características', 'Integraciones', 'Precios', 'Roadmap', 'API']
  },
  {
    title: 'Empresa',
    links: ['Sobre nosotros', 'Equipo', 'Blog', 'Carreras', 'Contacto']
  },
  {
    title: 'Legal',
    links: ['Privacidad', 'Términos', 'Cookies', 'GDPR', 'Seguridad']
  },
];

export const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' },
];
