import createGlobe from 'cobe';

export function initGlobe() {
  const canvas = document.getElementById('cobe-globe-canvas');
  if (!canvas) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let phi = 0;
  let theta = 0.25;
  let width = canvas.offsetWidth || 920;
  let isPointerDown = false;
  let lastX = 0;
  let lastY = 0;
  let velocityX = 0;
  let velocityY = 0;

  const onResize = () => {
    if (canvas && canvas.offsetWidth) {
      width = canvas.offsetWidth;
    }
  };

  window.addEventListener('resize', onResize);
  onResize();
  requestAnimationFrame(onResize);
  setTimeout(onResize, 150);

  // GDG (Google Developers Group) Official Hex Colors
  const GDG_BLUE = [66 / 255, 133 / 255, 244 / 255];   // #4285F4
  const GDG_RED = [234 / 255, 67 / 255, 53 / 255];     // #EA4335
  const GDG_YELLOW = [251 / 255, 188 / 255, 5 / 255];  // #FBBC05
  const GDG_GREEN = [52 / 255, 168 / 255, 83 / 255];   // #34A853
  const BUTTER_GOLD = [255 / 255, 189 / 255, 18 / 255]; // Portfolio accent #FFBD12

  // Global reach markers spanning every continent to convey true worldwide availability
  const markers = [
    { location: [22.5726, 88.3639], size: 0.12, color: BUTTER_GOLD }, // Kolkata (HQ / Home Base)
    { location: [37.7749, -122.4194], size: 0.09, color: GDG_BLUE },   // San Francisco / Silicon Valley
    { location: [40.7128, -74.0060], size: 0.08, color: GDG_RED },     // New York
    { location: [51.5074, -0.1278], size: 0.08, color: GDG_GREEN },    // London
    { location: [35.6762, 139.6503], size: 0.08, color: GDG_YELLOW },  // Tokyo
    { location: [1.3521, 103.8198], size: 0.07, color: GDG_BLUE },     // Singapore
    { location: [52.5200, 13.4050], size: 0.07, color: GDG_RED },      // Berlin
    { location: [-33.8688, 151.2093], size: 0.07, color: GDG_GREEN },  // Sydney
    { location: [12.9716, 77.5946], size: 0.08, color: GDG_YELLOW },   // Bengaluru
    { location: [48.8566, 2.3522], size: 0.07, color: GDG_BLUE },      // Paris
    { location: [25.2048, 55.2708], size: 0.07, color: GDG_YELLOW },   // Dubai
    { location: [43.6532, -79.3832], size: 0.07, color: GDG_RED },     // Toronto
    { location: [-23.5505, -46.6333], size: 0.06, color: GDG_GREEN },  // São Paulo
    { location: [47.3769, 8.5417], size: 0.06, color: GDG_BLUE },      // Zurich
  ];

  let globe = null;

  let isGlobeVisible = true;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isGlobeVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);
  }

  try {
    globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi: 0,
      theta: 0.25,
      dark: 0, // Light mode
      scale: 1, // Full globe visible
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 3.5,
      baseColor: [1, 1, 1],
      markerColor: BUTTER_GOLD,
      glowColor: [255 / 255, 210 / 255, 100 / 255], // Warm butter yellow ambient glow
      markers: markers,
      onRender: (state) => {
        if (!isGlobeVisible && !isPointerDown) return;
        if (!isPointerDown) {
          // Inertia deceleration + constant gentle auto-spin
          phi += 0.0032 + velocityX;
          velocityX *= 0.94;
          if (Math.abs(velocityX) < 0.00005) velocityX = 0;

          theta = Math.max(0.05, Math.min(1.2, theta - velocityY));
          velocityY *= 0.92;
          if (Math.abs(velocityY) < 0.00005) velocityY = 0;
        }
        state.phi = phi;
        state.theta = theta;
        state.width = width * dpr;
        state.height = width * dpr;
      },
    });
  } catch (err) {
    console.error('COBE globe init error:', err);
  }

  // Pointer drag event handlers for direct 1:1 trackball interaction
  canvas.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
    lastX = e.clientX;
    lastY = e.clientY;
    velocityX = 0;
    velocityY = 0;
    canvas.style.cursor = 'grabbing';
    try {
      if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
    } catch (_) {}
    const hint = document.getElementById('globe-drag-hint');
    if (hint) hint.classList.add('hide');
  });

  window.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    phi += deltaX * 0.0055;
    theta = Math.max(0.05, Math.min(1.2, theta - deltaY * 0.0025));

    velocityX = deltaX * 0.0055;
    velocityY = deltaY * 0.0025;
  });

  const stopInteraction = (e) => {
    if (isPointerDown) {
      isPointerDown = false;
      if (canvas) {
        canvas.style.cursor = 'grab';
        try {
          if (e && canvas.releasePointerCapture) canvas.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    }
  };

  window.addEventListener('pointerup', stopInteraction);
  window.addEventListener('pointercancel', stopInteraction);

  window.teleportGlobe = (targetPhi, targetTheta) => {
    if (window.gsap) {
      const obj = { p: phi, t: theta };
      window.gsap.to(obj, {
        p: targetPhi,
        t: targetTheta,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          phi = obj.p;
          theta = obj.t;
          velocityX = 0;
          velocityY = 0;
        }
      });
    } else {
      phi = targetPhi;
      theta = targetTheta;
    }
  };

  const teleportPills = document.querySelectorAll('.teleport-pill');
  teleportPills.forEach(pill => {
    pill.addEventListener('click', () => {
      teleportPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const targetPhi = parseFloat(pill.getAttribute('data-phi') || '0');
      const targetTheta = parseFloat(pill.getAttribute('data-theta') || '0.25');
      if (window.teleportGlobe) window.teleportGlobe(targetPhi, targetTheta);
    });
  });

  setTimeout(() => {
    if (canvas) canvas.style.opacity = '1';
  }, 100);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobe);
} else {
  initGlobe();
}
