import { ref, onValue, set } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

export function subscribeSystemStatus(
  callback: SystemStatusCallback
): () => void {
  try {
    const database = getFirebaseDatabase();
    const statusRef = ref(database, "system/status");

    return onValue(
      statusRef,
      (snapshot) => {
        const status = snapshot.val();
        const validStatuses = ["online", "offline", "warning"];
        callback(validStatuses.includes(status) ? status : "online");
      },
      (error) => {
        console.error("System status error:", error);
        callback("offline");
      }
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    callback("offline");
    return () => {};
  }
}

export async function setSystemStatus(status: SystemStatus): Promise<void> {
  try {
    const database = getFirebaseDatabase();
    await set(ref(database, "system/status"), status);
  } catch (error) {
    console.error("Set status error:", error);
    throw error;
  }
}
