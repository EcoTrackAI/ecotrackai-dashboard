declare global {
  interface SensorData {
    temperature: number;
    humidity: number;
    light: number;
    motion: boolean;
    timestamp?: number;
  }

  interface HistoricalDataPoint {
    timestamp: number;
    value: number;
  }

  interface SensorCardProps {
    title: string;
    value: string | number;
    unit: string;
    icon: React.ReactNode;
    status?: "normal" | "warning" | "critical";
  }

  interface AIRecommendationData {
    action: string;
    reasoning: string[];
  }

  interface ControlSettings {
    fanMode: "ON" | "OFF" | "AUTO";
    acTemperature: number;
    systemMode: "AUTO" | "MANUAL";
  }

  interface Data {
    temperature: number;
    humidity: number;
    light: number;
    motion: boolean;
  }

  interface CardProps {
    title: string;
    value: string;
  }
}

export {};
