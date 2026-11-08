import React from 'react';
import { createRoot } from 'react-dom/client';
import TechVideoPixelTransition from './TechVideoPixelTransition';

export function initPixelTransition() {
  const container = document.getElementById('tech-video-pixel-root');
  if (container) {
    const root = createRoot(container);
    root.render(<TechVideoPixelTransition />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPixelTransition);
} else {
  initPixelTransition();
}

