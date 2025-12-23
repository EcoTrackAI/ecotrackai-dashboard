"use client";

import { useState } from "react";

export default function ControlPanel() {
  const [controls, setControls] = useState<ControlSettings>({
    fanMode: "AUTO",
    acTemperature: 24,
    systemMode: "AUTO",
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 xs:p-4 sm:p-5 md:p-6">
      <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3 mb-3 xs:mb-4 sm:mb-6">
        <div className="p-1.5 xs:p-2 bg-gray-100 rounded-md">
          <svg
            className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-gray-700"
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
        <div className="min-w-0 flex-1">
          <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 truncate">
            Manual Controls
          </h3>
          <p className="text-[10px] xs:text-xs text-gray-500 truncate">
            Override automatic settings
          </p>
        </div>
      </div>

      <div className="space-y-3 xs:space-y-4 sm:space-y-6">
        {/* System Mode */}
        <div>
          <label className="flex items-center gap-1.5 xs:gap-2 text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 xs:mb-2 sm:mb-3 uppercase tracking-wide">
            System Mode
            <span className="text-[9px] xs:text-xs normal-case text-gray-500 font-normal hidden xs:inline">
              (Auto/Manual)
            </span>
          </label>
          <div className="flex space-x-1.5 xs:space-x-2 sm:space-x-3">
            {(["AUTO", "MANUAL"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setControls({ ...controls, systemMode: mode })}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-md font-medium text-xs sm:text-sm transition-colors border ${
                  controls.systemMode === mode
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          {controls.systemMode === "AUTO" && (
            <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-700 font-medium bg-gray-50 p-2 rounded-md">
              🤖 AI controlling devices based on sensor data
            </p>
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
          <label className="block text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 xs:mb-2 sm:mb-3 uppercase tracking-wide">
            Fan Control
          </label>
          <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3">
            {(["ON", "OFF", "AUTO"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setControls({ ...controls, fanMode: mode })}
                className={`py-1.5 xs:py-2 sm:py-3 px-1.5 xs:px-2 sm:px-4 rounded-md font-medium text-[10px] xs:text-xs sm:text-sm transition-colors border ${
                  controls.fanMode === mode
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
              >
                {mode}
              </button>
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
          <div className="flex items-center justify-between mb-1.5 xs:mb-2 sm:mb-3">
            <label className="block text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
              AC Temperature
            </label>
            <span className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-900">
              {controls.acTemperature}°C
            </span>
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
            className="w-full h-2.5 sm:h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-800"
            style={{
              background: `linear-gradient(to right, rgb(31, 41, 55) 0%, rgb(31, 41, 55) ${
                ((controls.acTemperature - 16) / 14) * 100
              }%, rgb(226, 232, 240) ${
                ((controls.acTemperature - 16) / 14) * 100
              }%, rgb(226, 232, 240) 100%)`,
            }}
          />
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 font-medium mt-1.5 sm:mt-2">
            <span>❄️ 16°C</span>
            <span>🔥 30°C</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-2 xs:pt-3 sm:pt-4 border-t-2 border-gray-200">
          <div className="flex items-center justify-between text-[10px] xs:text-xs sm:text-sm bg-gray-50 p-2 xs:p-2.5 sm:p-3 rounded-lg">
            <span className="text-gray-700 font-semibold truncate">
              Current Status:
            </span>
            <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2 shrink-0">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse" />
              <span className="font-bold text-gray-900 text-[9px] xs:text-[10px] sm:text-xs truncate">
                {controls.systemMode === "AUTO"
                  ? "🤖 Auto Mode"
                  : "👤 Manual Override"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
