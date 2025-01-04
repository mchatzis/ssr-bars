'use client'

import { useAppSelector } from "@/lib/redux/hooks";
import { selectSelectedPlace } from "@/lib/redux/slices/mapStateSlice";
import DirectionsBox from "../buttons/DirectionsButton";
import ImageCarousel from "./ImageCarousel";
import PlaceInfo from "./PlaceInfo";

export default function PlaceDisplay({ className = '' }) {
    const selectedPlace = useAppSelector(selectSelectedPlace);
    if (!selectedPlace) { return null }

    //TODO: Somehow show which pin is active
    return (
        <div className="absolute top-[10vh] right-[1vw] w-96 h-[85vh]
                bg-[var(--background-color)] fade-in flex flex-col rounded-xl overflow-clip">
            <ImageCarousel
                images={selectedPlace.imagesUrls.small}
                className="relative w-full h-72"
            />
            <PlaceInfo selectedPlace={selectedPlace} className='' />
            <DirectionsBox selectedPlace={selectedPlace} className="absolute bottom-1 m-3" />
        </div>
    );
}