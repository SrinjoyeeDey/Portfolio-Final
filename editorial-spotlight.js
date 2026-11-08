/**
 * Lanyard Spotlight Controller
 * - Hooks up #btnSwingBadge to trigger physics swings
 * - Smooth scroll for anchor navigation links
 * - Intersection trigger on section scroll
 */
(function initLanyardSpotlight() {
  'use strict';

  function setup() {
    const section = document.getElementById('spotlight');
    if (!section) return;

    // Smooth scroll for CTAs
    const links = section.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          if (window.lenis && typeof window.lenis.scrollTo === 'function') {
            window.lenis.scrollTo(target, { duration: 1.1 });
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // "SWING PASS" button interaction
    const swingBtn = document.getElementById('btnSwingBadge');
    if (swingBtn) {
      swingBtn.addEventListener('click', () => {
        if (window.triggerLanyardDrop) {
          window.triggerLanyardDrop();
        } else {
          window.dispatchEvent(new CustomEvent('drop-lanyard-card'));
        }

        // Add temporary bounce feedback to button
        swingBtn.style.transform = 'scale(0.94)';
        setTimeout(() => {
          swingBtn.style.transform = '';
        }, 150);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
