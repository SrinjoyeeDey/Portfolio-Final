'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './TargetCursor.css';

const CORNER_ANGLES = [0, 90, 180, 270];
const QUARTER = Math.PI / 2;

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

const TargetCursor = ({
  targetSelector = '.cursor-target',
  cursorColor = '#ffffff',
  cursorColorOnTarget,
  spinDuration = 2,
  hoverDuration = 0.2,
  parallaxOn = true,
  hideDefaultCursor = true,
  size = 36,
  cornerSize = 12,
  thickness = 3,
  padding = 6,
  matchRadius = true,
  dotSize = 4,
  blendMode = 'difference',
  showLabel = true,
  clickEffect = true,
  container
}) => {
  const [host, setHost] = useState(null);
  const rootRef = useRef(null);
  const cornerRefs = useRef([]);
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const wakeRef = useRef(null);
  const settings = {
    targetSelector,
    cursorColor,
    cursorColorOnTarget,
    spinDuration,
    hoverDuration: Math.max(0.05, hoverDuration),
    parallaxOn,
    hideDefaultCursor,
    size: Math.max(4, size),
    cornerSize: Math.max(2, cornerSize),
    thickness: Math.max(0.5, thickness),
    padding,
    matchRadius,
    dotSize: Math.max(0, dotSize),
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
    const turn = { x: 0, v: 0 };
    const lock = { x: 0, v: 0 };
    const press = { x: 0, v: 0 };
    const presence = { x: 0, v: 0 };
    let target = null;
    let targetRadius = 0;
    let quarter = 0;
    let spinSpeed = 0;
    let raf = 0;
    let last = 0;
    let lastLabel = '';
    let lastColor = '';
    let lastScope = null;

    const scopeOf = () => resolveElement(settingsRef.current.container);

    const hideCursor = () => {
      const s = settingsRef.current;
      const scope = scopeOf();
      if (scope !== lastScope) {
        lastScope?.removeAttribute('data-target-cursor-scope');
        scope?.setAttribute('data-target-cursor-scope', '');
        lastScope = scope;
      }
      const selector = scope ? '[data-target-cursor-scope]' : 'html';
      const rule =
        s.hideDefaultCursor && pointer.inside
          ? `${selector}, ${selector} *, ${selector} *::before, ${selector} *::after { cursor: none !important; }`
          : '';
      if (style.textContent !== rule) style.textContent = rule;
      if (s.hideDefaultCursor && pointer.inside) {
        document.documentElement.classList.add('tc-active');
      } else {
        document.documentElement.classList.remove('tc-active');
      }
    };

    const BUTTON_SELECTORS =
      'a, button, input, textarea, select, [role="button"], [tabindex="0"], .btn, .dock-item, .dock-badge-icon, .social-link-btn, .spotlight-explore-btn, .spotlight-glide-btn, .rail-icon, .mimo-trigger-btn, .mimo-close-btn, .mimo-send-btn, .modal-close-btn, .back-to-top-btn, .filter-btn, .filter-pill, .quick-pill-btn, .type-pill-option, .project-card, .polaroid-item, .card-item, .skill-card, .cursor-target';

    const HEADING_SELECTORS =
      'h1, h2, h3, h4, h5, h6, [role="heading"], .spotlight-headline, .build-line, .with-me-line, .stat-number, .logo-text, .brand-logo, .section-title, .section-heading, .highlight-yellow-text, .kanji-main';

    const TEXT_BLOCK_SELECTORS =
      'p, label, li, blockquote, figcaption, .spotlight-left-bio, .spotlight-right-desc, .spotlight-right-roles, .hero-supporting-desc, .stat-label, .dock-label, .role-pill-label, .role-pill-val, .footer-tagline, .copyright-text';

    const INLINE_TEXT_SELECTORS =
      'span, strong, em, b, small, i, .spotlight-brand-name, .spotlight-status-text, .spotlight-location-text, .editorial-date, .tech-text';

    const findTarget = (x, y, element) => {
      const s = settingsRef.current;
      const node = element || document.elementFromPoint(x, y);
      if (!node || node === document.body || node === document.documentElement) return null;
      if (node.closest?.('.target-cursor')) return null;

      const scope = scopeOf();

      // 1. Interactive buttons, links, controls, pills, cards take top priority
      const button = node.closest?.(BUTTON_SELECTORS);
      if (button) {
        if (scope && !scope.contains(button)) return null;
        return button;
      }

      // 2. Headings (h1-h6, spotlight headlines, title lines)
      const heading = node.closest?.(HEADING_SELECTORS);
      if (heading) {
        if (scope && !scope.contains(heading)) return null;
        return heading;
      }

      // 3. Text blocks (paragraphs, lists, blockquotes, descriptions, bios)
      const textBlock = node.closest?.(TEXT_BLOCK_SELECTORS);
      if (textBlock) {
        if (scope && !scope.contains(textBlock)) return null;
        return textBlock;
      }

      // 4. Inline text tags, badges, and phrases with direct text content
      const inlineText = node.closest?.(INLINE_TEXT_SELECTORS);
      if (inlineText) {
        if (scope && !scope.contains(inlineText)) return null;
        const text = inlineText.textContent?.trim();
        if (text && text.length > 0 && !inlineText.querySelector('div, p, h1, h2, h3, h4, h5, h6')) {
          const rect = inlineText.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && rect.width < window.innerWidth * 0.8) {
            return inlineText;
          }
        }
      }

      // 5. Custom targetSelector if provided and not a giant wrapper container
      if (s.targetSelector) {
        const found = node.closest?.(s.targetSelector);
        if (found && found !== document.body && found !== document.documentElement) {
          if (scope && !scope.contains(found)) return null;
          const rect = found.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && rect.width < window.innerWidth * 0.85 && rect.height < window.innerHeight * 0.85) {
            return found;
          }
        }
      }

      return null;
    };

    const lockOn = next => {
      if (next === target) return;
      target = next;
      if (target) {
        const angle = turn.x;
        quarter = Math.round(angle / QUARTER);
        const corner = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
        targetRadius = corner;
        spinSpeed = 0;
      }
    };

    const frame = now => {
      raf = 0;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;

      const rect = target && target.isConnected ? target.getBoundingClientRect() : null;
      if (target && (!target.isConnected || (rect && (rect.width <= 0 || rect.height <= 0)))) lockOn(null);
      const locked = !!rect && rect.width > 0 && rect.height > 0 && pointer.inside;
      const snapW = 4.6 / s.hoverDuration;
      const snapK = snapW * snapW;
      const snapC = 2 * 0.62 * snapW;

      spring(presence, pointer.inside ? 1 : 0, 800, 50, dt);
      spring(lock, locked ? 1 : 0, snapK, 2 * snapW, dt);
      spring(press, pointer.pressed && s.clickEffect ? 1 : 0, 900, 40, dt);

      let goalX = pointer.x;
      let goalY = pointer.y;
      let goalW = s.size / 2;
      let goalH = s.size / 2;
      let goalR = Math.min(2, s.cornerSize / 4);
      if (locked) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const lean = s.parallaxOn ? 0.08 : 0;
        goalX = cx + (pointer.x - cx) * lean;
        goalY = cy + (pointer.y - cy) * lean;
        const odd = Math.abs(quarter) % 2 === 1;
        const w = rect.width / 2 + s.padding;
        const h = rect.height / 2 + s.padding;
        goalW = odd ? h : w;
        goalH = odd ? w : h;
        goalR = s.matchRadius ? Math.min(targetRadius + Math.max(0, s.padding), s.cornerSize) : 0;
      }

      if (!pointer.inside && presence.x < 0.01) pointer.seen = false;
      if (!pointer.seen) {
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
        turn.v = 0;
        pointer.seen = pointer.inside;
      }

      const follow = locked ? snapK : 2200;
      const followC = locked ? snapC : 2 * Math.sqrt(2200);
      spring(centerX, goalX, follow, followC, dt);
      spring(centerY, goalY, follow, followC, dt);
      spring(halfW, goalW, snapK, snapC, dt);
      spring(halfH, goalH, snapK, snapC, dt);
      spring(radius, goalR, snapK, 2 * snapW, dt);

      if (locked) {
        spring(turn, quarter * QUARTER, snapK, snapC, dt);
      } else {
        const speed = s.spinDuration > 0 && !reduce ? (Math.PI * 2) / s.spinDuration : 0;
        spinSpeed += (speed - spinSpeed) * (1 - Math.exp(-dt * 3));
        turn.v = spinSpeed;
        turn.x += spinSpeed * dt;
      }

      const squeeze = 1 - press.x * 0.14;
      const cos = Math.cos(turn.x);
      const sin = Math.sin(turn.x);
      const w = Math.max(0, halfW.x) * squeeze;
      const h = Math.max(0, halfH.x) * squeeze;
      const local = [
        [-w, -h],
        [w, -h],
        [w, h],
        [-w, h]
      ];
      const r = Math.max(0, Math.min(radius.x, s.cornerSize));
      const degrees = (turn.x * 180) / Math.PI;
      let left = Infinity;
      let top = Infinity;
      cornerRefs.current.forEach((corner, i) => {
        if (!corner) return;
        const [lx, ly] = local[i];
        const x = centerX.x + lx * cos - ly * sin;
        const y = centerY.x + lx * sin + ly * cos;
        left = Math.min(left, x);
        top = Math.min(top, y);
        corner.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${(CORNER_ANGLES[i] + degrees).toFixed(2)}deg)`;
        corner.style.width = `${s.cornerSize}px`;
        corner.style.height = `${s.cornerSize}px`;
        corner.style.borderWidth = `${s.thickness}px 0 0 ${s.thickness}px`;
        corner.style.borderTopLeftRadius = `${r.toFixed(2)}px`;
      });

      const dot = dotRef.current;
      if (dot) {
        const dotScale = 1 - press.x * 0.35;
        dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%) scale(${dotScale.toFixed(3)})`;
        dot.style.width = `${s.dotSize}px`;
        dot.style.height = `${s.dotSize}px`;
      }

      const label = labelRef.current;
      if (label) {
        const text = s.showLabel && target ? target.getAttribute('data-cursor-label') || '' : '';
        if (text && text !== lastLabel) label.textContent = text;
        if (text) lastLabel = text;
        const shown = text ? Math.max(0, Math.min(1, lock.x)) : 0;
        label.style.transform = `translate3d(${left.toFixed(2)}px, ${(top - 8).toFixed(2)}px, 0) translateY(-100%) translateY(${((1 - shown) * 4).toFixed(2)}px)`;
        label.style.opacity = shown.toFixed(3);
      }

      const mix = s.cursorColorOnTarget ? Math.round(Math.max(0, Math.min(1, lock.x)) * 100) : 0;
      const color = mix ? `color-mix(in oklab, ${s.cursorColorOnTarget} ${mix}%, ${s.cursorColor})` : s.cursorColor;
      if (color !== lastColor) {
        root.style.setProperty('--target-cursor-color', color);
        lastColor = color;
      }
      root.style.opacity = Math.max(0, Math.min(1, presence.x)).toFixed(3);

      const keepRunning =
        pointer.inside ||
        presence.x > 0.005 ||
        Math.abs(presence.v) > 0.005 ||
        Math.abs(centerX.v) > 0.01 ||
        Math.abs(centerY.v) > 0.01;
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
      if (inside !== pointer.inside) {
        pointer.inside = inside;
        hideCursor();
      }
      lockOn(inside ? findTarget(pointer.x, pointer.y, event.target) : null);
      wake();
    };

    const onPointerDown = event => {
      if (event.pointerType && event.pointerType === 'touch') return;
      pointer.pressed = true;
      wake();
    };

    const onPointerUp = () => {
      pointer.pressed = false;
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
      lockOn(findTarget(pointer.x, pointer.y));
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

    return () => {
      cancelAnimationFrame(raf);
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
      style.remove();
    };
  }, [host]);

  useEffect(() => {
    wakeRef.current?.();
  });

  if (!host) return null;

  return createPortal(
    <div ref={rootRef} className="target-cursor" style={{ mixBlendMode: blendMode, opacity: 0 }} aria-hidden="true">
      {CORNER_ANGLES.map((angle, i) => (
        <span
          key={angle}
          ref={element => {
            cornerRefs.current[i] = element;
          }}
          className="target-cursor__corner"
        />
      ))}
      <span ref={dotRef} className="target-cursor__dot" />
      <span ref={labelRef} className="target-cursor__label" />
    </div>,
    host
  );
};

export default TargetCursor;
