import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import CardSwap, { Card } from './CardSwap';
import './CardSwap.css';

const PROJECTS = [
  {
    id: '1',
    category: 'ai',
    categoryTag: 'AI • Healthcare • Mobile',
    bannerClass: 'banner-vani',
    iconClass: 'fa-heart-pulse',
    title: 'VAni',
    subtitle: 'AI-Powered Recovery Companion',
    excerpt: 'Multilingual voice-first platform guiding post-hospital recovery while keeping caregivers in sync.',
    tags: ['React Native', 'AI / ML', 'GenAI', 'Node.js'],
    primaryAction: {
      label: 'Download APK',
      icon: 'fa-solid fa-download',
      url: 'https://github.com/SrinjoyeeDey/VAni/releases/download/v1.0.0/VAni.apk'
    },
    secondaryAction: {
      label: 'Live Website',
      icon: 'fa-solid fa-globe',
      url: 'https://vani-bice.vercel.app/'
    }
  },
  {
    id: '2',
    category: 'ai',
    categoryTag: 'AI • Computer Vision • IoT',
    bannerClass: 'banner-fire',
    iconClass: 'fa-fire-flame-curved',
    title: 'Agnivaarak',
    subtitle: 'Autonomous Fire Detection & Suppression',
    excerpt: 'Intelligent edge-AI & robotics system for real-time fire detection, chemical suppression, and alerts.',
    tags: ['Python', 'YOLOv8', 'Arduino', 'MQTT'],
    primaryAction: {
      label: 'Explore Project',
      icon: 'fa-solid fa-arrow-up-right-from-square',
      url: 'https://github.com/SrinjoyeeDey/Agnivaarak'
    },
    secondaryAction: {
      label: 'GitHub',
      icon: 'fa-brands fa-github',
      url: 'https://github.com/SrinjoyeeDey/Agnivaarak'
    }
  },
  {
    id: '3',
    category: 'ai',
    categoryTag: 'AI/ML • Generative AI • RAG',
    bannerClass: 'banner-anchor',
    iconClass: 'fa-anchor',
    title: 'Anchor',
    subtitle: 'Grounded AI Knowledge System',
    excerpt: 'Full-stack RAG system extracting grounded knowledge from docs with vector search & LangGraph.',
    tags: ['React 19', 'FastAPI', 'LangGraph', 'pgvector'],
    primaryAction: {
      label: 'Explore Project',
      icon: 'fa-solid fa-arrow-up-right-from-square',
      url: 'https://github.com/SrinjoyeeDey'
    },
    secondaryAction: {
      label: 'GitHub',
      icon: 'fa-brands fa-github',
      url: 'https://github.com/SrinjoyeeDey'
    }
  },
  {
    id: '4',
    category: 'ai',
    categoryTag: 'AI/ML • Fact Checking • Backend',
    bannerClass: 'banner-nobodristhi',
    iconClass: 'fa-newspaper',
    title: 'Nobodristhi',
    subtitle: 'AI-Powered News Verification',
    excerpt: 'News verification pipeline combining geospatial clustering, Haversine matching, and reverse-image search.',
    tags: ['Python/Flask', 'PostgreSQL', 'SerpAPI', 'LLMs'],
    primaryAction: {
      label: 'Watch Preview',
      icon: 'fa-solid fa-play',
      url: 'https://drive.google.com/file/d/1G6v34ZHr6KDTvnT2ezIzofBHMVTiMkUc/view?usp=drivesdk'
    },
    secondaryAction: {
      label: 'GitHub',
      icon: 'fa-brands fa-github',
      url: 'https://github.com/SrinjoyeeDey'
    }
  },
  {
    id: '5',
    category: 'web',
    categoryTag: 'AI/ML • Product • POS',
    bannerClass: 'banner-nexvyapaar',
    iconClass: 'fa-store',
    title: 'NexVyapaar',
    subtitle: 'AI Business Assistant for Retail',
    excerpt: 'Offline-first AI business assistant turning sales data into inventory alerts and pharmacy compliance.',
    tags: ['React', 'TypeScript', 'Tailwind', 'IndexedDB'],
    primaryAction: {
      label: 'Watch Preview',
      icon: 'fa-solid fa-play',
      url: 'https://github.com/SrinjoyeeDey/NexVyapaar'
    },
    secondaryAction: {
      label: 'GitHub',
      icon: 'fa-brands fa-github',
      url: 'https://github.com/SrinjoyeeDey/NexVyapaar'
    }
  },
  {
    id: '6',
    category: 'branding',
    categoryTag: 'AI/ML • Sustainability • Web',
    bannerClass: 'banner-punarchakra',
    iconClass: 'fa-recycle',
    title: 'Punarchakra',
    subtitle: 'AI E-Waste Recycling Platform',
    excerpt: 'Smart recycling platform blending AI e-waste classification with gamified rewards for eco-disposal.',
    tags: ['Computer Vision', 'Classification', 'Eco-Tech', 'Web'],
    primaryAction: {
      label: 'Explore Project',
      icon: 'fa-solid fa-arrow-up-right-from-square',
      url: 'https://github.com/SrinjoyeeDey'
    },
    secondaryAction: {
      label: 'GitHub',
      icon: 'fa-brands fa-github',
      url: 'https://github.com/SrinjoyeeDey'
    }
  }
];

function ProjectsSwapApp() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const swapRef = useRef(null);

  // Filter projects based on active filter button
  const filteredProjects = PROJECTS.filter(project => {
    if (activeFilter === 'all') return true;
    return project.category === activeFilter;
  });

  // Fallback to all if category has no projects
  const displayProjects = filteredProjects.length > 0 ? filteredProjects : PROJECTS;

  // Listen to filter buttons from existing HTML header
  useEffect(() => {
    const handleFilterClick = (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      const filter = btn.getAttribute('data-filter');
      if (filter) {
        setActiveFilter(filter);
        setActiveIndex(0);
      }
    };

    const filterGroup = document.getElementById('filter-btn-group');
    if (filterGroup) {
      filterGroup.addEventListener('click', handleFilterClick);
    }
    return () => {
      if (filterGroup) {
        filterGroup.removeEventListener('click', handleFilterClick);
      }
    };
  }, []);

  const handleCardClick = (projectId) => {
    if (window.openProjectModalById) {
      window.openProjectModalById(projectId);
    }
  };

  return (
    <div className="swap-projects-wrapper">
      <div className="swap-stage-container">
        <CardSwap
          ref={swapRef}
          width={500}
          height={520}
          cardDistance={46}
          verticalDistance={48}
          depth={50}
          skewAmount={0}
          visibleCards={6}
          delay={4200}
          autoplay={true}
          pauseOnHover={true}
          draggable={true}
          speed={1.1}
          bounce={0.32}
          parallax={0.45}
          hoverSpread={0.16}
          dim={0.28}
          cardRadius={22}
          sound={true}
          theme="light"
          onCardClick={(index) => {
            const project = displayProjects[index];
            if (project) {
              handleCardClick(project.id);
            }
          }}
          onChange={(newIndex) => setActiveIndex(newIndex % displayProjects.length)}
        >
          {displayProjects.map((project) => (
            <Card
              key={project.id}
              className="swap-project-card"
              onClick={() => handleCardClick(project.id)}
            >
              <div className="swap-card-inner">
                {/* Visual Banner (Top Half) */}
                <div className={`swap-card-banner ${project.bannerClass}`}>
                  <div className="swap-banner-top-row">
                    <span className="swap-category-pill">{project.categoryTag}</span>
                    <span
                      className="swap-open-hint"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(project.id);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      title="View Full Details"
                    >
                      <i className="fa-solid fa-expand"></i> Details
                    </span>
                  </div>

                  <div className="swap-banner-icon-wrap">
                    <div className="swap-banner-icon-circle">
                      <i className={`fa-solid ${project.iconClass}`}></i>
                    </div>
                  </div>
                </div>

                {/* Card Writing & Details (Bottom Half) */}
                <div className="swap-card-body">
                  <div className="swap-card-header">
                    <h3 className="swap-card-title">{project.title}</h3>
                    <span className="swap-card-subtitle">{project.subtitle}</span>
                  </div>

                  <p className="swap-card-excerpt">{project.excerpt}</p>

                  <div className="swap-card-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="swap-tag-pill">{tag}</span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="swap-card-actions">
                    {project.primaryAction && (
                      <a
                        href={project.primaryAction.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="swap-btn-primary"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <span>{project.primaryAction.label}</span>
                        <i className={project.primaryAction.icon}></i>
                      </a>
                    )}
                    {project.secondaryAction && (
                      <a
                        href={project.secondaryAction.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="swap-btn-secondary"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        title={project.secondaryAction.label}
                      >
                        <i className={project.secondaryAction.icon}></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardSwap>
      </div>

      {/* Sleek Interactive Controls Bar */}
      <div className="swap-controls-bar">
        <button
          type="button"
          className="swap-ctrl-btn"
          aria-label="Previous Project"
          onClick={() => swapRef.current?.prev()}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <div className="swap-ctrl-info">
          <span className="swap-ctrl-counter">
            <strong>{activeIndex + 1}</strong> / {displayProjects.length}
          </span>
          <span className="swap-ctrl-hint">
            <i className="fa-solid fa-hand-pointer"></i> Drag or click card to swap • Tap card for modal
          </span>
        </div>

        <button
          type="button"
          className="swap-ctrl-btn"
          aria-label="Next Project"
          onClick={() => swapRef.current?.next()}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

// Mount to DOM
const rootEl = document.getElementById('projects-card-swap-root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<ProjectsSwapApp />);
}
