import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './PhotographicMemoryWall.css';

/**
 * Authentic Memory Photographs from Srinjoyee's Journey
 * Sourced from images/grid_img/ and images/
 * Densely packed, interlocking masonry collection inspired by physical Polaroid memory walls
 */
export const ARCHIVAL_PHOTOS = [
  {
    id: 1,
    src: 'images/srinjoyee-hackathon.png',
    title: 'Hacktechnique Debut',
    subtitle: 'First Offline Hackathon at Hooghly Engineering College',
    date: 'Dec 2024',
    format: 'hackathon-portrait',
    aspectRatio: 771 / 1024,
    rotation: -1.8,
    overlapX: -3,
    overlapY: 2,
    zIndex: 2,
    category: 'Hackathons'
  },
  {
    id: 2,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.14 PM.jpeg',
    title: 'Professional Portrait',
    subtitle: 'Event Day with School Teachers & Mentors',
    date: 'Dec 2024',
    format: 'tall',
    aspectRatio: 0.75,
    rotation: 1.4,
    overlapX: 2,
    overlapY: -3,
    zIndex: 3,
    category: 'Events'
  },
  {
    id: 4,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.14 PM-2.jpeg',
    title: 'Build Club Honors',
    subtitle: 'Most Wisest Team Award Recognition',
    date: 'Dec 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: 2.1,
    overlapX: 3,
    overlapY: -2,
    zIndex: 3,
    category: 'Friends'
  },
  {
    id: 5,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.15 PM.jpeg',
    title: 'No-Code Workshop',
    subtitle: 'No-Code Website & Application Development',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -1.5,
    overlapX: -3,
    overlapY: 2,
    zIndex: 2,
    category: 'Events'
  },
  {
    id: 6,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.16 PM-2.jpeg',
    title: 'Vibrant Debut',
    subtitle: 'Auditorium Reflections Before Prize Distribution',
    date: 'Nov 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: 0.9,
    overlapX: 2,
    overlapY: -3,
    zIndex: 3,
    category: 'Events'
  },
  {
    id: 7,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.16 PM.jpeg',
    title: 'Faculty Gathering',
    subtitle: 'Group Photo with Teachers, Faculty & Mentors',
    date: 'Jan 2025',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -2.2,
    overlapX: -2,
    overlapY: 3,
    zIndex: 2,
    category: 'Campus'
  },
  {
    id: 8,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.18 PM.jpeg',
    title: 'Section Memories',
    subtitle: 'Second Semester Section Comrades & Friends',
    date: 'Sep 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: 1.6,
    overlapX: 3,
    overlapY: -2,
    zIndex: 3,
    category: 'Campus'
  },
  {
    id: 9,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.19 PM.jpeg',
    title: 'Department Hackathon',
    subtitle: 'College Mini-Hackathon Triumph with Four Friends',
    date: 'Dec 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: -1.4,
    overlapX: -3,
    overlapY: 2,
    zIndex: 3,
    category: 'Hackathons'
  },
  {
    id: 20,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.31 PM.jpeg',
    title: 'VANI Victory',
    subtitle: 'Awards Ceremony at AOT Tech Fest for VANI',
    date: 'Oct 2024',
    format: 'wide',
    aspectRatio: 16 / 9,
    rotation: 2.3,
    overlapX: 3,
    overlapY: -3,
    zIndex: 4,
    category: 'Hackathons'
  },
  {
    id: 18,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.30 PM-2.jpeg',
    title: 'Google Solution Showcase',
    subtitle: 'Top 100 Presentation Before Board & Trustee',
    date: 'Dec 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: 2.2,
    overlapX: 3,
    overlapY: -3,
    zIndex: 3,
    category: 'Events'
  },
  {
    id: 13,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.23 PM-2.jpeg',
    title: 'Kshitij Achievements',
    subtitle: 'Certificates & Memorabilia from IIT Kharagpur',
    date: 'Jan 2025',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: 2.0,
    overlapX: 2,
    overlapY: -2,
    zIndex: 3,
    category: 'Events'
  },
  {
    id: 12,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.22 PM.jpeg',
    title: 'IIM Calcutta Challenge',
    subtitle: 'Coding Challenge & Debate at IIM Calcutta',
    date: 'Oct 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -1.7,
    overlapX: -3,
    overlapY: 2,
    zIndex: 2,
    category: 'Hackathons'
  },
  {
    id: 14,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.23 PM.jpeg',
    title: 'IIM Calcutta Arena',
    subtitle: 'Hackathon Floor & Event Atmosphere at IIM Calcutta',
    date: 'Dec 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: 1.3,
    overlapX: 3,
    overlapY: -3,
    zIndex: 3,
    category: 'Hackathons'
  },
  {
    id: 15,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.25 PM-2.jpeg',
    title: 'Techfest Recognition',
    subtitle: 'Post-Hackathon Reflections at Kshitij, IIT Kharagpur',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -1.9,
    overlapX: -2,
    overlapY: 3,
    zIndex: 2,
    category: 'Hackathons'
  },
  {
    id: 23,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.33 PM.jpeg',
    title: 'Synchronicity Gathering',
    subtitle: 'Group Photo with Mentors, Friends & Volunteers',
    date: 'Dec 2024',
    format: 'milestone-full',
    aspectRatio: 4160 / 2755,
    rotation: 1.5,
    overlapX: 2,
    overlapY: -2,
    zIndex: 4,
    category: 'Friends'
  },
  {
    id: 17,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.29 PM.jpeg',
    title: 'Techfest Memories',
    subtitle: 'Synox & CSBS Celebrations at AOT Tech Fest',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -1.1,
    overlapX: -3,
    overlapY: 2,
    zIndex: 2,
    category: 'Events'
  },
  {
    id: 11,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.21 PM.jpeg',
    title: 'Synchronicity Selfie',
    subtitle: 'Candid Moment During Synchronicity Hackathon',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -1.2,
    overlapX: -2,
    overlapY: 3,
    zIndex: 2,
    category: 'Hackathons'
  },
  {
    id: 19,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.30 PM.jpeg',
    title: 'Boardroom Presentation',
    subtitle: 'Presenting Architecture in the College Boardroom',
    date: 'Sep 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -1.6,
    overlapX: -2,
    overlapY: 3,
    zIndex: 2,
    category: 'Campus'
  },
  {
    id: 10,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.20 PM.jpeg',
    title: 'Campus Memories',
    subtitle: 'Early Semester Reflections at AOT',
    date: 'Dec 2024',
    format: 'campus-portrait',
    aspectRatio: 3123 / 4160,
    rotation: 1.4,
    overlapX: 2,
    overlapY: -2,
    zIndex: 3,
    category: 'Campus'
  },
  {
    id: 21,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.32 PM-2.jpeg',
    title: 'Techfest Recognition',
    subtitle: 'Team Felicitation on Stage During AOT Tech Fest',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -2.1,
    overlapX: -3,
    overlapY: 2,
    zIndex: 2,
    category: 'Events'
  },
  {
    id: 22,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.32 PM.jpeg',
    title: 'First Hackathon Win',
    subtitle: 'Emotionally Significant First Victory at AOT Tech Fest',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: 1.8,
    overlapX: 3,
    overlapY: -3,
    zIndex: 3,
    category: 'Hackathons'
  },
  {
    id: 24,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.35 PM.jpeg',
    title: 'SCCSE Tech Team',
    subtitle: 'Cherished Group Photo with SCCSE Tech Team',
    date: 'Dec 2024',
    format: 'championship-full',
    aspectRatio: 4160 / 2755,
    rotation: 2.1,
    overlapX: 3,
    overlapY: -2,
    zIndex: 4,
    category: 'Friends'
  },
  {
    id: 16,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.25 PM.jpeg',
    title: 'Kshitij Moments',
    subtitle: 'Celebrating Milestones & Accolades at IIT Kharagpur',
    date: 'Dec 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: -1.3,
    overlapX: -2,
    overlapY: 3,
    zIndex: 2,
    category: 'Events'
  },
  {
    id: 25,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.36 PM.jpeg',
    title: 'Build Club Innovation',
    subtitle: 'IoT Hardware & Edge Computing Development',
    date: 'Nov 2024',
    format: 'tall',
    aspectRatio: 0.75,
    rotation: -1.7,
    overlapX: -3,
    overlapY: 2,
    zIndex: 3,
    category: 'Events'
  },
  {
    id: 40,
    src: 'images/boardroom-showcase.jpg',
    title: 'Session about No-Code Website',
    subtitle: 'Presenting Google Solution Challenge project before college board members and trustee',
    date: 'Sep 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: -1.8,
    overlapX: -2,
    overlapY: 3,
    zIndex: 3,
    category: 'Events'
  },
  {
    id: 26,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.38 PM.jpeg',
    title: 'Hacktropica Sprint',
    subtitle: 'Rapid Prototyping & Sprint Deployment at Hacktropica',
    date: 'Dec 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: 1.6,
    overlapX: 2,
    overlapY: -3,
    zIndex: 3,
    category: 'Hackathons'
  },
  {
    id: 27,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.39 PM.jpeg',
    title: 'Hacktropica Overview',
    subtitle: 'Top-View Arrangement & Venue Atmosphere',
    date: 'Feb 2025',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -2.0,
    overlapX: -2,
    overlapY: 3,
    zIndex: 2,
    category: 'Hackathons'
  },
  {
    id: 28,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.40 PM.jpeg',
    title: 'Hacktropica Goodies',
    subtitle: 'Swag & Memorabilia Received from Hacktropica',
    date: 'Dec 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: 1.9,
    overlapX: 3,
    overlapY: -2,
    zIndex: 3,
    category: 'Hackathons'
  },
  {
    id: 30,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.43 PM.jpeg',
    title: 'Tech Leadership',
    subtitle: 'Strategic Guidance with Senior Tech Lead & Co-Lead',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -1.5,
    overlapX: -3,
    overlapY: 2,
    zIndex: 2,
    category: 'Events'
  },
  {
    id: 31,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.45 PM.jpeg',
    title: 'Hacktechnique Memories',
    subtitle: 'Cherished Memories from Our First Offline Hackathon',
    date: '2025/2026',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: 2.3,
    overlapX: 2,
    overlapY: -3,
    zIndex: 3,
    category: 'Hackathons'
  },
  {
    id: 44,
    src: 'images/induction-memories.jpg',
    title: 'Induction Memories',
    subtitle: 'Induction program organized during first semester at AOT',
    date: '2023',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: 1.1,
    overlapX: 2,
    overlapY: -2,
    zIndex: 2,
    category: 'Campus'
  },
  {
    id: 41,
    src: 'images/synchronicity-experience.jpg',
    title: 'Synchronicity Experience',
    subtitle: 'Memorable, fun-filled hackathon experience with teammates and friends',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: 1.7,
    overlapX: 3,
    overlapY: -2,
    zIndex: 3,
    category: 'Friends'
  },
  {
    id: 42,
    src: 'images/hacktropica-squad.jpg',
    title: 'Hacktropica Squad',
    subtitle: 'Group photograph with friends and teammates during Hacktropica',
    date: 'Oct 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: -1.4,
    overlapX: -3,
    overlapY: 2,
    zIndex: 3,
    category: 'Friends'
  },
  {
    id: 43,
    src: 'images/uxopia-design.jpg',
    title: 'UXopia Design',
    subtitle: 'Early design sprint and interface exploration in college',
    date: '2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: 2.0,
    overlapX: 2,
    overlapY: -3,
    zIndex: 2,
    category: 'Events'
  }
];

const CATEGORIES = ['All', 'Hackathons', 'Events', 'Campus', 'Friends'];

function getEstimatedHeight(photo) {
  let ratio = 1.33;
  if (photo.aspectRatio) ratio = photo.aspectRatio;
  else if (photo.format === 'tall') ratio = 0.75;
  else if (photo.format === 'hackathon-portrait') ratio = 771 / 1024;
  else if (photo.format === 'wide') ratio = 1.45;
  else if (photo.format === 'campus-portrait') ratio = 3123 / 4160;
  else if (photo.format === 'milestone-full') ratio = 4160 / 2755;
  else if (photo.format === 'championship-full') ratio = 4160 / 2755;
  return (220 / ratio) + 38;
}

function useViewportMode() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  const [columnCount, setColumnCount] = useState(() => {
    if (typeof window === 'undefined') return 6;
    const w = window.innerWidth;
    if (w >= 1350) return 6;
    if (w >= 1050) return 5;
    if (w >= 768) return 4;
    return 3;
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      let c = 3;
      if (w >= 1350) c = 6;
      else if (w >= 1050) c = 5;
      else if (w >= 768) c = 4;
      setColumnCount(c);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, columnCount };
}

export default function PhotographicMemoryWall() {
  const { isMobile, columnCount } = useViewportMode();
  const [activePhoto, setActivePhoto] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isExpanded, setIsExpanded] = useState(false);
  const [revealedIds, setRevealedIds] = useState(() => new Set());
  const wallRef = useRef(null);
  const filterBarRef = useRef(null);
  const cardElementsRef = useRef(new Map());

  // Enable mouse drag-to-scroll for horizontal filter pills
  useEffect(() => {
    const el = filterBarRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMouseLeave = () => { isDown = false; };
    const onMouseUp = () => { isDown = false; };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Filtered photos for category
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'All') return ARCHIVAL_PHOTOS;
    return ARCHIVAL_PHOTOS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Mobile displayed photos (initial 12 items, or all if expanded)
  const mobileDisplayedPhotos = useMemo(() => {
    if (isExpanded || filteredPhotos.length <= 12) {
      return filteredPhotos;
    }
    return filteredPhotos.slice(0, 12);
  }, [filteredPhotos, isExpanded]);

  // Interlocking Bin-Packing Layout Calculation for Desktop Masonry
  const { columns, STAGGER_OFFSETS } = useMemo(() => {
    const colCount = Math.max(3, columnCount);
    const cols = Array.from({ length: colCount }, () => []);
    const offsets = [0, 16, 6, 22, 12, 18];
    const heights = offsets.slice(0, colCount).map((o) => o);

    ARCHIVAL_PHOTOS.forEach((photo) => {
      let targetCol = -1;
      if (photo.title === 'Induction Memories') {
        const htCol = cols.findIndex((c) => c.some((p) => p.title === 'Hacktechnique Memories'));
        if (htCol !== -1) {
          targetCol = htCol;
        }
      } else if (photo.id === 40 || photo.title.toLowerCase().includes('no-code website')) {
        const bcCol = cols.findIndex((c) => c.some((p) => p.title === 'Build Club Innovation'));
        if (bcCol !== -1) {
          targetCol = bcCol;
        }
      }

      if (targetCol !== -1) {
        cols[targetCol].push(photo);
        heights[targetCol] += getEstimatedHeight(photo) + 10;
      } else {
        let minCol = 0;
        let minH = heights[0];
        for (let c = 1; c < colCount; c++) {
          if (heights[c] < minH) {
            minH = heights[c];
            minCol = c;
          }
        }
        cols[minCol].push(photo);
        heights[minCol] += getEstimatedHeight(photo) + 10;
      }
    });

    return { columns: cols, STAGGER_OFFSETS: offsets };
  }, [columnCount]);

  // Reveal On Scroll via IntersectionObserver (eager margin + batched state update)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setRevealedIds(new Set(ARCHIVAL_PHOTOS.map((p) => p.id)));
      return;
    }

    const revealBatch = (ids) => {
      if (!ids.length) return;
      setRevealedIds((prev) => {
        let changed = false;
        const next = new Set(prev);
        for (const id of ids) {
          if (!next.has(id)) {
            next.add(id);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const newlyVisible = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-id'));
            if (id) {
              newlyVisible.push(id);
              observer.unobserve(entry.target);
            }
          }
        });
        revealBatch(newlyVisible);
      },
      { rootMargin: '260px 0px 260px 0px', threshold: 0.01 }
    );

    const immediateIds = [];
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

    cardElementsRef.current.forEach((node) => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (rect.top <= vh + 260 && rect.bottom >= -260) {
        const id = Number(node.getAttribute('data-id'));
        if (id) {
          immediateIds.push(id);
          return;
        }
      }
      observer.observe(node);
    });

    revealBatch(immediateIds);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('memory-wall-ready'));
    }

    return () => observer.disconnect();
  }, [columns, isMobile]);

  // Gently promote and pre-decode remaining masonry print images one-by-one in idle slices after load
  useEffect(() => {
    if (isMobile || typeof window === 'undefined') return;
    let cancelled = false;
    let idleId = 0;
    let timerId = 0;
    const queue = Array.from(cardElementsRef.current.values())
      .map((card) => card?.querySelector('img'))
      .filter(Boolean);
    let idx = 0;

    const decodeNext = () => {
      if (cancelled || idx >= queue.length) return;
      if (document.hidden) {
        timerId = window.setTimeout(decodeNext, 300);
        return;
      }
      const img = queue[idx++];
      if (img) {
        if (img.loading === 'lazy') img.loading = 'eager';
        const p = img.decode ? img.decode() : Promise.resolve();
        p.catch(() => {}).finally(() => {
          if (cancelled || idx >= queue.length) return;
          if ('requestIdleCallback' in window) {
            idleId = window.requestIdleCallback(decodeNext, { timeout: 600 });
          } else {
            timerId = window.setTimeout(decodeNext, 32);
          }
        });
      }
    };

    const startQueue = () => {
      if (cancelled) return;
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(decodeNext, { timeout: 800 });
      } else {
        timerId = window.setTimeout(decodeNext, 120);
      }
    };

    const preloaderEl = document.querySelector('.tt-preloader');
    const preloaderDone = !preloaderEl || getComputedStyle(preloaderEl).display === 'none';
    if (preloaderDone) {
      timerId = window.setTimeout(startQueue, 250);
    } else {
      window.addEventListener('preloader:completed', startQueue, { once: true });
      timerId = window.setTimeout(startQueue, 2200);
    }

    return () => {
      cancelled = true;
      window.removeEventListener('preloader:completed', startQueue);
      if (timerId) window.clearTimeout(timerId);
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
    };
  }, [columns, isMobile]);

  // Lightbox Navigation Functions
  const activeList = isMobile ? filteredPhotos : ARCHIVAL_PHOTOS;
  const currentIndex = activePhoto ? activeList.findIndex((p) => p.id === activePhoto.id) : -1;

  const showPrev = useCallback(() => {
    if (currentIndex <= 0) {
      setActivePhoto(activeList[activeList.length - 1]);
    } else {
      setActivePhoto(activeList[currentIndex - 1]);
    }
  }, [currentIndex, activeList]);

  const showNext = useCallback(() => {
    if (currentIndex >= activeList.length - 1 || currentIndex === -1) {
      setActivePhoto(activeList[0]);
    } else {
      setActivePhoto(activeList[currentIndex + 1]);
    }
  }, [currentIndex, activeList]);

  const closeViewer = useCallback(() => {
    setActivePhoto(null);
  }, []);

  // Lock body scroll and stop Lenis when viewer is open
  useEffect(() => {
    if (activePhoto) {
      document.body.classList.add('memory-viewer-open');
      if (window.lenis && typeof window.lenis.stop === 'function') {
        window.lenis.stop();
      }
    } else {
      document.body.classList.remove('memory-viewer-open');
      if (window.lenis && typeof window.lenis.start === 'function') {
        window.lenis.start();
      }
    }
    return () => {
      document.body.classList.remove('memory-viewer-open');
    };
  }, [activePhoto]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!activePhoto) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto, closeViewer, showPrev, showNext]);

  // Swipe gesture handling for mobile viewer
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        showNext();
      } else {
        showPrev();
      }
    }
  };

  return (
    <div className="photographic-wall-installation" ref={wallRef}>
      {/* Wall Header: Exotic Display Typography Matching Hero Section */}
      <header className="pmw-exotic-header" aria-label="Snapshots / A Collection of Moments Header">
        {/* Top Metadata Status Header Row */}
        <div className="pmw-meta-top-bar">
          <div className="pmw-meta-left">
            <span className="pmw-bracket-tag">〔 ARCHIVE / 2024–2026 〕</span>
            <span className="pmw-sub-badge">LIFE LATELY</span>
          </div>
          <div className="pmw-meta-right">
            <div className="pmw-live-pill">
              <span className="pmw-live-dot" />
              <span>MEMORIES = n! , Printed</span>
            </div>
            <span className="pmw-stamp-badge">A LITTLE RECAP</span>
          </div>
        </div>

        {/* Bold Exotic Reference Typography */}
        <div className="hero-display-typography pmw-display-typography">
          <div className="display-row row-portfolio pmw-display-row-1">
            A COLLECTION OF
          </div>
          <div className="display-row row-design pmw-display-row-2">
            <span className="highlight-yellow-text pmw-highlight-yellow">MOMENTS</span>
            <span className="pmw-year-code">24–26↘</span>
          </div>
          <div className="display-row row-kanji-star pmw-display-row-3">
            <span className="kanji-main pmw-kanji-main">
              HACKATHONS. PODIUMS. UNFILTERED ARCHIVES.*
            </span>
          </div>
        </div>

        <p className="pmw-supporting-desc">
          Outside the screen • A little piece of everything that made me
        </p>
      </header>

      {/* MOBILE EXPERIENCE (< 768px): Compact 3-Column Square Grid + Filters */}
      <div className="pmw-mobile-view-container">
        {/* Horizontally scrollable category filter bar with smooth drag & touch scroll */}
        <nav
          className="pmw-filter-bar"
          ref={filterBarRef}
          data-lenis-prevent
          aria-label="Memory Categories"
        >
          {CATEGORIES.map((cat) => {
            const count = cat === 'All' ? ARCHIVAL_PHOTOS.length : ARCHIVAL_PHOTOS.filter((p) => p.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`pmw-filter-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setIsExpanded(false);
                }}
              >
                <span>{cat}</span>
                <span className="pmw-filter-count">{count}</span>
              </button>
            );
          })}
        </nav>

        {/* Compact 3-Column Square Thumbnail Grid */}
        <div className="pmw-mobile-grid" role="region" aria-label="Square memory thumbnails">
          {mobileDisplayedPhotos.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              className="pmw-mobile-thumb-card"
              onClick={() => setActivePhoto(photo)}
              aria-label={`View photo: ${photo.title}`}
            >
              <img
                src={photo.src}
                alt={photo.title}
                loading={idx < 9 ? 'eager' : 'lazy'}
                decoding="async"
                className="pmw-mobile-thumb-img"
              />
            </button>
          ))}
        </div>

        {/* View All / Collapse Button */}
        {filteredPhotos.length > 12 && (
          <div className="pmw-view-all-btn-wrapper">
            <button
              type="button"
              className="pmw-view-all-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span>{isExpanded ? 'Show Less' : `View All Memories (${filteredPhotos.length})`}</span>
              <span className="pmw-view-all-arrow">{isExpanded ? '↑' : '↓'}</span>
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP EXPERIENCE (>= 768px): Authentic Pinterest-style Masonry Wall */}
      <div className="pmw-desktop-view-container wall-canvas-stage">
        <div
          className="wall-columns-container"
          role="region"
          aria-label="Dense photographic memory wall"
        >
          {columns.map((columnPhotos, colIndex) => (
            <div
              key={colIndex}
              className={`wall-column wall-column-${colIndex}`}
              style={{
                paddingTop: `${STAGGER_OFFSETS[colIndex % STAGGER_OFFSETS.length]}px`
              }}
            >
              {columnPhotos.map((photo, rowIndex) => {
                const isRevealed = revealedIds.has(photo.id);
                const colDelay = `${(colIndex * 0.05).toFixed(2)}s`;
                const style = {
                  '--base-rot': `${photo.rotation}deg`,
                  '--overlap-x': `${photo.overlapX}px`,
                  '--overlap-y': `${photo.overlapY}px`,
                  '--z-index': photo.zIndex,
                  '--reveal-delay': colDelay
                };

                return (
                  <figure
                    key={photo.id}
                    data-id={photo.id}
                    ref={(el) => {
                      if (el) cardElementsRef.current.set(photo.id, el);
                      else cardElementsRef.current.delete(photo.id);
                    }}
                    className={`photo-print-card format-${photo.format} ${isRevealed ? 'is-revealed' : ''}`}
                    style={style}
                    onClick={() => setActivePhoto(photo)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View photo: ${photo.title} - ${photo.subtitle}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActivePhoto(photo);
                      }
                    }}
                  >
                    <div className="photo-paper-surface">
                      <div className="photo-media-container">
                        <img
                          src={photo.src}
                          alt={photo.title}
                          loading={rowIndex < 2 ? 'eager' : 'lazy'}
                          fetchPriority="low"
                          decoding="async"
                          className="photo-actual-image"
                          draggable={false}
                        />
                        <div className="photo-paper-grain" aria-hidden="true" />
                      </div>
                      <figcaption className="photo-bottom-margin">
                        <span className="photo-margin-title">{photo.title}</span>
                        <span className="photo-margin-date">{photo.date}</span>
                      </figcaption>
                    </div>
                  </figure>
                );
              })}
            </div>
          ))}
        </div>

        {/* Wall Installation Bottom Clean Registration */}
        <footer className="wall-architectural-footer">
          <span className="wall-reg-mark" aria-hidden="true">⌞</span>
          <span className="wall-footer-note">PRINTED PHOTOGRAPHIC ARCHIVE • CLICK ANY PRINT TO ENLARGE</span>
          <span className="wall-reg-mark" aria-hidden="true">⌟</span>
        </footer>
      </div>

      {/* ROBUST FULL-SCREEN IMAGE VIEWER PORTALLED DIRECTLY TO DOCUMENT.BODY */}
      {activePhoto && typeof document !== 'undefined' && createPortal(
        <div
          className="pmw-fullscreen-viewer-overlay"
          onClick={closeViewer}
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Control Bar */}
          <div className="pmw-viewer-top-bar" onClick={(e) => e.stopPropagation()}>
            <div className="pmw-viewer-counter">
              <span>{currentIndex + 1}</span>
              <span className="pmw-viewer-counter-sep">/</span>
              <span>{activeList.length}</span>
            </div>

            <button
              type="button"
              className="pmw-viewer-close-btn"
              onClick={closeViewer}
              aria-label="Close photo viewer"
            >
              ✕
            </button>
          </div>

          {/* Navigation Prev Button */}
          <button
            type="button"
            className="pmw-viewer-nav-btn pmw-nav-prev"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>

          {/* Navigation Next Button */}
          <button
            type="button"
            className="pmw-viewer-nav-btn pmw-nav-next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next photo"
          >
            ›
          </button>

          {/* Centered Image Card with Natural Aspect Ratio & Metadata */}
          <div
            className="pmw-viewer-content-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pmw-viewer-media-box">
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                className="pmw-viewer-image"
              />
            </div>

            <div className="pmw-viewer-caption">
              <div className="pmw-viewer-title-row">
                <h3 className="pmw-viewer-title">{activePhoto.title}</h3>
                <span className="pmw-viewer-date">{activePhoto.date}</span>
              </div>
              {activePhoto.subtitle && (
                <p className="pmw-viewer-desc">{activePhoto.subtitle}</p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
