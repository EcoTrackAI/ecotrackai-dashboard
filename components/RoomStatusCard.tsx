import React from "react";

export interface RoomStatusCardProps {
  roomName: string;
  isOccupied: boolean;
  activeDevices: number;
  totalDevices: number;
  currentPower: number; // in watts
  temperature?: number;
  className?: string;
}

export const RoomStatusCard: React.FC<RoomStatusCardProps> = ({
  roomName,
  isOccupied,
  activeDevices,
  totalDevices,
  currentPower,
  temperature,
  className = "",
}) => {
  const occupancyColor = isOccupied ? "bg-[#16A34A]" : "bg-gray-300";
  const occupancyText = isOccupied ? "Occupied" : "Empty";

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 ${className}`}
      role="article"
      aria-label={`${roomName} status`}
    >
      {/* Header with room name and occupancy */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-semibold text-[#111827]">{roomName}</h3>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${occupancyColor}`}
            aria-label={occupancyText}
            role="status"
          />
          <span className="text-xs font-medium text-gray-600">
            {occupancyText}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="space-y-3">
        {/* Devices */}
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
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-600">Devices</span>
          </div>
          <span className="text-sm font-semibold text-[#111827] tabular-nums">
            {activeDevices}/{totalDevices}
          </span>
        </div>

        {/* Power consumption */}
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-sm text-gray-600">Power</span>
          </div>
          <span className="text-sm font-semibold text-[#111827] tabular-nums">
            {currentPower} W
          </span>
        </div>

        {/* Temperature (if available) */}
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
              <span className="text-sm text-gray-600">Temp</span>
            </div>
            <span className="text-sm font-semibold text-[#111827] tabular-nums">
              {temperature}°C
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomStatusCard;
