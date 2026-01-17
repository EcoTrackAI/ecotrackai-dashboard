// MetricCardProps is globally available from types/globals.d.ts

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  className = "",
}) => {
  const getTrendColor = () => {
    if (!trend) return "";

    // If isPositive is explicitly set, use that
    if (trend.isPositive !== undefined) {
      return trend.isPositive ? "text-[#16A34A]" : "text-[#DC2626]";
    }

    // Default: down is good (energy savings), up is warning
    return trend.direction === "down" ? "text-[#16A34A]" : "text-[#FB923C]";
  };

  const getTrendIcon = () => {
    if (!trend) return null;

    return trend.direction === "up" ? (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 ${className}`}
      role="article"
      aria-label={`${title} metric card`}
    >
      {/* Header with icon and title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-[#6366F1] shrink-0" aria-hidden="true">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-600 leading-tight">
            {title}
          </h3>
        </div>
      </div>

      {/* Value and unit */}
      <div className="flex items-baseline gap-2 mb-2">
        <span
          className="text-3xl font-semibold text-[#111827] tabular-nums"
          aria-label={`${value} ${unit}`}
        >
          {value}
        </span>
        <span className="text-sm font-medium text-gray-500">{unit}</span>
      </div>

      {/* Trend indicator */}
      {trend && (
        <div
          className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}
          role="status"
          aria-label={`Trend ${trend.direction} by ${trend.value}%`}
        >
          {getTrendIcon()}
          <span className="tabular-nums">{trend.value}%</span>
          <span className="text-gray-500 ml-1 font-normal">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
