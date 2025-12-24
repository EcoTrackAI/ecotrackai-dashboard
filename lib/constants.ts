/**
 * Design System Constants
 * App config loaded from environment variables
 */

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "EcoTrack AI",
  description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Smart Home Energy Dashboard",
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
  endpoints: {
    powerUsage: "/analytics/power-usage",
    applianceEnergy: "/analytics/appliance-energy",
    automationComparison: "/analytics/automation-comparison",
  },
} as const;

// Design System Color Palette
export const COLORS = {
  background: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#6366F1",
  secondary: "#16A34A",
  warning: "#FB923C",
  error: "#DC2626",
  textPrimary: "#111827",
  textMuted: "#6B7280",
} as const;

// Status colors mapped to Tailwind classes
export const STATUS_COLORS = {
  online: "#16A34A", // secondary
  offline: "#DC2626", // error
  warning: "#FB923C", // warning
} as const;
