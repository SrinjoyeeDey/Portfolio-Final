import createGlobe from 'cobe';

export function initGlobe() {
  const canvas = document.getElementById('cobe-globe-canvas');
  if (!canvas) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let phi = 0;
  let width = canvas.offsetWidth || 500;
  let pointerInteracting = null;
  let pointerInteractionMovement = 0;

  const onResize = () => {
    if (canvas && canvas.offsetWidth) {
      width = canvas.offsetWidth;
    }
  };

  window.addEventListener('resize', onResize);
  onResize();

  // GDG (Google Developers Group) Official Hex Colors
  const GDG_BLUE = [66 / 255, 133 / 255, 244 / 255];   // #4285F4
  const GDG_RED = [234 / 255, 67 / 255, 53 / 255];     // #EA4335
  const GDG_YELLOW = [251 / 255, 188 / 255, 5 / 255];  // #FBBC05
  const GDG_GREEN = [52 / 255, 168 / 255, 83 / 255];   // #34A853
  const BUTTER_GOLD = [255 / 255, 189 / 255, 18 / 255]; // Portfolio accent #FFBD12

  let globe = null;

  try {
    globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi: 0,
      theta: 0.28,
      dark: 0, // Light mode
      scale: 1, // Full globe visible
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 3.5,
      baseColor: [1, 1, 1],
      markerColor: BUTTER_GOLD,
      glowColor: [255 / 255, 210 / 255, 100 / 255], // Warm butter yellow ambient glow
      markers: [
        { location: [22.5726, 88.3639], size: 0.12, color: BUTTER_GOLD }, // Kolkata (HQ / Home Base)
        { location: [37.4220, -122.0841], size: 0.09, color: GDG_BLUE },    // Mountain View / SF
        { location: [40.7128, -74.0060], size: 0.08, color: GDG_RED },      // New York
        { location: [51.5074, -0.1278], size: 0.08, color: GDG_GREEN },     // London
        { location: [35.6762, 139.6503], size: 0.08, color: GDG_YELLOW },   // Tokyo
        { location: [1.3521, 103.8198], size: 0.07, color: GDG_BLUE },      // Singapore
        { location: [52.5200, 13.4050], size: 0.07, color: GDG_RED },       // Berlin
        { location: [-33.8688, 151.2093], size: 0.06, color: GDG_GREEN },   // Sydney
        { location: [12.9716, 77.5946], size: 0.07, color: GDG_YELLOW },    // Bengaluru
        { location: [48.8566, 2.3522], size: 0.06, color: GDG_BLUE },       // Paris
      ],
      onRender: (state) => {
        if (!pointerInteracting) {
          phi += 0.0035;
        }
        state.phi = phi + pointerInteractionMovement;
        state.width = width * dpr;
        state.height = width * dpr;
      },
    });
  } catch (err) {
    console.error('COBE globe init error:', err);
  }

  canvas.addEventListener('pointerdown', (e) => {
    pointerInteracting = e.clientX - pointerInteractionMovement;
    canvas.style.cursor = 'grabbing';
  });

  window.addEventListener('pointerup', () => {
    pointerInteracting = null;
    if (canvas) canvas.style.cursor = 'grab';
  });

  window.addEventListener('pointermove', (e) => {
    if (pointerInteracting !== null) {
      const delta = e.clientX - pointerInteracting;
      pointerInteractionMovement = delta * 0.007;
    }
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
