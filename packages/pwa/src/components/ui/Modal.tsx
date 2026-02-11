export const Modal = ({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white border-4 border-black shadow-brutal-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-sky"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
