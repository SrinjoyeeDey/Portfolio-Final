import React from 'react';
import ReactDOM from 'react-dom/client';
import ProjectsShowcase from './ProjectsShowcase';

const rootEl = document.getElementById('projects-showcase-root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<ProjectsShowcase />);
}
