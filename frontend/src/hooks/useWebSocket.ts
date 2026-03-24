import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // establish WebSocket connection when component mounts
  useEffect(() => {
    const s = io(url);
    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    setSocket(s);

    // cleanup — disconnect when component unmounts
    // prevents memory leaks and hanging connections
    return () => {
      s.disconnect();
    };
  }, [url]);

  return { socket, connected };
}
