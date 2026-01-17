"use client";

import { useState, useCallback } from "react";
import LightControlCard from "./LightControlCard";
import FanControlCard from "./FanControlCard";
import ACControlCard from "./ACControlCard";

export default function ApplianceControlCard({
  name,
  type,
  room,
}: ApplianceControlCardProps) {
  const [status, setStatus] = useState<ApplianceStatus>("off");
  const [controlMode, setControlMode] = useState<ControlMode>("manual");
  const [fanSpeed, setFanSpeed] = useState(3);
  const [acTemp, setAcTemp] = useState(22);
  const [acMode] = useState<"cool" | "heat" | "fan" | "dry">("cool");

  const appliance: Appliance = {
    id: `${room}_${type}`,
    name,
    type: type === "ac" ? "air_conditioner" : type,
    room: room === "bedroom" ? "Bedroom" : "Living Room",
    roomId: room,
    status,
    controlMode,
    powerRating: 100,
    isOnline: true,
    settings: {
      fan: { speed: fanSpeed },
      ac: { temperature: acTemp, mode: acMode },
    },
  };

  const handleStatusChange = useCallback(
    (id: string, newStatus: ApplianceStatus) => setStatus(newStatus),
    [],
  );
  const handleModeChange = useCallback(
    (id: string, newMode: ControlMode) => setControlMode(newMode),
    [],
  );
  const handleFanSpeedChange = useCallback(
    (id: string, speed: number) => setFanSpeed(speed),
    [],
  );
  const handleACTemperatureChange = useCallback(
    (id: string, temperature: number) => setAcTemp(temperature),
    [],
  );

  switch (type) {
    case "light":
      return (
        <LightControlCard
          appliance={appliance}
          onStatusChange={handleStatusChange}
          onModeChange={handleModeChange}
        />
      );
    case "fan":
      return (
        <FanControlCard
          appliance={appliance}
          onStatusChange={handleStatusChange}
          onFanSpeedChange={handleFanSpeedChange}
          onModeChange={handleModeChange}
        />
      );
    case "ac":
      return (
        <ACControlCard
          appliance={appliance}
          onStatusChange={handleStatusChange}
          onACTemperatureChange={handleACTemperatureChange}
          onModeChange={handleModeChange}
        />
      );
    default:
      return (
        <LightControlCard
          appliance={appliance}
          onStatusChange={handleStatusChange}
          onModeChange={handleModeChange}
        />
      );
  }
}
