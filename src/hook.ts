import {useContext} from "react";
import {StompContext} from "./Provider";

interface ObjectType<T = string> {
    [key: string]: T;
}

export const useStomp = ()=>{
    const value = useContext(StompContext);
    const {stompClient,subscriptions,setSubscriptions} = value;

    const send = (path: string, body: ObjectType, headers: ObjectType) => {
        stompClient?.publish({
            destination: path,
            headers,
            body: JSON.stringify(body),
        });
    }

    const subscribe = <T>(path: string, callback: (msg: T) => void) => {
            if (!stompClient) return;
            if (subscriptions[path]) return;

            const subscription = stompClient.subscribe(path, (message) => {
                const body: T = JSON.parse(message.body);
                callback(body);
            });
            setSubscriptions(prev=> {
                return {...prev, [path]: subscription}
            })
    };

    const unsubscribe = (path: string) => {
        const copy = {...subscriptions};
        copy[path].unsubscribe();
        delete copy[path];
        setSubscriptions(prev=> {
            return {...copy}
        })
    };

    const disconnect = ()=>{
        stompClient?.deactivate();
    }

    return {
        disconnect,
        subscribe,
        unsubscribe,
        subscriptions,
        send,
        isConnected:!!stompClient?.connected,
    };
}
