'use client'

import { useAppSelector } from "@/lib/redux/hooks";
import { selectMapData, selectSelectedPlace } from "@/lib/redux/slices/mapStateSlice";
import DirectionsBox from "../buttons/DirectionsButton";
import ImageCarousel from "./ImageCarousel";
import PlaceInfo from "./PlaceInfo";

export default function PlaceDisplay({ className = '' }) {
    const selectedPlace = useAppSelector(selectSelectedPlace);
    const mapData = useAppSelector(selectMapData);

    if (!selectedPlace) { return null }

    return (
        <div className={`${className} absolute top-20 right-[1vw] w-96 h-[85vh]
                bg-[var(--background-color)] fade-in flex flex-col rounded-xl overflow-clip`}>
            <ImageCarousel
                images={mapData[selectedPlace.properties.category][selectedPlace.properties.uuid].imagesUrls.large}
                className="relative w-full h-72"
            />
            <PlaceInfo selectedPlace={selectedPlace} className='relative w-full text-start text-base p-3' />
            <DirectionsBox selectedPlace={selectedPlace} className="absolute bottom-1 m-3" />
        </div>
    );
}