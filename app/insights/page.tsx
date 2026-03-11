"use client";

import { useEffect, useState, useCallback } from "react";
import { MLRecommendationCard } from "@/components/recommendations";
import {
  fetchLiveSensorData,
  fetchRecommendation,
} from "@/lib/autocontrol-api";
import { Thermometer, Droplets, Sun, Activity } from "lucide-react";

const ROOMS = ["bedroom", "living_room"] as const;

const formatRoomName = (room: string): string => {
  return room
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function InsightsPage() {
  const [recommendations, setRecommendations] = useState<MLRecommendation[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState<
    Record<string, AutoControlLiveData | null>
  >({});
  const [roomsOnline, setRoomsOnline] = useState<Record<string, boolean>>({
    bedroom: false,
    living_room: false,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch live sensor data for all rooms to determine online status
      const liveResults: Record<string, AutoControlLiveData | null> = {};
      const onlineStatus: Record<string, boolean> = {};

      await Promise.all(
        ROOMS.map(async (room) => {
          try {
            const data = await fetchLiveSensorData(room);
            liveResults[room] = data;
            onlineStatus[room] = true;
          } catch {
            liveResults[room] = null;
            onlineStatus[room] = false;
          }
        }),
      );

      setLiveData(liveResults);
      setRoomsOnline(onlineStatus);

      // Fetch recommendations for online rooms
      const onlineRooms = Object.entries(onlineStatus)
        .filter(([, isOnline]) => isOnline)
        .map(([room]) => room);

      if (onlineRooms.length === 0) {
        setRecommendations([]);
        return;
      }

      const recs: MLRecommendation[] = [];

      for (const room of onlineRooms) {
        try {
          const autoRec = await fetchRecommendation(room);

          const recommendation: MLRecommendation = {
            id: `${room}-${Date.now()}`,
            title: `${formatRoomName(room)} Optimization`,
            description: autoRec.recommendation,
            inputs: {
              weather: {
                temperature: autoRec.forecast_data.outdoor_temp,
                condition: `Indoor: ${autoRec.forecast_data.current_indoor_temp.toFixed(1)}°C → Predicted: ${autoRec.forecast_data.predicted_indoor_temp.toFixed(1)}°C`,
              },
              occupancy: {
                current: autoRec.sensor_data.motion ? 1 : 0,
                predicted: autoRec.forecast_data.motion ? 1 : 0,
              },
              timeOfDay: {
                hour: autoRec.forecast_data.hour,
                period:
                  autoRec.forecast_data.hour < 6
                    ? "night"
                    : autoRec.forecast_data.hour < 12
                      ? "morning"
                      : autoRec.forecast_data.hour < 18
                        ? "afternoon"
                        : "evening",
              },
            },
            action: {
              type: "adjust",
              target: formatRoomName(room),
              parameters: {
                predicted_temp:
                  autoRec.forecast_data.predicted_indoor_temp,
                outdoor_temp: autoRec.forecast_data.outdoor_temp,
              },
            },
            timestamp: new Date(),
            category: "ac-optimization",
            potentialSavings: {
              amount: Math.abs(
                autoRec.forecast_data.temp_difference,
              ) > 2
                ? 15
                : 8,
              unit: "percentage",
            },
          };

          recs.push(recommendation);
        } catch {
          // Skip rooms where recommendation fails
        }
      }

      setRecommendations(recs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleApply = async (recommendationId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleIgnore = async (recommendationId: string) => {
    setRecommendations((prev) =>
      prev.filter((rec) => rec.id !== recommendationId),
    );
  };

  const onlineRoomCount = Object.values(roomsOnline).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            ML Insights
          </h1>
          <p className="text-gray-600">
            AI-powered optimization recommendations based on real-time sensor
            data and predictive models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">
              Active Recommendations
            </div>
            <div className="text-2xl font-bold text-[#111827]">
              {recommendations.length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Online Rooms</div>
            <div className="text-2xl font-bold text-[#111827]">
              {onlineRoomCount}/{ROOMS.length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <div
              className={`text-2xl font-bold ${
                onlineRoomCount > 0 ? "text-[#16A34A]" : "text-red-600"
              }`}
            >
              {loading
                ? "Loading..."
                : onlineRoomCount > 0
                  ? "Active"
                  : "Idle"}
            </div>
          </div>
        </div>

        {/* Live Sensor Summary */}
        {Object.entries(liveData).some(([, d]) => d !== null) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">
              Current Sensor Readings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROOMS.map((room) => {
                const data = liveData[room];
                if (!data) return null;
                return (
                  <div
                    key={room}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      {formatRoomName(room)}
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center">
                        <Thermometer className="w-4 h-4 text-red-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-gray-900">
                          {data.sensor.temp.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500">°C</p>
                      </div>
                      <div className="text-center">
                        <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-gray-900">
                          {data.sensor.humidity.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500">%</p>
                      </div>
                      <div className="text-center">
                        <Sun className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-gray-900">
                          {data.sensor.light.toFixed(0)}
                        </p>
                        <p className="text-xs text-gray-500">lux</p>
                      </div>
                      <div className="text-center">
                        <Activity className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                        <p
                          className={`text-lg font-bold ${data.sensor.motion ? "text-green-600" : "text-gray-400"}`}
                        >
                          {data.sensor.motion ? "Yes" : "No"}
                        </p>
                        <p className="text-xs text-gray-500">Motion</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600">
                {loading
                  ? "Loading recommendations..."
                  : onlineRoomCount === 0
                    ? "No online rooms detected. Please ensure your sensors are connected."
                    : "No recommendations available at this time."}
              </p>
            </div>
          ) : (
            recommendations.map((recommendation) => (
              <MLRecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onApply={handleApply}
                onIgnore={handleIgnore}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
