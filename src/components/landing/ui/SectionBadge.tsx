interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionBadge({ children, className = '' }: SectionBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium ${className}`}>
      {children}
    </span>
  );
}
