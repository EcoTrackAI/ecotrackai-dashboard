/**
 * Machine Learning Recommendation Types
 * Defines the structure for AI-generated energy optimization recommendations
 */

export interface MLRecommendation {
  id: string;
  title: string;
  description: string;
  confidenceScore: number; // 0-1 scale
  inputs: RecommendationInputs;
  action: RecommendationAction;
  timestamp: Date;
  category: RecommendationCategory;
  potentialSavings?: {
    amount: number;
    unit: "kWh" | "percentage" | "currency";
  };
}

export interface RecommendationInputs {
  weather?: {
    temperature: number;
    condition: string;
  };
  occupancy?: {
    current: number;
    predicted: number;
  };
  timeOfDay?: {
    hour: number;
    period: "morning" | "afternoon" | "evening" | "night";
  };
  historicalPattern?: string;
}

export interface RecommendationAction {
  type: "schedule" | "adjust" | "alert" | "optimize";
  target: string; // e.g., "Living Room AC", "Solar Inverter"
  parameters?: Record<string, unknown>;
}

export type RecommendationCategory =
  | "energy-savings"
  | "comfort-optimization"
  | "predictive-maintenance"
  | "cost-reduction"
  | "peak-demand";

export type ConfidenceLevel = "low" | "medium" | "high" | "very-high";
