export function parseISTTimestamp(timestamp: string | Date): Date {
  if (timestamp instanceof Date) {
    return timestamp;
  }

  const cleanStr = String(timestamp).trim().replace(" IST", "");

  if (cleanStr.includes(" ") && !cleanStr.includes("T")) {
    const isoStr = cleanStr.replace(" ", "T") + "+05:30";
    return new Date(isoStr);
  }

  return new Date(timestamp);
}

export function isValidTimestamp(
  timestamp: { timestamp?: string | Date } | string | Date,
): boolean {
  const ts =
    typeof timestamp === "object" && "timestamp" in timestamp
      ? timestamp.timestamp
      : timestamp;
  const date = parseISTTimestamp(ts as string | Date);
  return !isNaN(date.getTime());
}

export function getTimestampMs(timestamp: string | Date): number {
  return parseISTTimestamp(timestamp).getTime();
}

export function formatTimestamp(
  timestamp: string | Date,
  locale: string = "en-US",
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = parseISTTimestamp(timestamp);
  return date.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    ...options,
  });
}
