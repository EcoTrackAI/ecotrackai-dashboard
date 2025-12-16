"use client";

import { motion } from "framer-motion";

interface EnvironmentSummaryProps {
  data: SensorData | null;
}

export default function EnvironmentSummary({ data }: EnvironmentSummaryProps) {
  if (!data) return null;

  const getTemperatureStatus = (temp: number) => {
    if (temp < 18) return "cool";
    if (temp < 24) return "comfortable";
    if (temp < 28) return "warm";
    return "hot";
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity < 30) return "dry";
    if (humidity < 60) return "comfortable";
    return "humid";
  };

  const getLightStatus = (light: number) => {
    if (light > 70) return "dim"; // Dark (high value)
    if (light > 30) return "moderate";
    return "bright"; // Well lit (low value)
  };

  const tempStatus = getTemperatureStatus(data.temperature);
  const humidityStatus = getHumidityStatus(data.humidity);
  const lightStatus = getLightStatus(data.light);
  const occupancyStatus = data.motion ? "occupied" : "vacant";

  const summary = `The room is ${tempStatus} and ${occupancyStatus} with ${lightStatus} lighting. The humidity level is ${humidityStatus}.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg"
    >
      <div className="flex items-start space-x-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="shrink-0 mt-1 p-2 bg-blue-50 rounded-lg shadow-md"
        >
          <svg
            className="w-6 h-6 text-blue-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
            Environment Summary
          </h3>
          <p className="text-gray-700 leading-relaxed font-medium text-base">
            {summary}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
