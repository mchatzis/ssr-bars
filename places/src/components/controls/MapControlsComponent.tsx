'use client'

import FullScreenButton from "@/components/buttons/FullScreenButton";
import ThemeButton from "@/components/buttons/ThemeButton";
import { useEffect, useState } from "react";


export default function MapControlsComponent({ className = '' }) {
    const [hasMounted, setHasMounted] = useState(false);

    //Initial theme cannot be known on server. Hence, render both on client.
    useEffect(() => {
        setHasMounted(true);
    }, []);

    return (
        <div className={`flex-col ${className}`}>
            <FullScreenButton className="" hasMounted={hasMounted}></FullScreenButton>
            <ThemeButton className="" hasMounted={hasMounted}></ThemeButton>
        </div>
    )
}