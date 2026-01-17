"use client";

import { useState, useEffect } from "react";
import { LiveSensorCard } from "@/components/sensors";
import { subscribeRoomSensor } from "@/lib/firebase-sensors";
import { initializeFirebase } from "@/lib/firebase";

const STALE_THRESHOLD = 30000; // 30 seconds

const isSensorStale = (lastUpdate: string | undefined): boolean => {
  if (!lastUpdate) return true;
  return Date.now() - new Date(lastUpdate).getTime() >= STALE_THRESHOLD;
};

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      initializeFirebase();
    } catch (err) {
      console.error("Failed to initialize Firebase:", err);
      setTimeout(() => {
        setError("Failed to connect to Firebase");
        setLoading(false);
      }, 0);
      return;
    }

    const unsubscribeBedroom = subscribeRoomSensor("bedroom", (data) => {
      setBedroomData(data);
      setLoading(false);
      setError(null);
    });

    const unsubscribeLivingRoom = subscribeRoomSensor("living_room", (data) => {
      setLivingRoomData(data);
      setLoading(false);
      setError(null);
    });

    return () => {
      unsubscribeBedroom();
      unsubscribeLivingRoom();
    };
  }, []);

  const bedroomStatus =
    bedroomData && isSensorStale(bedroomData.updatedAt) ? "offline" : "normal";
  const livingRoomStatus =
    livingRoomData && isSensorStale(livingRoomData.updatedAt)
      ? "offline"
      : "normal";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Live Monitoring
          </h1>
          <p className="text-gray-600">Real-time sensor data from all rooms</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Connecting to sensors...</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bedroom Sensors */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">Bedroom</h2>
              {bedroomData ? (
                <div className="grid gap-4">
                  <LiveSensorCard
                    sensorName="Temperature"
                    currentValue={bedroomData.temperature.toFixed(1)}
                    unit="°C"
                    status={bedroomStatus as SensorStatus}
                    description="Room temperature"
                    lastUpdate={bedroomData.updatedAt}
                  />
                  <LiveSensorCard
                    sensorName="Humidity"
                    currentValue={bedroomData.humidity.toFixed(1)}
                    unit="%"
                    status={bedroomStatus as SensorStatus}
                    description="Room humidity level"
                    lastUpdate={bedroomData.updatedAt}
                  />
                  <LiveSensorCard
                    sensorName="Light"
                    currentValue={bedroomData.light.toFixed(0)}
                    unit="lux"
                    status={bedroomStatus as SensorStatus}
                    description="Light intensity"
                    lastUpdate={bedroomData.updatedAt}
                  />
                  <LiveSensorCard
                    sensorName="Motion"
                    currentValue={bedroomData.motion ? "Detected" : "No Motion"}
                    unit=""
                    status={bedroomStatus as SensorStatus}
                    description="Motion sensor"
                    lastUpdate={bedroomData.updatedAt}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Last update: {formatTimestamp(bedroomData.updatedAt)}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">No data available</p>
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
                    currentValue={livingRoomData.temperature.toFixed(1)}
                    unit="°C"
                    status={livingRoomStatus as SensorStatus}
                    description="Room temperature"
                    lastUpdate={livingRoomData.updatedAt}
                  />
                  <LiveSensorCard
                    sensorName="Humidity"
                    currentValue={livingRoomData.humidity.toFixed(1)}
                    unit="%"
                    status={livingRoomStatus as SensorStatus}
                    description="Room humidity level"
                    lastUpdate={livingRoomData.updatedAt}
                  />
                  <LiveSensorCard
                    sensorName="Light"
                    currentValue={livingRoomData.light.toFixed(0)}
                    unit="lux"
                    status={livingRoomStatus as SensorStatus}
                    description="Light intensity"
                    lastUpdate={livingRoomData.updatedAt}
                  />
                  <LiveSensorCard
                    sensorName="Motion"
                    currentValue={
                      livingRoomData.motion ? "Detected" : "No Motion"
                    }
                    unit=""
                    status={livingRoomStatus as SensorStatus}
                    description="Motion sensor"
                    lastUpdate={livingRoomData.updatedAt}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Last update: {formatTimestamp(livingRoomData.updatedAt)}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">No data available</p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
