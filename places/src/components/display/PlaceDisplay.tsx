'use client'

import { useAppSelector } from "@/lib/redux/hooks";
import { selectMapData, selectSelectedPlace } from "@/lib/redux/slices/mapStateSlice";
import { selectTheme } from "@/lib/redux/slices/styleStateSlice";
import DirectionsBox from "../buttons/DirectionsButton";
import ImageCarousel from "./ImageCarousel";
import PlaceInfo from "./PlaceInfo";

export default function PlaceDisplay({ className = '' }) {
    const selectedPlace = useAppSelector(selectSelectedPlace);
    const mapData = useAppSelector(selectMapData);
    const theme = useAppSelector(selectTheme);

    const isLightTheme = theme === 'light'
    const shadowClass = isLightTheme ? 'shadow-light' : 'shadow-dark';

    if (!selectedPlace) { return null }

    return (
        <div className={`absolute top-20 right-[1vw] w-96 h-[85vh]
                bg-bgColor fade-in flex flex-col rounded-xl overflow-clip ${shadowClass} ${className}`}>
            <ImageCarousel
                images={mapData[selectedPlace.properties.category][selectedPlace.properties.uuid].imagesUrls.large}
                className={`relative w-full h-72 ${!isLightTheme && 'opacity-85'}`}
            />
            <PlaceInfo selectedPlace={selectedPlace} className='relative w-full text-start text-base p-3 mt-2' />
            <DirectionsBox selectedPlace={selectedPlace} className="absolute bottom-1 m-3" />
        </div>
    );
}