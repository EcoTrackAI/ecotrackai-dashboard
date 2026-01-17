"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Zap, Gauge } from "lucide-react";
import { COLORS } from "@/lib/constants";
import { subscribePZEMData } from "@/lib/firebase-sensors";
import { initializeFirebase } from "@/lib/firebase";
import { MetricCard } from "@/components/metrics";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
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
  const [pzem, setPzem] = useState<PZEMData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [powerHistory, setPowerHistory] = useState<
    Array<{ time: string; power: number; energy: number; voltage: number }>
  >([]);

  // Fetch historical PZEM data from database
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const end = new Date();
        const start = new Date();
        start.setHours(start.getHours() - 24); // Last 24 hours

        const params = new URLSearchParams({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          aggregation: "hourly",
        });

        const response = await fetch(`/api/pzem-data?${params}`);

        if (response.ok) {
          const result = await response.json();
          const formattedData = result.data.map((item: any) => ({
            time: new Date(item.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            power: item.power,
            energy: item.energy,
            voltage: item.voltage,
          }));
          setPowerHistory(formattedData);
        }
      } catch (err) {
        console.error("Error fetching historical PZEM data:", err);
      }
    };

    fetchHistoricalData();
  }, []);

  // Subscribe to real-time PZEM data from Firebase
  useEffect(() => {
    try {
      initializeFirebase();
    } catch (err) {
      console.error("Failed to initialize Firebase:", err);
      setError("Failed to connect to Firebase");
      setLoading(false);
      return;
    }

    const unsubscribe = subscribePZEMData((data) => {
      if (data) {
        setPzem(data);
      }
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
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
          {powerHistory.length > 0 && (
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
