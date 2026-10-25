'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Lanyard from './Lanyard.jsx';

function LanyardApp() {
  const [isOpen, setIsOpen] = useState(true);
  const droppedRef = useRef(false);

  const triggerDropAnimation = () => {
    if (window.triggerLanyardDrop) {
      window.triggerLanyardDrop();
    } else {
      window.dispatchEvent(new CustomEvent('drop-lanyard-card'));
    }
    droppedRef.current = true;
  };

  useEffect(() => {
    // Check if the preloader overlay is active on page load
    const overlay = document.getElementById('section-loader-overlay');
    const isLoaderActive = overlay && overlay.classList.contains('active');

    let safetyTimer = null;

    const onWebsiteLoaded = () => {
      // Delay slightly for overlay fade-out to begin, then drop card with physics
      setTimeout(() => {
        triggerDropAnimation();
      }, 120);
    };

    if (isLoaderActive) {
      window.addEventListener('website-loaded', onWebsiteLoaded, { once: true });
      // Safety fallback if preloader finishes without event
      safetyTimer = setTimeout(() => {
        if (!droppedRef.current) {
          triggerDropAnimation();
        }
      }, 4000);
    } else {
      // Preloader not active, drop after brief DOM settle
      safetyTimer = setTimeout(() => {
        triggerDropAnimation();
      }, 300);
    }

    // Listen to external navbar toggle button
    const handleToggleEvent = (e) => {
      if (e?.detail?.force !== undefined) {
        setIsOpen(e.detail.force);
        if (e.detail.force) {
          setTimeout(triggerDropAnimation, 80);
        }
      } else {
        setIsOpen(prev => {
          const next = !prev;
          if (next) {
            setTimeout(triggerDropAnimation, 80);
          }
          return next;
        });
      }
    };

    window.addEventListener('toggle-lanyard', handleToggleEvent);

    return () => {
      if (safetyTimer) clearTimeout(safetyTimer);
      window.removeEventListener('website-loaded', onWebsiteLoaded);
      window.removeEventListener('toggle-lanyard', handleToggleEvent);
    };
  }, []);

  // Sync state with navbar toggle button
  useEffect(() => {
    const navBtn = document.getElementById('nav-id-badge-toggle');
    if (navBtn) {
      if (isOpen) {
        navBtn.classList.add('active');
        navBtn.setAttribute('title', 'Fold ID Pass back into navbar');
        const label = navBtn.querySelector('.badge-label');
        if (label) label.textContent = 'FOLD PASS ↑';
      } else {
        navBtn.classList.remove('active');
        navBtn.setAttribute('title', 'Drop ID Pass down from navbar');
        const label = navBtn.querySelector('.badge-label');
        if (label) label.textContent = 'ID PASS ↓';
      }
    }
  }, [isOpen]);

  return (
    <div className={`lanyard-stage-container ${isOpen ? 'is-deployed' : 'is-folded'}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div className="lanyard-canvas-wrapper">
        <Lanyard
          frontImage="images/card-front.png"
          backImage="images/card-back.png"
          strapImage="images/card-band.png"
          strapColor="#111114"
          cardColor="#0f1013"
          finish="glossy"
          metal="gold"
          orientation="portrait"
          cornerRadius={0.22}
          size={0.68}
          strapLength={0.58}
          strapWidth={0.8}
          anchor="center"
          breeze={0.35}
          gravity={1.05}
          damping={0.58}
          elasticity={0.42}
          interactive={true}
          intro={false}
        />
      </div>
    </div>
  );
}

// Mount into #lanyard-root
const container = document.getElementById('lanyard-root');
if (container) {
  const root = createRoot(container);
  root.render(<LanyardApp />);
}
