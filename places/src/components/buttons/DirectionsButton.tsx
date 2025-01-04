import { Place } from "@/lib/redux/slices/mapStateSlice";
import { useCallback } from "react";

function createUrl(title: string, city: string) {
    let splitName = title.split(" ")
    let query = splitName.reduce((acc, word) => {
        return acc + word + "+";
    }, "");

    return "https://www.google.com/maps/search/?api=1&query=" + query + city
}

export default function DirectionsBox({ selectedPlace, className = '' }: { selectedPlace: Place, className?: string }) {
    const handleClick = useCallback(() => {
        const url = createUrl(selectedPlace.properties.title, selectedPlace.properties.area)
        console.log("opening" + url)
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