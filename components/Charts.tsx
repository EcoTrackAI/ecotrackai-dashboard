"use client";

import { useState } from "react";

interface ChartsProps {
  temperatureData: HistoricalDataPoint[];
  humidityData: HistoricalDataPoint[];
}

type TimeFilter = "1h" | "6h" | "24h";

export default function Charts({ temperatureData, humidityData }: ChartsProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("1h");

  const filterData = (data: HistoricalDataPoint[], filter: TimeFilter) => {
    const now = Date.now();
    const timeRanges = {
      "1h": 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
    };
    const cutoff = now - timeRanges[filter];
    return data.filter((point) => point.timestamp >= cutoff);
  };

  const filteredTemp = filterData(temperatureData, timeFilter);
  const filteredHumidity = filterData(humidityData, timeFilter);

  const renderMiniChart = (
    data: HistoricalDataPoint[],
    color: string,
    label: string
  ) => {
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-400">
          No data available
        </div>
      );
    }

    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    return (
      <div className="relative h-48">
        <svg
          className="w-full h-full"
          viewBox="0 0 400 150"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id={`gradient-${label}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1="0"
            y1="37.5"
            x2="400"
            y2="37.5"
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
          <line
            x1="0"
            y1="75"
            x2="400"
            y2="75"
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
          <line
            x1="0"
            y1="112.5"
            x2="400"
            y2="112.5"
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />

          {/* Area under curve */}
          <path
            d={`M 0 150 ${data
              .map((point, i) => {
                const x = (i / (data.length - 1)) * 400;
                const y = 150 - ((point.value - minValue) / range) * 140 - 5;
                return `L ${x} ${y}`;
              })
              .join(" ")} L 400 150 Z`}
            fill={`url(#gradient-${label})`}
          />

          {/* Line */}
          <path
            d={data
              .map((point, i) => {
                const x = (i / (data.length - 1)) * 400;
                const y = 150 - ((point.value - minValue) / range) * 140 - 5;
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ")}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((point, i) => {
            const x = (i / (data.length - 1)) * 400;
            const y = 150 - ((point.value - minValue) / range) * 140 - 5;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                stroke="white"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 -ml-12">
          <span>{maxValue.toFixed(1)}</span>
          <span>{((maxValue + minValue) / 2).toFixed(1)}</span>
          <span>{minValue.toFixed(1)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Historical Trends</h3>
        <div className="flex space-x-2">
          {(["1h", "6h", "24h"] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="text-sm font-semibold text-gray-700">
              Temperature (°C)
            </h4>
          </div>
          {renderMiniChart(filteredTemp, "#ef4444", "temp")}
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="text-sm font-semibold text-gray-700">
              Humidity (%)
            </h4>
          </div>
          {renderMiniChart(filteredHumidity, "#3b82f6", "humidity")}
        </div>
      </div>
    </div>
  );
}
