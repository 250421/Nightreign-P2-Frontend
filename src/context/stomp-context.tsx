import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "sonner";

const StompContext = createContext<Client | null>(null);

export const StompProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws-connect`);
    const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("Connected to WebSocket via SockJS");
        },
        onStompError: (frame) => {
          console.error("STOMP error:", frame);
          toast.error("STOMP error: " + frame.headers["message"]);
        },
      });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <StompContext.Provider value={client}>
      {children}
    </StompContext.Provider>
  );
};

export const useStompClient = () => {
  const client = useContext(StompContext);
  if (!client) {
    console.warn("useStompClient called outside of StompProvider");
  }
  return client;
};