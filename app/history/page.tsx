"use client";

import { useState, useEffect } from "react";
import {
  DateRangePicker,
  RoomSelector,
  HistoricalChart,
  DataTable,
} from "@/components/history";
import {
  parseISTTimestamp,
  isValidTimestamp,
  getTimestampMs,
} from "@/lib/timestamp";

export default function HistoryPage() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end, label: "Last 30 Days" };
  });

  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [chartType, setChartType] = useState<ChartType>("line");
  const [metric, setMetric] = useState<
    "temperature" | "humidity" | "light" | "motion"
  >("temperature");

  // Fetch rooms once
  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((result) => {
        if (result.data?.length) {
          setRooms(
            result.data.map((r: DBRoom) => ({ id: r.id, name: r.name })),
          );
          setSelectedRooms(result.data.map((r: DBRoom) => r.id));
        }
      })
      .catch(() => {
        setRooms([
          { id: "bedroom", name: "Bedroom" },
          { id: "living_room", name: "Living Room" },
        ]);
        setSelectedRooms(["bedroom", "living_room"]);
      });
  }, []);

  useEffect(() => {
    if (!selectedRooms.length) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setError(null);
        const params = new URLSearchParams({
          _t: Date.now().toString(),
        });

        const response = await fetch(`/api/historical-data?${params}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Failed to fetch data from database");
          setHistoricalData([]);
          return;
        }

        if (result.data && Array.isArray(result.data)) {
          let filteredByRoom = result.data;

          if (selectedRooms.length > 0) {
            filteredByRoom = result.data.filter(
              (item: { roomId?: string }) =>
                item.roomId && selectedRooms.includes(item.roomId),
            );
          }

          const validData = filteredByRoom
            .filter((item: { timestamp: string }) => {
              if (!isValidTimestamp(item.timestamp)) {
                return false;
              }
              return true;
            })
            .map((item: HistoricalDataPoint) => ({
              ...item,
              timestamp: parseISTTimestamp(item.timestamp),
            }));

          setHistoricalData(validData.reverse());
        } else {
          setHistoricalData([]);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error while fetching data",
        );
        setHistoricalData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [selectedRooms]);

  useEffect(() => {
    if (historicalData.length === 0) return;

    const startMs = dateRange.start.getTime();
    const endMs = dateRange.end.getTime();

    const filteredByDate = historicalData.filter((item) => {
      const ts = getTimestampMs(item.timestamp);
      return ts >= startMs && ts <= endMs;
    });

    setHistoricalData(filteredByDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Sensor History
          </h1>
          <p className="text-[#6B7280]">Real-time data from database</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800">Error: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Date Range
                </label>
                <DateRangePicker value={dateRange} onChange={setDateRange} />
              </div>
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

            {historicalData.length > 0 && (
              <>
                <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
                  <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <h2 className="text-lg font-semibold text-gray-900 flex-1">
                      Sensor Readings
                    </h2>
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
                          setMetric(e.target.value as typeof metric)
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
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <DataTable data={historicalData} />
                </div>
              </>
            )}

            {historicalData.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 mb-2">No data for selected range</p>
                <p className="text-sm text-gray-400">
                  Make sure your external cron job is calling POST
                  /api/sync-firebase
                  <br />
                  Check that Firebase has data and device status is
                  &quot;online&quot;
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
