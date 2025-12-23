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
        borderColor: "rgb(25, 118, 210)", // blue-700
        backgroundColor: "rgba(25, 118, 210, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(25, 118, 210)",
        pointBorderColor: "rgb(27, 94, 32)", // green-900
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
        borderColor: "rgb(27, 94, 32)", // green-900
        backgroundColor: "rgba(27, 94, 32, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(27, 94, 32)",
        pointBorderColor: "rgb(245, 124, 0)", // orange-600
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
        borderColor: "rgb(245, 124, 0)", // orange-600
        backgroundColor: "rgba(245, 124, 0, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(245, 124, 0)",
        pointBorderColor: "rgb(25, 118, 210)", // blue-700
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
        backgroundColor: "rgba(255, 255, 255, 0.95)", // white
        titleColor: "rgb(38, 50, 56)", // gray-800
        bodyColor: "rgb(96, 125, 139)", // gray-500
        borderColor: "rgb(229, 231, 235)", // gray-200
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
          color: "rgba(229, 231, 235, 0.5)", // gray-200
          drawBorder: false,
        },
        ticks: {
          color: "rgb(107, 114, 128)", // gray-500
          maxTicksLimit: 8,
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
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
    <section className="mt-2 xs:mt-3 sm:mt-4 md:mt-6">
      <div className="bg-white rounded-lg p-3 xs:p-4 sm:p-5 md:p-6 border border-gray-200">
        {/* Header with filters and tabs */}
        <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-6">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3 sm:gap-4">
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
              <span className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gray-800 rounded-full"></span>
              <span className="truncate">Historical Data</span>
            </h2>

            {/* Time Filter Buttons */}
            <div className="flex space-x-1 xs:space-x-1.5 sm:space-x-2 bg-gray-100 p-0.5 xs:p-1 rounded-md">
              {(["1h", "6h", "24h"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-md text-[10px] xs:text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    timeFilter === filter
                      ? "bg-gray-800 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Type Tabs */}
          <div className="flex flex-wrap gap-1.5 xs:gap-2">
            {[
              { id: "all" as const, label: "All Sensors", icon: "📊" },
              { id: "temperature" as const, label: "Temperature", icon: "🌡️" },
              { id: "humidity" as const, label: "Humidity", icon: "💧" },
              { id: "light" as const, label: "Light", icon: "💡" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-md text-[10px] xs:text-xs sm:text-sm font-medium transition-colors whitespace-nowrap border ${
                  activeChart === tab.id
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300"
                }`}
              >
                <span className="text-sm xs:text-base">{tab.icon}</span>
                <span className="hidden xs:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div
          className={`grid gap-3 xs:gap-4 sm:gap-5 md:gap-6 ${
            activeChart === "all"
              ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {/* Temperature Chart */}
          {(activeChart === "all" || activeChart === "temperature") && (
            <div className="bg-white rounded-lg p-3 xs:p-4 sm:p-5 md:p-6 border border-gray-200">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
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
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
                  Temperature
                </h3>
              </div>
              <div className="h-48 sm:h-56 md:h-64">
                <Line data={temperatureChartData} options={chartOptions} />
              </div>
            </div>
          )}

          {/* Humidity Chart */}
          {(activeChart === "all" || activeChart === "humidity") && (
            <div className="bg-white rounded-lg p-3 xs:p-4 sm:p-5 md:p-6 border border-gray-200">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
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
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
                  Humidity
                </h3>
              </div>
              <div className="h-48 sm:h-56 md:h-64">
                <Line data={humidityChartData} options={chartOptions} />
              </div>
            </div>
          )}

          {/* Light Level Chart */}
          {(activeChart === "all" || activeChart === "light") && (
            <div className="bg-white rounded-lg p-3 xs:p-4 sm:p-5 md:p-6 border border-gray-200">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
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
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
                  Light Level
                </h3>
              </div>
              <div className="h-48 sm:h-56 md:h-64">
                <Line data={lightChartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
