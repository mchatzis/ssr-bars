'use client'

import { createContext, RefObject, useRef } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';


export const MapRefContext = createContext<RefObject<MapRef> | null>(null);

export const MapRefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const mapRef = useRef<MapRef>(null);

    return (
        <MapRefContext.Provider value={mapRef}>
            {children}
        </MapRefContext.Provider>
    );
};