import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white border-4 border-black shadow-brutal-lg p-6 ${className}`}>
      {children}
    </div>
  );
};
