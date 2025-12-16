"use client";

import { motion } from "framer-motion";
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
}

export default function Charts({ temperatureData, humidityData }: ChartsProps) {
  const [timeFilter, setTimeFilter] = useState<"1h" | "6h" | "24h">("1h");

  const filterData = (data: HistoricalDataPoint[]) => {
    const now = Date.now();
    const filterTime =
      timeFilter === "1h" ? 3600000 : timeFilter === "6h" ? 21600000 : 86400000;
    return data.filter((d) => now - d.timestamp < filterTime);
  };

  const filteredTempData = filterData(temperatureData);
  const filteredHumData = filterData(humidityData);

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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-4 sm:mt-6 md:mt-8"
    >
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-4 sm:mb-6 gap-3 xs:gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900">
          Historical Data
        </h2>
        <div className="flex space-x-1.5 sm:space-x-2">
          {(["1h", "6h", "24h"] as const).map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
                timeFilter === filter
                  ? "bg-blue-700 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Temperature Chart */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl border border-gray-200"
        >
          <div className="flex items-center space-x-2 mb-3 sm:mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700"
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
            </motion.div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-700">
              Temperature Trend
            </h3>
          </div>
          <div className="h-48 sm:h-56 md:h-64">
            <Line data={temperatureChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Humidity Chart */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl border border-gray-200"
        >
          <div className="flex items-center space-x-2 mb-3 sm:mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-green-900"
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
            </motion.div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-green-900">
              Humidity Trend
            </h3>
          </div>
          <div className="h-48 sm:h-56 md:h-64">
            <Line data={humidityChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
