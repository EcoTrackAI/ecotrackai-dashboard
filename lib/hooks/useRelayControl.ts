/**
 * Hook for managing relay control via Firebase Realtime Database
 * Handles subscribe to relay state and write control commands
 * Firebase path format: /{room}_{relay_type}/state (e.g., bedroom_light/state)
 */

import { useEffect, useState, useCallback } from "react";
import { subscribeRelayState, setRelayState } from "@/lib/firebase-relay";

interface RelayControlState {
  isLoading: boolean;
  state: boolean | null;
  error: string | null;
}

/**
 * Hook to manage relay state and control
 * @param roomId - The room identifier (e.g., "bedroom")
 * @param relayType - The relay type (e.g., "light", "fan", "ac")
 * @returns Current relay state, loading status, error, and control function
 */
export function useRelayControl(roomId: string, relayType: string) {
  const [relayState, setRelayStateInternal] = useState<RelayControlState>({
    isLoading: true,
    state: null,
    error: null,
  });

  // Subscribe to relay state from Firebase
  useEffect(() => {
    if (!roomId || !relayType) return;

    // Construct full relay ID (e.g., bedroom_light)
    const fullRelayId = `${roomId}_${relayType}`;

    // Subscribe to real-time updates
    const unsubscribe = subscribeRelayState(fullRelayId, (state) => {
      setRelayStateInternal({
        isLoading: false,
        state: state,
        error: null,
      });
    });

    return () => unsubscribe();
  }, [roomId, relayType]);

  // Control relay state
  const setRelayStateValue = useCallback(
    async (newState: boolean) => {
      const fullRelayId = `${roomId}_${relayType}`;
      await setRelayState(fullRelayId, newState);
    },
    [roomId, relayType],
  );

  return {
    ...relayState,
    setRelayState: setRelayStateValue,
  };
}
