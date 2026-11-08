import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    visualType: 'vani'
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
    visualType: 'agnivaarak'
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
      url: 'https://github.com/SrinjoyeeDey'
    },
    githubUrl: 'https://github.com/SrinjoyeeDey',
    visualType: 'vault'
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
    theme: 'green',
    solidBg: '#059669', // Completely Green Solid (NOT blackish green!)
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF', // Clean White Accent on Vibrant Green
    accentRgb: '255, 255, 255',
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
    githubUrl: 'https://github.com/SrinjoyeeDey',
    visualType: 'nobodristhi'
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
    visualType: 'gaming'
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
    theme: 'charcoal',
    solidBg: '#16171B', // Dark Charcoal Solid with Grid
    textColor: '#FFFFFF',
    accentColor: '#14B8A6', // Circular Eco Teal
    accentRgb: '20, 184, 166',
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
    visualType: 'ballpit'
  }
];

export default function ProjectsShowcase() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [soundOn, setSoundOn] = useState(false);
  const containerRef = useRef(null);

  const total = SHOWCASE_PROJECTS.length;

  const handleToggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
    if (newState) {
      playSlideSound();
    }
  };

  const handleRowHover = (index) => {
    if (expandedIndex !== index) {
      setExpandedIndex(index);
      playSlideSound();
    }
  };

  const handleRowLeave = () => {
    setExpandedIndex(null);
  };

  const handleRowClick = (index, e) => {
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
      playSlideSound();
    }
  };

  const handleOpenModal = (numericId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setExpandedIndex(prev => (prev === index ? null : index));
      playSlideSound();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % total;
      setExpandedIndex(next);
      playSlideSound();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + total) % total;
      setExpandedIndex(prev);
      playSlideSound();
    }
  };

  return (
    <div
      className="editorial-showcase-wrapper"
      id="projects-showcase-container"
      ref={containerRef}
      onMouseLeave={handleRowLeave}
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
            <div className="editorial-header-line" aria-hidden="true" />
            <span className="editorial-section-tagline">
              Featured Innovations & Interactive Systems
            </span>
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
        {SHOWCASE_PROJECTS.map((project, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <article
              key={project.id}
              className={`editorial-row ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
              data-theme={project.theme}
              style={{
                '--accent-color': project.accentColor,
                '--accent-rgb': project.accentRgb,
                '--row-solid-bg': project.solidBg,
                '--row-text-color': project.textColor
              }}
              onMouseEnter={() => handleRowHover(index)}
              onClick={(e) => handleRowClick(index, e)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={0}
              role="button"
              aria-expanded={isExpanded}
              aria-label={`${project.title} — ${isExpanded ? 'Expanded' : 'Click or hover to expand'}`}
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
                  <h3 className="editorial-row-title">
                    {project.title}
                  </h3>
                  <span className="editorial-row-category-pill">
                    {project.categoryTag}
                  </span>
                </div>

                <div className="editorial-row-right">
                  <button
                    type="button"
                    className="editorial-jump-btn cursor-target"
                    onClick={(e) => handleOpenModal(project.numericId, e)}
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
                        onClick={(e) => handleOpenModal(project.numericId, e)}
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
                  </div>

                  {/* Right Column: Visual Stage / High-Fidelity Mockup */}
                  <div className="editorial-visual-column">
                    <div className="editorial-visual-card">
                      {/* Modern Mockup Header */}
                      <div className="editorial-visual-card-header">
                        <div className="editorial-mockup-dots">
                          <span className="editorial-mockup-dot red" />
                          <span className="editorial-mockup-dot yellow" />
                          <span className="editorial-mockup-dot green" />
                        </div>
                        <span className="editorial-mockup-url">
                          app://{project.title.toLowerCase()}.studio
                        </span>
                        <i className="fa-solid fa-lock" style={{ fontSize: 10, opacity: 0.5 }}></i>
                      </div>

                      {/* Mockup Body Content per Project */}
                      <div className="editorial-visual-card-body">
                        {/* 01: VAni Health OS */}
                        {project.visualType === 'vani' && (
                          <div className="mockup-body-vani">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', color: '#FFC52E' }}>
                                <i className="fa-solid fa-heart-pulse"></i> VANI HEALTH OS
                              </span>
                              <span style={{ fontSize: 11, background: 'rgba(255,197,46,0.15)', color: '#FFC52E', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
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

                        {/* 02: Agnivaarak Autonomous Fire Surveillance */}
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

                        {/* 03: Anchor Grounded Vector Knowledge System */}
                        {project.visualType === 'vault' && (
                          <div className="mockup-body-vault">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                              <span style={{ color: '#D5E859', fontWeight: 700, fontSize: 12 }}>
                                <i className="fa-solid fa-anchor"></i> ANCHOR VECTOR CORE
                              </span>
                              <span style={{ fontSize: 11, background: 'rgba(213,232,89,0.15)', color: '#D5E859', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                                GROUNDED
                              </span>
                            </div>

                            <div className="vault-locked-state">
                              <div className="vault-blur-lines">
                                <span className="vault-blur-line" style={{ width: '85%' }} />
                                <span className="vault-blur-line accent" style={{ background: '#D5E859' }} />
                                <span className="vault-blur-line" style={{ width: '60%' }} />
                                <span className="vault-blur-line" style={{ width: '92%' }} />
                              </div>

                              <div className="vault-lock-icon-wrap" style={{ background: '#D5E859', color: '#16171B' }}>
                                <i className="fa-solid fa-database"></i>
                              </div>
                            </div>

                            <div className="vault-footer-text" style={{ color: '#D5E859' }}>
                              <i className="fa-solid fa-circle-check"></i> pgvector semantic similarity stream active
                            </div>
                          </div>
                        )}

                        {/* 04: Nobodristhi Intelligence Verifier (Completely Green Theme) */}
                        {project.visualType === 'nobodristhi' && (
                          <div className="mockup-body-vault" style={{ background: '#064E3B' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                              <span style={{ color: '#A7F3D0', fontWeight: 700, fontSize: 12 }}>
                                <i className="fa-solid fa-newspaper"></i> NOBODRISTHI VERIFIER
                              </span>
                              <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                                ACTIVE
                              </span>
                            </div>

                            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)' }}>
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>CLUSTERING ALGORITHM</div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 10 }}>Haversine Geospatial Radius Analysis</div>
                              <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: '78%', height: '100%', background: '#34D399', borderRadius: 3 }}></div>
                              </div>
                            </div>

                            <div className="vault-footer-text" style={{ color: '#A7F3D0' }}>
                              <i className="fa-solid fa-circle-check"></i> 100% verified news pipeline operational
                            </div>
                          </div>
                        )}

                        {/* 05: NexVyapaar Retail POS */}
                        {project.visualType === 'gaming' && (
                          <div className="mockup-body-gaming">
                            <span className="gaming-hero-sub" style={{ color: '#6366F1' }}>OFFLINE BUSINESS COPILOT</span>
                            <h4 className="gaming-hero-title">NexVyapaar POS</h4>
                            <p style={{ fontSize: 12, color: '#475569', maxWidth: 360, lineHeight: 1.5 }}>
                              Intelligent inventory prediction, batch expiry tracking and government pharmaceutical compliance.
                            </p>

                            <div className="gaming-btn-pill-row">
                              <span className="gaming-btn-pill" style={{ background: '#6366F1', color: '#fff' }}>Inventory Smart Sync</span>
                              <span className="gaming-btn-pill outlined" style={{ borderColor: 'rgba(0,0,0,0.15)', color: '#1E293B' }}>Drug Ban Filter</span>
                            </div>
                          </div>
                        )}

                        {/* 06: Punarchakra Circular Engine */}
                        {project.visualType === 'ballpit' && (
                          <div className="mockup-body-vault">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                              <span style={{ color: '#14B8A6', fontWeight: 700, fontSize: 12, letterSpacing: '0.04em' }}>
                                <i className="fa-solid fa-recycle"></i> PUNARCHAKRA CIRCULAR ENGINE
                              </span>
                              <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(20,184,166,0.15)', color: '#14B8A6', padding: '3px 8px', borderRadius: 4, letterSpacing: '0.05em' }}>
                                ECO VERIFIED
                              </span>
                            </div>

                            <div className="vault-locked-state" style={{ margin: '14px 0' }}>
                              <div style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 600 }}>AI E-WASTE CLASSIFICATION</div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 10 }}>Automated Material Recognition: 99.4%</div>
                                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                                  <div style={{ width: '94%', height: '100%', background: '#14B8A6', borderRadius: 3 }}></div>
                                </div>
                              </div>

                              <div className="vault-lock-icon-wrap" style={{ background: '#14B8A6', color: '#FFFFFF', boxShadow: '0 12px 30px rgba(20, 184, 166, 0.35)' }}>
                                <i className="fa-solid fa-recycle"></i>
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
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
