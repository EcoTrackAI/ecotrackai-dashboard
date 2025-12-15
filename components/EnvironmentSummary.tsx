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
    if (light < 30) return "dim";
    if (light < 70) return "moderate";
    return "bright";
  };

  const tempStatus = getTemperatureStatus(data.temperature);
  const humidityStatus = getHumidityStatus(data.humidity);
  const lightStatus = getLightStatus(data.light);
  const occupancyStatus = data.motion ? "occupied" : "vacant";

  const summary = `The room is ${tempStatus} and ${occupancyStatus} with ${lightStatus} lighting. The humidity level is ${humidityStatus}.`;

  return (
    <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
      <div className="flex items-start space-x-3">
        <div className="shrink-0 mt-1">
          <svg
            className="w-6 h-6 text-blue-600"
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
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">
            Environment Summary
          </h3>
          <p className="text-blue-800 leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
}
