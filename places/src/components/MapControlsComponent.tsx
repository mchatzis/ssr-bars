import FullScreenButton from "./buttons/FullScreenButton";
import ThemeButton from "./buttons/ThemeButton";


export default function MapControlsComponent({ className = '' }) {

    return (
        <div className={`${className}`}>
            <FullScreenButton className="block"></FullScreenButton>
            <ThemeButton className="block"></ThemeButton>
        </div>
    )
}