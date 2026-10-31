import React from 'react';
import ReactDOM from 'react-dom/client';
import CircularText from './CircularText';

const rootEl = document.getElementById('nav-circular-logo-root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <CircularText
      text="SRINJOYEE DEY • DEVELOPER • "
      onHover="speedUp"
      direction="clockwise"
      spinDuration={18}
      size={50}
      fontSize={6.2}
      fontWeight={800}
      hoverTilt={18}
      draggable={true}
      ring={true}
      ringColor="rgba(36, 37, 41, 0.16)"
      color="currentColor"
      className="circular-logo-mark cursor-target"
    >
      <span className="circular-logo-center-icon" aria-hidden="true">✦</span>
    </CircularText>
  );
}
