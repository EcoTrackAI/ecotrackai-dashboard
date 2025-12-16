"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ControlPanel() {
  const [controls, setControls] = useState<ControlSettings>({
    fanMode: "AUTO",
    acTemperature: 24,
    systemMode: "AUTO",
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-gray-200 shadow-xl"
    >
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-green-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-green-900">
          Manual Control Panel
        </h3>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* System Mode */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2 sm:mb-3 uppercase tracking-wide">
            System Mode
          </label>
          <div className="flex space-x-2 sm:space-x-3">
            {(["AUTO", "MANUAL"] as const).map((mode) => (
              <motion.button
                key={mode}
                onClick={() => setControls({ ...controls, systemMode: mode })}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  controls.systemMode === mode
                    ? "bg-green-900 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200"
                }`}
              >
                {mode}
              </motion.button>
            ))}
          </div>
          {controls.systemMode === "AUTO" && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-green-900 font-medium bg-green-50 p-2 rounded-lg"
            >
              🤖 AI will control devices based on sensor data
            </motion.p>
          )}
        </div>

        {/* Fan Control */}
        <div
          className={
            controls.systemMode === "AUTO"
              ? "opacity-40 pointer-events-none"
              : ""
          }
        >
          <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-3 uppercase tracking-wide">
            Fan Control
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {(["ON", "OFF", "AUTO"] as const).map((mode) => (
              <motion.button
                key={mode}
                onClick={() => setControls({ ...controls, fanMode: mode })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  controls.fanMode === mode
                    ? "bg-blue-700 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200"
                }`}
              >
                {mode}
              </motion.button>
            ))}
          </div>
        </div>

        {/* AC Temperature */}
        <div
          className={
            controls.systemMode === "AUTO"
              ? "opacity-40 pointer-events-none"
              : ""
          }
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <label className="block text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wide">
              AC Temperature
            </label>
            <motion.span
              key={controls.acTemperature}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl sm:text-3xl font-bold text-blue-700"
            >
              {controls.acTemperature}°C
            </motion.span>
          </div>
          <input
            type="range"
            min="16"
            max="30"
            value={controls.acTemperature}
            onChange={(e) =>
              setControls({
                ...controls,
                acTemperature: parseInt(e.target.value),
              })
            }
            className="w-full h-2.5 sm:h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-700"
            style={{
              background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${
                ((controls.acTemperature - 16) / 14) * 100
              }%, rgb(226, 232, 240) ${
                ((controls.acTemperature - 16) / 14) * 100
              }%, rgb(226, 232, 240) 100%)`,
            }}
          />
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 font-semibold mt-1.5 sm:mt-2">
            <span>❄️ 16°C</span>
            <span>🔥 30°C</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-3 sm:pt-4 border-t-2 border-gray-200">
          <div className="flex items-center justify-between text-xs sm:text-sm bg-gray-50 p-2.5 sm:p-3 rounded-lg">
            <span className="text-gray-700 font-semibold">Current Status:</span>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"
              />
              <span className="font-bold text-gray-900">
                {controls.systemMode === "AUTO"
                  ? "🤖 Auto Mode"
                  : "👤 Manual Override"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
