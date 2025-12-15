export default function SensorStatusCard({
  title,
  value,
  unit,
  icon,
  status = "normal",
}: SensorCardProps) {
  const statusColors = {
    normal: "border-green-200 bg-green-50/30",
    warning: "border-yellow-200 bg-yellow-50/30",
    critical: "border-red-200 bg-red-50/30",
  };

  const statusDots = {
    normal: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  };

  return (
    <div
      className={`relative bg-white rounded-xl border-2 ${statusColors[status]} p-6 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="text-gray-700">{icon}</div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          <div className="flex items-baseline space-x-1">
            <p className="text-4xl font-bold text-gray-900">{value}</p>
            <span className="text-lg text-gray-500 font-medium">{unit}</span>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${statusDots[status]}`} />
      </div>
    </div>
  );
}
