/**
 * History and Comparison Data Types
 */

export interface HistoricalDataPoint {
  timestamp: string;
  roomId: string;
  roomName: string;
  power: number; // in watts
  energy: number; // in kWh
  temperature?: number;
  humidity?: number;
}

export interface DateRange {
  start: Date;
  end: Date;
  label?: string;
}

export interface RoomOption {
  id: string;
  name: string;
  type: string;
}

export interface ComparisonData {
  roomId: string;
  roomName: string;
  currentPeriod: {
    energy: number;
    avgPower: number;
    peakPower: number;
  };
  previousPeriod: {
    energy: number;
    avgPower: number;
    peakPower: number;
  };
  change: {
    energy: number; // percentage
    avgPower: number; // percentage
    peakPower: number; // percentage
  };
}

export interface HistoricalDataApiResponse {
  success: boolean;
  data: HistoricalDataPoint[];
  count: number;
  dateRange: {
    start: string;
    end: string;
  };
  error?: string;
}

export interface ExportDataRow {
  Date: string;
  Time: string;
  Room: string;
  "Power (W)": number;
  "Energy (kWh)": number;
  "Temperature (°C)"?: number;
  "Humidity (%)"?: number;
}

export type SortDirection = "asc" | "desc";

export interface TableSortConfig {
  key: keyof HistoricalDataPoint;
  direction: SortDirection;
}
