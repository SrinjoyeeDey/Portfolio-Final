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
  const truckRef = useRef(null);
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
    const truck = truckRef.current;
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

    // 1. Gently fade out UI elements (header, footer, subtitle, truck, badges)
    tl.to([header, footer, subtitle, truck, crosshairs], {
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

          {phase === 'typing' && (
            <div className="tt-preloader__lang-pill">
              <span className="tt-preloader__lang-index">
                {String(currentIndex + 1).padStart(2, '0')}/{String(GREETINGS.length).padStart(2, '0')}
              </span>
              <span>•</span>
              <span>{activeGreeting.lang}</span>
            </div>
          )}
        </header>

        {/* Center Stage: Unified Composition */}
        <div className="tt-preloader__stage">
          {phase === 'typing' ? (
            <div className="tt-preloader__composition">
              {/* 1. & 2. Animated Delivery Truck & Miniature Moving Road */}
              <div ref={truckRef} className="tt-truck-loader" aria-hidden="true">
                <div className="truckWrapper">
                  <div className="truckBody">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 198 93"
                      className="trucksvg"
                    >
                      {/* Main Cargo Container (Warm Golden Yellow #FFBD12) */}
                      <rect
                        strokeWidth="3"
                        stroke="#222428"
                        fill="#FFBD12"
                        rx="2.5"
                        height="90"
                        width="121"
                        y="1.5"
                        x="6.5"
                      />

                      {/* Cargo Detail Panel (Soft Ivory / Cream #F5F2E9) */}
                      <rect
                        strokeWidth="2"
                        stroke="#222428"
                        fill="#F5F2E9"
                        rx="3"
                        height="64"
                        width="98"
                        y="14.5"
                        x="18"
                      />

                      {/* Studio Monogram on Cargo Panel */}
                      <text
                        x="67"
                        y="52"
                        textAnchor="middle"
                        fill="#222428"
                        fontFamily="'Fredoka', cursive, sans-serif"
                        fontWeight="700"
                        fontSize="16"
                        letterSpacing="0.06em"
                      >
                        SD
                      </text>
                      <line
                        x1="28"
                        y1="61"
                        x2="106"
                        y2="61"
                        stroke="#222428"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        opacity="0.35"
                      />

                      {/* Rear Step / Mudflap */}
                      <rect
                        strokeWidth="2"
                        stroke="#222428"
                        fill="#F5F2E9"
                        rx="2"
                        height="4"
                        width="6"
                        y="84"
                        x="1"
                      />

                      {/* Front Cabin (Warm Golden Yellow #FFBD12) */}
                      <path
                        strokeWidth="3"
                        stroke="#222428"
                        fill="#FFBD12"
                        d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z"
                      />

                      {/* Cabin Window (Soft Ivory / Cream #F5F2E9) */}
                      <path
                        strokeWidth="3"
                        stroke="#222428"
                        fill="#F5F2E9"
                        d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z"
                      />

                      {/* Door Handle */}
                      <path
                        strokeWidth="2"
                        stroke="#222428"
                        fill="#222428"
                        d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z"
                      />

                      {/* Headlight (Warm Amber Highlight) */}
                      <rect
                        strokeWidth="2"
                        stroke="#222428"
                        fill="#FFF3B0"
                        rx="1"
                        height="7"
                        width="5"
                        y="63"
                        x="187"
                      />

                      {/* Front Bumper (Deep Charcoal) */}
                      <rect
                        strokeWidth="2"
                        stroke="#222428"
                        fill="#222428"
                        rx="1"
                        height="11"
                        width="4"
                        y="81"
                        x="193"
                      />
                    </svg>
                  </div>

                  {/* Tires with Rotating Spokes */}
                  <div className="truckTires">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 30 30"
                      className="tiresvg"
                    >
                      <circle
                        strokeWidth="3"
                        stroke="#222428"
                        fill="#222428"
                        r="13.5"
                        cy="15"
                        cx="15"
                      />
                      <circle fill="#F5F2E9" stroke="#222428" strokeWidth="1.5" r="7" cy="15" cx="15" />
                      <g className="tire-spokes">
                        <circle fill="#FFBD12" stroke="#222428" strokeWidth="1" r="2.5" cy="15" cx="15" />
                        <line x1="15" y1="8.5" x2="15" y2="21.5" stroke="#222428" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="8.5" y1="15" x2="21.5" y2="15" stroke="#222428" strokeWidth="1.5" strokeLinecap="round" />
                      </g>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 30 30"
                      className="tiresvg"
                    >
                      <circle
                        strokeWidth="3"
                        stroke="#222428"
                        fill="#222428"
                        r="13.5"
                        cy="15"
                        cx="15"
                      />
                      <circle fill="#F5F2E9" stroke="#222428" strokeWidth="1.5" r="7" cy="15" cx="15" />
                      <g className="tire-spokes">
                        <circle fill="#FFBD12" stroke="#222428" strokeWidth="1" r="2.5" cy="15" cx="15" />
                        <line x1="15" y1="8.5" x2="15" y2="21.5" stroke="#222428" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="8.5" y1="15" x2="21.5" y2="15" stroke="#222428" strokeWidth="1.5" strokeLinecap="round" />
                      </g>
                    </svg>
                  </div>

                  {/* Road */}
                  <div className="road" />

                  {/* Lamp Post */}
                  <svg
                    xmlSpace="preserve"
                    viewBox="0 0 453.459 453.459"
                    xmlns="http://www.w3.org/2000/svg"
                    className="lampPost"
                  >
                    <path
                      fill="#222428"
                      d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993
c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514
c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16
c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914
h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75
v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795
V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z
M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017
h78.747C231.693,100.736,232.77,106.162,232.77,111.694z"
                    />
                    <circle cx="190" cy="112" r="26" fill="#FFBD12" opacity="0.55" />
                  </svg>
                </div>
              </div>

              {/* 3. Ciao / TextType Wordmark with glowing golden rectangular accent */}
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

              {/* 4. INITIALIZING EXPERIENCE Text */}
              <div ref={subtitleRef} className="tt-preloader__status-block">
                <span className="tt-preloader__status-indicator" />
                <span>
                  {modelStatus === 'error'
                    ? 'ENGINE INITIALIZATION ERROR'
                    : (modelStatus === 'loading'
                      ? (greetingsDone ? 'FINALIZING STUDIO' : 'INITIALIZING EXPERIENCE')
                      : 'STUDIO READY')}
                </span>
              </div>

              {/* 5. Loading Progress Bar & Percentage */}
              <div ref={footerRef} className="tt-preloader__progress-container" style={{ pointerEvents: 'auto' }}>
                <div className="tt-preloader__progress-bar">
                  <div
                    className="tt-preloader__progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="tt-preloader__progress-text">{progressPercent}%</span>
              </div>
            </div>
          ) : (
            <div style={{ height: isMobile ? '120px' : '180px' }} />
          )}

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
                <span>Avatar model could not be loaded</span>
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
                  Retry Load
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
      </div>
    </div>
  );
}
