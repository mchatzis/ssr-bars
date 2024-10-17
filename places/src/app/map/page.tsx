import dynamic from "next/dynamic"
import MapComponent from "./MapComponent"

const FullScreenButton = dynamic(
    () => import('@/components/buttons/FullScreen'),
    {ssr: false}
)

export default function Main(){
    return(
        <div className="relative h-full w-full">
            <FullScreenButton></FullScreenButton>
            <p id="header" className="absolute z-10 text-white text-center right-5">Header</p>
            <div className="h-[100vh] w-[100vw] absolute z-0">
                <MapComponent></MapComponent>
            </div>
        </div>
    )
}