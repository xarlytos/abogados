import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
  href?: string;
}

const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300';

const variants = {
  primary: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/25 hover:scale-105',
  secondary: 'bg-theme-tertiary text-theme-primary hover:bg-theme-hover border border-theme',
  outline: 'border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white',
  ghost: 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className = '',
  onClick,
  href,
}: ButtonProps) {
  const Component = motion[href ? 'a' : 'button'] as typeof motion.button;
  
  const props = href ? { href } : { onClick };

  return (
    <Component
      {...props}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </Component>
  );
}
