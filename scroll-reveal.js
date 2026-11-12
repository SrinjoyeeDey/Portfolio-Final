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
    ScrollTrigger.config({ ignoreMobileResize: true });

    const heroLayer = document.getElementById('story-layer-hero');
    const aboutLayer = document.getElementById('story-layer-about');
    const projectsLayer = document.getElementById('story-layer-projects');
    const snapshotsLayer = document.getElementById('story-layer-snapshots');
    const skillsLayer = document.getElementById('story-layer-skills');

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

      gsap.set([aboutLayer, projectsLayer, snapshotsLayer, skillsLayer].filter(Boolean), {
        clearProps: 'all'
      });

      if (projectsLayer) {
        const projectsChildren = projectsLayer.querySelectorAll(
          '.editorial-header-left, .editorial-header-right, .editorial-section-title, .editorial-section-pill, .editorial-section-tagline, .editorial-header-line, .editorial-rows-container, .projects-cinematic-bridge, .interactive-3d-stage'
        );
        gsap.set(projectsChildren, {
          clearProps: 'opacity,transform,filter,visibility'
        });
      }

      // Pinned transition 1: HERO → ABOUT
      // Hero stays pinned at top: 0 while About scrolls UP into the same viewport!
      const envelopeWidget = document.getElementById('floating-envelope-widget');
      let envelopeInitVisible = false;

      const tlHeroAbout = gsap.timeline({
        scrollTrigger: {
          id: 'hero-about-transition-pin',
          trigger: aboutLayer,
          start: 'top bottom',
          end: 'top top',
          pin: heroLayer,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: () => {
            if (!envelopeWidget || envelopeInitVisible) return;
            envelopeInitVisible = true;
            envelopeWidget.classList.remove('envelope-hidden');
            envelopeWidget.classList.add('envelope-visible');
          }
        }
      });

      // Outgoing Hero: GPU-accelerated depth lift & soft fade
      tlHeroAbout.fromTo(heroLayer, {
        y: '0%',
        opacity: 1,
        scale: 1,
        force3D: true
      }, {
        y: '-8%',
        opacity: 0.28,
        scale: 0.965,
        ease: 'none',
        force3D: true,
        duration: 1
      }, 0);

      // Pinned transition 2: PROJECTS → COLLECTION OF MOMENTS (SNAPSHOTS)
      // Scroll-driven transition inspired by ScrollExpandMedia (identical logic & visual language to Snapshots → Skills):
      // 1. Existing project content gradually fades away
      // 2. A visual element appears in the centre and smoothly expands in width and height
      // 3. Existing Projects heading & surrounding content move horizontally in opposite directions (split-apart)
      // 4. Snapshot section becomes visible behind/immediately after and settles naturally into its original layout
      let tlProjectsSnapshots = null;
      if (projectsLayer && snapshotsLayer) {
        tlProjectsSnapshots = gsap.timeline({
          scrollTrigger: {
            id: 'projects-snapshots-transition-pin',
            trigger: snapshotsLayer,
            start: 'top bottom',
            end: 'top top',
            pin: projectsLayer,
            pinSpacing: false,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // 1. Existing Projects heading moves horizontally in opposite directions (split-apart effect)
        const pHeaderLeft = projectsLayer.querySelector('.editorial-header-left') || projectsLayer.querySelector('.editorial-section-title');
        const pHeaderRight = projectsLayer.querySelector('.editorial-header-right') || projectsLayer.querySelector('.editorial-section-tagline');
        if (pHeaderLeft) {
          tlProjectsSnapshots.to(pHeaderLeft, {
            xPercent: -75,
            opacity: 0,
            ease: 'power1.inOut',
            duration: 0.85
          }, 0);
        }

        if (pHeaderRight) {
          tlProjectsSnapshots.to(pHeaderRight, {
            xPercent: 75,
            opacity: 0,
            ease: 'power1.inOut',
            duration: 0.85
          }, 0);
        }

        // 2. Surrounding project content and rows container gradually fade away during later stage of transition
        const pSurroundTargets = projectsLayer.querySelectorAll(
          '.editorial-header-line, .editorial-rows-container'
        );
        if (pSurroundTargets && pSurroundTargets.length > 0) {
          tlProjectsSnapshots.to(pSurroundTargets, {
            opacity: 0,
            y: -28,
            ease: 'power1.out',
            duration: 0.55
          }, 0.35);
        }

        // 3. Visual element appears in the centre & smoothly expands in both width & height, staying centered
        const bridgeElement = projectsLayer.querySelector('.projects-cinematic-bridge');
        const activeStage = projectsLayer.querySelector('.interactive-3d-stage');

        if (bridgeElement) {
          tlProjectsSnapshots.fromTo(bridgeElement, {
            scale: 0.82,
            opacity: 0,
            transformOrigin: '50% 50%',
            force3D: true
          }, {
            scale: 1.5,
            opacity: 0.95,
            transformOrigin: '50% 50%',
            ease: 'power1.inOut',
            force3D: true,
            duration: 0.85
          }, 0);

          tlProjectsSnapshots.to(bridgeElement, {
            opacity: 0,
            scale: 1.75,
            ease: 'power1.in',
            duration: 0.25
          }, 0.75);
        }

        if (activeStage) {
          tlProjectsSnapshots.fromTo(activeStage, {
            scale: 1,
            transformOrigin: '50% 50%',
            force3D: true
          }, {
            scale: 1.45,
            transformOrigin: '50% 50%',
            opacity: 0.22,
            ease: 'power1.inOut',
            force3D: true,
            duration: 1
          }, 0);
        }

        // 4. Outgoing Projects Layer soft depth lift & fade
        tlProjectsSnapshots.fromTo(projectsLayer, {
          y: '0%',
          opacity: 1,
          scale: 1,
          force3D: true
        }, {
          y: '-8%',
          opacity: 0.25,
          scale: 0.97,
          ease: 'none',
          force3D: true,
          duration: 1
        }, 0);

        // 5. Incoming Snapshot Layer (Collection of Moments) smooth settlement into original layout
        const snapshotHeader = snapshotsLayer.querySelector('.pmw-exotic-header');
        const snapshotStage = snapshotsLayer.querySelector('.wall-canvas-stage');

        if (snapshotHeader) {
          tlProjectsSnapshots.fromTo(snapshotHeader, {
            y: 36,
            opacity: 0.4
          }, {
            y: 0,
            opacity: 1,
            ease: 'power1.out',
            duration: 0.75
          }, 0.2);
        }

        if (snapshotStage) {
          tlProjectsSnapshots.fromTo(snapshotStage, {
            scale: 0.96,
            opacity: 0.5
          }, {
            scale: 1,
            opacity: 1,
            ease: 'power1.out',
            duration: 0.85
          }, 0.15);
        }
      }

      // Pinned transition 3: SNAPSHOTS → TOOLS & TECHNOLOGIES
      // Scroll-driven transition inspired by ScrollExpandMedia:
      // 1. Snapshot visual media element expands from original size, growing in width & height, staying centered
      // 2. Surrounding snapshot content fades away
      // 3. Heading rows split horizontally apart in opposite directions
      // 4. Tools & Technologies becomes visible underneath and settles naturally into view
      let tlSnapshotsSkills = null;
      if (snapshotsLayer && skillsLayer) {
        tlSnapshotsSkills = gsap.timeline({
          scrollTrigger: {
            id: 'snapshots-skills-transition-pin',
            trigger: skillsLayer,
            start: 'top bottom',
            end: 'top top',
            pin: snapshotsLayer,
            pinSpacing: false,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // 1. Heading rows split horizontally apart
        const row1 = snapshotsLayer.querySelector('.pmw-display-row-1');
        const row2 = snapshotsLayer.querySelector('.pmw-display-row-2');
        if (row1) {
          tlSnapshotsSkills.to(row1, {
            xPercent: -75,
            opacity: 0,
            ease: 'power1.inOut',
            duration: 0.85
          }, 0);
        }

        if (row2) {
          tlSnapshotsSkills.to(row2, {
            xPercent: 75,
            opacity: 0,
            ease: 'power1.inOut',
            duration: 0.85
          }, 0);
        }

        // 2. Surrounding content fades away
        const surroundTargets = snapshotsLayer.querySelectorAll('.pmw-meta-top-bar, .pmw-display-row-3, .pmw-supporting-desc');
        if (surroundTargets && surroundTargets.length > 0) {
          tlSnapshotsSkills.to(surroundTargets, {
            opacity: 0,
            y: -28,
            ease: 'power1.out',
            duration: 0.6
          }, 0);
        }

        // 3. Visual media element gradually expands from original size, growing smoothly centered
        const visualMedia = snapshotsLayer.querySelector('.wall-canvas-stage') || snapshotsLayer.querySelector('.memory-wall-fullwidth-stage');
        if (visualMedia) {
          tlSnapshotsSkills.fromTo(visualMedia, {
            scale: 1,
            transformOrigin: '50% 50%',
            force3D: true
          }, {
            scale: 1.5,
            transformOrigin: '50% 50%',
            opacity: 0.22,
            ease: 'power1.inOut',
            force3D: true,
            duration: 1
          }, 0);
        }

        // 4. Outgoing Snapshot Layer soft depth lift & fade
        tlSnapshotsSkills.fromTo(snapshotsLayer, {
          y: '0%',
          opacity: 1,
          scale: 1,
          force3D: true
        }, {
          y: '-8%',
          opacity: 0.25,
          scale: 0.97,
          ease: 'none',
          force3D: true,
          duration: 1
        }, 0);
      }

      return () => {
        tlHeroAbout.kill();
        if (tlProjectsSnapshots) tlProjectsSnapshots.kill();
        if (tlSnapshotsSkills) tlSnapshotsSkills.kill();
        gsap.set([heroLayer, aboutLayer, projectsLayer, snapshotsLayer, skillsLayer].filter(Boolean), {
          clearProps: 'all'
        });
      };
    });

    // Mobile: Full cinematic pinned transitions matching desktop visual language
    mm.add('(max-width: 768px)', () => {
      // Clear prior transforms on mobile so sections start clean
      gsap.set([aboutLayer, projectsLayer, snapshotsLayer, skillsLayer].filter(Boolean), {
        clearProps: 'all'
      });
      if (projectsLayer) {
        const projectsChildrenMob = projectsLayer.querySelectorAll(
          '.editorial-header-left, .editorial-header-right, .editorial-section-title, .editorial-rows-container, .projects-cinematic-bridge, .interactive-3d-stage'
        );
        gsap.set(projectsChildrenMob, { clearProps: 'opacity,transform,filter,visibility' });
      }

      // ── Transition 1: HERO → ABOUT (pinned, same as desktop) ─────────────
      const tlHeroAboutMobile = gsap.timeline({
        scrollTrigger: {
          id: 'hero-about-transition-mobile-pin',
          trigger: aboutLayer,
          start: 'top bottom',
          end: 'top top',
          pin: heroLayer,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: () => {
            const envelopeWidget = document.getElementById('floating-envelope-widget');
            if (envelopeWidget) {
              envelopeWidget.classList.remove('envelope-hidden');
              envelopeWidget.classList.add('envelope-visible');
            }
          }
        }
      });

      tlHeroAboutMobile.fromTo(heroLayer, {
        y: '0%',
        opacity: 1,
        scale: 1,
        force3D: true
      }, {
        y: '-6%',
        opacity: 0.35,
        scale: 0.97,
        ease: 'none',
        force3D: true,
        duration: 1
      }, 0);

      // ── Transition 2: PROJECTS → SNAPSHOTS (pinned cinematic, mobile-adapted) ──
      let tlProjectsSnapshotsMob = null;
      if (projectsLayer && snapshotsLayer) {
        tlProjectsSnapshotsMob = gsap.timeline({
          scrollTrigger: {
            id: 'projects-snapshots-transition-mobile-pin',
            trigger: snapshotsLayer,
            start: 'top bottom',
            end: 'top top',
            pin: projectsLayer,
            pinSpacing: false,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // 1. Projects heading split-apart (reduced xPercent for narrow screens)
        const pHeaderLeftMob = projectsLayer.querySelector('.editorial-header-left') || projectsLayer.querySelector('.editorial-section-title');
        const pHeaderRightMob = projectsLayer.querySelector('.editorial-header-right') || projectsLayer.querySelector('.editorial-section-tagline');
        if (pHeaderLeftMob) {
          tlProjectsSnapshotsMob.to(pHeaderLeftMob, {
            xPercent: -50,
            opacity: 0,
            ease: 'power1.inOut',
            duration: 0.85
          }, 0);
        }
        if (pHeaderRightMob) {
          tlProjectsSnapshotsMob.to(pHeaderRightMob, {
            xPercent: 50,
            opacity: 0,
            ease: 'power1.inOut',
            duration: 0.85
          }, 0);
        }

        // 2. Surrounding project content fades
        const pSurroundMob = projectsLayer.querySelectorAll('.editorial-rows-container');
        if (pSurroundMob && pSurroundMob.length > 0) {
          tlProjectsSnapshotsMob.to(pSurroundMob, {
            opacity: 0,
            y: -20,
            ease: 'power1.out',
            duration: 0.55
          }, 0.35);
        }

        // 3. Cinematic bridge element (mobile-sized, smaller scale)
        const bridgeMob = projectsLayer.querySelector('.projects-cinematic-bridge');
        if (bridgeMob) {
          tlProjectsSnapshotsMob.fromTo(bridgeMob, {
            scale: 0.72,
            opacity: 0,
            transformOrigin: '50% 50%',
            force3D: true
          }, {
            scale: 1.1,
            opacity: 0.9,
            transformOrigin: '50% 50%',
            ease: 'power1.inOut',
            force3D: true,
            duration: 0.85
          }, 0);
          tlProjectsSnapshotsMob.to(bridgeMob, {
            opacity: 0,
            scale: 1.35,
            ease: 'power1.in',
            duration: 0.25
          }, 0.75);
        }

        // 4. Outgoing Projects layer depth lift & fade
        tlProjectsSnapshotsMob.fromTo(projectsLayer, {
          y: '0%',
          opacity: 1,
          scale: 1,
          force3D: true
        }, {
          y: '-6%',
          opacity: 0.25,
          scale: 0.97,
          ease: 'none',
          force3D: true,
          duration: 1
        }, 0);

        // 5. Incoming Snapshots: header & mobile grid settle in
        const snapshotHeaderMob = snapshotsLayer.querySelector('.pmw-exotic-header');
        // On mobile the grid is .pmw-mobile-view-container; fall back to desktop stage
        const snapshotStageMob = snapshotsLayer.querySelector('.pmw-mobile-view-container') || snapshotsLayer.querySelector('.wall-canvas-stage');

        if (snapshotHeaderMob) {
          tlProjectsSnapshotsMob.fromTo(snapshotHeaderMob, {
            y: 28,
            opacity: 0.4
          }, {
            y: 0,
            opacity: 1,
            ease: 'power1.out',
            duration: 0.75
          }, 0.2);
        }
        if (snapshotStageMob) {
          tlProjectsSnapshotsMob.fromTo(snapshotStageMob, {
            scale: 0.96,
            opacity: 0.5
          }, {
            scale: 1,
            opacity: 1,
            ease: 'power1.out',
            duration: 0.85
          }, 0.15);
        }
      }

      // ── Transition 3: SNAPSHOTS → SKILLS (pinned cinematic, mobile-adapted) ──
      let tlSnapshotsSkillsMob = null;
      if (snapshotsLayer && skillsLayer) {
        tlSnapshotsSkillsMob = gsap.timeline({
          scrollTrigger: {
            id: 'snapshots-skills-transition-mobile-pin',
            trigger: skillsLayer,
            start: 'top bottom',
            end: 'top top',
            pin: snapshotsLayer,
            pinSpacing: false,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // 1. Heading rows split apart (reduced xPercent for mobile)
        const row1Mob = snapshotsLayer.querySelector('.pmw-display-row-1');
        const row2Mob = snapshotsLayer.querySelector('.pmw-display-row-2');
        if (row1Mob) {
          tlSnapshotsSkillsMob.to(row1Mob, {
            xPercent: -50,
            opacity: 0,
            ease: 'power1.inOut',
            duration: 0.85
          }, 0);
        }
        if (row2Mob) {
          tlSnapshotsSkillsMob.to(row2Mob, {
            xPercent: 50,
            opacity: 0,
            ease: 'power1.inOut',
            duration: 0.85
          }, 0);
        }

        // 2. Surrounding content fades
        const surroundMob = snapshotsLayer.querySelectorAll('.pmw-meta-top-bar, .pmw-display-row-3, .pmw-supporting-desc');
        if (surroundMob && surroundMob.length > 0) {
          tlSnapshotsSkillsMob.to(surroundMob, {
            opacity: 0,
            y: -20,
            ease: 'power1.out',
            duration: 0.6
          }, 0);
        }

        // 3. Mobile grid expands (mobile uses .pmw-mobile-view-container)
        const visualMediaMob = snapshotsLayer.querySelector('.pmw-mobile-view-container') || snapshotsLayer.querySelector('.wall-canvas-stage') || snapshotsLayer.querySelector('.memory-wall-fullwidth-stage');
        if (visualMediaMob) {
          tlSnapshotsSkillsMob.fromTo(visualMediaMob, {
            scale: 1,
            transformOrigin: '50% 50%',
            force3D: true
          }, {
            scale: 1.08,
            transformOrigin: '50% 50%',
            opacity: 0.22,
            ease: 'power1.inOut',
            force3D: true,
            duration: 1
          }, 0);
        }

        // 4. Outgoing Snapshots layer depth lift & fade
        tlSnapshotsSkillsMob.fromTo(snapshotsLayer, {
          y: '0%',
          opacity: 1,
          scale: 1,
          force3D: true
        }, {
          y: '-6%',
          opacity: 0.25,
          scale: 0.97,
          ease: 'none',
          force3D: true,
          duration: 1
        }, 0);
      }

      // Cleanup on matchMedia exit
      return () => {
        tlHeroAboutMobile.kill();
        if (tlProjectsSnapshotsMob) tlProjectsSnapshotsMob.kill();
        if (tlSnapshotsSkillsMob) tlSnapshotsSkillsMob.kill();
        gsap.set([heroLayer, aboutLayer, projectsLayer, snapshotsLayer, skillsLayer].filter(Boolean), {
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

  const refreshScrollTriggersAndLenis = () => {
    if (window.lenis && typeof window.lenis.resize === 'function') {
      window.lenis.resize();
    }
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  };

  window.addEventListener('preloader:completed', () => {
    requestAnimationFrame(refreshScrollTriggersAndLenis);
  }, { once: true });

  window.addEventListener('memory-wall-ready', refreshScrollTriggersAndLenis);
  document.fonts?.ready?.then(refreshScrollTriggersAndLenis);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLoaderCoordination);
  } else {
    setupLoaderCoordination();
  }

  window.initHeroAboutScrollUp = initHeroAboutScrollUp;
})();
