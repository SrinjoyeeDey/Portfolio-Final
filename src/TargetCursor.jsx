'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SmoothCursor } from '../components/ui/smooth-cursor';
import './TargetCursor.css';

const spring = (state, goal, stiffness, damping, dt) => {
  const maxH = 0.004; // 4ms sub-step guarantees numerical stability
  let remaining = Math.min(dt, 0.05);
  while (remaining > 0) {
    const h = Math.min(remaining, maxH);
    const force = stiffness * (goal - state.x) - damping * state.v;
    state.v += force * h;
    state.x += state.v * h;
    remaining -= h;
  }
  if (!isFinite(state.x) || Math.abs(state.x) > 1e5) {
    state.x = goal;
    state.v = 0;
  }
  if (!isFinite(state.v)) state.v = 0;
};

const resolveElement = value => (value && 'current' in value ? value.current : value) || null;

// Strictly clickable buttons, links, controls, and interactive cards (never plain text/headings)
const CLICKABLE_SELECTORS = [
  'a[href]',
  'button:not(:disabled)',
  'summary',
  'select:not(:disabled)',
  '[role="button"]:not([aria-disabled="true"])',
  '.btn',
  '.nav-link',
  '.gooey-nav__link',
  '.dock-item',
  '.dock-badge-icon',
  '.social-link-btn',
  '.circle-arrow-btn',
  '.back-to-top-btn',
  '.footer-back-to-top',
  '.footer-nav-item',
  '.studio-legend-link',
  '.brand-logo',
  '.circular-logo-mark',
  '.heart-btn',
  '.glass-icon-btn',
  '.nav-pulse-heart-btn',
  '.hamburger-btn',
  '.sound-toggle-btn',
  '.tech-sound-toggle-btn',
  '.spotlight-explore-btn',
  '.spotlight-glide-btn',
  '.rail-icon',
  '.mimo-trigger-btn',
  '.mimo-close-btn',
  '.mimo-send-btn',
  '.modal-close-btn',
  '.filter-btn',
  '.filter-pill',
  '.quick-pill-btn',
  '.type-pill-option',
  '.project-card',
  '.project-card-trigger',
  '.swap-project-card',
  '.globe-photo-card',
  '.globe-hud-btn',
  '.editorial-jump-btn',
  '.editorial-action-primary',
  '.editorial-action-secondary',
  '.editorial-action-icon',
  '.editorial-sound-toggle-btn',
  '.container-scroll-tab-btn',
  '.console-btn-primary',
  '.console-btn-secondary',
  '.console-arrow-btn',
  '.card-3d-see-more',
  '.work-together-card',
  '.polaroid-item',
  '.photo-print-card',
  '.card-item',
  '.skill-card',
  '.pmw-mobile-thumb-card',
  '.pmw-view-all-btn',
  '.studio-meet-trigger',
  '.dock-toggle-btn'
].join(', ');

const TEXT_INPUT_SELECTOR = 'input, textarea, [contenteditable="true"], [contenteditable=""]';

const getTargetTone = el => {
  if (!el || typeof getComputedStyle !== 'function') return 'light';
  let current = el;
  for (let depth = 0; depth < 3 && current && current !== document.documentElement; depth += 1) {
    const bg = getComputedStyle(current).backgroundColor;
    const match = bg && bg.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?/i);
    if (match) {
      const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
      if (a > 0.35) {
        const r = parseFloat(match[1]) / 255;
        const g = parseFloat(match[2]) / 255;
        const b = parseFloat(match[3]) / 255;
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        if (r > 0.72 && g > 0.55 && b < 0.38) return 'accent';
        if (lum < 0.38) return 'dark';
        return 'light';
      }
    }
    current = current.parentElement;
  }
  return 'light';
};

const isOverlayOpen = () =>
  Boolean(
    document.body?.classList.contains('memory-viewer-open') ||
      document.querySelector('.modal-overlay.active, .pmw-fullscreen-viewer-overlay, .wall-lightbox-overlay')
  );

const TargetCursor = ({
  targetSelector = '.cursor-target',
  cursorColor = '#FFBD12',
  cursorColorOnTarget = '#FFBD12',
  hoverDuration = 0.16,
  parallaxOn = true,
  hideDefaultCursor = true,
  size = 34,
  padding = 6,
  matchRadius = true,
  blendMode = 'normal',
  showLabel = true,
  clickEffect = true,
  container
}) => {
  const [host, setHost] = useState(null);
  const rootRef = useRef(null);
  const orbRef = useRef(null);
  const labelRef = useRef(null);
  const wakeRef = useRef(null);
  const settings = {
    targetSelector,
    cursorColor,
    cursorColorOnTarget,
    hoverDuration: Math.max(0.06, hoverDuration),
    parallaxOn,
    hideDefaultCursor,
    size: Math.max(12, size),
    padding,
    matchRadius,
    showLabel,
    clickEffect,
    container
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    setHost(typeof document !== 'undefined' ? document.body : null);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!host || !root) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const style = document.createElement('style');
    document.head.appendChild(style);

    const pointer = { x: 0, y: 0, inside: false, seen: false, pressed: false };
    const centerX = { x: 0, v: 0 };
    const centerY = { x: 0, v: 0 };
    const halfW = { x: 0, v: 0 };
    const halfH = { x: 0, v: 0 };
    const radius = { x: 0, v: 0 };
    const lock = { x: 0, v: 0 };
    const press = { x: 0, v: 0 };
    const presence = { x: 0, v: 0 };
    let target = null;
    let targetRadius = 0;
    let targetTone = 'light';
    let raf = 0;
    let last = 0;
    let lastLabel = '';
    let lastScope = null;
    let lastStateKey = '';

    const scopeOf = () => resolveElement(settingsRef.current.container);

    const hideCursor = () => {
      const s = settingsRef.current;
      const scope = scopeOf();
      if (scope !== lastScope) {
        lastScope?.removeAttribute('data-target-cursor-scope');
        scope?.setAttribute('data-target-cursor-scope', '');
        lastScope = scope;
      }
      const suppressed = isOverlayOpen();
      const selector = scope ? '[data-target-cursor-scope]' : 'html';
      const active = s.hideDefaultCursor && pointer.inside && !suppressed;
      const rule = active
        ? `${selector}, ${selector} *, ${selector} *::before, ${selector} *::after { cursor: none !important; }`
        : '';
      if (style.textContent !== rule) style.textContent = rule;
      if (active) {
        document.documentElement.classList.add('tc-active');
      } else {
        document.documentElement.classList.remove('tc-active');
      }
    };

    const isValidTargetSize = rect =>
      rect.width >= 12 &&
      rect.height >= 12 &&
      rect.width < window.innerWidth * 0.85 &&
      rect.height < window.innerHeight * 0.85;

    const findTarget = (x, y, element) => {
      const s = settingsRef.current;
      const node = element || document.elementFromPoint(x, y);
      if (!node || node === document.body || node === document.documentElement) return null;
      if (node.closest?.('.target-cursor')) return null;

      // Never snap an expanding box over text entry controls
      if (node.closest?.(TEXT_INPUT_SELECTOR)) return null;

      const scope = scopeOf();
      const clickable = node.closest?.(CLICKABLE_SELECTORS);
      if (clickable) {
        if (scope && !scope.contains(clickable)) return null;
        if (isValidTargetSize(clickable.getBoundingClientRect())) return clickable;
      }

      if (s.targetSelector) {
        const custom = node.closest?.(s.targetSelector);
        if (custom && custom !== document.body && custom !== document.documentElement) {
          if (scope && !scope.contains(custom)) return null;
          if (isValidTargetSize(custom.getBoundingClientRect())) return custom;
        }
      }

      return null;
    };

    const lockOn = next => {
      if (next === target) return;
      target = next;
      if (target) {
        const rect = target.getBoundingClientRect();
        const rawCorner = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
        const maxCorner = Math.min(rect.width, rect.height) / 2;
        targetRadius = Math.min(rawCorner, maxCorner) + (rawCorner > 0 ? settingsRef.current.padding : 6);
        targetTone = getTargetTone(target);
      } else {
        targetTone = 'light';
      }
    };

    const frame = now => {
      raf = 0;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;

      const suppressed = isOverlayOpen();
      const rect = !suppressed && target && target.isConnected ? target.getBoundingClientRect() : null;
      if (target && (!target.isConnected || suppressed || (rect && (rect.width <= 0 || rect.height <= 0)))) {
        lockOn(null);
      }

      const locked = !!rect && rect.width > 0 && rect.height > 0 && pointer.inside && !suppressed;
      const snapW = 5.4 / s.hoverDuration;
      const snapK = snapW * snapW;
      const snapC = 2 * 0.78 * snapW;

      if (reduce) {
        presence.x = pointer.inside && !suppressed ? 1 : 0;
        presence.v = 0;
        lock.x = locked ? 1 : 0;
        lock.v = 0;
        press.x = pointer.pressed && s.clickEffect ? 1 : 0;
        press.v = 0;
      } else {
        spring(presence, pointer.inside && !suppressed ? 1 : 0, 900, 56, dt);
        spring(lock, locked ? 1 : 0, snapK, 2 * snapW, dt);
        spring(press, pointer.pressed && s.clickEffect ? 1 : 0, 1100, 44, dt);
      }

      // Slightly offset idle center (+5, +6) so the orb frames the inner pointer centered around its tip
      let goalX = pointer.x + 5;
      let goalY = pointer.y + 6;
      let goalW = s.size / 2;
      let goalH = s.size / 2;
      let goalR = s.size / 2;

      if (locked) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const lean = s.parallaxOn ? 0.065 : 0;
        goalX = cx + (pointer.x - cx) * lean;
        goalY = cy + (pointer.y - cy) * lean;
        goalW = rect.width / 2 + s.padding;
        goalH = rect.height / 2 + s.padding;
        goalR = s.matchRadius ? Math.min(targetRadius, Math.min(goalW, goalH)) : Math.min(goalW, goalH);
      }

      if (!pointer.inside && presence.x < 0.01) pointer.seen = false;
      if (!pointer.seen || reduce) {
        centerX.x = goalX;
        centerX.v = 0;
        centerY.x = goalY;
        centerY.v = 0;
        halfW.x = goalW;
        halfW.v = 0;
        halfH.x = goalH;
        halfH.v = 0;
        radius.x = goalR;
        radius.v = 0;
        pointer.seen = pointer.inside;
      } else {
        // Tight idle follow keeps the Contrast Orb synchronized right behind SmoothCursor
        const follow = locked ? snapK : 1350;
        const followC = locked ? snapC : 2 * Math.sqrt(1350);
        spring(centerX, goalX, follow, followC, dt);
        spring(centerY, goalY, follow, followC, dt);
        spring(halfW, goalW, snapK, snapC, dt);
        spring(halfH, goalH, snapK, snapC, dt);
        spring(radius, goalR, snapK, 2 * snapW, dt);
      }

      const squeeze = reduce ? 1 : 1 - press.x * 0.09;
      const boxW = Math.max(8, halfW.x * 2);
      const boxH = Math.max(8, halfH.x * 2);
      const left = centerX.x - boxW / 2;
      const top = centerY.x - boxH / 2;
      const r = Math.max(4, Math.min(radius.x, Math.min(boxW, boxH) / 2));

      const orb = orbRef.current;
      if (orb) {
        orb.style.width = `${boxW.toFixed(2)}px`;
        orb.style.height = `${boxH.toFixed(2)}px`;
        orb.style.borderRadius = `${r.toFixed(2)}px`;
        orb.style.transform = `translate3d(${left.toFixed(2)}px, ${top.toFixed(2)}px, 0) scale(${squeeze.toFixed(4)})`;

        const stateKey = `${locked ? 'locked' : 'idle'}:${locked ? targetTone : 'light'}`;
        if (stateKey !== lastStateKey) {
          orb.dataset.state = locked ? 'locked' : 'idle';
          orb.dataset.tone = locked ? targetTone : 'light';
          lastStateKey = stateKey;
        }
      }

      const label = labelRef.current;
      if (label) {
        const text = s.showLabel && target ? target.getAttribute('data-cursor-label') || '' : '';
        if (text && text !== lastLabel) label.textContent = text;
        if (text) lastLabel = text;
        const shown = text && !suppressed ? Math.max(0, Math.min(1, lock.x)) : 0;
        const placeBelow = top < 42;
        const clampedX = Math.max(46, Math.min(window.innerWidth - 46, centerX.x));
        const anchorY = placeBelow ? top + boxH + 10 : top - 10;
        const yPercent = placeBelow ? '0%' : '-100%';
        const slideOffset = ((1 - shown) * (placeBelow ? -5 : 5)).toFixed(2);
        label.style.transform = `translate3d(${clampedX.toFixed(2)}px, ${anchorY.toFixed(2)}px, 0) translate(-50%, ${yPercent}) translateY(${slideOffset}px)`;
        label.style.opacity = shown.toFixed(3);
      }

      root.style.opacity = Math.max(0, Math.min(1, presence.x)).toFixed(3);

      const keepRunning =
        !reduce &&
        ((pointer.inside && !suppressed) ||
          presence.x > 0.005 ||
          Math.abs(presence.v) > 0.005 ||
          Math.abs(centerX.v) > 0.05 ||
          Math.abs(centerY.v) > 0.05 ||
          Math.abs(halfW.v) > 0.05 ||
          Math.abs(halfH.v) > 0.05 ||
          Math.abs(press.v) > 0.01);
      if (keepRunning) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    wakeRef.current = () => {
      hideCursor();
      wake();
    };

    const insideScope = (x, y, element) => {
      const scope = scopeOf();
      if (!scope) return true;
      if (element && scope.contains(element)) return true;
      const box = scope.getBoundingClientRect();
      return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
    };

    const onPointerMove = event => {
      if (event.pointerType && event.pointerType === 'touch') return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      const inside = insideScope(pointer.x, pointer.y, event.target);
      if (inside !== pointer.inside || isOverlayOpen()) {
        pointer.inside = inside;
        hideCursor();
      }
      lockOn(inside && !isOverlayOpen() ? findTarget(pointer.x, pointer.y, event.target) : null);
      wake();
    };

    const onPointerDown = event => {
      if (event.pointerType && event.pointerType === 'touch') return;
      pointer.pressed = true;
      wake();
    };

    const onPointerUp = () => {
      pointer.pressed = false;
      setTimeout(hideCursor, 0);
      wake();
    };

    const onEnter = event => {
      if (event && event.clientX && event.clientY) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
      }
      pointer.inside = true;
      hideCursor();
      wake();
    };

    const onLeave = () => {
      pointer.inside = false;
      pointer.pressed = false;
      lockOn(null);
      hideCursor();
      wake();
    };

    const onScroll = () => {
      if (!pointer.inside) return;
      hideCursor();
      lockOn(!isOverlayOpen() ? findTarget(pointer.x, pointer.y) : null);
      wake();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('mousedown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('mouseup', onPointerUp, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    document.documentElement.addEventListener('mouseenter', onEnter);
    window.addEventListener('focus', onEnter);
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    let overlayObserver = null;
    if (typeof MutationObserver !== 'undefined') {
      overlayObserver = new MutationObserver(() => {
        hideCursor();
        wake();
      });
      overlayObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
        childList: true
      });
      const projectModal = document.getElementById('project-modal');
      if (projectModal) {
        overlayObserver.observe(projectModal, { attributes: true, attributeFilter: ['class'] });
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      overlayObserver?.disconnect();
      wakeRef.current = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('scroll', onScroll, { capture: true });
      document.documentElement.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('focus', onEnter);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      lastScope?.removeAttribute('data-target-cursor-scope');
      document.documentElement.classList.remove('tc-active');
      style.remove();
    };
  }, [host]);

  useEffect(() => {
    wakeRef.current?.();
  });

  if (!host) return null;

  return createPortal(
    <div ref={rootRef} className="target-cursor" style={{ mixBlendMode: blendMode, opacity: 0 }} aria-hidden="true">
      <div ref={orbRef} className="target-cursor__orb" data-state="idle" data-tone="light" />
      <SmoothCursor hideDefaultCursor={false} zIndex={2} />
      <span ref={labelRef} className="target-cursor__label" />
    </div>,
    host
  );
};

export default TargetCursor;
