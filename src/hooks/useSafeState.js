import { useState, useRef, useEffect, useCallback } from "react";

export const useSafeState = (initState) => {
  const [state, setState] = useState(initState);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  }, []);

  const setSafeState = useCallback((value) => {
    isMountedRef.current && setState(value);
  }, []);

  return [state, setSafeState];
};
