export default function LoadingSpinner({ message = 'Loading...', size = 'default' }) {
  const sizes = {
    small: 'w-6 h-6',
    default: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  return (
    <div className="p-4 m-2 flex flex-col items-center justify-center py-12">
      {/* Spinner */}
      <div className={`relative ${sizes[size]}`}>
        <div className={`absolute inset-0 border-2 border-dark-border/20 rounded-full`} />
        <div className={`absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin`} />
      </div>

      {/* Message */}
      {message && (
        <p className="mt-4 text-sm text-dark-text animate-pulse-subtle">{message}</p>
      )}
    </div>
  );
}

