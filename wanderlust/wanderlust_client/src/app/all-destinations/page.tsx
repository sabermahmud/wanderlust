import { CalendarDays, Clock, MapPin, PackagePlus } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type DestinationsData, getDestinations } from "@/lib/destinations";
import { cn, formatDeparture, formatPrice } from "@/lib/utils";

export type { DestinationsData } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "All Destinations",
  description:
    "Browse curated travel packages and book your next adventure with Wanderlust.",
};

function DestinationCard({ data }: { data: DestinationsData }) {
  return (
    <Card className="group h-full overflow-hidden pt-0 transition-shadow hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {data.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt={data.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <MapPin className="size-8" aria-hidden="true" />
          </div>
        )}

        {data.category && (
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm"
          >
            {data.category}
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-lg">
          <Link
            href={`/all-destinations/${data._id}`}
            className="transition-colors hover:text-brand"
          >
            {data.name}
          </Link>
        </CardTitle>

        {data.country && (
          <CardDescription className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {data.country}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {data.duration && (
          <span className="flex items-center gap-1.5">
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            {data.duration}
          </span>
        )}

        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
          {formatDeparture(data.departureDate, "short")}
        </span>
      </CardContent>

      <CardFooter className="mt-auto flex items-center justify-between gap-3">
        <p className="text-xl font-semibold text-brand">
          {formatPrice(data.price)}
        </p>

        <Link
          href={`/all-destinations/${data._id}`}
          className={cn(
            buttonVariants({ size: "sm" }),
            "h-9 gap-1.5 bg-brand px-4 text-white hover:bg-brand-hover",
          )}
        >
          Book Now
        </Link>
      </CardFooter>
    </Card>
  );
}

export default async function AllDestinationPage() {
  const destinationsData = await getDestinations();

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <h1 className="text-4xl font-light tracking-[-0.02em] text-foreground sm:text-5xl">
        All Destinations
      </h1>
      <p className="mt-3 text-muted-foreground">
        {destinationsData.length === 0
          ? "Curated travel packages, all in one place."
          : `${destinationsData.length} ${destinationsData.length === 1 ? "package" : "packages"} available for your next adventure.`}
      </p>

      {destinationsData.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-xl border border-border bg-card px-6 py-16 text-center">
          <PackagePlus
            className="size-10 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-xl font-semibold">
            No destinations available yet
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Once travel packages are added, they will appear here ready to be
            explored and booked.
          </p>
          <Link
            href="/admin/packages/new"
            className={cn(
              buttonVariants(),
              "mt-6 h-10 gap-1.5 bg-brand px-4 text-white hover:bg-brand-hover",
            )}
          >
            <PackagePlus aria-hidden="true" />
            Add a Package
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinationsData.map((data) => (
            <DestinationCard key={data._id} data={data} />
          ))}
        </div>
      )}
    </section>
  );
}
