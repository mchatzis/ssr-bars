import FullScreenButton from "@/components/buttons/FullScreenButton";
import ThemeButton from "@/components/buttons/ThemeButton";


export default function MapControlsComponent({ className = '' }) {

    return (
        <div className={`${className} flex-col`}>
            <FullScreenButton className="block"></FullScreenButton>
            <ThemeButton className="block"></ThemeButton>
        </div>
    )
}