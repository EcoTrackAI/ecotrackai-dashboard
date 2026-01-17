"use client";

import { useState, useEffect } from "react";
import {
  DateRangePicker,
  RoomSelector,
  HistoricalChart,
  DataTable,
} from "@/components/history";

export default function HistoryPage() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    // Default to last 30 days to avoid production timeout issues
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end, label: "Last 30 Days" };
  });

  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomOption[]>([]);

  const [chartType, setChartType] = useState<ChartType>("line");
  const [metric, setMetric] = useState<
    "temperature" | "humidity" | "light" | "motion"
  >("temperature");

  // Fetch rooms from database
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (response.ok) {
          const result = await response.json();
          if (result.data && Array.isArray(result.data)) {
            const roomOptions = result.data.map((r: DBRoom) => ({
              id: r.id,
              name: r.name,
            }));
            setRooms(roomOptions);
            // Select all rooms by default
            if (roomOptions.length > 0) {
              setSelectedRooms(roomOptions.map((r: RoomOption) => r.id));
            }
          }
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        // Fallback to hardcoded rooms if API fails
        setRooms([
          { id: "bedroom", name: "Bedroom" },
          { id: "living_room", name: "Living Room" },
        ]);
        setSelectedRooms(["bedroom", "living_room"]);
      }
    };

    fetchRooms();
  }, []);

  // Fetch historical data from database whenever date range or rooms change
  useEffect(() => {
    console.log(
      "[History] Fetching data - dateRange:",
      dateRange,
      "selectedRooms:",
      selectedRooms,
    );
    const fetchHistoricalData = async () => {
      // Use refreshing state for subsequent fetches, loading only for initial
      if (historicalData.length > 0) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        // Ensure dates are in valid ISO format
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error("Invalid date range");
        }

        const params = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          aggregation: "raw",
        });

        if (selectedRooms.length > 0) {
          params.append("roomIds", selectedRooms.join(","));
        }

        console.log(
          "[History] Fetching historical data with params:",
          params.toString(),
        );

        const response = await fetch(`/api/historical-data?${params}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });

        console.log("[History] API Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("[History] API Error:", errorData);
          throw new Error(
            errorData.error ||
              `HTTP ${response.status}: ${response.statusText}`,
          );
        }

        const result = await response.json();
        console.log("Historical data API response:", result);

        if (!result.data || !Array.isArray(result.data)) {
          console.warn("Invalid data format:", result);
          setHistoricalData([]);
          return;
        }

        if (result.data.length === 0) {
          console.log("No historical data available for selected filters");
          setHistoricalData([]);
          return;
        }

        // Transform timestamp strings to Date objects for compatibility with components
        const transformedData = result.data.map(
          (item: HistoricalDataPoint) => ({
            timestamp: new Date(item.timestamp),
            roomId: item.roomId,
            roomName: item.roomName,
            temperature: item.temperature,
            humidity: item.humidity,
            light: item.light,
            motion: item.motion,
          }),
        );

        console.log("Transformed data:", transformedData);
        setHistoricalData(transformedData);
        console.log(
          "[History] historicalData state updated with",
          transformedData.length,
          "points",
        );
      } catch (err) {
        console.error("Error fetching historical data:", err);
        const errorMsg =
          err instanceof Error ? err.message : "Failed to load data";
        setError(errorMsg);
        setHistoricalData([]);
      } finally {
        console.log("[History] Setting loading = false");
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchHistoricalData();
    
    // Set up polling to fetch new data every 10 seconds
    const intervalId = setInterval(() => {
      console.log("[History] Polling for new data...");
      fetchHistoricalData();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [dateRange, selectedRooms]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#111827] mb-2">
                Sensor History
              </h1>
              <p className="text-[#6B7280]">
                View and analyze sensor data from the database (auto-refreshes every 10s)
              </p>
            </div>
            {refreshing && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span>Updating...</span>
              </div>
            )}
          </div>
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
                <p className="text-gray-500 mb-2">
                  No sensor data available for the selected date range and rooms
                </p>
                <p className="text-sm text-gray-400">
                  Data is stored in the database via external API calls.
                  <br />
                  Make sure your external service is writing data to the database.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
