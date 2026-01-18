import { ref, onValue, get } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

/**
 * Subscribe to device online/offline status from Firebase
 * Reads from /devices/esp32-main/online which is the source of truth
 */
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

        console.log("[SystemStatus] Device status:", {
          online: device.online,
          lastSeen: device.lastSeen,
          status,
        });

        callback(status);
      },
      (error) => {
        console.error("System status error:", error);
        callback("offline");
      },
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    callback("offline");
    return () => {};
  }
}

/**
 * Fetch device status once
 */
export async function getDeviceStatus(): Promise<SystemStatus> {
  try {
    const database = getFirebaseDatabase();
    const snapshot = await get(ref(database, "devices/esp32-main"));
    const device = snapshot.exists() ? snapshot.val() : null;

    if (!device || device.online !== true) {
      return "offline";
    }

    return "online";
  } catch (error) {
    console.error("Get device status error:", error);
    return "offline";
  }
}
