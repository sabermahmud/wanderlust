import { ArrowLeft, CalendarDays, Clock, MapPin, Tag } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingBTN from "@/components/BookingBTN";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getDestinationById } from "@/lib/destinations";
import { formatDeparture, formatPrice } from "@/lib/utils";

interface PageProps {
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageProps>;
}): Promise<Metadata> {
  const { id } = await params;
  const destination = await getDestinationById(id);

  if (!destination) {
    return { title: "Destination Not Found" };
  }

  return {
    title: destination.name,
    description:
      destination.description ||
      `Book the ${destination.name} travel package in ${destination.country}.`,
    openGraph: destination.imageUrl
      ? {
          images: [{ url: destination.imageUrl }],
        }
      : undefined,
  };
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default async function DestinationDetailsPage({
  params,
}: {
  params: Promise<PageProps>;
}) {
  const { id } = await params;
  const destination = await getDestinationById(id);

  if (!destination) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <Link
        href="/all-destinations"
        className={`${buttonVariants({ variant: "ghost" })} -ml-2.5 gap-1.5 text-muted-foreground hover:text-foreground`}
      >
        <ArrowLeft aria-hidden="true" />
        Back to destinations
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
            {destination.imageUrl ? (
              <Image
                src={destination.imageUrl}
                alt={destination.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <MapPin className="size-10" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {destination.category && (
              <Badge variant="secondary">{destination.category}</Badge>
            )}

            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {destination.country}
            </span>
          </div>

          <h1 className="mt-3 text-4xl font-light tracking-[-0.02em] text-foreground sm:text-5xl">
            {destination.name}
          </h1>

          {destination.description && (
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {destination.description}
            </p>
          )}

          <Separator className="mt-8" />

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <DetailRow
              icon={<Clock className="size-4" aria-hidden="true" />}
              label="Duration"
              value={destination.duration || "Not set"}
            />
            <DetailRow
              icon={<CalendarDays className="size-4" aria-hidden="true" />}
              label="Departure"
              value={formatDeparture(destination.departureDate)}
            />
            <DetailRow
              icon={<Tag className="size-4" aria-hidden="true" />}
              label="Category"
              value={destination.category || "Not set"}
            />
          </div>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Price
              </p>
              <p className="mt-1 text-3xl font-bold text-brand">
                {formatPrice(destination.price)}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">per person</p>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-4">
            <DetailRow
              icon={<CalendarDays className="size-4" aria-hidden="true" />}
              label="Departure date"
              value={formatDeparture(destination.departureDate)}
            />
            <DetailRow
              icon={<Clock className="size-4" aria-hidden="true" />}
              label="Duration"
              value={destination.duration || "Not set"}
            />
            <DetailRow
              icon={<MapPin className="size-4" aria-hidden="true" />}
              label="Location"
              value={destination.country || "Not set"}
            />
          </CardContent>

          <div className="px-(--card-spacing) pb-(--card-spacing)">
            <BookingBTN data={destination} />
          </div>
        </Card>
      </div>
    </section>
  );
}
