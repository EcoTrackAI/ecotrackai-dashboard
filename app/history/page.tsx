"use client";

import React, { useState, useEffect } from "react";
import {
  DateRangePicker,
  RoomSelector,
  HistoricalChart,
  DataTable,
} from "@/components/history";
import { subscribeRoomSensor } from "@/lib/firebase-sensors";
import { initializeFirebase } from "@/lib/firebase";

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
  const [bedroomData, setBedroomData] = useState<RoomSensorData | null>(null);
  const [livingRoomData, setLivingRoomData] = useState<RoomSensorData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [chartType, setChartType] = useState<ChartType>("line");
  const [metric, setMetric] = useState<
    "temperature" | "humidity" | "light" | "motion"
  >("temperature");

  useEffect(() => {
    try {
      initializeFirebase();
    } catch (err) {
      console.error("Failed to initialize Firebase:", err);
      setError("Failed to connect to Firebase");
      setLoading(false);
      return;
    }

    const unsubscribeBedroom = subscribeRoomSensor("bedroom", (data) => {
      setBedroomData(data);
      setLoading(false);
    });

    const unsubscribeLivingRoom = subscribeRoomSensor("living_room", (data) => {
      setLivingRoomData(data);
      setLoading(false);
    });

    return () => {
      unsubscribeBedroom();
      unsubscribeLivingRoom();
    };
  }, []);

  // Convert current sensor data to historical format for display
  const historicalData: HistoricalDataPoint[] = [];

  if (selectedRooms.includes("bedroom") && bedroomData) {
    historicalData.push({
      timestamp: bedroomData.updatedAt,
      roomId: "bedroom",
      roomName: "Bedroom",
      temperature: bedroomData.temperature,
      humidity: bedroomData.humidity,
      light: bedroomData.light,
      motion: bedroomData.motion,
    });
  }

  if (selectedRooms.includes("living_room") && livingRoomData) {
    historicalData.push({
      timestamp: livingRoomData.updatedAt,
      roomId: "living_room",
      roomName: "Living Room",
      temperature: livingRoomData.temperature,
      humidity: livingRoomData.humidity,
      light: livingRoomData.light,
      motion: livingRoomData.motion,
    });
  }

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
          <p className="text-[#6B7280]">View current sensor readings by room</p>
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
