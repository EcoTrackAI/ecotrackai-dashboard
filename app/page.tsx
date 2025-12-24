import { MetricCard } from "@/components/metrics";
import { RoomStatusCard } from "@/components/rooms";
import { AutomationActivityItem } from "@/components/automation";
import { LiveSensorCard, SensorStatus } from "@/components/sensors";

export default function Home() {
  // In production, this would come from Firebase/API
  const mockData = {
    metrics: {
      currentPower: 4.2,
      powerTrend: { direction: "up" as const, value: 8.3 },
      dailyEnergy: 87.5,
      energyTrend: { direction: "down" as const, value: 12.4 },
      todayCost: 24.85,
      costTrend: { direction: "up" as const, value: 3.2 },
      monthlySavings: 248,
      savingsTrend: { direction: "up" as const, value: 15.7, isPositive: true },
    },
    sensors: [
      {
        sensorName: "Living Room Temperature",
        currentValue: 22.5,
        unit: "°C",
        status: "normal" as SensorStatus,
        description: "Main living area",
        lastUpdate: new Date(Date.now() - 45000), // 45 seconds ago
      },
      {
        sensorName: "Bedroom Humidity",
        currentValue: 68,
        unit: "%",
        status: "normal" as SensorStatus,
        description: "Master bedroom",
        lastUpdate: new Date(Date.now() - 30000), // 30 seconds ago
      },
      {
        sensorName: "Total Power Consumption",
        currentValue: 4.2,
        unit: "kW",
        status: "warning" as SensorStatus,
        description: "Whole house",
        lastUpdate: new Date(Date.now() - 15000), // 15 seconds ago
      },
      {
        sensorName: "Kitchen Temperature",
        currentValue: 23.8,
        unit: "°C",
        status: "normal" as SensorStatus,
        description: "Kitchen area",
        lastUpdate: new Date(Date.now() - 60000), // 1 minute ago
      },
      {
        sensorName: "HVAC Power Draw",
        currentValue: 2.8,
        unit: "kW",
        status: "normal" as SensorStatus,
        description: "Air conditioning system",
        lastUpdate: new Date(Date.now() - 20000), // 20 seconds ago
      },
      {
        sensorName: "Solar Panel Output",
        currentValue: 3.15,
        unit: "kW",
        status: "normal" as SensorStatus,
        description: "Rooftop array",
        lastUpdate: new Date(Date.now() - 10000), // 10 seconds ago
      },
      {
        sensorName: "Battery Level",
        currentValue: 87,
        unit: "%",
        status: "normal" as SensorStatus,
        description: "Home battery backup",
        lastUpdate: new Date(Date.now() - 90000), // 1.5 minutes ago
      },
      {
        sensorName: "Water Heater Temp",
        currentValue: 54.5,
        unit: "°C",
        status: "normal" as SensorStatus,
        description: "Hot water system",
        lastUpdate: new Date(Date.now() - 120000), // 2 minutes ago
      },
      {
        sensorName: "Office Air Quality",
        currentValue: 45,
        unit: "AQI",
        status: "normal" as SensorStatus,
        description: "Indoor air quality",
        lastUpdate: new Date(Date.now() - 40000), // 40 seconds ago
      },
      {
        sensorName: "Garage Motion Sensor",
        currentValue: "--",
        unit: "",
        status: "offline" as SensorStatus,
        description: "Motion detector",
        lastUpdate: new Date(Date.now() - 3600000), // 1 hour ago
      },
    ],
    rooms: [
      {
        name: "Living Room",
        isOccupied: true,
        activeDevices: 5,
        totalDevices: 8,
        currentPower: 850,
        temperature: 22,
      },
      {
        name: "Kitchen",
        isOccupied: false,
        activeDevices: 2,
        totalDevices: 6,
        currentPower: 320,
        temperature: 21,
      },
      {
        name: "Bedroom",
        isOccupied: true,
        activeDevices: 3,
        totalDevices: 5,
        currentPower: 180,
        temperature: 20,
      },
      {
        name: "Office",
        isOccupied: true,
        activeDevices: 4,
        totalDevices: 7,
        currentPower: 420,
        temperature: 23,
      },
      {
        name: "Bathroom",
        isOccupied: false,
        activeDevices: 1,
        totalDevices: 3,
        currentPower: 45,
      },
      {
        name: "Garage",
        isOccupied: false,
        activeDevices: 0,
        totalDevices: 4,
        currentPower: 0,
      },
    ],
    automationActivity: [
      {
        title: "AC turned off in bedroom",
        description: "No occupancy detected for 15 minutes",
        timestamp: "2 min ago",
        status: "success" as const,
      },
      {
        title: "Peak hour alert",
        description:
          "Electricity rates increased. Consider reducing consumption.",
        timestamp: "18 min ago",
        status: "warning" as const,
      },
      {
        title: "Living room lights automated",
        description: "Lights dimmed to 60% based on natural light level",
        timestamp: "32 min ago",
        status: "info" as const,
      },
      {
        title: "Smart plug disconnected",
        description: "Kitchen coffee maker lost connection",
        timestamp: "1 hour ago",
        status: "error" as const,
      },
      {
        title: "Energy goal achieved",
        description: "Daily consumption target met with 15% buffer",
        timestamp: "2 hours ago",
        status: "success" as const,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Overview Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time energy monitoring and automation insights
          </p>
        </div>

        {/* Metrics Grid */}
        <section aria-labelledby="metrics-heading" className="mb-8">
          <h2 id="metrics-heading" className="sr-only">
            Energy Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Current Power Usage"
              value={mockData.metrics.currentPower}
              unit="kW"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              trend={mockData.metrics.powerTrend}
            />

            <MetricCard
              title="Daily Energy"
              value={mockData.metrics.dailyEnergy}
              unit="kWh"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              trend={mockData.metrics.energyTrend}
            />

            <MetricCard
              title="Today's Cost"
              value={`$${mockData.metrics.todayCost.toFixed(2)}`}
              unit="USD"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              trend={mockData.metrics.costTrend}
            />

            <MetricCard
              title="Monthly Savings"
              value={`$${mockData.metrics.monthlySavings}`}
              unit="saved"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              }
              trend={mockData.metrics.savingsTrend}
            />
          </div>
        </section>

        {/* Live Sensors Section */}
        <section aria-labelledby="sensors-heading" className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2
              id="sensors-heading"
              className="text-xl font-semibold text-[#111827]"
            >
              Live Sensor Monitoring
            </h2>
            <span className="text-sm text-gray-500">
              {mockData.sensors.filter((s) => s.status !== "offline").length}{" "}
              active
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {mockData.sensors.map((sensor, index) => (
              <LiveSensorCard
                key={index}
                sensorName={sensor.sensorName}
                currentValue={sensor.currentValue}
                unit={sensor.unit}
                status={sensor.status}
                description={sensor.description}
                lastUpdate={sensor.lastUpdate}
              />
            ))}
          </div>
        </section>

        {/* Two Column Layout for Rooms and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Status Section */}
          <section aria-labelledby="rooms-heading" className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2
                id="rooms-heading"
                className="text-xl font-semibold text-[#111827]"
              >
                Room Status
              </h2>
              <span className="text-sm text-gray-500">
                {mockData.rooms.filter((r) => r.isOccupied).length} occupied
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockData.rooms.map((room) => (
                <RoomStatusCard
                  key={room.name}
                  roomName={room.name}
                  isOccupied={room.isOccupied}
                  activeDevices={room.activeDevices}
                  totalDevices={room.totalDevices}
                  currentPower={room.currentPower}
                  temperature={room.temperature}
                />
              ))}
            </div>
          </section>

          {/* Automation Activity Section */}
          <section aria-labelledby="activity-heading" className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2
                id="activity-heading"
                className="text-xl font-semibold text-[#111827]"
              >
                Recent Activity
              </h2>
              <button
                className="text-sm font-medium text-[#6366F1] hover:text-[#4F46E5] transition-colors"
                aria-label="View all automation activity"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {mockData.automationActivity.map((activity, index) => (
                <AutomationActivityItem
                  key={index}
                  title={activity.title}
                  description={activity.description}
                  timestamp={activity.timestamp}
                  status={activity.status}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
