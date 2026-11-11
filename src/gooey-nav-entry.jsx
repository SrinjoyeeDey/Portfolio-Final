import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import GooeyNav from './GooeyNav';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#projects' },
  { label: 'Snapshots', href: '#memory-wall' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#studio' }
];

function NavContainer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef(null);

  // Synchronize active item with page scroll (Scroll-Spy)
  useEffect(() => {
    let ticking = false;
    const sectionEls = navItems.map((item) =>
      document.getElementById(item.href.replace('#', ''))
    );
    const contactEl = document.getElementById('contact');
    let cachedDocHeight = document.documentElement.scrollHeight;

    const refreshDocHeight = () => {
      cachedDocHeight = document.documentElement.scrollHeight;
    };

    const onScroll = () => {
      if (isClickingRef.current) return;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const vhPoint = window.innerHeight * 0.45;
          let currentIdx = null;

          // If near top of page, select Home
          if (window.scrollY < 120) {
            currentIdx = 0;
          } else {
            for (let idx = 0; idx < sectionEls.length; idx++) {
              const el = sectionEls[idx];
              if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= vhPoint && rect.bottom >= vhPoint) {
                  currentIdx = idx;
                }
              }
            }

            const atBottom = window.scrollY + window.innerHeight >= cachedDocHeight - 40;
            if (atBottom) {
              currentIdx = navItems.length - 1;
            } else if (contactEl) {
              const contactRect = contactEl.getBoundingClientRect();
              if (contactRect.top <= vhPoint && contactRect.bottom >= vhPoint) {
                currentIdx = navItems.length - 1;
              }
            }
          }

          if (currentIdx !== null) {
            setActiveIndex(prev => (prev !== currentIdx ? currentIdx : prev));
          }
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', refreshDocHeight, { passive: true });
    window.addEventListener('memory-wall-ready', refreshDocHeight);
    // Run once on mount
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', refreshDocHeight);
      window.removeEventListener('memory-wall-ready', refreshDocHeight);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const handleChange = (index, item, event) => {
    if (event) event.preventDefault();
    isClickingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickingRef.current = false;
    }, 1100);

    setActiveIndex(index);

    const targetId = item.href ? item.href.replace('#', '') : null;
    if (targetId) {
      if (targetId === 'hero') {
        if (window.lenis) {
          window.lenis.scrollTo(0, { duration: 1.0 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          if (window.lenis) {
            window.lenis.scrollTo(targetEl, { offset: 0, duration: 1.0 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
          if (typeof targetEl.focus === 'function') {
            try {
              targetEl.focus({ preventScroll: true });
            } catch (_) {}
          }
        }
      }
    }

    // Close mobile nav drawer if open
    const navMenu = document.getElementById('nav-menu');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (hamburgerBtn) hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      document.body.classList.remove('nav-open');
    }
  };

  return (
    <GooeyNav
      items={navItems}
      activeIndex={activeIndex}
      onChange={handleChange}
      theme="light"
      color="#FFE500"
      activeTextColor="#222428"
      colors={['#FFE500', '#FFEA2E', '#FFF056', '#FFDF00']}
      frame={true}
      size="md"
      animationTime={600}
      particleCount={16}
      spread={56}
      timeVariance={300}
      gooeyness={0.55}
      wobble={0.5}
      hoverEffect={true}
      className="portfolio-gooey-nav"
    />
  );
}

function initGooeyNav() {
  const mountPoint = document.getElementById('nav-menu');
  if (!mountPoint) {
    setTimeout(initGooeyNav, 100);
    return;
  }

  // Create or reuse root container
  let rootContainer = document.getElementById('nav-gooey-root');
  if (!rootContainer) {
    rootContainer = document.createElement('div');
    rootContainer.id = 'nav-gooey-root';
    rootContainer.className = 'nav-gooey-root';
    mountPoint.innerHTML = '';
    mountPoint.appendChild(rootContainer);
  }

  const root = ReactDOM.createRoot(rootContainer);
  root.render(<NavContainer />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGooeyNav);
} else {
  initGooeyNav();
}

