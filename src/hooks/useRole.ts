import { useState, useEffect } from 'react';
import type { UserRole, RoleConfig } from '@/types/roles';
import { getCurrentRole, getRoleConfig } from '@/types/roles';

export interface UseRoleReturn {
  role: UserRole;
  roleConfig: RoleConfig;
  roleName: string;
  isLoading: boolean;
  hasPermission: (permission: keyof RoleConfig['permissions']) => boolean;
  hasModuleAccess: (module: keyof RoleConfig['permissions']['modules']) => boolean;
  canAccessPath: (path: string) => boolean;
  refreshRole: () => void;
}

export function useRole(): UseRoleReturn {
  const [role, setRole] = useState<UserRole>('abogado_junior');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    refreshRole();
  }, []);

  const refreshRole = () => {
    const currentRole = getCurrentRole();
    setRole(currentRole);
    setIsLoading(false);
  };

  const roleConfig = getRoleConfig(role);

  const hasPermission = (permission: keyof RoleConfig['permissions']): boolean => {
    return !!roleConfig.permissions[permission];
  };

  const hasModuleAccess = (module: keyof RoleConfig['permissions']['modules']): boolean => {
    const access = roleConfig.permissions.modules[module];
    if (typeof access === 'boolean') return access;
    return access !== 'none';
  };

  const canAccessPath = (path: string): boolean => {
    // Mapeo de rutas a módulos
    const pathToModule: Record<string, keyof RoleConfig['permissions']['modules']> = {
      '/dashboard': 'dashboard',
      '/expedientes': 'expedientes',
      '/clientes': 'clientes',
      '/calendario': 'agenda',
      '/facturacion': 'facturacion',
      '/informes': 'reportes',
      '/mensajes': 'mensajes',
      '/biblioteca': 'biblioteca',
    };

    // Siempre permitir dashboard y login
    if (path === '/dashboard' || path === '/login') return true;

    const module = pathToModule[path];
    if (!module) return false;

    return hasModuleAccess(module);
  };

  return {
    role,
    roleConfig,
    roleName: roleConfig.name,
    isLoading,
    hasPermission,
    hasModuleAccess,
    canAccessPath,
    refreshRole,
  };
}
