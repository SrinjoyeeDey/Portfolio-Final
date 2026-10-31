import React from 'react';
import { createRoot } from 'react-dom/client';
import CircularCarousel from './CircularCarousel';
import DriftWall from './DriftWall';

/**
 * Memory Wall Items
 * User can easily drop their own images, titles, and subtitles here,
 * or configure window.MEMORY_WALL_ITEMS before load.
 */
export const MEMORY_WALL_ITEMS = [
  {
    src: 'images/srinjoyee-hackathon.png',
    alt: 'Smart India Hackathon Grand Finale Winner Stage',
    title: 'Hackathon Grand Finale',
    subtitle: 'National 1st Place Winner'
  },
  {
    src: 'images/srinjoyee-about-portrait.png',
    alt: 'Creative Studio & Tech Ideation',
    title: 'Creative Studio',
    subtitle: 'Design & Code Journey'
  },
  {
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80&auto=format&fit=crop',
    alt: 'Hackathon collaboration and brainstorming whiteboard',
    title: 'Team Ideation',
    subtitle: 'Midnight Sprint • Problem Solving'
  },
  {
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop',
    alt: 'Collaborative code sprint and system architecture',
    title: 'Code Sprint',
    subtitle: 'Pair Programming & Architecture'
  },
  {
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80&auto=format&fit=crop',
    alt: 'Keynote presentation and project showcase',
    title: 'Demo Day & Pitch',
    subtitle: 'Project Presentation'
  },
  {
    src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=900&q=80&auto=format&fit=crop',
    alt: 'Hands-on hardware and robotics prototype testing',
    title: 'Hardware & IoT Lab',
    subtitle: 'Edge AI Testing'
  },
  {
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&q=80&auto=format&fit=crop',
    alt: 'Deep learning neural network telemetry',
    title: 'Neural Lab',
    subtitle: 'Model Training & Inference'
  },
  {
    src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80&auto=format&fit=crop',
    alt: 'Trophy celebration and achievement milestone',
    title: 'Milestone Celebration',
    subtitle: 'Recognition & Joy'
  },
  {
    src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&q=80&auto=format&fit=crop',
    alt: 'Retro tech workstation and creative coding setup',
    title: 'Creative Setup',
    subtitle: 'Workstation & Hardware'
  },
  {
    src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=80&auto=format&fit=crop',
    alt: 'Design thinking workshop with tactile UI mockups',
    title: 'Design Workshop',
    subtitle: 'Interface Prototyping'
  }
];

const EXTRA_DRIFT_TILES = [
  { image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80&auto=format&fit=crop', title: 'Tech Innovation' },
  { image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80&auto=format&fit=crop', title: 'Collaborative Lab' },
  { image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80&auto=format&fit=crop', title: 'Development Sprint' },
  { image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop', title: 'Strategy & Architecture' },
  { image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80&auto=format&fit=crop', title: 'Global Connectivity' }
];

export function initMemoryWall() {
  const mountEl = document.getElementById('memory-wall-carousel-root');
  if (!mountEl) return;

  const items = (window.MEMORY_WALL_ITEMS && Array.isArray(window.MEMORY_WALL_ITEMS) && window.MEMORY_WALL_ITEMS.length)
    ? window.MEMORY_WALL_ITEMS
    : MEMORY_WALL_ITEMS;

  const driftTiles = items.map(item => ({
    image: item.src || item.image,
    title: item.title || item.alt || 'Memory'
  })).concat(EXTRA_DRIFT_TILES);

  const root = createRoot(mountEl);
  root.render(
    <div className="memory-wall-composite-stage">
      {/* Background: Spatial DriftWall (Clear, elegant drifting mural with bokeh blur until hovered) */}
      <div className="memory-wall-drift-backdrop" aria-hidden="true">
        <DriftWall
          items={driftTiles}
          columns={7}
          tileWidth={230}
          tileHeight={148}
          gap={22}
          tilt={12}
          turn={-10}
          perspective={1400}
          depth={160}
          speed={24}
          direction="up"
          variance={0.35}
          parallax={0.4}
          lift={56}
          fade={0.4}
          dim={0.92}
          grayscale={true}
          overlayColor="transparent"
        />
      </div>

      {/* Foreground: Interactive Circular 3D Reel (Slightly smaller, centered hero) */}
      <div className="memory-wall-carousel-front">
        <CircularCarousel
          items={items}
          preset="cylinder"
          intro="rise"
          cardWidth={230}
          aspectRatio={0.9}
          gap={24}
          speed={12}
          autoplay="drift"
          pauseOnHover={true}
          draggable={true}
          captions={true}
          fadeColor="#ECECE7"
          cornerRadius={16}
        />
      </div>
    </div>
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMemoryWall);
} else {
  initMemoryWall();
}
