import { useEffect, useState, useCallback } from "react";
import { subscribeRelayState, setRelayState } from "@/lib/firebase-relay";

export function useRelayControl(roomId: string, relayType: string) {
  const [state, setState] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const relayId = `${roomId}_${relayType}`;

  useEffect(() => {
    const unsubscribe = subscribeRelayState(relayId, (newState) => {
      setState(newState);
      setLoading(false);
    });
    return unsubscribe;
  }, [relayId]);

  const updateState = useCallback(
    (newState: boolean) => setRelayState(relayId, newState),
    [relayId],
  );

  return { state, loading, setRelayState: updateState };
}
