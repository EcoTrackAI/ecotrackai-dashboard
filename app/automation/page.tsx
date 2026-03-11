"use client";

import ApplianceControlCard from "@/components/automation/ApplianceControlCard";
import { MetricCard } from "@/components/metrics";
import { subscribePZEMData } from "@/lib/firebase-sensors";
import { initializeFirebase } from "@/lib/firebase";
import {
  fetchLiveSensorData,
  fetchRelayState,
  fetchRecommendation,
  forceRelayState,
} from "@/lib/autocontrol-api";
import { useEffect, useState, useCallback } from "react";
import {
  Zap,
  Flame,
  Gauge,
  Thermometer,
  Droplets,
  Sun,
  Activity,
  Power,
  Brain,
  RefreshCw,
} from "lucide-react";

const ROOMS = ["bedroom", "living_room"] as const;

const formatRoomName = (room: string): string =>
  room
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function AutomationPage() {
  const [pzem, setPzem] = useState<PZEMData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState<Record<string, AutoControlLiveData | null>>({});
  const [relayData, setRelayData] = useState<Record<string, AutoControlRelayData | null>>({});
  const [recommendations, setRecommendations] = useState<Record<string, AutoControlRecommendation | null>>({});
  const [forceLoading, setForceLoading] = useState<Record<string, boolean>>({});
  const [autoRefreshing, setAutoRefreshing] = useState(false);

  useEffect(() => {
    try {
      initializeFirebase();
    } catch {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const unsubscribe = subscribePZEMData((data) => {
      setPzem(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchAllAutoData = useCallback(async () => {
    setAutoRefreshing(true);
    try {
      await Promise.all(
        ROOMS.map(async (room) => {
          try {
            const [live, rec] = await Promise.all([
              fetchLiveSensorData(room),
              fetchRecommendation(room),
            ]);

            setLiveData((prev) => ({ ...prev, [room]: live }));
            setRecommendations((prev) => ({ ...prev, [room]: rec }));

            const motionVal = live.sensor.motion ? 1 : 0;
            const relay = await fetchRelayState(room, motionVal);
            setRelayData((prev) => ({ ...prev, [room]: relay }));
          } catch {
            // Keep stale data on error
          }
        }),
      );
    } finally {
      setAutoRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAutoData();
    const interval = setInterval(fetchAllAutoData, 15000);
    return () => clearInterval(interval);
  }, [fetchAllAutoData]);

  const handleForceRelay = async (room: string, state: "on" | "off") => {
    setForceLoading((prev) => ({ ...prev, [room]: true }));
    try {
      await forceRelayState(room, state);
      // Refresh relay data after force
      const live = liveData[room];
      const motionVal = live?.sensor.motion ? 1 : 0;
      const relay = await fetchRelayState(room, motionVal);
      setRelayData((prev) => ({ ...prev, [room]: relay }));
    } catch {
      // silently handle
    } finally {
      setForceLoading((prev) => ({ ...prev, [room]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">
              Automation Control
            </h1>
            <p className="text-[#6B7280]">
              Monitor power consumption, view AI recommendations, and control
              smart devices.
            </p>
          </div>
          <button
            onClick={fetchAllAutoData}
            disabled={autoRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            <RefreshCw
              className={`w-4 h-4 ${autoRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Power Metrics */}
        {!loading && pzem && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">
              Power Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Current Power"
                value={pzem.power.toFixed(1)}
                unit="W"
                icon={<Zap className="w-6 h-6" />}
              />
              <MetricCard
                title="Total Energy"
                value={pzem.energy.toFixed(2)}
                unit="kWh"
                icon={<Flame className="w-6 h-6" />}
              />
              <MetricCard
                title="Voltage"
                value={pzem.voltage.toFixed(1)}
                unit="V"
                icon={<Gauge className="w-6 h-6" />}
              />
            </div>
          </section>
        )}

        {/* Live Sensor Data & Auto Controls per Room */}
        {ROOMS.map((room) => {
          const live = liveData[room];
          const relay = relayData[room];
          const rec = recommendations[room];
          const isForceLoading = forceLoading[room] || false;

          return (
            <section key={room} className="mb-8">
              <h2 className="text-lg font-semibold text-[#111827] mb-4">
                {formatRoomName(room)}
              </h2>

              {/* Live Sensor Grid */}
              {live && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="w-4 h-4 text-red-500" />
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        Temperature
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-[#111827]">
                      {live.sensor.temp.toFixed(1)}
                      <span className="text-sm font-normal text-gray-500">
                        {" "}
                        °C
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        Humidity
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-[#111827]">
                      {live.sensor.humidity.toFixed(1)}
                      <span className="text-sm font-normal text-gray-500">
                        {" "}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        Light
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-[#111827]">
                      {live.sensor.light.toFixed(1)}
                      <span className="text-sm font-normal text-gray-500">
                        {" "}
                        lux
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-purple-500" />
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        Motion
                      </span>
                    </div>
                    <div
                      className={`text-2xl font-bold ${live.sensor.motion ? "text-green-600" : "text-gray-400"}`}
                    >
                      {live.sensor.motion ? "Detected" : "None"}
                    </div>
                  </div>
                </div>
              )}

              {/* Relay State & Force Control */}
              {relay && (
                <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Power
                        className={`w-5 h-5 ${relay.relay_state ? "text-green-600" : "text-gray-400"}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Auto Relay State
                        </p>
                        <p className="text-xs text-gray-500">
                          {relay.relay_state
                            ? "Relay is ON (auto)"
                            : "Relay is OFF (auto)"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleForceRelay(room, "on")}
                        disabled={isForceLoading}
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50 transition-colors"
                      >
                        Force ON
                      </button>
                      <button
                        onClick={() => handleForceRelay(room, "off")}
                        disabled={isForceLoading}
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
                      >
                        Force OFF
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ML Recommendation */}
              {rec && (
                <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-5 mb-4">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-indigo-900 mb-1">
                        AI Recommendation
                      </p>
                      <p className="text-sm text-indigo-800 whitespace-pre-line">
                        {rec.recommendation}
                      </p>
                      {rec.forecast_data && (
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="bg-white/60 rounded px-3 py-2">
                            <p className="text-xs text-gray-500">
                              Predicted Temp
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {rec.forecast_data.predicted_indoor_temp.toFixed(
                                1,
                              )}
                              °C
                            </p>
                          </div>
                          <div className="bg-white/60 rounded px-3 py-2">
                            <p className="text-xs text-gray-500">
                              Outdoor Temp
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {rec.forecast_data.outdoor_temp.toFixed(1)}°C
                            </p>
                          </div>
                          <div className="bg-white/60 rounded px-3 py-2">
                            <p className="text-xs text-gray-500">
                              Predicted Humidity
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {rec.forecast_data.predicted_humidity.toFixed(1)}%
                            </p>
                          </div>
                          <div className="bg-white/60 rounded px-3 py-2">
                            <p className="text-xs text-gray-500">
                              Outdoor Humidity
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {rec.forecast_data.outdoor_humidity}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!live && !relay && !rec && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                  <p className="text-gray-500 text-sm text-center">
                    {autoRefreshing
                      ? "Loading sensor data..."
                      : "No data available from auto-control backend."}
                  </p>
                </div>
              )}
            </section>
          );
        })}

        {/* Manual Appliance Controls */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            Manual Appliance Controls
          </h2>
          <div className="space-y-4">
            <ApplianceControlCard
              name="Bedroom Light"
              type="light"
              room="bedroom"
            />
            <ApplianceControlCard
              name="Living Room Light"
              type="light"
              room="living_room"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
