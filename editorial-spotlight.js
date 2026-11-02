/**
 * Editorial Spotlight Controller
 * Handles smooth glide down to the About section.
 */
(function initEditorialSpotlight() {
  'use strict';

  function setup() {
    const section = document.getElementById('spotlight');
    if (!section) return;

    const glideBtn = section.querySelector('.spotlight-glide-btn');
    const scrollNav = section.querySelector('.spotlight-scroll-nav') || section.querySelector('.spotlight-scroll-indicator');
    const handleScrollDown = () => {
      const aboutSection = document.getElementById('story-layer-about') || document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (glideBtn) glideBtn.addEventListener('click', handleScrollDown);
    if (scrollNav) {
      scrollNav.style.cursor = 'pointer';
      scrollNav.addEventListener('click', handleScrollDown);
    }

    // Hide the floating color regulator dock, main navbar, and mac dock when this section is in view
    const sideDock = document.getElementById('side-regulator-dock');
    const macDock = document.getElementById('mac-dock');
    const navbar = document.getElementById('navbar');
    const targetLayer = document.getElementById('story-layer-spotlight') || section;

    const toggleSpotlightMode = (isActive) => {
      if (sideDock) {
        if (isActive) sideDock.classList.add('section-hidden');
        else sideDock.classList.remove('section-hidden');
      }
      if (macDock) {
        if (isActive) macDock.classList.add('section-hidden');
        else macDock.classList.remove('section-hidden');
      }
      if (navbar) {
        if (isActive) navbar.classList.add('spotlight-active');
        else navbar.classList.remove('spotlight-active');
      }
    };

    if (sideDock || navbar || macDock) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            toggleSpotlightMode(entry.isIntersecting);
          });
        },
        {
          root: null,
          threshold: 0.15,
          rootMargin: '-5% 0px -5% 0px'
        }
      );

      observer.observe(targetLayer);
    }

    // ==========================================================================
    // Interactive Cursor Spotlight Torch Reveal
    // Follows the cursor smoothly with fluid lerp inertia.
    // Inside the circle, color photo is revealed; outside is pure black.
    // ==========================================================================
    const stage = section;
    let rect = stage.getBoundingClientRect();
    const updateRect = () => {
      rect = stage.getBoundingClientRect();
    };

    window.addEventListener('resize', updateRect, { passive: true });
    window.addEventListener('scroll', updateRect, { passive: true });

    let isPointerInside = false;
    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let rafId = null;

    function applyCoords(x, y) {
      stage.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
      stage.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    }

    // Hide spotlight completely by default (no static circle, only pure B&W image)
    stage.style.setProperty('--spotlight-active', '0');
    applyCoords(-9999, -9999);

    function animateSpotlight() {
      const ease = 0.22; // smooth and instant response
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      applyCoords(currentX, currentY);

      if (isPointerInside || Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
        rafId = requestAnimationFrame(animateSpotlight);
      } else {
        rafId = null;
      }
    }

    function onPointerMove(e) {
      if (!isPointerInside) {
        isPointerInside = true;
        stage.style.setProperty('--spotlight-active', '1');
        currentX = e.clientX - rect.left;
        currentY = e.clientY - rect.top;
      }
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      if (!rafId) {
        rafId = requestAnimationFrame(animateSpotlight);
      }
    }

    stage.addEventListener('pointerenter', (e) => {
      updateRect();
      isPointerInside = true;
      currentX = e.clientX - rect.left;
      currentY = e.clientY - rect.top;
      targetX = currentX;
      targetY = currentY;
      applyCoords(currentX, currentY);
      stage.style.setProperty('--spotlight-active', '1');
      if (!rafId) rafId = requestAnimationFrame(animateSpotlight);
    });

    stage.addEventListener('pointermove', onPointerMove, { passive: true });

    stage.addEventListener('pointerleave', () => {
      isPointerInside = false;
      // Fade out completely when cursor leaves - NO static circle remains!
      stage.style.setProperty('--spotlight-active', '0');
    });

    // Touch support for mobile / tablets
    stage.addEventListener('pointerdown', (e) => {
      updateRect();
      onPointerMove(e);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
