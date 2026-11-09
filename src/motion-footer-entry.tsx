import { createRoot } from 'react-dom/client';
import MotionFooterDemo from '../components/motion-footer-demo';

export function initMotionFooter() {
  const mountEl = document.getElementById('motion-footer-root');
  if (!mountEl) return;

  const root = createRoot(mountEl);
  root.render(<MotionFooterDemo />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMotionFooter);
} else {
  initMotionFooter();
}

