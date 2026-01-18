"use client";

import { useState, useEffect } from "react";
import { useRelayControl } from "@/lib/hooks/useRelayControl";

export const LightControlCard: React.FC<LightControlCardProps> = ({
  appliance,
  onStatusChange,
  onModeChange,
}) => {
  const { state: firebaseRelayState, setRelayState } = useRelayControl(
    appliance.roomId || "unknown",
    "light",
  );
  const [isControlling, setIsControlling] = useState(false);

  useEffect(() => {
    if (firebaseRelayState !== null)
      onStatusChange(appliance.id, firebaseRelayState ? "on" : "off");
  }, [firebaseRelayState, appliance.id, onStatusChange]);

  const handleToggle = async () => {
    if (isControlling) return;
    try {
      setIsControlling(true);
      await setRelayState(appliance.status !== "on");
    } catch (_error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // Silently handle error
    } finally {
      setIsControlling(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`text-3xl ${appliance.status === "on" ? "text-yellow-500" : "text-gray-500"}`}
          >
            💡
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {appliance.name}
            </h3>
            <p className="text-sm text-gray-500">{appliance.room}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${appliance.isOnline ? "bg-green-500" : "bg-gray-400"}`}
          />
          <span className="text-xs text-gray-500">
            {appliance.isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-700">Control Mode</span>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <button
            onClick={() => onModeChange(appliance.id, "auto")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${appliance.controlMode === "auto" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            Auto
          </button>
          <button
            onClick={() => onModeChange(appliance.id, "manual")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${appliance.controlMode === "manual" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            Manual
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Power</span>
        <button
          onClick={handleToggle}
          disabled={
            isControlling ||
            appliance.controlMode === "auto" ||
            !appliance.isOnline
          }
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${appliance.status === "on" ? "bg-yellow-500" : "bg-gray-300"}`}
          title={
            !appliance.isOnline
              ? "Device is offline"
              : appliance.controlMode === "auto"
                ? "Controlled by ML model in Auto mode"
                : ""
          }
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${appliance.status === "on" ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>
    </div>
  );
};

export default LightControlCard;
