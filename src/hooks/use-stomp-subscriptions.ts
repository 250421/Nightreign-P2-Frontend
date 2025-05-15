import { useEffect, useRef } from "react";
import { type IMessage } from "@stomp/stompjs";
import { useStompClient } from "@/context/stomp-context";

export const useStompSubscription = (
  topic: string,
  callback: (message: IMessage) => void
) => {
  const stompClient = useStompClient();
  const subscribed = useRef(false);

  useEffect(() => {
    if (!stompClient || !stompClient.connected || subscribed.current) return;

    const subscription = stompClient.subscribe(topic, callback);
    subscribed.current = true;

    return () => {
      subscription.unsubscribe();
      subscribed.current = false;
    };
  }, [stompClient, topic, callback]);
};