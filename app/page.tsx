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
    const liveRef = ref(db, "ecotrack/data");

    const unsubscribe = onValue(
      liveRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const newData: SensorData = {
            temperature: val.temperature || 0,
            humidity: val.humidity || 0,
            light: val.light || 0,
            motion: val.motion || false,
            timestamp: Date.now(),
          };

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
            setLastUpdated(now);

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
    if (light > 90) return "critical"; // Very dark
    if (light > 80) return "warning"; // Dark
    return "normal"; // Well lit
  };

  return (
    <>
      <Header isOnline={isOnline} />

      <main className="min-h-screen bg-gray-50 pt-14 sm:pt-16 md:pt-18 lg:pt-20 pb-4 sm:pb-6 md:pb-8">
        <div className="max-w-480 mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-16">
          {!data ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <div className="inline-block rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800 mb-4 animate-spin"></div>
                <p className="text-gray-700 text-lg font-medium">
                  Connecting to sensors...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Live Sensor Status Cards - Compact Top Section */}
              <section className="animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                    <span className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gray-800 rounded-full"></span>
                    <span className="truncate">Live Sensor Data</span>
                  </h2>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
                    <span className="hidden xs:inline whitespace-nowrap">
                      Real-time
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5">
                  <SensorStatusCard
                    title="Temperature"
                    value={data.temperature}
                    unit="°C"
                    status={getTemperatureStatus(data.temperature)}
                    icon={
                      <svg
                        className="w-6 h-6"
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
                        className="w-6 h-6"
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
                        className="w-6 h-6"
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
                        className="w-6 h-6"
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

              {/* Insights Section - 2 Column Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                {/* AI Recommendation */}
                <div className="lg:order-1">
                  <AIRecommendation data={data} />
                </div>

                {/* Environment Summary */}
                <div className="lg:order-2">
                  <EnvironmentSummary data={data} />
                </div>
              </section>

              {/* Main Dashboard Grid - Charts and Control Panel */}
              <section className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                {/* Charts Section - Takes 3 columns on 2xl screens */}
                <div className="xl:col-span-2 2xl:col-span-3">
                  <Charts
                    temperatureData={historicalTemp}
                    humidityData={historicalHumidity}
                    lightData={historicalLight}
                  />
                </div>

                {/* Control Panel - Takes 1 column on 2xl screens */}
                <div className="xl:col-span-1 2xl:col-span-1">
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
