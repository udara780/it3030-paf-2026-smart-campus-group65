export default function LoadingSpinner({ message = 'Loading...', size = 'default' }) {
  const sizes = {
    small: 'w-6 h-6',
    default: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className={`relative ${sizes[size]}`}>
        <div className={`absolute inset-0 ${sizes[size]} border-2 border-dark-border/30 rounded-full`} />
        <div className={`absolute inset-0 ${sizes[size]} border-2 border-transparent border-t-primary rounded-full animate-spin`} />
        <div className={`absolute inset-2 ${sizes[size]} border-2 border-transparent border-t-secondary rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="mt-4 text-sm text-dark-text-light animate-pulse">{message}</p>
    </div>
  );
}
