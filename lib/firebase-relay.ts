import { ref, onValue, off, set, get } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

/**
 * Subscribe to real-time relay state changes
 */
export function subscribeRelayState(
  relayId: string,
  callback: (state: boolean | null) => void
): () => void {
  const db = getFirebaseDatabase();
  const relayRef = ref(db, `relays/${relayId}/state`);

  const unsubscribe = onValue(relayRef, (snapshot) => {
    const state = snapshot.exists() ? Boolean(snapshot.val()) : null;
    callback(state);
  });

  return () => off(relayRef, "value");
}

/**
 * Fetch relay state once
 */
export async function fetchRelayState(
  relayId: string
): Promise<boolean | null> {
  try {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, `relays/${relayId}/state`));
    return snapshot.exists() ? Boolean(snapshot.val()) : null;
  } catch (error) {
    console.error(`Error fetching relay ${relayId}:`, error);
    return null;
  }
}

/**
 * Set relay state (send command to relay)
 */
export async function setRelayState(
  relayId: string,
  state: boolean
): Promise<void> {
  try {
    const db = getFirebaseDatabase();
    await set(ref(db, `relays/${relayId}/state`), state);
  } catch (error) {
    console.error(`Error setting relay ${relayId}:`, error);
    throw error;
  }
}
