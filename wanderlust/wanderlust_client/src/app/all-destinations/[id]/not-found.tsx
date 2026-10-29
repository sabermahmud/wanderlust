import { Compass } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DestinationNotFound() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-col items-center rounded-xl border border-border bg-card px-6 py-16 text-center">
        <Compass className="size-10 text-muted-foreground" aria-hidden="true" />

        <h1 className="mt-4 text-2xl font-semibold">Destination not found</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          The travel package you are looking for doesn&apos;t exist or may have
          been removed.
        </p>

        <Link
          href="/all-destinations"
          className={cn(
            buttonVariants(),
            "mt-6 h-10 gap-1.5 bg-brand px-4 text-white hover:bg-brand-hover",
          )}
        >
          Browse all destinations
        </Link>
      </div>
    </section>
  );
}
