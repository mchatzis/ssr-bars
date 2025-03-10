import { STATIC_IMG_ICON_PREFIX } from '@/server/constants';
import { useCallback, useState } from 'react';

const ImageCarousel = ({ className = '', images, hasArrows = true }: { className: string, images: string[], hasArrows?: boolean }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastWheelTime, setLastWheelTime] = useState(0);
    const WHEEL_TIMEOUT = 400;

    const handleClickNext = (e: any) => {
        e.stopPropagation();
        setCurrentIndex(s => (s + 1) % images.length);
    };

    const handleClickPrevious = (e: any) => {
        e.stopPropagation();
        setCurrentIndex(s => (s - 1 + images.length) % images.length);
    };

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.stopPropagation();

        const currentTime = Date.now();
        if (currentTime - lastWheelTime < WHEEL_TIMEOUT) {
            return;
        }

        if (e.deltaY > 0.5) {
            setCurrentIndex(s => (s + 1) % images.length);
            setLastWheelTime(currentTime);
        } else if (e.deltaY < -0.5) {
            setCurrentIndex(s => (s - 1 + images.length) % images.length);
            setLastWheelTime(currentTime);
        }
    }, [lastWheelTime, images.length]);

    return (
        <div className={`${className} cursor-pointer`}>
            <img
                src={images[currentIndex]}
                className='w-full h-full object-cover'
                onWheel={handleWheel}
            />
            {hasArrows &&
                <>
                    <img
                        src={STATIC_IMG_ICON_PREFIX + '/' + 'right-arrow.png'}
                        onClick={handleClickNext}
                        className="absolute top-[45%] right-0 clickable-element"
                        width={30}
                        height={30}
                    />
                    <img
                        src={STATIC_IMG_ICON_PREFIX + '/' + 'left-arrow.png'}
                        onClick={handleClickPrevious}
                        className="absolute top-[45%] left-0 clickable-element"
                        width={30}
                        height={30}
                    />
                </>
            }
        </div>
    );
};

export default ImageCarousel;