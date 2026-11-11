'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SmoothCursor } from '@/registry/magicui/smooth-cursor';
import './TargetCursor.css';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

const spring = (state, goal, stiffness, damping, dt) => {
  const maxH = 0.004;
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

// Strictly clickable buttons, links, controls, and interactive cards (never plain text/headings/inputs/rows)
const CLICKABLE_SELECTORS = [
  'a[href]',
  'button:not(:disabled):not(.pmw-mobile-thumb-card)',
  'summary',
  'select:not(:disabled)',
  '[role="button"]:not([aria-disabled="true"]):not(.editorial-row):not(.photo-print-card):not(.polaroid-item):not(.pmw-mobile-thumb-card):not(.dcf-hit)',
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
  '.card-item',
  '.skill-card',
  '.pmw-view-all-btn',
  '.studio-meet-trigger',
  '.dock-toggle-btn'
].join(', ');

const TEXT_INPUT_SELECTOR = 'input, textarea, [contenteditable="true"], [contenteditable=""]';
const EXCLUDED_TARGET_SELECTOR = '.photo-print-card, .polaroid-item, .pmw-mobile-thumb-card, .dcf-hit, .dcf-glyph, .dcf-doodle';

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
  hoverDuration = 0.18,
  parallaxOn = true,
  hideDefaultCursor = true,
  size = 38,
  padding = 6,
  matchRadius = true,
  blendMode = 'normal',
  showLabel = true,
  clickEffect = true,
  container
}) => {
  const [host, setHost] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
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
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia(FINE_POINTER_QUERY);
    const sync = () => setIsEnabled(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!host || !root || !isEnabled) return undefined;

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduce = reduceQuery.matches;
    const style = document.createElement('style');
    document.head.appendChild(style);

    const pointer = { x: 0, y: 0, inside: false, seen: false, pressed: false, hasCoords: false };
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
    let lastEventNode = null;
    let needsScrollHitTest = false;
    let scrollFallbackTimer = 0;
    let raf = 0;
    let last = 0;
    let lastLabel = '';
    let lastScope = null;
    let lastStateKey = '';
    let lastHideRule = '';
    let lastOrbW = -1;
    let lastOrbH = -1;
    let lastOrbR = -1;
    let lastRootOpacity = -1;
    let lastLabelOpacity = -1;

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
      const active = s.hideDefaultCursor && pointer.inside && pointer.hasCoords && !suppressed;
      const rule = active
        ? `${selector}, ${selector} *, ${selector} *::before, ${selector} *::after { cursor: none !important; }`
        : '';
      if (rule !== lastHideRule) {
        lastHideRule = rule;
        style.textContent = rule;
        if (active) document.documentElement.classList.add('tc-active');
        else document.documentElement.classList.remove('tc-active');
      }
    };

    const isValidTargetSize = rect =>
      rect.width >= 12 &&
      rect.height >= 12 &&
      rect.width < Math.min(600, window.innerWidth * 0.72) &&
      rect.height < Math.min(440, window.innerHeight * 0.72);

    const findTarget = (x, y, element) => {
      const s = settingsRef.current;
      const node = element || document.elementFromPoint(x, y);
      if (!node || node === document.body || node === document.documentElement) return null;
      if (node.closest?.('.target-cursor')) return null;
      if (node.closest?.(TEXT_INPUT_SELECTOR)) return null;
      if (node.closest?.(EXCLUDED_TARGET_SELECTOR)) return null;

      const scope = scopeOf();
      const clickable = node.closest?.(CLICKABLE_SELECTORS);
      if (clickable) {
        if (scope && !scope.contains(clickable)) return null;
        if (isValidTargetSize(clickable.getBoundingClientRect())) return clickable;
      }

      if (s.targetSelector) {
        const custom = node.closest?.(s.targetSelector);
        if (custom && custom !== document.body && custom !== document.documentElement && !custom.classList?.contains('editorial-row')) {
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
      if (document.hidden) {
        last = 0;
        return;
      }

      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;

      if (needsScrollHitTest) {
        needsScrollHitTest = false;
        lastEventNode = null;
        if (pointer.inside && pointer.hasCoords && !isOverlayOpen()) {
          lockOn(findTarget(pointer.x, pointer.y));
        } else {
          lockOn(null);
        }
      }

      const suppressed = isOverlayOpen();
      const show = pointer.inside && pointer.hasCoords && !suppressed;
      const rect = show && target && target.isConnected ? target.getBoundingClientRect() : null;
      if (target && (!target.isConnected || !show || (rect && (rect.width <= 0 || rect.height <= 0)))) {
        lockOn(null);
      }

      const locked = !!rect && rect.width > 0 && rect.height > 0 && show;
      const snapW = 5.0 / s.hoverDuration;
      const snapK = snapW * snapW;
      const snapC = 2 * 0.76 * snapW;
      const targetPresence = show ? 1 : 0;
      const targetLock = locked ? 1 : 0;
      const targetPress = pointer.pressed && s.clickEffect ? 1 : 0;

      if (reduce) {
        presence.x = targetPresence;
        presence.v = 0;
        lock.x = targetLock;
        lock.v = 0;
        press.x = targetPress;
        press.v = 0;
      } else {
        spring(presence, targetPresence, 800, 50, dt);
        spring(lock, targetLock, snapK, 2 * snapW, dt);
        spring(press, targetPress, 950, 42, dt);
      }

      // Centered directly around MagicUI SmoothCursor's center point (pointer.x, pointer.y)
      let goalX = pointer.x;
      let goalY = pointer.y;
      let goalW = s.size / 2;
      let goalH = s.size / 2;
      let goalR = s.size / 2;

      if (locked) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const lean = s.parallaxOn ? 0.07 : 0;
        goalX = cx + (pointer.x - cx) * lean;
        goalY = cy + (pointer.y - cy) * lean;
        goalW = rect.width / 2 + s.padding;
        goalH = rect.height / 2 + s.padding;
        goalR = s.matchRadius ? Math.min(targetRadius, Math.min(goalW, goalH)) : Math.min(goalW, goalH);
      }

      if (!show && presence.x < 0.01) pointer.seen = false;
      if ((!pointer.seen || reduce) && show) {
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
        pointer.seen = true;
      } else if (show || pointer.seen) {
        const follow = locked ? snapK : 420;
        const followC = locked ? snapC : 44;
        spring(centerX, goalX, follow, followC, dt);
        spring(centerY, goalY, follow, followC, dt);
        spring(halfW, goalW, snapK, snapC, dt);
        spring(halfH, goalH, snapK, snapC, dt);
        spring(radius, goalR, snapK, 2 * snapW, dt);
      }

      const squeeze = reduce ? 1 : 1 - press.x * 0.1;
      const boxW = Math.max(8, halfW.x * 2);
      const boxH = Math.max(8, halfH.x * 2);
      const left = centerX.x - boxW / 2;
      const top = centerY.x - boxH / 2;
      const r = Math.max(4, Math.min(radius.x, Math.min(boxW, boxH) / 2));

      const orb = orbRef.current;
      if (orb) {
        if (Math.abs(boxW - lastOrbW) > 0.04) {
          orb.style.width = `${boxW.toFixed(2)}px`;
          lastOrbW = boxW;
        }
        if (Math.abs(boxH - lastOrbH) > 0.04) {
          orb.style.height = `${boxH.toFixed(2)}px`;
          lastOrbH = boxH;
        }
        if (Math.abs(r - lastOrbR) > 0.04) {
          orb.style.borderRadius = `${r.toFixed(2)}px`;
          lastOrbR = r;
        }
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
        if (text && text !== lastLabel) {
          label.textContent = text;
          lastLabel = text;
        }
        const shown = text && !suppressed ? Math.max(0, Math.min(1, lock.x)) : 0;
        if (shown > 0.004 || lastLabelOpacity > 0.004) {
          const placeBelow = top < 42;
          const clampedX = Math.max(46, Math.min(window.innerWidth - 46, centerX.x));
          const anchorY = placeBelow ? top + boxH + 10 : top - 10;
          const yPercent = placeBelow ? '0%' : '-100%';
          const slideOffset = ((1 - shown) * (placeBelow ? -5 : 5)).toFixed(2);
          label.style.transform = `translate3d(${clampedX.toFixed(2)}px, ${anchorY.toFixed(2)}px, 0) translate(-50%, ${yPercent}) translateY(${slideOffset}px)`;
          if (Math.abs(shown - lastLabelOpacity) > 0.003) {
            label.style.opacity = shown.toFixed(3);
            lastLabelOpacity = shown;
          }
        }
      }

      const rawOpacity = Math.max(0, Math.min(1, presence.x));
      const rootOpacity = !show && rawOpacity < 0.01 ? 0 : rawOpacity;
      if (Math.abs(rootOpacity - lastRootOpacity) > 0.003 || (rootOpacity === 0 && lastRootOpacity !== 0)) {
        root.style.opacity = rootOpacity.toFixed(3);
        lastRootOpacity = rootOpacity;
      }

      const settled =
        (!show && !pointer.seen && rootOpacity === 0) ||
        (Math.abs(goalX - centerX.x) < 0.08 &&
          Math.abs(centerX.v) < 0.08 &&
          Math.abs(goalY - centerY.x) < 0.08 &&
          Math.abs(centerY.v) < 0.08 &&
          Math.abs(goalW - halfW.x) < 0.08 &&
          Math.abs(halfW.v) < 0.08 &&
          Math.abs(goalH - halfH.x) < 0.08 &&
          Math.abs(halfH.v) < 0.08 &&
          Math.abs(goalR - radius.x) < 0.08 &&
          Math.abs(radius.v) < 0.08 &&
          Math.abs(targetPresence - presence.x) < 0.005 &&
          Math.abs(presence.v) < 0.005 &&
          Math.abs(targetLock - lock.x) < 0.005 &&
          Math.abs(lock.v) < 0.005 &&
          Math.abs(targetPress - press.x) < 0.005 &&
          Math.abs(press.v) < 0.005);

      if (!reduce && !settled) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
    };
    wakeRef.current = () => {
      hideCursor();
      wake();
    };

    const onReduceChange = event => {
      reduce = event.matches;
      wake();
    };
    reduceQuery.addEventListener?.('change', onReduceChange);

    const insideScope = (x, y, element) => {
      const scope = scopeOf();
      if (!scope) return true;
      if (element && scope.contains(element)) return true;
      const box = scope.getBoundingClientRect();
      return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
    };

    const onPointerMove = event => {
      if (event.pointerType === 'touch') {
        pointer.hasCoords = false;
        return;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.hasCoords = true;
      const evtTarget = event.target || null;
      if (evtTarget !== lastEventNode || needsScrollHitTest || isOverlayOpen()) {
        lastEventNode = evtTarget;
        needsScrollHitTest = false;
        const inside = insideScope(pointer.x, pointer.y, evtTarget);
        if (inside !== pointer.inside || isOverlayOpen()) {
          pointer.inside = inside;
          hideCursor();
        }
        lockOn(inside && !isOverlayOpen() ? findTarget(pointer.x, pointer.y, evtTarget) : null);
      } else if (!pointer.inside) {
        pointer.inside = true;
        hideCursor();
      }
      wake();
    };

    const onPointerDown = event => {
      if (event.pointerType === 'touch') return;
      if (Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.hasCoords = true;
        pointer.inside = true;
      }
      pointer.pressed = true;
      wake();
    };

    const onPointerUp = event => {
      if (event.pointerType === 'touch') return;
      pointer.pressed = false;
      hideCursor();
      wake();
    };

    const onEnter = event => {
      if (
        event &&
        Number.isFinite(event.clientX) &&
        Number.isFinite(event.clientY) &&
        (event.clientX !== 0 || event.clientY !== 0)
      ) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.hasCoords = true;
      }
      pointer.inside = true;
      lastEventNode = null;
      hideCursor();
      wake();
    };

    const onLeave = () => {
      pointer.inside = false;
      pointer.pressed = false;
      pointer.hasCoords = false;
      lastEventNode = null;
      needsScrollHitTest = false;
      if (scrollFallbackTimer) {
        window.clearTimeout(scrollFallbackTimer);
        scrollFallbackTimer = 0;
      }
      lockOn(null);
      hideCursor();
      wake();
    };

    const onScrollRest = () => {
      if (scrollFallbackTimer) {
        window.clearTimeout(scrollFallbackTimer);
        scrollFallbackTimer = 0;
      }
      if (!pointer.inside || !pointer.hasCoords) return;
      needsScrollHitTest = true;
      wake();
    };

    const hasNativeScrollEnd = 'onscrollend' in window;
    const onScroll = () => {
      if (!pointer.inside || !pointer.hasCoords) return;
      if (target) {
        lockOn(null);
        wake();
      }
      if (!hasNativeScrollEnd) {
        if (scrollFallbackTimer) window.clearTimeout(scrollFallbackTimer);
        scrollFallbackTimer = window.setTimeout(onScrollRest, 100);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    if (hasNativeScrollEnd) {
      window.addEventListener('scrollend', onScrollRest, { passive: true, capture: true });
    }
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
        attributeFilter: ['class']
      });
      const projectModal = document.getElementById('project-modal');
      if (projectModal) {
        overlayObserver.observe(projectModal, { attributes: true, attributeFilter: ['class'] });
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      if (scrollFallbackTimer) window.clearTimeout(scrollFallbackTimer);
      overlayObserver?.disconnect();
      reduceQuery.removeEventListener?.('change', onReduceChange);
      wakeRef.current = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('scroll', onScroll, { capture: true });
      if (hasNativeScrollEnd) {
        window.removeEventListener('scrollend', onScrollRest, { capture: true });
      }
      document.documentElement.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('focus', onEnter);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      lastScope?.removeAttribute('data-target-cursor-scope');
      document.documentElement.classList.remove('tc-active');
      style.remove();
    };
  }, [host, isEnabled]);

  useEffect(() => {
    wakeRef.current?.();
  });

  if (!host || !isEnabled) return null;

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
