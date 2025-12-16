"use client";

import { motion } from "framer-motion";

interface AIRecommendationProps {
  data: SensorData | null;
}

export default function AIRecommendation({ data }: AIRecommendationProps) {
  if (!data) return null;

  // AI logic for recommendations
  const getRecommendation = (): AIRecommendationData => {
    const { temperature, humidity, motion } = data;

    if (!motion) {
      return {
        action: "Energy Saving Mode Recommended",
        reasoning: [
          "No occupancy detected in the room",
          "Recommend turning off AC and lights to save energy",
          "Motion sensors will automatically activate systems when someone enters",
        ],
      };
    }

    if (temperature > 28) {
      return {
        action: "Turn ON AC - Set to 24°C",
        reasoning: [
          `Current temperature (${temperature}°C) is above comfortable range`,
          "Occupancy detected - cooling required",
          humidity > 60
            ? "High humidity will also be reduced"
            : "Will maintain optimal comfort level",
        ],
      };
    }

    if (temperature < 18) {
      return {
        action: "Turn OFF AC - Room is Cool",
        reasoning: [
          `Temperature (${temperature}°C) is below comfortable range`,
          "No cooling required",
          "Consider heating if temperature drops further",
        ],
      };
    }

    return {
      action: "Maintain Current Settings",
      reasoning: [
        "Temperature is in comfortable range (18-28°C)",
        `Humidity level is ${humidity > 60 ? "high but" : ""} acceptable`,
        "No immediate action required",
      ],
    };
  };

  const recommendation = getRecommendation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl p-6 border-l-4 border-green-900 shadow-xl"
    >
      <div className="flex items-start space-x-4">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="shrink-0"
        >
          <div className="w-14 h-14 bg-linear-to-br from-green-900 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-green-900 mb-3 uppercase tracking-wide">
            🤖 AI Insight
          </h3>
          <motion.p
            key={recommendation.action}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-gray-800 mb-4"
          >
            {recommendation.action}
          </motion.p>
          <div className="space-y-3">
            {recommendation.reasoning.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg"
              >
                <svg
                  className="w-5 h-5 text-blue-700 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-gray-700 font-medium">{reason}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
