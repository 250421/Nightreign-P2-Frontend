import { useStompClient } from "@/context/stomp-context";
import { toast } from "sonner";
import type { IsReadyRequest } from "../dtos/requests/is-ready-request";

export const useSendBattleReady = () => {
    const stompClient = useStompClient();

    const sendBattleReady = (request: IsReadyRequest) => {
        if (!stompClient || !stompClient.connected) {
            toast.error("WebSocket not connected.");
            return;
        }

        stompClient.publish({
            destination: "/app/battle/isReady",
            body: JSON.stringify(request),
        });
    };

    return { sendBattleReady };
};
