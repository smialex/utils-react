import { useEffect } from "react";
import { useSafeState } from "./useSafeState";

export const useTimeout = (ms) => {
  const [ready, setReady] = useSafeState(false);

  useEffect(() => {
    const timeout = setTimeout(setReady, ms, true);

    return () => clearTimeout(timeout);
  }, [ms, setReady]);

  return ready;
};
