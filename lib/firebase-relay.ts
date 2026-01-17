/**
 * Firebase Relay Control Module
 * Handles subscribe and control of relay states from Firebase Realtime Database
 */

import { ref, onValue, off, set, DataSnapshot } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

// ============================================================================
// Relay Subscription Functions
// ============================================================================

export function subscribeRelayState(
  room: "bedroom" | "living_room",
  relayId: string,
  callback: (state: boolean | null) => void,
): () => void {
  const database = getFirebaseDatabase();
  // Construct relay ID from room and relayId (e.g., bedroom_light)
  const fullRelayId = `${room}_${relayId}`;
  const relayRef = ref(database, `relays/${fullRelayId}/state`);

  const listener = (snapshot: DataSnapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  };

  onValue(relayRef, listener, (error) =>
    console.error(`Relay ${fullRelayId} subscription error:`, error),
  );

  return () => off(relayRef, "value", listener);
}

export async function fetchRelayState(
  room: "bedroom" | "living_room",
  relayId: string,
): Promise<boolean | null> {
  try {
    const database = getFirebaseDatabase();
    const snapshot = await onValue(
      ref(database, `relays/${room}_${relayId}/state`),
      () => {},
    );
    return null;
  } catch (error) {
    console.error(`Error fetching relay state:`, error);
    throw error;
  }
}

// ============================================================================
// Relay Control Functions
// ============================================================================

export async function setRelayState(
  room: "bedroom" | "living_room",
  relayId: string,
  state: boolean,
): Promise<void> {
  try {
    const database = getFirebaseDatabase();
    // Construct relay ID from room and relayId (e.g., bedroom_light)
    const fullRelayId = `${room}_${relayId}`;
    const relayRef = ref(database, `relays/${fullRelayId}/state`);
    await set(relayRef, state);
  } catch (error) {
    console.error(`Error setting relay state:`, error);
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
