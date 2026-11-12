'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FavouriteIcon, StarIcon, ThumbsUpIcon } from '@hugeicons/core-free-icons';

import './PulseHeart.css';

const OUT = 0.4;
const ICONS = { heart: FavouriteIcon, star: StarIcon, thumb: ThumbsUpIcon };

const back = (k, c) => {
  const u = k - 1;
  return 1 + (c + 1) * u ** 3 + c * u ** 2;
};
const swellOf = (t, c) => (t <= 0 ? 0 : t < OUT ? 1 - (1 - t / OUT) ** 3 : 1 - back((t - OUT) / (1 - OUT), c));
const format = n => new Intl.NumberFormat().format(n);
const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Delicate floating micro-particles: gentle upward float closely surrounding the heart icon
const CELEBRATION_PARTICLES = [
  { id: 1, type: 'heart', dx: -18, dy: -36, size: 10, color: '#ff4d6d', delay: 0, dur: 1300, rot: -15, scale: 1 },
  { id: 2, type: 'sparkle', dx: 14, dy: -34, size: 8, color: '#ffffff', delay: 60, dur: 1200, rot: 30, scale: 0.95 },
  { id: 3, type: 'petal', dx: -30, dy: -20, size: 9, color: '#ff85a1', delay: 40, dur: 1350, rot: -30, scale: 1 },
  { id: 4, type: 'heart', dx: 28, dy: -18, size: 10, color: '#ff758f', delay: 80, dur: 1280, rot: 20, scale: 0.95 },
  { id: 5, type: 'sparkle', dx: -24, dy: 6, size: 7, color: '#fef08a', delay: 100, dur: 1220, rot: -45, scale: 0.9 },
  { id: 6, type: 'petal', dx: 22, dy: 6, size: 9, color: '#fbcfe8', delay: 50, dur: 1320, rot: 35, scale: 0.95 },
  { id: 7, type: 'heart', dx: 0, dy: -42, size: 11, color: '#ff4d6d', delay: 30, dur: 1400, rot: 10, scale: 1.05 },
  { id: 8, type: 'sparkle', dx: 18, dy: -44, size: 8, color: '#ffffff', delay: 110, dur: 1250, rot: 50, scale: 0.85 },
  { id: 9, type: 'petal', dx: -12, dy: -42, size: 9, color: '#ffe4e6', delay: 90, dur: 1380, rot: -20, scale: 0.95 },
  { id: 10, type: 'heart', dx: -18, dy: -10, size: 9, color: '#ff758f', delay: 70, dur: 1300, rot: -10, scale: 0.9 },
  { id: 11, type: 'sparkle', dx: 0, dy: -22, size: 7, color: '#fef3c7', delay: 20, dur: 1150, rot: 25, scale: 0.85 }
];

export default function PulseHeart({
  liked: likedProp,
  defaultLiked = false,
  count = 0,
  onChange,
  showCount = true,
  icon = 'heart',
  idleOutline = true,
  size = 40,
  corner = 32,
  likedColor = '#ff4d6d',
  idleColor = '#8b8b93',
  pillColor = '#232326',
  textColor = '#f5f5f5',
  duration = 560,
  dotSize = 0.3,
  overshoot = 1.7,
  beat = 3,
  rollDuration = 350,
  disabled = false,
  label = 'Like',
  className = ''
}) {
  const controlled = likedProp !== undefined;
  const [inner, setInner] = useState(defaultLiked);
  const [total, setTotal] = useState(count);
  const liked = controlled ? likedProp : inner;
  const [shown, setShown] = useState({ liked, count });
  const [roll, setRoll] = useState(null);
  const [celebrating, setCelebrating] = useState(false);

  const rootRef = useRef(null);
  const pillRef = useRef(null);
  const heartRef = useRef(null);
  const glyphRef = useRef(null);
  const rollRef = useRef(null);
  const raf = useRef(0);
  const rollTimer = useRef(0);
  const celebrateTimer = useRef(0);
  const viaPointer = useRef(false);
  const shownRef = useRef(shown);
  const logical = useRef({ liked, count: total });
  logical.current = { liked, count: total };
  const cfg = useRef({ duration, dotSize, overshoot, beat, rollDuration });
  cfg.current = { duration, dotSize, overshoot, beat, rollDuration };

  useEffect(() => {
    setTotal(count);
  }, [count]);

  useEffect(() => {
    if (raf.current) return;
    if (shownRef.current.liked === liked && shownRef.current.count === total) return;
    shownRef.current = { liked, count: total };
    setShown(shownRef.current);
  }, [liked, total]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || root.dataset.instant === undefined) return;
    root.getBoundingClientRect();
    delete root.dataset.instant;
  }, [shown]);

  useLayoutEffect(() => {
    const el = rollRef.current;
    if (!el || !roll) return;
    el.style.transition = 'none';
    el.style.transform = `translateY(${roll.up ? '0' : '-1em'})`;
    el.getBoundingClientRect();
    el.style.transition = '';
    el.style.transform = `translateY(${roll.up ? '-1em' : '0'})`;
  }, [roll]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(rollTimer.current);
      clearTimeout(celebrateTimer.current);
    },
    []
  );

  const startRoll = (from, to) => {
    if (from === to) return;
    const a = format(from);
    const b = format(to);
    const changed = a.length === b.length ? [...b].flatMap((ch, i) => (ch !== a[i] ? [i] : [])) : [];
    setRoll({ a, b, at: changed.length === 1 ? changed[0] : -1, up: to > from });
    clearTimeout(rollTimer.current);
    rollTimer.current = setTimeout(() => setRoll(null), cfg.current.rollDuration);
  };

  const run = (nextLiked, nextCount, isCelebrating = false) => {
    const root = rootRef.current;
    const heart = heartRef.current;
    const pill = pillRef.current;
    if (!root || !heart || !pill) return;
    const glyph = glyphRef.current;
    root.dataset.running = '';
    let swapped = false;
    let prev = 0;
    const t0 = performance.now();
    const tick = now => {
      const { duration: D, dotSize: dot, overshoot: c, beat: B } = cfg.current;
      const t = Math.min(1, (now - t0) / D);
      const step = prev ? now - prev : 1000 / 60;
      prev = now;
      const s = swellOf(t, c);
      const k = 1 - (1 - dot) * s;
      if (!isCelebrating) {
        if (glyph) glyph.setAttribute('transform', `translate(12 12) scale(${k}) translate(-12 -12)`);
        else heart.style.transform = `scale(${k})`;
      }
      pill.style.transform = `scale(${1 - (B / 100) * s})`;
      if (!swapped && t + step / 2 / D >= OUT) {
        swapped = true;
        root.dataset.liked = String(nextLiked);
        startRoll(shownRef.current.count, nextCount);
        shownRef.current = { liked: nextLiked, count: nextCount };
        setShown(shownRef.current);
      }
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      raf.current = 0;
      if (glyph) glyph.removeAttribute('transform');
      heart.style.transform = '';
      pill.style.transform = '';
      delete root.dataset.running;
      const l = logical.current;
      if (l.liked !== shownRef.current.liked || l.count !== shownRef.current.count) {
        shownRef.current = { liked: l.liked, count: l.count };
        setShown(shownRef.current);
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const handlePointerDown = e => {
    if (e.button !== 0 || disabled || celebrating) return;
    viaPointer.current = true;
    if (!reducedMotion() && rootRef.current) rootRef.current.dataset.pressed = '';
  };
  const handlePointerUp = () => {
    if (rootRef.current) delete rootRef.current.dataset.pressed;
  };
  const handlePointerCancel = () => {
    viaPointer.current = false;
    handlePointerUp();
  };
  const handleKeyDown = () => {
    viaPointer.current = false;
  };

  const handleClick = e => {
    // Prevent multiple simultaneous clicks while animation/roll is in flight
    if (disabled || raf.current || celebrating) return;

    const pointer = viaPointer.current && e.detail !== 0;
    viaPointer.current = false;
    const nextLiked = !liked;
    const nextCount = total + (nextLiked ? 1 : -1);
    if (!controlled) setInner(nextLiked);
    setTotal(nextCount);
    onChange?.(nextLiked, nextCount);

    if (nextLiked && !reducedMotion()) {
      setCelebrating(true);
      clearTimeout(celebrateTimer.current);
      celebrateTimer.current = setTimeout(() => {
        setCelebrating(false);
      }, 1500);
      run(nextLiked, nextCount, true);
    } else if (pointer && !reducedMotion()) {
      run(nextLiked, nextCount, false);
    } else if (rootRef.current) {
      rootRef.current.dataset.instant = '';
    }
  };

  const paths = typeof icon === 'string' ? ICONS[icon] || ICONS.heart : null;
  const text = format(shown.count);
  const cells = roll
    ? roll.at === -1
      ? [{ top: roll.up ? roll.a : roll.b, bottom: roll.up ? roll.b : roll.a }]
      : [...roll.b].map((ch, i) =>
          i === roll.at ? { top: roll.up ? roll.a[i] : ch, bottom: roll.up ? ch : roll.a[i] } : { ch }
        )
    : [...text].map(ch => ({ ch }));

  return (
    <button
      ref={rootRef}
      type="button"
      aria-pressed={liked}
      disabled={disabled}
      data-liked={String(shown.liked)}
      data-celebrating={celebrating ? '' : undefined}
      data-solid={idleOutline ? undefined : ''}
      data-no-count={showCount ? undefined : ''}
      className={`pulse-heart${className ? ` ${className}` : ''}`}
      style={{
        '--ph-size': `${size}px`,
        '--ph-corner': `${corner}px`,
        '--ph-pill': pillColor,
        '--ph-idle': idleColor,
        '--ph-liked': likedColor,
        '--ph-text': textColor,
        '--ph-roll': `${rollDuration}ms`,
        '--ph-stroke': `${(1.5 * size) / 24}px`
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <span ref={pillRef} className="pulse-heart__pill">
        <span className="pulse-heart__heart-wrap">
          <span ref={heartRef} className="pulse-heart__heart" aria-hidden="true">
            {paths ? (
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g ref={glyphRef}>
                  {paths.map(([, attrs]) => (
                    <path key={String(attrs.key)} d={String(attrs.d)} vectorEffect="non-scaling-stroke" />
                  ))}
                </g>
              </svg>
            ) : (
              icon
            )}
          </span>
          {celebrating && (
            <span className="pulse-heart__micro-stage" aria-hidden="true">
              <span className="pulse-heart__glow-burst" />
              <span className="pulse-heart__ring-halo" />
              {CELEBRATION_PARTICLES.map(p => (
                <span
                  key={p.id}
                  className={`pulse-particle pulse-particle--${p.type}`}
                  style={{
                    '--dx': `${p.dx}px`,
                    '--dy': `${p.dy}px`,
                    '--rot': `${p.rot}deg`,
                    '--delay': `${p.delay}ms`,
                    '--dur': `${p.dur}ms`,
                    '--scale': p.scale,
                    color: p.color
                  }}
                >
                  {p.type === 'heart' && (
                    <svg viewBox="0 0 24 24" width={p.size} height={p.size} fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  )}
                  {p.type === 'petal' && (
                    <svg viewBox="0 0 24 24" width={p.size} height={p.size} fill="currentColor">
                      <path d="M12 2C8.5 7 7 12.5 12 22C17 12.5 15.5 7 12 2Z" />
                    </svg>
                  )}
                  {p.type === 'sparkle' && (
                    <svg viewBox="0 0 24 24" width={p.size} height={p.size} fill="currentColor">
                      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6Z" />
                    </svg>
                  )}
                </span>
              ))}
            </span>
          )}
        </span>
        {showCount ? (
          <span className="pulse-heart__count" aria-hidden="true">
            {cells.map((cell, i) =>
              'ch' in cell ? (
                <span key={`c${i}`}>{cell.ch}</span>
              ) : (
                <span key={`r${i}`} className="pulse-heart__slot">
                  <span ref={rollRef} className="pulse-heart__roll">
                    <span>{cell.top}</span>
                    <span>{cell.bottom}</span>
                  </span>
                </span>
              )
            )}
          </span>
        ) : null}
        <span className="pulse-heart__sr">{showCount ? `${label}, ${format(total)}` : label}</span>
      </span>
    </button>
  );
}
