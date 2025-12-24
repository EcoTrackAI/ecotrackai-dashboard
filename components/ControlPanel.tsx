"use client";

import { useState } from "react";

export default function ControlPanel() {
  const [controls, setControls] = useState<ControlSettings>({
    fanMode: "AUTO",
    acTemperature: 24,
    systemMode: "AUTO",
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 transition-all duration-200 hover:shadow-md animate-fadeIn">
      <div className="flex items-center space-x-2 mb-5">
        <div className="text-gray-600">
          <svg
            className="w-6 h-6"
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
          <h3 className="text-base font-semibold text-gray-900 truncate">
            Manual Controls
          </h3>
          <p className="text-xs text-gray-500 truncate">
            Override automatic settings
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* System Mode */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            System Mode
          </label>
          <div className="flex space-x-2">
            {(["AUTO", "MANUAL"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setControls({ ...controls, systemMode: mode })}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  controls.systemMode === mode
                    ? "bg-slate-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          {controls.systemMode === "AUTO" && (
            <p className="mt-2 text-xs text-gray-600 bg-blue-50 p-2.5 rounded-lg border border-blue-100">
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
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Fan Control
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["ON", "OFF", "AUTO"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setControls({ ...controls, fanMode: mode })}
                className={`py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  controls.fanMode === mode
                    ? "bg-slate-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              AC Temperature
            </label>
            <span className="text-2xl font-semibold text-gray-900">
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
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(15, 23, 42) 0%, rgb(15, 23, 42) ${
                ((controls.acTemperature - 16) / 14) * 100
              }%, rgb(229, 231, 235) ${
                ((controls.acTemperature - 16) / 14) * 100
              }%, rgb(229, 231, 235) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>❄️ 16°C</span>
            <span>🔥 30°C</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-600 font-medium truncate">
              Current Status:
            </span>
            <div className="flex items-center space-x-1.5 shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle" />
              <span className="font-semibold text-gray-900 text-xs truncate">
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
