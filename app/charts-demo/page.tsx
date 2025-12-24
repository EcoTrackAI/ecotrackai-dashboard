"use client";

import { useState, useEffect } from "react";
import { RealtimeLineChart } from "@/components/charts";

// Mock data generator for demo purposes
const generateMockData = (
  points: number,
  baseValue: number,
  variance: number
) => {
  const data = [];
  const now = new Date();

  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5000); // 5 second intervals
    const value = baseValue + (Math.random() - 0.5) * variance;
    data.push({
      timestamp: time.toLocaleTimeString(),
      value: Math.max(0, value),
    });
  }

  return data;
};

export default function ChartDemoPage() {
  // Power consumption data (Watts)
  const [powerData, setPowerData] = useState(() =>
    generateMockData(20, 450, 100)
  );

  // Temperature data (Celsius)
  const [tempData, setTempData] = useState(() => generateMockData(20, 22, 4));

  // Energy consumption data (kWh)
  const [energyData, setEnergyData] = useState(() =>
    generateMockData(20, 15, 5)
  );

  // Voltage data (Volts)
  const [voltageData, setVoltageData] = useState(() =>
    generateMockData(20, 230, 10)
  );

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();

      // Update power data
      setPowerData((prev) => [
        ...prev.slice(-19),
        {
          timestamp,
          value: Math.max(0, 450 + (Math.random() - 0.5) * 100),
        },
      ]);

      // Update temperature data
      setTempData((prev) => [
        ...prev.slice(-19),
        {
          timestamp,
          value: Math.max(0, 22 + (Math.random() - 0.5) * 4),
        },
      ]);

      // Update energy data
      setEnergyData((prev) => [
        ...prev.slice(-19),
        {
          timestamp,
          value: Math.max(0, 15 + (Math.random() - 0.5) * 5),
        },
      ]);

      // Update voltage data
      setVoltageData((prev) => [
        ...prev.slice(-19),
        {
          timestamp,
          value: Math.max(0, 230 + (Math.random() - 0.5) * 10),
        },
      ]);
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Real-time Chart Component Demo
          </h1>
          <p className="text-gray-600">
            Live visualization of IoT sensor data using the RealtimeLineChart
            component
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Power Consumption Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Power Consumption
              </h2>
              <p className="text-sm text-gray-500">
                Real-time power usage monitoring
              </p>
            </div>
            <RealtimeLineChart
              data={powerData}
              dataKey="value"
              color="#16A34A"
              unit="W"
              height={280}
            />
            <div className="mt-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">
                Live updating every 3s
              </span>
            </div>
          </div>

          {/* Temperature Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Room Temperature
              </h2>
              <p className="text-sm text-gray-500">
                Temperature monitoring with warning threshold
              </p>
            </div>
            <RealtimeLineChart
              data={tempData}
              dataKey="value"
              color="#FB923C"
              unit="°C"
              height={280}
            />
            <div className="mt-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">
                Live updating every 3s
              </span>
            </div>
          </div>

          {/* Energy Consumption Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Energy Consumption
              </h2>
              <p className="text-sm text-gray-500">
                Total energy usage tracking
              </p>
            </div>
            <RealtimeLineChart
              data={energyData}
              dataKey="value"
              color="#6366F1"
              unit="kWh"
              height={280}
            />
            <div className="mt-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">
                Live updating every 3s
              </span>
            </div>
          </div>

          {/* Voltage Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Voltage Monitoring
              </h2>
              <p className="text-sm text-gray-500">
                Real-time voltage stability tracking
              </p>
            </div>
            <RealtimeLineChart
              data={voltageData}
              dataKey="value"
              color="#DC2626"
              unit="V"
              height={280}
            />
            <div className="mt-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">
                Live updating every 3s
              </span>
            </div>
          </div>
        </div>

        {/* Component Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Component Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                📊 Real-time Updates
              </h3>
              <p className="text-xs text-gray-600">
                Smooth animations and live data visualization
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                🎨 Customizable
              </h3>
              <p className="text-xs text-gray-600">
                Colors, units, height, and more via props
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                📱 Responsive
              </h3>
              <p className="text-xs text-gray-600">
                Mobile-first design, works on all screen sizes
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                ♿ Accessible
              </h3>
              <p className="text-xs text-gray-600">
                WCAG compliant with proper contrast and labels
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                🔧 TypeScript
              </h3>
              <p className="text-xs text-gray-600">
                Fully typed with comprehensive prop definitions
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                ⚡ Performance
              </h3>
              <p className="text-xs text-gray-600">
                Optimized for efficient rendering and updates
              </p>
            </div>
          </div>
        </div>

        {/* Color System Reference */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Color System
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="w-full h-12 bg-[#6366F1] rounded-lg mb-2" />
              <p className="text-xs font-medium text-gray-900">#6366F1</p>
              <p className="text-xs text-gray-500">Primary (Indigo)</p>
            </div>
            <div>
              <div className="w-full h-12 bg-[#16A34A] rounded-lg mb-2" />
              <p className="text-xs font-medium text-gray-900">#16A34A</p>
              <p className="text-xs text-gray-500">Success (Green)</p>
            </div>
            <div>
              <div className="w-full h-12 bg-[#FB923C] rounded-lg mb-2" />
              <p className="text-xs font-medium text-gray-900">#FB923C</p>
              <p className="text-xs text-gray-500">Warning (Orange)</p>
            </div>
            <div>
              <div className="w-full h-12 bg-[#DC2626] rounded-lg mb-2" />
              <p className="text-xs font-medium text-gray-900">#DC2626</p>
              <p className="text-xs text-gray-500">Error (Red)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
