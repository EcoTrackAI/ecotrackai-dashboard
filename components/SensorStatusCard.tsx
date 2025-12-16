"use client";

import { motion } from "framer-motion";

export default function SensorStatusCard({
  title,
  value,
  unit,
  icon,
  status = "normal",
}: SensorCardProps) {
  const statusColors = {
    normal: "border-blue-200 bg-white shadow-blue-100",
    warning: "border-orange-200 bg-white shadow-orange-100",
    critical: "border-red-200 bg-white shadow-red-100",
  };

  const statusDots = {
    normal: "bg-blue-700 shadow-blue-700/50",
    warning: "bg-orange-600 shadow-orange-600/50",
    critical: "bg-red-600 shadow-red-600/50",
  };

  const iconColors = {
    normal: "text-blue-700",
    warning: "text-orange-600",
    critical: "text-red-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative backdrop-blur-sm rounded-2xl border-2 ${statusColors[status]} p-6 shadow-lg hover:shadow-xl transition-all`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className={`${iconColors[status]} p-2 rounded-lg bg-gray-50 shadow-sm`}
            >
              {icon}
            </motion.div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          <div className="flex items-baseline space-x-2">
            <motion.p
              key={value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold text-gray-800"
            >
              {value}
            </motion.p>
            <span className="text-xl text-gray-600 font-semibold">{unit}</span>
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-3 h-3 rounded-full ${statusDots[status]} shadow-lg`}
        />
      </div>
    </motion.div>
  );
}
