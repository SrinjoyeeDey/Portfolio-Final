import React from 'react';
import { createRoot } from 'react-dom/client';
import FlyingButton from './FlyingButton';

export function initFlyingButton() {
  const container = document.getElementById('flying-button-root');
  if (!container) return;

  const handleTakeoff = () => {
    console.log('Rocket Take off button clicked!');
    if (typeof window.unlockFeaturedCreations === 'function') {
      window.unlockFeaturedCreations(true);
    }
  };

  const root = createRoot(container);
  root.render(
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <FlyingButton
        theme="dark"
        size="small"
        groundPad={260}
        altitude={560}
        hoverTime={3.8}
        jets={2}
        thrusters
        trigger="click"
        carryCursor
        smoke={2.5}
        turbulence={2.0}
        wobble={1.0}
        ramp={false}
        thrustColor="#8ec5ff"
        smokeColor="#eef1f6"
        onClick={handleTakeoff}
      >
        Take off
      </FlyingButton>
    </div>
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFlyingButton);
} else {
  initFlyingButton();
}
