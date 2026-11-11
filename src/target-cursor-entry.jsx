import React from 'react';
import { createRoot } from 'react-dom/client';
import TargetCursor from './TargetCursor';

export function initTargetCursor() {
  let mountEl = document.getElementById('target-cursor-mount');
  if (!mountEl) {
    mountEl = document.createElement('div');
    mountEl.id = 'target-cursor-mount';
    document.body.appendChild(mountEl);
  }

  const root = createRoot(mountEl);
  root.render(
    <TargetCursor
      targetSelector=".cursor-target"
      cursorColor="#FFBD12"
      cursorColorOnTarget="#FFBD12"
      hoverDuration={0.16}
      parallaxOn={true}
      hideDefaultCursor={true}
      size={34}
      padding={6}
      matchRadius={true}
      blendMode="normal"
      showLabel={true}
      clickEffect={true}
    />
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTargetCursor);
} else {
  initTargetCursor();
}
