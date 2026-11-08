/**
 * DUAL-MODE TECH ARSENAL CONTROLLER
 * [ ⚡ Node Blueprint ] ⟷ [ ✦ Cosmic Constellation ]
 * Architectural interactive system graph for Srinjoyee Dey's portfolio.
 */

(function () {
  'use strict';

  // 14 Core Technologies & Telemetry Data
  const TECH_NODES_DATA = [
    {
      id: 'python',
      name: 'Python',
      category: 'Neural Core',
      catId: 'ai',
      mastery: 96,
      iconHtml: '<svg viewBox="0 0 128 128" width="24" height="24"><path fill="#387EB8" d="M63.5 12.8c-26.6 0-25 11.5-25 11.5l.03 11.9h25.4v3.6H28.4S12 37.9 12 64.7c0 26.7 14.3 25.8 14.3 25.8h8.5v-12s-.5-14.3 14-14.3h24.1s13.5.2 13.5-13.2V26.3s1.7-13.5-22.9-13.5zm-13.7 7.7a3.8 3.8 0 1 1 0 7.7 3.8 3.8 0 0 1 0-7.7z"/><path fill="#FFE873" d="M64.5 115.2c26.6 0 25-11.5 25-11.5l-.03-11.9H64.07v-3.6h35.53s16.4 1.9 16.4-24.9c0-26.7-14.3-25.8-14.3-25.8h-8.5v12s.5 14.3-14 14.3H55.1s-13.5-.2-13.5 13.2v24.7s-1.7 13.5 22.9 13.5zm13.7-7.7a3.8 3.8 0 1 1 0-7.7 3.8 3.8 0 0 1 0 7.7z"/></svg>',
      frameworks: ['PyTorch', 'FastAPI', 'OpenCV', 'YOLOv8', 'LangChain'],
      impact: 'Engineered YOLOv8 fire perception pipeline for Agnivaarak & semantic vector embeddings for Anchor.',
      posBlueprint: { xPct: 32, yPct: 30 },
      posConstellation: { xPct: 45, yPct: 22 }
    },
    {
      id: 'pytorch',
      name: 'PyTorch',
      category: 'Deep Learning',
      catId: 'ai',
      mastery: 93,
      iconHtml: '<svg viewBox="0 0 24 24" width="22" height="22" fill="#EE4C2C"><path d="M13.5 2.1a1 1 0 0 0-1.5.2L10.3 4.5l2.4 2.4 1.5-1.8a1 1 0 0 0-.7-3zM19 12a7 7 0 1 1-13-3.6l1.5 1.5A5 5 0 1 0 17 12h2z"/></svg>',
      frameworks: ['CUDA Acceleration', 'TorchScript', 'Custom Loss Functions', 'Vision Backbones'],
      impact: 'Trained and optimized edge neural models for real-time inference latency under 18ms.',
      posBlueprint: { xPct: 32, yPct: 58 },
      posConstellation: { xPct: 58, yPct: 18 }
    },
    {
      id: 'ai-llm',
      name: 'AI / LLM',
      category: 'Agentic Reasoning',
      catId: 'ai',
      mastery: 95,
      iconHtml: '<svg viewBox="0 0 24 24" width="22" height="22" fill="#8B5CF6"><path d="M12 2a1 1 0 0 1 1 1v1h2a5 5 0 0 1 5 5v5a5 5 0 0 1-5 5h-1v1a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1H5a5 5 0 0 1-5-5V9a5 5 0 0 1 5-5h2V3a1 1 0 0 1 1-1h4zm-4 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-5.5 5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3z"/></svg>',
      frameworks: ['LangGraph', 'RAG Pipelines', 'Function Calling', 'Groq / Gemini APIs'],
      impact: 'Orchestrated autonomous multi-agent reasoning loops with strict factual hallucination guards.',
      posBlueprint: { xPct: 12, yPct: 76 },
      posConstellation: { xPct: 32, yPct: 34 }
    },
    {
      id: 'neural',
      name: 'OpenCV',
      category: 'Computer Vision',
      catId: 'ai',
      mastery: 92,
      iconHtml: '<i class="fa-solid fa-eye" style="font-size: 20px; color: #10B981;"></i>',
      frameworks: ['Stereo Vision', 'Feature Matching', 'Optical Flow', 'Object Tracking'],
      impact: 'Built real-time frame feature extraction pipeline for national SIH grand finale winner demo.',
      posBlueprint: { xPct: 12, yPct: 22 },
      posConstellation: { xPct: 68, yPct: 32 }
    },
    {
      id: 'react',
      name: 'React 19',
      category: 'Reactive UI',
      catId: 'web',
      mastery: 98,
      iconHtml: '<svg viewBox="0 0 115.3 100" width="24" height="24" fill="none"><ellipse cx="57.65" cy="50" rx="16.5" ry="46" transform="rotate(30 57.65 50)" stroke="#00D8FF" stroke-width="5"/><ellipse cx="57.65" cy="50" rx="16.5" ry="46" transform="rotate(90 57.65 50)" stroke="#00D8FF" stroke-width="5"/><ellipse cx="57.65" cy="50" rx="16.5" ry="46" transform="rotate(150 57.65 50)" stroke="#00D8FF" stroke-width="5"/><circle cx="57.65" cy="50" r="8" fill="#00D8FF"/></svg>',
      frameworks: ['Server Components', 'Zustand', 'Framer Motion', 'Custom Hooks'],
      impact: 'Built VAni multilingual recovery web app and Porto studio portfolio with 60fps cinematic flows.',
      posBlueprint: { xPct: 58, yPct: 24 },
      posConstellation: { xPct: 40, yPct: 72 }
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      category: 'SSR Architecture',
      catId: 'web',
      mastery: 95,
      iconHtml: '<svg viewBox="0 0 180 180" width="22" height="22" fill="#111215"><path fill-rule="evenodd" clip-rule="evenodd" d="M90 180c49.706 0 90-40.294 90-90S139.706 0 90 0 0 40.294 0 90s40.294 90 90 90zm36.562-48.473L69.837 54.4H54.4v71.2h12.56V72.088l50.05 64.912c3.197-1.748 6.22-3.805 9.012-6.133l.54-.34zM113.6 54.4h12V108h-12V54.4z"/></svg>',
      frameworks: ['App Router', 'Server Actions', 'Edge Middleware', 'Streaming SSR'],
      impact: 'Delivered sub-100ms First Contentful Paint and zero-bundle server component architectures.',
      posBlueprint: { xPct: 58, yPct: 52 },
      posConstellation: { xPct: 56, yPct: 78 }
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      category: 'Design Engineering',
      catId: 'web',
      mastery: 97,
      iconHtml: '<svg viewBox="0 0 24 24" width="22" height="22" fill="#38BDF8"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/></svg>',
      frameworks: ['Tailwind v3/v4', 'Design Tokens', 'Container Queries', 'JIT Engine'],
      impact: 'Crafted pixel-perfect design token systems and responsive glassmorphism interfaces.',
      posBlueprint: { xPct: 58, yPct: 80 },
      posConstellation: { xPct: 69, yPct: 70 }
    },
    {
      id: 'js',
      name: 'JavaScript',
      category: 'Web Platform',
      catId: 'web',
      mastery: 99,
      iconHtml: '<span style="font-family: monospace; font-weight: 900; font-size: 16px; color: #F7DF1E;">JS</span>',
      frameworks: ['ES2024+', 'Canvas 2D API', 'WebGL 2.0', 'Web Audio API'],
      impact: 'Engineered custom procedural shaders, physics spring squashes, and bespoke smooth scrollers.',
      posBlueprint: { xPct: 32, yPct: 84 },
      posConstellation: { xPct: 26, yPct: 68 }
    },
    {
      id: 'blender',
      name: 'Blender',
      category: 'Spatial 3D',
      catId: '3d',
      mastery: 92,
      iconHtml: '<svg viewBox="0 0 24 24" width="22" height="22" fill="#EA7600"><path d="M12.5 7.5a4.5 4.5 0 1 1-4.5 4.5 4.5 4.5 0 0 1 4.5-4.5m0-2a6.5 6.5 0 1 0 6.5 6.5 6.5 6.5 0 0 0-6.5-6.5zm-5.8 5.2L1.8 7.3a1 1 0 0 1 1.4-1.4l4.9 3.4a6.5 6.5 0 0 0-1.4 1.4zm6.8-6.8L12.5 1a1 1 0 0 1 1.4 0l.9 2.9a6.5 6.5 0 0 0-1.3 0zm4.5 2.1l4.9-3.4a1 1 0 0 1 1.4 1.4l-4.9 3.4a6.5 6.5 0 0 0-1.4-1.4z"/></svg>',
      frameworks: ['Hard-Surface Modeling', 'PBR Shaders', 'Rigging', 'Cycles / Eevee'],
      impact: 'Authored custom 3D character avatars, wireframe room perspective meshes, and product textures.',
      posBlueprint: { xPct: 12, yPct: 48 },
      posConstellation: { xPct: 78, yPct: 42 }
    },
    {
      id: 'figma',
      name: 'Figma',
      category: 'Design Systems',
      catId: '3d',
      mastery: 95,
      iconHtml: '<svg viewBox="0 0 38 57" width="16" height="24"><path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE"/><path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83"/><path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262"/><path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E"/><path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF"/></svg>',
      frameworks: ['Design Tokens', 'Auto Layout 5', 'Micro-Interactions', 'Interactive Components'],
      impact: 'Created comprehensive typography hierarchies, tactile button states, and editorial dossiers.',
      posBlueprint: { xPct: 12, yPct: 6 },
      posConstellation: { xPct: 88, yPct: 30 }
    },
    {
      id: 'unity',
      name: 'Unity 3D',
      category: 'Game Engine',
      catId: '3d',
      mastery: 88,
      iconHtml: '<i class="fa-brands fa-unity" style="font-size: 22px; color: #111215;"></i>',
      frameworks: ['C# Scripting', 'Universal Render Pipeline', 'Particle Systems', 'Physics Engines'],
      impact: 'Developed immersive interactive simulation environments and spatial gameplay mechanics.',
      posBlueprint: { xPct: 32, yPct: 6 },
      posConstellation: { xPct: 84, yPct: 58 }
    },
    {
      id: 'docker',
      name: 'Docker',
      category: 'Cloud DevOps',
      catId: 'cloud',
      mastery: 90,
      iconHtml: '<svg viewBox="0 0 24 24" width="22" height="22" fill="#2496ED"><path d="M13 3h2v2h-2zm-3 0h2v2h-2zm-3 3h2v2H7zm3 0h2v2h-2zm3 0h2v2h-2zm3 0h2v2h-2zm-9 3h2v2H4zm3 0h2v2H7zm3 0h2v2h-2zm3 0h2v2h-2zm3 0h2v2h-2zm3 0h2v2h-2zM1 12c.5 3 2.5 5 6 6 5.5 1.5 11 0 14-4 .5-.8 1-1.8 1-2.8v-.2H1v1z"/></svg>',
      frameworks: ['Multi-Stage Builds', 'Docker Compose', 'CI/CD Pipelines', 'Linux Images'],
      impact: 'Containerized microservices for seamless zero-downtime deployment on AWS and Cloud Run.',
      posBlueprint: { xPct: 82, yPct: 22 },
      posConstellation: { xPct: 14, yPct: 36 }
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'Backend APIs',
      catId: 'cloud',
      mastery: 94,
      iconHtml: '<svg viewBox="0 0 24 24" width="22" height="22" fill="#5FA04E"><path d="M12 2L3 7.2v10.4L12 22.8l9-5.2V7.2L12 2zm-1.2 14.8c-.8 0-1.4-.4-1.8-1.1l1.1-.7c.2.4.4.6.7.6.4 0 .7-.2.7-.6 0-.9-1.9-.4-1.9-1.8 0-.8.6-1.4 1.5-1.4.7 0 1.2.3 1.5.8l-1 .7c-.2-.3-.3-.4-.5-.4-.3 0-.5.2-.5.4 0 .8 1.9.4 1.9 1.8 0 .9-.6 1.6-1.7 1.6zm4.8 0c-.8 0-1.4-.5-1.5-1.2h1.2c.1.3.2.4.4.4.3 0 .4-.2.4-.6v-3.8h1.2v3.8c0 1-.7 1.4-1.7 1.4z"/></svg>',
      frameworks: ['Express', 'WebSockets', 'PostgreSQL / Prisma', 'Redis Caching'],
      impact: 'Architected async event-driven REST APIs handling real-time push sync for caregiver networks.',
      posBlueprint: { xPct: 82, yPct: 52 },
      posConstellation: { xPct: 18, yPct: 54 }
    },
    {
      id: 'github',
      name: 'GitHub Actions',
      category: 'CI/CD Governance',
      catId: 'cloud',
      mastery: 96,
      iconHtml: '<svg viewBox="0 0 24 24" width="22" height="22" fill="#111215"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>',
      frameworks: ['Automated Testing', 'Semantic Releases', 'PR Review Workflows', 'Secrets Vault'],
      impact: 'Automated CI/CD testing pipelines and published multiple open-source project releases.',
      posBlueprint: { xPct: 82, yPct: 80 },
      posConstellation: { xPct: 12, yPct: 74 }
    }
  ];

  // Pipeline Definitions
  const PIPELINES = {
    sih: {
      name: '🏆 SIH Edge AI Winner',
      narrative: 'OpenCV frame features stream into PyTorch tensors, orchestrated by Python backend and visualized in real-time on Next.js & React dashboards.',
      cables: [
        { from: 'neural', to: 'pytorch' },
        { from: 'pytorch', to: 'python' },
        { from: 'python', to: 'react' },
        { from: 'react', to: 'nextjs' }
      ]
    },
    '3d': {
      name: '🌐 3D Spatial Web Experience',
      narrative: 'Figma spatial wireframes modeled in Blender, rendered via custom JavaScript WebGL shaders in React with Tailwind fluid tokens.',
      cables: [
        { from: 'figma', to: 'blender' },
        { from: 'blender', to: 'js' },
        { from: 'js', to: 'react' },
        { from: 'react', to: 'tailwind' }
      ]
    },
    agent: {
      name: '🤖 Autonomous AI Agent Pipeline',
      narrative: 'Multi-agent reasoning loops in AI/LLM orchestrated via Python, wrapped in Docker containers with Node.js microservices and automated via GitHub CI/CD.',
      cables: [
        { from: 'ai-llm', to: 'python' },
        { from: 'python', to: 'docker' },
        { from: 'docker', to: 'nodejs' },
        { from: 'nodejs', to: 'github' }
      ]
    },
    all: {
      name: '🔗 Full Interconnected Matrix',
      narrative: 'Unified production pipeline: Perception (AI) ➔ Synthesis (Python/PyTorch) ➔ Interface (React/Next) ➔ Deployment (Docker/Cloud).',
      cables: [
        { from: 'neural', to: 'pytorch' },
        { from: 'pytorch', to: 'python' },
        { from: 'figma', to: 'blender' },
        { from: 'ai-llm', to: 'python' },
        { from: 'python', to: 'react' },
        { from: 'react', to: 'nextjs' },
        { from: 'js', to: 'react' },
        { from: 'react', to: 'tailwind' },
        { from: 'python', to: 'docker' },
        { from: 'docker', to: 'nodejs' },
        { from: 'nodejs', to: 'github' }
      ]
    }
  };

  // Cosmic Constellation Fixed Links
  const CONSTELLATION_LINKS = [
    // The Neural Nebula
    { from: 'python', to: 'pytorch' },
    { from: 'python', to: 'ai-llm' },
    { from: 'pytorch', to: 'neural' },
    { from: 'ai-llm', to: 'neural' },
    // The Spatial Orbit
    { from: 'figma', to: 'blender' },
    { from: 'blender', to: 'unity' },
    { from: 'figma', to: 'unity' },
    // The Interface Cluster
    { from: 'react', to: 'nextjs' },
    { from: 'nextjs', to: 'tailwind' },
    { from: 'react', to: 'js' },
    { from: 'js', to: 'tailwind' },
    // The Systems Anchor
    { from: 'docker', to: 'nodejs' },
    { from: 'nodejs', to: 'github' },
    { from: 'docker', to: 'github' },
    // Bridge Connections
    { from: 'python', to: 'react' },
    { from: 'python', to: 'docker' },
    { from: 'blender', to: 'js' }
  ];

  class TechArsenalManager {
    constructor() {
      this.mode = 'blueprint'; // 'blueprint' | 'constellation'
      this.currentPipeline = 'sih';
      this.nodes = [];
      this.nodeElements = new Map();
      this.activeDossier = null;

      this.stage = document.getElementById('techStageBoard');
      this.nodesContainer = document.getElementById('techNodesContainer');
      this.svgLayer = document.getElementById('techCablesSvg');
      this.cosmicCanvas = document.getElementById('stageCosmicCanvas');
      this.telemetryPill = document.getElementById('telemetryStatusTag');
      this.telemetryText = document.getElementById('telemetryStatusText');

      if (!this.stage || !this.nodesContainer || !this.svgLayer) return;

      this.initNodes();
      this.initModeSwitcher();
      this.initPresets();
      this.initDragging();
      this.initCosmicCanvas();
      this.startRenderLoop();

      window.addEventListener('resize', () => {
        this.updateNodeTargetPositions();
      });
    }

    initNodes() {
      this.nodes = TECH_NODES_DATA.map(data => {
        const el = document.createElement('div');
        el.className = `tech-node ${this.mode === 'blueprint' ? 'blueprint-style' : 'constellation-style'}`;
        el.setAttribute('data-id', data.id);
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');

        el.innerHTML = `
          <div class="node-port port-in" aria-hidden="true"></div>
          <div class="node-port port-out" aria-hidden="true"></div>
          <div class="node-header-row">
            <span class="node-category-tag">${data.category}</span>
            <span class="node-status-dot"></span>
          </div>
          <div class="node-body">
            <div class="node-icon-wrap">${data.iconHtml}</div>
            <div class="node-info-col">
              <h4 class="node-title">${data.name}</h4>
              <div class="node-level-bar"><div class="node-level-fill" style="width: ${data.mastery}%"></div></div>
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          if (el._hasDragged) return;
          this.openDossier(data);
        });

        this.nodesContainer.appendChild(el);
        this.nodeElements.set(data.id, el);

        return {
          ...data,
          el,
          x: 0,
          y: 0,
          targetX: 0,
          targetY: 0,
          vx: 0,
          vy: 0
        };
      });

      this.updateNodeTargetPositions();
      // Snap instantly on first render
      this.nodes.forEach(node => {
        node.x = node.targetX;
        node.y = node.targetY;
        this.applyNodeTransform(node);
      });
    }

    updateNodeTargetPositions() {
      if (!this.stage) return;
      const w = this.stage.clientWidth;
      const h = this.stage.clientHeight;

      this.nodes.forEach(node => {
        const pos = this.mode === 'blueprint' ? node.posBlueprint : node.posConstellation;
        node.targetX = (pos.xPct / 100) * w;
        node.targetY = (pos.yPct / 100) * h;
      });
    }

    applyNodeTransform(node) {
      node.el.style.left = `${node.x}px`;
      node.el.style.top = `${node.y}px`;
    }

    initModeSwitcher() {
      const switcherButtons = document.querySelectorAll('.mode-switch-btn');
      const presetsBar = document.getElementById('blueprintPresetsBar');

      switcherButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetMode = btn.getAttribute('data-mode');
          if (targetMode === this.mode) return;

          switcherButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          this.mode = targetMode;

          if (this.mode === 'constellation') {
            this.stage.classList.add('mode-constellation');
            if (presetsBar) presetsBar.classList.add('hidden-mode');
            this.telemetryPill.textContent = 'COSMIC MAP';
            this.telemetryText.textContent = 'Neural Constellation active. Star clusters link AI, spatial 3D, UI, and cloud foundations.';
          } else {
            this.stage.classList.remove('mode-constellation');
            if (presetsBar) presetsBar.classList.remove('hidden-mode');
            this.telemetryPill.textContent = 'ACTIVE PIPELINE';
            this.telemetryText.textContent = PIPELINES[this.currentPipeline].narrative;
          }

          // Update node styling classes
          this.nodes.forEach(node => {
            if (this.mode === 'blueprint') {
              node.el.classList.remove('constellation-style');
              node.el.classList.add('blueprint-style');
            } else {
              node.el.classList.remove('blueprint-style');
              node.el.classList.add('constellation-style');
            }
          });

          this.updateNodeTargetPositions();
        });
      });
    }

    initPresets() {
      const presetButtons = document.querySelectorAll('.preset-btn');
      presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const pipeKey = btn.getAttribute('data-pipeline');
          if (!PIPELINES[pipeKey]) return;

          presetButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          this.currentPipeline = pipeKey;
          const pipeline = PIPELINES[pipeKey];

          if (this.telemetryPill) this.telemetryPill.textContent = pipeline.name.toUpperCase();
          if (this.telemetryText) this.telemetryText.textContent = pipeline.narrative;
        });
      });
    }

    initDragging() {
      this.nodes.forEach(node => {
        const el = node.el;
        let startX = 0;
        let startY = 0;
        let initNodeX = 0;
        let initNodeY = 0;
        let isDragging = false;

        const onPointerDown = (e) => {
          isDragging = true;
          el._hasDragged = false;
          startX = e.clientX;
          startY = e.clientY;
          initNodeX = node.x;
          initNodeY = node.y;

          try {
            el.setPointerCapture(e.pointerId);
          } catch (err) {}
        };

        const onPointerMove = (e) => {
          if (!isDragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;

          if (Math.hypot(dx, dy) > 4) {
            el._hasDragged = true;
          }

          const w = this.stage.clientWidth;
          const h = this.stage.clientHeight;

          node.x = Math.max(50, Math.min(w - 50, initNodeX + dx));
          node.y = Math.max(40, Math.min(h - 40, initNodeY + dy));
          node.targetX = node.x;
          node.targetY = node.y;

          this.applyNodeTransform(node);
        };

        const onPointerUp = (e) => {
          isDragging = false;
          try {
            el.releasePointerCapture(e.pointerId);
          } catch (err) {}
        };

        el.addEventListener('pointerdown', onPointerDown);
        el.addEventListener('pointermove', onPointerMove);
        el.addEventListener('pointerup', onPointerUp);
        el.addEventListener('pointercancel', onPointerUp);
      });
    }

    initCosmicCanvas() {
      if (!this.cosmicCanvas) return;
      const ctx = this.cosmicCanvas.getContext('2d');
      if (!ctx) return;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.cosmicCanvas.width = this.stage.clientWidth * dpr;
        this.cosmicCanvas.height = this.stage.clientHeight * dpr;
        ctx.scale(dpr, dpr);
      };

      resize();
      window.addEventListener('resize', resize);

      // Star particles
      const starCount = 65;
      const stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * this.stage.clientWidth,
          y: Math.random() * this.stage.clientHeight,
          r: Math.random() * 1.6 + 0.4,
          alpha: Math.random() * 0.7 + 0.3,
          speed: Math.random() * 0.02 + 0.01
        });
      }

      this._cosmicRender = () => {
        if (this.mode !== 'constellation') return;
        const w = this.stage.clientWidth;
        const h = this.stage.clientHeight;
        ctx.clearRect(0, 0, w, h);

        // Twinkling stars
        stars.forEach(s => {
          s.alpha += (Math.random() - 0.5) * s.speed;
          s.alpha = Math.max(0.2, Math.min(0.9, s.alpha));

          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Orbital celestial rings
        const cx = w * 0.5;
        const cy = h * 0.5;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 10]);
        [140, 260, 380].forEach(rad => {
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();
        });
        ctx.setLineDash([]);
      };
    }

    startRenderLoop() {
      let pulseTime = 0;

      const render = () => {
        pulseTime += 0.018;

        // Smooth easing toward targets
        this.nodes.forEach(node => {
          const dx = node.targetX - node.x;
          const dy = node.targetY - node.y;
          if (Math.hypot(dx, dy) > 0.4) {
            node.x += dx * 0.12;
            node.y += dy * 0.12;
            this.applyNodeTransform(node);
          }
        });

        // Draw dynamic SVG cables
        this.drawCables(pulseTime);

        // Cosmic starfield render
        if (this._cosmicRender) {
          this._cosmicRender();
        }

        requestAnimationFrame(render);
      };

      requestAnimationFrame(render);
    }

    drawCables(pulseTime) {
      const activeCables = this.mode === 'blueprint'
        ? PIPELINES[this.currentPipeline].cables
        : CONSTELLATION_LINKS;

      const nodeMap = new Map();
      this.nodes.forEach(n => nodeMap.set(n.id, n));

      let svgHtml = '';

      activeCables.forEach((cable, index) => {
        const fromNode = nodeMap.get(cable.from);
        const toNode = nodeMap.get(cable.to);
        if (!fromNode || !toNode) return;

        // Port offsets
        let x1 = fromNode.x;
        let y1 = fromNode.y;
        let x2 = toNode.x;
        let y2 = toNode.y;

        if (this.mode === 'blueprint') {
          // Output port is right, input port is left
          x1 += 80;
          x2 -= 80;
        }

        // Cubic Bezier curve
        const dx = Math.abs(x2 - x1);
        const curvature = Math.max(30, dx * 0.5);
        const pathData = `M ${x1} ${y1} C ${x1 + curvature} ${y1}, ${x2 - curvature} ${y2}, ${x2} ${y2}`;

        svgHtml += `<path class="cable-wire active-pipeline" d="${pathData}" />`;

        // Calculate moving pulse particle point on cubic bezier
        const t = (pulseTime + index * 0.28) % 1;
        const pt = this.getCubicBezierPoint(
          { x: x1, y: y1 },
          { x: x1 + curvature, y: y1 },
          { x: x2 - curvature, y: y2 },
          { x: x2, y: y2 },
          t
        );

        svgHtml += `<circle class="cable-pulse-particle" cx="${pt.x}" cy="${pt.y}" r="${this.mode === 'blueprint' ? 4 : 3}" />`;
      });

      this.svgLayer.innerHTML = svgHtml;
    }

    getCubicBezierPoint(p0, p1, p2, p3, t) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
      const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
      return { x, y };
    }

    openDossier(data) {
      const modal = document.createElement('div');
      modal.className = 'tech-dossier-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');

      const tagsHtml = data.frameworks.map(f => `<span class="dossier-tag">${f}</span>`).join('');

      modal.innerHTML = `
        <div class="dossier-card" onclick="event.stopPropagation()">
          <div class="dossier-header">
            <div class="dossier-title-group">
              <div class="dossier-tech-icon">${data.iconHtml}</div>
              <div>
                <h3 class="dossier-tech-name">${data.name}</h3>
                <span class="dossier-tech-cat">${data.category}</span>
              </div>
            </div>
            <button class="dossier-close-btn" aria-label="Close dossier"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="dossier-body">
            <div class="dossier-metric-row">
              <span class="metric-label">⚡ PRODUCTION MASTERY</span>
              <span class="metric-score">${data.mastery}% VERIFIED</span>
            </div>
            <div class="dossier-frameworks-box">
              <div class="dossier-section-title">CORE FRAMEWORKS & CAPABILITIES</div>
              <div class="dossier-tags-wrap">${tagsHtml}</div>
            </div>
            <div class="dossier-impact-box">
              <div class="impact-quote-title"><i class="fa-solid fa-trophy"></i> REAL-WORLD IMPACT</div>
              <p class="impact-quote-text">${data.impact}</p>
            </div>
          </div>
        </div>
      `;

      const close = () => {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
        window.removeEventListener('keydown', onKeyDown);
      };

      const onKeyDown = (e) => {
        if (e.key === 'Escape') close();
      };

      modal.addEventListener('click', close);
      modal.querySelector('.dossier-close-btn').addEventListener('click', close);
      window.addEventListener('keydown', onKeyDown);

      document.body.appendChild(modal);
    }
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TechArsenalManager());
  } else {
    new TechArsenalManager();
  }
})();
