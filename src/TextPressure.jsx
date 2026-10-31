'use client';

// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const RIPPLE_LIFE = 1.3;
const MAX_RIPPLES = 6;
const WAVE_PERIOD = 3.2;
const PULSE_PERIOD = 2.8;
const PULSE_DEPTH = 0.42;

const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const clamp01 = value => Math.min(1, Math.max(0, value));

const getIdlePressure = (mode, position, clock, spread) => {
  if (mode === 'wave') {
    const crest = 0.5 + 0.5 * Math.cos(Math.PI * 2 * (position / spread - clock / WAVE_PERIOD));
    return crest * crest;
  }
  if (mode === 'pulse') {
    const lag = Math.abs(position - 0.5) * 0.4;
    const breath = 0.5 - 0.5 * Math.cos(Math.PI * 2 * (clock / PULSE_PERIOD - lag));
    return PULSE_DEPTH * breath * breath * (3 - 2 * breath);
  }
  return 0;
};

const getRipplePressure = (ripples, point, now, span) => {
  const band = Math.max(span * 0.14, 32);
  let total = 0;
  for (const ripple of ripples) {
    const age = (now - ripple.start) / 1000;
    if (age <= 0 || age >= RIPPLE_LIFE) continue;
    const offset = (dist(ripple, point) - age * span * 1.25) / band;
    if (offset <= -1 || offset >= 1) continue;
    const fade = 1 - age / RIPPLE_LIFE;
    const swell = (1 - offset * offset) ** 2 * fade * fade * Math.min(1, age / 0.06);
    total = 1 - (1 - total) * (1 - swell);
  }
  return total;
};

export const TextPressure = ({
  text = 'Compressa',
  fontFamily = "'Roboto Flex', 'Plus Jakarta Sans', sans-serif",
  fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght,slnt@8..144,25..151,100..1000,-10..0&display=swap',

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  radius = 0.5,
  smoothing = 0.5,

  idle = 'none',
  idleSpeed = 1,
  clickRipple = true,

  textColor = 'currentColor',
  pressureColor = '',
  strokeColor = '#FF0000',
  strokeWidth = 3,
  className = '',

  minFontSize = 24,
  maxFontSize = 120,
  fontSize: propFontSize = null
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);
  const wakeRef = useRef(null);
  const visibleRef = useRef(true);
  const ripplesRef = useRef([]);
  const optionsRef = useRef({
    width,
    weight,
    italic,
    alpha,
    radius,
    smoothing,
    idle,
    idleSpeed,
    clickRipple,
    textColor,
    pressureColor
  });

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0, seen: false });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);

  const chars = Array.from(text);

  useEffect(() => {
    optionsRef.current = {
      width,
      weight,
      italic,
      alpha,
      radius,
      smoothing,
      idle,
      idleSpeed,
      clickRipple,
      textColor,
      pressureColor
    };
    wakeRef.current?.();
  }, [width, weight, italic, alpha, radius, smoothing, idle, idleSpeed, clickRipple, textColor, pressureColor]);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    const wake = () => wakeRef.current?.();
    const track = (x, y) => {
      cursor.x = x;
      cursor.y = y;
      cursor.seen = true;
      wake();
    };
    const handleMouseMove = e => track(e.clientX, e.clientY);
    const handleTouch = e => {
      const t = e.touches[0];
      if (t) track(t.clientX, t.clientY);
    };
    const handleLeave = () => {
      cursor.seen = false;
      wake();
    };
    const handlePress = e => {
      if (!optionsRef.current.clickRipple) return;
      const ripples = ripplesRef.current;
      ripples.push({ x: e.clientX, y: e.clientY, start: performance.now() });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
      wake();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handleLeave);
    window.addEventListener('touchcancel', handleLeave);
    window.addEventListener('scroll', wake, { passive: true, capture: true });
    document.documentElement.addEventListener('mouseleave', handleLeave);
    document.fonts?.addEventListener?.('loadingdone', wake);
    container?.addEventListener('pointerdown', handlePress);

    if (container) {
      const { left, top, width, height } = container.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursor.x = mouseRef.current.x;
      cursor.y = mouseRef.current.y;
    }

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) wake();
    });
    if (container) observer.observe(container);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleLeave);
      window.removeEventListener('touchcancel', handleLeave);
      window.removeEventListener('scroll', wake, { capture: true });
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      document.fonts?.removeEventListener?.('loadingdone', wake);
      container?.removeEventListener('pointerdown', handlePress);
      observer.disconnect();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      if (propFontSize) {
        setFontSize(propFontSize);
        setScaleY(1);
        return;
      }
      const { width: containerW, height: containerH } = container.getBoundingClientRect();
      const charCount = Math.max(chars.length, 3);
      const calculated = containerW > 0 ? containerW / (charCount * 0.72) : minFontSize;
      const heightBound = containerH > 0 && scale ? containerH * 0.9 : calculated;
      const nextFontSize = Math.min(Math.max(calculated, minFontSize), maxFontSize, heightBound);
      setFontSize(nextFontSize);
      setScaleY(scale && containerH > 0 ? containerH / nextFontSize : 1);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [chars.length, minFontSize, maxFontSize, propFontSize, scale]);

  useEffect(() => {
    const title = titleRef.current;
    const container = containerRef.current;
    if (!title || !container) return;

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const applied = [];
    let rafId = 0;
    let last = 0;
    let idleFrames = 0;
    let clock = 0;
    let engage = optionsRef.current.idle === 'wave' || optionsRef.current.idle === 'pulse' ? 0 : 1;

    const tick = now => {
      rafId = 0;
      const elapsed = last ? Math.min(now - last, 64) : 1000 / 60;
      last = now;

      const options = optionsRef.current;
      const idleMode =
        (options.idle === 'wave' || options.idle === 'pulse') && !motionQuery?.matches ? options.idle : 'none';
      const mouse = mouseRef.current;
      const cursor = cursorRef.current;
      const lag = 1000 * options.smoothing * options.smoothing;
      const follow = lag > 1 ? 1 - Math.exp(-elapsed / lag) : 1;
      mouse.x += (cursor.x - mouse.x) * follow;
      mouse.y += (cursor.y - mouse.y) * follow;

      let present = 1;
      if (idleMode !== 'none') {
        const box = container.getBoundingClientRect();
        const inside = cursor.x >= box.left && cursor.x <= box.right && cursor.y >= box.top && cursor.y <= box.bottom;
        present = cursor.seen && inside ? 1 : 0;
      }
      engage += (present - engage) * (1 - Math.exp(-elapsed / 320));
      if (Math.abs(present - engage) < 0.002) engage = present;
      const idling = idleMode !== 'none' && engage < 1;
      if (idling) clock += (elapsed / 1000) * options.idleSpeed;

      const ripples = ripplesRef.current;
      while (ripples.length && now - ripples[0].start > RIPPLE_LIFE * 1000) ripples.shift();

      const titleRect = title.getBoundingClientRect();
      const maxDist = Math.max(titleRect.width * options.radius, 1);
      const spread = Math.max(options.radius * 2, 0.2);
      const spans = spansRef.current;
      const centers = spans.map(span => {
        if (!span) return null;
        const rect = span.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      });

      let changed = false;
      spans.forEach((span, i) => {
        const center = centers[i];
        if (!span || !center) return;

        let pressure = clamp01(1 - dist(mouse, center) / maxDist);
        if (idling) {
          const position = (center.x - titleRect.left) / Math.max(titleRect.width, 1);
          const resting = getIdlePressure(idleMode, position, clock, spread);
          pressure = resting + (pressure - resting) * engage;
        }
        if (ripples.length) {
          const swell = getRipplePressure(ripples, center, now, titleRect.width);
          pressure = 1 - (1 - pressure) * (1 - swell);
        }

        const wdth = options.width ? Math.floor(75 + 76 * pressure) : 100;
        const wght = options.weight ? Math.floor(550 + 400 * pressure) : 700;
        const slnt = options.italic ? (-10 * pressure).toFixed(1) : '0';
        const alphaVal = options.alpha ? pressure.toFixed(2) : '';
        const tint = Math.round((1 - (1 - pressure) * (1 - pressure)) * 100);
        const color = options.pressureColor
          ? `color-mix(in oklab, ${options.pressureColor} ${tint}%, ${options.textColor})`
          : '';
        const settings = `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}`;
        const scaleX = (1 + pressure * 0.42).toFixed(3);
        const scaleY = (1 + pressure * 0.16).toFixed(3);
        const skew = options.italic ? (-10 * pressure).toFixed(1) : '0';
        const transform = `scale(${scaleX}, ${scaleY}) skewX(${skew}deg)`;
        const previous = applied[i];

        if (
          !previous ||
          previous.span !== span ||
          previous.settings !== settings ||
          previous.transform !== transform ||
          previous.alphaVal !== alphaVal ||
          previous.color !== color
        ) {
          span.style.fontVariationSettings = settings;
          span.style.transform = transform;
          span.style.fontWeight = `${wght}`;
          if (alphaVal) span.style.opacity = alphaVal;
          if (color) span.style.color = color;
          applied[i] = { span, settings, transform, alphaVal, color };
          changed = true;
        }
      });

      const moving = Math.abs(cursor.x - mouse.x) > 0.1 || Math.abs(cursor.y - mouse.y) > 0.1;
      const animating = moving || idling || engage !== present || ripples.length > 0;
      idleFrames = animating ? 0 : idleFrames + 1;

      if (animating || (changed && idleFrames < 60)) rafId = requestAnimationFrame(tick);
      else last = 0;
    };

    const wake = () => {
      if (!rafId && visibleRef.current) rafId = requestAnimationFrame(tick);
    };

    wakeRef.current = wake;
    wake();

    return () => {
      cancelAnimationFrame(rafId);
      wakeRef.current = null;
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  }, [fontSize, scaleY, text, flex, fontFamily]);

  const titleStyle = {
    fontFamily,
    textTransform: 'uppercase',
    fontSize: `${fontSize}px`,
    lineHeight: 1.05,
    transform: scale ? `scale(1, ${scaleY})` : undefined,
    transformOrigin: 'left center',
    margin: 0,
    textAlign: flex ? 'center' : 'left',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    fontWeight: 100,
    width: flex ? '100%' : 'auto',
    color: textColor,
    display: 'flex',
    justifyContent: flex ? 'space-between' : 'flex-start',
    gap: flex ? undefined : '0.04em',
    overflow: 'visible',
    boxSizing: 'border-box',
    '--text-pressure-stroke-width': `${strokeWidth}px`,
    '--text-pressure-stroke-color': strokeColor
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent',
        overflow: 'visible'
      }}
    >
      <style>{`
        @import url('${fontUrl}');

        .text-pressure-title.is-stroke span {
          position: relative;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
          -webkit-text-stroke: var(--text-pressure-stroke-width) var(--text-pressure-stroke-color);
        }
      `}</style>
      <h1
        ref={titleRef}
        aria-label={text}
        className={`text-pressure-title ${stroke ? 'is-stroke' : ''} ${className}`}
        style={titleStyle}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={el => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            aria-hidden="true"
            style={{
              display: 'inline-block',
              transformOrigin: 'center center',
              willChange: 'transform, font-variation-settings'
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
