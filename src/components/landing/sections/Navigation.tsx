import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ThemeToggleSimple } from '../../ThemeToggle';

// Links de navegación actualizados con las secciones reales de la landing
const navLinks = [
  { id: 'problema', label: 'Problema', href: '#problema' },
  { id: 'solucion', label: 'Solución', href: '#solucion' },
  { id: 'caracteristicas', label: 'Características', href: '#caracteristicas' },
  { id: 'casos', label: 'Casos', href: '#casos' },
  { id: 'precios', label: 'Precios', href: '#precios' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-theme-card/90 backdrop-blur-xl border-b border-theme'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-theme-primary">
                Derecho<span className="text-amber-500">.ERP</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-theme-secondary hover:text-theme-primary transition-colors duration-300 text-sm font-medium cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA Buttons + Theme Toggle */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggleSimple />
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Comenzar Gratis
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-theme-tertiary flex items-center justify-center text-theme-primary"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-theme-primary/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute top-20 left-0 right-0 p-4">
              <div className="bg-theme-secondary border border-theme rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-theme">
                  <span className="text-theme-secondary text-sm">Tema</span>
                  <ThemeToggleSimple />
                </div>
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block text-theme-secondary hover:text-theme-primary transition-colors duration-300 text-lg font-medium py-2"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-theme space-y-3">
                  <Link to="/login" className="block w-full">
                    <Button variant="secondary" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/register" className="block w-full">
                    <Button variant="primary" className="w-full">
                      Comenzar Gratis
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
