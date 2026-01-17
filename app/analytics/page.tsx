"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Zap, Gauge } from "lucide-react";
import { COLORS } from "@/lib/constants";
import { subscribePZEMData } from "@/lib/firebase-sensors";
import { initializeFirebase } from "@/lib/firebase";
import { MetricCard } from "@/components/metrics";

interface TooltipPayload {
  color: string;
  name: string;
  value: number | string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
      <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
      {payload.map((entry, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}:{" "}
          {typeof entry.value === "number"
            ? entry.value.toFixed(2)
            : entry.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [pzem, setPzem] = useState<PZEMData | null>(null);
  const [loadingHistorical, setLoadingHistorical] = useState(true);
  const [loadingFirebase, setLoadingFirebase] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [powerHistory, setPowerHistory] = useState<
    Array<{ time: string; power: number; energy: number; voltage: number }>
  >([]);

  // Fetch historical PZEM data from database
  useEffect(() => {
    console.log(
      "[Analytics] Component mounted, starting historical data fetch",
    );
    const fetchHistoricalData = async () => {
      try {
        const end = new Date();
        // Default to last 7 days to avoid production timeout issues
        const start = new Date();
        start.setDate(start.getDate() - 7);
        console.log("[Analytics] Fetching PZEM data from", start, "to", end);

        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error("Invalid date range");
        }

        const params = new URLSearchParams({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          aggregation: "raw",
        });

        const response = await fetch(`/api/pzem-data?${params}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });

        console.log("[Analytics] API Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            "[Analytics] API Error:",
            errorData.error || response.status,
          );
          setPowerHistory([]);
          return;
        }

        const result = await response.json();
        console.log("PZEM API Response:", result);

        if (!result.data || !Array.isArray(result.data)) {
          console.warn("Invalid data format from API:", result);
          setPowerHistory([]);
          return;
        }

        if (result.data.length === 0) {
          console.log("No PZEM data available in database");
          setPowerHistory([]);
          return;
        }

        const formattedData = result.data.map((item: HistoricalPZEMData) => ({
          time: new Date(item.timestamp).toLocaleString("en-IN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kolkata",
          }),
          power: Number(item.power) || 0,
          energy: Number(item.energy) || 0,
          voltage: Number(item.voltage) || 0,
        }));
        console.log("Formatted PZEM data:", formattedData);
        setPowerHistory(formattedData);
        console.log(
          "[Analytics] powerHistory state updated with",
          formattedData.length,
          "points",
        );
      } catch (err) {
        console.error("Error fetching historical PZEM data:", err);
        setPowerHistory([]);
      } finally {
        console.log("[Analytics] Setting loadingHistorical = false");
        setLoadingHistorical(false);
      }
    };

    fetchHistoricalData();
  }, []);

  // Subscribe to real-time PZEM data from Firebase
  useEffect(() => {
    console.log("[Analytics] Starting Firebase subscription");

    try {
      initializeFirebase();
      console.log("[Analytics] Firebase initialized successfully");
    } catch (err) {
      console.error("Failed to initialize Firebase:", err);
      setError("Firebase not available - showing database data");
      console.log("[Analytics] Setting loadingFirebase = false (init failed)");
      setLoadingFirebase(false);
      return;
    }

    // Set a timeout to stop waiting for Firebase after 3 seconds
    const firebaseTimeout = setTimeout(() => {
      console.log(
        "Firebase subscription timeout - proceeding with database data",
      );
      setLoadingFirebase(false);
    }, 3000);

    const unsubscribe = subscribePZEMData((data) => {
      clearTimeout(firebaseTimeout);
      if (data) {
        console.log("Received Firebase data:", data);
        setPzem(data);
      }
      setLoadingFirebase(false);
      setError(null);
    });

    return () => {
      clearTimeout(firebaseTimeout);
      unsubscribe();
    };
  }, []);

  const loading = loadingHistorical || loadingFirebase;
  console.log(
    "[Analytics] Render - loadingHistorical:",
    loadingHistorical,
    "loadingFirebase:",
    loadingFirebase,
    "loading:",
    loading,
    "powerHistory.length:",
    powerHistory.length,
  );

  if (loading) {
    console.log("[Analytics] Showing loading screen");
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-gray-500">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Power Analytics
          </h1>
          <p className="text-gray-600">
            Real-time power metrics and 24-hour historical trends
          </p>
        </div>

        {/* Key Metrics */}
        {pzem && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <MetricCard
              title="Current Power"
              value={pzem.power.toFixed(1)}
              unit="W"
              icon={<Zap className="w-6 h-6" />}
            />
            <MetricCard
              title="Voltage"
              value={pzem.voltage.toFixed(1)}
              unit="V"
              icon={<Gauge className="w-6 h-6" />}
            />
            <MetricCard
              title="Total Energy"
              value={pzem.energy.toFixed(2)}
              unit="kWh"
              icon={<TrendingUp className="w-6 h-6" />}
            />
          </div>
        )}

        {/* Charts */}
        <div className="space-y-6">
          {/* Power Usage History */}
          {powerHistory.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Power Usage History
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={powerHistory}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="time"
                    stroke={COLORS.textMuted}
                    style={{ fontSize: "12px" }}
                    tick={{ fill: COLORS.textMuted }}
                  />
                  <YAxis
                    stroke={COLORS.textMuted}
                    style={{ fontSize: "12px" }}
                    tick={{ fill: COLORS.textMuted }}
                    label={{
                      value: "Power (W)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: COLORS.textMuted, fontSize: "12px" },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="power"
                    name="Power"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Power Usage History
              </h2>
              <div className="h-75 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">No PZEM data available.</p>
                  <p className="text-sm text-gray-400">
                    Make sure data has been synced from Firebase to the
                    database.
                    <br />
                    You can sync data by calling the POST /api/sync-firebase
                    endpoint.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Power Stats */}
          {pzem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-4">
                  Power Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current</span>
                    <span className="font-semibold">
                      {pzem.current.toFixed(2)} A
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Power Factor</span>
                    <span className="font-semibold">{pzem.pf.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequency</span>
                    <span className="font-semibold">
                      {pzem.frequency.toFixed(2)} Hz
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-4">
                  Energy Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Energy</span>
                    <span className="font-semibold">
                      {pzem.energy.toFixed(2)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Power</span>
                    <span className="font-semibold">
                      {pzem.power.toFixed(1)} W
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voltage</span>
                    <span className="font-semibold">
                      {pzem.voltage.toFixed(1)} V
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
