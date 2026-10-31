import React from 'react';
import { createRoot } from 'react-dom/client';
import TextPressure from './TextPressure';

export function BuildWithMePressure() {
  const [fontSize, setFontSize] = React.useState(56);

  React.useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setFontSize(36);
      } else if (w < 768) {
        setFontSize(42);
      } else if (w < 1100) {
        setFontSize(48);
      } else if (w < 1440) {
        setFontSize(54);
      } else {
        setFontSize(60);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="build-with-me-pressure-wrap">
      <div className="pressure-line-row">
        <TextPressure
          text="BUILD"
          flex={false}
          fontSize={fontSize}
          stroke={true}
          strokeColor="#ffffff"
          strokeWidth={2}
          textColor="transparent"
          weight={true}
          width={true}
          italic={true}
          idle="wave"
          idleSpeed={1.2}
          clickRipple={true}
          minFontSize={32}
          radius={0.7}
          smoothing={0.4}
        />
      </div>
      <div className="pressure-line-row">
        <TextPressure
          text="WITH"
          flex={false}
          fontSize={fontSize}
          stroke={false}
          textColor="#ffffff"
          weight={true}
          width={true}
          italic={true}
          idle="wave"
          idleSpeed={1.2}
          clickRipple={true}
          minFontSize={32}
          radius={0.7}
          smoothing={0.4}
        />
      </div>
      <div className="pressure-line-row pressure-row-me">
        <TextPressure
          text="ME"
          flex={false}
          fontSize={fontSize}
          stroke={true}
          strokeColor="#ffffff"
          strokeWidth={2}
          textColor="transparent"
          weight={true}
          width={true}
          italic={true}
          idle="wave"
          idleSpeed={1.2}
          clickRipple={true}
          minFontSize={32}
          radius={0.7}
          smoothing={0.4}
        />
      </div>
    </div>
  );
}

export function initTextPressure() {
  const container = document.getElementById('spotlight-text-pressure');
  if (!container) return;

  const root = createRoot(container);
  root.render(<BuildWithMePressure />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTextPressure);
} else {
  initTextPressure();
}
