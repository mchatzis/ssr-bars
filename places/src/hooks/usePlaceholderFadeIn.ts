import { useEffect, useState } from "react";


export default function usePlaceholderFadeIn() {
    const [showPlaceholder, setShowPlaceholder] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPlaceholder(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const placeholderClass = `placeholder-start ${showPlaceholder ? "placeholder-visible" : ""}`;

    return placeholderClass
}