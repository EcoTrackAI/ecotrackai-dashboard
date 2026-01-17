import React from "react";

export const RoomStatusCard: React.FC<RoomStatusCardProps> = ({
  roomName,
  temperature,
  humidity,
  light,
  motion,
  className = "",
}) => {
  const motionStatus = motion ? "Motion Detected" : "No Motion";

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 ${className}`}
      role="article"
      aria-label={`${roomName} status`}
    >
      {/* Header with room name and motion status */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-semibold text-[#111827]">{roomName}</h3>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${motion ? "bg-[#16A34A]" : "bg-gray-300"}`}
            aria-label={motionStatus}
            role="status"
          />
          <span className="text-xs font-medium text-gray-600">
            {motionStatus}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="space-y-3">
        {/* Temperature */}
        {temperature !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#6366F1]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="text-sm text-gray-600">Temperature</span>
            </div>
            <span className="text-sm font-semibold text-[#111827] tabular-nums">
              {temperature.toFixed(1)}°C
            </span>
          </div>
        )}

        {/* Humidity */}
        {humidity !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#6366F1]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-sm text-gray-600">Humidity</span>
            </div>
            <span className="text-sm font-semibold text-[#111827] tabular-nums">
              {humidity.toFixed(0)}%
            </span>
          </div>
        )}

        {/* Light */}
        {light !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#6366F1]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l.707-.707M6.343 17.657l-.707-.707m12.728 0l-.707.707M6.343 6.343l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="text-sm text-gray-600">Light</span>
            </div>
            <span className="text-sm font-semibold text-[#111827] tabular-nums">
              {light.toFixed(0)} lux
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomStatusCard;
