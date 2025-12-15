"use client";

import { useEffect, useState } from "react";
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
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [historicalTemp, setHistoricalTemp] = useState<HistoricalDataPoint[]>(
    []
  );
  const [historicalHumidity, setHistoricalHumidity] = useState<
    HistoricalDataPoint[]
  >([]);

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
          setData(newData);
          setIsOnline(true);
          setLastUpdated(Date.now());

          // Add to historical data (keep last 100 points)
          setHistoricalTemp((prev) => {
            const updated = [
              ...prev,
              { timestamp: Date.now(), value: newData.temperature },
            ];
            return updated.slice(-100);
          });
          setHistoricalHumidity((prev) => {
            const updated = [
              ...prev,
              { timestamp: Date.now(), value: newData.humidity },
            ];
            return updated.slice(-100);
          });
        }
      },
      (error) => {
        console.error("Firebase error:", error);
        setIsOnline(false);
      }
    );

    // Check for stale data every 30 seconds
    const statusInterval = setInterval(() => {
      if (lastUpdated && Date.now() - lastUpdated > 60000) {
        setIsOnline(false);
      }
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
    };
  }, [lastUpdated]);

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
    if (light < 10) return "critical";
    if (light < 20) return "warning";
    return "normal";
  };

  return (
    <>
      <Header isOnline={isOnline} />

      <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!data ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading sensor data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Live Sensor Status Cards */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Live Sensor Status
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Charts
                    temperatureData={historicalTemp}
                    humidityData={historicalHumidity}
                  />
                </div>
                <div className="lg:col-span-1">
                  <ControlPanel />
                </div>
              </section>

              {/* Footer */}
              <Footer lastUpdated={lastUpdated} isConnected={isOnline} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
