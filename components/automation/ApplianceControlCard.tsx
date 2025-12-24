/**
 * ApplianceControlCard Component
 * Individual control card for each smart home appliance
 * Features: Auto/Manual toggle, ON/OFF switch, device-specific controls
 */

"use client";

import React, { useState } from "react";
import type {
  Appliance,
  ControlMode,
  ApplianceStatus,
} from "@/types/automation";

interface ApplianceControlCardProps {
  appliance: Appliance;
  onStatusChange: (id: string, status: ApplianceStatus) => void;
  onModeChange: (id: string, mode: ControlMode) => void;
  onFanSpeedChange: (id: string, speed: number) => void;
  onACTemperatureChange: (id: string, temperature: number) => void;
}

export default function ApplianceControlCard({
  appliance,
  onStatusChange,
  onModeChange,
  onFanSpeedChange,
  onACTemperatureChange,
}: ApplianceControlCardProps) {
  const [localFanSpeed, setLocalFanSpeed] = useState(
    appliance.settings?.fan?.speed || 3
  );
  const [localACTemp, setLocalACTemp] = useState(
    appliance.settings?.ac?.temperature || 24
  );

  const getApplianceIcon = () => {
    switch (appliance.type) {
      case "air_conditioner":
        return "❄️";
      case "fan":
        return "🌀";
      case "light":
        return "💡";
      case "heater":
        return "🔥";
      case "dehumidifier":
        return "💧";
      default:
        return "🔌";
    }
  };

  const getStatusColor = () => {
    if (!appliance.isOnline) return "text-gray-400";
    return appliance.status === "on" ? "text-green-600" : "text-gray-500";
  };

  const handleFanSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(e.target.value);
    setLocalFanSpeed(speed);
    onFanSpeedChange(appliance.id, speed);
  };

  const handleACTempChange = (increment: boolean) => {
    const newTemp = increment
      ? Math.min(localACTemp + 1, 30)
      : Math.max(localACTemp - 1, 16);
    setLocalACTemp(newTemp);
    onACTemperatureChange(appliance.id, newTemp);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`text-3xl ${getStatusColor()}`}>
            {getApplianceIcon()}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {appliance.name}
            </h3>
            <p className="text-sm text-gray-500">{appliance.room}</p>
          </div>
        </div>

        {/* Online Status Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              appliance.isOnline ? "bg-green-500" : "bg-gray-300"
            }`}
            aria-label={appliance.isOnline ? "Online" : "Offline"}
          />
          <span className="text-xs text-gray-500">
            {appliance.isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Control Mode Toggle */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-700">Control Mode</span>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <button
            onClick={() => onModeChange(appliance.id, "auto")}
            disabled={!appliance.isOnline}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              appliance.controlMode === "auto"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-pressed={appliance.controlMode === "auto"}
          >
            Auto
          </button>
          <button
            onClick={() => onModeChange(appliance.id, "manual")}
            disabled={!appliance.isOnline}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              appliance.controlMode === "manual"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-pressed={appliance.controlMode === "manual"}
          >
            Manual
          </button>
        </div>
      </div>

      {/* Power Switch */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700">Power</span>
        <button
          onClick={() =>
            onStatusChange(
              appliance.id,
              appliance.status === "on" ? "off" : "on"
            )
          }
          disabled={!appliance.isOnline || appliance.controlMode === "auto"}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            appliance.status === "on" ? "bg-green-600" : "bg-gray-300"
          }`}
          role="switch"
          aria-checked={appliance.status === "on"}
          aria-label={`Turn ${appliance.status === "on" ? "off" : "on"} ${
            appliance.name
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
              appliance.status === "on" ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Device-Specific Controls */}
      {appliance.type === "fan" && appliance.status === "on" && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Fan Speed: {localFanSpeed}
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Low</span>
            <input
              type="range"
              min="1"
              max="5"
              value={localFanSpeed}
              onChange={handleFanSpeedChange}
              disabled={!appliance.isOnline || appliance.controlMode === "auto"}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Fan speed"
            />
            <span className="text-xs text-gray-500">High</span>
          </div>
          <div className="flex justify-between mt-2 px-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <span
                key={level}
                className={`text-xs ${
                  localFanSpeed >= level ? "text-indigo-600" : "text-gray-300"
                }`}
              >
                •
              </span>
            ))}
          </div>
        </div>
      )}

      {appliance.type === "air_conditioner" && appliance.status === "on" && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Temperature
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleACTempChange(false)}
              disabled={
                !appliance.isOnline ||
                appliance.controlMode === "auto" ||
                localACTemp <= 16
              }
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Decrease temperature"
            >
              −
            </button>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {localACTemp}°
              </div>
              <div className="text-xs text-gray-500 mt-1">Celsius</div>
            </div>
            <button
              onClick={() => handleACTempChange(true)}
              disabled={
                !appliance.isOnline ||
                appliance.controlMode === "auto" ||
                localACTemp >= 30
              }
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Increase temperature"
            >
              +
            </button>
          </div>
          <div className="flex justify-between mt-3 text-xs text-gray-500">
            <span>16°C</span>
            <span>30°C</span>
          </div>
        </div>
      )}

      {/* Power Consumption */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">Current Draw</span>
        <span className="text-sm font-semibold text-gray-900">
          {appliance.status === "on" && appliance.isOnline
            ? `${appliance.powerConsumption}W`
            : "0W"}
        </span>
      </div>
    </div>
  );
}
