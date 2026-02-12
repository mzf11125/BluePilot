import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, id, className = '', ...props }: InputProps) => {
  const inputId = id || `input-${Math.random().toString(36).substring(7)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block font-bold mb-2 text-gray-900">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 border-3 border-black focus:outline-none focus:ring-4 focus:ring-sky/50 ${className}`}
        {...props}
      />
    </div>
  );
};
