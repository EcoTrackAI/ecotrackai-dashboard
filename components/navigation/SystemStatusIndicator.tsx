"use client";

import { STATUS_COLORS } from "@/lib/constants";

interface SystemStatusIndicatorProps {
  status: SystemStatus;
  className?: string;
}

export function SystemStatusIndicator({
  status,
  className = "",
}: SystemStatusIndicatorProps) {
  const statusConfig = {
    online: {
      label: "Online",
      color: STATUS_COLORS.online,
      ariaLabel: "System is online",
    },
    offline: {
      label: "Offline",
      color: STATUS_COLORS.offline,
      ariaLabel: "System is offline",
    },
    warning: {
      label: "Warning",
      color: STATUS_COLORS.warning,
      ariaLabel: "System has warnings",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="status"
      aria-label={config.ariaLabel}
    >
      <div className="relative">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: config.color }}
          aria-hidden="true"
        />
        {status === "online" && (
          <div
            className="absolute inset-0 h-2 w-2 rounded-full animate-ping"
            style={{ backgroundColor: config.color, opacity: 0.75 }}
            aria-hidden="true"
          />
        )}
      </div>
      <span className="text-sm font-medium text-gray-700 hidden sm:inline">
        {config.label}
      </span>
    </div>
  );
}
