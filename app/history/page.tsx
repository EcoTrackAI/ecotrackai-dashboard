"use client";

import React, { useState, useEffect } from "react";
import {
  DateRangePicker,
  RoomSelector,
  HistoricalChart,
  DataTable,
} from "@/components/history";

export default function HistoryPage() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    return { start, end, label: "Last 7 Days" };
  });

  const [selectedRooms, setSelectedRooms] = useState<string[]>([
    "bedroom",
    "living_room",
  ]);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [chartType, setChartType] = useState<ChartType>("line");
  const [metric, setMetric] = useState<
    "temperature" | "humidity" | "light" | "motion"
  >("temperature");

  // Fetch historical data from database whenever date range or rooms change
  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          startDate: dateRange.start.toISOString(),
          endDate: dateRange.end.toISOString(),
          aggregation: "hourly",
        });

        if (selectedRooms.length > 0) {
          params.append("roomIds", selectedRooms.join(","));
        }

        const response = await fetch(`/api/historical-data?${params}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const result = await response.json();

        if (!result.data || !Array.isArray(result.data)) {
          console.warn("Invalid data format:", result);
          setHistoricalData([]);
          return;
        }

        // Transform timestamp strings to Date objects for compatibility with components
        const transformedData = result.data.map((item: any) => ({
          timestamp: new Date(item.timestamp),
          roomId: item.roomId,
          roomName: item.roomName,
          temperature: item.temperature,
          humidity: item.humidity,
          light: item.light,
          motion: item.motion,
        }));

        setHistoricalData(transformedData);
      } catch (err) {
        console.error("Error fetching historical data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
        setHistoricalData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [dateRange, selectedRooms]);

  const rooms: RoomOption[] = [
    { id: "bedroom", name: "Bedroom" },
    { id: "living_room", name: "Living Room" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Sensor History
          </h1>
          <p className="text-[#6B7280]">
            View and analyze historical sensor data from the database
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-red-800">
                  Connection Error
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading sensor data...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Controls */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Range Picker */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Date Range
                </label>
                <DateRangePicker value={dateRange} onChange={setDateRange} />
              </div>

              {/* Room Selector */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Rooms
                </label>
                <RoomSelector
                  rooms={rooms}
                  selectedRoomIds={selectedRooms}
                  onChange={setSelectedRooms}
                  multiple={true}
                />
              </div>
            </div>

            {/* Chart */}
            {historicalData.length > 0 && (
              <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Sensor Readings
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={chartType}
                      onChange={(e) =>
                        setChartType(e.target.value as ChartType)
                      }
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    >
                      <option value="line">Line</option>
                      <option value="area">Area</option>
                      <option value="bar">Bar</option>
                    </select>
                    <select
                      value={metric}
                      onChange={(e) =>
                        setMetric(
                          e.target.value as
                            | "temperature"
                            | "humidity"
                            | "light"
                            | "motion",
                        )
                      }
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    >
                      <option value="temperature">Temperature</option>
                      <option value="humidity">Humidity</option>
                      <option value="light">Light</option>
                      <option value="motion">Motion</option>
                    </select>
                  </div>
                </div>
                <HistoricalChart
                  data={historicalData}
                  chartType={chartType}
                  metric={metric}
                  height={300}
                  compareRooms={selectedRooms.length > 1}
                />
              </div>
            )}

            {/* Data Table */}
            {historicalData.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <DataTable data={historicalData} />
              </div>
            )}

            {historicalData.length === 0 && !loading && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">
                  No data available for selected rooms
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
