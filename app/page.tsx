"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/metrics";
import { RoomStatusCard } from "@/components/rooms";
import { LiveSensorCard } from "@/components/sensors";
import { Zap, Flame, Gauge } from "lucide-react";
import { subscribePZEMData, subscribeRoomSensor } from "@/lib/firebase-sensors";
import { subscribeSystemStatus } from "@/lib/firebase-system-status";
import { initializeFirebase } from "@/lib/firebase";

const STALE_THRESHOLD = 30000;

const isSensorStale = (lastUpdate: string | undefined): boolean => {
  if (!lastUpdate) return true;

  const timestampStr = lastUpdate.includes("Z")
    ? lastUpdate
    : lastUpdate.replace(" ", "T") + "Z";
  const lastUpdateTime = new Date(timestampStr).getTime();
  if (isNaN(lastUpdateTime)) return true;

  const currentTime = Date.now();
  return currentTime - lastUpdateTime >= STALE_THRESHOLD;
};

export default function Home() {
  const [pzem, setPzem] = useState<PZEMData | null>(null);
  const [bedroomData, setBedroomData] = useState<RoomSensorData | null>(null);
  const [livingRoomData, setLivingRoomData] = useState<RoomSensorData | null>(
    null,
  );
  const [deviceStatus, setDeviceStatus] = useState<SystemStatus>("offline");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribePZEM: (() => void) | undefined;
    let unsubscribeBedroom: (() => void) | undefined;
    let unsubscribeLivingRoom: (() => void) | undefined;
    let unsubscribeStatus: (() => void) | undefined;

    try {
      initializeFirebase();

      // Subscribe to device online/offline status
      unsubscribeStatus = subscribeSystemStatus((status) => {
        setDeviceStatus(status);
        setError(null);
      });

      // Subscribe to real-time PZEM data
      unsubscribePZEM = subscribePZEMData((data) => {
        if (data) {
          setPzem(data);
        }
        setLoading(false);
      });

      // Subscribe to real-time bedroom sensor data
      unsubscribeBedroom = subscribeRoomSensor("bedroom", (data) => {
        if (data) {
          setBedroomData(data);
        }
        setLoading(false);
      });

      // Subscribe to real-time living room sensor data
      unsubscribeLivingRoom = subscribeRoomSensor("living_room", (data) => {
        if (data) {
          setLivingRoomData(data);
        }
        setLoading(false);
      });
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Failed to connect to Firebase. Please refresh the page.");
      setLoading(false);
    }

    return () => {
      unsubscribePZEM?.();
      unsubscribeBedroom?.();
      unsubscribeLivingRoom?.();
      unsubscribeStatus?.();
    };
  }, []);

  const getBedroomStatus = (): SensorStatus => {
    if (deviceStatus === "offline") return "offline";
    if (!bedroomData || isSensorStale(bedroomData.updatedAt)) return "offline";
    return "normal";
  };

  const getLivingRoomStatus = (): SensorStatus => {
    if (deviceStatus === "offline") return "offline";
    if (!livingRoomData || isSensorStale(livingRoomData.updatedAt))
      return "offline";
    return "normal";
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
            Real-time energy monitoring and home automation
            {deviceStatus === "offline" && (
              <span className="block text-yellow-600 font-semibold mt-1">
                ⚠️ Device is currently offline
              </span>
            )}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-700">Error</p>
            <p className="text-sm text-red-600">{error}</p>
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
                  value={pzem.power?.toFixed(1) ?? "N/A"}
                  unit="W"
                  icon={<Zap className="w-6 h-6" />}
                />
                <MetricCard
                  title="Total Energy"
                  value={pzem.energy?.toFixed(2) ?? "N/A"}
                  unit="kWh"
                  icon={<Flame className="w-6 h-6" />}
                />
                <MetricCard
                  title="Voltage"
                  value={pzem.voltage?.toFixed(1) ?? "N/A"}
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
                {bedroomData ? (
                  <RoomStatusCard
                    roomName="Bedroom"
                    temperature={bedroomData.temperature ?? 0}
                    humidity={bedroomData.humidity ?? 0}
                    light={bedroomData.light ?? 0}
                    motion={bedroomData.motion ?? false}
                  />
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-gray-500 text-sm">
                      {deviceStatus === "offline"
                        ? "Device is offline - no data available"
                        : "Waiting for bedroom data..."}
                    </p>
                  </div>
                )}
                {livingRoomData ? (
                  <RoomStatusCard
                    roomName="Living Room"
                    temperature={livingRoomData.temperature ?? 0}
                    humidity={livingRoomData.humidity ?? 0}
                    light={livingRoomData.light ?? 0}
                    motion={livingRoomData.motion ?? false}
                  />
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-gray-500 text-sm">
                      {deviceStatus === "offline"
                        ? "Device is offline - no data available"
                        : "Waiting for living room data..."}
                    </p>
                  </div>
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
                      currentValue={
                        bedroomData.temperature?.toFixed(1) ?? "N/A"
                      }
                      unit="°C"
                      status={
                        getBedroomStatus() === "offline"
                          ? "offline"
                          : bedroomData.temperature &&
                              bedroomData.temperature > 28
                            ? "warning"
                            : "normal"
                      }
                      description="Bedroom temperature"
                      lastUpdate={bedroomData.updatedAt}
                    />
                    <LiveSensorCard
                      sensorName="Humidity"
                      currentValue={bedroomData.humidity?.toFixed(0) ?? "N/A"}
                      unit="%"
                      status={getBedroomStatus()}
                      description="Bedroom humidity"
                      lastUpdate={bedroomData.updatedAt}
                    />
                    <LiveSensorCard
                      sensorName="Light"
                      currentValue={bedroomData.light?.toFixed(0) ?? "N/A"}
                      unit="lux"
                      status={getBedroomStatus()}
                      description="Bedroom light"
                      lastUpdate={bedroomData.updatedAt}
                    />
                    <LiveSensorCard
                      sensorName="Motion"
                      currentValue={
                        bedroomData.motion !== undefined
                          ? bedroomData.motion
                            ? "Detected"
                            : "None"
                          : "N/A"
                      }
                      unit=""
                      status={
                        getBedroomStatus() === "offline"
                          ? "offline"
                          : bedroomData.motion
                            ? "warning"
                            : "normal"
                      }
                      description="Bedroom motion"
                      lastUpdate={bedroomData.updatedAt}
                    />
                  </>
                )}
                {livingRoomData && (
                  <>
                    <LiveSensorCard
                      sensorName="Temperature"
                      currentValue={
                        livingRoomData.temperature?.toFixed(1) ?? "N/A"
                      }
                      unit="°C"
                      status={
                        getLivingRoomStatus() === "offline"
                          ? "offline"
                          : livingRoomData.temperature &&
                              livingRoomData.temperature > 28
                            ? "warning"
                            : "normal"
                      }
                      description="Living room temperature"
                      lastUpdate={livingRoomData.updatedAt}
                    />
                    <LiveSensorCard
                      sensorName="Humidity"
                      currentValue={
                        livingRoomData.humidity?.toFixed(0) ?? "N/A"
                      }
                      unit="%"
                      status={getLivingRoomStatus()}
                      description="Living room humidity"
                      lastUpdate={livingRoomData.updatedAt}
                    />
                    <LiveSensorCard
                      sensorName="Light"
                      currentValue={livingRoomData.light?.toFixed(0) ?? "N/A"}
                      unit="lux"
                      status={getLivingRoomStatus()}
                      description="Living room light"
                      lastUpdate={livingRoomData.updatedAt}
                    />
                    <LiveSensorCard
                      sensorName="Motion"
                      currentValue={
                        livingRoomData.motion !== undefined
                          ? livingRoomData.motion
                            ? "Detected"
                            : "None"
                          : "N/A"
                      }
                      unit=""
                      status={
                        getLivingRoomStatus() === "offline"
                          ? "offline"
                          : livingRoomData.motion
                            ? "warning"
                            : "normal"
                      }
                      description="Living room motion"
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
