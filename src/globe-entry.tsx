import { createRoot } from 'react-dom/client';
import Globe3DDemo from '../components/3d-globe-demo';

export function initGlobe() {
  const mountEl = document.getElementById('globe-root');
  if (!mountEl) return;

  const root = createRoot(mountEl);
  root.render(<Globe3DDemo />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobe);
} else {
  initGlobe();
}

