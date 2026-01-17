"use client";

import React, { useState, useEffect } from "react";
import { useRelayControl } from "@/lib/hooks/useRelayControl";

export default function FanControlCard({ appliance, onStatusChange, onFanSpeedChange, onModeChange }: FanControlCardProps) {
  const { state: firebaseRelayState, setRelayState } = useRelayControl(appliance.roomId || "unknown", "fan");
  const [isControlling, setIsControlling] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(appliance.settings?.fan?.speed || 3);

  useEffect(() => {
    if (firebaseRelayState !== null) onStatusChange(appliance.id, firebaseRelayState ? "on" : "off");
  }, [firebaseRelayState, appliance.id, onStatusChange]);

  const handleToggle = async () => {
    if (isControlling) return;
    try {
      setIsControlling(true);
      await setRelayState(appliance.status !== "on");
    } catch (error) {
      console.error("Failed to toggle fan:", error);
    } finally {
      setIsControlling(false);
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(e.target.value);
    setFanSpeed(speed);
    onFanSpeedChange(appliance.id, speed);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`text-3xl ${appliance.status === "on" ? "text-blue-500" : "text-gray-500"}`}>🌀</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{appliance.name}</h3>
            <p className="text-sm text-gray-500">{appliance.room}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${appliance.isOnline ? "bg-green-500" : "bg-gray-400"}`} />
          <span className="text-xs text-gray-500">{appliance.isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-700">Control Mode</span>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <button onClick={() => onModeChange(appliance.id, "auto")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${appliance.controlMode === "auto" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>Auto</button>
          <button onClick={() => onModeChange(appliance.id, "manual")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${appliance.controlMode === "manual" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>Manual</button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700">Power</span>
        <button onClick={handleToggle} disabled={isControlling || appliance.controlMode === "auto" || !appliance.isOnline} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${appliance.status === "on" ? "bg-blue-500" : "bg-gray-300"}`} title={!appliance.isOnline ? "Device is offline" : appliance.controlMode === "auto" ? "Controlled by ML model in Auto mode" : ""}>
          <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${appliance.status === "on" ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>

      {appliance.status === "on" && (
        <div className="border-t border-gray-100 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Speed: {fanSpeed}</label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Low</span>
            <input type="range" min="1" max="5" value={fanSpeed} onChange={handleSpeedChange} disabled={appliance.controlMode === "auto" || !appliance.isOnline} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" />
            <span className="text-xs text-gray-500">High</span>
          </div>
        </div>
      )}
    </div>
  );
}
