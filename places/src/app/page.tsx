import dynamic from "next/dynamic"
import MapComponent from "@/components/map/MapComponent"
import LoginButton from "@/components/buttons/LoginButton"

const FullScreenButton = dynamic(
    () => import('@/components/buttons/FullScreenButton'),
    {ssr: false}
)

export default function Page(){
    return(
        <div className="fixed inset-0">
            <MapComponent className="absolute inset-0 z-[var(--z-map)]"></MapComponent>
            <FullScreenButton className="absolute top-4 left-4 z-[var(--z-controls)]"></FullScreenButton>
            <LoginButton className="absolute top-4 right-4 z-[var(--z-controls) border border-black rounded-full p-2 bg-blue-700"/>
        </div>
    )
}