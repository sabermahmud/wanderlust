"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";

import type { DestinationsData } from "@/app/all-destinations/page";

export type BookingStatus = "Confirmed" | "Pending";

export interface Booking extends DestinationsData {
  bookingId: string;
  status: BookingStatus;
}

interface AuthContextType {
  booked: Booking[];
  setBooked: Dispatch<SetStateAction<Booking[]>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [booked, setBooked] = useState<Booking[]>([]);

  const value: AuthContextType = {
    booked,
    setBooked,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
