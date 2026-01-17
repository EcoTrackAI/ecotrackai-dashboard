/**
 * AC Control Card Component
 * Controls for air conditioner with ON/OFF and temperature adjustment
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRelayControl } from "@/lib/hooks/useRelayControl";

export default function ACControlCard({
  appliance,
  onStatusChange,
  onACTemperatureChange,
  onModeChange,
}: ACControlCardProps) {
  const roomId = appliance.roomId || "unknown";
  // Use just the type name for relay, not appliance.id
  const relayId = "ac";
  const { state: firebaseRelayState, setRelayState } = useRelayControl(
    roomId,
    relayId,
  );
  const [isControlling, setIsControlling] = useState(false);
  const [temperature, setTemperature] = useState(
    appliance.settings?.ac?.temperature || 24,
  );

  // Sync Firebase state with UI
  useEffect(() => {
    if (firebaseRelayState !== null) {
      onStatusChange(appliance.id, firebaseRelayState ? "on" : "off");
    }
  }, [firebaseRelayState, appliance.id, onStatusChange]);

  const handleToggle = async () => {
    if (isControlling) return;

    try {
      setIsControlling(true);
      await setRelayState(appliance.status !== "on");
    } catch (error) {
      console.error("Failed to toggle AC:", error);
    } finally {
      setIsControlling(false);
    }
  };

  const handleTempChange = (increment: boolean) => {
    const newTemp = increment
      ? Math.min(temperature + 1, 30)
      : Math.max(temperature - 1, 16);
    setTemperature(newTemp);
    onACTemperatureChange(appliance.id, newTemp);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`text-3xl ${appliance.status === "on" ? "text-cyan-500" : "text-gray-500"}`}
          >
            ❄️
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
              appliance.isOnline ? "bg-green-500" : "bg-gray-400"
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
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              appliance.controlMode === "auto"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-pressed={appliance.controlMode === "auto"}
          >
            Auto
          </button>
          <button
            onClick={() => onModeChange(appliance.id, "manual")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              appliance.controlMode === "manual"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
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
          onClick={handleToggle}
          disabled={
            isControlling ||
            appliance.controlMode === "auto" ||
            !appliance.isOnline
          }
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            appliance.status === "on" ? "bg-cyan-500" : "bg-gray-300"
          }`}
          aria-label={`Toggle ${appliance.name}`}
          title={
            !appliance.isOnline
              ? "Device is offline"
              : appliance.controlMode === "auto"
                ? "Controlled by ML model in Auto mode"
                : ""
          }
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              appliance.status === "on" ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Temperature Control */}
      {appliance.status === "on" && (
        <div className="border-t border-gray-100 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Temperature
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleTempChange(false)}
              disabled={
                temperature <= 16 ||
                appliance.controlMode === "auto" ||
                !appliance.isOnline
              }
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease temperature"
            >
              −
            </button>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600">
                {temperature}°
              </div>
              <div className="text-xs text-gray-500 mt-1">Celsius</div>
            </div>
            <button
              onClick={() => handleTempChange(true)}
              disabled={
                temperature >= 30 ||
                appliance.controlMode === "auto" ||
                !appliance.isOnline
              }
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}
