'use client'

import { STATIC_IMG_ICON_PREFIX } from '@/lib/constants';
import { useCallback, useEffect, useState } from 'react';

export default function FullscreenToggle({ className = '', hasMounted }: { className: string, hasMounted: boolean }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(document.fullscreenElement !== null);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }
  }, []);

  return (
    <div className={`w-[36px] h-[36px] bg-primary/90 m-1 flex items-center justify-center ${className}`}>
      {hasMounted ?
        <img
          id="fullscreen-button"
          className='cursor-pointer clickable-element fade-in-slow-half'
          onClick={toggleFullScreen}
          src={STATIC_IMG_ICON_PREFIX + '/' + (isFullscreen ? 'minimize.png' : 'fullscreen.png')}
          width={30}
          height={30}
        /> : null
      }
    </div>
  );
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
};