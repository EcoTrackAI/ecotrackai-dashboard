/**
 * Automation Control Types
 * TypeScript interfaces for smart home appliance automation
 */

export type ApplianceType =
  | "air_conditioner"
  | "fan"
  | "light"
  | "heater"
  | "dehumidifier"
  | "other";

export type ControlMode = "auto" | "manual";

export type ApplianceStatus = "on" | "off";

export interface FanSettings {
  speed: number; // 1-5
}

export interface ACSettings {
  temperature: number; // 16-30°C
  mode: "cool" | "heat" | "fan" | "dry";
}

export interface ApplianceSettings {
  fan?: FanSettings;
  ac?: ACSettings;
}

export interface Appliance {
  id: string;
  name: string;
  type: ApplianceType;
  room: string;
  status: ApplianceStatus;
  controlMode: ControlMode;
  powerConsumption: number; // watts
  settings?: ApplianceSettings;
  isOnline: boolean;
}

export interface AutomationRule {
  id: string;
  applianceId: string;
  condition: string;
  action: string;
  enabled: boolean;
}
