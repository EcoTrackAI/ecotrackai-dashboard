import { ref, onValue, set } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

/**
 * System status callback type
 */
export type SystemStatusCallback = (status: SystemStatus) => void;

/**
 * Subscribe to real-time system status updates from Firebase
 * Reads the system/status path directly from Firebase
 *
 * @param callback Function to call when system status updates
 * @returns Unsubscribe function to stop listening
 *
 * @example
 * ```tsx
 * const unsubscribe = subscribeSystemStatus((status) => {
 *   console.log('System status:', status);
 *   setSystemStatus(status);
 * });
 *
 * // Later, to unsubscribe:
 * unsubscribe();
 * ```
 */
export function subscribeSystemStatus(callback: SystemStatusCallback): () => void {
  try {
    const database = getFirebaseDatabase();
    const systemStatusRef = ref(database, "system/status");
    
    console.log("[System Status] Subscribing to Firebase system/status...");
    
    // Listen to system status from Firebase
    const unsubscribe = onValue(
      systemStatusRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const status = snapshot.val();
          console.log("[System Status] Received from Firebase:", status);
          // Validate status is one of the expected values
          if (status === "online" || status === "offline" || status === "warning") {
            callback(status);
          } else {
            // Default to online if invalid value
            console.log("[System Status] Invalid status, defaulting to online");
            callback("online");
          }
        } else {
          // Default to online if no status set
          console.log("[System Status] No status in Firebase, defaulting to online");
          callback("online");
        }
      },
      (error) => {
        console.error("[System Status] Error listening to system status:", error);
        callback("offline");
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error("[System Status] Error subscribing to system status:", error);
    callback("offline");
    return () => {};
  }
}

/**
 * Set system status in Firebase
 * This can be used by system monitoring tools to update the status
 *
 * @param status The system status to set
 * @returns Promise that resolves when status is updated
 */
export async function setSystemStatus(status: SystemStatus): Promise<void> {
  try {
    const database = getFirebaseDatabase();
    const systemStatusRef = ref(database, "system/status");
    await set(systemStatusRef, status);
  } catch (error) {
    console.error("Error setting system status:", error);
    throw error;
  }
}
