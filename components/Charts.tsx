"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartsProps {
  temperatureData: HistoricalDataPoint[];
  humidityData: HistoricalDataPoint[];
  lightData: HistoricalDataPoint[];
}

export default function Charts({
  temperatureData,
  humidityData,
  lightData,
}: ChartsProps) {
  const [timeFilter, setTimeFilter] = useState<"1h" | "6h" | "24h">("1h");
  const [activeChart, setActiveChart] = useState<
    "all" | "temperature" | "humidity" | "light"
  >("all");

  const filterData = (data: HistoricalDataPoint[]) => {
    const now = Date.now();
    const filterTime =
      timeFilter === "1h" ? 3600000 : timeFilter === "6h" ? 21600000 : 86400000;
    return data.filter((d) => now - d.timestamp < filterTime);
  };

  const filteredTempData = filterData(temperatureData);
  const filteredHumData = filterData(humidityData);
  const filteredLightData = filterData(lightData);

  // Prepare data for Chart.js
  const tempLabels = filteredTempData.map((d) => {
    const date = new Date(d.timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  const humLabels = filteredHumData.map((d) => {
    const date = new Date(d.timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  const lightLabels = filteredLightData.map((d) => {
    const date = new Date(d.timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  const temperatureChartData = {
    labels: tempLabels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: filteredTempData.map((d) => d.value),
        borderColor: "rgb(59, 130, 246)", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "rgb(255, 255, 255)",
        pointBorderWidth: 2,
      },
    ],
  };

  const humidityChartData = {
    labels: humLabels,
    datasets: [
      {
        label: "Humidity (%)",
        data: filteredHumData.map((d) => d.value),
        borderColor: "rgb(16, 185, 129)", // emerald-500
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "rgb(255, 255, 255)",
        pointBorderWidth: 2,
      },
    ],
  };

  const lightChartData = {
    labels: lightLabels,
    datasets: [
      {
        label: "Light Level (%)",
        data: filteredLightData.map((d) => d.value),
        borderColor: "rgb(245, 158, 11)", // amber-500
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(245, 158, 11)",
        pointBorderColor: "rgb(255, 255, 255)",
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        titleColor: "rgb(17, 24, 39)",
        bodyColor: "rgb(75, 85, 99)",
        borderColor: "rgb(229, 231, 235)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.y.toFixed(1)}${
              context.dataset.label.includes("Temperature") ? "°C" : "%"
            }`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(229, 231, 235, 0.6)",
          drawBorder: false,
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          maxTicksLimit: 8,
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(229, 231, 235, 0.6)",
          drawBorder: false,
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <section>
      <div className="bg-white rounded-lg p-5 sm:p-6 border border-gray-200 transition-all duration-200 hover:shadow-md animate-fadeIn">
        {/* Header with filters and tabs */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-7 bg-blue-600 rounded-full"></span>
              <span className="truncate">Historical Data</span>
            </h2>

            {/* Time Filter Buttons */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {(["1h", "6h", "24h"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    timeFilter === filter
                      ? "bg-slate-900 text-white"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Type Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all" as const, label: "All Sensors", icon: "📊" },
              { id: "temperature" as const, label: "Temperature", icon: "🌡️" },
              { id: "humidity" as const, label: "Humidity", icon: "💧" },
              { id: "light" as const, label: "Light", icon: "💡" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeChart === tab.id
                    ? "bg-slate-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden xs:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div
          className={`grid gap-5 ${
            activeChart === "all"
              ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {/* Temperature Chart */}
          {(activeChart === "all" || activeChart === "temperature") && (
            <div className="bg-gray-50 rounded-lg p-5 border border-blue-100 transition-all duration-200 hover:border-blue-200">
              <div className="flex items-center space-x-2 mb-4">
                <svg
                  className="w-5 h-5 text-blue-600"
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
                <h3 className="text-base font-semibold text-gray-900">
                  Temperature
                </h3>
              </div>
              <div className="h-56">
                <Line data={temperatureChartData} options={chartOptions} />
              </div>
            </div>
          )}

          {/* Humidity Chart */}
          {(activeChart === "all" || activeChart === "humidity") && (
            <div className="bg-gray-50 rounded-lg p-5 border border-emerald-100 transition-all duration-200 hover:border-emerald-200">
              <div className="flex items-center space-x-2 mb-4">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
                <h3 className="text-base font-semibold text-gray-900">
                  Humidity
                </h3>
              </div>
              <div className="h-56">
                <Line data={humidityChartData} options={chartOptions} />
              </div>
            </div>
          )}

          {/* Light Level Chart */}
          {(activeChart === "all" || activeChart === "light") && (
            <div className="bg-gray-50 rounded-lg p-5 border border-amber-100 transition-all duration-200 hover:border-amber-200">
              <div className="flex items-center space-x-2 mb-4">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <h3 className="text-base font-semibold text-gray-900">
                  Light Level
                </h3>
              </div>
              <div className="h-56">
                <Line data={lightChartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
