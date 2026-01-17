/**
 * Firebase Relay Control Module
 * Handles subscribe and control of relay states from Firebase Realtime Database
 * Firebase structure: firebase_url/bedroom_light/state, firebase_url/living_room_light/state
 */

import { ref, onValue, off, set, get, DataSnapshot } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

// ============================================================================
// Type Definitions
// ============================================================================

interface RelayControl {
  id: string; // Format: bedroom_light, living_room_light
  name: string;
  room: "bedroom" | "living_room";
  state: boolean;
  isOnline: boolean;
}

// ============================================================================
// Relay Subscription Functions
// ============================================================================

/**
 * Subscribe to relay state changes in real-time
 * @param relayId Full relay ID (e.g., "bedroom_light", "living_room_light")
 * @param callback Function to call when state changes
 * @returns Unsubscribe function
 */
export function subscribeRelayState(
  relayId: string,
  callback: (state: boolean | null) => void,
): () => void {
  const database = getFirebaseDatabase();
  const relayRef = ref(database, `relays/${relayId}/state`);

  const listener = (snapshot: DataSnapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback(Boolean(snapshot.val()));
  };

  onValue(relayRef, listener, (error) =>
    console.error(`Relay ${relayId} subscription error:`, error),
  );

  return () => off(relayRef, "value", listener);
}

/**
 * Fetch relay state once
 * @param relayId Full relay ID (e.g., "bedroom_light", "living_room_light")
 * @returns Promise with relay state
 */
export async function fetchRelayState(
  relayId: string,
): Promise<boolean | null> {
  try {
    const database = getFirebaseDatabase();
    const snapshot = await get(ref(database, `relays/${relayId}/state`));
    return snapshot.exists() ? Boolean(snapshot.val()) : null;
  } catch (error) {
    console.error(`Error fetching relay state for ${relayId}:`, error);
    throw error;
  }
}

// ============================================================================
// Relay Control Functions
// ============================================================================

/**
 * Set relay state
 * @param relayId Full relay ID (e.g., "bedroom_light", "living_room_light")
 * @param state New state
 */
export async function setRelayState(
  relayId: string,
  state: boolean,
): Promise<void> {
  try {
    const database = getFirebaseDatabase();
    const relayRef = ref(database, `relays/${relayId}/state`);
    await set(relayRef, state);
  } catch (error) {
    console.error(`Error setting relay state for ${relayId}:`, error);
    throw error;
  }
}

/**
 * Toggle relay state
 * @param relayId Full relay ID (e.g., "bedroom_light", "living_room_light")
 */
export async function toggleRelayState(relayId: string): Promise<void> {
  try {
    const currentState = await fetchRelayState(relayId);
    await setRelayState(relayId, !currentState);
  } catch (error) {
    console.error(`Error toggling relay state for ${relayId}:`, error);
    throw error;
  }
}

// ============================================================================
// Predefined Relays
// ============================================================================

export const AVAILABLE_RELAYS: RelayControl[] = [
  {
    id: "bedroom_light",
    name: "Bedroom Light",
    room: "bedroom",
    state: false,
    isOnline: true,
  },
  {
    id: "living_room_light",
    name: "Living Room Light",
    room: "living_room",
    state: false,
    isOnline: true,
  },
];
