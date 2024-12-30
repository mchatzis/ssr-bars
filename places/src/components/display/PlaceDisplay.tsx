'use client'

import { useAppSelector } from "@/lib/redux/hooks";
import { selectSelectedPlace } from "@/lib/redux/slices/mapStateSlice";

export default function PlaceDisplay({ className = '' }) {
    const selectedPlace = useAppSelector(selectSelectedPlace);
    if (!selectedPlace) { return null }

    return <div className="absolute top-[10vh] right-[1vw] h-[85vh] w-[30vw] rounded-xl
                bg-[var(--background-color)] fade-in">
        <p>P1</p>
        <p>P2</p>
        <p>P3</p>
        <p>{selectedPlace?.properties.title}</p>
    </div>
}