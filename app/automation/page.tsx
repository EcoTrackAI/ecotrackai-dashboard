"use client";

import ApplianceControlCard from "@/components/automation/ApplianceControlCard";
import { MetricCard } from "@/components/metrics";
import { initializeFirebase } from "@/lib/firebase";
import { setRelayState } from "@/lib/firebase-relay";
import { subscribePZEMData, subscribeRoomSensor } from "@/lib/firebase-sensors";
import { useEffect, useState } from "react";
import { Zap, Flame, Gauge } from "lucide-react";

type RelayRoom = "bedroom" | "living_room";

const ROOMS: RelayRoom[] = ["bedroom", "living_room"];
const ROOM_RELAY_TYPES = ["light", "fan", "ac"] as const;

const ROOM_LABELS: Record<RelayRoom, string> = {
  bedroom: "Bedroom",
  living_room: "Living Room",
};

const ROOM_CONTROL_MODE_STORAGE_KEY = "automation_room_control_mode";

type RelaySyncState = {
  motion: number | null;
  relayState: boolean | null;
  timestamp: string | null;
  loading: boolean;
  error: string | null;
};

const INITIAL_ROOM_SENSORS: Record<RelayRoom, RoomSensorData | null> = {
  bedroom: null,
  living_room: null,
};

const INITIAL_ROOM_CONTROL_MODE: Record<RelayRoom, ControlMode> = {
  bedroom: "manual",
  living_room: "manual",
};

const INITIAL_RELAY_SYNC: Record<RelayRoom, RelaySyncState> = {
  bedroom: {
    motion: null,
    relayState: null,
    timestamp: null,
    loading: false,
    error: null,
  },
  living_room: {
    motion: null,
    relayState: null,
    timestamp: null,
    loading: false,
    error: null,
  },
};

const formatBackendTimestamp = (timestamp: string | null): string => {
  if (!timestamp) return "Waiting for update";
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) return timestamp;
  return parsed.toLocaleString();
};

const isControlMode = (value: unknown): value is ControlMode =>
  value === "auto" || value === "manual";

const getPersistedRoomControlMode = (): Record<RelayRoom, ControlMode> => {
  if (typeof window === "undefined") return INITIAL_ROOM_CONTROL_MODE;

  try {
    const raw = window.localStorage.getItem(ROOM_CONTROL_MODE_STORAGE_KEY);
    if (!raw) return INITIAL_ROOM_CONTROL_MODE;

    const parsed = JSON.parse(raw) as Partial<Record<RelayRoom, unknown>>;
    const nextMode: Record<RelayRoom, ControlMode> = {
      ...INITIAL_ROOM_CONTROL_MODE,
    };

    ROOMS.forEach((room) => {
      const candidate = parsed[room];
      if (isControlMode(candidate)) {
        nextMode[room] = candidate;
      }
    });

    return nextMode;
  } catch {
    return INITIAL_ROOM_CONTROL_MODE;
  }
};

export default function AutomationPage() {
  const [pzem, setPzem] = useState<PZEMData | null>(null);
  const [loading, setLoading] = useState(true);
  const [roomSensors, setRoomSensors] =
    useState<Record<RelayRoom, RoomSensorData | null>>(INITIAL_ROOM_SENSORS);
  const [roomControlMode, setRoomControlMode] = useState<
    Record<RelayRoom, ControlMode>
  >(INITIAL_ROOM_CONTROL_MODE);
  const [hasLoadedPersistedMode, setHasLoadedPersistedMode] = useState(false);
  const [relaySync, setRelaySync] =
    useState<Record<RelayRoom, RelaySyncState>>(INITIAL_RELAY_SYNC);
  const bedroomMotion = roomSensors.bedroom?.motion;
  const livingRoomMotion = roomSensors.living_room?.motion;
  const bedroomControlMode = roomControlMode.bedroom;
  const livingRoomControlMode = roomControlMode.living_room;

  const getRoomPolicyDetails = (room: RelayRoom): ApplianceAutomationInfo => {
    const sensor = roomSensors[room];
    const syncState = relaySync[room];
    const isAutoMode = roomControlMode[room] === "auto";

    const motionFromFirebase =
      typeof sensor?.motion === "boolean"
        ? sensor.motion
          ? "Detected (1)"
          : "No Motion (0)"
        : "Waiting for sensor data";

    const relayAction = !isAutoMode
      ? "Manual mode: automation skipped"
      : syncState.motion === null
        ? "--"
        : syncState.motion === 0
          ? "Auto + no motion: forced OFF"
          : "Auto + motion: kept previous state";

    const relayStateSnapshot =
      syncState.relayState === null
        ? "--"
        : syncState.relayState
          ? "ON"
          : "OFF";

    return {
      motionFromFirebase,
      controlMode: isAutoMode ? "Auto" : "Manual",
      relayAction,
      relayStateSnapshot,
      syncStatus: syncState.loading ? "Syncing..." : "Synced",
      lastPolicyUpdate: formatBackendTimestamp(syncState.timestamp),
      error: syncState.error,
    };
  };

  useEffect(() => {
    try {
      initializeFirebase();
    } catch {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const unsubscribePzem = subscribePZEMData((data) => {
      setPzem(data);
      setLoading(false);
    });

    const unsubscribeBedroom = subscribeRoomSensor("bedroom", (data) => {
      setRoomSensors((prev) => ({ ...prev, bedroom: data }));
    });

    const unsubscribeLivingRoom = subscribeRoomSensor("living_room", (data) => {
      setRoomSensors((prev) => ({ ...prev, living_room: data }));
    });

    return () => {
      unsubscribePzem?.();
      unsubscribeBedroom?.();
      unsubscribeLivingRoom?.();
    };
  }, []);

  useEffect(() => {
    setRoomControlMode(getPersistedRoomControlMode());
    setHasLoadedPersistedMode(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedPersistedMode) return;

    try {
      window.localStorage.setItem(
        ROOM_CONTROL_MODE_STORAGE_KEY,
        JSON.stringify(roomControlMode),
      );
    } catch {
      // Ignore storage write failures.
    }
  }, [roomControlMode, hasLoadedPersistedMode]);

  useEffect(() => {
    let cancelled = false;
    const motionByRoom: Record<RelayRoom, boolean | undefined> = {
      bedroom: bedroomMotion,
      living_room: livingRoomMotion,
    };
    const modeByRoom: Record<RelayRoom, ControlMode> = {
      bedroom: bedroomControlMode,
      living_room: livingRoomControlMode,
    };

    const applyMotionPolicy = async (room: RelayRoom, motion: boolean) => {
      const controlMode = modeByRoom[room];
      const motionValue = motion ? 1 : 0;

      if (controlMode !== "auto") {
        setRelaySync((prev) => ({
          ...prev,
          [room]: {
            ...prev[room],
            motion: motionValue,
            loading: false,
            error: null,
          },
        }));

        return;
      }

      if (!motion) {
        setRelaySync((prev) => ({
          ...prev,
          [room]: {
            ...prev[room],
            motion: 0,
            loading: true,
            error: null,
          },
        }));

        try {
          await Promise.all(
            ROOM_RELAY_TYPES.map((relayType) =>
              setRelayState(`${room}_${relayType}`, false),
            ),
          );

          if (cancelled) return;

          setRelaySync((prev) => ({
            ...prev,
            [room]: {
              ...prev[room],
              motion: 0,
              relayState: false,
              timestamp: new Date().toISOString(),
              loading: false,
              error: null,
            },
          }));
        } catch (error: unknown) {
          if (cancelled) return;

          setRelaySync((prev) => ({
            ...prev,
            [room]: {
              ...prev[room],
              loading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to turn off relays",
            },
          }));
        }

        return;
      }

      if (cancelled) return;

      // Motion detected: keep existing relay state unchanged.
      setRelaySync((prev) => ({
        ...prev,
        [room]: {
          ...prev[room],
          motion: 1,
          loading: false,
          error: null,
        },
      }));
    };

    ROOMS.forEach((room) => {
      const motion = motionByRoom[room];
      if (typeof motion !== "boolean") return;

      void applyMotionPolicy(room, motion);
    });

    return () => {
      cancelled = true;
    };
  }, [
    bedroomMotion,
    livingRoomMotion,
    bedroomControlMode,
    livingRoomControlMode,
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Automation Control
          </h1>
          <p className="text-[#6B7280]">
            Monitor power consumption and manually control smart devices.
          </p>
        </div>

        {/* Power Metrics */}
        {!loading && pzem && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">
              Power Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          </section>
        )}

        {/* Appliance Controls */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            Smart Appliances
          </h2>
          <div className="space-y-4">
            <ApplianceControlCard
              name="Bedroom Light"
              type="light"
              room="bedroom"
              controlMode={roomControlMode.bedroom}
              automationInfo={getRoomPolicyDetails("bedroom")}
              onControlModeChange={(room, mode) => {
                setRoomControlMode((prev) => ({ ...prev, [room]: mode }));
              }}
            />
            <ApplianceControlCard
              name="Living Room Light"
              type="light"
              room="living_room"
              controlMode={roomControlMode.living_room}
              automationInfo={getRoomPolicyDetails("living_room")}
              onControlModeChange={(room, mode) => {
                setRoomControlMode((prev) => ({ ...prev, [room]: mode }));
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
