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
import { MetricCard } from "@/components/metrics";

interface ChartData {
  time: string;
  power: number;
  energy: number;
  voltage: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
      <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
      {payload.map((entry: any, index: number) => (
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [powerHistory, setPowerHistory] = useState<ChartData[]>([]);
  const [latestMetrics, setLatestMetrics] = useState<PZEMData | null>(null);

  // Fetch PZEM data from database with auto-refresh every 10s
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);

        const params = new URLSearchParams({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          aggregation: "raw",
          _t: Date.now().toString(), // Cache buster
        });

        console.log("[Analytics] Fetching:", `/api/pzem-data?${params}`);
        const response = await fetch(`/api/pzem-data?${params}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        console.log("[Analytics] Response status:", response.status);
        
        const result = await response.json();
        console.log("[Analytics] Result:", result);

        if (!response.ok) {
          setError(result.error || "Failed to fetch data");
          setPowerHistory([]);
          return;
        }

        if (result.data?.length) {
          const formatted = result.data.map((item: HistoricalPZEMData) => ({
            time: new Date(item.timestamp).toLocaleString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            power: Number(item.power) || 0,
            energy: Number(item.energy) || 0,
            voltage: Number(item.voltage) || 0,
          }));
          setPowerHistory(formatted);
          console.log("[Analytics] Loaded", formatted.length, "records");

          // Set latest metrics from most recent data point
          const latest = result.data[result.data.length - 1];
          setLatestMetrics({
            current: Number(latest.current) || 0,
            voltage: Number(latest.voltage) || 0,
            power: Number(latest.power) || 0,
            energy: Number(latest.energy) || 0,
            frequency: Number(latest.frequency) || 0,
            pf: Number(latest.pf) || 0,
            updatedAt: latest.timestamp,
          });
          console.log("[Analytics] Latest metrics:", latestMetrics);
        } else {
          setPowerHistory([]);
          setLatestMetrics(null);
        }
      } catch (err) {
        console.error("[Analytics] Fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Power Analytics
          </h1>
          <p className="text-gray-600">
            Real-time data from database (updates every 10s)
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800">Error: {error}</p>
            <p className="text-xs text-red-600 mt-1">Check console for details</p>
          </div>
        )}

        {latestMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <MetricCard
              title="Current Power"
              value={latestMetrics.power.toFixed(1)}
              unit="W"
              icon={<Zap className="w-6 h-6" />}
            />
            <MetricCard
              title="Voltage"
              value={latestMetrics.voltage.toFixed(1)}
              unit="V"
              icon={<Gauge className="w-6 h-6" />}
            />
            <MetricCard
              title="Total Energy"
              value={latestMetrics.energy.toFixed(2)}
              unit="kWh"
              icon={<TrendingUp className="w-6 h-6" />}
            />
          </div>
        )}

        {powerHistory.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
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
                />
                <YAxis stroke={COLORS.textMuted} style={{ fontSize: "12px" }} />
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
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Power Usage History
            </h2>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">No PZEM data available</p>
              <p className="text-sm text-gray-400">
                Make sure your external cron job is calling POST /api/sync-firebase
                <br />
                Check that Firebase has PZEM data and device status is "online"
              </p>
            </div>
          </div>
        )}

        {latestMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-4">
                Power Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current</span>
                  <span className="font-semibold">
                    {latestMetrics.current.toFixed(2)} A
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Power Factor</span>
                  <span className="font-semibold">
                    {latestMetrics.pf.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency</span>
                  <span className="font-semibold">
                    {latestMetrics.frequency.toFixed(2)} Hz
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
                    {latestMetrics.energy.toFixed(2)} kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Power</span>
                  <span className="font-semibold">
                    {latestMetrics.power.toFixed(1)} W
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Voltage</span>
                  <span className="font-semibold">
                    {latestMetrics.voltage.toFixed(1)} V
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
