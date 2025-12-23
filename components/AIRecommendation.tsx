"use client";

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
    <div className="bg-white rounded-lg border-l-4 border-gray-800 border-t border-r border-b border-gray-200 p-3 xs:p-4 sm:p-5 md:p-6">
      <div className="flex items-start space-x-2 xs:space-x-3 sm:space-x-4">
        <div className="shrink-0">
          <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-800 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white"
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
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 xs:gap-2 mb-1.5 xs:mb-2 sm:mb-3">
            <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-gray-900 uppercase tracking-wide">
              AI Recommendation
            </h3>
            <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-gray-100 text-gray-600 text-[9px] xs:text-xs font-medium rounded-md">
              LIVE
            </span>
          </div>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 xs:mb-3 sm:mb-4 wrap-break-word">
            {recommendation.action}
          </p>
          <div className="space-y-1.5 xs:space-y-2 sm:space-y-3">
            {recommendation.reasoning.map((reason, index) => (
              <div
                key={index}
                className="flex items-start space-x-1.5 xs:space-x-2 sm:space-x-3 bg-gray-50 p-2 xs:p-2.5 sm:p-3 rounded-md"
              >
                <svg
                  className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs sm:text-sm text-gray-600 font-medium wrap-break-word">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
