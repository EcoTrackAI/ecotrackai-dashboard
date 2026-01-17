"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/metrics";
import { RoomStatusCard } from "@/components/rooms";
import { LiveSensorCard } from "@/components/sensors";
import { Zap, Flame, Gauge } from "lucide-react";
import { subscribePZEMData, subscribeRoomSensor } from "@/lib/firebase-sensors";
import { initializeFirebase } from "@/lib/firebase";

export default function Home() {
  const [pzem, setPzem] = useState<PZEMData | null>(null);
  const [bedroomData, setBedroomData] = useState<RoomSensorData | null>(null);
  const [livingRoomData, setLivingRoomData] = useState<RoomSensorData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      initializeFirebase();
    } catch (err) {
      console.error("Failed to initialize Firebase:", err);
      setTimeout(() => {
        setError("Failed to connect to Firebase");
        setLoading(false);
      }, 0);
      return;
    }

    const unsubscribePZEM = subscribePZEMData((data) => {
      setPzem(data);
      setLoading(false);
    });

    const unsubscribeBedroom = subscribeRoomSensor("bedroom", (data) => {
      setBedroomData(data);
      setLoading(false);
    });

    const unsubscribeLivingRoom = subscribeRoomSensor("living_room", (data) => {
      setLivingRoomData(data);
      setLoading(false);
    });

    return () => {
      unsubscribePZEM();
      unsubscribeBedroom();
      unsubscribeLivingRoom();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Overview Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time energy monitoring and home automation
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Key Metrics Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            Power Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading || !pzem ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <span className="text-sm text-gray-600 bg-gray-200 rounded w-24 h-4"></span>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <p className="text-xs text-gray-500 mt-2">Loading...</p>
                  </div>
                ))}
              </>
            ) : (
              <>
                <MetricCard
                  title="Current Power"
                  value={pzem.power.toFixed(1)}
                  unit="W"
                  icon={<Zap className="w-6 h-6" />}
                />
                <MetricCard
                  title="Total Energy"
                  value={pzem.energy.toFixed(2)}
                  unit="kWh"
                  icon={<Flame className="w-6 h-6" />}
                />
                <MetricCard
                  title="Voltage"
                  value={pzem.voltage.toFixed(1)}
                  unit="V"
                  icon={<Gauge className="w-6 h-6" />}
                />
              </>
            )}
          </div>
        </section>

        {/* Room Status Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            Room Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {bedroomData && (
                  <RoomStatusCard
                    roomName="Bedroom"
                    temperature={bedroomData.temperature}
                    humidity={bedroomData.humidity}
                    light={bedroomData.light}
                    motion={bedroomData.motion}
                  />
                )}
                {livingRoomData && (
                  <RoomStatusCard
                    roomName="Living Room"
                    temperature={livingRoomData.temperature}
                    humidity={livingRoomData.humidity}
                    light={livingRoomData.light}
                    motion={livingRoomData.motion}
                  />
                )}
              </>
            )}
          </div>
        </section>

        {/* Live Sensors Section */}
        <section>
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            Live Sensors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
                  >
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {bedroomData && (
                  <>
                    <LiveSensorCard
                      sensorName="Temperature"
                      currentValue={bedroomData.temperature.toFixed(1)}
                      unit="°C"
                      status={
                        bedroomData.temperature > 28 ? "warning" : "normal"
                      }
                      description="Bedroom temperature"
                      lastUpdate={bedroomData.updatedAt}
                    />
                    <LiveSensorCard
                      sensorName="Humidity"
                      currentValue={bedroomData.humidity.toFixed(0)}
                      unit="%"
                      status="normal"
                      description="Bedroom humidity"
                      lastUpdate={bedroomData.updatedAt}
                    />
                    <LiveSensorCard
                      sensorName="Light"
                      currentValue={bedroomData.light.toFixed(0)}
                      unit="lux"
                      status="normal"
                      description="Bedroom light"
                      lastUpdate={bedroomData.updatedAt}
                    />
                    <LiveSensorCard
                      sensorName="Motion"
                      currentValue={bedroomData.motion ? "Detected" : "None"}
                      unit=""
                      status={bedroomData.motion ? "warning" : "normal"}
                      description="Bedroom motion"
                      lastUpdate={bedroomData.updatedAt}
                    />
                  </>
                )}
                {livingRoomData && (
                  <>
                    <LiveSensorCard
                      sensorName="Temperature"
                      currentValue={livingRoomData.temperature.toFixed(1)}
                      unit="°C"
                      status={
                        livingRoomData.temperature > 28 ? "warning" : "normal"
                      }
                      description="Living room temperature"
                      lastUpdate={livingRoomData.updatedAt}
                    />
                    <LiveSensorCard
                      sensorName="Humidity"
                      currentValue={livingRoomData.humidity.toFixed(0)}
                      unit="%"
                      status="normal"
                      description="Living room humidity"
                      lastUpdate={livingRoomData.updatedAt}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
