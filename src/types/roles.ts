// ============================================
// TIPOS Y DEFINICIONES DE ROLES
// ============================================

export type UserRole = 
  | 'super_admin'
  | 'socio'
  | 'abogado_senior'
  | 'abogado_junior'
  | 'paralegal'
  | 'secretario'
  | 'administrador'
  | 'contador'
  | 'recepcionista';

export interface RoleConfig {
  id: UserRole;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  permissions: RolePermissions;
}

export interface RolePermissions {
  canViewAllCases: boolean;
  canEditAllCases: boolean;
  canViewAllClients: boolean;
  canViewFinancialData: boolean;
  canEditFinancialData: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canAccessSettings: boolean;
  canApproveExpenses: boolean;
  canViewAuditLogs: boolean;
  modules: ModulePermissions;
}

export interface ModulePermissions {
  dashboard: boolean;
  expedientes: 'full' | 'own' | 'supervised' | 'support' | 'view' | 'none';
  clientes: 'full' | 'own' | 'basic' | 'view' | 'none';
  documentos: 'full' | 'own' | 'archive' | 'view' | 'none';
  facturacion: 'full' | 'view' | 'own' | 'none';
  agenda: 'full' | 'own' | 'limited' | 'general' | 'view' | 'none';
  reportes: 'full' | 'own' | 'financial' | 'basic' | 'none';
  configuracion: 'full' | 'limited' | 'none';
  usuarios: 'full' | 'view' | 'none';
  tiempo: 'full' | 'own' | 'view' | 'none';
  contabilidad: 'full' | 'view' | 'own' | 'none';
  biblioteca: boolean;
  mensajes: boolean;
}

// Configuración de los 9 roles
export const ROLES_CONFIG: Record<UserRole, RoleConfig> = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Administrador',
    description: 'Acceso total al sistema',
    icon: 'Crown',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    permissions: {
      canViewAllCases: true,
      canEditAllCases: true,
      canViewAllClients: true,
      canViewFinancialData: true,
      canEditFinancialData: true,
      canManageUsers: true,
      canViewReports: true,
      canAccessSettings: true,
      canApproveExpenses: true,
      canViewAuditLogs: true,
      modules: {
        dashboard: true,
        expedientes: 'full',
        clientes: 'full',
        documentos: 'full',
        facturacion: 'full',
        agenda: 'full',
        reportes: 'full',
        configuracion: 'full',
        usuarios: 'full',
        tiempo: 'full',
        contabilidad: 'full',
        biblioteca: true,
        mensajes: true,
      },
    },
  },
  socio: {
    id: 'socio',
    name: 'Socio / Director',
    description: 'Máxima autoridad del bufete',
    icon: 'Crown',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    permissions: {
      canViewAllCases: true,
      canEditAllCases: true,
      canViewAllClients: true,
      canViewFinancialData: true,
      canEditFinancialData: true,
      canManageUsers: true,
      canViewReports: true,
      canAccessSettings: true,
      canApproveExpenses: true,
      canViewAuditLogs: false,
      modules: {
        dashboard: true,
        expedientes: 'full',
        clientes: 'full',
        documentos: 'full',
        facturacion: 'full',
        agenda: 'full',
        reportes: 'full',
        configuracion: 'limited',
        usuarios: 'view',
        tiempo: 'full',
        contabilidad: 'full',
        biblioteca: true,
        mensajes: true,
      },
    },
  },
  abogado_senior: {
    id: 'abogado_senior',
    name: 'Abogado Senior',
    description: 'Casos complejos y supervisión',
    icon: 'Gavel',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    permissions: {
      canViewAllCases: false,
      canEditAllCases: false,
      canViewAllClients: false,
      canViewFinancialData: false,
      canEditFinancialData: false,
      canManageUsers: false,
      canViewReports: true,
      canAccessSettings: false,
      canApproveExpenses: false,
      canViewAuditLogs: false,
      modules: {
        dashboard: true,
        expedientes: 'supervised',
        clientes: 'own',
        documentos: 'full',
        facturacion: 'view',
        agenda: 'own',
        reportes: 'own',
        configuracion: 'none',
        usuarios: 'none',
        tiempo: 'full',
        contabilidad: 'view',
        biblioteca: true,
        mensajes: true,
      },
    },
  },
  abogado_junior: {
    id: 'abogado_junior',
    name: 'Abogado Junior',
    description: 'Casos bajo supervisión',
    icon: 'Briefcase',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    permissions: {
      canViewAllCases: false,
      canEditAllCases: false,
      canViewAllClients: false,
      canViewFinancialData: false,
      canEditFinancialData: false,
      canManageUsers: false,
      canViewReports: false,
      canAccessSettings: false,
      canApproveExpenses: false,
      canViewAuditLogs: false,
      modules: {
        dashboard: true,
        expedientes: 'own',
        clientes: 'own',
        documentos: 'own',
        facturacion: 'view',
        agenda: 'own',
        reportes: 'basic',
        configuracion: 'none',
        usuarios: 'none',
        tiempo: 'full',
        contabilidad: 'none',
        biblioteca: true,
        mensajes: true,
      },
    },
  },
  paralegal: {
    id: 'paralegal',
    name: 'Paralegal',
    description: 'Apoyo legal y documentos',
    icon: 'FileText',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-500/10',
    textColor: 'text-teal-400',
    permissions: {
      canViewAllCases: false,
      canEditAllCases: false,
      canViewAllClients: false,
      canViewFinancialData: false,
      canEditFinancialData: false,
      canManageUsers: false,
      canViewReports: false,
      canAccessSettings: false,
      canApproveExpenses: false,
      canViewAuditLogs: false,
      modules: {
        dashboard: true,
        expedientes: 'support',
        clientes: 'basic',
        documentos: 'own',
        facturacion: 'none',
        agenda: 'limited',
        reportes: 'none',
        configuracion: 'none',
        usuarios: 'none',
        tiempo: 'full',
        contabilidad: 'none',
        biblioteca: true,
        mensajes: true,
      },
    },
  },
  secretario: {
    id: 'secretario',
    name: 'Secretario/a Jurídico',
    description: 'Gestión documental y agenda',
    icon: 'ClipboardList',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    permissions: {
      canViewAllCases: false,
      canEditAllCases: false,
      canViewAllClients: true,
      canViewFinancialData: false,
      canEditFinancialData: false,
      canManageUsers: false,
      canViewReports: false,
      canAccessSettings: false,
      canApproveExpenses: false,
      canViewAuditLogs: false,
      modules: {
        dashboard: true,
        expedientes: 'view',
        clientes: 'basic',
        documentos: 'archive',
        facturacion: 'none',
        agenda: 'general',
        reportes: 'none',
        configuracion: 'none',
        usuarios: 'none',
        tiempo: 'none',
        contabilidad: 'none',
        biblioteca: true,
        mensajes: true,
      },
    },
  },
  administrador: {
    id: 'administrador',
    name: 'Administrador',
    description: 'Gestión operativa y RRHH',
    icon: 'Users',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    permissions: {
      canViewAllCases: false,
      canEditAllCases: false,
      canViewAllClients: true,
      canViewFinancialData: true,
      canEditFinancialData: true,
      canManageUsers: true,
      canViewReports: true,
      canAccessSettings: true,
      canApproveExpenses: true,
      canViewAuditLogs: false,
      modules: {
        dashboard: true,
        expedientes: 'view',
        clientes: 'full',
        documentos: 'view',
        facturacion: 'full',
        agenda: 'view',
        reportes: 'financial',
        configuracion: 'limited',
        usuarios: 'view',
        tiempo: 'view',
        contabilidad: 'full',
        biblioteca: true,
        mensajes: true,
      },
    },
  },
  contador: {
    id: 'contador',
    name: 'Contador / Finanzas',
    description: 'Contabilidad y finanzas',
    icon: 'Calculator',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    permissions: {
      canViewAllCases: false,
      canEditAllCases: false,
      canViewAllClients: false,
      canViewFinancialData: true,
      canEditFinancialData: true,
      canManageUsers: false,
      canViewReports: true,
      canAccessSettings: false,
      canApproveExpenses: false,
      canViewAuditLogs: false,
      modules: {
        dashboard: true,
        expedientes: 'none',
        clientes: 'none',
        documentos: 'view',
        facturacion: 'full',
        agenda: 'view',
        reportes: 'full',
        configuracion: 'none',
        usuarios: 'none',
        tiempo: 'view',
        contabilidad: 'full',
        biblioteca: true,
        mensajes: true,
      },
    },
  },
  recepcionista: {
    id: 'recepcionista',
    name: 'Recepcionista',
    description: 'Atención y citas',
    icon: 'Phone',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-400',
    permissions: {
      canViewAllCases: false,
      canEditAllCases: false,
      canViewAllClients: true,
      canViewFinancialData: false,
      canEditFinancialData: false,
      canManageUsers: false,
      canViewReports: false,
      canAccessSettings: false,
      canApproveExpenses: false,
      canViewAuditLogs: false,
      modules: {
        dashboard: true,
        expedientes: 'none',
        clientes: 'basic',
        documentos: 'none',
        facturacion: 'none',
        agenda: 'limited',
        reportes: 'none',
        configuracion: 'none',
        usuarios: 'none',
        tiempo: 'none',
        contabilidad: 'none',
        biblioteca: false,
        mensajes: true,
      },
    },
  },
};

// Helper para obtener el rol del localStorage
export function getCurrentRole(): UserRole {
  const role = localStorage.getItem('userRole') as UserRole;
  return role && ROLES_CONFIG[role] ? role : 'abogado_junior';
}

// Helper para obtener la configuración del rol
export function getRoleConfig(role: UserRole): RoleConfig {
  return ROLES_CONFIG[role] || ROLES_CONFIG.abogado_junior;
}
