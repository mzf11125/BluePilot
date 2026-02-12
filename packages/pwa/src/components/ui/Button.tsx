import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyber' | 'terminal' | 'neon';
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const Button = ({ variant = 'cyber', children, className = '', fullWidth = false, ...props }: ButtonProps) => {
  const variants = {
    cyber: 'btn-cyber text-dark-text border-neon-pink hover:bg-dark-surface hover:border-neon-green hover:text-cyber-primary hover:shadow-glow',
    terminal: 'bg-dark-surface border-cyber-primary font-mono text-neon-green hover:shadow-inner btn-terminal',
    neon: `btn-neon-green text-black btn-neon-green-glow border-neon-green hover:bg-neon-green hover:shadow-neon-green-glow',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${variants[variant]} ${widthClass} ${className} group relative`}
      style={{
        clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 2px), 10px 100%)',
      }}
      {...props}
    >
      {children}
    </button>
  );
};
