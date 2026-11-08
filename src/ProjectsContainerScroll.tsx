"use client";
import React, { useState } from 'react';
import { ContainerScroll } from '../components/ui/container-scroll-animation';
import './ProjectsContainerScroll.css';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  award?: string;
  narrative: string;
  metrics: { label: string; desc: string }[];
  techStack: string[];
  liveUrl?: string;
  githubUrl: string;
  previewType: 'vani' | 'agnivaarak' | 'anchor' | 'nobodristhi' | 'nexvyapaar' | 'punarchakra';
}

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'VAni',
    subtitle: 'Your AI-Powered Recovery Companion',
    category: 'AI • Healthcare • Mobile',
    award: '🏆 Smart India Hackathon Grand Finale Winner',
    narrative: 'Multilingual voice-first platform bridging the gap between hospital discharge and recovery at home. Empowers patients with multi-dialect speech navigation while syncing caregiver vitals and automated prescription scanning.',
    metrics: [
      { label: 'Voice-First Navigation', desc: 'Real-time multi-dialect speech recognition & emergency SOS trigger' },
      { label: 'Caregiver Vitals Sync', desc: 'Prescription scanner with automated caregiver notification ledger' }
    ],
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Groq', 'Gemini'],
    liveUrl: 'https://vani-bice.vercel.app/',
    githubUrl: 'https://github.com/SrinjoyeeDey/VAni',
    previewType: 'vani'
  },
  {
    id: '2',
    title: 'Agnivaarak',
    subtitle: 'Autonomous Fire Detection & Targeted Suppression',
    category: 'Edge AI • Computer Vision • Robotics',
    narrative: 'Intelligent edge-AI robotics system for continuous fire surveillance, temporal flicker flame validation, and automated multi-nozzle suppression with dynamic human safety zones.',
    metrics: [
      { label: '360° Vision Radar', desc: 'Continuous YOLOv8 camera tracking with thermal sensor fusion' },
      { label: 'Targeted Suppression', desc: 'Automated multi-nozzle chemical delivery with safe-zone protection' }
    ],
    techStack: ['Python', 'YOLOv8', 'FastAPI', 'Arduino', 'MQTT', 'OpenCV'],
    githubUrl: 'https://github.com/SrinjoyeeDey/Agnivaarak',
    previewType: 'agnivaarak'
  },
  {
    id: '3',
    title: 'Anchor',
    subtitle: 'Grounded AI Knowledge & Vector Retrieval System',
    category: 'Generative AI • RAG • Vector DB',
    narrative: 'Full-stack Retrieval-Augmented Generation architecture designed to generate answers rigorously grounded in uploaded documentation. Uses pgvector semantic embeddings and multi-step LangGraph orchestration with anti-hallucination guardrails.',
    metrics: [
      { label: 'Vector RAG Engine', desc: 'Semantic document chunking & similarity search with pgvector' },
      { label: 'LangGraph Pipeline', desc: 'Multi-step reasoning pipeline with strict anti-hallucination shield' }
    ],
    techStack: ['React 19', 'FastAPI', 'LangGraph', 'pgvector', 'PostgreSQL', 'Llama 3.3'],
    githubUrl: 'https://github.com/SrinjoyeeDey',
    previewType: 'anchor'
  },
  {
    id: '4',
    title: 'Nobodristhi',
    subtitle: 'AI-Powered News Verification Pipeline',
    category: 'AI/ML • News Verification • Backend',
    narrative: 'News verification pipeline transforming raw citizen reports into verified intelligence. Integrates geospatial Haversine clustering, LLM semantic event deduplication, and reverse-image search verification.',
    metrics: [
      { label: 'Geospatial Radar', desc: 'Haversine event clustering across geographic radiuses' },
      { label: 'Dual Verification', desc: 'Reverse-image search paired with moderation ledger queue' }
    ],
    techStack: ['Python / Flask', 'PostgreSQL', 'SerpAPI', 'OpenRouter', 'Haversine ML'],
    liveUrl: 'https://drive.google.com/file/d/1G6v34ZHr6KDTvnT2ezIzofBHMVTiMkUc/view?usp=drivesdk',
    githubUrl: 'https://github.com/SrinjoyeeDey',
    previewType: 'nobodristhi'
  },
  {
    id: '5',
    title: 'NexVyapaar',
    subtitle: 'Offline-First Intelligent Retail Copilot',
    category: 'Product • Retail AI • POS',
    narrative: 'Offline-first intelligent POS and business copilot built around the core philosophy: "AI advises. Owner decides." Transforms local sales and inventory into actionable restock suggestions and pharmacy ban-list validation.',
    metrics: [
      { label: 'Zero-Downtime POS', desc: 'Uninterrupted local checkout continuity with IndexedDB sync' },
      { label: 'Banned Drug Alert', desc: 'Automated CSV regulatory checks to prevent illegal sales' }
    ],
    techStack: ['React', 'TypeScript', 'Tailwind', 'IndexedDB', 'Framer Motion', 'Vite'],
    githubUrl: 'https://github.com/SrinjoyeeDey/NexVyapaar',
    previewType: 'nexvyapaar'
  },
  {
    id: '6',
    title: 'Punarchakra',
    subtitle: 'AI-Powered Circular E-Waste Recycling Platform',
    category: 'Sustainability • Computer Vision • Web3',
    narrative: 'Smart circular-economy platform focused on making e-waste recycling intuitive and rewarding. Couples AI-assisted e-waste classification with a gamified reward ecosystem, turning electronics into recognized recyclable resources.',
    metrics: [
      { label: 'Computer Vision Scan', desc: 'Vision models identifying and categorizing consumer e-waste' },
      { label: 'Eco Rewards Loop', desc: 'Gamified incentive experience driving sustainable recycling habits' }
    ],
    techStack: ['Computer Vision', 'Web Platform', 'Eco-Tech', 'Reward System'],
    liveUrl: 'https://punarchakra.vercel.app/',
    githubUrl: 'https://github.com/SrinjoyeeDey/Punarchakra',
    previewType: 'punarchakra'
  }
];

export default function ProjectsContainerScroll() {
  const [activeIdx, setActiveIdx] = useState(0);
  const project = PROJECTS[activeIdx];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : PROJECTS.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev < PROJECTS.length - 1 ? prev + 1 : 0));
  };

  const titleComponent = (
    <div className="container-scroll-header-wrap">
      <div className="container-scroll-pill">
        <span>✦ 02 // SELECTED ARCHITECTURES & SYSTEMS ✦</span>
      </div>
      <h2 className="container-scroll-title">
        ENGINEERED WORKS<span className="accent-dot">.</span>
      </h2>
      <p className="container-scroll-sub">
        A curated collection of intelligent robotics, healthcare copilots, and grounded AI knowledge architectures.
      </p>

      {/* Interactive Tabs to switch projects */}
      <div className="container-scroll-tabs-dock" role="tablist">
        {PROJECTS.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={idx === activeIdx}
            className={`container-scroll-tab-btn cursor-target ${idx === activeIdx ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIdx(idx);
            }}
            data-cursor-label={p.title}
          >
            <span>{p.title}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container-scroll-section-wrap">
      <ContainerScroll
        titleComponent={titleComponent}
        cardClassName="max-w-6xl -mt-12 mx-auto min-h-[38rem] md:h-[46rem] w-full border-2 border-white/10 p-2 md:p-4 bg-[#141418] rounded-[28px] shadow-2xl"
      >
        <div className="scroll-card-console">
          {/* Top macOS Style Bar */}
          <div className="scroll-card-top-bar">
            <div className="mac-traffic-dots">
              <span className="mac-dot close"></span>
              <span className="mac-dot min"></span>
              <span className="mac-dot max"></span>
            </div>
            <div className="console-meta-tag">
              ARCHIVE // 0{activeIdx + 1} — {project.title.toUpperCase()}
            </div>
            <div className="console-status-pill">
              <span className="status-glow-dot"></span>
              <span>LIVE SYSTEM</span>
            </div>
          </div>

          {/* Card Body Split Grid */}
          <div className="scroll-card-body-grid">
            {/* Left Narrative Column */}
            <div className="console-col-left">
              <div>
                <div className="console-category-tag">
                  <i className="fa-solid fa-code-branch"></i>
                  <span>{project.category}</span>
                </div>
                {project.award && (
                  <div style={{ fontSize: '0.76rem', color: '#f59e0b', fontWeight: 600, marginTop: '4px' }}>
                    {project.award}
                  </div>
                )}
                <h3 className="console-project-title">{project.title}</h3>
                <div className="console-project-subtitle">{project.subtitle}</div>
                <p className="console-project-desc">{project.narrative}</p>

                {/* Metrics */}
                <div className="console-metrics-row">
                  {project.metrics.map((m, i) => (
                    <div key={i} className="console-metric-card">
                      <div className="console-metric-val">
                        <i className="fa-solid fa-bolt"></i> {m.label}
                      </div>
                      <div className="console-metric-desc">{m.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Tech Chips */}
                <div className="console-tech-chips">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="console-tech-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="console-actions-row">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="console-btn-primary cursor-target"
                    data-cursor-label="Launch"
                  >
                    <span>Explore Live</span>
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="console-btn-secondary cursor-target"
                    data-cursor-label="GitHub"
                  >
                    <i className="fa-brands fa-github"></i>
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Visual Dashboard Preview Column */}
            <div className="console-col-right">
              <div className="console-preview-screen">
                {project.previewType === 'vani' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="sim-metric-badge">
                        <i className="fa-solid fa-heart-pulse" style={{ color: '#ef4444' }}></i> PATIENT VITALS
                      </span>
                      <span className="sim-metric-badge" style={{ color: '#10b981' }}>
                        ● 98.4% RECOVERY
                      </span>
                    </div>

                    <div style={{ margin: '16px 0', textAlign: 'center' }}>
                      <svg className="ecg-waveform-svg" viewBox="0 0 400 80">
                        <path d="M0,40 L60,40 L70,10 L80,70 L90,30 L100,50 L110,40 L220,40 L230,15 L240,65 L250,25 L260,50 L270,40 L400,40" />
                      </svg>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
                        MULTI-DIALECT SPEECH SYNTHESIS ENGINE
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div className="console-metric-card">
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>LANGUAGES</div>
                        <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>Bengali, Hindi, English</div>
                      </div>
                      <div className="console-metric-card">
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>PRESCRIPTION AI</div>
                        <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>OCR Validated</div>
                      </div>
                    </div>
                  </>
                )}

                {project.previewType === 'agnivaarak' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="sim-metric-badge" style={{ color: '#f97316' }}>
                        <i className="fa-solid fa-fire"></i> FLAME TRACKER
                      </span>
                      <span className="sim-metric-badge">
                        YOLOv8 CONFIDENCE: 98.6%
                      </span>
                    </div>

                    <div className="radar-sweep-circle">
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f97316', boxShadow: '0 0 10px #f97316' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div className="console-metric-card">
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>VALVE ACTUATION</div>
                        <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>Nozzle Array Armed</div>
                      </div>
                      <div className="console-metric-card">
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>THERMAL CAMERA</div>
                        <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600 }}>Sensor Fusion OK</div>
                      </div>
                    </div>
                  </>
                )}

                {project.previewType === 'anchor' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="sim-metric-badge" style={{ color: '#a855f7' }}>
                        <i className="fa-solid fa-network-wired"></i> VECTOR RAG PIPELINE
                      </span>
                      <span className="sim-metric-badge">
                        pgvector 1536-DIM
                      </span>
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>LANGGRAPH AGENT FLOW</div>
                      <div style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600, marginBottom: '8px' }}>Grounded Semantic Verification</div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: '92%', height: '100%', background: '#a855f7', borderRadius: 3 }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div className="console-metric-card">
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>RETRIEVAL LATENCY</div>
                        <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>38ms p95</div>
                      </div>
                      <div className="console-metric-card">
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>ACCURACY SCORE</div>
                        <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>99.1% Grounded</div>
                      </div>
                    </div>
                  </>
                )}

                {project.previewType === 'nobodristhi' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="sim-metric-badge" style={{ color: '#10b981' }}>
                        <i className="fa-solid fa-newspaper"></i> NEWS VERIFIER
                      </span>
                      <span className="sim-metric-badge">
                        GEOSPATIAL RADAR
                      </span>
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>HAVERSINE CLUSTERING</div>
                      <div style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600, marginBottom: '8px' }}>Geospatial Event Deduplication</div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: '85%', height: '100%', background: '#10b981', borderRadius: 3 }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div className="console-metric-card">
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>REVERSE SEARCH</div>
                        <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>SerpAPI Linked</div>
                      </div>
                      <div className="console-metric-card">
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>AUDIT LEDGER</div>
                        <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>Tamper-proof</div>
                      </div>
                    </div>
                  </>
                )}

                {project.previewType === 'nexvyapaar' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="sim-metric-badge" style={{ color: '#6366f1' }}>
                        <i className="fa-solid fa-cash-register"></i> OFFLINE POS
                      </span>
                      <span className="sim-metric-badge">
                        ZERO DOWNTIME
                      </span>
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>INVENTORY FORECASTING</div>
                      <div style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600, marginBottom: '8px' }}>Expiry Risk & Smart Restock Alert</div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: '78%', height: '100%', background: '#6366f1', borderRadius: 3 }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div className="console-metric-card">
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>LOCAL STORAGE</div>
                        <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>IndexedDB Synced</div>
                      </div>
                      <div className="console-metric-card">
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>DRUG REGULATION</div>
                        <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600 }}>Filter Active</div>
                      </div>
                    </div>
                  </>
                )}

                {project.previewType === 'punarchakra' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="sim-metric-badge" style={{ color: '#14b8a6' }}>
                        <i className="fa-solid fa-recycle"></i> CIRCULAR ENGINE
                      </span>
                      <span className="sim-metric-badge">
                        AI CLASSIFIER
                      </span>
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>MATERIAL RECOGNITION</div>
                      <div style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600, marginBottom: '8px' }}>Automated Consumer E-Waste Sorting</div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: '96%', height: '100%', background: '#14b8a6', borderRadius: 3 }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div className="console-metric-card">
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>SORTING ACCURACY</div>
                        <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>99.2%</div>
                      </div>
                      <div className="console-metric-card">
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>REWARD CREDITS</div>
                        <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>Instant Ledger</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Nav Bar */}
          <div className="console-bottom-nav-bar">
            <div className="console-nav-counter">
              PROJECT 0{activeIdx + 1} / 0{PROJECTS.length}
            </div>

            <div className="console-arrow-btns">
              <button
                type="button"
                className="console-arrow-btn cursor-target"
                onClick={handlePrev}
                aria-label="Previous Project"
                data-cursor-label="Prev"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                type="button"
                className="console-arrow-btn cursor-target"
                onClick={handleNext}
                aria-label="Next Project"
                data-cursor-label="Next"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
