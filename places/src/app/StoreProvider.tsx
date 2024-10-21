'use client';

import { useRef } from "react";
import { AppStore, makeStore } from "@/lib/store";
import { Provider } from "react-redux";
import type { ReactNode } from "react";

interface Props {
    readonly children: ReactNode;
}

export function StoreProvider({ children }: Props) {

    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
    }
    
    // useEffect(() => {
    //     if (storeRef.current != null) {
    //     // configure listeners using the provided defaults
    //     // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
    //     const unsubscribe = setupListeners(storeRef.current.dispatch);
    //     return unsubscribe;
    //     }
    // }, []);
    
    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    );
  }