import React, { useState, useEffect, useMemo, useRef } from 'react';
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
    zIndex: 2
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
    zIndex: 3
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
    zIndex: 3
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
    zIndex: 2
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
    zIndex: 3
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
    zIndex: 2
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
    zIndex: 3
  },
  {
    id: 9,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.19 PM.jpeg',
    title: 'Department Hackathon',
    subtitle: 'College Mini-Hackathon Triumph with Four Friends',
    date: 'Dec 2024',
    format: 'milestone-full',
    aspectRatio: 1600 / 1059,
    rotation: -1.2,
    overlapX: -3,
    overlapY: 2,
    zIndex: 4
  },
  {
    id: 20,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.31 PM.jpeg',
    title: 'VANI Victory',
    subtitle: 'Awards Ceremony at AOT Tech Fest for VANI',
    date: 'Oct 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: -1.6,
    overlapX: -2,
    overlapY: 3,
    zIndex: 2
  },
  {
    id: 11,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.21 PM.jpeg',
    title: 'Synchronicity Selfie',
    subtitle: 'Candid Moment During Synchronicity Hackathon',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -1.4,
    overlapX: -2,
    overlapY: 3,
    zIndex: 2
  },
  {
    id: 13,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.23 PM-2.jpeg',
    title: 'Kshitij Achievements',
    subtitle: 'Certificates & Memorabilia from IIT Kharagpur',
    date: 'Jan 2025',
    format: 'tall',
    aspectRatio: 0.75,
    rotation: -2.0,
    overlapX: -3,
    overlapY: 2,
    zIndex: 4
  },
  {
    id: 12,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.22 PM.jpeg',
    title: 'IIM Calcutta Challenge',
    subtitle: 'Coding Challenge & Debate at IIM Calcutta',
    date: 'Oct 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: 0.8,
    overlapX: 3,
    overlapY: -2,
    zIndex: 3
  },
  {
    id: 14,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.23 PM.jpeg',
    title: 'IIM Calcutta Arena',
    subtitle: 'Hackathon Floor & Event Atmosphere at IIM Calcutta',
    date: 'Dec 2024',
    format: 'tall',
    aspectRatio: 0.75,
    rotation: 2.3,
    overlapX: 2,
    overlapY: -3,
    zIndex: 2
  },
  {
    id: 15,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.25 PM-2.jpeg',
    title: 'Techfest Recognition',
    subtitle: 'Post-Hackathon Reflections at Kshitij, IIT Kharagpur',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -1.1,
    overlapX: -2,
    overlapY: 3,
    zIndex: 3
  },
  {
    id: 23,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.33 PM.jpeg',
    title: 'Synchronicity Gathering',
    subtitle: 'Group Photo with Mentors, Friends & Volunteers',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: 1.0,
    overlapX: 3,
    overlapY: -2,
    zIndex: 3
  },
  {
    id: 17,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.29 PM.jpeg',
    title: 'Techfest Memories',
    subtitle: 'Synox & CSBS Celebrations at AOT Tech Fest',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: 1.2,
    overlapX: 2,
    overlapY: -3,
    zIndex: 3
  },
  {
    id: 18,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.30 PM-2.jpeg',
    title: 'Google Solution Showcase',
    subtitle: 'Top 100 Presentation Before Board & Trustee',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -0.7,
    overlapX: -3,
    overlapY: 2,
    zIndex: 2
  },
  {
    id: 19,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.30 PM.jpeg',
    title: 'Boardroom Presentation',
    subtitle: 'Presenting Architecture in the College Boardroom',
    date: 'Sep 2024',
    format: 'wide',
    aspectRatio: 1.45,
    rotation: 2.0,
    overlapX: 3,
    overlapY: -2,
    zIndex: 3
  },
  {
    id: 10,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.20 PM.jpeg',
    title: 'Campus Memories',
    subtitle: 'Early Semester Reflections at AOT',
    date: 'Dec 2024',
    format: 'tall',
    aspectRatio: 0.75,
    rotation: 1.9,
    overlapX: 2,
    overlapY: -3,
    zIndex: 3
  },
  {
    id: 21,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.32 PM-2.jpeg',
    title: 'Techfest Recognition',
    subtitle: 'Team Felicitation on Stage During AOT Tech Fest',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: 1.8,
    overlapX: 2,
    overlapY: -3,
    zIndex: 4
  },
  {
    id: 22,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.32 PM.jpeg',
    title: 'First Hackathon Win',
    subtitle: 'Emotionally Significant First Victory at AOT Tech Fest',
    date: 'Dec 2024',
    format: 'tall',
    aspectRatio: 0.75,
    rotation: -2.4,
    overlapX: -3,
    overlapY: 2,
    zIndex: 2
  },
  {
    id: 16,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.25 PM.jpeg',
    title: 'Kshitij Moments',
    subtitle: 'Celebrating Milestones & Accolades at IIT Kharagpur',
    date: 'Dec 2024',
    format: 'tall',
    aspectRatio: 0.75,
    rotation: 1.5,
    overlapX: 3,
    overlapY: -2,
    zIndex: 4
  },
  {
    id: 24,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.35 PM.jpeg',
    title: 'SCCSE Tech Team',
    subtitle: 'Cherished Group Photo with SCCSE Tech Team',
    date: 'Dec 2024',
    format: 'championship-full',
    aspectRatio: 4160 / 2755,
    rotation: -1.3,
    overlapX: -2,
    overlapY: 3,
    zIndex: 4
  },
  {
    id: 25,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.36 PM.jpeg',
    title: 'Build Club Innovation',
    subtitle: 'IoT Hardware & Edge Computing Development',
    date: 'Nov 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: 2.2,
    overlapX: 2,
    overlapY: -3,
    zIndex: 2
  },
  {
    id: 26,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.38 PM.jpeg',
    title: 'Hacktropica Sprint',
    subtitle: 'Rapid Prototyping & Sprint Deployment at Hacktropica',
    date: 'Dec 2024',
    format: 'tall',
    aspectRatio: 0.75,
    rotation: -0.9,
    overlapX: -2,
    overlapY: 3,
    zIndex: 3
  },
  {
    id: 27,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.39 PM.jpeg',
    title: 'Hacktropica Overview',
    subtitle: 'Top-View Arrangement & Venue Atmosphere',
    date: 'Feb 2025',
    format: 'tall',
    aspectRatio: 0.75,
    rotation: 1.7,
    overlapX: 3,
    overlapY: -2,
    zIndex: 2
  },
  {
    id: 28,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.40 PM.jpeg',
    title: 'Hacktropica Goodies',
    subtitle: 'Swag & Memorabilia Received from Hacktropica',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -2.1,
    overlapX: -3,
    overlapY: 2,
    zIndex: 4
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
    overlapX: -2,
    overlapY: 3,
    zIndex: 3
  },
  {
    id: 31,
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.45 PM.jpeg',
    title: 'Hacktechnique Memories',
    subtitle: 'Cherished Memories from Our First Offline Hackathon',
    date: '2025/2026',
    format: 'tall',
    aspectRatio: 0.75,
    rotation: 2.0,
    overlapX: 3,
    overlapY: -2,
    zIndex: 4
  },
  {
    id: 40,
    src: 'images/boardroom-showcase.jpg',
    title: 'No Code Website Presentation',
    subtitle: 'Another photograph from the same boardroom event where I presented our Google Solution Challenge project before the college board members and trustee.',
    date: 'Sep 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: 1.3,
    overlapX: 2,
    overlapY: -2,
    zIndex: 3
  },
  {
    id: 41,
    src: 'images/synchronicity-experience.jpg',
    title: 'Synchronicity Experience',
    subtitle: 'A photograph from Synchronicity, where our team and friends spent the entire day working together. It was a memorable, fun-filled hackathon experience that represents exactly why I love participating in hackathons.',
    date: 'Dec 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: -1.4,
    overlapX: -2,
    overlapY: 2,
    zIndex: 2
  },
  {
    id: 42,
    src: 'images/hacktropica-squad.jpg',
    title: 'Hacktropica Squad',
    subtitle: 'A group photograph with my friends and teammates during Hacktropica.',
    date: 'Oct 2024',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: 1.8,
    overlapX: 3,
    overlapY: -3,
    zIndex: 4
  },
  {
    id: 43,
    src: 'images/uxopia-design.jpg',
    title: 'UXopia Design',
    subtitle: 'A memorable photograph from UXopia, working on building a design as one of my early design experiences in college.',
    date: '2024',
    format: 'wide',
    aspectRatio: 1.5,
    rotation: -1.7,
    overlapX: -3,
    overlapY: 1,
    zIndex: 3
  },
  {
    id: 44,
    src: 'images/induction-memories.jpg',
    title: 'Induction Memories',
    subtitle: 'A photograph from the induction program organized during my first semester at AOT.',
    date: '2023',
    format: 'standard',
    aspectRatio: 1.33,
    rotation: 1.1,
    overlapX: 2,
    overlapY: -2,
    zIndex: 2
  }
];

function getEstimatedHeight(photo) {
  let ratio = 1.33;
  if (photo.aspectRatio) ratio = photo.aspectRatio;
  else if (photo.format === 'tall' || photo.format === 'hackathon-portrait') ratio = 0.75;
  else if (photo.format === 'wide') ratio = 1.45;
  else if (photo.format === 'milestone-full') ratio = 1600 / 1059;
  else if (photo.format === 'championship-full') ratio = 4160 / 2755;
  return (220 / ratio) + 38;
}

function useColumnCount() {
  const [columns, setColumns] = useState(() => {
    if (typeof window === 'undefined') return 6;
    const w = window.innerWidth;
    if (w >= 1350) return 6;
    if (w >= 1050) return 5;
    if (w >= 768) return 4;
    if (w >= 500) return 3;
    return 2;
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      let c = 2;
      if (w >= 1350) c = 6;
      else if (w >= 1050) c = 5;
      else if (w >= 768) c = 4;
      else if (w >= 500) c = 3;
      setColumns((prev) => (prev !== c ? c : prev));
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return columns;
}

export default function PhotographicMemoryWall() {
  const [activePhoto, setActivePhoto] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [revealedIds, setRevealedIds] = useState(() => new Set());
  const wallRef = useRef(null);
  const cardElementsRef = useRef(new Map());
  const columnCount = useColumnCount();

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActivePhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Interlocking Bin-Packing Layout Calculation
  const { columns, STAGGER_OFFSETS } = useMemo(() => {
    const colCount = columnCount;
    const cols = Array.from({ length: colCount }, () => []);
    // Natural organic offsets so the top edge looks casually collected over time
    const offsets = [0, 16, 6, 22, 12, 18];
    const heights = offsets.slice(0, colCount).map((o) => o);

    // Greedy bin-packing: places each photo into the shortest column
    // This guarantees that adjacent items touch and columns end evenly with no gaps
    ARCHIVAL_PHOTOS.forEach((photo) => {
      let minCol = 0;
      let minH = heights[0];
      for (let c = 1; c < colCount; c++) {
        if (heights[c] < minH) {
          minH = heights[c];
          minCol = c;
        }
      }

      cols[minCol].push(photo);
      heights[minCol] += getEstimatedHeight(photo) + 10; // 10px target spacing
    });

    return { columns: cols, STAGGER_OFFSETS: offsets };
  }, [columnCount]);

  // Reveal On Scroll via IntersectionObserver (animates tiles as user scrolls down)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setRevealedIds(new Set(ARCHIVAL_PHOTOS.map((p) => p.id)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-id'));
            if (id) {
              setRevealedIds((prev) => {
                if (prev.has(id)) return prev;
                const next = new Set(prev);
                next.add(id);
                return next;
              });
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: '0px 0px -4% 0px',
        threshold: 0.05
      }
    );

    cardElementsRef.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [columns]);

  return (
    <div className="photographic-wall-installation" ref={wallRef}>
      {/* Wall Header: Exotic Display Typography Matching Hero Section */}
      <header className="pmw-exotic-header" aria-label="Snapshots / A Collection of Moments Header">
        {/* Top Metadata Status Header Row */}
        <div className="pmw-meta-top-bar">
          <div className="pmw-meta-left">
            <span className="pmw-bracket-tag">〔 ARCHIVE / 2024–2026 〕</span>
            <span className="pmw-sub-badge">SNAPSHOTS REEL</span>
          </div>
          <div className="pmw-meta-right">
            <div className="pmw-live-pill">
              <span className="pmw-live-dot" />
              <span>{ARCHIVAL_PHOTOS.length} PHYSICAL PRINTS</span>
            </div>
            <span className="pmw-stamp-badge">REEL®</span>
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
          Authentic printed photo collage • Hover any photograph to bring its authentic colors to life
        </p>
      </header>

      {/* Main Dense Wall Composition */}
      <div className="wall-canvas-stage">
        {/* Interlocking Masonry Columns with minimal 8-14px gaps */}
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
              {columnPhotos.map((photo) => {
                const isHovered = hoveredId === photo.id;
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
                    className={`photo-print-card format-${photo.format} ${isRevealed ? 'is-revealed' : ''} ${isHovered ? 'is-active' : ''}`}
                    style={style}
                    onMouseEnter={() => setHoveredId(photo.id)}
                    onMouseLeave={() => setHoveredId(null)}
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
                    {/* Physical Photo Paper Border Frame */}
                    <div className="photo-paper-surface">
                      {/* Image Frame with Film Grain Texture */}
                      <div className="photo-media-container">
                        <img
                          src={photo.src}
                          alt={photo.title}
                          loading="lazy"
                          className="photo-actual-image"
                          draggable={false}
                        />
                        <div className="photo-paper-grain" aria-hidden="true"></div>
                      </div>

                      {/* Physical Bottom White Margin with Archival Pencil Stamp */}
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
      </div>

      {/* Wall Installation Bottom Clean Registration */}
      <footer className="wall-architectural-footer">
        <span className="wall-reg-mark" aria-hidden="true">⌞</span>
        <span className="wall-footer-note">PRINTED PHOTOGRAPHIC ARCHIVE • CLICK ANY PRINT TO ENLARGE</span>
        <span className="wall-reg-mark" aria-hidden="true">⌟</span>
      </footer>

      {/* Full-Res Lightbox Modal */}
      {activePhoto && (
        <div
          className="wall-lightbox-overlay"
          onClick={() => setActivePhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
        >
          <div
            className="wall-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="wall-lightbox-close-btn"
              onClick={() => setActivePhoto(null)}
              aria-label="Close photo preview"
            >
              ✕
            </button>
            <div className="wall-lightbox-media">
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                className="wall-lightbox-image"
              />
            </div>
            <div className="wall-lightbox-meta">
              <div className="wall-lightbox-header-row">
                <h3 className="wall-lightbox-title">{activePhoto.title}</h3>
                <span className="wall-lightbox-date">{activePhoto.date}</span>
              </div>
              <p className="wall-lightbox-subtitle">{activePhoto.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
