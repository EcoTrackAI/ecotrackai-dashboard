"use client";

export default function SensorStatusCard({
  title,
  value,
  unit,
  icon,
  status = "normal",
}: SensorCardProps) {
  const statusColors = {
    normal: "border-gray-200 bg-white",
    warning: "border-amber-200 bg-amber-50/50",
    critical: "border-rose-200 bg-rose-50/50",
  };

  const statusDots = {
    normal: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-rose-500",
  };

  const iconColors = {
    normal: "text-gray-600",
    warning: "text-amber-600",
    critical: "text-rose-600",
  };

  return (
    <div
      className={`relative rounded-lg border ${statusColors[status]} p-4 sm:p-5 transition-all duration-200 hover:shadow-md group animate-scaleIn`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-3">
            <div
              className={`${iconColors[status]} shrink-0`}
            >
              {icon}
            </div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
              {title}
            </h3>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <p className="text-3xl sm:text-4xl font-semibold text-gray-900 truncate">
              {value}
            </p>
            <span className="text-lg text-gray-500 font-medium shrink-0">
              {unit}
            </span>
          </div>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${statusDots[status]} shrink-0 animate-pulse-subtle`}
        />
      </div>
    </div>
  );
}
