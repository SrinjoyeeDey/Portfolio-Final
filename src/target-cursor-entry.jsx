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
      spinDuration={2}
      hoverDuration={0.2}
      parallaxOn={true}
      hideDefaultCursor={true}
      size={36}
      cornerSize={12}
      thickness={3}
      padding={6}
      matchRadius={true}
      dotSize={4}
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

