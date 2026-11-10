import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import GooeyNav from './GooeyNav';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Works', href: '#projects' },
  { label: 'Snapshots', href: '#memory-wall' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' }
];

function NavContainer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef(null);

  // Synchronize active item with page scroll (Scroll-Spy)
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (isClickingRef.current) return;
      if (!ticking) {
        requestAnimationFrame(() => {
          const vhPoint = window.innerHeight * 0.45;
          let currentIdx = 0;

          // If near top of page, select Home
          if (window.scrollY < 120) {
            currentIdx = 0;
          } else {
            navItems.forEach((item, idx) => {
              const targetId = item.href.replace('#', '');
              const el = document.getElementById(targetId);
              if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= vhPoint && rect.bottom >= vhPoint) {
                  currentIdx = idx;
                }
              }
            });
          }

          setActiveIndex(prev => (prev !== currentIdx ? currentIdx : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on mount
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
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
      color="#FFBD12"
      activeTextColor="#222428"
      colors={['#FFBD12', '#FACC15', '#FFD028', '#F59E0B']}
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

