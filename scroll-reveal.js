/**
 * Cinematic Scroll-Driven Layer-by-Layer Reveal Engine
 * 
 * Combines:
 * - Reference 1: Outgoing layer blur filter ["blur(0px)", "blur(10px)"] + depth compression
 * - Reference 2: Incoming layer center-split clipPath ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"]
 * 
 * Preserves the loader, hero opening, and all original content and interactions.
 */

(function () {
  'use strict';

  // State
  let isInitialized = false;
  let triggers = [];
  let isTakeoffUnlocked = false;

  function unlockFeaturedCreations(autoScroll = true) {
    if (isTakeoffUnlocked) return;
    isTakeoffUnlocked = true;

    // Remove lock from all locked layers
    document.querySelectorAll('.featured-creations-locked').forEach(el => {
      el.classList.remove('featured-creations-locked');
    });

    // Rebuild scroll triggers for all layers
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(st => st.kill());
      triggers = [];
      isInitialized = false;
      initScrollReveal();
    }

    // Trigger resize event for CardSwap and Three.js viewports
    window.dispatchEvent(new Event('resize'));

    // Smoothly glide into Featured Creations
    if (autoScroll) {
      setTimeout(() => {
        const projectsLayer = document.getElementById('story-layer-projects');
        if (projectsLayer && typeof ScrollTrigger !== 'undefined') {
          const st = ScrollTrigger.getAll().find(s => s.trigger === projectsLayer);
          if (st) {
            window.scrollTo({
              top: st.end + 2,
              behavior: 'smooth'
            });
            return;
          }
        }
        if (projectsLayer) {
          projectsLayer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1400);
    }
  }

  window.unlockFeaturedCreations = unlockFeaturedCreations;

  function initScrollReveal() {
    if (isInitialized) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not available, retrying in 100ms...');
      setTimeout(initScrollReveal, 100);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Check accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      console.log('Reduced motion preferred: Layered scroll animations disabled.');
      return;
    }

    const layers = Array.from(document.querySelectorAll('.story-layer:not(.featured-creations-locked)'));
    if (layers.length < 2) {
      console.warn('Not enough .story-layer elements found for layered reveal:', layers.length);
      return;
    }

    isInitialized = true;

    // Reset scroll to top before building triggers if loader just finished
    if (window.scrollY < 50) {
      window.scrollTo(0, 0);
    }

    // Set initial properties on all layers: all layers use clean full-width geometry
    layers.forEach((layer, idx) => {
      if (idx === 0) {
        gsap.set(layer, {
          clipPath: 'none',
          filter: 'blur(0px)',
          scale: 1,
          opacity: 1
        });
      } else {
        // Incoming layers start softly dissolved and emerge quickly into crisp focus
        gsap.set(layer, {
          clipPath: 'none',
          filter: 'blur(5px)',
          scale: 0.985,
          opacity: 0.6
        });
      }
    });

    // Create seamless melt & merge transition for each adjacent layer pair
    for (let i = 0; i < layers.length - 1; i++) {
      const currentLayer = layers[i];
      const nextLayer = layers[i + 1];

      const tl = gsap.timeline({
        scrollTrigger: {
          id: `layer-transition-${i}`,
          trigger: nextLayer,
          start: "top bottom",
          end: "top top",
          scrub: 0.65, // Smooth responsive scrub
          pin: currentLayer,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            nextLayer.style.visibility = 'visible';
          },
          onLeaveBack: () => {
            gsap.set(nextLayer, {
              filter: 'blur(5px)',
              scale: 0.985,
              opacity: 0.6
            });
            gsap.set(currentLayer, {
              filter: 'blur(0px)',
              scale: 1,
              opacity: 1,
              y: '0%'
            });
          }
        }
      });

      // Outgoing layer: dissolves into background depth blur ["blur(0px)", "blur(8px)"] over the full scroll duration
      tl.fromTo(currentLayer, {
        filter: "blur(0px)",
        scale: 1,
        opacity: 1,
        y: "0%"
      }, {
        filter: "blur(8px)",
        scale: 0.96,
        opacity: 0.35,
        y: "-5%",
        duration: 1.0,
        ease: "none"
      }, 0);

      // Incoming layer: melts into crystal clarity rapidly so that by 25% scroll progress
      // (and throughout midway/50%), blurring is completely gone and text is 100% sharp
      tl.fromTo(nextLayer, {
        filter: "blur(4px)",
        opacity: 0.65
      }, {
        filter: "blur(0px)",
        opacity: 1,
        duration: 0.25,
        ease: "power2.out"
      }, 0);

      tl.fromTo(nextLayer, {
        scale: 0.99
      }, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      }, 0);

      triggers.push(tl.scrollTrigger);
    }

    // Refresh triggers to ensure exact coordinate calculations
    ScrollTrigger.refresh();

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

        // If target is locked, navigate to launchpad and launch rocket
        if (!isTakeoffUnlocked && (targetId === 'projects' || targetId === 'skills' || targetId === 'experience' || targetId === 'contact' || targetId === 'cli-terminal')) {
          e.preventDefault();
          const flightLayer = document.getElementById('story-layer-flight');
          if (flightLayer && typeof ScrollTrigger !== 'undefined') {
            const flightST = ScrollTrigger.getAll().find(st => st.trigger === flightLayer);
            if (flightST) {
              window.scrollTo({ top: flightST.end + 2, behavior: 'smooth' });
            } else {
              flightLayer.scrollIntoView({ behavior: 'smooth' });
            }
          }
          setTimeout(() => {
            const craftBtn = document.querySelector('.flying-button__craft');
            if (craftBtn) craftBtn.click();
            else unlockFeaturedCreations(true);
          }, 600);
          return;
        }

        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        const storyLayer = targetEl.closest('.story-layer');
        if (storyLayer && typeof ScrollTrigger !== 'undefined') {
          e.preventDefault();
          // Find the ScrollTrigger that brings this story-layer into full view
          const layerST = ScrollTrigger.getAll().find(st => st.trigger === storyLayer);
          if (layerST) {
            // Scroll to the end of the reveal transition where it is fully unclipped
            window.scrollTo({
              top: layerST.end + 2,
              behavior: 'smooth'
            });
            return;
          }
        }
      });
    });

    // Refresh ScrollTrigger when window resizes
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

  // Lifecycle coordination with loader:
  // Respect requirement:
  // 1. Existing loader plays 0% -> 100%
  // 2. Once finished, opening animation runs
  // 3. Hero appears
  // 4. Then layered scroll starts when visitor scrolls
  function setupLoaderCoordination() {
    const loaderOverlay = document.getElementById('section-loader-overlay');
    const isLoaderActive = loaderOverlay && loaderOverlay.classList.contains('active');

    if (isLoaderActive) {
      document.body.classList.add('preloader-locked');

      window.addEventListener('website-loaded', () => {
        document.body.classList.remove('preloader-locked');
        // Allow hero intro to settle before attaching ScrollTriggers
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
