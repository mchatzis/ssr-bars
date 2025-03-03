import { Area, PlaceType } from './appState.types';

export function isArea(obj: any): obj is Area {
    return (
        typeof obj === "object" && obj !== null &&
        typeof obj.name === "string" &&
        typeof obj.longitude === "number" &&
        typeof obj.latitude === "number" &&
        typeof obj.initialZoom === "number"
    );
}

export function isPlaceType(obj: any): obj is PlaceType {
    return (
        typeof obj === "object" && obj !== null &&
        typeof obj.name === "string"
    );
} 