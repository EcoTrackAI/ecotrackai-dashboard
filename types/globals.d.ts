/**
 * Global Type Definitions
 * These types are available throughout the application without importing
 */

declare global {
  type SystemStatus = "online" | "offline" | "warning";

  interface WeatherData {
    temperature: number;
    condition: "sunny" | "cloudy" | "rainy" | "snowy" | "partly-cloudy";
    location: string;
  }

  interface UserProfile {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  }

  interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: "info" | "warning" | "error" | "success";
    timestamp: Date;
    read: boolean;
  }
}

export {};
