import React from "react";

// AutomationActivityItemProps is globally available from types/globals.d.ts

export const AutomationActivityItem: React.FC<AutomationActivityItemProps> = ({
  title,
  description,
  timestamp,
  status,
  icon,
  className = "",
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case "success":
        return {
          bg: "bg-[#16A34A]/10",
          text: "text-[#16A34A]",
          border: "border-[#16A34A]/20",
        };
      case "warning":
        return {
          bg: "bg-[#FB923C]/10",
          text: "text-[#FB923C]",
          border: "border-[#FB923C]/20",
        };
      case "error":
        return {
          bg: "bg-[#DC2626]/10",
          text: "text-[#DC2626]",
          border: "border-[#DC2626]/20",
        };
      case "info":
      default:
        return {
          bg: "bg-[#6366F1]/10",
          text: "text-[#6366F1]",
          border: "border-[#6366F1]/20",
        };
    }
  };

  const defaultIcon = (
    <svg
      className="w-5 h-5"
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
  );

  const styles = getStatusStyles();

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg border ${styles.border} bg-white hover:shadow-sm transition-all duration-200 ${className}`}
      role="article"
      aria-label={`Automation activity: ${title}`}
    >
      {/* Icon */}
      <div
        className={`shrink-0 w-10 h-10 rounded-lg ${styles.bg} ${styles.text} flex items-center justify-center`}
        aria-hidden="true"
      >
        {icon || defaultIcon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-semibold text-[#111827] leading-tight">
            {title}
          </h4>
          <time
            className="text-xs text-gray-500 whitespace-nowrap shrink-0"
            dateTime={timestamp}
          >
            {timestamp}
          </time>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default AutomationActivityItem;
