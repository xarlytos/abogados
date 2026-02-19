interface SectionTitleProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export function SectionTitle({ children, as: Component = 'h2', className = '' }: SectionTitleProps) {
  return (
    <Component className={`text-3xl md:text-4xl lg:text-5xl font-bold text-theme-primary leading-tight ${className}`}>
      {children}
    </Component>
  );
}
