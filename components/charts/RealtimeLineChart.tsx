"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RealtimeLineChartProps {
  /**
   * Array of data points to display
   * Each object should contain a timestamp and the dataKey value
   */
  data: Record<string, any>[];

  /**
   * The key in the data object to plot on the Y-axis
   */
  dataKey: string;

  /**
   * Color for the line (hex code)
   * @default '#6366F1'
   */
  color?: string;

  /**
   * Unit label to display in tooltip and axis (e.g., 'W', 'kWh', '°C')
   */
  unit?: string;

  /**
   * Optional height in pixels
   * @default 300
   */
  height?: number;

  /**
   * Optional title for the chart
   */
  title?: string;

  /**
   * Key for X-axis (usually timestamp)
   * @default 'timestamp'
   */
  xAxisKey?: string;

  /**
   * Whether to show grid lines
   * @default true
   */
  showGrid?: boolean;

  /**
   * Whether to animate the line
   * @default true
   */
  animate?: boolean;
}

/**
 * Custom tooltip component for the chart
 */
const CustomTooltip: React.FC<any> = ({ active, payload, unit = "" }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0];
  const value = data.value;
  const timestamp = data.payload.timestamp;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2">
      <p className="text-xs text-gray-500 mb-1">{timestamp}</p>
      <p className="text-sm font-semibold text-gray-900">
        {typeof value === "number" ? value.toFixed(2) : value}
        {unit && <span className="text-gray-600 ml-1">{unit}</span>}
      </p>
    </div>
  );
};

/**
 * RealtimeLineChart Component
 *
 * A reusable real-time line chart component for visualizing live IoT sensor data.
 * Built with Recharts and designed for the EcoTrackAI dashboard.
 *
 * @example
 * ```tsx
 * <RealtimeLineChart
 *   data={sensorData}
 *   dataKey="power"
 *   color="#16A34A"
 *   unit="W"
 *   title="Power Consumption"
 * />
 * ```
 */
export const RealtimeLineChart: React.FC<RealtimeLineChartProps> = ({
  data,
  dataKey,
  color = "#6366F1",
  unit = "",
  height = 300,
  title,
  xAxisKey = "timestamp",
  showGrid = true,
  animate = true,
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            stroke="#9CA3AF"
            style={{
              fontSize: "12px",
              fill: "#6B7280",
            }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis
            stroke="#9CA3AF"
            style={{
              fontSize: "12px",
              fill: "#6B7280",
            }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            tickFormatter={(value) => `${value}${unit ? ` ${unit}` : ""}`}
            width={60}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: color,
              strokeWidth: 2,
              stroke: "#FFFFFF",
            }}
            isAnimationActive={animate}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RealtimeLineChart;
