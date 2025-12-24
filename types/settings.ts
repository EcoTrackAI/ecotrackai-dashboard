/**
 * Settings Types
 * Type definitions for application settings and configuration
 */

export interface Room {
  id: string;
  name: string;
  isEnabled: boolean;
}

export interface Appliance {
  id: string;
  name: string;
  roomId: string;
  powerRating: number; // in watts
  isEnabled: boolean;
}

export interface TariffSettings {
  currency: string;
  unitPrice: number; // price per kWh
  timeBasedPricing: boolean;
  peakRate?: number;
  offPeakRate?: number;
  peakStartHour?: number;
  peakEndHour?: number;
}

export interface DataSamplingSettings {
  interval: number; // in seconds
  retentionDays: number;
  aggregationMethod: "average" | "sum" | "max" | "min";
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  highUsageAlert: boolean;
  highUsageThreshold: number; // in watts
  offlineDeviceAlert: boolean;
}

export interface SystemSettings {
  rooms: Room[];
  appliances: Appliance[];
  tariff: TariffSettings;
  dataSampling: DataSamplingSettings;
  notifications: NotificationSettings;
}

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
  },
  {
    id: "tv-1",
    name: "Television",
    roomId: "living-room",
    powerRating: 150,
    isEnabled: true,
  },
  {
    id: "fridge-1",
    name: "Refrigerator",
    roomId: "kitchen",
    powerRating: 150,
    isEnabled: true,
  },
  {
    id: "light-1",
    name: "LED Lights",
    roomId: "bedroom",
    powerRating: 20,
    isEnabled: true,
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
