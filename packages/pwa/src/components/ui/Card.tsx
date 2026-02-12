import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export const Card = ({ children, className = '', interactive = false }: CardProps) => {
  const baseClasses = 'bg-white border-4 border-black shadow-brutal-lg p-6 transition-all duration-200';
  const interactiveClasses = interactive
    ? 'cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal active:translate-x-0 active:translate-y-0 active:shadow-brutal-lg'
    : '';

  return (
    <div className={`${baseClasses} ${interactiveClasses} ${className}`}>
      {children}
    </div>
  );
};
