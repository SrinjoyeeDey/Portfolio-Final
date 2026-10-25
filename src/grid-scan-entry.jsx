import React from 'react';
import { createRoot } from 'react-dom/client';
import GridScan from './GridScan';

export function initGridScan() {
  const container = document.getElementById('hero-room-perspective-grid');
  if (!container) return;

  const root = createRoot(container);
  root.render(
    <GridScan
      linesColor="#4d4757"
      scanColor="#FFBD12"
      lightMode={true}
      cells={8}
      depth={3}
      scanDuration={2.4}
      scanDelay={1.6}
      clickEffect="ping"
      interactive={true}
      points={true}
      shading={0.65}
      reflection={0.35}
      glow={0.8}
    />
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGridScan);
} else {
  initGridScan();
}
