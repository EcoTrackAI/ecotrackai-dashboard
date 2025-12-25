import React from "react";

const STATUS_CONFIG: Record<
  SensorStatus,
  { color: string; bgColor: string; label: string; ariaLabel: string }
> = {
  normal: {
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    label: "Normal",
    ariaLabel: "Sensor status: Normal operation",
  },
  warning: {
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    label: "Warning",
    ariaLabel: "Sensor status: Warning condition",
  },
  critical: {
    color: "text-red-600",
    bgColor: "bg-red-100",
    label: "Critical",
    ariaLabel: "Sensor status: Critical condition",
  },
  offline: {
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    label: "Offline",
    ariaLabel: "Sensor status: Offline",
  },
};

const formatTimestamp = (timestamp: Date | string): string => {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  if (isNaN(date.getTime())) return "Invalid date";

  const diffMin = Math.floor((new Date().getTime() - date.getTime()) / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

export const LiveSensorCard: React.FC<LiveSensorCardProps> = ({
  sensorName,
  currentValue,
  unit,
  status,
  description,
  lastUpdate,
  onClick,
  className = "",
}) => {
  const statusConfig = STATUS_CONFIG[status];
  const isInteractive = Boolean(onClick);

  return (
    <article
      className={`
        bg-white rounded-lg border border-gray-200 p-4
        transition-all duration-200
        ${
          isInteractive
            ? "cursor-pointer hover:shadow-md hover:border-indigo-200"
            : ""
        }
        ${className}
      `}
      onClick={onClick}
      role={isInteractive ? "button" : "article"}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      aria-label={`${sensorName}: ${currentValue} ${unit}, ${statusConfig.ariaLabel}`}
    >
      {/* Header with sensor name and status indicator */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {sensorName}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {description}
            </p>
          )}
        </div>

        {/* Status indicator badge */}
        <div
          className={`
            flex items-center gap-1.5 px-2 py-1 rounded-full
            text-xs font-medium whitespace-nowrap ml-2
            ${statusConfig.bgColor} ${statusConfig.color}
          `}
          aria-label={statusConfig.ariaLabel}
        >
          {/* Status dot with pulse animation for active statuses */}
          <span
            className={`
              w-2 h-2 rounded-full
              ${status === "normal" ? "bg-emerald-600" : ""}
              ${status === "warning" ? "bg-orange-500" : ""}
              ${status === "critical" ? "bg-red-600 animate-pulse" : ""}
              ${status === "offline" ? "bg-gray-400" : ""}
            `}
            aria-hidden="true"
          />
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {/* Current value display */}
      <div className="mb-2">
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-3xl font-semibold text-gray-900 tabular-nums"
            aria-label={`Current value: ${currentValue}`}
          >
            {typeof currentValue === "number"
              ? currentValue.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })
              : currentValue}
          </span>
          <span className="text-base font-medium text-gray-600">{unit}</span>
        </div>
      </div>

      {/* Timestamp */}
      {lastUpdate && (
        <div className="flex items-center text-xs text-gray-500">
          <svg
            className="w-3.5 h-3.5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <time
            dateTime={
              typeof lastUpdate === "string"
                ? lastUpdate
                : lastUpdate.toISOString()
            }
          >
            {formatTimestamp(lastUpdate)}
          </time>
        </div>
      )}
    </article>
  );
};

export default LiveSensorCard;
