import React from 'react';
import { createRoot } from 'react-dom/client';
import RippleGrid from './RippleGrid';

export function initRippleGrid() {
  const container = document.getElementById('spotlight-ripple-grid');
  if (!container) return;

  const root = createRoot(container);
  root.render(
    <RippleGrid
      color="#ffffff"
      variant="lines"
      cellSize={48}
      lineWidth={1}
      glow={0.7}
      rippleStrength={1.2}
      rippleSpeed={1}
      rippleSize={1}
      autoRipple="center"
      rippleInterval={3.2}
      tilt={0}
      rotation={0}
      mouseInteraction={true}
      clickRipple={true}
      intro={true}
      fade={0.25}
      opacity={0.75}
      lightMode={false}
    />
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRippleGrid);
} else {
  initRippleGrid();
}
