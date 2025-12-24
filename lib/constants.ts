/**
 * Design System Constants
 * App config loaded from environment variables
 */

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "EcoTrack AI",
  description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Smart Home Energy Dashboard",
} as const;

// Status colors mapped to Tailwind classes
export const STATUS_COLORS = {
  online: "#16A34A", // secondary
  offline: "#DC2626", // error
  warning: "#FB923C", // warning
} as const;
