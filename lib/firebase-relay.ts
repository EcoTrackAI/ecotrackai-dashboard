import { ref, onValue, off, set, get } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

// Subscribe to relay state
export function subscribeRelayState(
  relayId: string,
  callback: (state: boolean | null) => void,
): () => void {
  const db = getFirebaseDatabase();
  const relayRef = ref(db, `relays/${relayId}/state`);

  const unsubscribe = onValue(relayRef, (snapshot) => {
    callback(snapshot.exists() ? Boolean(snapshot.val()) : null);
  });

  return () => off(relayRef, "value", unsubscribe);
}

// Fetch relay state once
export async function fetchRelayState(relayId: string): Promise<boolean | null> {
  try {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, `relays/${relayId}/state`));
    return snapshot.exists() ? Boolean(snapshot.val()) : null;
  } catch {
    return null;
  }
}

// Set relay state
export async function setRelayState(relayId: string, state: boolean): Promise<void> {
  try {
    const db = getFirebaseDatabase();
    await set(ref(db, `relays/${relayId}/state`), state);
  } catch (error) {
    console.error(`Error setting ${relayId}:`, error);
  }
}
