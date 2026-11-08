/**
 * SMOOTH PINNED VIEWPORT SLIDE-UP ENGINE: HERO → ABOUT SECTION
 * 
 * - Hero section is pinned at top: 0 in the viewport (pinSpacing: false)
 * - As the visitor scrolls down, About scrolls UP into the same viewport all at once over Hero
 * - Hero subtly scales & fades with depth underneath
 * - When About reaches top: 0, it fills the viewport and stays in view naturally
 * - Normal page scrolling continues down into Projects when scrolling past About
 * - Scrolling back up smoothly slides About down, revealing Hero again
 */

(function () {
  'use strict';

  let isInitialized = false;

  function initHeroAboutScrollUp() {
    if (isInitialized) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initHeroAboutScrollUp, 80);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const heroLayer = document.getElementById('story-layer-hero');
    const aboutLayer = document.getElementById('story-layer-about');

    if (!heroLayer || !aboutLayer) {
      console.warn('Hero or About story layers not found in DOM.');
      return;
    }

    isInitialized = true;

    // Responsive & reduced motion handling
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      // Clear any prior per-element transforms so everything in About appears complete and intact
      const aboutChildren = aboutLayer.querySelectorAll(
        '.glass-card-wrapper, .work-together-card, .sub-section-box, .about-header-bar, .tilted-hello-wrap, .about-bio-lead, .about-bio-body, .glass-icon-btn, .circle-arrow-btn, .software-badge'
      );
      gsap.set(aboutChildren, {
        clearProps: 'opacity,transform,filter,visibility'
      });

      gsap.set(aboutLayer, {
        clearProps: 'all'
      });

      // Pinned transition:
      // Hero stays pinned at top: 0 while About scrolls UP into the same viewport!
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'hero-about-transition-pin',
          trigger: aboutLayer,
          start: 'top bottom',
          end: 'top top',
          pin: heroLayer,
          pinSpacing: false,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Coordinate floating email envelope widget
            const envelopeWidget = document.getElementById('floating-envelope-widget');
            if (envelopeWidget) {
              const projectsEl = document.getElementById('projects');
              const projectsRect = projectsEl ? projectsEl.getBoundingClientRect() : null;
              const isProjects = projectsRect ? projectsRect.top <= window.innerHeight * 0.55 : false;

              if (self.progress < 0.25) {
                envelopeWidget.classList.add('envelope-hidden');
                envelopeWidget.classList.remove('envelope-visible', 'envelope-side-left');
              } else {
                envelopeWidget.classList.remove('envelope-hidden');
                envelopeWidget.classList.add('envelope-visible');
                if (isProjects) {
                  envelopeWidget.classList.add('envelope-side-left');
                } else {
                  envelopeWidget.classList.remove('envelope-side-left');
                }
              }
            }
          }
        }
      });

      // Outgoing Hero: subtle depth lift & soft fade
      tl.fromTo(heroLayer, {
        y: '0%',
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)'
      }, {
        y: '-10%',
        opacity: 0.35,
        scale: 0.97,
        filter: 'blur(4px)',
        ease: 'none',
        duration: 1
      }, 0);

      return () => {
        tl.kill();
        gsap.set([heroLayer, aboutLayer], {
          clearProps: 'all'
        });
      };
    });

    // Setup seamless navigation for anchor links and Mac dock
    setupSmoothLayerNavigation();
  }

  function setupSmoothLayerNavigation() {
    const navAnchors = document.querySelectorAll('a[href^="#"], .dock-item[data-href^="#"]');

    navAnchors.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href') || this.getAttribute('data-href');
        if (!href || href === '#' || href === '#!') return;

        const targetId = href.startsWith('#') ? href.slice(1) : href;
        if (!targetId) return;

        if (targetId === 'hero') {
          e.preventDefault();
          if (window.lenis) {
            window.lenis.scrollTo(0, { duration: 1.0 });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          return;
        }

        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        e.preventDefault();
        if (window.lenis) {
          window.lenis.scrollTo(targetEl, { offset: 0, duration: 1.0 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
        setTimeout(initHeroAboutScrollUp, 250);
      }, { once: true });

      setTimeout(() => {
        document.body.classList.remove('preloader-locked');
        if (!isInitialized) {
          initHeroAboutScrollUp();
        }
      }, 4200);
    } else {
      setTimeout(initHeroAboutScrollUp, 200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLoaderCoordination);
  } else {
    setupLoaderCoordination();
  }

  window.initHeroAboutScrollUp = initHeroAboutScrollUp;
})();
