import { createRoot } from 'react-dom/client';
import DoodleCrewDemo from '../components/doodle-crew-demo';

export function initDoodleFooter() {
  const mountEl = document.getElementById('doodle-footer-root');
  if (!mountEl) return;

  const root = createRoot(mountEl);
  root.render(<DoodleCrewDemo />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDoodleFooter);
} else {
  initDoodleFooter();
}
