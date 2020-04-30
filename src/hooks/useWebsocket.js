import { useState, useEffect, useRef, useCallback } from "react";
import { usePrevious } from "./usePrevious";

export const READYSTATE_CONNECTING = 0;
export const READYSTATE_OPEN = 1;
export const READYSTATE_CLOSING = 2;
export const READYSTATE_CLOSED = 3;
export const READYSTATE_ERROR = 4;

const DefaultOption = {};

export const useWebsocket = (url, options = DefaultOption) => {
  const { onOpen, onClose, onMessage, onError } = options || {};

  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(READYSTATE_CONNECTING);

  const socketRef = useRef(null);
  const prevOptions = usePrevious(options);

  const sendMessage = useCallback((data) => {
    socketRef.current && socketRef.current.readyState === 1 && socketRef.current.send(data);
  }, []);

  useEffect(() => {
    if (prevOptions && prevOptions !== options) throw new Error("options must be static");
  }, [options, prevOptions]);

  useEffect(() => {
    setReadyState(READYSTATE_CONNECTING);
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = (e) => {
      onOpen && onOpen(e, sendMessage);
      setReadyState(READYSTATE_OPEN);
    };
    socketRef.current.onclose = (e) => {
      onClose && onClose(e);
      setReadyState(READYSTATE_CLOSED);
    };
    socketRef.current.onerror = (e) => {
      onError && onError(e);
      setReadyState(READYSTATE_ERROR);
    };
    socketRef.current.onmessage = ({ data }) => {
      setLastMessage(data);
      onMessage && onMessage(data);
    };

    return () => {
      socketRef.current.close();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return [lastMessage, sendMessage, readyState];
};
