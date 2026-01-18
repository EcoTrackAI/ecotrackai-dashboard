import { ref, onValue, get } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

export function subscribeSystemStatus(
  callback: SystemStatusCallback,
): () => void {
  try {
    const database = getFirebaseDatabase();
    const deviceRef = ref(database, "devices/esp32-main");

    return onValue(
      deviceRef,
      (snapshot) => {
        const device = snapshot.exists() ? snapshot.val() : null;

        // Determine status based on device online state
        if (!device) {
          callback("offline");
          return;
        }

        // Device is online if online === true
        const isOnline = device.online === true;
        const status: SystemStatus = isOnline ? "online" : "offline";
        callback(status);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_error) => {
        callback("offline");
      },
    );
  } 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (error) {
    callback("offline");
    return () => {};
  }
}

export async function getDeviceStatus(): Promise<SystemStatus> {
  try {
    const database = getFirebaseDatabase();
    const snapshot = await get(ref(database, "devices/esp32-main"));
    const device = snapshot.exists() ? snapshot.val() : null;

    if (!device || device.online !== true) {
      return "offline";
    }

    return "online";
  } 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (error) {
    return "offline";
  }
}
