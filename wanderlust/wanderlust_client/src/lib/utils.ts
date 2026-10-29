export { cn } from "cn";

/** Formats a raw destination price string as USD, e.g. "1299" -> "$1,299". */
export function formatPrice(price?: string): string {
  if (!price) {
    return "—";
  }

  const numeric = Number(price);

  if (Number.isFinite(numeric)) {
    return `$${numeric.toLocaleString("en-US")}`;
  }

  return price.startsWith("$") ? price : `$${price}`;
}

/**
 * Formats an ISO "YYYY-MM-DD" departure date. The date is rebuilt from its
 * parts so the day never shifts across time zones.
 */
export function formatDeparture(
  value?: string,
  style: "short" | "long" = "long",
): string {
  if (!value) {
    return "Not set";
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}
