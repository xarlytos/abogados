// ============================================
// GESTIÓN DE LISTA DE FIRMANTES
// ============================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, X, GripVertical, Mail, User, Shield,
  ArrowUp, ArrowDown, AlertCircle, CheckCircle,
  Clock, UserCheck, UserX
} from 'lucide-react';
import type { Signer, SignerListProps, SignerRole } from '@/types/signature';

const roleLabels: Record<SignerRole, { label: string; icon: typeof User; color: string }> = {
  cliente: { label: 'Cliente', icon: User, color: 'text-blue-400' },
  abogado: { label: 'Abogado', icon: Shield, color: 'text-emerald-400' },
  socio: { label: 'Socio', icon: Shield, color: 'text-amber-400' },
  testigo: { label: 'Testigo', icon: UserCheck, color: 'text-purple-400' },
  administrador: { label: 'Administrador', icon: Shield, color: 'text-orange-400' },
  contador: { label: 'Contador', icon: User, color: 'text-cyan-400' },
  otro: { label: 'Otro', icon: User, color: 'text-theme-secondary' },
};

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Pendiente' },
  signed: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Firmado' },
  rejected: { icon: UserX, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Rechazado' },
  expired: { icon: AlertCircle, color: 'text-theme-secondary', bg: 'bg-slate-500/10', label: 'Expirado' },
};

export function SignerList({
  signers,
  workflow,
  onAddSigner,
  onRemoveSigner,
  onUpdateSigner: _onUpdateSigner,
  onReorderSigners,
  readOnly = false,
  maxSigners = 50,
}: SignerListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSigner, setNewSigner] = useState<Partial<Signer>>({
    email: '',
    name: '',
    role: 'cliente',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const canAddMore = signers.length < maxSigners;

  // Validar email
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validar formulario
  const validateForm = useCallback((): boolean => {
    const newErrors: string[] = [];

    if (!newSigner.email?.trim()) {
      newErrors.push('El email es obligatorio');
    } else if (!validateEmail(newSigner.email)) {
      newErrors.push('El email no es válido');
    }

    if (!newSigner.name?.trim()) {
      newErrors.push('El nombre es obligatorio');
    }

    // Verificar email duplicado
    if (signers.some(s => s.email.toLowerCase() === newSigner.email?.toLowerCase())) {
      newErrors.push('Este email ya está en la lista');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [newSigner, signers]);

  // Agregar firmante
  const handleAdd = useCallback(() => {
    if (!validateForm()) return;

    onAddSigner({
      email: newSigner.email?.trim(),
      name: newSigner.name?.trim(),
      role: newSigner.role,
    });

    setNewSigner({ email: '', name: '', role: 'cliente' });
    setIsAdding(false);
    setErrors([]);
  }, [newSigner, onAddSigner, validateForm]);

  // Mover firmante (cambiar orden)
  const handleMove = useCallback((index: number, direction: 'up' | 'down') => {
    if (!onReorderSigners) return;
    
    const newSigners = [...signers];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newSigners.length) return;
    
    [newSigners[index], newSigners[newIndex]] = [newSigners[newIndex], newSigners[index]];
    
    // Actualizar orden
    const reordered = newSigners.map((s, i) => ({ ...s, order: i + 1 }));
    onReorderSigners(reordered);
  }, [signers, onReorderSigners]);

  return (
    <div className="space-y-4">
      {/* Lista de firmantes */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {signers.map((signer, index) => {
            const RoleIcon = roleLabels[signer.role].icon;
            const status = statusConfig[signer.status];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={signer.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="group flex items-center gap-3 p-3 bg-theme-tertiary/50 border border-theme-hover rounded-xl hover:border-theme transition-colors"
              >
                {/* Handle para drag (solo en flujo secuencial y si no es readonly) */}
                {workflow === 'sequential' && !readOnly && onReorderSigners && (
                  <div className="cursor-grab active:cursor-grabbing text-theme-muted">
                    <GripVertical className="w-4 h-4" />
                  </div>
                )}

                {/* Orden (solo en secuencial) */}
                {workflow === 'sequential' && (
                  <div className="w-6 h-6 rounded-full bg-theme-tertiary text-theme-secondary text-xs font-medium flex items-center justify-center">
                    {signer.order}
                  </div>
                )}

                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full bg-theme-tertiary flex items-center justify-center ${roleLabels[signer.role].color}`}>
                  <RoleIcon className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-theme-primary truncate">{signer.name}</p>
                    {readOnly && (
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-theme-secondary truncate">{signer.email}</p>
                </div>

                {/* Rol */}
                <span className="text-xs text-theme-muted capitalize hidden sm:block">
                  {roleLabels[signer.role].label}
                </span>

                {/* Controles de orden */}
                {workflow === 'sequential' && !readOnly && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-theme-muted hover:text-theme-primary hover:bg-theme-tertiary rounded disabled:opacity-30 transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === signers.length - 1}
                      className="p-1 text-theme-muted hover:text-theme-primary hover:bg-theme-tertiary rounded disabled:opacity-30 transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Eliminar */}
                {!readOnly && (
                  <button
                    onClick={() => onRemoveSigner(signer.id)}
                    className="p-2 text-theme-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Estado vacío */}
        {signers.length === 0 && !isAdding && (
          <div className="p-8 text-center border border-dashed border-theme-hover rounded-xl">
            <User className="w-12 h-12 text-theme-muted mx-auto mb-3" />
            <p className="text-theme-secondary text-sm">No hay firmantes agregados</p>
            <p className="text-theme-muted text-xs mt-1">Agrega al menos un firmante para continuar</p>
          </div>
        )}
      </div>

      {/* Formulario para agregar */}
      <AnimatePresence>
        {isAdding && !readOnly && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-theme-tertiary/30 border border-theme-hover rounded-xl space-y-3">
              {errors.length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  {errors.map((error, i) => (
                    <p key={i} className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {error}
                    </p>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-theme-secondary mb-1">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                    <input
                      type="text"
                      value={newSigner.name}
                      onChange={(e) => setNewSigner(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Juan Pérez"
                      className="w-full pl-9 pr-3 py-2 bg-theme-tertiary border border-theme-hover rounded-lg text-theme-primary text-sm placeholder-theme-muted focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-theme-secondary mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                    <input
                      type="email"
                      value={newSigner.email}
                      onChange={(e) => setNewSigner(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="ejemplo@email.com"
                      className="w-full pl-9 pr-3 py-2 bg-theme-tertiary border border-theme-hover rounded-lg text-theme-primary text-sm placeholder-theme-muted focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                  <label className="block text-xs text-theme-secondary mb-1">Rol</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(roleLabels) as SignerRole[]).map((role) => {
                    const Icon = roleLabels[role].icon;
                    return (
                      <button
                        key={role}
                        onClick={() => setNewSigner(prev => ({ ...prev, role }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                          newSigner.role === role
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-theme-tertiary text-theme-secondary border border-theme-hover hover:border-theme'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {roleLabels[role].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setErrors([]);
                    setNewSigner({ email: '', name: '', role: 'cliente' });
                  }}
                  className="px-4 py-2 text-sm text-theme-secondary hover:text-theme-primary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-amber-500 text-theme-secondary text-sm font-medium rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Agregar Firmante
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón agregar */}
      {!isAdding && !readOnly && canAddMore && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-4 border border-dashed border-theme-hover rounded-xl text-theme-muted hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm">Agregar firmante</span>
        </button>
      )}

      {/* Mensaje de límite alcanzado */}
      {!readOnly && !canAddMore && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-400">
            Has alcanzado el límite máximo de {maxSigners} firmantes
          </p>
        </div>
      )}

      {/* Info del flujo */}
      <div className="p-3 bg-theme-tertiary/30 border border-theme-hover/50 rounded-lg">
        <div className="flex items-center gap-2">
          {workflow === 'sequential' ? (
            <>
              <Clock className="w-4 h-4 text-theme-muted" />
              <p className="text-xs text-theme-secondary">
                <span className="text-theme-primary">Flujo secuencial:</span> Los firmantes recibirán las notificaciones en orden. Cada uno debe firmar antes de que el siguiente reciba la solicitud.
              </p>
            </>
          ) : (
            <>
              <User className="w-4 h-4 text-theme-muted" />
              <p className="text-xs text-theme-secondary">
                <span className="text-theme-primary">Flujo paralelo:</span> Todos los firmantes recibirán la solicitud simultáneamente y podrán firmar en cualquier orden.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Versión compacta para mostrar en listas
export function SignerListCompact({ 
  signers,
  showStatus = false,
}: { 
  signers: Signer[]; 
  showStatus?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {signers.slice(0, 3).map((signer) => {
        const RoleIcon = roleLabels[signer.role].icon;
        return (
          <div
            key={signer.id}
            className="flex items-center gap-2 px-2 py-1 bg-theme-tertiary border border-theme-hover rounded-lg"
          >
            <div className={`w-5 h-5 rounded-full bg-theme-tertiary flex items-center justify-center ${roleLabels[signer.role].color}`}>
              <RoleIcon className="w-3 h-3" />
            </div>
            <span className="text-xs text-theme-primary truncate max-w-[100px]">{signer.name}</span>
            {showStatus && signer.status !== 'pending' && (
              <span className={`w-2 h-2 rounded-full ${statusConfig[signer.status].bg.replace('/10', '')}`} />
            )}
          </div>
        );
      })}
      {signers.length > 3 && (
        <div className="px-2 py-1 bg-theme-tertiary border border-theme-hover rounded-lg">
          <span className="text-xs text-theme-secondary">+{signers.length - 3}</span>
        </div>
      )}
    </div>
  );
}

// Badge de estado de firma
export function SignatureStatusBadge({ status }: { status: Signer['status'] }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.bg.replace('bg-', 'border-').replace('/10', '/30')}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

export default SignerList;
