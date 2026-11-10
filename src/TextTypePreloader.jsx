'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import TextType from './TextType';
import './TextTypePreloader.css';

const GREETINGS = [
  { text: 'Hello', lang: 'English', code: 'EN' },
  { text: 'Bonjour', lang: 'French', code: 'FR' },
  { text: 'Ciao', lang: 'Italian', code: 'IT' },
  { text: 'Hola', lang: 'Spanish', code: 'ES' },
  { text: 'नमस्ते', lang: 'Hindi', code: 'HI' },
  { text: 'こんにちは', lang: 'Japanese', code: 'JA' }
];

const GREETING_TEXTS = GREETINGS.map(g => g.text);

export default function TextTypePreloader() {
  const [phase, setPhase] = useState('typing'); // 'typing' | 'masked'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [modelStatus, setModelStatus] = useState(() => (
    typeof window !== 'undefined' && window.__hero3DState ? window.__hero3DState.status : 'loading'
  ));
  const [modelProgress, setModelProgress] = useState(() => (
    typeof window !== 'undefined' && window.__hero3DState ? window.__hero3DState.progress : 0
  ));
  const [greetingsDone, setGreetingsDone] = useState(false);

  const containerRef = useRef(null);
  const maskHoleRef = useRef(null);
  const outlineRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const subtitleRef = useRef(null);
  const hasExitedRef = useRef(false);
  const isZoomingRef = useRef(false);

  const activeGreeting = GREETINGS[currentIndex % GREETINGS.length] || GREETINGS[0];

  // Progress reflects both greeting sequence (50%) and 3D model load (50%)
  const greetingProgress = ((currentIndex + 1) / GREETINGS.length) * 50;
  const modelProgressContribution = (modelProgress || 0) * 0.5;
  const progressPercent = phase === 'masked'
    ? 100
    : Math.min(100, Math.round(greetingProgress + modelProgressContribution));

  // Check mobile screen size
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Listen to 3D model lifecycle events dispatched by hero-3d-model.js
  useEffect(() => {
    const handleProgress = (e) => {
      if (e.detail && typeof e.detail.progress === 'number') {
        setModelProgress(e.detail.progress);
      }
    };
    const handleLoaded = () => {
      setModelStatus('success');
      setModelProgress(100);
    };
    const handleError = () => {
      setModelStatus('error');
    };

    window.addEventListener('hero-3d:progress', handleProgress);
    window.addEventListener('hero-3d:loaded', handleLoaded);
    window.addEventListener('hero-3d:error', handleError);

    // Initial check in case model loaded before preloader mounted
    if (typeof window !== 'undefined' && window.__hero3DState) {
      if (window.__hero3DState.status === 'success') {
        setModelStatus('success');
        setModelProgress(100);
      } else if (window.__hero3DState.status === 'error') {
        setModelStatus('error');
      }
    }

    return () => {
      window.removeEventListener('hero-3d:progress', handleProgress);
      window.removeEventListener('hero-3d:loaded', handleLoaded);
      window.removeEventListener('hero-3d:error', handleError);
    };
  }, []);

  // Buttery Smooth Zoom-In Portal Transition directly into the Hero Section
  const startZoomExit = useCallback(() => {
    if (hasExitedRef.current || isZoomingRef.current) return;
    isZoomingRef.current = true;
    hasExitedRef.current = true;

    // Immediately unlock body scroll & Lenis so scroll is ready
    document.body.style.overflow = '';
    if (window.lenis && typeof window.lenis.start === 'function') {
      window.lenis.start();
    }

    const container = containerRef.current;
    const maskHole = maskHoleRef.current;
    const outline = outlineRef.current;
    const header = headerRef.current;
    const footer = footerRef.current;
    const subtitle = subtitleRef.current;
    const crosshairs = container?.querySelectorAll('.tt-preloader__crosshair');

    const tl = gsap.timeline({
      onComplete: () => {
        if (container) container.style.display = 'none';
        document.body.style.overflow = '';
        if (window.lenis && typeof window.lenis.start === 'function') {
          window.lenis.start();
        }
        window.dispatchEvent(new CustomEvent('preloader:completed'));
        window.dispatchEvent(new CustomEvent('website-loaded'));
      }
    });

    // 1. Gently fade out UI elements (header, footer, badges)
    tl.to([header, footer, subtitle, crosshairs], {
      opacity: 0,
      y: -14,
      duration: 0.32,
      ease: 'power2.out'
    });

    // 2. Camera Zoom Punch: Smoothly expand the bubbly Fredoka HELLO aperture into the hero room!
    if (maskHole && outline) {
      tl.to(
        [maskHole, outline],
        {
          scale: 28,
          duration: 1.25,
          ease: 'power3.inOut',
          svgOrigin: '960 540'
        },
        '-=0.12'
      );
    }

    // 3. Dissolve light studio overlay as the hole expands past screen edges
    if (container) {
      tl.to(
        container,
        {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.inOut'
        },
        '-=0.45'
      );
    }
  }, []);

  // When all multilingual greetings finish typing
  const handleTypingComplete = useCallback(() => {
    setGreetingsDone(true);
  }, []);

  // Transition into masked hero aperture ONLY when BOTH greetings and 3D model are ready
  useEffect(() => {
    if (greetingsDone && modelStatus === 'success' && phase === 'typing') {
      setPhase('masked');
    }
  }, [greetingsDone, modelStatus, phase]);

  // In 'masked' phase, animate HELLO cutout entrance and mouse parallax
  useEffect(() => {
    if (phase === 'masked') {
      const maskHole = maskHoleRef.current;
      const outline = outlineRef.current;

      // Animate HELLO aperture opening up smoothly
      if (maskHole && outline) {
        gsap.fromTo(
          [maskHole, outline],
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.65, ease: 'power2.out', svgOrigin: '960 540' }
        );
      }

      // Smooth mouse parallax on the cutout hole looking into the hero
      const handleMouseMove = (e) => {
        if (isZoomingRef.current) return;
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        if (maskHole && outline) {
          gsap.to([maskHole, outline], {
            x: nx * 18,
            y: ny * 12,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // Automatically trigger the smooth zoom punch after showcasing the live hero through the letters
      const timer = setTimeout(() => {
        startZoomExit();
      }, 750);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(timer);
      };
    }
  }, [phase, startZoomExit]);

  // Strictly block keyboard, wheel, touch-scroll, or bypass while loader is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (window.lenis && typeof window.lenis.stop === 'function') {
      window.lenis.stop();
    }

    const handleKeyDown = (e) => {
      if (['Escape', 'Enter', ' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', 'Tab'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      // Normal scrolling is restored strictly after transition completes in startZoomExit
    };
  }, []);

  // Handle TextType index update
  const handleIndexChange = useCallback((idx) => {
    setCurrentIndex(idx);
  }, []);

  const fontSize = isMobile ? '160' : '240';

  return (
    <div
      ref={containerRef}
      className="tt-preloader"
      data-lenis-prevent
      aria-label="Interactive Preloader"
    >
      {/* SVG HERO PORTAL MASK (LIGHT STUDIO THEME + FREDOKA BUBBLE APERTURE) */}
      <svg
        className="tt-preloader__portal-svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="hero-portal-mask">
            {/* White keeps the ivory overlay opaque everywhere */}
            <rect x="0" y="0" width="1920" height="1080" fill="#ffffff" />

            {/* Black text cuts out a transparent portal into the live hero section */}
            {phase === 'masked' ? (
              <g ref={maskHoleRef} style={{ transformOrigin: '960px 540px' }}>
                <text
                  x="960"
                  y="540"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#000000"
                  fontFamily="'Fredoka', cursive, sans-serif"
                  fontWeight="800"
                  fontSize={fontSize}
                  letterSpacing="-0.02em"
                >
                  HELLO
                </text>
              </g>
            ) : null}
          </mask>
        </defs>

        {/* Ivory overlay rect, with hole cut out into the hero section in phase 2 */}
        <rect
          x="0"
          y="0"
          width="1920"
          height="1080"
          fill="#ECECE7"
          mask="url(#hero-portal-mask)"
        />

        {/* Crisp Charcoal & Sunshine Yellow Outline framing the cutout letters */}
        {phase === 'masked' ? (
          <g ref={outlineRef} style={{ transformOrigin: '960px 540px' }}>
            <text
              x="960"
              y="540"
              textAnchor="middle"
              dominantBaseline="central"
              fill="none"
              stroke="#222428"
              strokeWidth="3.5"
              fontFamily="'Fredoka', cursive, sans-serif"
              fontWeight="800"
              fontSize={fontSize}
              letterSpacing="-0.02em"
              opacity="0.95"
            >
              HELLO
            </text>
            <text
              x="960"
              y="540"
              textAnchor="middle"
              dominantBaseline="central"
              fill="none"
              stroke="#FFBD12"
              strokeWidth="1.5"
              fontFamily="'Fredoka', cursive, sans-serif"
              fontWeight="800"
              fontSize={fontSize}
              letterSpacing="-0.02em"
              opacity="0.8"
            >
              HELLO
            </text>
          </g>
        ) : null}
      </svg>

      {/* Light Studio Glow & Grid */}
      <div
        className="tt-preloader__bg-glow"
        style={{ opacity: phase === 'masked' ? 0 : 1 }}
      />
      <div
        className="tt-preloader__bg-grid"
        style={{ opacity: phase === 'masked' ? 0 : 0.7 }}
      />

      {/* Decorative Crosshairs */}
      <div className="tt-preloader__crosshair tt-preloader__crosshair--tl" />
      <div className="tt-preloader__crosshair tt-preloader__crosshair--tr" />
      <div className="tt-preloader__crosshair tt-preloader__crosshair--bl" />
      <div className="tt-preloader__crosshair tt-preloader__crosshair--br" />

      {/* Main UI Layout */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 4,
          pointerEvents: 'none'
        }}
      >
        {/* Top Header */}
        <header
          ref={headerRef}
          className="tt-preloader__header"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="tt-preloader__brand">
            <span className="tt-preloader__brand-dot" />
            <span>SRINJOYEE DEY • PORTFOLIO</span>
          </div>

          <div
            className={`tt-preloader__lang-pill ${
              phase === 'masked' ? 'tt-preloader__lang-pill--masked' : ''
            }`}
          >
            {phase === 'typing' ? (
              <>
                <span className="tt-preloader__lang-index">
                  {String(currentIndex + 1).padStart(2, '0')}/{String(GREETINGS.length).padStart(2, '0')}
                </span>
                <span>•</span>
                <span>{activeGreeting.lang}</span>
              </>
            ) : (
              <>
                <span className="tt-preloader__lang-index">✦</span>
                <span>HERO PORTAL • SRINJOYEE DEY</span>
              </>
            )}
          </div>

          <div className="tt-preloader__system-badge">
            <span className="tt-preloader__brand-dot" style={{ backgroundColor: modelStatus === 'error' ? '#EF4444' : '#FFBD12' }} />
            <span>{modelStatus === 'error' ? '3D OFFLINE' : (modelStatus === 'success' ? '3D READY' : 'LOADING 3D')}</span>
          </div>
        </header>

        {/* Center Stage: TextType for Phase 1 */}
        <div className="tt-preloader__stage">
          {phase === 'typing' ? (
            <div className="tt-preloader__word-wrap">
              <TextType
                text={GREETING_TEXTS}
                typingSpeed={32}
                deletingSpeed={18}
                pauseDuration={420}
                cursorStyle="block"
                cursorColor="#FFBD12"
                cursorGlide={true}
                loop={false}
                mistakes={0}
                onIndexChange={handleIndexChange}
                onComplete={handleTypingComplete}
                className="tt-preloader__word"
              />
            </div>
          ) : (
            <div style={{ height: isMobile ? '120px' : '180px' }} />
          )}

          <div ref={subtitleRef} className="tt-preloader__subtitle">
            <span className="tt-preloader__subtitle-line" />
            <span>
              {modelStatus === 'error'
                ? '3D ENGINE INITIALIZATION ERROR'
                : (phase === 'typing'
                  ? (greetingsDone ? 'PREPARING 3D STUDIO SCENE...' : `${activeGreeting.code} • CREATIVE VISUAL DEVELOPER`)
                  : 'PEEKING INTO THE CREATIVE STUDIO • 2026')}
            </span>
            <span className="tt-preloader__subtitle-line" />
          </div>

          {/* Graceful Fallback if 3D Model fails to load */}
          {modelStatus === 'error' && (
            <div
              className="tt-preloader__error-panel"
              style={{
                marginTop: '18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                pointerEvents: 'auto'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#B91C1C',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>3D avatar model could not be loaded</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setModelStatus('loading');
                    if (typeof window !== 'undefined' && typeof window.__hero3DRetry === 'function') {
                      window.__hero3DRetry();
                    }
                  }}
                  style={{
                    background: '#FFBD12',
                    color: '#222428',
                    border: 'none',
                    borderRadius: '24px',
                    padding: '8px 20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(255, 189, 18, 0.25)'
                  }}
                >
                  <i className="fa-solid fa-rotate-right" style={{ marginRight: '6px' }}></i>
                  Retry 3D Load
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhase('masked');
                    setTimeout(() => startZoomExit(), 150);
                  }}
                  style={{
                    background: '#222428',
                    color: '#ECECE7',
                    border: 'none',
                    borderRadius: '24px',
                    padding: '8px 20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Enter Portfolio
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer */}
        <footer
          ref={footerRef}
          className="tt-preloader__footer"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="tt-preloader__status">
            <span>
              {modelStatus === 'error'
                ? '● 3D SYSTEM ERROR'
                : (modelStatus === 'loading'
                  ? (greetingsDone ? '● FINALIZING 3D ENVIRONMENT' : '● LOADING 3D ASSETS')
                  : '● 3D STUDIO READY')}
            </span>
          </div>

          <div className="tt-preloader__progress-container">
            <div className="tt-preloader__progress-bar">
              <div
                className="tt-preloader__progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="tt-preloader__progress-text">{progressPercent}%</span>
          </div>

          <div className="tt-preloader__hint">
            <span>
              {modelStatus === 'error'
                ? 'SELECTION REQUIRED'
                : (phase === 'typing'
                  ? (greetingsDone ? 'SYNCING 3D CANVAS' : 'PLEASE WAIT FOR ASSETS')
                  : 'ENTERING STUDIO')}
            </span>
            <i className="fa-solid fa-arrow-turn-down"></i>
          </div>
        </footer>
      </div>
    </div>
  );
}
