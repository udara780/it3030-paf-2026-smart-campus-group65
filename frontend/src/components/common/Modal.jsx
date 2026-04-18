import { HiX } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 m-2">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className={`relative w-full ${maxWidth} glass-strong border border-dark-border/50 rounded-xl shadow-2xl animate-scale-in max-h-[90vh] flex flex-col overflow-hidden z-50`}>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 p-5 border-b border-dark-border/30 bg-linear-to-r from-dark-card to-dark-card/50 shrink-0">
          <h2 className="text-lg font-semibold text-white leading-tight truncate">{title}</h2>
          <button
            onClick={onClose}
            className="text-dark-text hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-dark-border/50 shrink-0"
            aria-label="Close modal"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}


