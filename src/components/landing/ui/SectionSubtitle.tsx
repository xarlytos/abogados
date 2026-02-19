interface SectionSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionSubtitle({ children, className = '' }: SectionSubtitleProps) {
  return (
    <p className={`text-lg md:text-xl text-theme-secondary leading-relaxed ${className}`}>
      {children}
    </p>
  );
}
