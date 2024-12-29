'use client'

import { useAppSelector } from "@/lib/redux/hooks";
import { selectSelectedPlace } from "@/lib/redux/slices/mapStateSlice";

export default function RightDisplay({ className = '' }) {
    const selectedPlace = useAppSelector(selectSelectedPlace);

    return (
        <div className={className}>
            <p>P1</p>
            <p>P2</p>
            <p>P3</p>
            <p>{selectedPlace?.properties.title}</p>
        </div>
    )
}
