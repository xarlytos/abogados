import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, Mail, Lock, Eye, EyeOff, ArrowRight, 
  Github, Twitter, ShieldCheck, ArrowLeft,
  CheckCircle, Sparkles, User, Crown, Briefcase, 
  Gavel, Users, FileText, ClipboardList, Calculator,
  Phone, ChevronDown, ChevronUp
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggleSimple } from '@/components/ThemeToggle';

// Definición de los 9 roles del ERP Bufete
const ROLES_ERP = [
  {
    id: 'super_admin',
    name: 'Super Administrador',
    description: 'Acceso total al sistema',
    icon: Crown,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    textColor: 'text-purple-400',
    credentials: { email: 'superadmin@derecho.erp', password: 'super123' }
  },
  {
    id: 'socio',
    name: 'Socio / Director',
    description: 'Máxima autoridad del bufete',
    icon: Crown,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    textColor: 'text-amber-400',
    credentials: { email: 'socio@derecho.erp', password: 'socio123' }
  },
  {
    id: 'abogado_senior',
    name: 'Abogado Senior',
    description: 'Casos complejos y supervisión',
    icon: Gavel,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-400',
    credentials: { email: 'senior@derecho.erp', password: 'senior123' }
  },
  {
    id: 'abogado_junior',
    name: 'Abogado Junior',
    description: 'Casos bajo supervisión',
    icon: Briefcase,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
    credentials: { email: 'junior@derecho.erp', password: 'junior123' }
  },
  {
    id: 'paralegal',
    name: 'Paralegal',
    description: 'Apoyo legal y documentos',
    icon: FileText,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20',
    textColor: 'text-teal-400',
    credentials: { email: 'paralegal@derecho.erp', password: 'paralegal123' }
  },
  {
    id: 'secretario',
    name: 'Secretario/a Jurídico',
    description: 'Gestión documental y agenda',
    icon: ClipboardList,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    textColor: 'text-emerald-400',
    credentials: { email: 'secretario@derecho.erp', password: 'secretario123' }
  },
  {
    id: 'administrador',
    name: 'Administrador',
    description: 'Gestión operativa y RRHH',
    icon: Users,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    textColor: 'text-orange-400',
    credentials: { email: 'admin@derecho.erp', password: 'admin123' }
  },
  {
    id: 'contador',
    name: 'Contador / Finanzas',
    description: 'Contabilidad y finanzas',
    icon: Calculator,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    textColor: 'text-green-400',
    credentials: { email: 'contador@derecho.erp', password: 'contador123' }
  },
  {
    id: 'recepcionista',
    name: 'Recepcionista',
    description: 'Atención y citas',
    icon: Phone,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    textColor: 'text-pink-400',
    credentials: { email: 'recepcion@derecho.erp', password: 'recepcion123' }
  }
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRoles, setShowRoles] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simular login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validar credenciales contra los roles definidos
    const matchedRole = ROLES_ERP.find(
      role => role.credentials.email === email && role.credentials.password === password
    );
    
    if (matchedRole) {
      // Guardar rol en localStorage para usar en el dashboard
      localStorage.setItem('userRole', matchedRole.id);
      localStorage.setItem('userRoleName', matchedRole.name);
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    } else {
      setError('Credenciales incorrectas. Selecciona un rol de prueba abajo.');
    }
    
    setIsLoading(false);
  };

  const selectRole = (role: typeof ROLES_ERP[0]) => {
    setEmail(role.credentials.email);
    setPassword(role.credentials.password);
    setSelectedRole(role.id);
    setError('');
  };

  return (
    <div className="min-h-screen bg-theme-primary flex">
      {/* Left Side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-theme-primary" />
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Animated background shapes */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-theme-primary">DERECHO<span className="text-amber-500">.ERP</span></span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-theme-primary leading-tight">
              Bienvenido de vuelta a tu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                despacho digital
              </span>
            </h2>
            <p className="text-theme-secondary text-lg max-w-md">
              Gestiona tus expedientes, plazos y facturación desde cualquier lugar. Más de 500 despachos confían en nosotros.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { icon: ShieldCheck, text: 'Seguridad bancaria con cifrado AES-256' },
                { icon: CheckCircle, text: 'Acceso desde cualquier dispositivo' },
                { icon: Sparkles, text: 'IA integrada para búsqueda de jurisprudencia' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-theme-secondary">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-theme-tertiary">
            © 2026 Derecho ERP. Todos los derechos reservados.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto relative">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggleSimple />
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-theme-primary">DERECHO<span className="text-amber-500">.ERP</span></span>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-theme-primary mb-2">Iniciar sesión</h1>
            <p className="text-theme-secondary">¿No tienes cuenta?{' '}
              <Link to="/register" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
                Crear cuenta
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: GoogleIcon, label: 'Google' },
              { icon: Github, label: 'GitHub' },
              { icon: Twitter, label: 'Twitter' },
            ].map((provider) => (
              <motion.button
                key={provider.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-theme-secondary border border-theme rounded-xl text-theme-secondary hover:border-amber-500/30 hover:text-theme-primary transition-colors"
              >
                <provider.icon className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">{provider.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-theme" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-theme-primary text-theme-tertiary">O continúa con email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-tertiary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@despacho.com"
                    className="w-full pl-12 pr-4 py-4 bg-theme-secondary border border-theme rounded-xl text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-tertiary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-theme-secondary border border-theme rounded-xl text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-tertiary hover:text-theme-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-red-400 text-sm text-center">{error}</p>
              </motion.div>
            )}

            {/* Roles Selector */}
            <div className="border border-theme rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowRoles(!showRoles)}
                className="w-full p-4 bg-theme-secondary flex items-center justify-between hover:bg-theme-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-amber-500" />
                  <div className="text-left">
                    <span className="text-sm font-semibold text-amber-500">Acceso Rápido por Rol</span>
                    <p className="text-xs text-theme-tertiary">Selecciona un rol de prueba</p>
                  </div>
                </div>
                {showRoles ? (
                  <ChevronUp className="w-5 h-5 text-theme-tertiary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-theme-tertiary" />
                )}
              </button>

              {showRoles && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-theme"
                >
                  <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                    {ROLES_ERP.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => selectRole(role)}
                          className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                            isSelected
                              ? `${role.bgColor} border ${role.borderColor}`
                              : 'hover:bg-theme-hover/50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className={`text-sm font-medium ${isSelected ? role.textColor : 'text-theme-primary'}`}>
                              {role.name}
                            </p>
                            <p className="text-xs text-theme-tertiary truncate">{role.description}</p>
                          </div>
                          {isSelected && (
                            <CheckCircle className={`w-5 h-5 ${role.textColor} flex-shrink-0`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-theme bg-theme-secondary text-amber-500 focus:ring-amber-500 focus:ring-offset-theme-primary"
                />
                <span className="text-sm text-theme-secondary">Recordarme</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-amber-500 hover:text-amber-400 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Back to home */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-theme-tertiary hover:text-theme-secondary transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Google Icon Component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
