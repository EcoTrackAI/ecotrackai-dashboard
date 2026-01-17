/**
 * Hook for managing relay control via Firebase Realtime Database
 * Handles subscribe to relay state and write control commands
 */

import { useEffect, useState, useCallback } from "react";
import { getFirebaseDatabase } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";

interface RelayControlState {
  isLoading: boolean;
  state: boolean | null;
  error: string | null;
}

/**
 * Hook to manage relay state and control
 * @param roomId - The room identifier (e.g., "bedroom")
 * @param relayId - The relay identifier (e.g., "relay1")
 * @returns Current relay state, loading status, error, and control function
 */
export function useRelayControl(roomId: string, relayId: string) {
  const [relayState, setRelayState] = useState<RelayControlState>({
    isLoading: true,
    state: null,
    error: null,
  });

  // Subscribe to relay state from Firebase
  useEffect(() => {
    if (!roomId || !relayId) return;

    const db = getFirebaseDatabase();
    // Construct relay ID from room and relayId (e.g., bedroom_light)
    const fullRelayId = `${roomId}_${relayId}`;
    const relayPath = `relays/${fullRelayId}/state`;
    const relayRef = ref(db, relayPath);

    // Subscribe to real-time updates
    const unsubscribe = onValue(relayRef, (snapshot) => {
      setRelayState({
        isLoading: false,
        state: snapshot.exists() ? Boolean(snapshot.val()) : false,
        error: null,
      });
    });

    return () => unsubscribe();
  }, [roomId, relayId]);

  // Control relay state
  const setRelayStateValue = useCallback(
    async (newState: boolean) => {
      const db = getFirebaseDatabase();
      // Construct relay ID from room and relayId (e.g., bedroom_light)
      const fullRelayId = `${roomId}_${relayId}`;
      const relayPath = `relays/${fullRelayId}/state`;
      await set(ref(db, relayPath), newState);
    },
    [roomId, relayId],
  );

  return {
    ...relayState,
    setRelayState: setRelayStateValue,
  };
}
