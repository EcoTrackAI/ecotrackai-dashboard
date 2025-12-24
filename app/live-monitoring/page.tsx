"use client";

import { useState, useEffect } from "react";
import { LiveSensorCard, SensorStatus } from "@/components/sensors";

interface SensorData {
  id: string;
  sensorName: string;
  currentValue: number | string;
  unit: string;
  status: SensorStatus;
  description: string;
  category: "temperature" | "humidity" | "power" | "environmental" | "system";
}

export default function LiveMonitoringPage() {
  const [sensors, setSensors] = useState<SensorData[]>([
    {
      id: "temp-living",
      sensorName: "Living Room Temperature",
      currentValue: 22.5,
      unit: "°C",
      status: "normal",
      description: "Main living area",
      category: "temperature",
    },
    {
      id: "temp-bedroom",
      sensorName: "Master Bedroom Temperature",
      currentValue: 21.0,
      unit: "°C",
      status: "normal",
      description: "Sleeping area",
      category: "temperature",
    },
    {
      id: "temp-kitchen",
      sensorName: "Kitchen Temperature",
      currentValue: 23.8,
      unit: "°C",
      status: "normal",
      description: "Cooking and dining area",
      category: "temperature",
    },
    {
      id: "temp-office",
      sensorName: "Office Temperature",
      currentValue: 24.2,
      unit: "°C",
      status: "warning",
      description: "Home office workspace",
      category: "temperature",
    },
    {
      id: "temp-outdoor",
      sensorName: "Outdoor Temperature",
      currentValue: 28.5,
      unit: "°C",
      status: "normal",
      description: "Weather station",
      category: "temperature",
    },
    {
      id: "hum-living",
      sensorName: "Living Room Humidity",
      currentValue: 65,
      unit: "%",
      status: "normal",
      description: "Main living area",
      category: "humidity",
    },
    {
      id: "hum-bedroom",
      sensorName: "Bedroom Humidity",
      currentValue: 68,
      unit: "%",
      status: "normal",
      description: "Master bedroom",
      category: "humidity",
    },
    {
      id: "hum-bathroom",
      sensorName: "Bathroom Humidity",
      currentValue: 78,
      unit: "%",
      status: "warning",
      description: "Main bathroom",
      category: "humidity",
    },
    {
      id: "hum-garage",
      sensorName: "Garage Humidity",
      currentValue: 72,
      unit: "%",
      status: "warning",
      description: "Storage area",
      category: "humidity",
    },
    {
      id: "power-total",
      sensorName: "Total Power Consumption",
      currentValue: 4.2,
      unit: "kW",
      status: "warning",
      description: "Whole house",
      category: "power",
    },
    {
      id: "power-hvac",
      sensorName: "HVAC Power Draw",
      currentValue: 2.8,
      unit: "kW",
      status: "normal",
      description: "Air conditioning system",
      category: "power",
    },
    {
      id: "power-kitchen",
      sensorName: "Kitchen Appliances",
      currentValue: 0.65,
      unit: "kW",
      status: "normal",
      description: "Kitchen circuit",
      category: "power",
    },
    {
      id: "power-living",
      sensorName: "Living Room Devices",
      currentValue: 0.85,
      unit: "kW",
      status: "normal",
      description: "Entertainment system",
      category: "power",
    },
    {
      id: "power-solar",
      sensorName: "Solar Panel Output",
      currentValue: 3.15,
      unit: "kW",
      status: "normal",
      description: "Rooftop solar array",
      category: "power",
    },
    {
      id: "power-water-heater",
      sensorName: "Water Heater Power",
      currentValue: 1.2,
      unit: "kW",
      status: "normal",
      description: "Hot water system",
      category: "power",
    },
    {
      id: "env-aqi-office",
      sensorName: "Office Air Quality",
      currentValue: 45,
      unit: "AQI",
      status: "normal",
      description: "Indoor air quality",
      category: "environmental",
    },
    {
      id: "env-aqi-living",
      sensorName: "Living Room Air Quality",
      currentValue: 38,
      unit: "AQI",
      status: "normal",
      description: "Main living area",
      category: "environmental",
    },
    {
      id: "env-co2",
      sensorName: "CO2 Level",
      currentValue: 680,
      unit: "ppm",
      status: "warning",
      description: "Living room air",
      category: "environmental",
    },
    {
      id: "env-light",
      sensorName: "Natural Light Level",
      currentValue: 450,
      unit: "lux",
      status: "normal",
      description: "Window sensor",
      category: "environmental",
    },
    {
      id: "sys-battery",
      sensorName: "Battery Level",
      currentValue: 87,
      unit: "%",
      status: "normal",
      description: "Home battery backup",
      category: "system",
    },
    {
      id: "sys-water-temp",
      sensorName: "Water Heater Temperature",
      currentValue: 54.5,
      unit: "°C",
      status: "normal",
      description: "Hot water tank",
      category: "system",
    },
    {
      id: "sys-water-flow",
      sensorName: "Water Flow Rate",
      currentValue: 0,
      unit: "L/min",
      status: "normal",
      description: "Main water line",
      category: "system",
    },
    {
      id: "sys-motion-garage",
      sensorName: "Garage Motion Sensor",
      currentValue: "--",
      unit: "",
      status: "offline",
      description: "Motion detector",
      category: "system",
    },
    {
      id: "sys-door-front",
      sensorName: "Front Door Sensor",
      currentValue: "Closed",
      unit: "",
      status: "normal",
      description: "Entry monitoring",
      category: "system",
    },
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prevSensors) =>
        prevSensors.map((sensor) => {
          // Don't update offline sensors
          if (sensor.status === "offline") return sensor;

          let newValue = sensor.currentValue;
          let newStatus = sensor.status;

          // Simulate value changes based on category
          if (typeof sensor.currentValue === "number") {
            switch (sensor.category) {
              case "temperature":
                newValue = Number(
                  (
                    (sensor.currentValue as number) +
                    (Math.random() - 0.5) * 0.3
                  ).toFixed(1)
                );
                if (newValue > 26) newStatus = "warning";
                else if (newValue > 28) newStatus = "critical";
                else newStatus = "normal";
                break;

              case "humidity":
                newValue = Math.max(
                  30,
                  Math.min(
                    85,
                    Math.round(
                      (sensor.currentValue as number) +
                        (Math.random() - 0.5) * 2
                    )
                  )
                );
                if (newValue > 75 || newValue < 35) newStatus = "warning";
                else newStatus = "normal";
                break;

              case "power":
                newValue = Math.max(
                  0,
                  Number(
                    (
                      (sensor.currentValue as number) +
                      (Math.random() - 0.5) * 0.2
                    ).toFixed(2)
                  )
                );
                if (sensor.id === "power-total") {
                  if (newValue > 5) newStatus = "critical";
                  else if (newValue > 4) newStatus = "warning";
                  else newStatus = "normal";
                } else {
                  newStatus = "normal";
                }
                break;

              case "environmental":
                if (sensor.id === "env-co2") {
                  newValue = Math.max(
                    400,
                    Math.min(
                      1200,
                      Math.round(
                        (sensor.currentValue as number) +
                          (Math.random() - 0.5) * 20
                      )
                    )
                  );
                  if (newValue > 800) newStatus = "warning";
                  else if (newValue > 1000) newStatus = "critical";
                  else newStatus = "normal";
                } else {
                  newValue = Math.max(
                    0,
                    Math.round(
                      (sensor.currentValue as number) +
                        (Math.random() - 0.5) * 10
                    )
                  );
                }
                break;

              case "system":
                if (sensor.id === "sys-battery") {
                  newValue = Math.max(
                    0,
                    Math.min(
                      100,
                      Math.round(
                        (sensor.currentValue as number) +
                          (Math.random() - 0.5) * 1
                      )
                    )
                  );
                  if (newValue < 20) newStatus = "critical";
                  else if (newValue < 40) newStatus = "warning";
                  else newStatus = "normal";
                }
                break;
            }

            return { ...sensor, currentValue: newValue, status: newStatus };
          }

          return sensor;
        })
      );

      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredSensors =
    selectedCategory === "all"
      ? sensors
      : sensors.filter((s) => s.category === selectedCategory);

  const categoryCounts = {
    all: sensors.length,
    temperature: sensors.filter((s) => s.category === "temperature").length,
    humidity: sensors.filter((s) => s.category === "humidity").length,
    power: sensors.filter((s) => s.category === "power").length,
    environmental: sensors.filter((s) => s.category === "environmental").length,
    system: sensors.filter((s) => s.category === "system").length,
  };

  const activeSensors = sensors.filter((s) => s.status !== "offline").length;
  const warningSensors = sensors.filter((s) => s.status === "warning").length;
  const criticalSensors = sensors.filter((s) => s.status === "critical").length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Live Monitoring
          </h1>
          <p className="text-gray-600">
            Real-time sensor data and device status tracking
          </p>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-sm font-medium text-gray-600">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeSensors}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-gray-600">Warning</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{warningSensors}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span className="text-sm font-medium text-gray-600">
                Critical
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {criticalSensors}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-sm font-medium text-gray-600">Offline</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {sensors.length - activeSensors}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Filter by:
            </span>
            <div className="flex gap-2">
              {(
                Object.keys(categoryCounts) as Array<
                  keyof typeof categoryCounts
                >
              ).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                      px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                      transition-colors
                      ${
                        selectedCategory === category
                          ? "bg-[#6366F1] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                    `}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} (
                  {categoryCounts[category]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sensor Grid */}
        <section aria-labelledby="sensors-heading">
          <div className="flex items-center justify-between mb-6">
            <h2
              id="sensors-heading"
              className="text-xl font-semibold text-[#111827]"
            >
              {selectedCategory === "all"
                ? "All Sensors"
                : `${
                    selectedCategory.charAt(0).toUpperCase() +
                    selectedCategory.slice(1)
                  } Sensors`}
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-1.5 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <circle cx="10" cy="10" r="4" />
              </svg>
              <span>Live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSensors.map((sensor) => (
              <LiveSensorCard
                key={sensor.id}
                sensorName={sensor.sensorName}
                currentValue={sensor.currentValue}
                unit={sensor.unit}
                status={sensor.status}
                description={sensor.description}
                lastUpdate={lastUpdate}
              />
            ))}
          </div>

          {filteredSensors.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No sensors found in this category</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
