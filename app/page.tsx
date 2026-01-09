"use client";

import { useEffect, useState, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import SensorStatusCard from "@/components/SensorStatusCard";
import EnvironmentSummary from "@/components/EnvironmentSummary";
import AIRecommendation from "@/components/AIRecommendation";
import Charts from "@/components/Charts";
import ControlPanel from "@/components/ControlPanel";
import Footer from "@/components/Footer";

export default function Home() {
  const [data, setData] = useState<SensorData | null>(null);
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [historicalTemp, setHistoricalTemp] = useState<HistoricalDataPoint[]>(
    []
  );
  const [historicalHumidity, setHistoricalHumidity] = useState<
    HistoricalDataPoint[]
  >([]);
  const [historicalLight, setHistoricalLight] = useState<HistoricalDataPoint[]>(
    []
  );
  const lastDataHash = useRef<string>("");
  const connectionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastUpdateTimeRef = useRef<number>(0);

  useEffect(() => {
    const liveRef = ref(db, "sensors");

    const unsubscribe = onValue(
      liveRef,
      (snapshot) => {
        const val = snapshot.val();
        const rawSensors = val?.sensors ?? val;

        if (rawSensors) {
          const sensorList: SensorReading[] = Object.entries(rawSensors).map(
            ([id, sensor]) => ({ id, ...(sensor as Omit<SensorReading, "id">) })
          );

          const findByCategory = (category: string) =>
            sensorList.find((item) => item.category === category);

          const tempSensor = findByCategory("temperature");
          const humiditySensor = findByCategory("humidity");
          const lightSensor = findByCategory("lighting");
          const occupancySensor = findByCategory("occupancy");

          const newData: SensorData = {
            temperature: Number(tempSensor?.currentValue ?? 0),
            humidity: Number(humiditySensor?.currentValue ?? 0),
            light: Number(lightSensor?.currentValue ?? 0),
            motion: Boolean(
              typeof occupancySensor?.currentValue === "boolean"
                ? occupancySensor.currentValue
                : Number(occupancySensor?.currentValue ?? 0) > 0
            ),
            timestamp: Date.now(),
          };

          setSensors(sensorList);

          // Round values to avoid floating point comparison issues
          const dataHash = JSON.stringify({
            temp: Math.round(newData.temperature * 10) / 10,
            hum: Math.round(newData.humidity * 10) / 10,
            light: Math.round(newData.light),
            motion: newData.motion,
          });

          // Only update if data changed AND at least 2 seconds have passed (debounce)
          const now = Date.now();
          if (
            dataHash !== lastDataHash.current &&
            now - lastUpdateTimeRef.current > 2000
          ) {
            lastDataHash.current = dataHash;
            lastUpdateTimeRef.current = now;
            setIsOnline(true);
            const newestUpdate = sensorList.reduce((acc, sensor) => {
              const ts = Date.parse(sensor.lastUpdate);
              return Number.isNaN(ts) ? acc : Math.max(acc, ts);
            }, now);
            setLastUpdated(newestUpdate);

            // Add to historical data only when data changes
            setHistoricalTemp((prev) => {
              const updated = [
                ...prev,
                { timestamp: now, value: newData.temperature },
              ];
              return updated.slice(-100);
            });
            setHistoricalHumidity((prev) => {
              const updated = [
                ...prev,
                { timestamp: now, value: newData.humidity },
              ];
              return updated.slice(-100);
            });
            setHistoricalLight((prev) => {
              const updated = [
                ...prev,
                { timestamp: now, value: newData.light },
              ];
              return updated.slice(-100);
            });

            // Reset connection timeout - mark offline after 10 seconds of no changes
            if (connectionTimeoutRef.current) {
              clearTimeout(connectionTimeoutRef.current);
            }
            connectionTimeoutRef.current = setTimeout(() => {
              setIsOnline(false);
            }, 10000);
          }

          setData(newData);
        }
      },
      (error) => {
        console.error("Firebase error:", error);
        setIsOnline(false);
      }
    );

    return () => {
      unsubscribe();
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  const getTemperatureStatus = (
    temp: number
  ): "normal" | "warning" | "critical" => {
    if (temp < 15 || temp > 30) return "critical";
    if (temp < 18 || temp > 28) return "warning";
    return "normal";
  };

  const getHumidityStatus = (
    humidity: number
  ): "normal" | "warning" | "critical" => {
    if (humidity < 20 || humidity > 80) return "critical";
    if (humidity < 30 || humidity > 70) return "warning";
    return "normal";
  };

  const getLightStatus = (light: number): "normal" | "warning" | "critical" => {
    if (light > 90) return "critical";
    if (light > 80) return "warning";
    return "normal";
  };

  const renderSensorTable = () => {
    if (!sensors.length) return null;

    const statusBadge = (status: string) => {
      const normalized = status.toLowerCase();
      const colorClasses =
        normalized === "critical"
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : normalized === "warning"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-emerald-50 text-emerald-700 border-emerald-200";

      return (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full border ${colorClasses}`}
        >
          {status}
        </span>
      );
    };

    const formatValue = (sensor: SensorReading) => {
      if (sensor.unit === "boolean") {
        return sensor.currentValue ? "Active" : "Idle";
      }
      const numeric = Number(sensor.currentValue);
      return Number.isFinite(numeric)
        ? numeric.toFixed(1)
        : String(sensor.currentValue);
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-7 bg-emerald-600 rounded-full"></span>
            <h3 className="text-lg font-semibold text-gray-900">
              Sensor Table
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Live readings from all sensors
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold">
              <tr>
                <th className="px-3 py-2 rounded-tl-lg">Name</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Room</th>
                <th className="px-3 py-2">Value</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 rounded-tr-lg">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sensors.map((sensor) => (
                <tr key={sensor.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-semibold text-gray-900 whitespace-nowrap">
                    {sensor.sensorName}
                  </td>
                  <td className="px-3 py-2 capitalize text-gray-700 whitespace-nowrap">
                    {sensor.category}
                  </td>
                  <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                    {sensor.room.replace(/-/g, " ")}
                  </td>
                  <td className="px-3 py-2 text-gray-900 whitespace-nowrap">
                    {formatValue(sensor)}{" "}
                    {sensor.unit !== "boolean" ? sensor.unit : ""}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {statusBadge(sensor.status)}
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                    {new Date(sensor.lastUpdate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header isOnline={isOnline} />

      <main className="min-h-screen bg-gray-50 pt-16 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!data ? (
            <div className="flex items-center justify-center h-[60vh] animate-fadeIn">
              <div className="text-center">
                <div className="inline-block rounded-full h-12 w-12 border-3 border-gray-200 border-t-blue-600 mb-4 animate-spin"></div>
                <p className="text-gray-700 text-base font-medium">
                  Connecting to sensors...
                </p>
                <p className="text-gray-500 text-sm mt-1">Please wait</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Live Sensor Status Cards */}
              <section className="animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-1 h-7 bg-blue-600 rounded-full"></span>
                    <span className="truncate">Live Sensor Data</span>
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-subtle"></div>
                    <span className="hidden xs:inline whitespace-nowrap font-medium">
                      Real-time
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <SensorStatusCard
                    title="Temperature"
                    value={data.temperature}
                    unit="°C"
                    status={getTemperatureStatus(data.temperature)}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    }
                  />
                  <SensorStatusCard
                    title="Humidity"
                    value={data.humidity}
                    unit="%"
                    status={getHumidityStatus(data.humidity)}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                        />
                      </svg>
                    }
                  />
                  <SensorStatusCard
                    title="Light Level"
                    value={data.light}
                    unit="%"
                    status={getLightStatus(data.light)}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    }
                  />
                  <SensorStatusCard
                    title="Occupancy"
                    value={data.motion ? "Detected" : "Idle"}
                    unit=""
                    status={data.motion ? "normal" : "warning"}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    }
                  />
                </div>
              </section>

              {/* Insights Section */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                <AIRecommendation data={data} />
                <EnvironmentSummary data={data} />
              </section>

              {/* Sensor Table */}
              <section className="animate-fadeIn">
                {renderSensorTable()}
              </section>

              {/* Main Dashboard Grid */}
              <section className="grid grid-cols-1 xl:grid-cols-3 gap-5 animate-fadeIn">
                <div className="xl:col-span-2">
                  <Charts
                    temperatureData={historicalTemp}
                    humidityData={historicalHumidity}
                    lightData={historicalLight}
                  />
                </div>
                <div className="xl:col-span-1">
                  <div className="xl:sticky xl:top-24">
                    <ControlPanel />
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer lastUpdated={lastUpdated} isConnected={isOnline} />
    </>
  );
}
