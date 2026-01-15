/**
 * Light Control Card Component
 * Controls for light appliances with ON/OFF toggle
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRelayControl } from "@/lib/hooks/useRelayControl";

interface LightControlCardProps {
  appliance: Appliance;
  onStatusChange: (id: string, status: ApplianceStatus) => void;
  onModeChange: (id: string, mode: ControlMode) => void;
}

export default function LightControlCard({
  appliance,
  onStatusChange,
  onModeChange,
}: LightControlCardProps) {
  const roomId = appliance.roomId || "unknown";
  const relayId = `relay${appliance.id}`;
  const { state: firebaseRelayState, setRelayState } = useRelayControl(roomId, relayId);
  const [isControlling, setIsControlling] = useState(false);

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
      console.error("Failed to toggle light:", error);
    } finally {
      setIsControlling(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`text-3xl ${appliance.status === "on" ? "text-yellow-500" : "text-gray-500"}`}>
            💡
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{appliance.name}</h3>
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
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Power</span>
        <button
          onClick={handleToggle}
          disabled={isControlling || appliance.controlMode === "auto" || !appliance.isOnline}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            appliance.status === "on" ? "bg-yellow-500" : "bg-gray-300"
          }`}
          aria-label={`Toggle ${appliance.name}`}
          title={!appliance.isOnline ? "Device is offline" : appliance.controlMode === "auto" ? "Controlled by ML model in Auto mode" : ""}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              appliance.status === "on" ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
