import React from 'react';
import { createRoot } from 'react-dom/client';
import PhotographicMemoryWall, { ARCHIVAL_PHOTOS } from './PhotographicMemoryWall';

export const MEMORY_WALL_ITEMS = ARCHIVAL_PHOTOS;

if (typeof window !== 'undefined') {
  window.MEMORY_WALL_ITEMS = ARCHIVAL_PHOTOS;
}

export function initMemoryWall() {
  const mountEl = document.getElementById('memory-wall-carousel-root');
  if (!mountEl) return;

  const root = createRoot(mountEl);
  root.render(<PhotographicMemoryWall />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMemoryWall);
} else {
  initMemoryWall();
}
