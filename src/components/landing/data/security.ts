import {
  Shield,
  Lock,
  Server,
  Eye,
  FileCheck,
  Key,
  Database,
  Fingerprint,
  Globe,
  Clock
} from 'lucide-react';

export const securityFeatures = [
  {
    icon: Shield,
    title: 'Cifrado AES-256',
    description: 'Todos los datos se cifran en reposo y en tránsito con estándares bancarios.'
  },
  {
    icon: Lock,
    title: 'Autenticación 2FA',
    description: 'Doble factor de autenticación obligatorio para todos los usuarios.'
  },
  {
    icon: Server,
    title: 'Servidores en UE',
    description: 'Infraestructura AWS en Frankfurt y Dublin, cumpliendo GDPR.'
  },
  {
    icon: Eye,
    title: 'Control de Acceso',
    description: 'Permisos granulares y auditoría completa de todas las acciones.'
  },
  {
    icon: FileCheck,
    title: 'Certificación ISO 27001',
    description: 'Sistema de gestión de seguridad de la información certificado.'
  },
  {
    icon: Key,
    title: 'Gestión de Claves',
    description: 'Rotación automática de claves y HSM para máxima seguridad.'
  },
  {
    icon: Database,
    title: 'Backups Diarios',
    description: 'Copias de seguridad automáticas con retención de 30 días.'
  },
  {
    icon: Fingerprint,
    title: 'Biometría',
    description: 'Soporte para autenticación biométrica en dispositivos compatibles.'
  },
  {
    icon: Globe,
    title: 'WAF y DDoS Protection',
    description: 'Protección contra ataques con CloudFlare Enterprise.'
  },
  {
    icon: Clock,
    title: 'Monitoreo 24/7',
    description: 'Equipo de seguridad monitoreando la plataforma constantemente.'
  }
];

export const certifications = [
  'ISO 27001',
  'GDPR Compliant',
  'SOC 2 Type II',
  'eIDAS',
  'ISO 9001',
  'ENS Esquema Nacional'
];
