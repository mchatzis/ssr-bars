import dynamic from "next/dynamic"
import MapComponent from "@/components/map/MapComponent"

const FullScreenButton = dynamic(
    () => import('@/components/buttons/FullScreen'),
    {ssr: false}
)

export default function Page(){
    return(
        <div className="fixed inset-0">
            <MapComponent className="absolute inset-0 z-[var(--z-map)]"></MapComponent>
            <FullScreenButton className="absolute top-4 left-4 z-[var(--z-controls)]"></FullScreenButton>
        </div>
    )
}