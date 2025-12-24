/**
 * Analytics Data Types
 */

export interface PowerUsageDataPoint {
  timestamp: string;
  power: number; // in watts
  date?: string;
}

export interface ApplianceEnergyData {
  appliance: string;
  energy: number; // in kWh
  percentage?: number;
}

export interface AutomationComparisonData {
  month: string;
  before: number; // in kWh
  after: number; // in kWh
  savings?: number; // calculated savings
}

export interface AnalyticsApiResponse<T> {
  success: boolean;
  data: T;
  timestamp?: string;
  error?: string;
}

export interface TimeRange {
  start: Date;
  end: Date;
}
