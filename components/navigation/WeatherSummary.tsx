"use client";

const WEATHER_ICONS = {
  sunny: "☀️",
  "partly-cloudy": "⛅",
  cloudy: "☁️",
  rainy: "🌧️",
  snowy: "❄️",
  "not-available": "❓",
} as const;

export function WeatherSummary({
  weather,
  className = "",
}: WeatherSummaryProps) {
  const icon = WEATHER_ICONS[weather.condition];

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label={`Current weather: ${weather.condition}, ${weather.temperature} degrees in ${weather.location}`}
    >
      <span className="text-xl" aria-hidden="true">
        {icon}
      </span>
      <div className="hidden md:flex flex-col">
        <span className="text-sm font-semibold text-gray-900">
          {weather.temperature}°C
        </span>
        <span className="text-xs text-gray-500 capitalize">
          {weather.condition.replace("-", " ")}
        </span>
      </div>
      <span className="md:hidden text-sm font-semibold text-gray-900">
        {weather.temperature}°C
      </span>
    </div>
  );
}
