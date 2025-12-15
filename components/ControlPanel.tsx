"use client";

import { useState } from "react";

export default function ControlPanel() {
  const [controls, setControls] = useState<ControlSettings>({
    fanMode: "AUTO",
    acTemperature: 24,
    systemMode: "AUTO",
  });

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <svg
          className="w-6 h-6 text-gray-700"
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
        <h3 className="text-lg font-bold text-gray-900">
          Manual Control Panel
        </h3>
      </div>

      <div className="space-y-6">
        {/* System Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            System Mode
          </label>
          <div className="flex space-x-3">
            {(["AUTO", "MANUAL"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setControls({ ...controls, systemMode: mode })}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  controls.systemMode === mode
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          {controls.systemMode === "AUTO" && (
            <p className="mt-2 text-xs text-gray-500">
              AI will control devices based on sensor data
            </p>
          )}
        </div>

        {/* Fan Control */}
        <div
          className={
            controls.systemMode === "AUTO"
              ? "opacity-50 pointer-events-none"
              : ""
          }
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Fan Control
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["ON", "OFF", "AUTO"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setControls({ ...controls, fanMode: mode })}
                className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  controls.fanMode === mode
                    ? "bg-green-600 text-white shadow-md"
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
              ? "opacity-50 pointer-events-none"
              : ""
          }
        >
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              AC Temperature
            </label>
            <span className="text-2xl font-bold text-blue-600">
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>16°C</span>
            <span>30°C</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Current Status:</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-medium text-gray-900">
                {controls.systemMode === "AUTO"
                  ? "Auto Mode Active"
                  : "Manual Override Active"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
