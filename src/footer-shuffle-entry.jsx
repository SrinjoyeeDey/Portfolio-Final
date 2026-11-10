import React from 'react';
import { createRoot } from 'react-dom/client';
import Shuffle from './Shuffle';
import './Shuffle.css';

/**
 * Mounts the React Bits <Shuffle /> component across all texts in the footer.
 * Whenever anything is hovered in the footer, the texts perform the shuffle effect.
 */
export function initFooterShuffle() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  // Helper to mount Shuffle into an element while preserving its attributes & styles
  function mountShuffle(el, config = {}) {
    if (!el || el.dataset.shuffleMounted) return;
    el.dataset.shuffleMounted = 'true';

    const originalText = config.text || el.textContent.trim();
    if (!originalText) return;

    el.textContent = '';
    const mountContainer = document.createElement('span');
    mountContainer.className = 'footer-shuffle-mount';
    el.appendChild(mountContainer);

    const root = createRoot(mountContainer);
    root.render(
      <Shuffle
        text={originalText}
        tag="span"
        effect={config.effect || 'slide'}
        shuffleDirection={config.shuffleDirection || 'right'}
        duration={config.duration || 0.35}
        animationMode={config.animationMode || 'evenodd'}
        shuffleTimes={config.shuffleTimes || 1}
        ease={config.ease || 'power3.out'}
        stagger={config.stagger || 0.025}
        threshold={config.threshold || 0.01}
        rootMargin={config.rootMargin || '120px'}
        triggerOnce={true}
        triggerOnHover={true}
        hoverRadius={0}
        motionBlur={false}
        respectReducedMotion={true}
        accentColor={config.accentColor || '#FFBD12'}
        style={{ display: 'inline-block', verticalAlign: 'middle', ...config.style }}
      />
    );
  }

  // 1. Back to Top Button
  const backToTop = footer.querySelector('.footer-back-to-top');
  if (backToTop) {
    mountShuffle(backToTop, {
      text: '[ BACK TO TOP ]',
      shuffleDirection: 'right',
      duration: 0.32,
      stagger: 0.02,
      accentColor: '#FFBD12'
    });
  }

  // 2. Hero Brand Name & Last
  const heroName = footer.querySelector('.footer-hero-name');
  if (heroName) {
    mountShuffle(heroName, {
      text: 'SRINJOYEE',
      shuffleDirection: 'right',
      duration: 0.4,
      stagger: 0.03,
      shuffleTimes: 2,
      accentColor: '#FFBD12'
    });
  }

  const heroLast = footer.querySelector('.footer-hero-last');
  if (heroLast) {
    mountShuffle(heroLast, {
      text: 'DEY',
      shuffleDirection: 'up',
      duration: 0.32,
      stagger: 0.03,
      shuffleTimes: 2,
      accentColor: '#222428'
    });
  }

  // 4. Conversational Prompt Lines
  const promptEl = footer.querySelector('.footer-conversational-prompt');
  if (promptEl && !promptEl.dataset.shuffleMounted) {
    promptEl.dataset.shuffleMounted = 'true';
    promptEl.innerHTML = `
      <span class="prompt-line-1"></span><br>
      <span class="prompt-line-2"></span>
    `;
    const line1 = promptEl.querySelector('.prompt-line-1');
    const line2 = promptEl.querySelector('.prompt-line-2');
    if (line1) {
      mountShuffle(line1, {
        text: 'i’m even better in conversation.',
        shuffleDirection: 'right',
        duration: 0.35,
        stagger: 0.015,
        accentColor: '#FFBD12'
      });
    }
    if (line2) {
      mountShuffle(line2, {
        text: 'say hi at',
        shuffleDirection: 'right',
        duration: 0.28,
        stagger: 0.02,
        accentColor: '#FFBD12'
      });
    }
  }

  // 5. Social Links Bar
  const socialLinks = footer.querySelectorAll('.footer-social-links-bar a');
  socialLinks.forEach((link, idx) => {
    const directions = ['right', 'up', 'down', 'left'];
    mountShuffle(link, {
      shuffleDirection: directions[idx % directions.length],
      duration: 0.28,
      stagger: 0.02,
      shuffleTimes: 1,
      accentColor: '#FFBD12'
    });
  });

  // 6. Navigation Index Items (Title + Num)
  const navItems = footer.querySelectorAll('.footer-nav-item');
  navItems.forEach((item, idx) => {
    const titleEl = item.querySelector('.nav-item-title');
    const numEl = item.querySelector('.nav-item-num');
    if (titleEl) {
      mountShuffle(titleEl, {
        shuffleDirection: 'right',
        duration: 0.32,
        stagger: 0.02,
        shuffleTimes: 1,
        accentColor: '#FFBD12'
      });
    }
    if (numEl) {
      mountShuffle(numEl, {
        shuffleDirection: 'up',
        duration: 0.24,
        stagger: 0.02,
        shuffleTimes: 1,
        accentColor: '#FFBD12'
      });
    }
  });

  // 7. Colophon Row
  const colophonLeft = footer.querySelector('.footer-colophon-left');
  if (colophonLeft && !colophonLeft.dataset.shuffleMounted) {
    colophonLeft.dataset.shuffleMounted = 'true';
    colophonLeft.innerHTML = `
      <span class="cl-part-1"></span> <span class="emoji-heart">💖</span> <span class="cl-part-2"></span> <span class="emoji-brain">🧠</span> <span class="cl-part-3"></span> <span class="emoji-coffee">☕</span>
    `;
    const p1 = colophonLeft.querySelector('.cl-part-1');
    const p2 = colophonLeft.querySelector('.cl-part-2');
    const p3 = colophonLeft.querySelector('.cl-part-3');
    if (p1) mountShuffle(p1, { text: 'HANDMADE WITH', shuffleDirection: 'right', duration: 0.3, stagger: 0.015, accentColor: '#FFBD12' });
    if (p2) mountShuffle(p2, { text: 'AND', shuffleDirection: 'right', duration: 0.25, stagger: 0.02, accentColor: '#FFBD12' });
    if (p3) mountShuffle(p3, { text: 'AND', shuffleDirection: 'right', duration: 0.25, stagger: 0.02, accentColor: '#FFBD12' });
  }

  const colophonRight = footer.querySelector('.footer-colophon-right');
  if (colophonRight) {
    mountShuffle(colophonRight, {
      text: '© 2026 SRINJOYEE DEY, ALL RIGHTS RESERVED.',
      shuffleDirection: 'right',
      duration: 0.38,
      stagger: 0.012,
      shuffleTimes: 1,
      accentColor: '#FFBD12'
    });
  }

  // 8. Massive Bottom Watermark
  const watermarkSpan = footer.querySelector('.footer-massive-watermark span');
  if (watermarkSpan) {
    mountShuffle(watermarkSpan, {
      text: 'SRINJOYEE',
      shuffleDirection: 'right',
      duration: 0.45,
      stagger: 0.03,
      shuffleTimes: 2,
      accentColor: '#FFBD12'
    });
  }

  // 9. Delegated Interactive Hover Coordinator
  // Guarantees that whenever ANYTHING in the footer is hovered,
  // the corresponding text triggers the Shuffle effect immediately.
  footer.addEventListener('mouseover', (e) => {
    const interactiveTarget = e.target.closest(
      'a, button, .footer-nav-item, .footer-hero-brand, .footer-colophon-row, ' +
      '.footer-conversational-prompt, .footer-studio-ribbon, .footer-massive-watermark, ' +
      '.footer-social-links-bar, .footer-center-dot-wrap'
    );

    if (interactiveTarget) {
      if (interactiveTarget.classList.contains('footer-center-dot-wrap')) {
        const brandShuffles = footer.querySelectorAll('.footer-hero-brand .shuffle-parent');
        brandShuffles.forEach((s) => s.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false })));
        return;
      }
      const shuffleEls = interactiveTarget.querySelectorAll('.shuffle-parent');
      shuffleEls.forEach((shuffleNode) => {
        if (!shuffleNode.contains(e.relatedTarget)) {
          shuffleNode.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
        }
      });
    }
  }, { passive: true });
}

// Auto initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFooterShuffle);
} else {
  initFooterShuffle();
}
