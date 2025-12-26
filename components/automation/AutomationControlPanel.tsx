/**
 * AutomationControlPanel Component
 * Main control panel for managing smart home appliances
 * Features: Emergency OFF, appliance list, auto/manual controls
 */

"use client";

import React, { useState } from "react";
import ApplianceControlCard from "./ApplianceControlCard";

// AutomationControlPanelProps and all types are globally available from types/globals.d.ts

export default function AutomationControlPanel({
  initialAppliances = [],
}: AutomationControlPanelProps) {
  const [appliances, setAppliances] = useState<Appliance[]>(
    initialAppliances.length > 0 ? initialAppliances : getDefaultAppliances()
  );
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

  function getDefaultAppliances(): Appliance[] {
    return [
      {
        id: "1",
        name: "Living Room AC",
        type: "air_conditioner",
        room: "Living Room",
        status: "on",
        controlMode: "auto",
        powerConsumption: 1200,
        isOnline: true,
        settings: {
          ac: {
            temperature: 24,
            mode: "cool",
          },
        },
      },
      {
        id: "2",
        name: "Ceiling Fan",
        type: "fan",
        room: "Bedroom",
        status: "on",
        controlMode: "manual",
        powerConsumption: 75,
        isOnline: true,
        settings: {
          fan: {
            speed: 3,
          },
        },
      },
      {
        id: "3",
        name: "Kitchen AC",
        type: "air_conditioner",
        room: "Kitchen",
        status: "off",
        controlMode: "manual",
        powerConsumption: 1100,
        isOnline: true,
        settings: {
          ac: {
            temperature: 22,
            mode: "cool",
          },
        },
      },
      {
        id: "4",
        name: "Study Room Light",
        type: "light",
        room: "Study Room",
        status: "on",
        controlMode: "auto",
        powerConsumption: 12,
        isOnline: true,
      },
      {
        id: "5",
        name: "Basement Dehumidifier",
        type: "dehumidifier",
        room: "Basement",
        status: "off",
        controlMode: "auto",
        powerConsumption: 300,
        isOnline: false,
      },
    ];
  }

  const handleStatusChange = (id: string, status: ApplianceStatus) => {
    if (emergencyMode) return;

    setAppliances((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  const handleModeChange = (id: string, mode: ControlMode) => {
    if (emergencyMode) return;

    setAppliances((prev) =>
      prev.map((app) => (app.id === id ? { ...app, controlMode: mode } : app))
    );
  };

  const handleFanSpeedChange = (id: string, speed: number) => {
    if (emergencyMode) return;

    setAppliances((prev) =>
      prev.map((app) =>
        app.id === id && app.settings?.fan
          ? {
              ...app,
              settings: {
                ...app.settings,
                fan: { speed },
              },
            }
          : app
      )
    );
  };

  const handleACTemperatureChange = (id: string, temperature: number) => {
    if (emergencyMode) return;

    setAppliances((prev) =>
      prev.map((app) =>
        app.id === id && app.settings?.ac
          ? {
              ...app,
              settings: {
                ...app.settings,
                ac: { ...app.settings.ac, temperature },
              },
            }
          : app
      )
    );
  };

  const handleEmergencyOff = () => {
    // Turn off all appliances
    setAppliances((prev) =>
      prev.map((app) => ({ ...app, status: "off" as ApplianceStatus }))
    );
    setEmergencyMode(true);
    setShowEmergencyConfirm(false);

    // Auto-reset emergency mode after 30 seconds
    setTimeout(() => {
      setEmergencyMode(false);
    }, 30000);
  };

  const handleResetEmergency = () => {
    setEmergencyMode(false);
  };

  const totalPowerConsumption = appliances
    .filter((app) => app.status === "on" && app.isOnline)
    .reduce((sum, app) => sum + app.powerConsumption, 0);

  const activeDevices = appliances.filter(
    (app) => app.status === "on" && app.isOnline
  ).length;

  const onlineDevices = appliances.filter((app) => app.isOnline).length;

  return (
    <div className="space-y-6">
      {/* Emergency Mode Banner */}
      {emergencyMode && (
        <div
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚨</span>
              <div>
                <h3 className="text-sm font-semibold text-red-800">
                  Emergency Mode Active
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  All devices have been powered off. Controls are locked.
                </p>
              </div>
            </div>
            <button
              onClick={handleResetEmergency}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Reset Emergency Mode
            </button>
          </div>
        </div>
      )}

      {/* Control Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {activeDevices}/{onlineDevices}
              </div>
              <div className="text-sm text-gray-500">Active Devices</div>
            </div>
            <div className="h-12 w-px bg-gray-200" aria-hidden="true" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(totalPowerConsumption / 1000).toFixed(2)} kW
              </div>
              <div className="text-sm text-gray-500">Total Power Draw</div>
            </div>
            <div className="h-12 w-px bg-gray-200" aria-hidden="true" />
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {appliances.filter((app) => app.controlMode === "auto").length}
              </div>
              <div className="text-sm text-gray-500">Auto Mode</div>
            </div>
          </div>

          {/* Emergency OFF Button */}
          <div>
            {!showEmergencyConfirm ? (
              <button
                onClick={() => setShowEmergencyConfirm(true)}
                disabled={emergencyMode}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Emergency power off"
              >
                🚨 Emergency OFF
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEmergencyOff}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowEmergencyConfirm(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Auto Mode:</span> Devices are
            controlled by automation rules based on schedules, sensors, and
            energy optimization.{" "}
            <span className="font-medium">Manual Mode:</span> You have direct
            control over the device.
          </p>
        </div>
      </div>

      {/* Appliances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {appliances.map((appliance) => (
          <ApplianceControlCard
            key={appliance.id}
            appliance={appliance}
            onStatusChange={handleStatusChange}
            onModeChange={handleModeChange}
            onFanSpeedChange={handleFanSpeedChange}
            onACTemperatureChange={handleACTemperatureChange}
          />
        ))}
      </div>

      {/* Safety Notice */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="flex gap-3">
          <span className="text-xl shrink-0">💡</span>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Safety Features
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Emergency OFF button powers down all devices instantly</li>
              <li>
                • Controls locked during emergency mode to prevent accidents
              </li>
              <li>• Offline devices cannot be controlled remotely</li>
              <li>
                • Auto mode devices follow safety rules and energy optimization
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
