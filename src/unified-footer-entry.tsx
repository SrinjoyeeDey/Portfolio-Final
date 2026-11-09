import { createRoot } from 'react-dom/client';
import UnifiedFooter from '../components/unified-footer';

export function initUnifiedFooter() {
  const mountEl = document.getElementById('unified-footer-root');
  if (!mountEl) return;

  const root = createRoot(mountEl);
  root.render(<UnifiedFooter />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUnifiedFooter);
} else {
  initUnifiedFooter();
}

