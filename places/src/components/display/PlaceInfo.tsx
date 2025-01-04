import { Place } from "@/lib/redux/slices/mapStateSlice";

export default function PlaceInfo({ selectedPlace, className = '' }: { selectedPlace: Place, className?: string }) {
    return (
        <div className={`${className}`}>
            <p>{selectedPlace.properties.title}</p>
            <p>{selectedPlace.properties.description}</p>
        </div>
    )
}