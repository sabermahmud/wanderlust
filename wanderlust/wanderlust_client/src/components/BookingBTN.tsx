"use client";

import { CircleCheck } from "lucide-react";
import { useContext } from "react";
import { toast } from "react-toastify";
import type { DestinationsData } from "@/app/all-destinations/page";
import { AuthContext, type Booking } from "@/app/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookingProps {
  data: DestinationsData;
  className?: string;
}

/** Generates sequential booking ids like "b1", "b2", ... from the bookings
 * currently held in state (client-side only). */
function nextBookingId(bookings: Booking[]): string {
  const highest = bookings.reduce((max, booking) => {
    const parsed = Number(booking.bookingId.replace(/^b/, ""));
    return Number.isNaN(parsed) ? max : Math.max(max, parsed);
  }, 0);

  return `b${highest + 1}`;
}

export default function BookingBTN({ data, className }: BookingProps) {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("BookingBTN must be used within AuthProvider");
  }

  const { booked, setBooked } = auth;

  // Compare by destination id: state holds copies, not the original reference.
  const isBooked = booked.some((booking) => booking._id === data._id);

  const handleBooking = () => {
    if (isBooked) {
      return;
    }

    // Compute the id inside the updater so rapid clicks can't reuse one.
    setBooked((prev) => {
      if (prev.some((booking) => booking._id === data._id)) {
        return prev;
      }

      const booking: Booking = {
        ...data,
        bookingId: nextBookingId(prev),
        status: "Confirmed",
      };

      return [...prev, booking];
    });

    toast.success(`Booking confirmed for ${data.name}`);
  };

  return (
    <Button
      type="button"
      onClick={handleBooking}
      disabled={isBooked}
      className={cn(
        "h-10 w-full gap-1.5 bg-brand px-4 text-white hover:bg-brand-hover disabled:bg-brand/60",
        className,
      )}
    >
      {isBooked && <CircleCheck aria-hidden="true" />}
      {isBooked ? "Booked" : "Book Now"}
    </Button>
  );
}
