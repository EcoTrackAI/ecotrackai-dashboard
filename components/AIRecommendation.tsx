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
    <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-start space-x-4">
        <div className="shrink-0">
          <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-purple-900 mb-2">AI Insight</h3>
          <p className="text-xl font-semibold text-purple-800 mb-3">
            {recommendation.action}
          </p>
          <div className="space-y-2">
            {recommendation.reasoning.map((reason, index) => (
              <div key={index} className="flex items-start space-x-2">
                <svg
                  className="w-5 h-5 text-purple-600 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-purple-700">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
