import ImageCarousel from "@/components/display/ImageCarousel";
import { Place, PlacesApiData, Theme } from "@/redux/types";

interface MapPopupContentProps {
    handleClick: () => void;
    theme: Theme;
    popupPlace: Place;
    mapData: PlacesApiData
}
export default function MapPopupContent({ handleClick, theme, popupPlace, mapData }: MapPopupContentProps) {
    const isLightTheme = theme === 'light';
    const shadowClass = isLightTheme ? 'shadow-light' : 'shadow-dark';

    return (
        <div id="myPopup"
            className={`w-64 h-48 animate-[fadeIn_0.3s_ease-out_none]`}
            onClick={handleClick}
        >
            <div className={`flex flex-col overflow-clip rounded-xl ${shadowClass}`}>
                <ImageCarousel
                    images={mapData[popupPlace.properties.category][popupPlace.properties.uuid].imagesUrls.medium}
                    className={`relative w-64 h-32 ${!isLightTheme && 'brightness-90'}`}
                    hasArrows={false}
                />
                <div className='w-64 h-16 bg-background'>
                    <p className="text-left text-lg text-accent px-3 m-0 cursor-pointer">{popupPlace.properties.name}</p>
                    <p className='text-left text-base px-3 py-1'>☆☆☆☆☆ {'(0)'}</p>
                </div>
            </div>
            {/* The following should be a transparent buffer that breaches the gap 
                            between the popup and its anchor for mouseEnter and mouseLeave to work */}
            <div className='relative left-1/4 w-32 h-5'></div>
        </div>
    )
}