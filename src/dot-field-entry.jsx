import React from 'react';
import { createRoot } from 'react-dom/client';
import DotField from './DotField';

export function initDotField() {
  const container = document.getElementById('skills-dotfield-root');
  if (!container) return;

  const root = createRoot(container);
  root.render(
    <DotField
      pattern="grid"
      gradientFrom="#D98A18"
      gradientTo="#4285F4"
      gradientAngle={135}
      dotRadius={1.75}
      dotSpacing={15}
      cursorRadius={250}
      bulgeStrength={0.75}
      glowRadius={185}
      glowColor="#F59E0B"
      glowIntensity={0.82}
      baseOpacity={0.34}
      waveAmplitude={4}
      speed={0.8}
      sparkle={true}
      interactive={true}
      holdToZoom={true}
      lightMode={true}
      opacity={0.92}
      className="skills-dotfield-canvas-container"
    />
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDotField);
} else {
  initDotField();
}
