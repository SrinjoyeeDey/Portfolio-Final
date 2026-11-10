import React from 'react';
import { createRoot } from 'react-dom/client';
import LetterGlitch from './LetterGlitch';

export function initLetterGlitch() {
  const container = document.getElementById('tech-showcase-letterglitch-root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <LetterGlitch
        glitchColors={['#FFBD12', '#E8BD4B', '#F5D879', '#D5A52E', '#27272A']}
        baseColor="#27272A"
        characters="0123456789"
        fontFamily="'Space Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        fontSize={14}
        spacing={0.65}
        density={0.88}
        baseOpacity={0.09}
        glitchAmount={0.38}
        speed={0.65}
        flow={0.45}
        smooth={true}
        interactive={true}
        cursorRadius={150}
        clickEffect="tear"
        edgeFade={0.25}
        centerFade={0.08}
        intro={true}
        lightMode={true}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    );
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLetterGlitch);
} else {
  initLetterGlitch();
}

