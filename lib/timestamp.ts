/**
 * Timestamp utility functions for handling IST timestamps from database
 */

/**
 * Parse Neon database timestamp to Date object
 * Neon format: "2026-01-18 17:58:56" (already in IST)
 */
export function parseISTTimestamp(timestamp: string | Date): Date {
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Handle Neon format: "2026-01-18 17:58:56"
  // Replace space with 'T' and add IST offset to make valid ISO string
  const cleanStr = String(timestamp).trim().replace(" IST", "");
  
  if (cleanStr.includes(" ") && !cleanStr.includes("T")) {
    // Neon format - convert to ISO with IST timezone
    const isoStr = cleanStr.replace(" ", "T") + "+05:30";
    return new Date(isoStr);
  }
  
  // Already ISO format or other format - let Date parse it
  return new Date(timestamp);
}

/**
 * Check if a timestamp is valid
 */
export function isValidTimestamp(timestamp: any): boolean {
  const date = parseISTTimestamp(timestamp);
  return !isNaN(date.getTime());
}

/**
 * Get timestamp in milliseconds since epoch
 */
export function getTimestampMs(timestamp: string | Date): number {
  return parseISTTimestamp(timestamp).getTime();
}

/**
 * Format IST timestamp for display
 * Always displays in IST timezone
 */
export function formatTimestamp(
  timestamp: string | Date,
  locale: string = "en-IN",
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = parseISTTimestamp(timestamp);
  return date.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    ...options,
  });
}
