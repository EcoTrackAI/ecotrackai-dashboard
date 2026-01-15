"use client";

import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// HistoricalChartProps and all types are globally available from types/globals.d.ts

const ROOM_COLORS = [
  "#6366F1", // Primary indigo
  "#16A34A", // Green
  "#FB923C", // Orange
  "#DC2626", // Red
  "#8B5CF6", // Purple
  "#0EA5E9", // Sky blue
  "#EC4899", // Pink
  "#F59E0B", // Amber
];

/**
 * Custom tooltip for the chart
 */
const CustomTooltip: React.FC<any> = ({ active, payload, metric }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const getUnit = () => {
    switch (metric) {
      case "temperature":
        return "°C";
      case "humidity":
        return "%";
      case "lighting":
        return "%";
      case "motion":
        return "";
      default:
        return "";
    }
  };

  const formatValue = (value: number) => {
    if (metric === "motion") {
      return value === 1 ? "Detected" : "Not detected";
    }
    return value.toFixed(2);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2">
      <p className="text-xs text-gray-600 mb-1">
        {payload[0].payload.timestamp}
      </p>
      {payload.map((entry: any, index: number) => (
        <p
          key={index}
          className="text-sm font-medium"
          style={{ color: entry.color }}
        >
          {entry.name}: {formatValue(entry.value)} {getUnit()}
        </p>
      ))}
    </div>
  );
};

/**
 * HistoricalChart Component
 * Displays historical energy data in various chart formats
 */
export const HistoricalChart: React.FC<HistoricalChartProps> = ({
  data,
  chartType = "line",
  metric = "energy",
  title,
  height = 400,
  compareRooms = false,
  className = "",
}) => {
  // Prepare data for chart
  const prepareChartData = () => {
    if (!compareRooms) {
      // Single metric view - aggregate by timestamp
      const aggregated = data.reduce((acc, point) => {
        const existing = acc.find((p) => p.timestamp === point.timestamp);
        if (existing) {
          existing[metric] = (existing[metric] || 0) + (point[metric] || 0);
        } else {
          acc.push({
            timestamp: new Date(point.timestamp).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            [metric]: point[metric] || 0,
          });
        }
        return acc;
      }, [] as any[]);
      return aggregated;
    } else {
      // Multi-room comparison
      const grouped: Record<string, any> = {};

      data.forEach((point) => {
        const timeKey = new Date(point.timestamp).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        if (!grouped[timeKey]) {
          grouped[timeKey] = { timestamp: timeKey };
        }

        grouped[timeKey][point.roomName] =
          (grouped[timeKey][point.roomName] || 0) + (point[metric] || 0);
      });

      return Object.values(grouped);
    }
  };

  const chartData = prepareChartData();

  // Get unique room names for comparison
  const roomNames = compareRooms
    ? Array.from(new Set(data.map((d) => d.roomName)))
    : [];

  const getMetricLabel = () => {
    switch (metric) {
      case "temperature":
        return "Temperature (°C)";
      case "humidity":
        return "Humidity (%)";
      case "lighting":
        return "Lighting (%)";
      case "motion":
        return "Motion/Occupancy";
      default:
        return metric;
    }
  };

  if (data.length === 0) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-sm font-medium">No data available</p>
            <p className="text-xs text-gray-400 mt-1">
              Select a date range and rooms to view historical data
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    if (chartType === "line") {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="timestamp"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            label={{
              value: getMetricLabel(),
              angle: -90,
              position: "insideLeft",
              style: { fill: "#6B7280", fontSize: 12 },
            }}
          />
          <Tooltip content={<CustomTooltip metric={metric} />} />
          {compareRooms ? (
            <>
              <Legend />
              {roomNames.map((room, index) => (
                <Line
                  key={room}
                  type="monotone"
                  dataKey={room}
                  stroke={ROOM_COLORS[index % ROOM_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </>
          ) : (
            <Line
              type="monotone"
              dataKey={metric}
              stroke="#6366F1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      );
    }

    if (chartType === "area") {
      return (
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="timestamp"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            label={{
              value: getMetricLabel(),
              angle: -90,
              position: "insideLeft",
              style: { fill: "#6B7280", fontSize: 12 },
            }}
          />
          <Tooltip content={<CustomTooltip metric={metric} />} />
          {compareRooms ? (
            <>
              <Legend />
              {roomNames.map((room, index) => (
                <Area
                  key={room}
                  type="monotone"
                  dataKey={room}
                  fill={ROOM_COLORS[index % ROOM_COLORS.length]}
                  fillOpacity={0.6}
                  stroke={ROOM_COLORS[index % ROOM_COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </>
          ) : (
            <Area
              type="monotone"
              dataKey={metric}
              fill="#6366F1"
              fillOpacity={0.6}
              stroke="#6366F1"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      );
    }

    if (chartType === "bar") {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="timestamp"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            label={{
              value: getMetricLabel(),
              angle: -90,
              position: "insideLeft",
              style: { fill: "#6B7280", fontSize: 12 },
            }}
          />
          <Tooltip content={<CustomTooltip metric={metric} />} />
          {compareRooms ? (
            <>
              <Legend />
              {roomNames.map((room, index) => (
                <Bar
                  key={room}
                  dataKey={room}
                  fill={ROOM_COLORS[index % ROOM_COLORS.length]}
                />
              ))}
            </>
          ) : (
            <Bar dataKey={metric} fill="#6366F1" />
          )}
        </BarChart>
      );
    }

    return null;
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
