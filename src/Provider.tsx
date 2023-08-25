import React, {createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState} from "react";
import {Client, StompConfig, StompSubscription} from "@stomp/stompjs";

export interface Subscriptions {
    [key: string]: StompSubscription
}

export interface StompContextState {
    stompClient: Client | null;
    subscriptions:Subscriptions
    setSubscriptions:Dispatch<SetStateAction<Subscriptions>>;
}

const defaultValue = {
    isConnected:false,
    stompClient:null,
    subscriptions:{},
    setSubscriptions:()=>{}
}

export const StompContext = createContext<StompContextState>(defaultValue)

interface Props {
    children: ReactNode;
    config:StompConfig;
    onConnected?:(client:Client)=>void;
}

export const StompProvider:FC<Props> = ({children,config,onConnected})=>{
    const [stompClient, setStompClient] = useState(()=> new Client(config));
    const [subscriptions, setSubscriptions] = useState({});


    useEffect(() => {
            stompClient?.activate();
            onConnected?.(stompClient)
        return ()=>{
            stompClient?.deactivate();
        }
    }, [stompClient]);

    return (
        <StompContext.Provider value={{
            stompClient,
            subscriptions,
            setSubscriptions
        }}>
            {children}
        </StompContext.Provider>

    )
}
