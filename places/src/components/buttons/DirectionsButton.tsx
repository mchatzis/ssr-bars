import { Place } from "@/redux/types";
import { useCallback } from "react";

function createUrl(name: string, city: string) {
    const splitName = name.split(" ")
    const query = splitName.reduce((acc, word) => {
        return acc + word + "+";
    }, "");

    return "https://www.google.com/maps/search/?api=1&query=" + query + city
}

export default function DirectionsBox({ selectedPlace, className = '' }: { selectedPlace: Place, className?: string }) {
    const handleClick = useCallback(() => {
        const url = createUrl(selectedPlace.properties.name, selectedPlace.properties.area)
        window.open(url)
        return
    }, []);

    return (
        <div className={`${className}`}>
            <button onClick={handleClick} id="directions_button">
                Directions&gt;&gt;
            </button>
        </div>
    )
}