/**
 * Timestamp utility functions for handling IST timestamps from database
 */

/**
 * Parse IST timestamp string to Date object
 * Handles formats like:
 * - "2026-01-18 14:30:00 IST"
 * - "2026-01-18T14:30:00+05:30"
 * - ISO format strings
 */
export function parseISTTimestamp(timestamp: string | Date): Date {
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // If it's a string, try to parse it
  if (typeof timestamp === "string") {
    // Remove " IST" suffix if present
    const cleanTimestamp = timestamp.replace(" IST", "");

    // Try parsing as ISO string first (most reliable)
    const date = new Date(cleanTimestamp);
    if (!isNaN(date.getTime())) {
      return date;
    }

    // Fallback: try original string
    const fallbackDate = new Date(timestamp);
    if (!isNaN(fallbackDate.getTime())) {
      return fallbackDate;
    }

    console.error("[Timestamp] Failed to parse timestamp:", timestamp);
    return new Date(0); // Return epoch on parse failure
  }

  return new Date();
}

/**
 * Check if a timestamp is valid
 */
export function isValidTimestamp(timestamp: any): boolean {
  try {
    const date = parseISTTimestamp(timestamp);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Get timestamp in milliseconds since epoch
 */
export function getTimestampMs(timestamp: string | Date): number {
  return parseISTTimestamp(timestamp).getTime();
}

/**
 * Format IST timestamp for display
 */
export function formatTimestamp(
  timestamp: string | Date,
  locale: string = "en-IN",
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = parseISTTimestamp(timestamp);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };
  return date.toLocaleString(locale, defaultOptions);
}

/**
 * Compare two timestamps
 * Returns: -1 if a < b, 0 if a == b, 1 if a > b
 */
export function compareTimestamps(a: string | Date, b: string | Date): number {
  const timeA = getTimestampMs(a);
  const timeB = getTimestampMs(b);

  if (timeA < timeB) return -1;
  if (timeA > timeB) return 1;
  return 0;
}
