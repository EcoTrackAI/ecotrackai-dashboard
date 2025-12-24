"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Zap, Activity } from "lucide-react";
import { COLORS } from "@/lib/constants";

// Static data for layout demonstration
const powerUsageData = [
  { timestamp: "00:00", power: 1200 },
  { timestamp: "04:00", power: 800 },
  { timestamp: "08:00", power: 2400 },
  { timestamp: "12:00", power: 3200 },
  { timestamp: "16:00", power: 2800 },
  { timestamp: "20:00", power: 3500 },
  { timestamp: "23:59", power: 1500 },
];

const applianceEnergyData = [
  { appliance: "HVAC", energy: 125.5 },
  { appliance: "Water Heater", energy: 89.3 },
  { appliance: "Refrigerator", energy: 45.2 },
  { appliance: "Washing Machine", energy: 32.8 },
  { appliance: "Lighting", energy: 28.4 },
  { appliance: "Electronics", energy: 42.1 },
];

const automationComparisonData = [
  { month: "Jan", before: 450, after: 380, savings: 70 },
  { month: "Feb", before: 425, after: 350, savings: 75 },
  { month: "Mar", before: 480, after: 390, savings: 90 },
  { month: "Apr", before: 510, after: 410, savings: 100 },
  { month: "May", before: 555, after: 445, savings: 110 },
  { month: "Jun", before: 580, after: 460, savings: 120 },
];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
      <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}:{" "}
          {typeof entry.value === "number"
            ? entry.value.toFixed(2)
            : entry.value}
        </p>
      ))}
    </div>
  );
};

// Power Usage Line Chart Component
const PowerUsageChart = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Activity className="w-5 h-5 text-indigo-600" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Power Usage Over Time
          </h2>
          <p className="text-sm text-gray-600">
            Real-time power consumption in watts
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={powerUsageData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="timestamp"
            stroke={COLORS.textMuted}
            style={{ fontSize: "12px" }}
            tick={{ fill: COLORS.textMuted }}
          />
          <YAxis
            stroke={COLORS.textMuted}
            style={{ fontSize: "12px" }}
            tick={{ fill: COLORS.textMuted }}
            label={{
              value: "Power (W)",
              angle: -90,
              position: "insideLeft",
              style: { fill: COLORS.textMuted, fontSize: "12px" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "14px" }} iconType="line" />
          <Line
            type="monotone"
            dataKey="power"
            name="Power"
            stroke={COLORS.primary}
            strokeWidth={2}
            dot={{ fill: COLORS.primary, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Appliance Energy Bar Chart Component
const ApplianceEnergyChart = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Zap className="w-5 h-5 text-indigo-600" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Energy per Appliance
          </h2>
          <p className="text-sm text-gray-600">
            Monthly energy consumption by device
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={applianceEnergyData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="appliance"
            stroke={COLORS.textMuted}
            style={{ fontSize: "12px" }}
            tick={{ fill: COLORS.textMuted }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke={COLORS.textMuted}
            style={{ fontSize: "12px" }}
            tick={{ fill: COLORS.textMuted }}
            label={{
              value: "Energy (kWh)",
              angle: -90,
              position: "insideLeft",
              style: { fill: COLORS.textMuted, fontSize: "12px" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "14px" }} iconType="rect" />
          <Bar
            dataKey="energy"
            name="Energy"
            fill={COLORS.primary}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Automation Comparison Chart Component
const AutomationComparisonChart = () => {
  const totalSavings = automationComparisonData.reduce(
    (sum, item) => sum + item.savings,
    0
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Automation Impact
            </h2>
            <p className="text-sm text-gray-600">
              Energy usage before and after automation
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Savings</p>
          <p className="text-2xl font-bold text-green-600">
            {totalSavings.toFixed(1)} kWh
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={automationComparisonData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            stroke={COLORS.textMuted}
            style={{ fontSize: "12px" }}
            tick={{ fill: COLORS.textMuted }}
          />
          <YAxis
            stroke={COLORS.textMuted}
            style={{ fontSize: "12px" }}
            tick={{ fill: COLORS.textMuted }}
            label={{
              value: "Energy (kWh)",
              angle: -90,
              position: "insideLeft",
              style: { fill: COLORS.textMuted, fontSize: "12px" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "14px" }} iconType="rect" />
          <Bar
            dataKey="before"
            name="Before"
            fill={COLORS.warning}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="after"
            name="After"
            fill={COLORS.secondary}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Main Analytics Page
export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Energy Analytics
          </h1>
          <p className="text-gray-600">
            Analyze historical energy consumption data, appliance usage, and
            automation impact.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="space-y-6">
          {/* Power Usage Line Chart */}
          <PowerUsageChart />

          {/* Two-column layout for remaining charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ApplianceEnergyChart />
            <AutomationComparisonChart />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Peak Power Usage
            </h3>
            <p className="text-2xl font-bold text-gray-900">3,500 W</p>
            <p className="text-xs text-gray-500 mt-1">Recorded at 8:00 PM</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Top Consumer
            </h3>
            <p className="text-2xl font-bold text-gray-900">HVAC</p>
            <p className="text-xs text-gray-500 mt-1">125.5 kWh this month</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Automation Efficiency
            </h3>
            <p className="text-2xl font-bold text-green-600">18.5%</p>
            <p className="text-xs text-gray-500 mt-1">Average energy savings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
