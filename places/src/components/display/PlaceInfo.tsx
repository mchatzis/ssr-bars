import { Place } from "@/redux/types";

export default function PlaceInfo({ selectedPlace, className = '' }: { selectedPlace: Place, className?: string }) {
    const categories = selectedPlace.properties.categories;

    return (
        <div className={`${className}`}>
            <h1 className="text-3xl text-accent w-fit">{selectedPlace.properties.name}</h1>
            <p className='absolute right-0 top-3 text-left text-lg px-3 py-1'>☆☆☆☆☆ {'(0)'}</p>
            <p className="mb-5">{selectedPlace.properties.description}</p>
            <p>{categories.reduce((prev, curr) => {
                return prev + ' | ' + curr;
            }, '') + ' |'}</p>
        </div>
    )
}