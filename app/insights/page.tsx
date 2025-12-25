"use client";

import { MLRecommendationCard } from "@/components/recommendations";
// MLRecommendation type is globally available from types/globals.d.ts

const mockRecommendations: MLRecommendation[] = [
  {
    id: "rec-001",
    title: "Reduce AC Temperature",
    description:
      "Based on current weather and occupancy patterns, reducing AC temperature by 2°C will save energy without compromising comfort. Optimal temperature detected at 24°C.",
    confidenceScore: 0.89,
    inputs: {
      weather: {
        temperature: 28,
        condition: "Partly Cloudy",
      },
      occupancy: {
        current: 2,
        predicted: 1,
      },
      timeOfDay: {
        hour: 14,
        period: "afternoon",
      },
      historicalPattern:
        "Low activity period - average occupancy drops by 40% in next 2 hours",
    },
    action: {
      type: "adjust",
      target: "Living Room AC",
      parameters: { temperature: 24 },
    },
    timestamp: new Date(),
    category: "energy-savings",
    potentialSavings: {
      amount: 3.5,
      unit: "kWh",
    },
  },
  {
    id: "rec-002",
    title: "Shift Load to Off-Peak Hours",
    description:
      "Running the dishwasher during off-peak hours (10 PM - 6 AM) will reduce electricity costs by 15%. Current grid load is high.",
    confidenceScore: 0.92,
    inputs: {
      timeOfDay: {
        hour: 18,
        period: "evening",
      },
      historicalPattern: "Peak demand period - rates 2x higher than off-peak",
    },
    action: {
      type: "schedule",
      target: "Dishwasher",
      parameters: { scheduledTime: "22:00" },
    },
    timestamp: new Date(),
    category: "cost-reduction",
    potentialSavings: {
      amount: 15,
      unit: "percentage",
    },
  },
  {
    id: "rec-003",
    title: "Pre-Cool Before Peak Hours",
    description:
      "Lower temperature to 22°C before afternoon peak to maintain comfort with less energy during high-cost hours. This leverages thermal mass for efficiency.",
    confidenceScore: 0.78,
    inputs: {
      weather: {
        temperature: 26,
        condition: "Clear Sky",
      },
      occupancy: {
        current: 3,
        predicted: 4,
      },
      timeOfDay: {
        hour: 12,
        period: "afternoon",
      },
      historicalPattern:
        "Temperature typically rises 4°C between noon and 3 PM",
    },
    action: {
      type: "optimize",
      target: "Bedroom AC",
      parameters: { precoolTemp: 22, duration: 60 },
    },
    timestamp: new Date(),
    category: "comfort-optimization",
    potentialSavings: {
      amount: 2.8,
      unit: "kWh",
    },
  },
  {
    id: "rec-004",
    title: "Schedule HVAC Filter Replacement",
    description:
      "Air filter efficiency has decreased by 30% based on airflow sensor data. Schedule replacement to maintain optimal performance and prevent system strain.",
    confidenceScore: 0.85,
    inputs: {
      historicalPattern:
        "Filter installed 89 days ago - typical lifespan is 90 days",
    },
    action: {
      type: "alert",
      target: "Main HVAC System",
      parameters: { maintenanceType: "filter-replacement" },
    },
    timestamp: new Date(),
    category: "predictive-maintenance",
    potentialSavings: {
      amount: 10,
      unit: "percentage",
    },
  },
  {
    id: "rec-005",
    title: "Optimize Solar Battery Charging",
    description:
      "Solar generation forecast shows peak output at 1 PM. Defer non-essential loads to maximize battery charging from solar panels.",
    confidenceScore: 0.81,
    inputs: {
      weather: {
        temperature: 29,
        condition: "Sunny",
      },
      timeOfDay: {
        hour: 11,
        period: "morning",
      },
      historicalPattern:
        "Solar generation typically peaks at 5.2 kW around 1 PM",
    },
    action: {
      type: "optimize",
      target: "Solar Inverter",
      parameters: { chargingStrategy: "maximize-solar" },
    },
    timestamp: new Date(),
    category: "energy-savings",
    potentialSavings: {
      amount: 4.2,
      unit: "kWh",
    },
  },
  {
    id: "rec-006",
    title: "Reduce Peak Demand Charge",
    description:
      "High simultaneous load detected. Staggering appliance usage by 15 minutes can reduce peak demand charges significantly this billing cycle.",
    confidenceScore: 0.73,
    inputs: {
      occupancy: {
        current: 4,
        predicted: 4,
      },
      timeOfDay: {
        hour: 19,
        period: "evening",
      },
      historicalPattern:
        "Peak household demand occurs during dinner preparation",
    },
    action: {
      type: "schedule",
      target: "Water Heater",
      parameters: { delayMinutes: 15 },
    },
    timestamp: new Date(),
    category: "peak-demand",
    potentialSavings: {
      amount: 8.5,
      unit: "currency",
    },
  },
];

export default function InsightsPage() {
  const handleApply = async (recommendationId: string) => {
    // Simulate API call to apply recommendation
    console.log("Applying recommendation:", recommendationId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Recommendation ${recommendationId} applied successfully!`);
  };

  const handleIgnore = async (recommendationId: string) => {
    // Simulate API call to ignore recommendation
    console.log("Ignoring recommendation:", recommendationId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(`Recommendation ${recommendationId} ignored.`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            ML Insights
          </h1>
          <p className="text-gray-600">
            AI-powered predictions and energy optimization recommendations based
            on real-time data analysis.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">
              Active Recommendations
            </div>
            <div className="text-2xl font-bold text-[#111827]">
              {mockRecommendations.length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Avg. Confidence</div>
            <div className="text-2xl font-bold text-[#111827]">
              {Math.round(
                (mockRecommendations.reduce(
                  (sum, rec) => sum + rec.confidenceScore,
                  0
                ) /
                  mockRecommendations.length) *
                  100
              )}
              %
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Potential Savings</div>
            <div className="text-2xl font-bold text-[#16A34A]">
              {mockRecommendations
                .filter((r) => r.potentialSavings?.unit === "kWh")
                .reduce((sum, r) => sum + (r.potentialSavings?.amount || 0), 0)
                .toFixed(1)}{" "}
              kWh
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">High Confidence</div>
            <div className="text-2xl font-bold text-[#111827]">
              {
                mockRecommendations.filter((r) => r.confidenceScore >= 0.75)
                  .length
              }
            </div>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="space-y-4">
          {mockRecommendations.map((recommendation) => (
            <MLRecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onApply={handleApply}
              onIgnore={handleIgnore}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
