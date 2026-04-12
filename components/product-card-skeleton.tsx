export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden animate-pulse">
      <div className="h-48 w-full bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-800" />
        <div className="h-4 w-2/3 rounded bg-zinc-800" />
        <div className="h-6 w-1/3 rounded bg-zinc-800" />
        <div className="h-9 w-full rounded-lg bg-zinc-800" />
      </div>
    </div>
  );
}
