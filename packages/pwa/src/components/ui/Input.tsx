import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && <label className="block font-bold mb-2">{label}</label>}
      <input
        className={`w-full px-4 py-3 border-3 border-black focus:outline-none focus:ring-4 focus:ring-sky ${className}`}
        {...props}
      />
    </div>
  );
};
