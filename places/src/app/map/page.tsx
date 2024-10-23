import dynamic from "next/dynamic"
import MapComponent from "./MapComponent"   

const FullScreenButton = dynamic(
    () => import('@/components/buttons/FullScreen'),
    {ssr: false}
)

export default function App(){
    
    return(
        <div className="relative h-full w-full">
            <FullScreenButton></FullScreenButton>
            <div className="h-[100vh] w-[100vw] absolute z-0">
                <MapComponent></MapComponent>
            </div>
        </div>
    )
}