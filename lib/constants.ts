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

// Default Settings
export const DEFAULT_ROOMS: Room[] = [
  { id: "living-room", name: "Living Room", isEnabled: true },
  { id: "kitchen", name: "Kitchen", isEnabled: true },
  { id: "bedroom", name: "Bedroom", isEnabled: true },
  { id: "bathroom", name: "Bathroom", isEnabled: true },
];

export const DEFAULT_APPLIANCES: Appliance[] = [
  {
    id: "ac-1",
    name: "Air Conditioner",
    roomId: "living-room",
    powerRating: 1500,
    isEnabled: true,
    type: "air_conditioner",
    room: "living-room",
    status: "off",
    controlMode: "manual",
    powerConsumption: 0,
    isOnline: true,
  },
  {
    id: "tv-1",
    name: "Television",
    roomId: "living-room",
    powerRating: 150,
    isEnabled: true,
    type: "other",
    room: "living-room",
    status: "off",
    controlMode: "manual",
    powerConsumption: 0,
    isOnline: true,
  },
  {
    id: "fridge-1",
    name: "Refrigerator",
    roomId: "kitchen",
    powerRating: 150,
    isEnabled: true,
    type: "other",
    room: "kitchen",
    status: "on",
    controlMode: "auto",
    powerConsumption: 150,
    isOnline: true,
  },
  {
    id: "light-1",
    name: "LED Lights",
    roomId: "bedroom",
    powerRating: 20,
    isEnabled: true,
    type: "light",
    room: "bedroom",
    status: "off",
    controlMode: "manual",
    powerConsumption: 0,
    isOnline: true,
  },
];

export const DEFAULT_TARIFF: TariffSettings = {
  currency: "USD",
  unitPrice: 0.12,
  timeBasedPricing: false,
};

export const DEFAULT_DATA_SAMPLING: DataSamplingSettings = {
  interval: 60,
  retentionDays: 90,
  aggregationMethod: "average",
};

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  highUsageAlert: true,
  highUsageThreshold: 3000,
  offlineDeviceAlert: true,
};
