import React from 'react';
import { createRoot } from 'react-dom/client';
import PhotoGlobe from './PhotoGlobe';

/**
 * Memory Wall Items
 * Authentic real-world photographs from Srinjoyee's hackathons, award ceremonies,
 * engineering sprints, and campus journey (sourced from images/grid_img/).
 */
export const MEMORY_WALL_ITEMS = [
  {
    src: 'images/srinjoyee-hackathon.png',
    image: 'images/srinjoyee-hackathon.png',
    alt: 'Smart India Hackathon Grand Finale Winner Stage',
    title: 'Smart India Hackathon',
    subtitle: 'Grand Finale Winner • National 1st Place'
  },
  {
    src: 'images/srinjoyee-classroom.png',
    image: 'images/srinjoyee-classroom.png',
    alt: 'Candid Classroom Tech Sprint & Laptop Ideation',
    title: 'Classroom Ideation',
    subtitle: 'Candid Tech Sprint • AI & ML'
  },
  {
    src: 'images/srinjoyee-about-portrait.png',
    image: 'images/srinjoyee-about-portrait.png',
    alt: 'Creative Studio & Tech Ideation',
    title: 'Creative Studio',
    subtitle: 'Design & Code • Experimental UI'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.14 PM-2.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.14 PM-2.jpeg',
    alt: 'Hackathon Grand Finale Stage Presentation',
    title: 'Grand Finale Stage',
    subtitle: 'Pitching to the National Jury'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.14 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.14 PM.jpeg',
    alt: 'SIH Winners Celebration & Trophy',
    title: 'National Champions',
    subtitle: 'Smart India Hackathon 1st Prize'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.15 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.15 PM.jpeg',
    alt: 'Prototype Pitch & Live Demo',
    title: 'Live Evaluation',
    subtitle: 'Demonstrating Edge AI Vision'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.16 PM-2.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.16 PM-2.jpeg',
    alt: 'Team Strategy Sync & Design',
    title: 'Architecture Review',
    subtitle: 'System Design & Dataflow'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.16 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.16 PM.jpeg',
    alt: 'Candid Campus Moment & Debrief',
    title: 'Campus Moments',
    subtitle: 'Post-Hackathon Reflections'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.18 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.18 PM.jpeg',
    alt: 'Innovation Lab Review & Hardware Bench',
    title: 'Hardware & IoT Lab',
    subtitle: 'Microcontrollers & Sensors'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.19 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.19 PM.jpeg',
    alt: 'Team Victory Trophy & Celebration',
    title: 'Milestone Victory',
    subtitle: 'Celebrating with the Team'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.20 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.20 PM.jpeg',
    alt: 'National Podium Moment at Grand Finale',
    title: 'Podium Honors',
    subtitle: 'SIH National Grand Finale'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.21 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.21 PM.jpeg',
    alt: 'Hackathon Jury Presentation & Defense',
    title: 'Jury Defense',
    subtitle: 'Addressing Technical Deep-Dives'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.22 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.22 PM.jpeg',
    alt: 'Tech Sprint Discussions & Ideation',
    title: 'Collaborative Dev',
    subtitle: 'Peer Brainstorming & Review'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.23 PM-2.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.23 PM-2.jpeg',
    alt: 'Felicitation & Certificate of Excellence',
    title: 'Certificate of Honor',
    subtitle: 'Institutional Felicitation'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.23 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.23 PM.jpeg',
    alt: 'Grand Finale Showcase Arena',
    title: 'Grand Finale Arena',
    subtitle: 'All-India National Contestants'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.25 PM-2.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.25 PM-2.jpeg',
    alt: 'Engineering Lab Sprints & Prototyping',
    title: 'Rapid Prototyping',
    subtitle: 'Hardware Enclosures & Wiring'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.25 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.25 PM.jpeg',
    alt: 'Winner Stage Accolades & Cheque',
    title: 'Stage Accolades',
    subtitle: '1st Prize Trophy & Award'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.26 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.26 PM.jpeg',
    alt: 'Midnight Coding Marathon at Hackathon',
    title: 'Midnight Coding',
    subtitle: '36-Hour Hackathon Sprint'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.29 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.29 PM.jpeg',
    alt: 'Post-Demo Celebrations with Team',
    title: 'Team Celebrations',
    subtitle: 'Winning Smiles After Demo'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.30 PM-2.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.30 PM-2.jpeg',
    alt: 'Keynote Stage Honor & Dignitaries',
    title: 'Keynote Stage Honor',
    subtitle: 'Awarded by Chief Dignitaries'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.30 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.30 PM.jpeg',
    alt: 'Hands-on Hardware Integration',
    title: 'Hardware Setup',
    subtitle: 'Sensor Array & Breadboard'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.31 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.31 PM.jpeg',
    alt: 'Candid Classroom Ideation & Whiteboard',
    title: 'Ideation Room',
    subtitle: 'Formulating Core Algorithms'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.32 PM-2.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.32 PM-2.jpeg',
    alt: 'Winner Cheque Presentation Ceremony',
    title: 'Cash Prize Ceremony',
    subtitle: 'Smart India Hackathon Award'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.32 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.32 PM.jpeg',
    alt: 'Campus Hackathon Team Sprint',
    title: 'Squad Sprint',
    subtitle: 'Pair Programming & Testing'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.33 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.33 PM.jpeg',
    alt: 'Jury Tech Q&A and Live Demo',
    title: 'Jury Tech Q&A',
    subtitle: 'Real-Time Edge Testing'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.35 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.35 PM.jpeg',
    alt: 'National Champions Team Photo',
    title: 'Championship Victory',
    subtitle: 'Proud Team Moment'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.36 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.36 PM.jpeg',
    alt: 'AI Pipeline Verification & Benchmarking',
    title: 'Model Benchmarking',
    subtitle: 'Inference Latency Audit'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.38 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.38 PM.jpeg',
    alt: 'Demo Arena Standee & Presentation',
    title: 'Showcase Booth',
    subtitle: 'Live Product Walkthrough'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.39 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.39 PM.jpeg',
    alt: 'Fellow Builders Community Meetup',
    title: 'Builder Community',
    subtitle: 'Developer Networking'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.40 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.40 PM.jpeg',
    alt: 'Victory Smiles After 36 Hours of Code',
    title: 'Unstoppable Energy',
    subtitle: 'Post-Hackathon Energy'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.42 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.42 PM.jpeg',
    alt: 'Stage Recognition & Honors',
    title: 'Excellence Citation',
    subtitle: 'National Stage Award'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.43 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.43 PM.jpeg',
    alt: 'Mentor & Jury Strategic Feedback',
    title: 'Mentor Debrief',
    subtitle: 'Architecture Scalability Review'
  },
  {
    src: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.45 PM.jpeg',
    image: 'images/grid_img/WhatsApp Image 2026-10-31 at 7.54.45 PM.jpeg',
    alt: 'Journey Reflections & Future Builds',
    title: 'Journey Ahead',
    subtitle: 'Continuous Building & Growth'
  }
];

if (typeof window !== 'undefined') {
  window.MEMORY_WALL_ITEMS = MEMORY_WALL_ITEMS;
}

export function initMemoryWall() {
  const mountEl = document.getElementById('memory-wall-carousel-root');
  if (!mountEl) return;

  const items = (window.MEMORY_WALL_ITEMS && Array.isArray(window.MEMORY_WALL_ITEMS) && window.MEMORY_WALL_ITEMS.length)
    ? window.MEMORY_WALL_ITEMS
    : MEMORY_WALL_ITEMS;

  const root = createRoot(mountEl);
  root.render(
    <PhotoGlobe items={items} />
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMemoryWall);
} else {
  initMemoryWall();
}
