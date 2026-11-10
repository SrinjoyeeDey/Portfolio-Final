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
      url: 'https://github.com/SrinjoyeeDey/'
    },
    githubUrl: 'https://github.com/SrinjoyeeDey/',
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
    visualType: 'ballpit'
  }
];


const DASHBOARD_CONFIGS = {
  '1': {
    brandLogo: 'fa-solid fa-heart-pulse',
    brandName: 'VAni Hub',
    systemTitle: 'VAni Health OS',
    season: 'v2.4 • Clinical Release',
    status: 'In Production',
    quote: '"Continuous post-discharge patient care, vitals sync & voice triage."',
    architect: 'Srinjoyee Dey',
    coreTech: 'Groq + Gemini + Whisper',
    targetLaunch: 'Q1 2026',
    synopsis: 'Bridging hospital discharge and home recovery with real-time multilingual voice triage, automated prescription scanning, and instant emergency caregiver dispatch.',
    metrics: [
      { label: 'PATIENTS', val: '1,420+' },
      { label: 'VITALS SYNC', val: '99.8%' },
      { label: 'WORKSPACES', val: '14' },
      { label: 'MODELS', val: '6 Active' }
    ],
    jumpTo: [
      { title: 'Apollo Cardiology', sub: 'Protocol Alpha', color: '#8B5CF6' },
      { title: 'Max Care Triage', sub: 'Emergency Unit', color: '#EC4899' },
      { title: 'Prescription OCR', sub: 'Vision Model v3', color: '#A855F7' },
      { title: 'Vitals Telemetry', sub: 'Live Sensor Stream', color: '#F59E0B' },
      { title: 'Caregiver Voice SOS', sub: 'Multi-Dialect', color: '#F97316' }
    ],
    workspaces: [
      { icon: 'fa-solid fa-notes-medical', color: '#F59E0B', title: 'Post-Discharge Recovery Protocol', sub: 'Clinical • updated 12m ago', badge: 'Active', badgeColor: '#10B981' },
      { icon: 'fa-solid fa-wave-square', color: '#3B82F6', title: 'Bengali Dialect Speech Model', sub: 'Speech • updated 2h ago', badge: 'In Review', badgeColor: '#F59E0B' },
      { icon: 'fa-solid fa-file-prescription', color: '#10B981', title: 'Prescription OCR Parser', sub: 'OCR • updated yesterday', badge: 'Approved', badgeColor: '#3B82F6' }
    ],
    activity: [
      { user: 'Srinjoyee Dey', action: 'committed a revision to Speech Triage v2.4', time: '12m ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60' },
      { user: 'Dr. Aris Thorne', action: 'approved Cardiology discharge checklist', time: '2h ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60' },
      { user: 'Ines Chen', action: 'validated caregiver vitals telemetry stream', time: 'Yesterday', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60' },
      { user: 'Kim Ha-yoon', action: 'benchmarked Groq Llama 3.3 latency (140ms)', time: '3d ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60' }
    ],
    heroBg: 'linear-gradient(135deg, #FDE2D2 0%, #FAD4C0 35%, #F1EFE5 100%)',
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60'
  },
  '2': {
    brandLogo: 'fa-solid fa-fire-flame-curved',
    brandName: 'Agnivaarak AI',
    systemTitle: 'Agnivaarak Vision OS',
    season: 'v3.1 • Autonomous Safety',
    status: 'Field Validated',
    quote: '"Autonomous 360° fire tracking, temporal flicker analysis & safe-zone suppression."',
    architect: 'Srinjoyee Dey',
    coreTech: 'YOLOv8 + OpenCV + FastAPI',
    targetLaunch: 'National Finalist',
    synopsis: 'Edge-computing AI fire suppression system combining 360° continuous camera tracking, thermal sensor fusion, and targeted multi-nozzle spray actuators.',
    metrics: [
      { label: 'SURVEILLANCE', val: '360°' },
      { label: 'FLAME ACCURACY', val: '98.7%' },
      { label: 'SUPPRESSION RT', val: '1.2s' },
      { label: 'SAFE ZONES', val: '100%' }
    ],
    jumpTo: [
      { title: 'Sector 4 Industrial', sub: 'Continuous Scan', color: '#EF4444' },
      { title: 'Chemical Depot Beta', sub: 'High Risk Area', color: '#F97316' },
      { title: 'Nozzle Array Matrix', sub: '8-Bar Actuators', color: '#F59E0B' },
      { title: 'Thermal Telemetry', sub: 'IR Grid v2', color: '#10B981' },
      { title: 'Safe-Zone Validator', sub: 'Occupant Protection', color: '#3B82F6' }
    ],
    workspaces: [
      { icon: 'fa-solid fa-video', color: '#EF4444', title: 'YOLOv8 Edge Quantization Stream', sub: 'Vision • updated 8m ago', badge: 'Active', badgeColor: '#10B981' },
      { icon: 'fa-solid fa-crosshairs', color: '#F59E0B', title: 'Multi-Nozzle Spatial Targeting', sub: 'Hardware • updated 1h ago', badge: 'In Review', badgeColor: '#F59E0B' },
      { icon: 'fa-solid fa-shield-halved', color: '#10B981', title: 'Occupant Exclusion Zone Grid', sub: 'Safety • updated yesterday', badge: 'Verified', badgeColor: '#3B82F6' }
    ],
    activity: [
      { user: 'Srinjoyee Dey', action: 'calibrated thermal flicker threshold (24.2°C)', time: '8m ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60' },
      { user: 'Marcus Vance', action: 'completed actuator pressure test on Nozzle B', time: '1h ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60' },
      { user: 'Elena Rostova', action: 'logged zero false positives over 72h run', time: 'Yesterday', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60' },
      { user: 'David Park', action: 'benchmarked YOLOv8 inference at 42 FPS on edge', time: '2d ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60' }
    ],
    heroBg: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 40%, #1E1B18 100%)',
    heroImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=60'
  },
  '3': {
    brandLogo: 'fa-solid fa-anchor',
    brandName: 'Anchor Hub',
    systemTitle: 'Anchor Knowledge Vault',
    season: 'v1.8 • Grounded Core',
    status: 'Production Core',
    quote: '"Rigorous document grounding with pgvector similarity & LangGraph orchestration."',
    architect: 'Srinjoyee Dey',
    coreTech: 'React 19 + LangGraph + pgvector',
    targetLaunch: 'Active Core',
    synopsis: 'Enterprise-grade RAG architecture eliminating AI hallucinations through strict chunk retrieval, cross-source citation validation, and multi-agent reasoning graphs.',
    metrics: [
      { label: 'DIMENSIONS', val: '1536-dim' },
      { label: 'COSINE SIM', val: '0.942' },
      { label: 'GROUNDEDNESS', val: '99.4%' },
      { label: 'LATENCY', val: '240ms' }
    ],
    jumpTo: [
      { title: 'Enterprise KB Corpus', sub: '4,800 Chunks', color: '#10B981' },
      { title: 'LangGraph Reasoning', sub: 'Router Agent', color: '#84CC16' },
      { title: 'pgvector Index', sub: 'HNSW Optimized', color: '#F59E0B' },
      { title: 'Citation Verifier', sub: 'Strict Anti-Hallucination', color: '#06B6D4' },
      { title: 'Llama 3.3 Fallback', sub: 'High Concurrency', color: '#8B5CF6' }
    ],
    workspaces: [
      { icon: 'fa-solid fa-diagram-project', color: '#84CC16', title: 'LangGraph Multi-Hop Router', sub: 'Graph • updated 15m ago', badge: 'Active', badgeColor: '#10B981' },
      { icon: 'fa-solid fa-database', color: '#06B6D4', title: 'pgvector Semantic Partitioning', sub: 'Vector • updated 3h ago', badge: 'In Review', badgeColor: '#F59E0B' },
      { icon: 'fa-solid fa-quote-left', color: '#10B981', title: 'Citation Grounding Checker', sub: 'Evaluator • updated yesterday', badge: 'Approved', badgeColor: '#3B82F6' }
    ],
    activity: [
      { user: 'Srinjoyee Dey', action: 'indexed 4,800 enterprise compliance docs', time: '15m ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60' },
      { user: 'Devin K.', action: 'measured zero hallucination on 200 test queries', time: '3h ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60' },
      { user: 'Amina S.', action: 'tuned HNSW index parameters m=16 ef=64', time: 'Yesterday', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60' },
      { user: 'Liam Zhao', action: 'added Gemini 1.5 Pro dynamic fallback routing', time: '2d ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60' }
    ],
    heroBg: 'linear-gradient(135deg, #ECFCCB 0%, #D9F99D 40%, #D5E859 100%)',
    heroImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60'
  },
  '4': {
    brandLogo: 'fa-solid fa-newspaper',
    brandName: 'Nobodristhi',
    systemTitle: 'Nobodristhi Verifier',
    season: 'v2.0 • Geospatial Truth',
    status: 'Active Pipeline',
    quote: '"Geospatial Haversine clustering, reverse image lookup & moderation queue."',
    architect: 'Srinjoyee Dey',
    coreTech: 'Python + Flask + SerpAPI + PostgreSQL',
    targetLaunch: 'Q2 2026',
    synopsis: 'Automated news verification and crowdsourced report deduplication backend. Clusters breaking incidents by geographic radius and cross-verifies digital media signatures.',
    metrics: [
      { label: 'GEO ACCURACY', val: '99.1%' },
      { label: 'RADIUS CLUSTER', val: '5.0 km' },
      { label: 'DEDUPLICATION', val: '96.4%' },
      { label: 'DISPATCH RT', val: 'Real-time' }
    ],
    jumpTo: [
      { title: 'Dhaka Central Hub', sub: 'High Volume Radar', color: '#10B981' },
      { title: 'Chittagong Coastal', sub: 'Incident Cluster B', color: '#059669' },
      { title: 'Reverse Image Queue', sub: 'SerpAPI Vision Match', color: '#34D399' },
      { title: 'Haversine Cluster ML', sub: 'Spatial Radius', color: '#6EE7B7' },
      { title: 'Moderator Audit Ledger', sub: 'Tamper-Proof Log', color: '#A7F3D0' }
    ],
    workspaces: [
      { icon: 'fa-solid fa-location-dot', color: '#10B981', title: 'Haversine Geospatial Clustering', sub: 'Spatial • updated 10m ago', badge: 'Active', badgeColor: '#10B981' },
      { icon: 'fa-solid fa-image', color: '#34D399', title: 'Reverse Image Search Pipeline', sub: 'SerpAPI • updated 2h ago', badge: 'In Review', badgeColor: '#F59E0B' },
      { icon: 'fa-solid fa-clipboard-check', color: '#059669', title: 'Journalist Moderation Ledger', sub: 'Queue • updated yesterday', badge: 'Approved', badgeColor: '#3B82F6' }
    ],
    activity: [
      { user: 'Srinjoyee Dey', action: 'deduplicated 82 incoming eyewitness reports', time: '10m ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60' },
      { user: 'Tariq Rahman', action: 'verified geotag authentic for flood report', time: '2h ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60' },
      { user: 'Sara Chowdhury', action: 'cleared reverse image backlog (zero fake hits)', time: 'Yesterday', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60' },
      { user: 'Nadia Karim', action: 'optimized Haversine spatial radius computation', time: '3d ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60' }
    ],
    heroBg: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 40%, #059669 100%)',
    heroImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60'
  },
  '5': {
    brandLogo: 'fa-solid fa-shop',
    brandName: 'NexVyapaar',
    systemTitle: 'NexVyapaar POS',
    season: 'v1.4 • Smart Retail',
    status: 'Interactive MVP',
    quote: '"Offline-first intelligent POS: AI advises, Owner decides."',
    architect: 'Srinjoyee Dey',
    coreTech: 'React + TypeScript + IndexedDB + Vite',
    targetLaunch: 'Active Beta',
    synopsis: 'Offline-first intelligent retail assistant and smart POS copilot. Provides real-time restock suggestions, batch expiry warnings, and CDSCO banned-drug safety enforcement.',
    metrics: [
      { label: 'OFFLINE SYNC', val: '100% Local' },
      { label: 'INVENTORY ITEMS', val: '3,200+' },
      { label: 'BAN DETECTION', val: '0ms Latency' },
      { label: 'REORDER ACC', val: '94.8%' }
    ],
    jumpTo: [
      { title: 'Main Counter Register', sub: 'Terminal 01', color: '#6366F1' },
      { title: 'Pharmacy Inventory', sub: 'Expiry Radar', color: '#818CF8' },
      { title: 'Banned Drug Database', sub: 'CDSCO Compliance', color: '#4F46E5' },
      { title: 'Restock Copilot', sub: 'Predictive Sales', color: '#A5B4FC' },
      { title: 'IndexedDB Sync', sub: 'Zero-Drop Offline', color: '#C7D2FE' }
    ],
    workspaces: [
      { icon: 'fa-solid fa-cart-shopping', color: '#6366F1', title: 'Local POS Checkout Engine', sub: 'Terminal • updated 5m ago', badge: 'Active', badgeColor: '#10B981' },
      { icon: 'fa-solid fa-pills', color: '#4F46E5', title: 'CDSCO Banned Drug Validator', sub: 'Compliance • updated 1h ago', badge: 'In Review', badgeColor: '#F59E0B' },
      { icon: 'fa-solid fa-chart-line', color: '#818CF8', title: 'Dynamic Restock Forecast', sub: 'Analytics • updated yesterday', badge: 'Approved', badgeColor: '#3B82F6' }
    ],
    activity: [
      { user: 'Srinjoyee Dey', action: 'synced 64 offline retail transactions', time: '5m ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60' },
      { user: 'Rajesh Gupta', action: 'blocked banned pharmaceutical sale attempt', time: '1h ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60' },
      { user: 'Pooja Verma', action: 'reordered fast-moving stock before stockout', time: 'Yesterday', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60' },
      { user: 'Vikram Joshi', action: 'benchmarked IndexedDB store speed (8ms)', time: '2d ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60' }
    ],
    heroBg: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 40%, #EFECE1 100%)',
    heroImage: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=60'
  }
};


function Interactive3DStage({ children, className = '' }) {
  const stageRef = useRef(null);
  const rafRef = useRef(null);
  const targetTiltRef = useRef({ x: 0, y: 0 });

  const applyTilt = useCallback(() => {
    if (stageRef.current) {
      const { x, y } = targetTiltRef.current;
      stageRef.current.style.setProperty('--tilt-x', `${x}deg`);
      stageRef.current.style.setProperty('--tilt-y', `${y}deg`);
    }
    rafRef.current = null;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
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

const DesktopDashboardScreen = React.memo(function DesktopDashboardScreen({ config, project }) {
  return (
    <Interactive3DStage className="tablet-3d-stage">
      <div className="desktop-dashboard-frame">
        <div className="dashboard-glass-sheen" aria-hidden="true" />
      <div className="dashboard-camera-dot" aria-hidden="true" />
      <div className="dashboard-app-window">
        {/* Top Header Bar */}
        <div className="dash-top-nav">
          <div className="dash-top-left">
            <div className="dash-brand-icon">
              <i className={config.brandLogo}></i>
            </div>
            <span className="dash-brand-name">{config.brandName}</span>
            <div className="dash-nav-pills">
              <span className="dash-nav-pill">Home</span>
              <span className="dash-nav-pill active">Productions</span>
              <span className="dash-nav-pill">Assets</span>
              <span className="dash-nav-pill">Team</span>
            </div>
          </div>
          <div className="dash-top-right">
            <div className="dash-search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <span>Search everything...</span>
              <kbd className="dash-kbd">&#8984;K</kbd>
            </div>
            <button type="button" className="dash-icon-btn" aria-label="Dark mode">
              <i className="fa-regular fa-moon"></i>
            </button>
            <button type="button" className="dash-icon-btn with-dot" aria-label="Notifications">
              <i className="fa-regular fa-bell"></i>
              <span className="dash-notif-dot" />
            </button>
            <div className="dash-avatar-btn">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80" alt="Profile" />
            </div>
          </div>
        </div>

        {/* Dashboard Body Grid: Sidebar + Workspace */}
        <div className="dash-body-grid">
          {/* Left Sidebar */}
          <aside className="dash-sidebar">
            <div className="dash-sidebar-header">
              <span className="dash-back-link">
                <i className="fa-solid fa-chevron-left"></i> All productions
              </span>
              <i className="fa-solid fa-bars-staggered dash-collapse-icon"></i>
            </div>

            {/* Active Production Card */}
            <div className="dash-project-card">
              <div className="dash-project-poster" style={{ backgroundImage: "url(" + config.heroImage + ")" }}>
                <span className="dash-poster-badge">HD</span>
              </div>
              <div className="dash-project-meta">
                <span className="dash-project-card-title">{config.systemTitle}</span>
                <span className="dash-project-card-sub">{config.season}</span>
                <span className="dash-status-pill">
                  <span className="dash-status-dot" />
                  {config.status}
                </span>
              </div>
            </div>

            {/* Nav Menu */}
            <div className="dash-sidebar-nav">
              <div className="dash-menu-item active">
                <i className="fa-solid fa-chart-pie"></i>
                <span>Overview</span>
              </div>
              <div className="dash-menu-item">
                <i className="fa-solid fa-code-branch"></i>
                <span>Pipelines</span>
                <span className="dash-count-badge">6</span>
              </div>
              <div className="dash-menu-item">
                <i className="fa-solid fa-database"></i>
                <span>Assets</span>
                <span className="dash-count-badge">8</span>
              </div>
              <div className="dash-menu-item">
                <i className="fa-solid fa-users"></i>
                <span>Team</span>
                <span className="dash-count-badge">11</span>
              </div>
            </div>

            {/* Workspaces Group */}
            <div className="dash-sidebar-group">
              <div className="dash-group-header">
                <span><i className="fa-solid fa-chevron-right"></i> WORKSPACES</span>
                <span className="dash-count-badge">8</span>
              </div>
            </div>

            {/* Jump To List with Colored Left Bars */}
            <div className="dash-sidebar-group">
              <div className="dash-group-header">
                <span><i className="fa-solid fa-chevron-down"></i> JUMP TO</span>
              </div>
              <div className="dash-jumpto-list">
                {config.jumpTo.map((item, idx) => (
                  <div key={idx} className="dash-jumpto-item" style={{ '--item-accent': item.color }}>
                    <span className="dash-jumpto-bar" />
                    <div className="dash-jumpto-text">
                      <span className="dash-jumpto-title">{item.title}</span>
                      <span className="dash-jumpto-sub">{item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className="dash-workspace">
            {/* Hero Banner Card */}
            <div className="dash-hero-banner" style={{ background: config.heroBg }}>
              <div className="dash-hero-content">
                <div className="dash-hero-title-row">
                  <h3 className="dash-hero-title">{config.systemTitle}</h3>
                  <span className="dash-hero-season">{config.season}</span>
                </div>
                <p className="dash-hero-quote">{config.quote}</p>

                {/* Metadata Chips */}
                <div className="dash-hero-meta-row">
                  <div className="dash-meta-field">
                    <span className="dash-meta-k">STATUS</span>
                    <span className="dash-meta-v status-green">
                      <span className="dash-status-dot" /> {config.status}
                    </span>
                  </div>
                  <div className="dash-meta-field">
                    <span className="dash-meta-k">ARCHITECT / LEAD</span>
                    <span className="dash-meta-v">{config.architect}</span>
                  </div>
                  <div className="dash-meta-field">
                    <span className="dash-meta-k">CORE STACK</span>
                    <span className="dash-meta-v">{config.coreTech}</span>
                  </div>
                  <div className="dash-meta-field">
                    <span className="dash-meta-k">TARGET LAUNCH</span>
                    <span className="dash-meta-v">{config.targetLaunch}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="dash-hero-actions">
                  <button type="button" className="dash-btn-primary">
                    <i className="fa-solid fa-play"></i> Open latest workspace
                  </button>
                  <button type="button" className="dash-btn-secondary">
                    <i className="fa-solid fa-plus"></i> New workspace
                  </button>
                  <button type="button" className="dash-btn-secondary">
                    <i className="fa-solid fa-share-nodes"></i> Share
                  </button>
                  <button type="button" className="dash-btn-secondary star">
                    <i className="fa-solid fa-star"></i> Favorited
                  </button>
                </div>
              </div>

              {/* Banner Tab Row */}
              <div className="dash-hero-tabs">
                <span className="dash-tab-link active">Overview</span>
                <span className="dash-tab-link">Pipelines</span>
                <span className="dash-tab-link">Assets</span>
                <span className="dash-tab-link">Team</span>
              </div>
            </div>

            {/* Split Content: Left 65% / Right 35% */}
            <div className="dash-content-grid">
              {/* Left Column */}
              <div className="dash-col-left">
                {/* Synopsis Card */}
                <div className="dash-card">
                  <h4 className="dash-card-heading">Synopsis</h4>
                  <p className="dash-synopsis-text">{config.synopsis}</p>
                </div>

                {/* 4 Stat Metric Cards */}
                <div className="dash-stats-grid">
                  {config.metrics.map((m, idx) => (
                    <div key={idx} className="dash-stat-box">
                      <span className="dash-stat-label">{m.label}</span>
                      <span className="dash-stat-value">{m.val}</span>
                    </div>
                  ))}
                </div>

                {/* Active Workspaces List */}
                <div className="dash-card">
                  <div className="dash-card-header-row">
                    <h4 className="dash-card-heading">Active workspaces</h4>
                    <span className="dash-add-link">+ New</span>
                  </div>
                  <div className="dash-workspaces-list">
                    {config.workspaces.map((ws, idx) => (
                      <div key={idx} className="dash-workspace-row">
                        <div className="dash-ws-icon" style={{ backgroundColor: ws.color + "18", color: ws.color }}>
                          <i className={ws.icon}></i>
                        </div>
                        <div className="dash-ws-info">
                          <span className="dash-ws-title">{ws.title}</span>
                          <span className="dash-ws-sub">{ws.sub}</span>
                        </div>
                        <span className="dash-ws-badge" style={{ color: ws.badgeColor, backgroundColor: ws.badgeColor + "18" }}>
                          {ws.badge}
                        </span>
                        <div className="dash-avatar-pile">
                          <span className="dash-mini-avatar" />
                          <span className="dash-mini-avatar offset" />
                          <span className="dash-mini-avatar count">+1</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Activity & Lead */}
              <div className="dash-col-right">
                <div className="dash-card">
                  <h4 className="dash-card-heading">Latest activity</h4>
                  <div className="dash-activity-list">
                    {config.activity.map((act, idx) => (
                      <div key={idx} className="dash-activity-item">
                        <img src={act.avatar} alt={act.user} className="dash-act-avatar" />
                        <div className="dash-act-body">
                          <p className="dash-act-text">
                            <strong>{act.user}</strong> {act.action}
                          </p>
                          <span className="dash-act-time">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-card">
                  <h4 className="dash-card-heading">On this production</h4>
                  <div className="dash-production-member">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80" alt="Lead" className="dash-act-avatar" />
                    <div className="dash-act-body">
                      <span className="dash-member-name">{config.architect}</span>
                      <span className="dash-member-role">Lead Architect & Product</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      </div>
      <div className="device-3d-ground-shadow" aria-hidden="true" />
    </Interactive3DStage>
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
        <div className="mobile-iphone-device phone-left">
          <div className="iphone-glass-sheen" aria-hidden="true" />
          <div className="iphone-screen-body">
            <div className="iphone-status-bar">
              <span className="iphone-time">9:41</span>
              <div className="iphone-dynamic-island" />
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
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Daniel" className="phone-user-avatar" />
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
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Priya" className="phone-user-avatar" />
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
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Tom" className="phone-user-avatar" />
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
      </div>

        {/* Phone 2: Right */}
        <div className="mobile-iphone-device phone-right">
          <div className="iphone-glass-sheen" aria-hidden="true" />
          <div className="iphone-screen-body message-screen">
            <div className="iphone-status-bar">
              <span className="iphone-time">9:41</span>
              <div className="iphone-dynamic-island" />
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
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80" alt="Maya" className="phone-recipient-avatar" />
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
      </div>
      </div>
      <div className="mobile-3d-ground-shadow" aria-hidden="true" />
    </Interactive3DStage>
  );
});

const ProjectRow = React.memo(function ProjectRow({
  project,
  index,
  isExpanded,
  onHover,
  onLeave,
  onClick,
  onKeyDown,
  onOpenModal
}) {
  return (
    <article
      className={`editorial-row ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
      data-theme={project.theme}
      style={{
        '--accent-color': project.accentColor,
        '--accent-rgb': project.accentRgb,
        '--row-solid-bg': project.solidBg,
        '--row-text-color': project.textColor
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onLeave(index)}
      onClick={(e) => onClick(index, e)}
      onKeyDown={(e) => onKeyDown(e, index)}
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
            {project.title === 'Punarchakra' || project.visualType === 'ballpit' || project.title === 'Agnivaarak' || project.visualType === 'agnivaarak' ? (
              <MobilePhoneScreen project={project} />
            ) : (
              <DesktopDashboardScreen
                config={DASHBOARD_CONFIGS[project.numericId] || DASHBOARD_CONFIGS['1']}
                project={project}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

export default function ProjectsShowcase() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [soundOn, setSoundOn] = useState(false);
  const containerRef = useRef(null);
  const userCollapsedIndexRef = useRef(null);
  const hoverTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.ScrollTrigger) {
        if (typeof window.ScrollTrigger.update === 'function') {
          window.ScrollTrigger.update();
        }
        // Force refresh trigger heights as rows expand/contract
        setTimeout(() => {
          if (typeof window.ScrollTrigger.refresh === 'function') {
            window.ScrollTrigger.refresh();
          }
        }, 100);
        setTimeout(() => {
          if (typeof window.ScrollTrigger.refresh === 'function') {
            window.ScrollTrigger.refresh();
          }
        }, 360);
      }
    }
  }, [expandedIndex]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
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

  const handleRowHover = useCallback((index) => {
    // If the user explicitly collapsed this row by click, do not re-expand while mouse lingers over it
    if (userCollapsedIndexRef.current === index) {
      return;
    }
    userCollapsedIndexRef.current = null;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setExpandedIndex((prev) => {
        if (prev !== index) {
          playSlideSound();
          return index;
        }
        return prev;
      });
    }, 35);
  }, []);

  const handleRowLeave = useCallback((index) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    // Clear userCollapsedIndex when mouse leaves that specific row so future entries can expand
    if (userCollapsedIndexRef.current === index) {
      userCollapsedIndexRef.current = null;
    }
  }, []);

  const handleRowClick = useCallback((index, e) => {
    // Don't toggle row if clicking inside buttons or links
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setExpandedIndex((prev) => {
      if (prev === index) {
        // Collapsed by user
        userCollapsedIndexRef.current = index;
        return null;
      } else {
        // Expanded by user
        userCollapsedIndexRef.current = null;
        playSlideSound();

        // Ensure newly expanded row is comfortably framed within viewport
        setTimeout(() => {
          const rowEl = document.querySelector(`.editorial-row[data-row-id="${SHOWCASE_PROJECTS[index]?.numericId}"]`);
          if (rowEl) {
            const rect = rowEl.getBoundingClientRect();
            const dockOffset = 110; // Mac dock clearance
            if (rect.bottom > window.innerHeight - dockOffset || rect.top < 70) {
              const targetY = window.pageYOffset + rect.top - 80;
              if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                window.lenis.scrollTo(targetY, { duration: 0.8 });
              } else {
                window.scrollTo({ top: targetY, behavior: 'smooth' });
              }
            }
          }
        }, 140);

        return index;
      }
    });
  }, []);

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
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setExpandedIndex((prev) => {
        if (prev === index) {
          userCollapsedIndexRef.current = index;
          return null;
        } else {
          userCollapsedIndexRef.current = null;
          playSlideSound();
          return index;
        }
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % total;
      userCollapsedIndexRef.current = null;
      setExpandedIndex(next);
      playSlideSound();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + total) % total;
      userCollapsedIndexRef.current = null;
      setExpandedIndex(prev);
      playSlideSound();
    }
  }, [total]);

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
            onHover={handleRowHover}
            onLeave={handleRowLeave}
            onClick={handleRowClick}
            onKeyDown={handleKeyDown}
            onOpenModal={handleOpenModal}
          />
        ))}
      </div>
    </div>
  );
}
