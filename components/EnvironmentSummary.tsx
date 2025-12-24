"use client";

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
    <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 transition-all duration-200 hover:shadow-md animate-scaleIn">
      <div className="flex items-start space-x-3">
        <div className="shrink-0 mt-0.5 text-blue-600">
          <svg
            className="w-6 h-6"
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
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
              Environment Status
            </h3>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              AUTO
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}
