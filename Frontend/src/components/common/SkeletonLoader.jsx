export default function SkeletonLoader({ className = '', variant = 'default' }) {
  const baseClass = 'animate-pulse bg-dark-border/50 rounded';
  
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full',
    button: 'h-10 w-24',
    circle: 'h-8 w-8 rounded-full',
    rectangle: 'h-16 w-full',
  };

  return (
    <div className={`${baseClass} ${variants[variant] || variants.default} ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <SkeletonLoader variant="circle" />
          <div className="space-y-2">
            <SkeletonLoader variant="title" className="w-32" />
            <SkeletonLoader variant="text" className="w-24" />
          </div>
        </div>
        <SkeletonLoader variant="button" />
      </div>
      <SkeletonLoader variant="text" />
      <div className="flex gap-4">
        <SkeletonLoader variant="text" className="w-20" />
        <SkeletonLoader variant="text" className="w-20" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <SkeletonLoader variant="circle" className="h-10 w-10" />
      </div>
      <SkeletonLoader variant="title" className="w-16 mb-1" />
      <SkeletonLoader variant="text" className="w-24" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
