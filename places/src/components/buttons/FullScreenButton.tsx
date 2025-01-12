'use client'

import { STATIC_IMG_ICON_PREFIX } from '@/lib/constants';
import { useEffect, useState } from 'react';

export default function FullscreenToggle({ className = '' }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement !== null);
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }
  }, []);

  return (
    <div className={`${className} w-[36px] h-[36px] bg-primary/90 m-1 flex items-center justify-center`}>
      <img
        id="fullscreen-button"
        className='cursor-pointer clickable-element'
        onClick={toggleFullScreen}
        src={STATIC_IMG_ICON_PREFIX + '/' + (isFullscreen ? 'minimize.png' : 'fullscreen.png')}
        width={30}
        height={30}
      />
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