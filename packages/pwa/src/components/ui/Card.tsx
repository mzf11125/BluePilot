import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  variant?: 'cyber' | 'terminal';
}

export const Card = ({ children, className = '', interactive = false, variant = 'cyber' }: CardProps) => {
  const variants = {
    cyber: 'card-cyber bg-dark-surface border-cyber-primary',
    terminal: 'card-terminal bg-dark-surface border-cyber-primary font-mono',
  };

  return (
    <div className={`${variants[variant]} ${interactive ? 'card-cyber-interactive cursor-pointer' : ''} ${className} group`}>
      {children}
    </div>
  );
};
