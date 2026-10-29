"use client";

import { cn } from "cn";
import {
  CalendarDays,
  CircleCheck,
  Clock,
  Eye,
  MapPin,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Booking, BookingStatus } from "@/app/context/AuthProvider";
import { Button, buttonVariants } from "@/components/ui/button";

function StatusBadge({ status }: { status: BookingStatus }) {
  const isConfirmed = status === "Confirmed";
  const Icon = isConfirmed ? CircleCheck : Clock;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        isConfirmed
          ? "bg-green-100 text-green-700"
          : "bg-amber-100 text-amber-700",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {status}
    </span>
  );
}

function formatDeparture(value: string): string {
  if (!value) {
    return "Not set";
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  // Build the date from parts so the day never shifts across time zones.
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatPrice(price: string): string {
  if (!price) {
    return "—";
  }

  return price.startsWith("$") ? price : `$${price}`;
}

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
}

function BookingCard({ booking, onCancel }: BookingCardProps) {
  return (
    <article className="flex flex-col gap-5 p-5 sm:flex-row sm:gap-6">
      <div className="relative aspect-video w-full shrink-0 self-start overflow-hidden rounded-lg bg-muted sm:w-72 md:w-80">
        {booking.imageUrl ? (
          <Image
            src={booking.imageUrl}
            alt={booking.name}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <MapPin className="size-8" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <StatusBadge status={booking.status} />

        <h2 className="mt-3 text-2xl font-bold">{booking.name}</h2>

        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
            Departure: {formatDeparture(booking.departureDate)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            Booking ID: {booking.bookingId}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 sm:mt-auto">
          <p className="text-3xl font-bold text-brand">
            {formatPrice(booking.price)}
          </p>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10 border-destructive/30 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onCancel(booking.bookingId)}
            >
              <Trash2 aria-hidden="true" />
              Cancel
            </Button>

            <Link
              href={`/all-destinations/${booking._id}`}
              className={cn(
                buttonVariants(),
                "h-10 gap-1.5 bg-brand px-4 text-white hover:bg-brand-hover",
              )}
            >
              <Eye aria-hidden="true" />
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export { BookingCard };
