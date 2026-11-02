import React, { useState, useEffect, useRef, useCallback } from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { isSoundEnabled, setSoundEnabled, playSlideSound } from './tactileSound';
import './ProjectsShowcase.css';

const SHOWCASE_PROJECTS = [
  {
    id: '1',
    numericId: '1',
    title: 'VAni',
    subtitle: 'Your AI-Powered Recovery Companion',
    categoryTag: 'AI • Healthcare • Mobile',
    theme: 'ivory',
    accentColor: '#FFC52E',
    narrative: 'VAni bridges the difficult gap between hospital discharge and recovery at home. A multilingual voice-first platform guiding post-hospital recovery while keeping caregivers in sync with smart prescription scanning and emergency SOS workflows.',
    metrics: [
      { stat: 'Voice-First', desc: 'Real-time multi-dialect speech navigation & emergency trigger' },
      { stat: 'Care Sync', desc: 'Prescription scanner with automated caregiver vitals sync' }
    ],
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Groq', 'Gemini'],
    primaryAction: {
      label: 'View details',
      isModal: true
    },
    secondaryAction: {
      label: 'Download APK',
      icon: 'fa-solid fa-download',
      url: 'https://github.com/SrinjoyeeDey/VAni/releases/download/v1.0.0/VAni.apk'
    },
    liveUrl: 'https://vani-bice.vercel.app/',
    githubUrl: 'https://github.com/SrinjoyeeDey/VAni',
    visualType: 'vani'
  },
  {
    id: '2',
    numericId: '2',
    title: 'Agnivaarak',
    subtitle: 'Autonomous Fire Detection & Suppression',
    categoryTag: 'AI/ML • Computer Vision • Fire Safety',
    theme: 'charcoal',
    accentColor: '#FF7A00',
    narrative: 'An intelligent edge-AI and robotics system for real-time fire detection, temporal flicker analysis, and targeted multi-nozzle chemical suppression. Validates flames with sensor fusion while maintaining safety exclusion zones for occupants.',
    metrics: [
      { stat: '360° Vision', desc: 'Continuous YOLOv8 camera tracking with thermal sensor fusion' },
      { stat: 'Targeted Spray', desc: 'Automated multi-nozzle suppression with safe-zone protection' }
    ],
    techStack: ['Python', 'YOLOv8', 'FastAPI', 'Arduino', 'MQTT', 'OpenCV'],
    primaryAction: {
      label: 'View details',
      isModal: true
    },
    secondaryAction: {
      label: 'Explore Project',
      icon: 'fa-solid fa-arrow-up-right-from-square',
      url: 'https://github.com/SrinjoyeeDey/Agnivaarak'
    },
    githubUrl: 'https://github.com/SrinjoyeeDey/Agnivaarak',
    visualType: 'agnivaarak'
  },
  {
    id: '3',
    numericId: '3',
    title: 'Anchor',
    subtitle: 'Grounded AI Knowledge System',
    categoryTag: 'AI/ML • Generative AI • RAG',
    theme: 'lime',
    accentColor: '#1A1C1E',
    narrative: 'A full-stack Retrieval-Augmented Generation architecture designed to generate answers rigorously grounded in uploaded documentation. Uses pgvector semantic embeddings and multi-step LangGraph orchestration with Llama 3.3 and Gemini fallbacks.',
    metrics: [
      { stat: 'Vector RAG', desc: 'Semantic document chunking & similarity search with pgvector' },
      { stat: 'LangGraph', desc: 'Multi-step reasoning pipeline with strict anti-hallucination' }
    ],
    techStack: ['React 19', 'FastAPI', 'LangGraph', 'pgvector', 'PostgreSQL', 'Llama 3.3'],
    primaryAction: {
      label: 'View details',
      isModal: true
    },
    secondaryAction: {
      label: 'Explore Project',
      icon: 'fa-solid fa-arrow-up-right-from-square',
      url: 'https://github.com/SrinjoyeeDey'
    },
    githubUrl: 'https://github.com/SrinjoyeeDey',
    visualType: 'vault'
  },
  {
    id: '4',
    numericId: '4',
    title: 'Nobodristhi',
    subtitle: 'AI-Powered News Verification System',
    categoryTag: 'AI/ML • News Verification • Backend',
    theme: 'slate',
    accentColor: '#10B981',
    narrative: 'A news verification backend pipeline transforming raw community reports into verified intelligence. Integrates geospatial Haversine clustering, LLM semantic event deduplication, reverse-image search, and an administrative moderation ledger.',
    metrics: [
      { stat: 'Geospatial Radar', desc: 'Haversine event clustering across geographic radiuses' },
      { stat: 'Dual Verification', desc: 'Reverse-image search paired with moderation queue' }
    ],
    techStack: ['Python / Flask', 'PostgreSQL', 'SerpAPI', 'OpenRouter', 'Haversine ML'],
    primaryAction: {
      label: 'View details',
      isModal: true
    },
    secondaryAction: {
      label: 'Watch Preview',
      icon: 'fa-solid fa-play',
      url: 'https://drive.google.com/file/d/1G6v34ZHr6KDTvnT2ezIzofBHMVTiMkUc/view?usp=drivesdk'
    },
    githubUrl: 'https://github.com/SrinjoyeeDey',
    visualType: 'nobodristhi'
  },
  {
    id: '5',
    numericId: '5',
    title: 'NexVyapaar',
    subtitle: 'AI Business Assistant for Local Businesses',
    categoryTag: 'AI/ML • Product • POS',
    theme: 'sand',
    accentColor: '#6366F1',
    narrative: 'Offline-first intelligent POS and business copilot built around the core philosophy: “AI advises. Owner decides.” Transforms sales and inventory data into actionable restock suggestions, expiry risk warnings, and pharmacy ban-list validation.',
    metrics: [
      { stat: 'Offline-First', desc: 'Uninterrupted local checkout continuity with IndexedDB sync' },
      { stat: 'Banned Drug Alert', desc: 'Automated CSV regulatory checks to prevent banned sales' }
    ],
    techStack: ['React', 'TypeScript', 'Tailwind', 'IndexedDB', 'Framer Motion', 'Vite'],
    primaryAction: {
      label: 'View details',
      isModal: true
    },
    secondaryAction: {
      label: 'Watch Preview',
      icon: 'fa-solid fa-play',
      url: 'https://github.com/SrinjoyeeDey/NexVyapaar'
    },
    githubUrl: 'https://github.com/SrinjoyeeDey/NexVyapaar',
    visualType: 'gaming'
  },
  {
    id: '6',
    numericId: '6',
    title: 'Punarchakra',
    subtitle: 'AI-Powered E-Waste Recycling Platform',
    categoryTag: 'AI/ML • Sustainability • Web',
    theme: 'charcoal',
    accentColor: '#14B8A6',
    narrative: 'Smart circular-economy platform focused on making e-waste recycling intuitive and engaging. Couples AI-assisted e-waste classification with a gamified reward ecosystem, turning discarded electronics into recognized recyclable resources.',
    metrics: [
      { stat: 'AI Classifier', desc: 'Vision models identifying and categorizing consumer e-waste' },
      { stat: 'Eco Rewards', desc: 'Gamified incentive experience driving sustainable recycling' }
    ],
    techStack: ['Computer Vision', 'Web Platform', 'Eco-Tech', 'Reward System'],
    primaryAction: {
      label: 'View details',
      isModal: true
    },
    secondaryAction: {
      label: 'Visit Website',
      icon: 'fa-solid fa-arrow-up-right-from-square',
      url: 'https://punarchakra.vercel.app/'
    },
    githubUrl: 'https://github.com/SrinjoyeeDey/Punarchakra',
    visualType: 'ballpit'
  }
];

export default function ProjectsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const containerRef = useRef(null);
  const stackRef = useRef(null);

  const total = SHOWCASE_PROJECTS.length;

  const handleIndexChange = useCallback((idx) => {
    setActiveIndex(idx);
    playSlideSound();
  }, []);

  // Navigate to slide index
  const goToSlide = useCallback((index, triggerSound = true) => {
    if (index < 0 || index >= total) return;
    setActiveIndex(index);
    stackRef.current?.scrollToIndex(index);
    if (triggerSound) {
      playSlideSound();
    }
  }, [total]);

  const handlePrev = () => {
    setActiveIndex(prev => {
      if (prev <= 0) return 0;
      const next = prev - 1;
      stackRef.current?.scrollToIndex(next);
      playSlideSound();
      return next;
    });
  };

  const handleNext = () => {
    setActiveIndex(prev => {
      if (prev >= total - 1) return prev;
      const next = prev + 1;
      stackRef.current?.scrollToIndex(next);
      playSlideSound();
      return next;
    });
  };

  // Toggle Sound with visual state and Web Audio activation
  const handleToggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
    if (newState) {
      playSlideSound();
    }
  };

  const handleOpenModal = (numericId) => {
    if (typeof window.openProjectModalById === 'function') {
      window.openProjectModalById(numericId);
    } else {
      const modal = document.getElementById('project-modal');
      if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
      }
    }
  };

  // Keyboard navigation when projects container is actively visible and focused
  useEffect(() => {
    const handleKeyDown = (e) => {
      const container = containerRef.current;
      if (!container) return;

      // Do NOT intercept if user is interacting with another section/widget (e.g. Memory Wall, Mimo, etc.)
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.closest?.('#memory-wall') || activeEl.closest?.('.circular-carousel') || activeEl.closest?.('#mimo-chatbot-container') || activeEl.closest?.('.modal-overlay'))) {
        return;
      }

      const rect = container.getBoundingClientRect();
      // Only react if Projects container is dominant in the viewport (at least 75% visible)
      const isDominant = rect.top <= 80 && rect.bottom >= window.innerHeight * 0.75;
      if (isDominant) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          if (activeIndex < total - 1) {
            e.preventDefault();
            goToSlide(activeIndex + 1);
          }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          if (activeIndex > 0) {
            e.preventDefault();
            goToSlide(activeIndex - 1);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, goToSlide, total]);

  const progressPercent = ((activeIndex + 1) / total) * 100;

  return (
    <div
      className="showcase-master-viewport"
      id="projects-showcase-container"
      ref={containerRef}
    >
      {/* Top Section Header Bar: Section Brand Title (Left) & Audio Controls (Right) */}
      <header className="showcase-top-header" aria-label="Projects Section Header">
        <div className="showcase-header-left">
          <div className="showcase-section-pill">
            <span className="showcase-pill-dot" />
            <i className="fa-solid fa-layer-group" style={{ fontSize: '11px', color: '#FFC52E' }} />
            <span className="showcase-pill-label">SELECTED WORKS</span>
            <span className="showcase-pill-divider">/</span>
            <span className="showcase-pill-count">06 PROJECTS</span>
          </div>

          <div className="showcase-header-title-row">
            <h2 className="showcase-section-title">
              PROJECTS<span className="showcase-yellow-dot">.</span>
            </h2>
            <div className="showcase-header-line" aria-hidden="true" />
            <span className="showcase-section-tagline">
              Featured Innovations & Interactive Systems
            </span>
          </div>
        </div>

        <div className="showcase-header-right">
          <button
            type="button"
            className={`showcase-sound-toggle-btn cursor-target ${soundOn ? 'sound-active' : ''}`}
            onClick={handleToggleSound}
            data-cursor-label={soundOn ? 'Mute' : 'Audio'}
            aria-label={soundOn ? 'Disable Sound Effect' : 'Enable Sound Effect'}
          >
            <i className={`fa-solid ${soundOn ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
            <span>{soundOn ? 'Sound: ON' : 'Sound: OFF'}</span>
          </button>
        </div>
      </header>

      {/* GSAP ScrollTrigger + Lenis: Vertical stacking card experience */}
      <ScrollStack
        ref={stackRef}
        className="projects-scroll-stack"
        onIndexChange={handleIndexChange}
      >
        {SHOWCASE_PROJECTS.map((project, index) => {
          const displayIdx = String(index + 1).padStart(2, '0');
          const totalStr = String(total).padStart(2, '0');

          return (
            <ScrollStackItem
              key={project.id}
              itemClassName="showcase-slide"
              data-theme={project.theme}
              aria-label={`${project.title} Project Showcase`}
            >
              {/* Subtle Ambient Blueprint Grid */}
              <div className="showcase-slide-bg-grid" aria-hidden="true" />

              {/* Atmospheric Ambient Glow */}
              <div
                className="showcase-slide-ambient-glow"
                style={{ backgroundColor: project.accentColor }}
                aria-hidden="true"
              />

              {/* Editorial 2-Column Content Layout */}
              <div className="showcase-slide-inner">
                {/* Content Column (Left Side) */}
                <div className="showcase-content-column">
                  {/* Meta: Category & Counter */}
                  <div className="showcase-meta-header">
                    <span className="showcase-category-badge">{project.categoryTag}</span>
                    <span className="showcase-project-counter-tag">
                      {displayIdx} / {totalStr}
                    </span>
                  </div>

                  {/* Expressive Title */}
                  <h3 className="showcase-project-title">
                    <span>{project.title}</span>
                    <span className="showcase-title-dot">.</span>
                  </h3>

                  {/* Punchy Subtitle */}
                  <h4 className="showcase-project-subtitle">
                    {project.subtitle}
                  </h4>

                  {/* Original Narrative Description */}
                  <p className="showcase-project-narrative">
                    {project.narrative}
                  </p>

                  {/* Two Prominent Metric Callout Cards */}
                  <div className="showcase-metrics-row">
                    {project.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="showcase-metric-box">
                        <span className="showcase-metric-stat">{m.stat}</span>
                        <span className="showcase-metric-desc">{m.desc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technologies Stack Pills */}
                  <div className="showcase-tech-stack">
                    {project.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="showcase-tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="showcase-action-group">
                    {/* Primary Button: View details */}
                    <button
                      type="button"
                      className="showcase-btn-primary cursor-target"
                      onClick={() => handleOpenModal(project.numericId)}
                      data-cursor-label="Details"
                    >
                      <span>View details</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>

                    {/* Secondary Action: APK, Preview or Explore */}
                    {project.secondaryAction && (
                      <a
                        href={project.secondaryAction.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="showcase-btn-secondary cursor-target"
                        data-cursor-label="Open"
                      >
                        {project.secondaryAction.icon && (
                          <i className={project.secondaryAction.icon}></i>
                        )}
                        <span>{project.secondaryAction.label}</span>
                      </a>
                    )}

                    {/* Live Website Link */}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="showcase-btn-icon-link cursor-target"
                        title="Open Live Website"
                        data-cursor-label="Live"
                      >
                        <i className="fa-solid fa-globe"></i>
                      </a>
                    )}

                    {/* GitHub Repository Link */}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="showcase-btn-icon-link cursor-target"
                        title="View GitHub Repository"
                        data-cursor-label="GitHub"
                      >
                        <i className="fa-brands fa-github"></i>
                      </a>
                    )}
                  </div>
                </div>

                {/* Visual Column (Right Side - High-End Mockup Stage) */}
                <div className="showcase-visual-column">
                  <div className="showcase-mockup-frame">
                    {/* Mockup Header */}
                    <div className="showcase-mockup-header">
                      <div className="showcase-mockup-dots">
                        <span className="showcase-mockup-dot" />
                        <span className="showcase-mockup-dot" />
                        <span className="showcase-mockup-dot" />
                      </div>
                      <span className="showcase-mockup-url">
                        app://{project.title.toLowerCase()}.studio
                      </span>
                      <i className="fa-solid fa-lock" style={{ fontSize: 10, opacity: 0.5 }}></i>
                    </div>

                    {/* Visual Body per Project */}
                    <div className="showcase-mockup-body">
                      {/* VAni Health Waveform & Status */}
                      {project.visualType === 'vani' && (
                        <div className="mockup-body-vani">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', color: '#FFC52E' }}>
                              <i className="fa-solid fa-heart-pulse"></i> VANI HEALTH OS
                            </span>
                            <span style={{ fontSize: 11, background: 'rgba(255,197,46,0.15)', color: '#FFC52E', padding: '3px 8px', borderRadius: 4 }}>
                              ONLINE
                            </span>
                          </div>

                          <div className="vani-wave-box">
                            <span className="vani-wave-bar" />
                            <span className="vani-wave-bar" />
                            <span className="vani-wave-bar" />
                            <span className="vani-wave-bar" />
                            <span className="vani-wave-bar" />
                            <span className="vani-wave-bar" />
                          </div>

                          <div className="vani-status-card">
                            <div className="vani-status-tag">
                              <span className="vani-pulse-circle" />
                              <span>Continuous Patient Vitals Sync Active</span>
                            </div>
                            <i className="fa-solid fa-shield-halved" style={{ color: '#10B981' }}></i>
                          </div>
                        </div>
                      )}

                      {/* Agnivaarak Autonomous Fire Surveillance */}
                      {project.visualType === 'agnivaarak' && (
                        <div className="mockup-body-agnivaarak">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#FF7A00', fontWeight: 'bold', fontSize: 12 }}>
                              <i className="fa-solid fa-fire-flame-curved"></i> SECTOR SURVEILLANCE
                            </span>
                            <span className="fire-target-badge">MONITORING 360°</span>
                          </div>

                          <div className="fire-radar-grid">
                            <div className="fire-target-reticle" />
                            <div style={{ textAlign: 'center', zIndex: 2 }}>
                              <div style={{ fontSize: 11, color: '#FF9E42', marginBottom: 4 }}>YOLOv8 EDGE INFERENCE</div>
                              <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>0 FLAMES DETECTED</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                            <span>THERMAL SENSOR: 24.2°C</span>
                            <span>NOZZLE STATUS: STANDBY</span>
                          </div>
                        </div>
                      )}

                      {/* Anchor / Sealed Vault */}
                      {project.visualType === 'vault' && (
                        <div className="mockup-body-vault">
                          <div className="vault-prompt-line">The project is sealed.</div>

                          <div className="vault-locked-state">
                            <div className="vault-blur-lines">
                              <span className="vault-blur-line" style={{ width: '85%' }} />
                              <span className="vault-blur-line accent" />
                              <span className="vault-blur-line" style={{ width: '60%' }} />
                              <span className="vault-blur-line" style={{ width: '92%' }} />
                            </div>

                            <div className="vault-lock-icon-wrap">
                              <i className="fa-solid fa-lock"></i>
                            </div>
                          </div>

                          <div className="vault-footer-text">
                            !unlock — grounded vector knowledge case study ready
                          </div>
                        </div>
                      )}

                      {/* Nobodristhi Intelligence Dashboard */}
                      {project.visualType === 'nobodristhi' && (
                        <div className="mockup-body-vault" style={{ background: '#11141a' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <span style={{ color: '#10B981', fontWeight: 700, fontSize: 12 }}>
                              <i className="fa-solid fa-newspaper"></i> NOBODRISTHI VERIFIER
                            </span>
                            <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '3px 8px', borderRadius: 4 }}>
                              ACTIVE
                            </span>
                          </div>

                          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>CLUSTERING ALGORITHM</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 10 }}>Haversine Geospatial Radius Analysis</div>
                            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: '78%', height: '100%', background: '#10B981', borderRadius: 3 }}></div>
                            </div>
                          </div>

                          <div className="vault-footer-text" style={{ color: '#10B981' }}>
                            <i className="fa-solid fa-circle-check"></i> 100% verified news pipeline operational
                          </div>
                        </div>
                      )}

                      {/* NexVyapaar Retail POS */}
                      {project.visualType === 'gaming' && (
                        <div className="mockup-body-gaming">
                          <span className="gaming-hero-sub">OFFLINE BUSINESS COPILOT</span>
                          <h4 className="gaming-hero-title">NexVyapaar POS</h4>
                          <p style={{ fontSize: 12, color: '#555', maxWidth: 360, lineHeight: 1.5 }}>
                            Intelligent inventory prediction, batch expiry tracking and government pharmaceutical compliance.
                          </p>

                          <div className="gaming-btn-pill-row">
                            <span className="gaming-btn-pill">Inventory Smart Sync</span>
                            <span className="gaming-btn-pill outlined">Drug Ban Filter</span>
                          </div>
                        </div>
                      )}

                      {/* Punarchakra Eco-Tech Recycling Platform */}
                      {project.visualType === 'ballpit' && (
                        <div className="mockup-body-vault" style={{ background: '#0d1514' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <span style={{ color: '#14B8A6', fontWeight: 700, fontSize: 12 }}>
                              <i className="fa-solid fa-recycle"></i> PUNARCHAKRA CIRCULAR ENGINE
                            </span>
                            <span style={{ fontSize: 11, background: 'rgba(20,184,166,0.15)', color: '#14B8A6', padding: '3px 8px', borderRadius: 4 }}>
                              ECO VERIFIED
                            </span>
                          </div>

                          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>AI E-WASTE CLASSIFICATION</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 10 }}>Automated Material Recognition: 99.4%</div>
                            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: '94%', height: '100%', background: '#14B8A6', borderRadius: 3 }}></div>
                            </div>
                          </div>

                          <div className="vault-footer-text" style={{ color: '#14B8A6' }}>
                            <i className="fa-solid fa-leaf"></i> Sustainable circular reward lifecycle operational
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          );
        })}
      </ScrollStack>

      {/* Floating Bottom Navigation Rail (Counter & Prev/Next Arrows) */}
      <div className="showcase-bottom-rail">
        {/* Left: Counter & Progress Track */}
        <div className="showcase-rail-left">
          <div className="showcase-rail-counter">
            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
          <div className="showcase-progress-track" aria-hidden="true">
            <div
              className="showcase-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Prev / Next Navigation Controls */}
        <div className="showcase-rail-right">
          <button
            type="button"
            className="showcase-nav-arrow-btn cursor-target"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous Project"
            data-cursor-label="Prev"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button
            type="button"
            className="showcase-nav-arrow-btn cursor-target"
            onClick={handleNext}
            disabled={activeIndex === total - 1}
            aria-label="Next Project"
            data-cursor-label="Next"
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
