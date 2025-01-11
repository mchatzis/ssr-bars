import { Place } from "@/lib/redux/slices/mapStateSlice";

export default function PlaceInfo({ selectedPlace, className = '' }: { selectedPlace: Place, className?: string }) {
    const categories = selectedPlace.properties.categories;

    return (
        <div className={`${className}`}>
            <h1 className="text-3xl">{selectedPlace.properties.name}</h1>
            <p className="mb-5">{selectedPlace.properties.description}</p>
            <p>{categories.reduce((prev, curr) => {
                return prev + ' | ' + curr;
            }, '') + ' |'}</p>
        </div>
    )
}