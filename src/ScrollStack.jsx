'use client';

import React, { Children, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '', style = {}, ...restProps }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()} style={style} {...restProps}>
    {children}
    <span className="scroll-stack-card__shade" aria-hidden="true" />
  </div>
);

const ScrollStack = forwardRef(({
  children,
  className = '',
  onIndexChange
}, ref) => {
  const containerRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const timelineRef = useRef(null);
  const activeIndexRef = useRef(0);
  const onIndexChangeRef = useRef(onIndexChange);
  const items = Children.toArray(children);
  const total = items.length;

  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  });

  useImperativeHandle(ref, () => ({
    scrollToIndex: (index) => {
      const tl = timelineRef.current;
      if (!tl || !tl.scrollTrigger) return;
      const st = tl.scrollTrigger;
      const totalSteps = Math.max(1, total - 1);
      const clamped = Math.max(0, Math.min(total - 1, index));
      const targetProgress = clamped / totalSteps;
      const targetY = st.start + (st.end - st.start) * targetProgress;

      if (window.lenis) {
        window.lenis.scrollTo(targetY, { duration: 0.85 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    },
    getCurrentIndex: () => activeIndexRef.current
  }));

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger || !cardsWrapRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const cards = Array.from(cardsWrapRef.current.children);
    if (!cards.length) return;

    // Pin target: The outer story layer stage directly so pin-spacer lives at document body level
    const pinTarget = document.getElementById('story-layer-projects') || document.getElementById('projects') || containerRef.current;

    // Initial card setup:
    // Card 0 starts centered in full view
    // Cards 1..5 start offscreen below (yPercent: 125)
    gsap.set(cards[0], {
      position: 'absolute',
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      zIndex: 10,
      visibility: 'visible',
      opacity: 1
    });

    for (let i = 1; i < cards.length; i++) {
      gsap.set(cards[i], {
        position: 'absolute',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: 125,
        scale: 0.95,
        zIndex: 10 + i * 2,
        visibility: 'visible',
        opacity: 1
      });
    }

    // Distance pinned in pixels: tuned for silky smooth Lenis momentum
    const getScrollDistance = () => (cards.length - 1) * Math.max(window.innerHeight * 0.9, 700);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinTarget,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5, // Butter-smooth momentum synced with Lenis!
        anticipatePin: 0,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress; // 0.0 to 1.0
          const rawIdx = p * (cards.length - 1);
          const activeIdx = Math.min(cards.length - 1, Math.max(0, Math.round(rawIdx)));
          if (activeIdx !== activeIndexRef.current) {
            activeIndexRef.current = activeIdx;
            onIndexChangeRef.current?.(activeIdx);
          }
        }
      }
    });

    timelineRef.current = tl;

    // Build sequential stacking timeline (Card 1 -> 2 -> 3 -> 4 -> 5 -> 6)
    for (let i = 1; i < cards.length; i++) {
      const stepLabel = `card-${i}`;

      // Current card slides up from below and settles centered
      tl.to(cards[i], {
        yPercent: -50,
        scale: 1,
        ease: 'power2.out',
        duration: 1
      }, stepLabel);

      // Preceding cards scale down and shift up slightly with depth (deck stack)
      for (let j = 0; j < i; j++) {
        const depth = i - j;
        const shade = cards[j].querySelector('.scroll-stack-card__shade');
        tl.to(cards[j], {
          scale: Math.max(0.84, 1 - depth * 0.045),
          yPercent: -50 - depth * 3.2,
          ease: 'power2.out',
          duration: 1
        }, stepLabel);

        if (shade) {
          tl.to(shade, {
            opacity: Math.min(0.38, depth * 0.12),
            ease: 'power2.out',
            duration: 1
          }, stepLabel);
        }
      }

      // Buffer rest pause so each card can be admired/interacted with
      tl.to({}, { duration: 0.25 });
    }

    // Comfortable resting pause at final card before unpinning
    tl.to({}, { duration: 0.5 });

    // Refresh ScrollTrigger after DOM setup
    ScrollTrigger.refresh();

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
      timelineRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} className={`scroll-stack-wrapper ${className}`.trim()}>
      <div ref={cardsWrapRef} className="scroll-stack-stage">
        {items}
      </div>
    </div>
  );
});

export default ScrollStack;
