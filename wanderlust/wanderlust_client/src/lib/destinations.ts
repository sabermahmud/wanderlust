import { cache } from "react";

export interface DestinationsData {
  category: string;
  country: string;
  departureDate: string;
  description: string;
  duration: string;
  imageUrl: string;
  name: string;
  price: string;
  _id: string;
}

const API_BASE_URL = "http://localhost:5000";

/** Fetches every travel destination from the API. */
export const getDestinations = cache(async (): Promise<DestinationsData[]> => {
  // no-store keeps newly added packages visible right away.
  const res = await fetch(`${API_BASE_URL}/all-destinations`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load destinations. Please try again later.");
  }

  const data: unknown = await res.json();

  return Array.isArray(data) ? (data as DestinationsData[]) : [];
});

/**
 * Fetches a single destination by its id, or `null` when it doesn't exist.
 * Deduped per request, so `generateMetadata` and the page share one fetch.
 */
export const getDestinationById = cache(
  async (id: string): Promise<DestinationsData | null> => {
    const destinations = await getDestinations();

    return destinations.find((destination) => destination._id === id) ?? null;
  },
);
