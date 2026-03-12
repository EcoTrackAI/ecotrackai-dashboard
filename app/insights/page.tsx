"use client";

import { useEffect, useState } from "react";
import { MLRecommendationCard } from "@/components/recommendations";
import { subscribeRoomSensor } from "@/lib/firebase-sensors";

const ROOMS = ["bedroom", "living_room"] as const;

const formatRoomName = (room: string): string => {
  return room
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getTimePeriod = (
  hour: number,
): "morning" | "afternoon" | "evening" | "night" => {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

const createPlaceholderRecommendation = (room: string): MLRecommendation => ({
  id: room,
  title: `${formatRoomName(room)} AI Recommendation`,
  description:
    "Press Generate Recommendation to fetch the latest ML insight for this room.",
  inputs: {},
  action: {
    type: "adjust",
    target: formatRoomName(room),
    parameters: { room },
  },
  timestamp: new Date(),
  category: "energy-savings",
});

const mapModelToRecommendation = (
  room: string,
  mlRec: MLModelRecommendation,
): MLRecommendation => ({
  id: room,
  title: `${formatRoomName(room)} AI Recommendation`,
  description: mlRec.recommendation,
  inputs: {
    weather: {
      temperature: mlRec.forecast_data.outdoor_temp,
      condition: "Outdoor conditions",
    },
    timeOfDay: {
      hour: mlRec.forecast_data.hour,
      period: getTimePeriod(mlRec.forecast_data.hour),
    },
    sensorData: {
      temp: mlRec.sensor_data.temp,
      humidity: mlRec.sensor_data.humidity,
      light: mlRec.sensor_data.light,
      motion: mlRec.sensor_data.motion,
    },
    forecastData: {
      currentIndoorTemp: mlRec.forecast_data.current_indoor_temp,
      predictedIndoorTemp: mlRec.forecast_data.predicted_indoor_temp,
      outdoorTemp: mlRec.forecast_data.outdoor_temp,
      tempDifference: mlRec.forecast_data.temp_difference,
      currentHumidity: mlRec.forecast_data.current_humidity,
      predictedHumidity: mlRec.forecast_data.predicted_humidity,
      outdoorHumidity: mlRec.forecast_data.outdoor_humidity,
      humidityDifference: mlRec.forecast_data.humidity_difference,
      hour: mlRec.forecast_data.hour,
    },
  },
  action: {
    type: "adjust",
    target: formatRoomName(room),
    parameters: { room },
  },
  timestamp: new Date(mlRec.forecast_data.timestamp),
  category: "energy-savings",
});

export default function InsightsPage() {
  const [recommendations, setRecommendations] = useState<MLRecommendation[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingRecommendationId, setGeneratingRecommendationId] = useState<
    string | null
  >(null);
  const [roomsOnline, setRoomsOnline] = useState<Record<string, boolean>>({
    bedroom: false,
    living_room: false,
  });

  useEffect(() => {
    const unsubscribers: Array<() => void> = [];

    ROOMS.forEach((room) => {
      const unsubscribe = subscribeRoomSensor(room, (data) => {
        setRoomsOnline((prev) => ({
          ...prev,
          [room]: data !== null && data.updatedAt !== undefined,
        }));
      });
      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  useEffect(() => {
    const onlineRooms = Object.entries(roomsOnline)
      .filter(([_, isOnline]) => isOnline)
      .map(([room, _]) => room);

    setRecommendations((prev) => {
      const existingByRoom = new Map(
        prev
          .map((recommendation) => {
            const room = recommendation.action.parameters?.room;
            return typeof room === "string" ? [room, recommendation] : null;
          })
          .filter(
            (
              entry,
            ): entry is [string, MLRecommendation] => entry !== null,
          ),
      );

      return onlineRooms.map(
        (room) => existingByRoom.get(room) ?? createPlaceholderRecommendation(room),
      );
    });
  }, [roomsOnline]);

  const handleGenerate = async (recommendationId: string) => {
    const selectedRecommendation = recommendations.find(
      (recommendation) => recommendation.id === recommendationId,
    );
    const room = selectedRecommendation?.action.parameters?.room;

    if (typeof room !== "string") {
      setError("Unable to determine room for recommendation generation.");
      return;
    }

    if (generatingRecommendationId) return;

    try {
      setError(null);
      setLoading(true);
      setGeneratingRecommendationId(recommendationId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ML_API_BASE_URL}/recommend?room=${room}`,
      );

      if (!response.ok) {
        throw new Error("Failed to generate recommendation");
      }

      const mlRec: MLModelRecommendation = await response.json();
      const updatedRecommendation = mapModelToRecommendation(room, mlRec);

      setRecommendations((prev) =>
        prev.map((recommendation) =>
          recommendation.id === recommendationId
            ? updatedRecommendation
            : recommendation,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error while generating recommendation",
      );
    } finally {
      setLoading(false);
      setGeneratingRecommendationId(null);
    }
  };

  const onlineRoomCount = Object.values(roomsOnline).filter(Boolean).length;
  const generatedRecommendationCount = recommendations.filter(
    (recommendation) => recommendation.inputs.forecastData !== undefined,
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            ML Insights
          </h1>
          <p className="text-gray-600">
            AI-powered AC optimization recommendations based on real-time data
            analysis.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800">Error: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">
              Active Recommendations
            </div>
            <div className="text-2xl font-bold text-[#111827]">
              {generatedRecommendationCount}
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
                loading
                  ? "text-[#2563EB]"
                  : onlineRoomCount > 0
                    ? "text-[#16A34A]"
                    : "text-red-600"
              }`}
            >
              {loading ? "Generating..." : onlineRoomCount > 0 ? "Active" : "Idle"}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600">
                {onlineRoomCount === 0
                  ? "No online rooms detected. Please ensure your sensors are connected."
                  : "No recommendation cards available at this time."}
              </p>
            </div>
          ) : (
            recommendations.map((recommendation) => (
              <MLRecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onGenerate={handleGenerate}
                isGenerating={generatingRecommendationId === recommendation.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
