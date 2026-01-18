import { ref, onValue, off, set, get } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

export function subscribeRelayState(
  relayId: string,
  callback: (state: boolean | null) => void,
): () => void {
  const db = getFirebaseDatabase();
  const relayRef = ref(db, `relays/${relayId}/state`);

  onValue(relayRef, (snapshot) => {
    const state = snapshot.exists() ? Boolean(snapshot.val()) : null;
    callback(state);
  });

  return () => off(relayRef, "value");
}

export async function fetchRelayState(
  relayId: string,
): Promise<boolean | null> {
  try {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, `relays/${relayId}/state`));
    return snapshot.exists() ? Boolean(snapshot.val()) : null;
  } 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (_error) {
    return null;
  }
}

export async function setRelayState(
  relayId: string,
  state: boolean,
): Promise<void> {
  try {
    const db = getFirebaseDatabase();
    await set(ref(db, `relays/${relayId}/state`), state);
  } catch (_error) {
    throw _error;
  }
}
