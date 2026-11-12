import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Iphone } from '@/registry/magicui/iphone';
import { isSoundEnabled, setSoundEnabled, playSlideSound } from './tactileSound';
import './ProjectsShowcase.css';

const SHOWCASE_PROJECTS = [
  {
    id: '1',
    numericId: '1',
    number: '01',
    title: 'VAni',
    subtitle: 'Your AI-Powered Recovery Companion',
    categoryTag: 'AI • Healthcare • Mobile',
    role: 'Product • System Architecture • AI • UI/UX',
    timeline: '3 Months',
    year: '2025 / 2026',
    platform: 'Android (APK) & Web',
    theme: 'ivory',
    solidBg: '#F1EFE5', // Warm Ivory Solid with Grid (Screenshot 1)
    textColor: '#242529',
    accentColor: '#FFC52E', // Signature Yellow
    accentRgb: '255, 197, 46',
    narrative: 'VAni bridges the difficult gap between hospital discharge and recovery at home. A multilingual voice-first platform guiding post-hospital recovery while keeping caregivers in sync with smart prescription scanning and emergency SOS workflows.',
    metrics: [
      { stat: 'Voice-First', desc: 'Real-time multi-dialect speech navigation & emergency trigger' },
      { stat: 'Care Sync', desc: 'Prescription scanner with automated caregiver vitals sync' }
    ],
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Groq', 'Gemini', 'Google Cloud Run'],
    primaryAction: {
      label: 'Jump To Project',
      isModal: true
    },
    secondaryAction: {
      label: 'Download APK',
      icon: 'fa-solid fa-download',
      url: 'https://github.com/SrinjoyeeDey/VAni/releases/download/v1.0.0/VAni.apk'
    },
    liveUrl: 'https://vani-bice.vercel.app/',
    githubUrl: 'https://github.com/SrinjoyeeDey/VAni',
    visualType: 'vani',
    images: [
      {
        src: 'images/projects/vani-1.jpg',
        alt: 'VAni post-discharge healthcare landing interface featuring Mr. Meddy AI companion',
        label: 'Web & App • Mr. Meddy Overview',
        width: 1024,
        height: 545,
        bg: '#F8F7FC'
      },
      {
        src: 'images/projects/vani-2.jpg',
        alt: 'VAni Care Circle caregiver monitoring dashboard showing patient risk alerts and vitals',
        label: 'Web & App • Care Circle Dashboard',
        width: 1024,
        height: 548,
        bg: '#F8F7FC'
      },
      {
        src: 'images/projects/vani-3.jpg',
        alt: 'VAni daily recovery medicine schedule converting hospital paperwork into actionable routines',
        label: 'Web & App • Daily Recovery Schedule',
        width: 1024,
        height: 546,
        bg: '#F8F7FC'
      },
      {
        src: 'images/projects/vani-4.jpg',
        alt: 'VAni SOS and emergency assistance module with live location sharing and medical info access',
        label: 'Web & App • SOS & Emergency Support',
        width: 1024,
        height: 548,
        bg: '#F8F7FC'
      }
    ],
    companionPhone: {
      label: 'VAni Android App',
      images: [
        {
          src: 'images/projects/vani-phone-1.jpg',
          alt: 'VAni mobile app welcome screen featuring Mr. Meddy AI companion with Google and Email sign-in',
          label: 'Mobile App • Mr. Meddy Welcome',
          width: 483,
          height: 1024
        },
        {
          src: 'images/projects/vani-phone-2.jpg',
          alt: 'VAni mobile app home dashboard showing adherence score, weekly progress, reminders, and quick voice assistant',
          label: 'Mobile App • Daily Adherence Dashboard',
          width: 466,
          height: 1024
        },
        {
          src: 'images/projects/vani-phone-3.jpg',
          alt: 'VAni mobile app Hindi voice assistant modal answering medication questions in natural speech',
          label: 'Mobile App • Hindi Voice Assistant',
          width: 356,
          height: 780
        },
        {
          src: 'images/projects/vani-phone-4.jpg',
          alt: 'VAni Smart Emergency SOS settings with rapid-tap trigger, cancel window, live GPS sharing, and 112 auto-call',
          label: 'Mobile App • Smart Emergency SOS',
          width: 469,
          height: 1024
        },
        {
          src: 'images/projects/vani-phone-5.jpg',
          alt: 'VAni Live Tracking Center showing real-time ambulance dispatch on Leaflet OpenStreetMap with ETA',
          label: 'Mobile App • Live Ambulance Tracking',
          width: 356,
          height: 766
        },
        {
          src: 'images/projects/vani-phone-6.jpg',
          alt: 'VAni Doctor and patient care messaging thread with medication safety guidance',
          label: 'Mobile App • Care Team Chat',
          width: 459,
          height: 1024
        }
      ]
    }
  },
  {
    id: '2',
    numericId: '2',
    number: '02',
    title: 'Agnivaarak',
    subtitle: 'Autonomous Fire Detection & Suppression',
    categoryTag: 'AI/ML • Computer Vision • Fire Safety',
    role: 'ML • Computer Vision • System Development',
    timeline: 'National Hackathon',
    year: '2025 / 2026',
    platform: 'Python / IoT / Web Dashboard',
    theme: 'charcoal',
    solidBg: '#16171B', // Dark Charcoal Solid with Grid (Screenshot 2)
    textColor: '#FFFFFF',
    accentColor: '#FF7A00', // Fire Orange
    accentRgb: '255, 122, 0',
    narrative: 'An intelligent edge-AI and robotics system for real-time fire detection, temporal flicker analysis, and targeted multi-nozzle chemical suppression. Validates flames with sensor fusion while maintaining safety exclusion zones for occupants.',
    metrics: [
      { stat: '360° Vision', desc: 'Continuous YOLOv8 camera tracking with thermal sensor fusion' },
      { stat: 'Targeted Spray', desc: 'Automated multi-nozzle suppression with safe-zone protection' }
    ],
    techStack: ['Python', 'YOLOv8', 'FastAPI', 'Arduino', 'MQTT', 'OpenCV'],
    primaryAction: {
      label: 'Jump To Project',
      isModal: true
    },
    secondaryAction: {
      label: 'Explore Project',
      icon: 'fa-solid fa-arrow-up-right-from-square',
      url: 'https://github.com/SrinjoyeeDey/Agnivaarak'
    },
    githubUrl: 'https://github.com/SrinjoyeeDey/Agnivaarak',
    visualType: 'agnivaarak',
    images: [
      {
        src: 'images/projects/agnivaarak-1.jpg',
        alt: 'Agnivaarak autonomous fire detection and suppression hardware prototype with camera gimbal, tubing, and battery array',
        label: 'Hardware Prototype & Gimbal',
        width: 1024,
        height: 576,
        bg: '#0E1015',
        fit: 'cover'
      }
    ]
  },
  {
    id: '3',
    numericId: '3',
    number: '03',
    title: 'Anchor',
    subtitle: 'Grounded AI Knowledge System',
    categoryTag: 'AI/ML • Generative AI • RAG',
    role: 'AI Architecture • Backend • RAG Pipeline',
    timeline: 'Enterprise Core',
    year: '2025 / 2026',
    platform: 'Web • AI Backend',
    theme: 'lime',
    solidBg: '#D5E859', // Vibrant Electric Lime Solid with Grid (Screenshot 3)
    textColor: '#1A1C1E',
    accentColor: '#1A1C1E', // Dark Contrast on Lime
    accentRgb: '26, 28, 30',
    narrative: 'A full-stack Retrieval-Augmented Generation architecture designed to generate answers rigorously grounded in uploaded documentation. Uses pgvector semantic embeddings and multi-step LangGraph orchestration with Llama 3.3 and Gemini fallbacks.',
    metrics: [
      { stat: 'Vector RAG', desc: 'Semantic document chunking & similarity search with pgvector' },
      { stat: 'LangGraph', desc: 'Multi-step reasoning pipeline with strict anti-hallucination' }
    ],
    techStack: ['React 19', 'FastAPI', 'LangGraph', 'pgvector', 'PostgreSQL', 'Llama 3.3'],
    primaryAction: {
      label: 'Jump To Project',
      isModal: true
    },
    secondaryAction: {
      label: 'Explore Project',
      icon: 'fa-solid fa-arrow-up-right-from-square',
      url: 'https://github.com/SrinjoyeeDey/'
    },
    githubUrl: 'https://github.com/SrinjoyeeDey/',
    visualType: 'vault',
    images: [
      {
        src: 'images/projects/anchor-1.jpg',
        alt: 'Anchor grounded workspace web interface with active source pins and pgvector chunk verification',
        label: 'Grounded RAG Workspace',
        width: 1024,
        height: 652,
        bg: '#FFFFFF'
      },
      {
        src: 'images/projects/anchor-2.jpg',
        alt: 'Anchor RAG Intelligence and Governance modal with LLM inference selection and strict document grounding profiles',
        label: 'RAG Governance & Profiles',
        width: 1024,
        height: 555,
        bg: '#FFFFFF'
      },
      {
        src: 'images/projects/anchor-3.jpg',
        alt: 'Anchor grounded Q&A workspace showing pgvector similarity retrieval and verified document citations',
        label: 'Citation-Verified Q&A',
        width: 1024,
        height: 560,
        bg: '#FFFFFF'
      },
      {
        src: 'images/projects/anchor-4.jpg',
        alt: 'Anchor developer calibration panel with cosine similarity cutoff barrier and top-k chunk sliders',
        label: 'Cosine Cutoff Calibration',
        width: 1024,
        height: 558,
        bg: '#FFFFFF'
      },
      {
        src: 'images/projects/anchor-5.jpg',
        alt: 'Anchor strict anti-hallucination guard refusing ungrounded answers when no citation exists in selected sources',
        label: 'Strict Anti-Hallucination Guard',
        width: 1024,
        height: 558,
        bg: '#FFFFFF'
      }
    ]
  },
  {
    id: '4',
    numericId: '4',
    number: '04',
    title: 'Nobodristhi',
    subtitle: 'AI-Powered News Verification System',
    categoryTag: 'AI/ML • News Verification • Backend',
    role: 'AI/ML • Backend • System Development',
    timeline: 'Core Architecture',
    year: '2025 / 2026',
    platform: 'Web Backend • REST API',
    theme: 'lavender',
    solidBg: '#251E32', // Deep muted plum purple (Dark card)
    textColor: '#FFFFFF', // Crisp light contrast on dark muted purple
    accentColor: '#F5DF77', // Primary accent: buttery yellow
    accentRgb: '245, 223, 119',
    narrative: 'A news verification backend pipeline transforming raw community reports into verified intelligence. Integrates geospatial Haversine clustering, LLM semantic event deduplication, reverse-image search, and an administrative moderation ledger.',
    metrics: [
      { stat: 'Geospatial Radar', desc: 'Haversine event clustering across geographic radiuses' },
      { stat: 'Dual Verification', desc: 'Reverse-image search paired with moderation queue' }
    ],
    techStack: ['Python / Flask', 'PostgreSQL', 'SerpAPI', 'OpenRouter', 'Haversine ML'],
    primaryAction: {
      label: 'Jump To Project',
      isModal: true
    },
    secondaryAction: {
      label: 'Watch Preview',
      icon: 'fa-solid fa-play',
      url: 'https://drive.google.com/file/d/1G6v34ZHr6KDTvnT2ezIzofBHMVTiMkUc/view?usp=drivesdk'
    },
    githubUrl: 'https://github.com/SrinjoyeeDey/',
    visualType: 'nobodristhi',
    images: [
      {
        src: 'images/projects/nobodristhi-hero.jpg',
        alt: 'NoboDorshi CMS landing hero showcasing global intelligence network and editorial news navigation',
        label: 'NoboDorshi CMS Overview',
        width: 1024,
        height: 489,
        bg: '#FFFFFF'
      },
      {
        src: 'images/projects/nobodristhi-1.jpg',
        alt: 'Nobodristhi newsroom moderation queue with automated event summary and verification actions',
        label: 'Newsroom Moderation Queue',
        width: 1024,
        height: 572,
        bg: '#FFFFFF'
      },
      {
        src: 'images/projects/nobodristhi-2.jpg',
        alt: 'Nobodristhi Newsroom overview showing approved counts, active journalists, real-time filing feed, and category mix',
        label: 'Newsroom Editorial Overview',
        width: 1024,
        height: 487,
        bg: '#FFFFFF'
      }
    ]
  },
  {
    id: '5',
    numericId: '5',
    number: '05',
    title: 'NexVyapaar',
    subtitle: 'AI Business Assistant for Local Businesses',
    categoryTag: 'AI/ML • Product • POS',
    role: 'Frontend • AI Logic • UX • System Design',
    timeline: 'Interactive Prototype',
    year: '2025 / 2026',
    platform: 'Web • Offline-First POS',
    theme: 'sand',
    solidBg: '#EFECE1', // Warm Sand Solid with Grid
    textColor: '#222428',
    accentColor: '#6366F1', // Retail POS Indigo
    accentRgb: '99, 102, 241',
    narrative: 'Offline-first intelligent POS and business copilot built around the core philosophy: “AI advises. Owner decides.” Transforms sales and inventory data into actionable restock suggestions, expiry risk warnings, and pharmacy ban-list validation.',
    metrics: [
      { stat: 'Offline-First', desc: 'Uninterrupted local checkout continuity with IndexedDB sync' },
      { stat: 'Banned Drug Alert', desc: 'Automated CSV regulatory checks to prevent banned sales' }
    ],
    techStack: ['React', 'TypeScript', 'Tailwind', 'IndexedDB', 'Framer Motion', 'Vite'],
    primaryAction: {
      label: 'Jump To Project',
      isModal: true
    },
    secondaryAction: {
      label: 'Watch Preview',
      icon: 'fa-solid fa-play',
      url: 'https://github.com/SrinjoyeeDey/NexVyapaar'
    },
    githubUrl: 'https://github.com/SrinjoyeeDey/NexVyapaar',
    visualType: 'gaming',
    images: [
      {
        src: 'images/projects/nexvyapaar-2.jpg',
        alt: 'NexVyapaar real-time Sales Dashboard showing revenue trends, average order value, Khata Scanner, and top selling categories',
        label: 'Sales Dashboard & Trends',
        width: 1024,
        height: 578,
        bg: '#FFFFFF'
      },
      {
        src: 'images/projects/nexvyapaar-3.jpg',
        alt: 'NexVyapaar Raw Materials Inventory table with active low-stock alert, burn rate, and weekly trend tracking',
        label: 'Smart Inventory & Alerts',
        width: 1024,
        height: 576,
        bg: '#FFFFFF'
      },
      {
        src: 'images/projects/nexvyapaar-4.jpg',
        alt: 'NexVyapaar Analytics view with monthly revenue charts and AI-Powered Forecasts comparison curve',
        label: 'Analytics & AI Forecasts',
        width: 1024,
        height: 575,
        bg: '#FFFFFF'
      },
      {
        src: 'images/projects/nexvyapaar-5.jpg',
        alt: 'NexVyapaar Suppliers Management directory tracking 8 suppliers, lead times, ratings, and payment terms',
        label: 'Supplier Directory & Lead Times',
        width: 1024,
        height: 575,
        bg: '#FFFFFF'
      }
    ]
  },
  {
    id: '6',
    numericId: '6',
    number: '06',
    title: 'Punarchakra',
    subtitle: 'AI-Powered E-Waste Recycling Platform',
    categoryTag: 'AI/ML • Sustainability • Web',
    role: 'Full-Stack • CV • Product Design',
    timeline: 'Circular Platform',
    year: '2025 / 2026',
    platform: 'Web Platform • Eco-Tech',
    theme: 'lime',
    solidBg: '#D5E859', // Matching Anchor's electric lime solid background
    textColor: '#1A1C1E',
    accentColor: '#1A1C1E', // Dark Contrast on Lime
    accentRgb: '26, 28, 30',
    narrative: 'Smart circular-economy platform focused on making e-waste recycling intuitive and engaging. Couples AI-assisted e-waste classification with a gamified reward ecosystem, turning discarded electronics into recognized recyclable resources.',
    metrics: [
      { stat: 'AI Classifier', desc: 'Vision models identifying and categorizing consumer e-waste' },
      { stat: 'Eco Rewards', desc: 'Gamified incentive experience driving sustainable recycling' }
    ],
    techStack: ['Computer Vision', 'Web Platform', 'Eco-Tech', 'Reward System'],
    primaryAction: {
      label: 'Jump To Project',
      isModal: true
    },
    secondaryAction: {
      label: 'Visit Website',
      icon: 'fa-solid fa-arrow-up-right-from-square',
      url: 'https://punarchakra.vercel.app/'
    },
    githubUrl: 'https://github.com/SrinjoyeeDey/Punarchakra',
    visualType: 'ballpit',
    images: []
  }
];


function Interactive3DStage({ children, className = '' }) {
  const stageRef = useRef(null);
  const rafRef = useRef(null);
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const prefersReducedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      prefersReducedRef.current = mq.matches;
      if (mq.matches && stageRef.current) {
        stageRef.current.style.setProperty('--tilt-x', '0deg');
        stageRef.current.style.setProperty('--tilt-y', '0deg');
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const applyTilt = useCallback(() => {
    if (stageRef.current) {
      const { x, y } = targetTiltRef.current;
      stageRef.current.style.setProperty('--tilt-x', `${x}deg`);
      stageRef.current.style.setProperty('--tilt-y', `${y}deg`);
    }
    rafRef.current = null;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (prefersReducedRef.current) return;
    if (e.nativeEvent && e.nativeEvent.pointerType === 'touch') return;
    const currentTarget = e.currentTarget;
    const rect = currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetTiltRef.current = {
      x: Number((y * -14).toFixed(2)),
      y: Number((x * 18).toFixed(2))
    };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(applyTilt);
    }
  }, [applyTilt]);

  const handleMouseLeave = useCallback(() => {
    targetTiltRef.current = { x: 0, y: 0 };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(applyTilt);
    }
  }, [applyTilt]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={`interactive-3d-stage ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

const ProjectMockupCarousel = React.memo(function ProjectMockupCarousel({ project, fallbackStage = null }) {
  const rawImages = Array.isArray(project.images) ? project.images : [];
  const companionPhone = project.companionPhone || null;
  const phoneImages = Array.isArray(companionPhone?.images) ? companionPhone.images : [];
  const hasRealImages = rawImages.length > 0 || phoneImages.length > 0;
  const totalSlides = hasRealImages ? Math.max(rawImages.length, phoneImages.length) : 1;
  const hasMultiTrackSlides = rawImages.length > 1;
  const hasPhoneOnlyMulti = !hasMultiTrackSlides && phoneImages.length > 1;
  const images = React.useMemo(() => {
    if (rawImages.length === 0) return [];
    if (rawImages.length === 1 || rawImages.length >= totalSlides) return rawImages;
    return Array.from({ length: totalSlides }, (_, idx) => rawImages[idx % rawImages.length]);
  }, [rawImages, totalSlides]);

  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const [supportsParking, setSupportsParking] = useState(false);
  const canLoopContinuous = hasMultiTrackSlides && totalSlides >= 3 && supportsParking;

  const [activeIndex, setActiveIndex] = useState(0);
  const [settledIndex, setSettledIndex] = useState(0);
  const [statusAnnouncement, setStatusAnnouncement] = useState('');
  const [singleSlideNotice, setSingleSlideNotice] = useState(false);

  const settledIndexRef = useRef(0);
  const pendingTargetRef = useRef(null);
  const prevParkingRef = useRef({ firstAfter: false, lastBefore: false });
  const scrollRafRef = useRef(null);
  const settleTimerRef = useRef(null);
  const noticeTimerRef = useRef(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
      setSupportsParking(CSS.supports('order', 'sibling-index()'));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reducedMotionRef.current = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, []);

  const getSlideLocalLeft = useCallback((slideEl) => {
    const track = trackRef.current;
    if (!track || !slideEl) return 0;
    return slideEl.offsetParent === track
      ? slideEl.offsetLeft
      : slideEl.offsetLeft - track.offsetLeft;
  }, []);

  const findNearestSlideIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const currentScroll = track.scrollLeft;
    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < totalSlides; i += 1) {
      const slideEl = slideRefs.current[i];
      if (!slideEl) continue;
      const slideLeft = getSlideLocalLeft(slideEl);
      const dist = Math.abs(slideLeft - currentScroll);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    return bestIdx;
  }, [getSlideLocalLeft, totalSlides]);

  const applyParking = useCallback(
    (targetIdx) => {
      const track = trackRef.current;
      if (!track || !canLoopContinuous) return;

      const firstAfter = totalSlides === 3 ? targetIdx >= 2 : targetIdx >= totalSlides - 2;
      const lastBefore = totalSlides === 3 ? targetIdx <= 0 : targetIdx <= 1;
      const changed =
        firstAfter !== prevParkingRef.current.firstAfter ||
        lastBefore !== prevParkingRef.current.lastBefore;

      if (!changed && track.style.getPropertyValue('--current') === String(targetIdx)) {
        return;
      }

      const activeSlideEl = slideRefs.current[targetIdx];
      const beforeLeft = activeSlideEl ? getSlideLocalLeft(activeSlideEl) : 0;

      prevParkingRef.current = { firstAfter, lastBefore };
      track.style.scrollBehavior = 'auto';
      track.style.scrollSnapType = 'none';
      track.style.overflowX = 'hidden';
      track.style.setProperty('--current', String(targetIdx));

      if (activeSlideEl) {
        const afterLeft = getSlideLocalLeft(activeSlideEl);
        const shift = afterLeft - beforeLeft;
        if (Math.abs(shift) > 0.5) {
          track.scrollLeft += shift;
        }
      }

      track.style.scrollSnapType = '';
      track.style.scrollBehavior = '';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (trackRef.current) {
            trackRef.current.style.overflowX = '';
          }
        });
      });
    },
    [canLoopContinuous, getSlideLocalLeft, totalSlides]
  );

  const runSettle = useCallback(() => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }

    const settled = findNearestSlideIndex();
    const pendingTarget = pendingTargetRef.current;

    if (pendingTarget !== null && pendingTarget !== settled) {
      return;
    }

    pendingTargetRef.current = null;
    applyParking(settled);
    setSettledIndex(settled);
    setActiveIndex(settled);

    if (settled !== settledIndexRef.current) {
      settledIndexRef.current = settled;
      const slideTitle = images[settled]?.label ? `: ${images[settled].label}` : '';
      setStatusAnnouncement(`Slide ${settled + 1} of ${totalSlides}${slideTitle}`);
    }
  }, [applyParking, findNearestSlideIndex, images, totalSlides]);

  useEffect(() => {
    if (typeof window === 'undefined' || phoneImages.length <= 1) return;
    phoneImages.forEach((img) => {
      if (img?.src) {
        const preloaderImg = new window.Image();
        preloaderImg.decoding = 'async';
        preloaderImg.src = img.src;
      }
    });
  }, [phoneImages]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !hasMultiTrackSlides) return undefined;

    if (canLoopContinuous) {
      prevParkingRef.current = { firstAfter: false, lastBefore: false };
      applyParking(settledIndexRef.current);
    }

    const restoreSettledPosition = () => {
      const targetEl = slideRefs.current[settledIndexRef.current];
      if (!track || !targetEl) return;
      const expectedLeft = getSlideLocalLeft(targetEl);
      if (Math.abs(track.scrollLeft - expectedLeft) > 2) {
        track.style.scrollBehavior = 'auto';
        track.style.scrollSnapType = 'none';
        track.scrollLeft = expectedLeft;
        track.style.scrollSnapType = '';
        track.style.scrollBehavior = '';
      }
    };

    const onScroll = () => {
      if (pendingTargetRef.current === null && !scrollRafRef.current) {
        scrollRafRef.current = requestAnimationFrame(() => {
          scrollRafRef.current = null;
          const nearest = findNearestSlideIndex();
          setActiveIndex((prev) => (prev !== nearest ? nearest : prev));
        });
      }

      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(runSettle, 'onscrollend' in window ? 240 : 140);
    };

    const onScrollEnd = () => {
      runSettle();
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    if ('onscrollend' in window) {
      track.addEventListener('scrollend', onScrollEnd, { passive: true });
    }

    const scrollTrigger = typeof window !== 'undefined' ? window.ScrollTrigger : null;
    if (scrollTrigger && typeof scrollTrigger.addEventListener === 'function') {
      scrollTrigger.addEventListener('refresh', restoreSettledPosition);
    }

    let resizeObserver = null;
    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(() => {
        if (pendingTargetRef.current === null) {
          restoreSettledPosition();
        }
      });
      resizeObserver.observe(track);
    }

    return () => {
      track.removeEventListener('scroll', onScroll);
      if ('onscrollend' in window) {
        track.removeEventListener('scrollend', onScrollEnd);
      }
      if (scrollTrigger && typeof scrollTrigger.removeEventListener === 'function') {
        scrollTrigger.removeEventListener('refresh', restoreSettledPosition);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [applyParking, canLoopContinuous, findNearestSlideIndex, getSlideLocalLeft, hasMultiTrackSlides, runSettle]);

  const scrollToSlide = useCallback(
    (targetIdx) => {
      if (!hasRealImages || totalSlides <= 1) {
        playSlideSound();
        setSingleSlideNotice(true);
        setStatusAnnouncement(
          totalSlides === 1
            ? `${project.title}: showing image 1 of 1. More screenshots coming soon.`
            : `${project.title}: interactive preview placeholder.`
        );
        if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
        noticeTimerRef.current = setTimeout(() => {
          setSingleSlideNotice(false);
        }, 2000);
        return;
      }

      if (hasPhoneOnlyMulti) {
        const clampedIdx = ((targetIdx % totalSlides) + totalSlides) % totalSlides;
        pendingTargetRef.current = null;
        settledIndexRef.current = clampedIdx;
        setSettledIndex(clampedIdx);
        setActiveIndex(clampedIdx);
        playSlideSound();
        const phoneLabel = phoneImages[clampedIdx]?.label ? `: ${phoneImages[clampedIdx].label}` : '';
        setStatusAnnouncement(`Slide ${clampedIdx + 1} of ${totalSlides}${phoneLabel}`);
        return;
      }

      const track = trackRef.current;
      const targetEl = slideRefs.current[targetIdx];
      if (!track || !targetEl) return;

      const targetLeft = getSlideLocalLeft(targetEl);
      const delta = targetLeft - track.scrollLeft;
      pendingTargetRef.current = targetIdx;
      setActiveIndex(targetIdx);
      playSlideSound();

      track.scrollTo({
        left: targetLeft,
        behavior: reducedMotionRef.current ? 'auto' : 'smooth'
      });

      if (Math.abs(delta) < 1) {
        runSettle();
      }
    },
    [getSlideLocalLeft, hasPhoneOnlyMulti, hasRealImages, phoneImages, project.title, runSettle, totalSlides]
  );

  const handleNextClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!hasRealImages || totalSlides <= 1) {
        scrollToSlide(0);
        return;
      }
      if (hasPhoneOnlyMulti) {
        scrollToSlide((activeIndex + 1) % totalSlides);
        return;
      }
      const baseIndex = pendingTargetRef.current !== null ? pendingTargetRef.current : findNearestSlideIndex();
      const nextIdx = (baseIndex + 1) % totalSlides;
      scrollToSlide(nextIdx);
    },
    [activeIndex, findNearestSlideIndex, hasPhoneOnlyMulti, hasRealImages, scrollToSlide, totalSlides]
  );

  const handlePrevClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!hasRealImages || totalSlides <= 1) return;
      if (hasPhoneOnlyMulti) {
        scrollToSlide((activeIndex - 1 + totalSlides) % totalSlides);
        return;
      }
      const baseIndex = pendingTargetRef.current !== null ? pendingTargetRef.current : findNearestSlideIndex();
      const prevIdx = (baseIndex - 1 + totalSlides) % totalSlides;
      scrollToSlide(prevIdx);
    },
    [activeIndex, findNearestSlideIndex, hasPhoneOnlyMulti, hasRealImages, scrollToSlide, totalSlides]
  );

  const handleMarkerClick = useCallback(
    (idx, e) => {
      e.preventDefault();
      e.stopPropagation();
      scrollToSlide(idx);
    },
    [scrollToSlide]
  );

  const handleButtonKeyDown = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const clearPendingOnManualScroll = useCallback(() => {
    pendingTargetRef.current = null;
  }, []);

  const handleTrackKeyDown = useCallback(
    (e) => {
      if (e.target !== trackRef.current) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        handleNextClick(e);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        handlePrevClick(e);
      }
    },
    [handleNextClick, handlePrevClick]
  );

  const activePhoneImg =
    phoneImages.length > 0 ? phoneImages[activeIndex % phoneImages.length] : null;
  const isPrevDisabled = false;
  const isFiniteNextDisabled = false;
  const markerItems = Array.from({ length: totalSlides }, (_, idx) =>
    hasPhoneOnlyMulti ? phoneImages[idx] : rawImages[idx] || phoneImages[idx] || images[idx]
  );
  const currentCaption = hasRealImages
    ? (hasPhoneOnlyMulti
        ? phoneImages[activeIndex]?.label
        : rawImages[activeIndex]?.label || phoneImages[activeIndex]?.label || images[activeIndex]?.label) ||
      `${project.title} preview`
    : 'Interactive Concept Mockup';
  const counterLabel = `${String(activeIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;

  return (
    <div
      className="mockup-carousel"
      data-multi-slide={hasRealImages && totalSlides > 1 ? 'true' : 'false'}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${project.title} screenshots`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Controls remain before the track in DOM order for accessible sequential navigation */}
      <div className="mockup-carousel-controls">
        <div className="mockup-controls-meta">
          <span className="mockup-slide-counter" aria-hidden="true">
            {counterLabel}
          </span>
          <span className="mockup-slide-caption">
            {singleSlideNotice ? 'More screenshots coming soon' : currentCaption}
          </span>
          {hasRealImages && totalSlides > 1 && (
            <nav className="mockup-carousel-markers" aria-label={`Choose a ${project.title} screenshot`}>
              {markerItems.map((img, idx) => (
                <button
                  key={`${project.id}-marker-${idx}`}
                  type="button"
                  className="mockup-marker-dot"
                  aria-current={activeIndex === idx ? 'true' : undefined}
                  aria-label={`Show image ${idx + 1} of ${totalSlides}${img?.label ? `: ${img.label}` : ''}`}
                  onClick={(e) => handleMarkerClick(idx, e)}
                  onKeyDown={handleButtonKeyDown}
                />
              ))}
            </nav>
          )}
        </div>

        <div className="mockup-controls-actions">
          {hasRealImages && totalSlides > 1 && (
            <button
              type="button"
              className="mockup-prev-btn cursor-target"
              data-cursor-label="Prev"
              aria-label={`Previous screenshot for ${project.title}`}
              disabled={isPrevDisabled}
              onClick={handlePrevClick}
              onKeyDown={handleButtonKeyDown}
            >
              <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
            </button>
          )}
          <button
            type="button"
            className={`mockup-next-btn cursor-target ${singleSlideNotice ? 'is-nudged' : ''}`}
            data-cursor-label="Next"
            aria-label={
              hasRealImages && totalSlides > 1
                ? `Next screenshot for ${project.title} (${activeIndex + 1} of ${totalSlides})`
                : `Next screenshot for ${project.title} (${counterLabel})`
            }
            disabled={isFiniteNextDisabled}
            onClick={handleNextClick}
            onKeyDown={handleButtonKeyDown}
          >
            <span>{singleSlideNotice ? '1 / 1 Ready' : 'Next'}</span>
            <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      {/* Main 3D MacBook Showcase Stage (All Project Cards) */}
      <Interactive3DStage
        className={`macbook-3d-stage mockup-real-stage ${companionPhone ? 'mockup-has-phone' : ''}`}
      >
        <div className="macbook">
          <div className="screen">
            <div className="viewport">
              {hasRealImages ? (
                <div
                  ref={trackRef}
                  className={`mockup-carousel-track ${canLoopContinuous ? 'is-looping' : ''}`}
                  tabIndex={0}
                  role="group"
                  aria-label={`${project.title} preview slides`}
                  onPointerDown={clearPendingOnManualScroll}
                  onWheel={clearPendingOnManualScroll}
                  onKeyDown={handleTrackKeyDown}
                >
                  {images.map((img, idx) => {
                    const isParked =
                      canLoopContinuous &&
                      (totalSlides === 3
                        ? (settledIndex >= 2 && idx === 0) || (settledIndex <= 0 && idx === 2)
                        : (settledIndex >= totalSlides - 2 && idx === 0) ||
                          (settledIndex <= 1 && idx === totalSlides - 1));
                    const ratio = img.width && img.height ? img.height / img.width : 0;
                    const isTallShot = ratio > 0.68;

                    return (
                      <div
                        key={`${project.id}-slide-${idx}`}
                        ref={(el) => {
                          slideRefs.current[idx] = el;
                        }}
                        className="mockup-carousel-slide"
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${idx + 1} of ${totalSlides}`}
                        data-marker-name={`Show image ${idx + 1} of ${totalSlides}`}
                        inert={isParked}
                        style={{ '--slide-bg': img.bg || '#111318' }}
                      >
                        <div
                          className={`macbook-slide-shot ${isTallShot ? 'is-tall' : ''} ${img.fit === 'cover' ? 'is-cover' : ''}`}
                          style={{ backgroundImage: `url("${img.src}")` }}
                        >
                          <img
                            src={img.src}
                            alt={img.alt}
                            width={img.width}
                            height={img.height}
                            loading="eager"
                            decoding="async"
                            fetchPriority={idx > 0 ? 'low' : undefined}
                            className={`mockup-slide-img ${img.fit === 'cover' ? 'is-cover' : ''} ${isTallShot ? 'is-tall-hidden' : ''}`}
                            draggable={false}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                fallbackStage || <PunarchakraMacbookScreen project={project} />
              )}
            </div>
          </div>
          <div className="base" aria-hidden="true" />
          <div className="notch" aria-hidden="true" />
        </div>

        {companionPhone && (
          <div
            className="mockup-companion-phone"
            aria-label={`${companionPhone.label || project.title} mobile mockup`}
          >
            <Iphone
              src={activePhoneImg?.src}
              alt={activePhoneImg?.alt || `${companionPhone.label || project.title} mobile mockup`}
              className="mockup-companion-iphone"
            />
          </div>
        )}
      </Interactive3DStage>

      <p className="sr-only" role="status" aria-live="polite">
        {statusAnnouncement}
      </p>
    </div>
  );
});

const PunarchakraMacbookScreen = React.memo(function PunarchakraMacbookScreen({ project }) {
  return (
    <div className="punar-macbook-ui" aria-label={`${project.title} web platform preview`}>
      <div className="punar-mac-topbar">
        <div className="punar-mac-brand">
          <span className="punar-mac-logo">
            <i className="fa-solid fa-recycle" aria-hidden="true"></i>
          </span>
          <div className="punar-mac-brand-text">
            <strong>Punarchakra</strong>
            <span>Circular E-Waste AI Hub</span>
          </div>
        </div>
        <span className="punar-mac-live-pill">
          <span className="punar-live-dot" aria-hidden="true"></span>
          CV Classifier Active
        </span>
      </div>

      <div className="punar-mac-stats">
        <div className="punar-mac-stat-card">
          <span className="punar-stat-k">Detected Stream</span>
          <strong className="punar-stat-v">PCB &amp; Li-Ion</strong>
          <span className="punar-stat-sub">94.2% confidence</span>
        </div>
        <div className="punar-mac-stat-card">
          <span className="punar-stat-k">CO₂ Diverted</span>
          <strong className="punar-stat-v">284.5 kg</strong>
          <span className="punar-stat-sub">Verified Circular Credit</span>
        </div>
        <div className="punar-mac-stat-card">
          <span className="punar-stat-k">Eco Rewards</span>
          <strong className="punar-stat-v">1,420 pts</strong>
          <span className="punar-stat-sub">Batch #PC-8842</span>
        </div>
      </div>

      <div className="punar-mac-list">
        <div className="punar-mac-row">
          <span className="punar-row-icon emerald">
            <i className="fa-solid fa-microchip" aria-hidden="true"></i>
          </span>
          <div className="punar-row-meta">
            <strong>Lithium &amp; Gold Core • Circuit Boards</strong>
            <span>Automated Optical Sorting • High Recovery Yield</span>
          </div>
          <span className="punar-row-badge good">Ready</span>
        </div>
        <div className="punar-mac-row">
          <span className="punar-row-icon amber">
            <i className="fa-solid fa-battery-half" aria-hidden="true"></i>
          </span>
          <div className="punar-row-meta">
            <strong>Li-Ion Cell Packs • Secondary Storage</strong>
            <span>BMS Health Diagnostic Passed • Safe Dispatch</span>
          </div>
          <span className="punar-row-badge warn">Verified</span>
        </div>
      </div>
    </div>
  );
});

const MobilePhoneScreen = React.memo(function MobilePhoneScreen({ project }) {
  const isFire = project.title === 'Agnivaarak' || project.visualType === 'agnivaarak';
  const isPunar = project.title === 'Punarchakra' || project.visualType === 'ballpit';

  const roleTitle = isPunar
    ? 'E-Waste Circular AI Hub'
    : isFire
    ? 'Fire Systems AI Lead'
    : 'Senior Product Designer';

  const starIcon = isPunar
    ? 'fa-solid fa-recycle'
    : isFire
    ? 'fa-solid fa-fire-flame-curved'
    : 'fa-solid fa-star';

  const toastText = isPunar
    ? 'Recycling Order #PC-8842 Dispatched'
    : isFire
    ? 'Sector Alpha rated as Verified Safe'
    : 'Daniel rated as Good fit';

  const starBg = isPunar ? '#ECFDF5' : isFire ? '#FFF7ED' : '#EFF6FF';
  const starColor = isPunar ? '#059669' : isFire ? '#EA580C' : '#2563EB';

  return (
    <Interactive3DStage className="mobile-3d-stage">
      <div className="mobile-dual-phones-container">
        {/* Phone 1: Left */}
        <Iphone className="mobile-iphone-device phone-left">
          <div className="iphone-screen-body">
            <div className="iphone-status-bar">
              <span className="iphone-time">9:41</span>
              <div className="iphone-status-icons">
                <i className="fa-solid fa-signal"></i>
                <i className="fa-solid fa-wifi"></i>
                <i className="fa-solid fa-battery-full"></i>
              </div>
            </div>
          {/* Top Job/Hub Header */}
          <div className="phone-hub-header">
            <div className="phone-hub-title-row">
              <span className="phone-star-badge" style={{ backgroundColor: starBg, color: starColor }}>
                <i className={starIcon}></i>
              </span>
              <div className="phone-hub-titles">
                <span className="phone-hub-role">{roleTitle}</span>
                <span className="phone-hub-status-tag" style={isPunar ? { backgroundColor: '#D1FAE5', color: '#065F46' } : undefined}>
                  {isPunar ? 'Verified' : 'Active'}
                </span>
              </div>
              <span className="phone-manage-link">{isPunar ? 'Track Hub' : 'Manage job'}</span>
            </div>

            {/* Filter Pills */}
            <div className="phone-filter-row">
              <span className="phone-filter-pill active">
                {isPunar ? 'PCB & Batteries' : 'Sort by Relevance'} <i className="fa-solid fa-chevron-down"></i>
              </span>
              <span className="phone-filter-pill">{isPunar ? 'Recovery Rate' : 'Ratings'} <i className="fa-solid fa-chevron-down"></i></span>
              <span className="phone-filter-pill">{isPunar ? 'Pickup Slot' : 'Years of exp'} <i className="fa-solid fa-chevron-down"></i></span>
            </div>
          </div>

          {/* Candidates / Items Feed */}
          <div className="phone-feed-list">
            {isPunar ? (
              <>
                <div className="phone-feed-card">
                  <div className="phone-eco-icon-badge" style={{ background: '#ECFDF5', color: '#059669', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    <i className="fa-solid fa-microchip"></i>
                  </div>
                  <div className="phone-feed-info">
                    <div className="phone-feed-headline">
                      <span className="phone-user-name">Lithium &amp; Gold Core <span className="phone-deg">• 94.2%</span></span>
                      <span className="phone-fit-badge good" style={{ background: '#D1FAE5', color: '#065F46' }}>High Yield</span>
                    </div>
                    <span className="phone-user-title">Circuit Boards &amp; GPU Units</span>
                    <span className="phone-user-loc">Automated CV Optical Sorting</span>
                    <button type="button" className="phone-message-btn" style={{ borderColor: '#059669', color: '#059669' }}>
                      <i className="fa-solid fa-truck-fast"></i> Schedule Pickup
                    </button>
                  </div>
                </div>

                <div className="phone-feed-card">
                  <div className="phone-eco-icon-badge" style={{ background: '#FEF3C7', color: '#D97706', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    <i className="fa-solid fa-battery-half"></i>
                  </div>
                  <div className="phone-feed-info">
                    <div className="phone-feed-headline">
                      <span className="phone-user-name">Li-Ion Cell Packs <span className="phone-deg">• 88.6%</span></span>
                      <span className="phone-fit-badge maybe" style={{ background: '#FEF3C7', color: '#92400E' }}>Hazard Safe</span>
                    </div>
                    <span className="phone-user-title">Secondary Energy Storage</span>
                    <span className="phone-user-loc">BMS Health Diagnostic Passed</span>
                    <button type="button" className="phone-message-btn">
                      <i className="fa-solid fa-qrcode"></i> Scan QR
                    </button>
                  </div>
                </div>

                <div className="phone-feed-card">
                  <div className="phone-eco-icon-badge" style={{ background: '#EFF6FF', color: '#2563EB', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    <i className="fa-solid fa-leaf"></i>
                  </div>
                  <div className="phone-feed-info">
                    <div className="phone-feed-headline">
                      <span className="phone-user-name">Carbon Offsets Earned</span>
                      <div className="phone-thumbs-row">
                        <i className="fa-solid fa-award" style={{ color: '#059669' }}></i>
                      </div>
                    </div>
                    <span className="phone-user-title">284.5 kg CO₂ Diverted</span>
                    <span className="phone-user-loc">Verified Circular Credit</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="phone-feed-card">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Daniel" className="phone-user-avatar" loading="lazy" decoding="async" />
                  <div className="phone-feed-info">
                    <div className="phone-feed-headline">
                      <span className="phone-user-name">Daniel Reyes <span className="phone-deg">• 3rd</span></span>
                      <span className="phone-fit-badge good">Good fit</span>
                    </div>
                    <span className="phone-user-title">Product Designer at Lumen Labs</span>
                    <span className="phone-user-loc">Austin, Texas</span>
                    <button type="button" className="phone-message-btn">
                      <i className="fa-regular fa-paper-plane"></i> Message
                    </button>
                  </div>
                </div>

                <div className="phone-feed-card">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Priya" className="phone-user-avatar" loading="lazy" decoding="async" />
                  <div className="phone-feed-info">
                    <div className="phone-feed-headline">
                      <span className="phone-user-name">Priya Nair <span className="phone-deg">• 3rd</span></span>
                      <span className="phone-fit-badge maybe">Maybe</span>
                    </div>
                    <span className="phone-user-title">Senior UX Designer at Cobalt</span>
                    <span className="phone-user-loc">New York, NY</span>
                    <button type="button" className="phone-message-btn">
                      <i className="fa-regular fa-paper-plane"></i> Message
                    </button>
                  </div>
                </div>

                <div className="phone-feed-card">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Tom" className="phone-user-avatar" loading="lazy" decoding="async" />
                  <div className="phone-feed-info">
                    <div className="phone-feed-headline">
                      <span className="phone-user-name">Tom Halvorsen <span className="phone-deg">• 3rd</span></span>
                      <div className="phone-thumbs-row">
                        <i className="fa-regular fa-thumbs-up"></i>
                        <i className="fa-regular fa-thumbs-down"></i>
                      </div>
                    </div>
                    <span className="phone-user-title">UI Designer at Brightfan</span>
                    <span className="phone-user-loc">Seattle, WA</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Floating Toast Pill */}
          <div className="phone-toast-pill">
            <div className="phone-toast-check">
              <i className="fa-solid fa-check"></i>
            </div>
            <span>{toastText}</span>
          </div>

          {/* Bottom Tabs */}
          <div className="phone-tab-bar">
            <div className="phone-tab-item active">
              <i className="fa-solid fa-house"></i>
              <span>Home</span>
            </div>
            <div className="phone-tab-item">
              <i className="fa-solid fa-user-group"></i>
              <span>My Network</span>
            </div>
            <div className="phone-tab-item">
              <div className="phone-post-circle">
                <i className="fa-solid fa-plus"></i>
              </div>
              <span>Post</span>
            </div>
            <div className="phone-tab-item with-badge">
              <i className="fa-regular fa-bell"></i>
              <span className="phone-tab-badge">2</span>
              <span>Notifications</span>
            </div>
            <div className="phone-tab-item">
              <i className="fa-solid fa-briefcase"></i>
              <span>Jobs</span>
            </div>
          </div>

          <div className="iphone-home-indicator" />
          </div>
        </Iphone>

        {/* Phone 2: Right */}
        <Iphone className="mobile-iphone-device phone-right">
          <div className="iphone-screen-body message-screen">
            <div className="iphone-status-bar">
              <span className="iphone-time">9:41</span>
              <div className="iphone-status-icons">
                <i className="fa-solid fa-signal"></i>
                <i className="fa-solid fa-wifi"></i>
                <i className="fa-solid fa-battery-full"></i>
              </div>
            </div>
          <div className="phone-msg-header">
            <button type="button" className="phone-close-btn" aria-label="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <span className="phone-msg-header-title">{isPunar ? 'Recycling Route #48' : 'New message'}</span>
          </div>

          <div className="phone-recipient-card">
            {isPunar ? (
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#D1FAE5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                <i className="fa-solid fa-truck-moving"></i>
              </div>
            ) : (
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80" alt="Maya" className="phone-recipient-avatar" loading="lazy" decoding="async" />
            )}
            <div className="phone-recipient-meta">
              <span className="phone-recipient-name">{isPunar ? 'Eco-Fleet Alpha 04' : 'Maya Okonkwo'}</span>
              <span className="phone-recipient-sub">{isPunar ? 'En route to Sector 7 Facility' : 'Lead Product Designer at Northwind'}</span>
            </div>
          </div>

          <div className="phone-msg-divider" />

          <div className="phone-msg-content-area">
            {isPunar ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>Batch Weight:</span>
                  <span style={{ color: '#059669' }}>42.8 kg E-Waste</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>Purity Grade:</span>
                  <span style={{ color: '#059669' }}>Class A Industrial</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>Verification Hash:</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '10px' }}>0x8F4C...31B</span>
                </div>
              </div>
            ) : (
              <p className="phone-draft-text">
                Hi<span className="phone-blinking-cursor">|</span>
              </p>
            )}
          </div>

          <div className="phone-msg-bottom-action">
            <button type="button" className="phone-send-btn" style={isPunar ? { background: '#059669', color: '#FFFFFF' } : undefined}>
              {isPunar ? 'Confirm Delivery ✓' : 'Send message'}
            </button>
            <div className="iphone-home-indicator" />
          </div>
          </div>
        </Iphone>
      </div>
      <div className="mobile-3d-ground-shadow" aria-hidden="true" />
    </Interactive3DStage>
  );
});

const ProjectRow = React.memo(function ProjectRow({
  project,
  index,
  isExpanded,
  hasBeenOpened,
  onClick,
  onKeyDown,
  onOpenModal
}) {
  const showVisualStage = isExpanded || hasBeenOpened;

  return (
    <article
      className={`editorial-row ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
      data-theme={project.theme}
      data-row-id={project.numericId}
      style={{
        '--accent-color': project.accentColor,
        '--accent-rgb': project.accentRgb,
        '--row-solid-bg': project.solidBg,
        '--row-text-color': project.textColor
      }}
      onClick={(e) => onClick(index, e)}
      onKeyDown={(e) => onKeyDown(e, index)}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-label={`${project.title} — ${isExpanded ? 'Expanded, click to collapse' : 'Click to expand'}`}
    >
      {/* Subtle Blueprint Grid Overlay per Project */}
      <div className="editorial-row-bg-grid" aria-hidden="true" />

      {/* Atmospheric Ambient Glow per Project */}
      <div
        className="editorial-row-ambient-glow"
        style={{ backgroundColor: project.accentColor }}
        aria-hidden="true"
      />

      {/* Default Row Summary Bar (Always Visible) */}
      <div className="editorial-row-bar">
        <div className="editorial-row-left">
          <span className="editorial-row-number">{project.number}</span>
          <div className="editorial-row-titles-wrap">
            <h3 className="editorial-row-title">
              {project.title}
            </h3>
            <span className="editorial-row-subtitle">
              {project.subtitle}
            </span>
          </div>
          <span className="editorial-row-category-pill">
            {project.categoryTag}
          </span>
        </div>

        <div className="editorial-row-right">
          <button
            type="button"
            className="editorial-jump-btn cursor-target"
            onClick={(e) => onOpenModal(project.numericId, e)}
            data-cursor-label="View"
            aria-label={`Jump To ${project.title} Project Details`}
          >
            <span>Jump To Project</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* Expandable Project Details Stage */}
      <div
        className="editorial-row-expansion"
        aria-hidden={!isExpanded}
      >
        <div className="editorial-expansion-inner">
          {/* Left Column: Rich Metadata & Editorial Content */}
          <div className="editorial-info-column">
            <div className="editorial-meta-grid">
              <div className="editorial-meta-cell">
                <span className="editorial-meta-label">ROLE</span>
                <span className="editorial-meta-val">{project.role}</span>
              </div>
              <div className="editorial-meta-cell">
                <span className="editorial-meta-label">TIMELINE</span>
                <span className="editorial-meta-val">{project.timeline}</span>
              </div>
              <div className="editorial-meta-cell">
                <span className="editorial-meta-label">YEAR</span>
                <span className="editorial-meta-val">{project.year}</span>
              </div>
              <div className="editorial-meta-cell">
                <span className="editorial-meta-label">PLATFORM</span>
                <span className="editorial-meta-val">{project.platform}</span>
              </div>
            </div>

            <h4 className="editorial-expanded-subtitle">
              {project.subtitle}
            </h4>

            <p className="editorial-expanded-narrative">
              {project.narrative}
            </p>

            {/* Prominent Metric Badges */}
            <div className="editorial-metrics-grid">
              {project.metrics.map((m, mIdx) => (
                <div key={mIdx} className="editorial-metric-box">
                  <span className="editorial-metric-stat">{m.stat}</span>
                  <span className="editorial-metric-desc">{m.desc}</span>
                </div>
              ))}
            </div>

            {/* Tech Stack Pills */}
            <div className="editorial-tech-list">
              {project.techStack.map((tech, tIdx) => (
                <span key={tIdx} className="editorial-tech-tag">
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Group */}
            <div className="editorial-actions-bar">
              <button
                type="button"
                className="editorial-action-primary cursor-target"
                onClick={(e) => onOpenModal(project.numericId, e)}
                data-cursor-label="Details"
              >
                <span>View Full Details</span>
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </button>

              {project.secondaryAction && (
                <a
                  href={project.secondaryAction.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-action-secondary cursor-target"
                  data-cursor-label="Open"
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.secondaryAction.icon && (
                    <i className={project.secondaryAction.icon}></i>
                  )}
                  <span>{project.secondaryAction.label}</span>
                </a>
              )}

              {(project.liveUrl || project.githubUrl) && (
                <div className="editorial-action-icons-row">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-action-icon cursor-target"
                      title="Open Live Website"
                      data-cursor-label="Live"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fa-solid fa-globe"></i>
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-action-icon cursor-target"
                      title="View GitHub Repository"
                      data-cursor-label="GitHub"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fa-brands fa-github"></i>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Visual Stage / Mockup Showcase */}
          <div className="editorial-visual-column">
            {showVisualStage && (
              project.visualType === 'ballpit' ? (
                <MobilePhoneScreen project={project} />
              ) : (
                <ProjectMockupCarousel project={project} />
              )
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

export default function ProjectsShowcase() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [openedIndices, setOpenedIndices] = useState(() => new Set());
  const [soundOn, setSoundOn] = useState(false);
  const containerRef = useRef(null);
  const hasInteractedRef = useRef(false);
  const scrollSettleTimerRef = useRef(null);

  const markOpened = useCallback((idx) => {
    if (idx === null || idx === undefined) return;
    setOpenedIndices((prev) => {
      if (prev.has(idx)) return prev;
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!hasInteractedRef.current) {
      return;
    }
    if (typeof window === 'undefined' || !window.ScrollTrigger) {
      return;
    }

    const container = containerRef.current;
    const refreshScrollTrigger = () => {
      if (typeof window.ScrollTrigger?.refresh === 'function') {
        const tracks = container
          ? Array.from(container.querySelectorAll('.mockup-carousel-track')).map((el) => [el, el.scrollLeft])
          : [];
        window.ScrollTrigger.refresh();
        tracks.forEach(([el, savedLeft]) => {
          if (Math.abs(el.scrollLeft - savedLeft) > 2) {
            el.style.scrollBehavior = 'auto';
            el.style.scrollSnapType = 'none';
            el.scrollLeft = savedLeft;
            el.style.scrollSnapType = '';
            el.style.scrollBehavior = '';
          }
        });
      }
    };

    const expansionTargets = container
      ? Array.from(container.querySelectorAll('.editorial-row-expansion'))
      : [];
    const hasRunningAnimation = expansionTargets.some(
      (el) => typeof el.getAnimations === 'function' && el.getAnimations().length > 0
    );

    if (!hasRunningAnimation) {
      refreshScrollTrigger();
      return;
    }

    let settled = false;
    let fallbackTimer = null;

    const finalize = () => {
      if (settled) return;
      settled = true;
      if (container) {
        container.removeEventListener('transitionend', handleTransitionEnd);
      }
      if (fallbackTimer) clearTimeout(fallbackTimer);
      refreshScrollTrigger();
    };

    const handleTransitionEnd = (ev) => {
      if (
        ev.propertyName === 'grid-template-rows' &&
        ev.target instanceof Element &&
        ev.target.classList.contains('editorial-row-expansion')
      ) {
        finalize();
      }
    };

    if (container) {
      container.addEventListener('transitionend', handleTransitionEnd);
    }
    fallbackTimer = setTimeout(finalize, 320);

    return () => {
      settled = true;
      if (container) {
        container.removeEventListener('transitionend', handleTransitionEnd);
      }
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [expandedIndex]);

  useEffect(() => {
    return () => {
      if (scrollSettleTimerRef.current) clearTimeout(scrollSettleTimerRef.current);
    };
  }, []);

  const total = SHOWCASE_PROJECTS.length;

  const handleToggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      setSoundEnabled(next);
      if (next) playSlideSound();
      return next;
    });
  }, []);

  const scrollRowIntoComfortableView = useCallback((numericId) => {
    if (scrollSettleTimerRef.current) clearTimeout(scrollSettleTimerRef.current);
    scrollSettleTimerRef.current = setTimeout(() => {
      const rowEl = document.querySelector(`.editorial-row[data-row-id="${numericId}"]`);
      if (!rowEl) return;
      const rect = rowEl.getBoundingClientRect();
      const dockClearance = 96;
      const topClearance = 76;

      if (rect.top < topClearance) {
        const targetY = window.scrollY + rect.top - 84;
        if (window.lenis && typeof window.lenis.scrollTo === 'function') {
          window.lenis.scrollTo(targetY, { duration: 0.45 });
        } else {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      } else if (rect.bottom > window.innerHeight - dockClearance && rect.height < window.innerHeight - 120) {
        const overflow = rect.bottom - (window.innerHeight - dockClearance);
        const targetY = window.scrollY + overflow;
        if (window.lenis && typeof window.lenis.scrollTo === 'function') {
          window.lenis.scrollTo(targetY, { duration: 0.45 });
        } else {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    }, 300);
  }, []);

  const handleRowClick = useCallback((index, e) => {
    // Don't toggle row if clicking inside buttons, links, or mockup stages
    if (e.target.closest('a, button, .mockup-carousel, .mobile-3d-stage')) {
      return;
    }

    hasInteractedRef.current = true;
    markOpened(index);

    setExpandedIndex((prev) => {
      if (prev === index) {
        if (scrollSettleTimerRef.current) clearTimeout(scrollSettleTimerRef.current);
        return null;
      }

      playSlideSound();
      const numericId = SHOWCASE_PROJECTS[index]?.numericId;
      if (numericId) {
        scrollRowIntoComfortableView(numericId);
      }
      return index;
    });
  }, [markOpened, scrollRowIntoComfortableView]);

  const handleOpenModal = useCallback((numericId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof window !== 'undefined' && typeof window.openProjectModalById === 'function') {
      window.openProjectModalById(numericId);
    } else {
      const modal = document.getElementById('project-modal');
      if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
      }
    }
  }, []);

  const handleKeyDown = useCallback((e, index) => {
    if (e.target.closest('a, button, .mockup-carousel, .mobile-3d-stage')) {
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      hasInteractedRef.current = true;
      markOpened(index);
      setExpandedIndex((prev) => {
        if (prev === index) {
          return null;
        }
        playSlideSound();
        return index;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % total;
      hasInteractedRef.current = true;
      markOpened(next);
      setExpandedIndex(next);
      playSlideSound();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + total) % total;
      hasInteractedRef.current = true;
      markOpened(prev);
      setExpandedIndex(prev);
      playSlideSound();
    }
  }, [total, markOpened]);

  return (
    <div
      className="editorial-showcase-wrapper"
      id="projects-showcase-container"
      ref={containerRef}
    >
      {/* Top Header Bar */}
      <header className="editorial-top-header" aria-label="Projects Section Header">
        <div className="editorial-header-left">
          <div className="editorial-section-pill">
            <span className="editorial-pill-dot" />
            <i className="fa-solid fa-layer-group" style={{ fontSize: '11px', color: '#FFC52E' }} />
            <span className="editorial-pill-label">SELECTED WORKS</span>
            <span className="editorial-pill-divider">/</span>
            <span className="editorial-pill-count">06 PROJECTS</span>
          </div>

          <div className="editorial-header-title-row">
            <h2 className="editorial-section-title">
              PROJECTS<span className="editorial-accent-dot">.</span>
            </h2>
          </div>
        </div>

        <div className="editorial-header-right">
          <button
            type="button"
            className={`editorial-sound-toggle-btn cursor-target ${soundOn ? 'sound-active' : ''}`}
            onClick={handleToggleSound}
            data-cursor-label={soundOn ? 'Mute' : 'Audio'}
            aria-label={soundOn ? 'Disable Sound Effect' : 'Enable Sound Effect'}
          >
            <i className={`fa-solid ${soundOn ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
            <span>{soundOn ? 'Sound: ON' : 'Sound: OFF'}</span>
          </button>
        </div>
      </header>

      {/* Six Horizontal Expandable Rows */}
      <div className="editorial-rows-container" role="region" aria-label="Selected Projects Showcase">
        {SHOWCASE_PROJECTS.map((project, index) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={index}
            isExpanded={expandedIndex === index}
            hasBeenOpened={openedIndices.has(index)}
            onClick={handleRowClick}
            onKeyDown={handleKeyDown}
            onOpenModal={handleOpenModal}
          />
        ))}
      </div>
    </div>
  );
}
