import React from 'react';
import { createRoot } from 'react-dom/client';
import TargetCursor from './TargetCursor';
import './TargetCursor.css';

export function initTargetCursor() {
  if (typeof window === 'undefined') return;

  let mountEl = document.getElementById('target-cursor-mount');
  if (!mountEl) {
    mountEl = document.createElement('div');
    mountEl.id = 'target-cursor-mount';
    document.body.appendChild(mountEl);
  }

  if (!mountEl._targetCursorRoot) {
    mountEl._targetCursorRoot = createRoot(mountEl);
  }

  mountEl._targetCursorRoot.render(
    <TargetCursor
      targetSelector=".cursor-target"
      cursorColor="#FFBD12"
      cursorColorOnTarget="#FFBD12"
      hoverDuration={0.18}
      parallaxOn={true}
      hideDefaultCursor={true}
      size={38}
      padding={6}
      matchRadius={true}
      blendMode="normal"
      showLabel={true}
      clickEffect={true}
    />
  );
}

export const initSmoothCursor = initTargetCursor;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTargetCursor);
} else {
  initTargetCursor();
}
