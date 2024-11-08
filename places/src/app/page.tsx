import dynamic from "next/dynamic"
import MapComponent from "@/components/map/MapComponent"
import LoginButton from "@/components/buttons/LoginButton"
import ThemeButton from "@/components/buttons/ThemeButton"

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
            <ThemeButton className="absolute top-10 left-4 bg-red-400"></ThemeButton>
            <div className="absolute top-48 left-4">
                <p className="text-[var(--primary-color)]">primary</p>
                <p className="text-[var(--secondary-color)]">secondary</p>
                <p className="text-[var(--accent-color)]">accent</p>
            </div>
        </div>
    )
}