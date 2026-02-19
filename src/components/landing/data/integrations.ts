import {
  Mail,
  FileText,
  CreditCard,
  Cloud,
  MessageSquare,
  Calendar,
  HardDrive,
  Video,
  Briefcase,
  Building2,
  Gavel,
  BookOpen
} from 'lucide-react';

export const integrations = [
  {
    icon: Mail,
    name: 'Google Workspace',
    description: 'Sincroniza correos, calendarios y documentos con Google.',
    category: 'Productividad'
  },
  {
    icon: Mail,
    name: 'Microsoft 365',
    description: 'Integración completa con Outlook, Teams y SharePoint.',
    category: 'Productividad'
  },
  {
    icon: CreditCard,
    name: 'Stripe',
    description: 'Procesamiento de pagos y facturación recurrente.',
    category: 'Pagos'
  },
  {
    icon: CreditCard,
    name: 'PayPal',
    description: 'Pagos seguros y transferencias internacionales.',
    category: 'Pagos'
  },
  {
    icon: Cloud,
    name: 'Dropbox',
    description: 'Sincronización de archivos en la nube.',
    category: 'Almacenamiento'
  },
  {
    icon: HardDrive,
    name: 'Google Drive',
    description: 'Almacenamiento y colaboración en documentos.',
    category: 'Almacenamiento'
  },
  {
    icon: MessageSquare,
    name: 'Slack',
    description: 'Notificaciones y comunicación del equipo.',
    category: 'Comunicación'
  },
  {
    icon: Video,
    name: 'Zoom',
    description: 'Programación y registro de videollamadas.',
    category: 'Comunicación'
  },
  {
    icon: Calendar,
    name: 'Calendly',
    description: 'Programación automática de citas con clientes.',
    category: 'Calendario'
  },
  {
    icon: FileText,
    name: 'DocuSign',
    description: 'Firma electrónica de documentos legales.',
    category: 'Documentos'
  },
  {
    icon: Briefcase,
    name: 'LexNet',
    description: 'Acceso a expedientes judiciales electrónicos.',
    category: 'Legal'
  },
  {
    icon: Gavel,
    name: 'Poder Judicial',
    description: 'Consulta de actuaciones y estados procesales.',
    category: 'Legal'
  },
  {
    icon: BookOpen,
    name: 'BOE',
    description: 'Consulta directa al Boletín Oficial del Estado.',
    category: 'Legal'
  },
  {
    icon: Building2,
    name: 'Registro Mercantil',
    description: 'Consulta de empresas y actos mercantiles.',
    category: 'Legal'
  }
];
