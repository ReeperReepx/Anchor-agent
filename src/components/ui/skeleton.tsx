export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-[14px] border border-[#E8DDD3] bg-white p-[28px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-6 animate-in fade-in">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="rounded-[14px] border border-[#E8DDD3] bg-white p-[28px]">
        <Skeleton className="h-4 w-32 mb-6" />
        <Skeleton className="h-3 w-full mb-3" />
        <Skeleton className="h-3 w-3/4 mb-3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
