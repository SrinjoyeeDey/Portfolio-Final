import { createRoot } from 'react-dom/client';
import ParallaxDemo from '../components/parallax-demo';

export function initParallax() {
  const mountEl = document.getElementById('parallax-scrolling-root');
  if (!mountEl) return;

  const root = createRoot(mountEl);
  root.render(<ParallaxDemo />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParallax);
} else {
  initParallax();
}

