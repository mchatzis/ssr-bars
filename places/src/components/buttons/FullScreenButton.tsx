'use client'

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
    <div className={`${className} w-[30px] h-[30px] bg-[var(--accent-color)] m-1`}>
      <img
        id="fullscreen-button"
        className='relative cursor-pointer'
        onClick={toggleFullScreen}
        src={isFullscreen ? 'images/minimize.png' : 'images/fullscreen.png'}
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