import React, { useState, useEffect } from "react";
import { LiveSensorCard, SensorStatus } from "./LiveSensorCard";

/**
 * Example usage of LiveSensorCard component
 * Demonstrates different sensor types, statuses, and real-time updates
 */
export const LiveSensorCardExamples: React.FC = () => {
  const [temperature, setTemperature] = useState(22.5);
  const [humidity, setHumidity] = useState(65);
  const [powerConsumption, setPowerConsumption] = useState(3.45);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate temperature fluctuation
      setTemperature((prev) => prev + (Math.random() - 0.5) * 0.5);

      // Simulate humidity changes
      setHumidity((prev) =>
        Math.max(40, Math.min(80, prev + (Math.random() - 0.5) * 2))
      );

      // Simulate power consumption changes
      setPowerConsumption((prev) =>
        Math.max(0, prev + (Math.random() - 0.5) * 0.3)
      );

      // Update timestamp
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Determine status based on sensor values
  const getTemperatureStatus = (temp: number): SensorStatus => {
    if (temp > 28) return "critical";
    if (temp > 26) return "warning";
    return "normal";
  };

  const getHumidityStatus = (hum: number): SensorStatus => {
    if (hum > 75 || hum < 30) return "critical";
    if (hum > 70 || hum < 40) return "warning";
    return "normal";
  };

  const getPowerStatus = (power: number): SensorStatus => {
    if (power > 5) return "critical";
    if (power > 4) return "warning";
    return "normal";
  };

  const handleSensorClick = (sensorName: string) => {
    console.log(`Clicked on sensor: ${sensorName}`);
    // Navigate to detailed view or open modal
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Live Sensor Monitoring
          </h1>
          <p className="text-gray-600">
            Real-time sensor data with status indicators
          </p>
        </header>

        {/* Grid layout for sensor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Temperature Sensor */}
          <LiveSensorCard
            sensorName="Living Room Temperature"
            currentValue={temperature}
            unit="°C"
            status={getTemperatureStatus(temperature)}
            description="Main living area"
            lastUpdate={lastUpdate}
            onClick={() => handleSensorClick("Living Room Temperature")}
          />

          {/* Humidity Sensor */}
          <LiveSensorCard
            sensorName="Bedroom Humidity"
            currentValue={humidity}
            unit="%"
            status={getHumidityStatus(humidity)}
            description="Master bedroom"
            lastUpdate={lastUpdate}
            onClick={() => handleSensorClick("Bedroom Humidity")}
          />

          {/* Power Consumption */}
          <LiveSensorCard
            sensorName="Total Power Consumption"
            currentValue={powerConsumption}
            unit="kW"
            status={getPowerStatus(powerConsumption)}
            description="Whole house"
            lastUpdate={lastUpdate}
            onClick={() => handleSensorClick("Power Consumption")}
          />

          {/* Normal Status Example */}
          <LiveSensorCard
            sensorName="Kitchen Temperature"
            currentValue={23.2}
            unit="°C"
            status="normal"
            description="Kitchen area"
            lastUpdate={new Date()}
          />

          {/* Warning Status Example */}
          <LiveSensorCard
            sensorName="Garage Humidity"
            currentValue={72}
            unit="%"
            status="warning"
            description="Storage area"
            lastUpdate={new Date(Date.now() - 300000)} // 5 minutes ago
          />

          {/* Critical Status Example */}
          <LiveSensorCard
            sensorName="HVAC Power Draw"
            currentValue={5.8}
            unit="kW"
            status="critical"
            description="Air conditioning system"
            lastUpdate={new Date()}
          />

          {/* Offline Status Example */}
          <LiveSensorCard
            sensorName="Outdoor Temperature"
            currentValue="--"
            unit="°C"
            status="offline"
            description="Weather station"
            lastUpdate={new Date(Date.now() - 3600000)} // 1 hour ago
          />

          {/* Additional sensor examples */}
          <LiveSensorCard
            sensorName="Solar Panel Output"
            currentValue={2.15}
            unit="kW"
            status="normal"
            description="Rooftop array"
            lastUpdate={lastUpdate}
          />

          <LiveSensorCard
            sensorName="Battery Level"
            currentValue={87}
            unit="%"
            status="normal"
            description="Home battery backup"
            lastUpdate={lastUpdate}
          />

          <LiveSensorCard
            sensorName="Water Heater Temp"
            currentValue={54.5}
            unit="°C"
            status="normal"
            description="Hot water system"
            lastUpdate={lastUpdate}
          />

          <LiveSensorCard
            sensorName="Air Quality Index"
            currentValue={45}
            unit="AQI"
            status="normal"
            description="Indoor air quality"
            lastUpdate={lastUpdate}
          />

          <LiveSensorCard
            sensorName="CO2 Level"
            currentValue={680}
            unit="ppm"
            status="warning"
            description="Living room air"
            lastUpdate={lastUpdate}
          />
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Status Indicators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Normal</p>
                <p className="text-xs text-gray-500">Operating within range</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Warning</p>
                <p className="text-xs text-gray-500">Approaching threshold</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-gray-900">Critical</p>
                <p className="text-xs text-gray-500">
                  Immediate attention needed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Offline</p>
                <p className="text-xs text-gray-500">No connection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSensorCardExamples;
