import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-sky text-white hover:bg-sky-600 disabled:bg-sky-300',
    secondary: 'bg-white text-black hover:bg-gray-50 disabled:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300'
  };

  return (
    <button
      className={`px-6 py-3 font-bold border-3 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutal ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
