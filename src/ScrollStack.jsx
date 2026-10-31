'use client';

import React, { Children, Fragment, isValidElement, useLayoutEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './ScrollStack.css';

const resolveOffset = (value, size) => {
  if (typeof value === 'number') return value;
  const text = String(value).trim();
  if (text.endsWith('%')) return (parseFloat(text) / 100) * size;
  return parseFloat(text) || 0;
};

const toLength = value => (typeof value === 'number' ? `${value}px` : value);

const scrollsInside = (node, stop, delta) => {
  for (let element = node; element && element !== stop; element = element.parentElement) {
    if (element.scrollHeight <= element.clientHeight + 1) continue;
    const overflow = getComputedStyle(element).overflowY;
    if (overflow !== 'auto' && overflow !== 'scroll') continue;
    if (delta > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 1 : element.scrollTop > 0) {
      return true;
    }
  }
  return false;
};

export const ScrollStackItem = ({ children, itemClassName = '', style, ...restProps }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()} style={style} {...restProps}>
    {children}
    <span className="scroll-stack-card__shade" aria-hidden="true" />
  </div>
);

const ScrollStack = forwardRef(({
  children,
  className = '',
  itemDistance = 100,
  itemStackDistance = 24,
  stackPosition = '15%',
  itemScale = 0.05,
  baseScale = 0.8,
  dimAmount = 0.2,
  blurAmount = 0,
  tiltAmount = 0,
  rotationAmount = 0,
  holdDistance = 200,
  smoothScroll = true,
  snap = false,
  useWindowScroll = false,
  onStackComplete,
  onIndexChange
}, ref) => {
  const rootRef = useRef(null);
  const innerRef = useRef(null);
  const endRef = useRef(null);
  const settingsRef = useRef(null);
  const scheduleRef = useRef(null);
  const glideToRef = useRef(null);
  const pointsRef = useRef([]);
  const lastActiveIndexRef = useRef(0);
  const lastNavTimeRef = useRef(0);
  const touchStartYRef = useRef(0);
  const items = Children.toArray(children);

  useImperativeHandle(ref, () => ({
    scrollToIndex: (index) => {
      const pts = pointsRef.current;
      if (pts && pts[index] !== undefined && glideToRef.current) {
        lastActiveIndexRef.current = index;
        settingsRef.current?.onIndexChange?.(index);
        glideToRef.current(pts[index]);
      }
    },
    getPoints: () => pointsRef.current,
    getCurrentIndex: () => lastActiveIndexRef.current
  }));

  useLayoutEffect(() => {
    settingsRef.current = {
      itemDistance,
      itemStackDistance,
      stackPosition,
      itemScale,
      baseScale,
      dimAmount,
      blurAmount,
      tiltAmount,
      rotationAmount,
      holdDistance,
      smoothScroll,
      snap,
      onStackComplete,
      onIndexChange
    };
    scheduleRef.current?.();
  });

  useLayoutEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const end = endRef.current;
    if (!root || !inner || !end) return undefined;

    const windowed = useWindowScroll;
    const target = windowed ? window : root;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cache = new Map();
    let frame = 0;
    let glide = 0;
    let rest = 0;
    let complete = false;
    let gliding = false;
    let pressed = false;
    let current = 0;
    let goal = 0;
    let written = 0;
    let last = 0;
    let points = [];
    let reach = 0;

    const readScroll = () => (windowed ? window.scrollY : root.scrollTop);
    const maxScroll = () =>
      windowed ? document.documentElement.scrollHeight - window.innerHeight : root.scrollHeight - root.clientHeight;
    const writeScroll = value => {
      written = value;
      if (windowed) {
        window.scrollTo({ top: value, behavior: 'instant' });
      } else {
        root.scrollTop = value;
      }
    };

    const write = (key, value, apply) => {
      if (cache.get(key) === value) return false;
      cache.set(key, value);
      apply(value);
      return true;
    };

    const update = () => {
      frame = 0;
      const settings = settingsRef.current;
      const slots = Array.from(inner.children).filter(child => child.hasAttribute('data-stack-slot'));
      if (!settings || !slots.length) return;

      const viewHeight = windowed ? window.innerHeight : root.clientHeight;
      const viewTop = windowed ? 0 : root.getBoundingClientRect().top + root.clientTop;
      const stackTop = resolveOffset(settings.stackPosition, viewHeight);
      const offset = settings.itemStackDistance;
      const heights = slots.map(slot => slot.offsetHeight);
      const tops = slots.map(slot => slot.getBoundingClientRect().top);
      const lastPin = stackTop + (slots.length - 1) * offset;
      const padTop = windowed ? 0 : stackTop;
      const endHeight =
        settings.holdDistance + (windowed ? 0 : Math.max(0, viewHeight - lastPin - heights[heights.length - 1]));

      let moved = write('padTop', padTop, value => {
        inner.style.paddingTop = `${value}px`;
      });
      moved =
        write('endHeight', endHeight, value => {
          end.style.height = `${value}px`;
        }) || moved;

      let flow = inner.getBoundingClientRect().top - viewTop + readScroll() + padTop;
      points = heights.map((height, i) => {
        const point = flow - stackTop - i * offset;
        flow += height + settings.itemDistance;
        return point;
      });
      pointsRef.current = points;
      reach = Math.max(40, (heights[0] + settings.itemDistance - offset) / 2);

      const depths = slots.map(() => 0);
      let lastCover = 0;
      let currentIdx = 0;
      for (let j = 1; j < slots.length; j++) {
        const pinBefore = viewTop + stackTop + (j - 1) * offset;
        const start = pinBefore + heights[j - 1];
        const span = Math.max(1, start - pinBefore - offset);
        const cover = Math.min(1, Math.max(0, (start - tops[j]) / span));
        for (let i = 0; i < j; i++) depths[i] += cover;
        lastCover = cover;
        if (cover >= 0.4) {
          currentIdx = j;
        }
      }

      if (currentIdx !== lastActiveIndexRef.current) {
        lastActiveIndexRef.current = currentIdx;
        settings.onIndexChange?.(currentIdx);
      }

      const dimStep = Math.min(Math.max(settings.dimAmount, 0), 1);
      slots.forEach((slot, i) => {
        const card = slot.firstElementChild;
        if (!card) return;
        const depth = depths[i];
        const lean = Math.min(depth, 1);
        const scale = Math.max(Math.min(settings.baseScale, 1), 1 - depth * settings.itemScale);
        const tilt = -lean * settings.tiltAmount;
        const turn = lean * settings.rotationAmount * (i % 2 ? -1 : 1);
        const blur = depth * settings.blurAmount;
        const dim = 1 - Math.pow(1 - dimStep, depth);
        const transform =
          depth < 0.0005
            ? ''
            : `perspective(1200px) rotateX(${tilt.toFixed(2)}deg) rotate(${turn.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        write(`transform${i}`, transform, value => {
          card.style.transform = value;
        });
        write(`filter${i}`, blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : '', value => {
          card.style.filter = value;
        });
        write(`dim${i}`, dim.toFixed(3), value => {
          card.style.setProperty('--scroll-stack-dim', value);
        });
      });

      const done = slots.length > 1 && lastCover >= 0.999;
      if (done !== complete) {
        complete = done;
        if (done) settings.onStackComplete?.();
      }

      if (moved) schedule();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const step = now => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (Math.abs(readScroll() - written) > 2) {
        gliding = false;
        glide = 0;
        settleSoon();
        return;
      }
      current += (goal - current) * (1 - Math.pow(0.85, dt * 60));
      if (Math.abs(goal - current) < 0.5) current = goal;
      writeScroll(current);
      if (current === goal) {
        gliding = false;
        glide = 0;
        settleSoon();
        return;
      }
      glide = requestAnimationFrame(step);
    };

    const glideTo = value => {
      goal = Math.min(Math.max(value, 0), maxScroll());
      if (motion.matches) {
        writeScroll(goal);
        return;
      }
      current = readScroll();
      written = current;
      last = performance.now();
      if (!gliding) {
        gliding = true;
        glide = requestAnimationFrame(step);
      }
    };
    glideToRef.current = glideTo;

    const settle = () => {
      rest = 0;
      if (!settingsRef.current?.snap || gliding || pressed || !points.length) return;
      const now = readScroll();
      const nearest = points.reduce((best, point) => (Math.abs(point - now) < Math.abs(best - now) ? point : best));
      const gap = Math.abs(nearest - now);
      if (gap > 1 && gap < reach) glideTo(nearest);
    };

    const settleSoon = () => {
      window.clearTimeout(rest);
      rest = window.setTimeout(settle, 140);
    };

    const onScroll = () => {
      schedule();
      if (!gliding) settleSoon();
    };

    // Smart stepped wheel navigation:
    // - Steps through project cards one by one with the 3D stacking effect when in view
    // - When at Card 0 and scrolling UP: smoothly glides out to About section
    // - When at Card 5 (last) and scrolling DOWN: smoothly glides out to Skills section
    // - When passing through / not in view: allows natural uninterrupted window scrolling
    const onWheel = event => {
      if (motion.matches || event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const delta = event.deltaY;
      if (Math.abs(delta) < 12) return;

      // Check if the projects layer is active in the viewport
      const projectsLayer = document.getElementById('story-layer-projects') || root;
      const rect = projectsLayer.getBoundingClientRect();
      const vh = window.innerHeight;

      // If user is scrolling DOWN and projects top is still in lower half of screen (user still in About),
      // DO NOT intercept! Let the window scroll down to projects!
      if (delta > 0 && rect.top > vh * 0.45) {
        return;
      }

      // If user is scrolling UP and projects bottom is still in upper half of screen (user still in Skills),
      // DO NOT intercept! Let the window scroll up to projects!
      if (delta < 0 && rect.bottom < vh * 0.55) {
        return;
      }

      // If projects layer is not on screen at all, return
      if (rect.bottom < 0 || rect.top > vh) {
        return;
      }

      const currentIdx = lastActiveIndexRef.current;
      const totalItems = items.length;

      if (delta > 0) {
        // Scrolling DOWN
        if (currentIdx < totalItems - 1) {
          event.preventDefault();
          const now = performance.now();
          if (now - lastNavTimeRef.current < 260) return;
          lastNavTimeRef.current = now;

          // Gently align projects layer to top if slightly offset
          if (Math.abs(rect.top) > 10) {
            projectsLayer.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          const nextIdx = currentIdx + 1;
          lastActiveIndexRef.current = nextIdx;
          settingsRef.current?.onIndexChange?.(nextIdx);
          const targetPoint = pointsRef.current[nextIdx];
          if (targetPoint !== undefined) {
            glideTo(targetPoint);
          }
        } else {
          // At the LAST card (Card 5 / Punarchakra):
          // User is done with projects and wants to see what's NEXT (Skills)!
          // NEVER preventDefault - allow window wheel scroll!
          const now = performance.now();
          if (now - lastNavTimeRef.current > 400) {
            lastNavTimeRef.current = now;
            const nextSec = document.getElementById('story-layer-skills') || document.getElementById('skills');
            if (nextSec) {
              nextSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }
      } else if (delta < 0) {
        // Scrolling UP
        if (currentIdx > 0) {
          event.preventDefault();
          const now = performance.now();
          if (now - lastNavTimeRef.current < 260) return;
          lastNavTimeRef.current = now;

          // Gently align projects layer to top if slightly offset
          if (Math.abs(rect.top) > 10) {
            projectsLayer.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          const prevIdx = currentIdx - 1;
          lastActiveIndexRef.current = prevIdx;
          settingsRef.current?.onIndexChange?.(prevIdx);
          const targetPoint = pointsRef.current[prevIdx];
          if (targetPoint !== undefined) {
            glideTo(targetPoint);
          }
        } else {
          // At the FIRST card (Card 0 / VAni):
          // User wants to see what's BEFORE projects (About)!
          // NEVER preventDefault - allow window wheel scroll!
          const now = performance.now();
          if (now - lastNavTimeRef.current > 400) {
            lastNavTimeRef.current = now;
            const prevSec = document.getElementById('story-layer-about') || document.getElementById('about');
            if (prevSec) {
              prevSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        }
      }
    };

    // Touch swipe navigation on mobile
    const onTouchStart = event => {
      if (event.touches && event.touches.length === 1) {
        touchStartYRef.current = event.touches[0].clientY;
      }
    };

    const onTouchEnd = event => {
      if (!event.changedTouches || event.changedTouches.length !== 1) return;
      const diffY = touchStartYRef.current - event.changedTouches[0].clientY;
      if (Math.abs(diffY) > 40) {
        onWheel({
          deltaY: diffY,
          deltaX: 0,
          preventDefault: () => {},
          ctrlKey: false
        });
      }
    };

    const onPress = () => {
      pressed = true;
      window.clearTimeout(rest);
    };

    const onRelease = () => {
      if (!pressed) return;
      pressed = false;
      settleSoon();
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    observer.observe(inner);
    target.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    target.addEventListener('pointerdown', onPress, { passive: true });
    window.addEventListener('pointerup', onRelease, { passive: true });
    window.addEventListener('pointercancel', onRelease, { passive: true });
    window.addEventListener('resize', schedule);
    scheduleRef.current = schedule;
    update();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(glide);
      window.clearTimeout(rest);
      observer.disconnect();
      target.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      target.removeEventListener('pointerdown', onPress);
      window.removeEventListener('pointerup', onRelease);
      window.removeEventListener('pointercancel', onRelease);
      window.removeEventListener('resize', schedule);
      scheduleRef.current = null;
      glideToRef.current = null;
    };
  }, [useWindowScroll]);

  return (
    <div
      ref={rootRef}
      className={`scroll-stack ${useWindowScroll ? 'scroll-stack--window' : 'scroll-stack--contained'} ${className}`.trim()}
    >
      <div ref={innerRef} className="scroll-stack__inner">
        {items.map((child, index) => {
          const gap = itemDistance - (items.length - index) * itemStackDistance;
          return (
            <Fragment key={isValidElement(child) ? (child.key ?? index) : index}>
              {index > 0 && (
                <div aria-hidden="true" style={{ height: Math.max(0, gap), marginTop: Math.min(0, gap) }} />
              )}
              <div
                data-stack-slot=""
                className="scroll-stack__slot"
                style={{
                  top: `calc(${toLength(stackPosition)} + ${index * itemStackDistance}px)`,
                  marginBottom: (items.length - 1 - index) * itemStackDistance,
                  zIndex: 10 + index
                }}
              >
                {child}
              </div>
            </Fragment>
          );
        })}
        <div ref={endRef} className="scroll-stack__end" aria-hidden="true" />
      </div>
    </div>
  );
});

export default ScrollStack;
