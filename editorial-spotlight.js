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

      // Scroll listener check for immediate responsive feedback
      function checkSpotlightScroll() {
        const rect = targetLayer.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
        toggleSpotlightMode(inView);
      }

      window.addEventListener('scroll', checkSpotlightScroll, { passive: true });
      checkSpotlightScroll();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
