'use client';

import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Lanyard from './Lanyard.jsx';

function LanyardSpotlight() {
  useEffect(() => {
    // When the spotlight section scrolls into viewport, give the badge a gentle drop swing
    const section = document.getElementById('spotlight');
    if (!section || !window.IntersectionObserver) return;

    let hasDroppedOnce = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasDroppedOnce && window.triggerLanyardDrop) {
            hasDroppedOnce = true;
            setTimeout(() => {
              window.triggerLanyardDrop();
            }, 150);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="lanyard-spotlight-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Lanyard
        frontImage="images/card-front.png"
        backImage="images/card-back.png"
        strapImage="images/card-band.png"
        strapColor="#111215"
        cardColor="#0E0F13"
        finish="holographic"
        metal="gold"
        orientation="portrait"
        cornerRadius={0.25}
        size={0.78}
        strapLength={0.52}
        strapWidth={0.82}
        anchor="center"
        breeze={0.4}
        gravity={1.1}
        damping={0.55}
        elasticity={0.45}
        interactive={true}
        intro={true}
      />
    </div>
  );
}

// Mount into #lanyard-root
const container = document.getElementById('lanyard-root');
if (container) {
  const root = createRoot(container);
  root.render(<LanyardSpotlight />);
}
