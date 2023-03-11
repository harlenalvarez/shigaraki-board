import React, { useEffect, useMemo, useState } from 'react';


export const ScaleContext = React.createContext(1)

export const Zoom = (props: { children: React.ReactNode }) => {
  const onMac = useMemo(() => window.navigator.userAgent.toLowerCase().includes('mac'), []);
  const [scale, setScale] = useState(1);

  const handleZoomClick = (e: KeyboardEvent) => {
    console.log(onMac && e.key === 'Meta', e.key);
    if (e.key === 'Control' || (onMac && e.key === 'Meta')) {
      window.addEventListener('keypress', handleZoomPress);
      window.addEventListener('keyup', checkStopZoom);
    }
    else if (e.key === '-') {
      e.preventDefault();
    }
    else if (e.key === '=') {
      e.preventDefault();
    }
  }

  const handleZoomPress = (e: KeyboardEvent) => {
    if (e.key === '-') {
      e.preventDefault();
    }
    else if (e.key === '=') {
      e.preventDefault();
    }
  }

  const checkStopZoom = (e: KeyboardEvent) => {
    if (e.key === 'Control' || (onMac && e.key === 'Meta')) {
      window.removeEventListener('keyup', checkStopZoom);
      window.removeEventListener('keypress', handleZoomPress);
    }
  }

  const handlePinchZoom = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const pinchValue = Math.round((e.deltaY + Number.EPSILON) * 100) / 10000;
      setScale(prev => {
        let currentScale = prev - pinchValue;
        currentScale = Math.max(0.25, currentScale);
        currentScale = Math.min(4, currentScale);
        return currentScale;
      });
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleZoomClick);
    document.body.addEventListener('wheel', handlePinchZoom, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleZoomClick);
      document.body.removeEventListener('wheel', handlePinchZoom);
    }
  }, []);

  return (
    <ScaleContext.Provider value={scale}>
      {props.children}
    </ScaleContext.Provider>
  )
}