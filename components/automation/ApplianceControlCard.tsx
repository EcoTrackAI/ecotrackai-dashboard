/**
 * ApplianceControlCard Component
 * Router component that selects the appropriate card based on appliance type
 */

"use client";

import React from "react";
import LightControlCard from "./LightControlCard";
import FanControlCard from "./FanControlCard";
import ACControlCard from "./ACControlCard";

// ApplianceControlCardProps and all types are globally available from types/globals.d.ts

export default function ApplianceControlCard({
  appliance,
  onStatusChange,
  onModeChange,
  onFanSpeedChange,
  onACTemperatureChange,
}: ApplianceControlCardProps) {
  // Route to appropriate card based on appliance type
  switch (appliance.type) {
    case "light":
      return (
        <LightControlCard
          appliance={appliance}
          onStatusChange={onStatusChange}
          onModeChange={onModeChange}
        />
      );
    case "fan":
      return (
        <FanControlCard
          appliance={appliance}
          onStatusChange={onStatusChange}
          onFanSpeedChange={onFanSpeedChange}
          onModeChange={onModeChange}
        />
      );
    case "air_conditioner":
      return (
        <ACControlCard
          appliance={appliance}
          onStatusChange={onStatusChange}
          onACTemperatureChange={onACTemperatureChange}
          onModeChange={onModeChange}
        />
      );
    default:
      // Generic card for unknown types
      return (
        <LightControlCard
          appliance={appliance}
          onStatusChange={onStatusChange}
          onModeChange={onModeChange}
        />
      );
  }
}
