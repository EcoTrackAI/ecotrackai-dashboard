export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "EcoTrack AI",
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Smart Home Energy Dashboard",
} as const;

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
  endpoints: {
    powerUsage: "/analytics/power-usage",
    applianceEnergy: "/analytics/appliance-energy",
    automationComparison: "/analytics/automation-comparison",
  },
} as const;

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

export const STATUS_COLORS = {
  online: "#16A34A",
  offline: "#DC2626",
  warning: "#FB923C",
} as const;

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
