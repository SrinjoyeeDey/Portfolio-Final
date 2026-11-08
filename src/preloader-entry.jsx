import React from 'react';
import ReactDOM from 'react-dom/client';
import TextTypePreloader from './TextTypePreloader';

const rootEl = document.getElementById('preloader-root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<TextTypePreloader />);
}
