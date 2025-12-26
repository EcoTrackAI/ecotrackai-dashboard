"use client";

import { useState, useEffect } from "react";
import { LiveSensorCard } from "@/components/sensors";
import { subscribeSensorData } from "@/lib/firebase-sensors";
import { initializeFirebase } from "@/lib/firebase";

const STALE_THRESHOLD = 30000; // 30 seconds

const isSensorStale = (lastUpdate: string | undefined): boolean => {
  if (!lastUpdate) return true;
  return Date.now() - new Date(lastUpdate).getTime() >= STALE_THRESHOLD;
};

export default function LiveMonitoringPage() {
  const [sensors, setSensors] = useState<FirebaseSensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    try {
      initializeFirebase();
    } catch (err) {
      console.error("Failed to initialize Firebase:", err);
      setError("Failed to connect to Firebase");
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeSensorData((firebaseSensors) => {
      setSensors(
        firebaseSensors.map((sensor) => ({
          ...sensor,
          status: (isSensorStale(sensor.lastUpdate)
            ? "offline"
            : sensor.status) as SensorStatus,
        }))
      );
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (sensors.length === 0) return;

    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) =>
          isSensorStale(sensor.lastUpdate) && sensor.status !== "offline"
            ? { ...sensor, status: "offline" as SensorStatus }
            : sensor
        )
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [sensors.length]);

  const filteredSensors =
    selectedCategory === "all"
      ? sensors
      : sensors.filter((s) => s.category === selectedCategory);

  const categoryCounts = {
    all: sensors.length,
    temperature: sensors.filter((s) => s.category === "temperature").length,
    humidity: sensors.filter((s) => s.category === "humidity").length,
    occupancy: sensors.filter((s) => s.category === "occupancy").length,
    lighting: sensors.filter((s) => s.category === "lighting").length,
    power: sensors.filter((s) => s.category === "power").length,
    system: sensors.filter((s) => s.category === "system").length,
  };

  const activeSensors = sensors.filter((s) => s.status !== "offline").length;
  const hasRecentData = sensors.some(
    (s) => s.lastUpdate && !isSensorStale(s.lastUpdate)
  );
  const connectionStatus = loading
    ? "connecting"
    : error
    ? "error"
    : hasRecentData
    ? "connected"
    : "stale";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#111827] mb-2">
                Live Monitoring
              </h1>
              <p className="text-gray-600">
                Real-time sensor data from Firebase Realtime Database
              </p>
            </div>

            {/* Connection Status Indicator */}
            <div className="flex items-center gap-2">
              {loading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                  <span className="text-sm">Connecting...</span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="text-sm">{error}</span>
                </div>
              ) : connectionStatus === "connected" && sensors.length > 0 ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-sm">Live from Firebase</span>
                </div>
              ) : connectionStatus === "stale" && sensors.length > 0 ? (
                <div className="flex items-center gap-2 text-orange-600">
                  <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                  <span className="text-sm">Stale data (not updating)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  <span className="text-sm">No data available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-sm font-medium text-gray-600">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeSensors}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-gray-600">Warning</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {sensors.filter((s) => s.status === "warning").length}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span className="text-sm font-medium text-gray-600">
                Critical
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {sensors.filter((s) => s.status === "critical").length}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-sm font-medium text-gray-600">Offline</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {sensors.length - activeSensors}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Filter by:
            </span>
            <div className="flex gap-2">
              {(
                Object.keys(categoryCounts) as Array<
                  keyof typeof categoryCounts
                >
              ).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                      px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                      transition-colors
                      ${
                        selectedCategory === category
                          ? "bg-[#6366F1] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                    `}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} (
                  {categoryCounts[category]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sensor Grid */}
        <section aria-labelledby="sensors-heading">
          <h2
            id="sensors-heading"
            className="text-xl font-semibold text-[#111827] mb-6"
          >
            {selectedCategory === "all"
              ? "All Sensors"
              : `${
                  selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)
                } Sensors`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSensors.map((sensor) => (
              <LiveSensorCard key={sensor.id} {...sensor} />
            ))}
          </div>

          {filteredSensors.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 font-medium mb-1">
                    No sensors available
                  </p>
                  <p className="text-gray-500 text-sm">
                    Add sensors to Firebase to see live data here
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
