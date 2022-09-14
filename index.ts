import { CompatClient, Stomp, StompSubscription } from "@stomp/stompjs";
import { useCallback, useEffect } from "react";
import SockJS from "sockjs-client";

interface ObjectType {
  [key: string]: any;
}

let socketClient: WebSocket;
let stompClient: CompatClient;
let isConnected = false;
const subscriptions: { [key: string]: StompSubscription } = {};

export function useStomp(url: string, callback?: () => void) {
  const connect = useCallback(() => {
    if (!socketClient) {
      socketClient = new SockJS(url);
    }

    if (!stompClient) {
      stompClient = Stomp.over(socketClient);
      stompClient.debug = () => {
        return;
      };
    }

    if (socketClient && stompClient) {
      stompClient.connect({}, (receipt: any) => {
        isConnected = true;
        callback && callback();
      });
    }
  }, []);

  const send = useCallback(
    (path: string, body: ObjectType, headers: ObjectType) => {
      stompClient.publish({
        destination: path,
        headers,
        body: JSON.stringify(body),
      });
    },
    []
  );

  const subscribe = useCallback(
    <T>(path: string, callback: (msg: T) => void) => {
      if (!stompClient) return;

      if (subscriptions[path]) return;

      const subscription = stompClient.subscribe(path, (message) => {
        const body: T = JSON.parse(message.body);
        callback(body);
      });
      subscriptions[path] = subscription;
    },
    []
  );

  const unsubscribe = useCallback((path: string) => {
    subscriptions[path].unsubscribe();
    delete subscriptions[path];
  }, []);

  const disconnect = useCallback(() => {
    stompClient.disconnect();
  }, []);

  useEffect(() => {
    connect();
  }, []);

  return {
    disconnect,
    subscribe,
    unsubscribe,
    subscriptions,
    send,
    isConnected,
  };
}
