"use client";

import { cn } from "cn";
import { CalendarX2 } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import { toast } from "react-toastify";
import { BookingCard } from "@/components/booking-card";
import { buttonVariants } from "@/components/ui/button";
import { AuthContext } from "../context/AuthProvider";

export default function MyBookingPage() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("MyBookingPage must be used within AuthProvider");
  }

  const { booked, setBooked } = auth;

  const handleCancel = (bookingId: string) => {
    const cancelled = booked.find((booking) => booking.bookingId === bookingId);

    setBooked((prev) =>
      prev.filter((booking) => booking.bookingId !== bookingId),
    );

    toast.info(
      cancelled
        ? `Booking ${cancelled.bookingId} cancelled`
        : "Booking cancelled",
    );
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <h1 className="text-4xl font-light tracking-[-0.02em] text-foreground sm:text-5xl">
        My Bookings
      </h1>
      <p className="mt-3 text-muted-foreground">
        Manage and view your upcoming travel plans
      </p>

      {booked.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-xl border border-border bg-card px-6 py-16 text-center">
          <CalendarX2
            className="size-10 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-xl font-semibold">No bookings yet</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            When you book a trip, it will show up here so you can track its
            status and details.
          </p>
          <Link
            href="/all-destinations"
            className={cn(
              buttonVariants(),
              "mt-6 h-10 gap-1.5 bg-brand px-4 text-white hover:bg-brand-hover",
            )}
          >
            Explore destinations
          </Link>
        </div>
      ) : (
        <div className="mt-10 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {booked.map((booking) => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </section>
  );
}
