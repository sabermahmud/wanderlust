function DestinationCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl ring-1 ring-foreground/10"
      aria-hidden="true"
    >
      <div className="aspect-video w-full animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function AllDestinationsLoading() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16"
      aria-busy="true"
      aria-label="Loading destinations"
    >
      <div className="h-10 w-2/3 max-w-md animate-pulse rounded-lg bg-muted" />
      <div className="mt-4 h-4 w-1/3 max-w-sm animate-pulse rounded bg-muted" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          "skeleton-1",
          "skeleton-2",
          "skeleton-3",
          "skeleton-4",
          "skeleton-5",
          "skeleton-6",
        ].map((key) => (
          <DestinationCardSkeleton key={key} />
        ))}
      </div>
    </section>
  );
}
