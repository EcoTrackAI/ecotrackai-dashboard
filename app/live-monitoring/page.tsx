"use client";

import { useState, useEffect } from "react";
import { LiveSensorCard } from "@/components/sensors";
import { subscribeRoomSensor } from "@/lib/firebase-sensors";
import { subscribeSystemStatus } from "@/lib/firebase-system-status";
import { initializeFirebase } from "@/lib/firebase";

const STALE_THRESHOLD = 30000; // 30 seconds - sensor is stale if not updated within this time

/**
 * Determine if sensor data is stale based on lastUpdate timestamp
 */
const isSensorStale = (lastUpdate: string | undefined): boolean => {
  if (!lastUpdate) return true;

  const lastUpdateTime = new Date(lastUpdate).getTime();
  if (isNaN(lastUpdateTime)) return true;

  return Date.now() - lastUpdateTime >= STALE_THRESHOLD;
};

/**
 * Format timestamp as relative time (e.g., "5m ago")
 */
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Unknown";

  const diffMin = Math.floor((new Date().getTime() - date.getTime()) / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function LiveMonitoringPage() {
  const [bedroomData, setBedroomData] = useState<RoomSensorData | null>(null);
  const [livingRoomData, setLivingRoomData] = useState<RoomSensorData | null>(
    null,
  );
  const [deviceStatus, setDeviceStatus] = useState<SystemStatus>("offline");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeBedroom: (() => void) | undefined;
    let unsubscribeLivingRoom: (() => void) | undefined;
    let unsubscribeStatus: (() => void) | undefined;

    try {
      initializeFirebase();

      // Subscribe to device online/offline status
      unsubscribeStatus = subscribeSystemStatus((status) => {
        setDeviceStatus(status);
        setError(null);
      });

      // Subscribe to real-time bedroom sensor data
      unsubscribeBedroom = subscribeRoomSensor("bedroom", (data) => {
        if (data) {
          setBedroomData(data);
        }
        setLoading(false);
      });

      // Subscribe to real-time living room sensor data
      unsubscribeLivingRoom = subscribeRoomSensor("living_room", (data) => {
        if (data) {
          setLivingRoomData(data);
        }
        setLoading(false);
      });
    } catch (err) {
      console.error("[LiveMonitoring] Initialization error:", err);
      setError("Failed to connect to Firebase. Please refresh the page.");
      setLoading(false);
    }

    return () => {
      unsubscribeBedroom?.();
      unsubscribeLivingRoom?.();
      unsubscribeStatus?.();
    };
  }, []);

  // Determine sensor status: offline if device is offline or sensor data is stale
  const getBedroomStatus = (): SensorStatus => {
    if (deviceStatus === "offline") return "offline";
    if (!bedroomData || isSensorStale(bedroomData.updatedAt)) return "offline";
    return "normal";
  };

  const getLivingRoomStatus = (): SensorStatus => {
    if (deviceStatus === "offline") return "offline";
    if (!livingRoomData || isSensorStale(livingRoomData.updatedAt))
      return "offline";
    return "normal";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Live Monitoring
          </h1>
          <p className="text-gray-600">
            Real-time sensor data from all rooms
            {deviceStatus === "offline" && (
              <span className="block text-yellow-600 font-semibold mt-1">
                ⚠️ Device is currently offline - data may be stale
              </span>
            )}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm font-semibold">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Connecting to sensors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bedroom Sensors */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">Bedroom</h2>
              {bedroomData ? (
                <div className="grid gap-4">
                  <LiveSensorCard
                    sensorName="Temperature"
                    currentValue={bedroomData.temperature?.toFixed(1) ?? "N/A"}
                    unit="°C"
                    status={getBedroomStatus()}
                    description="Room temperature"
                    lastUpdate={bedroomData.updatedAt}
                  />
                  <LiveSensorCard
                    sensorName="Humidity"
                    currentValue={bedroomData.humidity?.toFixed(1) ?? "N/A"}
                    unit="%"
                    status={getBedroomStatus()}
                    description="Room humidity level"
                    lastUpdate={bedroomData.updatedAt}
                  />
                  <LiveSensorCard
                    sensorName="Light"
                    currentValue={bedroomData.light?.toFixed(0) ?? "N/A"}
                    unit="lux"
                    status={getBedroomStatus()}
                    description="Light intensity"
                    lastUpdate={bedroomData.updatedAt}
                  />
                  <LiveSensorCard
                    sensorName="Motion"
                    currentValue={
                      bedroomData.motion !== undefined
                        ? bedroomData.motion
                          ? "Detected"
                          : "No Motion"
                        : "N/A"
                    }
                    unit=""
                    status={getBedroomStatus()}
                    description="Motion sensor"
                    lastUpdate={bedroomData.updatedAt}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Last update: {formatTimestamp(bedroomData.updatedAt)}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-sm">
                    {deviceStatus === "offline"
                      ? "Device is offline - no data available"
                      : "Waiting for sensor data..."}
                  </p>
                </div>
              )}
            </section>

            {/* Living Room Sensors */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">
                Living Room
              </h2>
              {livingRoomData ? (
                <div className="grid gap-4">
                  <LiveSensorCard
                    sensorName="Temperature"
                    currentValue={
                      livingRoomData.temperature?.toFixed(1) ?? "N/A"
                    }
                    unit="°C"
                    status={getLivingRoomStatus()}
                    description="Room temperature"
                    lastUpdate={livingRoomData.updatedAt}
                  />
                  <LiveSensorCard
                    sensorName="Humidity"
                    currentValue={livingRoomData.humidity?.toFixed(1) ?? "N/A"}
                    unit="%"
                    status={getLivingRoomStatus()}
                    description="Room humidity level"
                    lastUpdate={livingRoomData.updatedAt}
                  />
                  <LiveSensorCard
                    sensorName="Light"
                    currentValue={livingRoomData.light?.toFixed(0) ?? "N/A"}
                    unit="lux"
                    status={getLivingRoomStatus()}
                    description="Light intensity"
                    lastUpdate={livingRoomData.updatedAt}
                  />
                  <LiveSensorCard
                    sensorName="Motion"
                    currentValue={
                      livingRoomData.motion !== undefined
                        ? livingRoomData.motion
                          ? "Detected"
                          : "No Motion"
                        : "N/A"
                    }
                    unit=""
                    status={getLivingRoomStatus()}
                    description="Motion sensor"
                    lastUpdate={livingRoomData.updatedAt}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Last update: {formatTimestamp(livingRoomData.updatedAt)}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-sm">
                    {deviceStatus === "offline"
                      ? "Device is offline - no data available"
                      : "Waiting for sensor data..."}
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
