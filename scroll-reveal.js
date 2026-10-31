/**
 * Smooth Layer Scrolling Engine
 * (In-viewport scroll pinning effect removed per user request; normal natural scroll preserved)
 */

(function () {
  'use strict';

  // State
  let isInitialized = false;
  let isTakeoffUnlocked = true;

  function resetLayerStyles() {
    const layers = document.querySelectorAll('.story-layer');
    layers.forEach(layer => {
      layer.style.filter = 'none';
      layer.style.opacity = '1';
      layer.style.transform = 'none';
      layer.style.clipPath = 'none';
      layer.style.visibility = 'visible';
    });

    if (typeof gsap !== 'undefined') {
      try {
        gsap.set('.story-layer', {
          clearProps: 'filter,clipPath,scale,opacity,transform,y'
        });
      } catch (e) {
        // Fallback already handled via direct inline styles
      }
    }
  }

  function unlockFeaturedCreations(autoScroll = true) {
    if (isTakeoffUnlocked) return;
    isTakeoffUnlocked = true;

    // Remove lock from all locked layers
    document.querySelectorAll('.featured-creations-locked').forEach(el => {
      el.classList.remove('featured-creations-locked');
    });

    resetLayerStyles();

    // Trigger resize event for CardSwap and Three.js viewports
    window.dispatchEvent(new Event('resize'));

    // Smoothly glide into Featured Creations
    if (autoScroll) {
      setTimeout(() => {
        const projectsLayer = document.getElementById('story-layer-projects');
        if (projectsLayer) {
          projectsLayer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 800);
    }
  }

  window.unlockFeaturedCreations = unlockFeaturedCreations;

  function initScrollReveal() {
    if (isInitialized) return;
    isInitialized = true;

    // Kill any prior layer transition ScrollTriggers if they exist
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars && st.vars.id && st.vars.id.startsWith('layer-transition-')) {
          st.kill(true);
        }
      });
    }

    // Ensure all layers are fully visible and unpinned in normal document flow
    resetLayerStyles();

    // Setup seamless navigation for anchor links and Mac dock
    setupSmoothLayerNavigation();
  }

  function setupSmoothLayerNavigation() {
    // Intercept navigation links targeting sections inside layers
    const navAnchors = document.querySelectorAll('a[href^="#"], .dock-item[data-href^="#"]');

    navAnchors.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href') || this.getAttribute('data-href');
        if (!href || href === '#' || href === '#!') return;

        const targetId = href.startsWith('#') ? href.slice(1) : href;
        if (!targetId) return;

        if (targetId === 'hero') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Refresh layout calculations when window resizes
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 150);
    });
  }

  // Lifecycle coordination with loader
  function setupLoaderCoordination() {
    const loaderOverlay = document.getElementById('section-loader-overlay');
    const isLoaderActive = loaderOverlay && loaderOverlay.classList.contains('active');

    if (isLoaderActive) {
      document.body.classList.add('preloader-locked');

      window.addEventListener('website-loaded', () => {
        document.body.classList.remove('preloader-locked');
        setTimeout(initScrollReveal, 250);
      }, { once: true });

      // Safety timeout in case website-loaded doesn't fire
      setTimeout(() => {
        document.body.classList.remove('preloader-locked');
        if (!isInitialized) {
          initScrollReveal();
        }
      }, 4200);
    } else {
      // Preloader not active, initialize directly
      setTimeout(initScrollReveal, 200);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLoaderCoordination);
  } else {
    setupLoaderCoordination();
  }

  // Export for external control if needed
  window.initScrollReveal = initScrollReveal;
})();
