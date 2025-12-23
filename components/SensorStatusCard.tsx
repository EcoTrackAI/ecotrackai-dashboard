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
    warning: "border-gray-300 bg-white",
    critical: "border-gray-400 bg-white",
  };

  const statusDots = {
    normal: "bg-gray-400",
    warning: "bg-gray-600",
    critical: "bg-gray-800",
  };

  const iconColors = {
    normal: "text-gray-700",
    warning: "text-gray-800",
    critical: "text-gray-900",
  };

  return (
    <div
      className={`relative rounded-lg border ${statusColors[status]} p-2.5 xs:p-3 sm:p-4 md:p-5 transition-shadow hover:shadow-md`}
    >

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <div
              className={`${iconColors[status]} p-1.5 sm:p-2 rounded-md bg-gray-50 shrink-0`}
            >
              {icon}
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">
              {title}
            </h3>
          </div>
          <div className="flex items-baseline space-x-1.5 sm:space-x-2">
            <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 truncate">
              {value}
            </p>
            <span className="text-base sm:text-lg md:text-xl text-gray-600 font-semibold shrink-0">
              {unit}
            </span>
          </div>

          {/* Status indicator bar */}
          <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden\">
            <div
              className={`h-full ${statusDots[status].replace(
                "shadow-lg",
                ""
              )} transition-all duration-500 group-hover:w-full`}
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
        <div
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${statusDots[status]} shrink-0`}
        />
      </div>
    </div>
  );
}
