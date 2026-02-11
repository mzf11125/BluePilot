interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error';
}

export const Badge = ({ children, variant = 'success' }: BadgeProps) => {
  const variants = {
    success: 'bg-green-400 text-black',
    warning: 'bg-yellow-400 text-black',
    error: 'bg-red-400 text-white'
  };

  return (
    <span className={`px-3 py-1 text-sm font-bold border-2 border-black ${variants[variant]}`}>
      {children}
    </span>
  );
};
