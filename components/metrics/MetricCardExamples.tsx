import React from "react";
import { MetricCard } from "./MetricCard";

/**
 * Example usage of MetricCard component for an energy dashboard
 *
 * This demonstrates different scenarios and prop combinations
 */
export function MetricCardExamples() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">
          Metric Card Examples
        </h1>
        <p className="text-gray-600 mb-8">
          Reusable metric cards for the energy dashboard
        </p>

        {/* Grid of metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Current Power Usage - trending up (warning) */}
          <MetricCard
            title="Current Power Usage"
            value="4.2"
            unit="kW"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
            trend={{
              direction: "up",
              value: 8.3,
            }}
          />

          {/* Daily Energy Consumption - trending down (good) */}
          <MetricCard
            title="Daily Energy Consumption"
            value="87.5"
            unit="kWh"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            trend={{
              direction: "down",
              value: 12.4,
            }}
          />

          {/* Cost Savings - trending up (explicitly positive) */}
          <MetricCard
            title="Cost Savings"
            value="$248"
            unit="this month"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            trend={{
              direction: "up",
              value: 15.7,
              isPositive: true, // Explicitly mark as positive
            }}
          />

          {/* Carbon Footprint - trending down (good) */}
          <MetricCard
            title="Carbon Footprint"
            value="142"
            unit="kg CO₂"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            trend={{
              direction: "down",
              value: 5.2,
            }}
          />

          {/* Active Devices - no trend */}
          <MetricCard
            title="Active Devices"
            value="24"
            unit="devices"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />

          {/* System Efficiency - trending up (explicitly positive) */}
          <MetricCard
            title="System Efficiency"
            value="94.2"
            unit="%"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            trend={{
              direction: "up",
              value: 2.1,
              isPositive: true,
            }}
          />
        </div>

        {/* Custom styled example */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[#111827] mb-4">
            Custom Styling Example
          </h2>
          <MetricCard
            title="Peak Load Time"
            value="18:30"
            unit="today"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            className="max-w-md shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}

export default MetricCardExamples;
