import React from 'react';
import { createRoot } from 'react-dom/client';
import { LetsWorkTogether } from '../components/ui/lets-work-section';

const container = document.getElementById('lets-work-root');
if (container) {
  const root = createRoot(container);
  root.render(<LetsWorkTogether className="py-2" compact={true} />);
}
