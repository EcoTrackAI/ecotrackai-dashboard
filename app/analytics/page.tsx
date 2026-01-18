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
import {
  isValidTimestamp,
  getTimestampMs,
  formatTimestamp,
} from "@/lib/timestamp";

interface ChartData {
  time: string;
  power: number;
  energy: number;
  voltage: number;
  timestamp?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [powerHistory, setPowerHistory] = useState<ChartData[]>([]);
  const [latestMetrics, setLatestMetrics] = useState<PZEMData | null>(null);

  // Fetch PZEM data from database with auto-refresh every 10s
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        const params = new URLSearchParams({
          _t: Date.now().toString(),
        });

        const response = await fetch(`/api/pzem-data?${params}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Failed to fetch data from database");
          setPowerHistory([]);
          setLatestMetrics(null);
          return;
        }

        if (result.data?.length > 0) {
          const formatted = result.data
            .filter((item: { timestamp: string }) => {
              if (!isValidTimestamp(item.timestamp)) {
                return false;
              }
              return true;
            })
            .map((item: HistoricalPZEMData) => ({
              time: formatTimestamp(item.timestamp, "en-IN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              power: Number(item.power) || 0,
              energy: Number(item.energy) || 0,
              voltage: Number(item.voltage) || 0,
              timestamp: item.timestamp,
            }));

          setPowerHistory(formatted);

          const latestData = result.data.find(
            (item: { timestamp: string }) =>
              !isNaN(new Date(item.timestamp).getTime()),
          );

          if (latestData && latestData.timestamp) {
            setLatestMetrics({
              current: Number(latestData.current) || 0,
              voltage: Number(latestData.voltage) || 0,
              power: Number(latestData.power) || 0,
              energy: Number(latestData.energy) || 0,
              frequency: Number(latestData.frequency) || 0,
              pf: Number(latestData.pf) || 0,
              updatedAt: latestData.timestamp,
            });
          } else {
            setLatestMetrics(null);
          }
        } else {
          setPowerHistory([]);
          setLatestMetrics(null);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error while fetching data",
        );
        setPowerHistory([]);
        setLatestMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (powerHistory.length === 0) return;

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);

    const startMs = start.getTime();
    const endMs = end.getTime();

    const filteredBy7Days = powerHistory.filter((item: ChartData) => {
      const ts = getTimestampMs(item.timestamp || "");
      return ts >= startMs && ts <= endMs;
    });

    if (filteredBy7Days.length !== powerHistory.length) {
      setPowerHistory(filteredBy7Days);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                Make sure your external cron job is calling POST
                /api/sync-firebase
                <br />
                Check that Firebase has PZEM data and device status is
                &quot;online&quot;
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
