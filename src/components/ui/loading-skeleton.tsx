export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-2/3 animate-pulse rounded-xl bg-white/10" />
      <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
      <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
      <div className="h-44 animate-pulse rounded-2xl bg-white/10" />
    </div>
  );
}
