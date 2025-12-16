"use client";

import { useEffect, useState, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
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

      <main className="min-h-screen bg-gray-100 pt-16 sm:pt-20 pb-4 sm:pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {!data ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-[60vh]"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-700 mb-4"
                ></motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-800 text-lg font-medium"
                >
                  Connecting to sensors...
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Live Sensor Status Cards */}
              <section>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900 mb-4 sm:mb-6"
                >
                  Live Sensor Status
                </motion.h2>
                <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

              {/* Environment Summary */}
              <section>
                <EnvironmentSummary data={data} />
              </section>

              {/* AI Recommendation Section */}
              <section>
                <AIRecommendation data={data} />
              </section>

              {/* Charts & Control Panel */}
              <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                <div className="xl:col-span-2">
                  <Charts
                    temperatureData={historicalTemp}
                    humidityData={historicalHumidity}
                  />
                </div>
                <div className="xl:col-span-1">
                  <ControlPanel />
                </div>
              </section>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer lastUpdated={lastUpdated} isConnected={isOnline} />
    </>
  );
}
