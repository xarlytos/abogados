import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Scale, Shield, Clock, FileText, TrendingUp, Users, Zap, CheckCircle, Star, BarChart3, Calendar, Briefcase } from 'lucide-react';

/* ─────────────────────────────────────────────
   Typing Effect Hook
   ───────────────────────────────────────────── */
function useTypingEffect(words: string[], typingSpeed = 80, deletingSpeed = 50, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        timeout = setTimeout(() => setDisplayText(currentWord.slice(0, displayText.length + 1)), typingSpeed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => setDisplayText(currentWord.slice(0, displayText.length - 1)), deletingSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return displayText;
}

/* ─────────────────────────────────────────────
   Animated Counter Hook
   ───────────────────────────────────────────── */
function useAnimatedCounter(target: number, duration = 2000, startDelay = 500) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, startDelay);
    return () => clearTimeout(delayTimeout);
  }, [target, duration, startDelay]);

  return count;
}

/* ─────────────────────────────────────────────
   Floating Particle Component
   ───────────────────────────────────────────── */
function FloatingParticle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: `radial-gradient(circle, rgba(245, 158, 11, 0.4), transparent)`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   Dashboard Mockup Component
   ───────────────────────────────────────────── */
function DashboardMockup() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActiveTab((prev) => (prev + 1) % 3), 3000);
    return () => clearInterval(interval);
  }, []);

  const tabs = ['Expedientes', 'Plazos', 'Facturación'];

  return (
    <div className="bg-theme-card rounded-2xl border border-theme overflow-hidden" style={{ boxShadow: '0 25px 60px -12px rgba(0,0,0,0.4), 0 0 40px rgba(245,158,11,0.08)' }}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-theme bg-theme-tertiary/50">
        <div className="w-3 h-3 bg-red-500/80 rounded-full" />
        <div className="w-3 h-3 bg-amber-500/80 rounded-full" />
        <div className="w-3 h-3 bg-green-500/80 rounded-full" />
        <span className="ml-3 text-xs text-theme-tertiary font-mono-data">DerechGo — Dashboard</span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-theme-hover rounded-lg p-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`flex-1 text-xs font-semibold py-2 rounded-md transition-all duration-300 ${activeTab === i
                  ? 'bg-accent text-white shadow-md'
                  : 'text-theme-tertiary hover:text-theme-primary'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Activos', value: '127', icon: Briefcase, color: 'text-amber-500' },
            { label: 'Esta semana', value: '8', icon: Calendar, color: 'text-emerald-500' },
            { label: 'Facturado', value: '24.5K€', icon: TrendingUp, color: 'text-blue-500' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="bg-theme-hover rounded-xl p-3 border border-theme"
              whileHover={{ scale: 1.02 }}
            >
              <stat.icon className={`w-4 h-4 ${stat.color} mb-1.5`} />
              <p className="text-lg font-bold text-theme-primary font-display">{stat.value}</p>
              <p className="text-[10px] text-theme-tertiary">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Mini chart */}
        <div className="bg-theme-hover rounded-xl p-4 border border-theme">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-theme-secondary">Actividad semanal</span>
            <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  background: i === 5
                    ? 'linear-gradient(to top, #f59e0b, #fbbf24)'
                    : 'var(--bg-tertiary)',
                }}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.8, delay: 0.8 + i * 0.1, ease: 'easeOut' }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
              <span key={d} className="text-[9px] text-theme-tertiary flex-1 text-center">{d}</span>
            ))}
          </div>
        </div>

        {/* Recent items */}
        <div className="space-y-2">
          {[
            { name: 'Expediente García vs. López', status: 'En curso', color: 'bg-amber-500' },
            { name: 'Recurso contencioso #4821', status: 'Urgente', color: 'bg-red-500' },
            { name: 'Contrato SL Inversiones', status: 'Completado', color: 'bg-emerald-500' },
          ].map((item, i) => (
            <motion.div
              key={item.name}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-theme-hover transition-colors border border-transparent hover:border-theme"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.15 }}
            >
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-xs text-theme-primary flex-1 truncate">{item.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.status === 'Urgente'
                  ? 'bg-red-500/15 text-red-400'
                  : item.status === 'Completado'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-amber-500/15 text-amber-400'
                }`}>
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Trust Badges
   ───────────────────────────────────────────── */
const trustBadges = [
  { icon: Shield, text: 'Certificado ENS' },
  { icon: Clock, text: 'Soporte 24/7' },
  { icon: FileText, text: 'RGPD Compliant' },
];

/* ─────────────────────────────────────────────
   HERO SECTION
   ───────────────────────────────────────────── */
export function HeroSection() {
  const typedWord = useTypingEffect(
    ['simplificada', 'inteligente', 'automatizada', 'sin límites'],
    90, 60, 2200
  );
  const despachoCount = useAnimatedCounter(500, 2500, 800);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax mouse effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  // Stagger children
  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ background: 'var(--bg-secondary)' }}
    >
      {/* ── Ambient Glow Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-60 -right-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Floating Particles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.6}
            x={Math.random() * 100}
            y={Math.random() * 100}
            size={3 + Math.random() * 5}
          />
        ))}
      </div>

      {/* ── Grid Pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-20 items-center">

          {/* ─── LEFT COLUMN ─── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold mb-8"
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  color: 'var(--accent-primary)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Scale className="w-4 h-4" />
                </motion.div>
                <span>El software legal #1 en España</span>
                <motion.span
                  className="w-2 h-2 rounded-full bg-emerald-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6 font-display"
            >
              <span className="text-theme-primary">Gestión legal</span>
              <br />
              <span className="relative">
                <span className="text-accent">{typedWord}</span>
                <motion.span
                  className="inline-block w-[3px] h-[0.9em] bg-accent ml-1 align-middle rounded-sm"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'steps(2)' }}
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl leading-relaxed mb-10 max-w-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              El software <strong>todo-en-uno</strong> diseñado por abogados para abogados.
              Gestiona expedientes, plazos y facturación en una{' '}
              <span className="text-accent font-semibold">sola plataforma</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
              {/* Primary CTA */}
              <motion.button
                className="group relative px-8 py-4 rounded-xl font-bold text-lg overflow-hidden flex items-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  color: '#fff',
                  boxShadow: '0 4px 15px rgba(245,158,11,0.35), 0 0 0 0 rgba(245,158,11,0)',
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 8px 30px rgba(245,158,11,0.45), 0 0 40px rgba(245,158,11,0.15)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%)',
                  }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative z-10">Empezar gratis</span>
                <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                className="group px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all duration-300"
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                }}
                whileHover={{
                  scale: 1.03,
                  borderColor: 'var(--accent-primary)',
                  boxShadow: '0 0 20px rgba(245,158,11,0.1)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                  <Play className="w-4 h-4 text-accent ml-0.5" />
                </div>
                Ver demo
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-8">
              {trustBadges.map((badge) => (
                <div
                  key={badge.text}
                  className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg"
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <badge.icon className="w-3.5 h-3.5 text-emerald-500" />
                  {badge.text}
                </div>
              ))}
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  { initials: 'MG', bg: 'linear-gradient(135deg, #f59e0b, #d97706)' },
                  { initials: 'CR', bg: 'linear-gradient(135deg, #10b981, #059669)' },
                  { initials: 'AM', bg: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
                  { initials: 'JL', bg: 'linear-gradient(135deg, #ec4899, #db2777)' },
                  { initials: '+', bg: 'linear-gradient(135deg, #64748b, #475569)' },
                ].map((avatar, i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2"
                    style={{
                      background: avatar.bg,
                      ringColor: 'var(--bg-secondary)',
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold text-theme-primary">+{despachoCount}</span> despachos confían en nosotros
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ─── RIGHT COLUMN — Dashboard ─── */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Glow behind dashboard */}
            <div
              className="absolute -inset-6 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.1) 0%, transparent 70%)',
                filter: 'blur(30px)',
              }}
            />

            {/* 3D perspective wrapper */}
            <motion.div
              style={{
                perspective: 1200,
                rotateX,
                rotateY,
              }}
              className="relative"
            >
              <DashboardMockup />
            </motion.div>

            {/* Floating Badge 1 */}
            <motion.div
              className="absolute -left-8 top-12 z-20"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <motion.div
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  backdropFilter: 'blur(16px)',
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-theme-primary font-bold">99.9% Uptime</p>
                  <p className="text-[10px] text-theme-tertiary">Garantizado</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Badge 2 */}
            <motion.div
              className="absolute -right-6 bottom-20 z-20"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              <motion.div
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  backdropFilter: 'blur(16px)',
                }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-theme-primary font-bold">IA integrada</p>
                  <p className="text-[10px] text-theme-tertiary">Asistente legal</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Badge 3 */}
            <motion.div
              className="absolute -right-2 top-6 z-20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            >
              <motion.div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs shadow-lg"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-theme-secondary font-medium">42 usuarios activos</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Bottom Metrics Strip ── */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          {[
            { value: '3x', label: 'Más productividad', icon: BarChart3 },
            { value: '85%', label: 'Menos tareas manuales', icon: Zap },
            { value: '0€', label: 'Coste de inicio', icon: TrendingUp },
            { value: '<5min', label: 'Tiempo de setup', icon: Clock },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              className="group text-center p-5 rounded-xl transition-all duration-300 cursor-default"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
              }}
              whileHover={{
                borderColor: 'var(--accent-primary)',
                boxShadow: '0 0 20px rgba(245,158,11,0.1)',
                y: -3,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
            >
              <metric.icon className="w-5 h-5 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-2xl md:text-3xl font-bold text-accent font-display">{metric.value}</p>
              <p className="text-xs text-theme-tertiary mt-1">{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-xs text-theme-tertiary">Descubre más</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
          style={{ borderColor: 'var(--border-hover)' }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-accent"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
