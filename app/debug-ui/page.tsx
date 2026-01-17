"use client";

import { useEffect, useState } from "react";

interface DebugData {
  status: string;
  database: {
    rooms: { count: number };
    pzem: { latest: unknown };
    sensors: { count: number };
  };
}

interface ApiResponse {
  count: number;
  data?: unknown[];
}

export default function DebugUIPage() {
  const [dbgDebug, setDbgDebug] = useState<DebugData | null>(null);
  const [dbgRooms, setDbgRooms] = useState<ApiResponse | null>(null);
  const [dbgPzem, setDbgPzem] = useState<ApiResponse | null>(null);
  const [dbgHistorical, setDbgHistorical] = useState<ApiResponse | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    const runTests = async () => {
      addLog("Starting debug tests...");

      // Test 1: Debug endpoint
      try {
        addLog("Fetching /api/debug...");
        const res = await fetch("/api/debug", { cache: "no-store" });
        const data = await res.json();
        setDbgDebug(data);
        addLog(
          `✓ Debug: ${data.status}, Rooms: ${data.database.rooms.count}, PZEM: ${data.database.pzem.latest ? "Available" : "None"}, Sensors: ${data.database.sensors.count}`,
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        addLog(`✗ Debug failed: ${message}`);
      }

      // Test 2: Rooms endpoint
      try {
        addLog("Fetching /api/rooms...");
        const res = await fetch("/api/rooms", { cache: "no-store" });
        const data = await res.json();
        setDbgRooms(data);
        addLog(`✓ Rooms: Found ${data.count} rooms`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        addLog(`✗ Rooms failed: ${message}`);
      }

      // Test 3: PZEM data endpoint
      try {
        addLog("Fetching /api/pzem-data (last 24h)...");
        const end = new Date();
        const start = new Date();
        start.setHours(start.getHours() - 24);

        const params = new URLSearchParams({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          aggregation: "hourly",
        });

        const res = await fetch(`/api/pzem-data?${params}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setDbgPzem(data);
        addLog(`✓ PZEM: Found ${data.count} readings`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        addLog(`✗ PZEM failed: ${message}`);
      }

      // Test 4: Historical data endpoint
      try {
        addLog("Fetching /api/historical-data (last 7d)...");
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);

        const params = new URLSearchParams({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          aggregation: "hourly",
          roomIds: "bedroom,living_room",
        });

        const res = await fetch(`/api/historical-data?${params}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setDbgHistorical(data);
        addLog(`✓ Historical: Found ${data.count} readings`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        addLog(`✗ Historical failed: ${message}`);
      }

      addLog("All tests complete!");
    };

    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Debug UI</h1>

        {/* Logs */}
        <div className="bg-black text-green-400 p-4 rounded-lg mb-8 font-mono text-sm max-h-96 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Debug Endpoint */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Endpoint</h2>
            {dbgDebug ? (
              <pre className="text-xs overflow-auto max-h-64 bg-gray-50 p-3 rounded">
                {JSON.stringify(dbgDebug, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>

          {/* Rooms Endpoint */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Rooms Endpoint</h2>
            {dbgRooms ? (
              <pre className="text-xs overflow-auto max-h-64 bg-gray-50 p-3 rounded">
                {JSON.stringify(dbgRooms, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>

          {/* PZEM Data Endpoint */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">PZEM Data (24h)</h2>
            {dbgPzem ? (
              <pre className="text-xs overflow-auto max-h-64 bg-gray-50 p-3 rounded">
                {JSON.stringify(dbgPzem, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>

          {/* Historical Data Endpoint */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Historical Data (7d)</h2>
            {dbgHistorical ? (
              <pre className="text-xs overflow-auto max-h-64 bg-gray-50 p-3 rounded">
                {JSON.stringify(dbgHistorical, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="mt-8 flex gap-4">
          <a
            href="/analytics"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Analytics
          </a>
          <a
            href="/history"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Go to History
          </a>
        </div>
      </div>
    </div>
  );
}
