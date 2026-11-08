import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Particles from './Particles';

function LoaderParticlesApp() {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const overlay = document.getElementById('section-loader-overlay');
    if (!overlay) return;

    const observer = new MutationObserver(() => {
      const active = overlay.classList.contains('active');
      setIsActive(active);
    });

    observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });

    const onLoaded = () => setIsActive(false);
    window.addEventListener('website-loaded', onLoaded);

    return () => {
      observer.disconnect();
      window.removeEventListener('website-loaded', onLoaded);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Particles
        particleColors={['#FFBD12', '#222428', '#FFA000', '#444444', '#FFFFFF']}
        particleCount={240}
        particleSpread={12}
        speed={0.15}
        particleBaseSize={110}
        sizeRandomness={1.2}
        shape="circle"
        glow={0.6}
        twinkle={0.4}
        moveParticlesOnHover={true}
        hoverEffect="parallax"
        particleHoverFactor={1.2}
        hoverRadius={160}
        clickBurst={true}
        cameraDistance={18}
        paused={!isActive}
      />
    </div>
  );
}

export function initLoaderParticles() {
  const mountEl = document.getElementById('loader-particles-bg');
  if (!mountEl) return;
  const root = createRoot(mountEl);
  root.render(<LoaderParticlesApp />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoaderParticles);
} else {
  initLoaderParticles();
}

