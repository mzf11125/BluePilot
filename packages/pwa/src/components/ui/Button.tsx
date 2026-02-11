import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-sky text-white hover:bg-sky-600',
    secondary: 'bg-white text-black hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <button
      className={`px-6 py-3 font-bold border-3 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
