"use client";

import React, { useState, useEffect } from "react";
import {
  DateRangePicker,
  RoomSelector,
  HistoricalChart,
  DataTable,
} from "@/components/history";
import { fetchHistoricalData, fetchRooms } from "@/lib/api";

export default function HistoryPage() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    return { start, end, label: "Last 7 Days" };
  });

  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
    []
  );
  const [isLoading, setIsLoading] = useState({ rooms: false, data: false });
  const [error, setError] = useState<string | null>(null);

  const [chartType, setChartType] = useState<ChartType>("line");
  const [metric, setMetric] = useState<MetricType>("energy");
  const [compareRooms, setCompareRooms] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (selectedRoomIds.length > 0) {
      loadHistoricalData();
    } else {
      setHistoricalData([]);
    }
  }, [dateRange, selectedRoomIds]);

  const loadRooms = async () => {
    setIsLoading((prev) => ({ ...prev, rooms: true }));
    setError(null);
    try {
      const roomsData = await fetchRooms();
      setRooms(roomsData);
      setSelectedRoomIds(roomsData.map((r) => r.id));
    } catch (err) {
      setError("Failed to load rooms. Please check API connection.");
      console.error(err);
      setRooms([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, rooms: false }));
    }
  };

  const loadHistoricalData = async () => {
    setIsLoading((prev) => ({ ...prev, data: true }));
    setError(null);
    try {
      const data = await fetchHistoricalData(
        dateRange.start,
        dateRange.end,
        selectedRoomIds
      );
      setHistoricalData(data);
    } catch (err) {
      setError("Failed to load historical data. Please check API connection.");
      console.error(err);
      setHistoricalData([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, data: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            History & Comparison
          </h1>
          <p className="text-[#6B7280]">
            View and analyze historical energy consumption data across different
            time periods and rooms.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-[#DC2626]">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Date Range Picker */}
          <div className="lg:col-span-2">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          {/* Room Selector */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Rooms
              </label>
              <RoomSelector
                rooms={rooms}
                selectedRoomIds={selectedRoomIds}
                onChange={setSelectedRoomIds}
                isLoading={isLoading.rooms}
              />
              <div className="mt-4">
                <button
                  onClick={loadHistoricalData}
                  disabled={isLoading.data || selectedRoomIds.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6366F1] rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  aria-label="Refresh data"
                >
                  {isLoading.data ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Refresh Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Chart Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Type
              </label>
              <div className="flex gap-2">
                {(["line", "area", "bar"] as ChartType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 ${
                      chartType === type
                        ? "bg-[#6366F1] text-white border-[#6366F1]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    aria-label={`${type} chart`}
                    aria-pressed={chartType === type}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric */}
            <div>
              <label
                htmlFor="metric-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Metric
              </label>
              <select
                id="metric-select"
                value={metric}
                onChange={(e) => setMetric(e.target.value as MetricType)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              >
                <option value="energy">Energy (kWh)</option>
                <option value="power">Power (W)</option>
                <option value="temperature">Temperature (°C)</option>
                <option value="humidity">Humidity (%)</option>
                <option value="lighting">Lighting (%)</option>
                <option value="motion">Motion/Occupancy</option>
              </select>
            </div>

            {/* Compare Rooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <button
                onClick={() => setCompareRooms(!compareRooms)}
                disabled={selectedRoomIds.length < 2}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  compareRooms
                    ? "bg-[#6366F1] text-white border-[#6366F1]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                aria-label="Compare rooms"
                aria-pressed={compareRooms}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Compare Rooms
              </button>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mb-6">
          <HistoricalChart
            data={historicalData}
            chartType={chartType}
            metric={metric}
            compareRooms={compareRooms}
            title={`${
              metric.charAt(0).toUpperCase() + metric.slice(1)
            } Over Time`}
            height={400}
          />
        </div>

        {/* Data Table */}
        <DataTable data={historicalData} isLoading={isLoading.data} />
      </div>
    </div>
  );
}
