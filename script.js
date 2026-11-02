/* ==========================================================================
   LENIS ULTRA-SMOOTH INERTIAL SCROLL ENGINE
   Exact match to https://asmitrishi.dev configuration:
   lerp: 0.09, smoothWheel: true, autoRaf: false synced with GSAP Ticker
   ========================================================================== */
(function initLenisEngine() {
  if (typeof window === 'undefined') return;

  function bootLenis() {
    if (typeof Lenis === 'undefined') {
      setTimeout(bootLenis, 60);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    try {
      const lenis = new Lenis({
        lerp: 0.1, // Optimal buttery inertial response
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
        autoRaf: false,
        allowNestedScroll: true,
        prevent: (node) => {
          if (!node || typeof node.closest !== 'function') return false;
          return (
            node.hasAttribute?.('data-lenis-prevent') ||
            Boolean(node.closest('[data-lenis-prevent]')) ||
            Boolean(node.closest('#mimo-chatbot-container')) ||
            Boolean(node.closest('#mimo-chatbot-modal')) ||
            Boolean(node.closest('.mimo-messages-body')) ||
            Boolean(node.closest('#project-modal')) ||
            Boolean(node.closest('.clay-screen-body'))
          );
        }
      });

      window.lenis = lenis;

      // Sync with GSAP ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
      }

      // Drive Lenis RAF via GSAP ticker with lagSmoothing enabled for silky 60/120fps sync
      if (typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        // 500ms max lag adjustment, 33ms threshold prevents frame drops from causing sudden jerks
        gsap.ticker.lagSmoothing(500, 33);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }

      console.log('✨ Lenis smooth scroll engine initialized');
    } catch (e) {
      console.warn('Lenis init warning:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootLenis);
  } else {
    bootLenis();
  }
})();

/* ==========================================================================
   CREATIVE PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     0. CUSTOM TRANSLUCENT PIXELATED CURSOR ENGINE
     -------------------------------------------------------------------------- */
  const customCursor = document.getElementById('custom-cursor');
  const cursorFollower = document.getElementById('cursor-follower-ring');

  if (customCursor && cursorFollower) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = mouseX;
        ringY = mouseY;
        customCursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
      }

      customCursor.style.transform = `translate3d(${mouseX - 2}px, ${mouseY - 2}px, 0)`;
    });

    function animateFollowerRing() {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      cursorFollower.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
      requestAnimationFrame(animateFollowerRing);
    }
    requestAnimationFrame(animateFollowerRing);

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      customCursor.style.opacity = '0';
      cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (mouseX > 0 && mouseY > 0) {
        isVisible = true;
        customCursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
      }
    });

    // Delegated hover detection works on static AND dynamically rendered elements
    document.addEventListener('mouseover', (e) => {
      const isInteractive = !!e.target.closest('a, button, input, textarea, select, [role="button"], .project-card, .skill-card, .mood-pill, .social-link-btn, .filter-btn, .polaroid-item, .dock-item, .card-item, .mimo-trigger-btn, .filter-pill, .interactive-hover, [tabindex="0"], canvas');
      if (isInteractive) {
        customCursor.classList.add('hovering');
        cursorFollower.classList.add('hovering');
      } else {
        customCursor.classList.remove('hovering');
        cursorFollower.classList.remove('hovering');
      }
    });

    window.addEventListener('mousedown', () => {
      customCursor.classList.add('clicking');
      cursorFollower.classList.add('clicking');
    });

    window.addEventListener('mouseup', () => {
      customCursor.classList.remove('clicking');
      cursorFollower.classList.remove('clicking');
    });
  }

  function getProjectIcon(id) {
    const icons = {
      '1': 'fa-heart-pulse',
      '2': 'fa-fire-flame-curved',
      '3': 'fa-anchor',
      '4': 'fa-newspaper',
      '5': 'fa-store',
      '6': 'fa-recycle'
    };
    return icons[id] || 'fa-star';
  }

  /* --------------------------------------------------------------------------
     1. PROJECT DATA FOR MODAL POPUPS (Authentic, Non-Fictional)
     -------------------------------------------------------------------------- */
  const projectsData = {
    1: {
      id: "vani",
      title: "VAni",
      subtitle: "Your AI-Powered Recovery Companion",
      category: "AI • Healthcare • Mobile(Android & IOS)",
      overviewHeading: "Project Overview",
      overview: [
        "VAni bridges the difficult gap between hospital discharge and recovery at home.",
        "After leaving a hospital, patients often have prescriptions to follow, symptoms to track, appointments to remember and emergency situations to handle — while families and caregivers need to know whether everything is going well.",
        "VAni brings these pieces together into a voice-first, AI-assisted recovery platform where patients can manage their care, understand prescriptions, communicate with caregivers and access emergency support from one place."
      ],
      whyHeading: "Why We Built It",
      whyBody: "We wanted to make post-hospital care less confusing, more accessible and easier to operate, especially for elderly users and people who may struggle with complex mobile interfaces.\n\nInstead of making users navigate through endless menus, VAni lets them talk to the app, access assistance in multiple languages and get support when it matters most.",
      featuresHeading: "What We Built",
      features: [
        {
          num: "01",
          title: "VOICE-FIRST ASSISTANT",
          desc: "Patients can navigate the app, log medicines and symptoms, switch languages and trigger emergency actions through voice."
        },
        {
          num: "02",
          title: "SMART PRESCRIPTION SCANNER",
          desc: "Processes handwritten and printed prescriptions, extracts medicines, dosage and frequency, and generates a medication schedule."
        },
        {
          num: "03",
          title: "EMERGENCY & SOS",
          desc: "Supports panic-button, shake and voice-triggered emergency flows with caregiver alerts, emergency calling and offline safety support."
        },
        {
          num: "04",
          title: "CAREGIVER CONNECTION",
          desc: "Connects patients with family and caregivers for monitoring, reminders, alerts and communication."
        },
        {
          num: "05",
          title: "REAL-TIME CARE CHAT",
          desc: "Enables patient–caregiver communication through real-time messaging with push-notification fallback."
        },
        {
          num: "06",
          title: "EMERGENCY BLOOD NETWORK",
          desc: "Provides location-based donor matching, blood compatibility support and urgent blood-request functionality."
        }
      ],
      infoCard: {
        project: "VAni",
        focus: "AI Healthcare • Mobile • Accessibility",
        platform: "Android / Mobile",
        myContribution: "Product • System Architecture • AI • UI/UX",
        techStack: [
          "React Native • Expo",
          "Node.js • Express",
          "PostgreSQL • Drizzle",
          "Groq • Gemini",
          "Google Cloud Run"
        ]
      },
      actions: {
        primary: {
          label: "Download APK",
          icon: "fa-solid fa-download",
          url: "https://github.com/SrinjoyeeDey/VAni/releases/download/v1.0.0/VAni.apk"
        },
        secondary: {
          label: "Live Website",
          icon: "fa-solid fa-globe",
          url: "https://vani-bice.vercel.app/"
        }
      }
    },
    2: {
      id: "agnivaarak",
      title: "Agnivaarak",
      subtitle: "Autonomous Fire Detection & Suppression System",
      category: "AI/ML • Computer Vision • Fire Safety",
      overviewHeading: "Project Overview",
      overview: [
        "Agnivaarak is an AI-powered, 360° fire detection and suppression system designed to continuously monitor environments, detect and classify fires, and coordinate an intelligent response.",
        "It combines YOLOv8 computer vision, temporal fire-authenticity analysis, HSV-based fire classification, thermal/IR sensor fusion, spatial tracking, and automated nozzle control to assess fire severity and respond accordingly."
      ],
      featuresHeading: "Key Capabilities",
      features: [
        {
          num: "01",
          title: "FIRE DETECTION",
          desc: "YOLOv8s detects fire and smoke from camera feeds, with the system continuously monitoring the environment."
        },
        {
          num: "02",
          title: "FIRE AUTHENTICITY & CLASSIFICATION",
          desc: "Temporal flicker and motion analysis helps distinguish real flames from false positives, while HSV-based classification differentiates Class A and Class B fires."
        },
        {
          num: "03",
          title: "INTELLIGENT SUPPRESSION",
          desc: "The decision engine assigns targets and dynamically scales suppression based on fire intensity, controlling multiple nozzles through the hardware layer."
        },
        {
          num: "04",
          title: "SENSOR FUSION & SAFETY",
          desc: "Infrared and thermal readings validate detections, while human tracking prevents direct spray into occupied safety zones."
        },
        {
          num: "05",
          title: "REAL-TIME EMERGENCY DASHBOARD",
          desc: "A monitoring dashboard provides sensor graphs, SOS alerts, pressure information, emergency snapshots, and system status."
        },
        {
          num: "06",
          title: "AUTOMATED EMERGENCY RESPONSE",
          desc: "The system can trigger alerts, speaker announcements and emergency dispatch workflows when critical fire conditions are detected."
        }
      ],
      infoCard: {
        project: "Agnivaarak Fire System",
        focus: "AI/ML • Computer Vision • Fire Safety",
        platform: "Python / IoT / Web Dashboard",
        myContribution: "ML • Computer Vision • System Development",
        techStack: [
          "Python",
          "YOLOv8 • OpenCV",
          "FastAPI • React",
          "Arduino • GPIO",
          "MQTT • Sensors"
        ]
      },
      actions: {
        primary: {
          label: "Explore Project",
          icon: "fa-solid fa-arrow-up-right-from-square",
          url: "https://github.com/SrinjoyeeDey/Agnivaarak"
        }
      }
    },
    3: {
      id: "anchor",
      title: "Anchor",
      subtitle: "Grounded AI Knowledge System",
      category: "AI/ML • Generative AI • RAG",
      overviewHeading: "PROJECT OVERVIEW",
      overview: [
        "Anchor is a full-stack Retrieval-Augmented Generation system designed to generate answers grounded in information retrieved from a provided knowledge base rather than relying only on an LLM's general knowledge.",
        "Users can upload documents that are processed into searchable chunks. The system converts those chunks into vector embeddings and stores them in PostgreSQL using pgvector. When a user asks a question, the system retrieves relevant information through semantic similarity search and provides that context to the LLM before generating the final response.",
        "The workflow is orchestrated using LangGraph, with FastAPI handling the backend and React 19 providing the frontend interface."
      ],
      featuresHeading: "KEY CAPABILITIES",
      features: [
        {
          num: "01",
          title: "DOCUMENT INGESTION",
          desc: "Documents are processed, their text is extracted, and larger documents are divided into smaller searchable chunks that form the knowledge base."
        },
        {
          num: "02",
          title: "SEMANTIC VECTOR SEARCH",
          desc: "Document chunks and user queries are represented as vectors, allowing PostgreSQL with pgvector to retrieve semantically relevant information."
        },
        {
          num: "03",
          title: "GROUNDED GENERATION",
          desc: "Retrieved document context is passed to the LLM before response generation, helping keep answers connected to the available knowledge base."
        },
        {
          num: "04",
          title: "LANGGRAPH WORKFLOW",
          desc: "LangGraph orchestrates the RAG pipeline across query processing, retrieval, context handling, generation, and validation/fallback logic."
        },
        {
          num: "05",
          title: "MULTI-MODEL LLM LAYER",
          desc: "Llama 3.3 70B through OpenRouter is used as the primary model, with Gemini available as a fallback when required."
        },
        {
          num: "06",
          title: "FULL-STACK AI ARCHITECTURE",
          desc: "The system connects a React 19 frontend with a FastAPI backend, PostgreSQL/pgvector retrieval layer, LangGraph workflow, and external LLM services."
        }
      ],
      infoCard: {
        project: "Anchor",
        focus: "Generative AI • RAG • LLMs",
        platform: "Web • AI Backend",
        myContribution: "AI Architecture • Backend • RAG Pipeline",
        techStack: [
          "React 19",
          "FastAPI",
          "PostgreSQL • pgvector",
          "LangGraph",
          "Llama 3.3 • OpenRouter",
          "Gemini"
        ]
      },
      actions: {
        primary: {
          label: "Explore Project",
          icon: "fa-solid fa-arrow-up-right-from-square",
          url: "https://github.com/SrinjoyeeDey"
        },
        secondary: {
          label: "View Source",
          icon: "fa-brands fa-github",
          url: "https://github.com/SrinjoyeeDey"
        }
      }
    },
    4: {
      id: "nobodristhi",
      title: "Nobodristhi",
      subtitle: "AI-Powered News Verification System",
      category: "AI/ML • News Verification • Backend",
      overviewHeading: "PROJECT OVERVIEW",
      overview: [
        "Nobodristhi is an AI-powered news processing and verification backend designed to transform raw reports into structured, enriched, and moderated news entries.",
        "The system accepts incoming reports with text, location, and optional media, then processes them through background AI workflows. It uses geospatial clustering to identify reports occurring near the same location, LLM-based semantic similarity to determine whether reports describe the same event, and AI generation to produce structured headlines, summaries, and descriptions.",
        "It also supports reverse-image search for media verification and sends processed reports through an administrative moderation pipeline before they become part of the final public news ledger."
      ],
      featuresHeading: "KEY CAPABILITIES",
      features: [
        {
          num: "01",
          title: "AI-POWERED NEWS PROCESSING",
          desc: "Incoming reports are automatically processed using LLM-powered workflows to generate structured breaking headlines, summaries, and descriptions."
        },
        {
          num: "02",
          title: "GEOSPATIAL EVENT CLUSTERING",
          desc: "The system uses latitude/longitude information and the Haversine formula to identify reports occurring within a defined geographic radius and group potentially related events."
        },
        {
          num: "03",
          title: "SEMANTIC EVENT MATCHING",
          desc: "When reports are geographically related, LLM-based semantic similarity is used to determine whether they describe the same underlying event."
        },
        {
          num: "04",
          title: "MEDIA VERIFICATION",
          desc: "When a report does not include an image, the system can use reverse-image search through SerpAPI to locate relevant media based on the generated headline."
        },
        {
          num: "05",
          title: "AI PROCESSING PIPELINE",
          desc: "A background processing daemon separates heavier AI and clustering operations from the API request layer, allowing incoming reports to be stored quickly while processing happens independently."
        },
        {
          num: "06",
          title: "MODERATION & VERIFICATION",
          desc: "Processed reports enter an administrative moderation queue where authorized administrators can review and approve them before they are migrated into the final complete-news ledger."
        }
      ],
      infoCard: {
        project: "Nobodristhi",
        focus: "AI/ML • News Verification • Backend",
        platform: "Web Backend • REST API",
        myContribution: "AI/ML • Backend • System Development",
        techStack: [
          "Python • Flask",
          "PostgreSQL • Supabase",
          "OpenRouter • LLMs",
          "SerpAPI • REST APIs",
          "Haversine Clustering",
          "Background Worker"
        ]
      },
      actions: {
        primary: {
          label: "Watch Preview",
          icon: "fa-solid fa-play",
          url: "https://drive.google.com/file/d/1G6v34ZHr6KDTvnT2ezIzofBHMVTiMkUc/view?usp=drivesdk"
        },
        secondary: {
          label: "View Source",
          icon: "fa-brands fa-github",
          url: "https://github.com/SrinjoyeeDey"
        }
      }
    },
    5: {
      id: "nexvyapaar",
      title: "NexVyapaar",
      subtitle: "AI Business Assistant for Local Businesses",
      category: "AI/ML • Product • Business Intelligence",
      overviewHeading: "PROJECT OVERVIEW",
      overview: [
        "NexVyapaar is an AI-powered business assistant designed for local shop owners, retailers, and pharmacies.",
        "Instead of simply recording transactions, the platform turns sales and inventory information into practical business insights. It helps shop owners monitor stock, identify expiry risks, understand sales patterns, receive restock suggestions, and manage pharmacy-related compliance.",
        "The system is designed around an offline-first experience, multilingual interaction, and simple visual interfaces so that everyday business operations remain accessible even in environments with unreliable internet connectivity."
      ],
      whyHeading: "Product Philosophy & Workflow",
      whyBody: "Designed around the core principle: “AI advises. Owner decides.” The system assists the owner with reason-backed intelligence rather than replacing their decisions.\n\nConceptual Workflow: Business Data → Sales / Inventory Input → Local Data Storage → Analytics & Rule-Based Intelligence → Business Insights → AI-Assisted Suggestions → Shop Owner Decision.",
      featuresHeading: "KEY CAPABILITIES",
      features: [
        {
          num: "01",
          title: "AI BUSINESS COPILOT",
          desc: "Analyzes business information and provides reason-backed suggestions around demand, restocking, inventory, and expiry risks."
        },
        {
          num: "02",
          title: "SMART INVENTORY MANAGEMENT",
          desc: "Provides visibility into stock levels, fast-moving products, slow-moving products, and potential stock-out situations."
        },
        {
          num: "03",
          title: "EXPIRY RISK DETECTION",
          desc: "Tracks product expiry information and highlights items approaching expiry so that shop owners can act before inventory becomes waste."
        },
        {
          num: "04",
          title: "PHARMACY COMPLIANCE",
          desc: "Allows government medicine ban lists to be uploaded as CSV data and uses validation logic to flag banned medicines and prevent their billing."
        },
        {
          num: "05",
          title: "OFFLINE-FIRST STORE & SYNC",
          desc: "Supports store operations without continuous internet access, with local data handling and synchronization behavior when connectivity returns."
        },
        {
          num: "06",
          title: "MULTILINGUAL & VOICE EXPERIENCE",
          desc: "Provides regional-language support and voice-assisted onboarding, with an interface designed for users who may not be comfortable with complex software."
        }
      ],
      infoCard: {
        project: "NexVyapaar",
        focus: "AI/ML • Product • Business Intelligence",
        platform: "Web • Offline-First POS",
        myContribution: "Frontend • AI Logic • UX • System Design",
        demoStatus: "High-Fidelity Interactive Prototype",
        techStack: [
          "React • TypeScript",
          "Tailwind CSS • Framer Motion",
          "Context API",
          "Local Storage / IndexedDB",
          "i18n • CSV Validation",
          "Vite"
        ]
      },
      actions: {
        primary: {
          label: "Watch Preview",
          icon: "fa-solid fa-play",
          url: "https://github.com/SrinjoyeeDey/NexVyapaar"
        },
        secondary: {
          label: "View Source",
          icon: "fa-brands fa-github",
          url: "https://github.com/SrinjoyeeDey/NexVyapaar"
        }
      }
    },
    6: {
      id: "punarchakra",
      title: "Punarchakra",
      subtitle: "AI-Powered E-Waste Recycling Platform",
      category: "AI/ML • Sustainability • Web",
      overviewHeading: "PROJECT OVERVIEW",
      overview: [
        "Punarchakra, also presented as E-BIN, is a smart web-based platform focused on making e-waste recycling more accessible and engaging.",
        "The platform combines AI-assisted e-waste classification with a reward-driven recycling experience, helping users identify electronic waste and connect the act of responsible disposal with tangible incentives.",
        "The core idea is to turn e-waste from something people simply throw away into something that can be identified, processed, and redirected toward responsible recycling."
      ],
      whyHeading: "Product Concept & Workflow",
      whyBody: "Conceptual Flow: E-Waste → User Identification → AI-Assisted Classification → Recycling Category → Responsible Disposal → Reward Experience.\n\nThe system bridges the gap between environmental awareness and active participation by coupling classification intelligence with a motivating reward structure.",
      featuresHeading: "KEY CAPABILITIES",
      features: [
        {
          num: "01",
          title: "AI-ASSISTED CLASSIFICATION",
          desc: "Uses AI-assisted classification to help identify and categorize electronic waste."
        },
        {
          num: "02",
          title: "E-WASTE DISCOVERY",
          desc: "Provides a digital experience focused on helping users recognize discarded electronics as recyclable resources."
        },
        {
          num: "03",
          title: "REWARD-DRIVEN RECYCLING",
          desc: "Connects responsible e-waste disposal with a reward-oriented user experience designed to encourage participation."
        },
        {
          num: "04",
          title: "SMART RECYCLING EXPERIENCE",
          desc: "Brings classification, recycling awareness, and user interaction together through a single web-based platform."
        },
        {
          num: "05",
          title: "SUSTAINABILITY FOCUS",
          desc: "Encourages more responsible handling of electronic waste by making the recycling process easier to engage with."
        },
        {
          num: "06",
          title: "WEB-BASED PLATFORM",
          desc: "Provides a centralized digital interface for the e-waste recycling experience."
        }
      ],
      infoCard: {
        project: "Punarchakra / E-BIN",
        focus: "AI/ML • Sustainability • Recycling",
        platform: "Web",
        myContribution: "Product • AI/ML • Development",
        techStack: [
          "AI-Assisted Classification",
          "Web Platform",
          "Reward System"
        ]
      },
      actions: {
        primary: {
          label: "Visit Website",
          icon: "fa-solid fa-arrow-up-right-from-square",
          url: "https://punarchakra.vercel.app/"
        },
        secondary: {
          label: "View Source",
          icon: "fa-brands fa-github",
          url: "https://github.com/SrinjoyeeDey/Punarchakra"
        }
      }
    }
  };

  /* --------------------------------------------------------------------------
     2. INITIAL PAGE LOAD & NAVBAR NAVIGATION ENGINE
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .circle-arrow-btn, .back-to-top-btn, a[href^="#"]');
  const sectionLoaderOverlay = document.getElementById('section-loader-overlay');
  const loaderSectionName = document.getElementById('loader-section-name');
  const loaderPercentageNum = document.getElementById('loader-percentage');
  const loaderProgressBar = document.getElementById('loader-progress-bar');
  const loaderErrorActions = document.getElementById('loader-error-actions');
  const INITIAL_LOADER_DURATION = 3500; // Takes ~3.5s to count up to 100% and then opens the website

  // Function to smoothly run progress percentage from 0 to 100%
  function runPercentageProgress(duration, onComplete) {
    const startTime = performance.now();

    function updateProgress(currentTime) {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(1, elapsed / duration);

      // Smooth progression with dynamic text phases
      const percent = Math.min(100, Math.floor(progressRatio * 100));

      if (loaderPercentageNum) loaderPercentageNum.textContent = percent;
      if (loaderProgressBar) loaderProgressBar.style.width = `${percent}%`;

      if (loaderSectionName) {
        if (percent < 25) {
          loaderSectionName.textContent = 'INITIALIZING STUDIO...';
        } else if (percent < 55) {
          loaderSectionName.textContent = 'LOADING 3D ASSETS...';
        } else if (percent < 85) {
          loaderSectionName.textContent = 'PREPARING EXPERIENCE...';
        } else if (percent < 100) {
          loaderSectionName.textContent = 'FINALIZING...';
        } else {
          loaderSectionName.textContent = 'WELCOME TO PORTO!';
        }
      }

      if (progressRatio < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        if (loaderPercentageNum) loaderPercentageNum.textContent = '100';
        if (loaderProgressBar) loaderProgressBar.style.width = '100%';
        if (typeof onComplete === 'function') {
          setTimeout(onComplete, 280); // Brief satisfying pause at 100% before opening website
        }
      }
    }

    requestAnimationFrame(updateProgress);
  }

  // Initial Welcome Loader Sequence
  if (sectionLoaderOverlay) {
    let loaderDismissed = false;

    runPercentageProgress(INITIAL_LOADER_DURATION, () => {
      if (loaderDismissed) return;
      loaderDismissed = true;
      sectionLoaderOverlay.classList.remove('active');
      window.dispatchEvent(new CustomEvent('website-loaded'));
    });
  }

  // Global helper to show the 3D isometric loader with percentage
  window.showLoader = function(customText, duration = 1200, callback) {
    if (!sectionLoaderOverlay) {
      if (typeof callback === 'function') callback();
      return;
    }
    if (loaderErrorActions) loaderErrorActions.style.display = 'none';
    if (loaderSectionName) {
      loaderSectionName.style.backgroundColor = 'var(--color-yellow)';
      loaderSectionName.style.color = 'var(--color-charcoal)';
    }

    sectionLoaderOverlay.classList.add('active');

    runPercentageProgress(duration, () => {
      if (typeof callback === 'function') callback();
      setTimeout(() => {
        sectionLoaderOverlay.classList.remove('active');
      }, 200);
    });
  };

  // Global helper to hide the loader immediately
  window.hideLoader = function() {
    if (!sectionLoaderOverlay) return;
    sectionLoaderOverlay.classList.remove('active');
  };

  // Global helper to display loader during error state
  window.showErrorLoader = function(errorMsg) {
    if (!sectionLoaderOverlay) return;
    if (loaderSectionName) {
      loaderSectionName.textContent = errorMsg ? errorMsg.toUpperCase() : 'SOMETHING WENT WRONG.';
      loaderSectionName.style.backgroundColor = '#EF4444';
      loaderSectionName.style.color = '#FFFFFF';
    }
    if (loaderPercentageNum) loaderPercentageNum.textContent = '!';
    if (loaderProgressBar) {
      loaderProgressBar.style.width = '100%';
      loaderProgressBar.style.background = '#EF4444';
    }
    if (loaderErrorActions) loaderErrorActions.style.display = 'block';
    sectionLoaderOverlay.classList.add('active');
  };

  // Global helper for section transitions
  window.triggerSectionLoader = function(targetName, callback, duration = 1000) {
    window.showLoader(targetName ? `LOADING ${targetName}...` : 'LOADING...', duration, callback);
  };

  // Catch critical resource errors if desired
  window.addEventListener('error', (e) => {
    // Only capture critical script/resource blocking errors
    if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
      console.warn('Resource load error detected:', e.target);
    }
  }, true);

  // Instant smooth scrolling on Navbar Tab clicks (Layer-aware)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetId = href.slice(1);
        if (targetId === 'hero') {
          if (window.lenis) {
            window.lenis.scrollTo(0, { duration: 1.2 });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            if (window.lenis) {
              window.lenis.scrollTo(targetEl, { offset: 0, duration: 1.2 });
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }

        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          if (hamburgerBtn) hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
      }
    });
  });

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      hamburgerBtn.innerHTML = isExpanded ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
  }

  let navTicking = false;
  window.addEventListener('scroll', () => {
    if (!navTicking) {
      navTicking = true;
      requestAnimationFrame(() => {
        if (navbar) {
          if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }
        highlightNavOnScroll();
        navTicking = false;
      });
    }
  }, { passive: true });

  function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-menu .nav-link');
    const vhPoint = window.innerHeight * 0.45;

    sections.forEach(current => {
      const rect = current.getBoundingClientRect();
      const sectionId = current.getAttribute('id');

      if (rect.top <= vhPoint && rect.bottom >= vhPoint) {
        navItems.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. PROJECT GALLERY CATEGORY FILTERING
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     4. PROJECT DETAIL MODAL POPUP
     -------------------------------------------------------------------------- */
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBodyContent = document.getElementById('modal-body-content');

  function openProjectModalById(projectId) {
    const data = projectsData[projectId];

    if (data) {
      // Hero Media Panel: Use authentic project mark/title without fake screenshots
      let heroMediaHtml = '';
        if (data.id === 'vani') {
          heroMediaHtml = `
            <div class="modal-hero-banner vani-hero-banner">
              <div class="vani-hero-content">
                <div class="vani-hero-icon-badge">
                  <i class="fa-solid fa-heart-pulse"></i>
                </div>
                <div class="vani-hero-text">
                  <div class="vani-hero-brand-mark">VAni <span class="vani-brand-dot">.</span></div>
                  <p class="vani-hero-tagline">Your AI-Powered Recovery Companion</p>
                  <div class="vani-hero-capsules">
                    <span>Voice-First</span>
                    <span>Multilingual</span>
                    <span>Offline SOS</span>
                    <span>Caregiver Link</span>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else if (data.id === 'agnivaarak') {
          heroMediaHtml = `
            <div class="modal-hero-banner agnivaarak-hero-banner">
              <div class="agnivaarak-hero-content">
                <div class="agnivaarak-hero-icon-badge">
                  <i class="fa-solid fa-fire-flame-curved"></i>
                </div>
                <div class="agnivaarak-hero-text">
                  <div class="agnivaarak-hero-brand-mark">Agnivaarak <span class="agnivaarak-brand-dot">.</span></div>
                  <p class="agnivaarak-hero-tagline">Autonomous Fire Detection &amp; Suppression System</p>
                  <div class="agnivaarak-hero-capsules">
                    <span>YOLOv8s Vision</span>
                    <span>Sensor Fusion</span>
                    <span>Class A/B Fires</span>
                    <span>Nozzle Actuation</span>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else if (data.id === 'anchor') {
          heroMediaHtml = `
            <div class="modal-hero-banner anchor-hero-banner">
              <div class="anchor-hero-content">
                <div class="anchor-hero-icon-badge">
                  <i class="fa-solid fa-anchor"></i>
                </div>
                <div class="anchor-hero-text">
                  <div class="anchor-hero-brand-mark">Anchor <span class="anchor-brand-dot">.</span></div>
                  <p class="anchor-hero-tagline">Grounded AI Knowledge System</p>
                  <div class="anchor-hero-capsules">
                    <span>LangGraph Workflow</span>
                    <span>pgvector Search</span>
                    <span>Llama 3.3 70B</span>
                    <span>Gemini Fallback</span>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else if (data.id === 'nobodristhi') {
          heroMediaHtml = `
            <div class="modal-hero-banner nobodristhi-hero-banner">
              <div class="nobodristhi-hero-content">
                <div class="nobodristhi-hero-icon-badge">
                  <i class="fa-solid fa-newspaper"></i>
                </div>
                <div class="nobodristhi-hero-text">
                  <div class="nobodristhi-hero-brand-mark">Nobodristhi <span class="nobodristhi-brand-dot">.</span></div>
                  <p class="nobodristhi-hero-tagline">AI-Powered News Verification System</p>
                  <div class="nobodristhi-hero-capsules">
                    <span>Geospatial Clustering</span>
                    <span>Semantic Similarity</span>
                    <span>LLM Summarization</span>
                    <span>Media Verification</span>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else if (data.id === 'nexvyapaar') {
          heroMediaHtml = `
            <div class="modal-hero-banner nexvyapaar-hero-banner">
              <div class="nexvyapaar-hero-content">
                <div class="nexvyapaar-hero-icon-badge">
                  <i class="fa-solid fa-store"></i>
                </div>
                <div class="nexvyapaar-hero-text">
                  <div class="nexvyapaar-hero-brand-mark">NexVyapaar <span class="nexvyapaar-brand-dot">.</span></div>
                  <p class="nexvyapaar-hero-tagline">AI Business Assistant for Local Businesses</p>
                  <div class="nexvyapaar-hero-capsules">
                    <span>Offline-First POS</span>
                    <span>AI Copilot</span>
                    <span>Expiry Risk Detection</span>
                    <span>Pharmacy Compliance</span>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else if (data.id === 'punarchakra') {
          heroMediaHtml = `
            <div class="modal-hero-banner punarchakra-hero-banner">
              <div class="punarchakra-hero-content">
                <div class="punarchakra-hero-icon-badge">
                  <i class="fa-solid fa-recycle"></i>
                </div>
                <div class="punarchakra-hero-text">
                  <div class="punarchakra-hero-brand-mark">Punarchakra <span class="punarchakra-brand-dot">.</span> <span style="font-size: 1.1rem; color: #2DD4BF; font-weight: 700; margin-left: 6px;">(E-BIN)</span></div>
                  <p class="punarchakra-hero-tagline">AI-Powered E-Waste Recycling Platform</p>
                  <div class="punarchakra-hero-capsules">
                    <span>AI Classification</span>
                    <span>E-Waste Discovery</span>
                    <span>Reward System</span>
                    <span>Responsible Disposal</span>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else {
          heroMediaHtml = `
            <div class="modal-hero-banner standard-hero-banner">
              <div class="modal-banner-icon-circle">
                <i class="fa-solid ${getProjectIcon(projectId)}"></i>
              </div>
              <div class="modal-banner-title">${data.title}</div>
            </div>
          `;
        }

        modalBodyContent.innerHTML = `
          <!-- Header: Category & Titles -->
          <div class="modal-header-info">
            <span class="pill-badge-tag">${data.category}</span>
            <h2 class="modal-project-title">${data.title}</h2>
            ${data.subtitle ? `<p class="modal-project-subtitle">${data.subtitle}</p>` : ''}
          </div>
          
          <!-- Hero Media Panel -->
          ${heroMediaHtml}

          <!-- Two-Column Details Grid (Readable in 20-30 seconds) -->
          <div class="modal-details-grid">
            <!-- Left Main Column: Narrative & What We Built -->
            <div class="modal-main-column">
              <!-- Project Overview -->
              <div class="modal-narrative-block">
                <h4 class="modal-section-h4">${data.overviewHeading || 'Project Overview'}</h4>
                ${data.overview.map(p => `<p class="modal-body-p">${p}</p>`).join('')}
              </div>

              <!-- Why We Built It (Concise) -->
              ${data.whyHeading && data.whyBody ? `
                <div class="modal-narrative-block" style="margin-top: 22px;">
                  <h4 class="modal-section-h4">${data.whyHeading}</h4>
                  ${data.whyBody.split('\n\n').map(p => `<p class="modal-body-p">${p}</p>`).join('')}
                </div>
              ` : ''}

              <!-- What We Built (Exact 6 Feature Blocks for VAni) -->
              <div class="modal-narrative-block" style="margin-top: 26px;">
                <h4 class="modal-section-h4">${data.featuresHeading || 'What We Built'}</h4>
                <div class="modal-features-list">
                  ${data.features.map(f => `
                    <div class="modal-feature-item">
                      <span class="modal-feature-num">${f.num}</span>
                      <div class="modal-feature-text">
                        <h5 class="modal-feature-title">${f.title}</h5>
                        <p class="modal-feature-desc">${f.desc}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Right Column: Project Information Card (No Fake Clients or Timelines) -->
            <div class="modal-side-column">
              <div class="modal-info-panel">
                <div class="info-block">
                  <span class="info-label">PROJECT</span>
                  <p class="info-val">${data.infoCard.project}</p>
                </div>
                <div class="info-block">
                  <span class="info-label">FOCUS</span>
                  <p class="info-val">${data.infoCard.focus}</p>
                </div>
                <div class="info-block">
                  <span class="info-label">PLATFORM</span>
                  <p class="info-val">${data.infoCard.platform}</p>
                </div>
                <div class="info-block">
                  <span class="info-label">MY CONTRIBUTION</span>
                  <p class="info-val">${data.infoCard.myContribution}</p>
                </div>
                ${data.infoCard.demoStatus ? `
                <div class="info-block">
                  <span class="info-label">DEMO STATUS</span>
                  <p class="info-val">${data.infoCard.demoStatus}</p>
                </div>
                ` : ''}
                <div class="info-block">
                  <span class="info-label">TECH STACK</span>
                  <div class="tech-tags-flow">
                    ${data.infoCard.techStack.map(t => `<span class="tech-tag-badge">${t}</span>`).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Action Bar: Primary Action + Secondary Source + Close -->
          <div class="modal-footer-actions">
            <div class="modal-cta-group">
              ${data.actions.primary ? `
                <a href="${data.actions.primary.url}" target="_blank" rel="noopener noreferrer" class="btn-pill-primary-action interactive-hover-btn">
                  <span class="btn-text-initial">
                    <span>${data.actions.primary.label}</span>
                    <i class="${data.actions.primary.icon}"></i>
                  </span>
                  <span class="btn-hover-reveal">
                    <span>${data.actions.primary.label}</span>
                    <svg class="lucide-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                  <span class="btn-expanding-dot" aria-hidden="true"></span>
                </a>
              ` : ''}
              ${data.actions.secondary ? `
                <a href="${data.actions.secondary.url}" target="_blank" rel="noopener noreferrer" class="btn-pill-secondary-source interactive-hover-btn">
                  <span class="btn-text-initial">
                    <i class="${data.actions.secondary.icon}"></i>
                    <span>${data.actions.secondary.label}</span>
                  </span>
                  <span class="btn-hover-reveal">
                    <span>${data.actions.secondary.label}</span>
                    <svg class="lucide-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                  <span class="btn-expanding-dot" aria-hidden="true"></span>
                </a>
              ` : ''}
            </div>
            <button class="btn btn-pill-dark interactive-hover-btn" onclick="window.closeModal()">
              <span class="btn-text-initial">
                <span>Close View</span>
              </span>
              <span class="btn-hover-reveal">
                <span>Close</span>
                <svg class="lucide-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </span>
              <span class="btn-expanding-dot" aria-hidden="true"></span>
            </button>
          </div>
        `;
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
  }
  window.openProjectModalById = openProjectModalById;

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') && !e.target.closest('.project-overlay')) {
        return;
      }
      const projectId = card.getAttribute('data-id');
      openProjectModalById(projectId);
    });
  });

  function closeModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
  window.closeModal = closeModal;

  modalCloseBtn.addEventListener('click', closeModal);
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) closeModal();
  });

  /* --------------------------------------------------------------------------
     5. CONTACT FORM & TOAST NOTIFICATION
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        showToast("Message sent successfully! I'll get back to you within 24 hours.");
      }, 1200);
    });
  }

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  }

  /* --------------------------------------------------------------------------
     6. FLOATING SIDE GRADIENT COLOR REGULATOR ENGINE (Reference Match)
     -------------------------------------------------------------------------- */
  const sideDock = document.getElementById('side-regulator-dock');
  const dockToggleBtn = document.getElementById('dock-toggle-btn');
  const trackOuter = document.getElementById('regulator-track-outer');
  const track = document.getElementById('regulator-track');
  const thumb = document.getElementById('regulator-thumb');
  const tooltip = document.getElementById('regulator-tooltip');
  const tooltipName = document.getElementById('tooltip-color-name');
  const tooltipValue = document.getElementById('tooltip-value-percent');
  const particleCanvas = document.getElementById('particle-canvas');

  if (sideDock && dockToggleBtn) {
    dockToggleBtn.addEventListener('click', () => {
      sideDock.classList.toggle('collapsed');
    });
  }

  if (trackOuter && thumb) {
    const ctx = particleCanvas ? particleCanvas.getContext('2d') : null;
    let particles = [];

    // Continuous Vertical Gradient Color Stops (Mint -> Lemon -> Buttery -> Amber -> Coral -> Crimson)
    const colorStops = [
      { pos: 0.00, name: "Mint Fresh", r: 167, g: 243, b: 208 },
      { pos: 0.14, name: "Fresh Sage", r: 134, g: 239, b: 172 },
      { pos: 0.28, name: "Lemon Cream", r: 254, g: 240, b: 138 },
      { pos: 0.44, name: "Buttery Yellow", r: 253, g: 224, b: 71 },
      { pos: 0.60, name: "Golden Amber", r: 245, g: 158, b: 11 },
      { pos: 0.76, name: "Warm Coral", r: 249, g: 115, b: 22 },
      { pos: 0.90, name: "Soft Rose", r: 225, g: 29, b: 72 },
      { pos: 1.00, name: "Crimson Ruby", r: 159, g: 18, b: 57 }
    ];

    let isDragging = false;
    let targetRatio = 0.52; // Default starting position (52%)
    let currentRatio = 0.52;

    function resizeCanvas() {
      if (particleCanvas) {
        particleCanvas.width = 120;
        particleCanvas.height = 300;
      }
    }
    resizeCanvas();

    function interpolateColor(ratio) {
      const clamped = Math.max(0, Math.min(1, ratio));
      let lower = colorStops[0];
      let upper = colorStops[colorStops.length - 1];

      for (let i = 0; i < colorStops.length - 1; i++) {
        if (clamped >= colorStops[i].pos && clamped <= colorStops[i + 1].pos) {
          lower = colorStops[i];
          upper = colorStops[i + 1];
          break;
        }
      }

      const factor = (clamped - lower.pos) / (upper.pos - lower.pos || 1);
      const r = Math.round(lower.r + factor * (upper.r - lower.r));
      const g = Math.round(lower.g + factor * (upper.g - lower.g));
      const b = Math.round(lower.b + factor * (upper.b - lower.b));
      
      const nearestName = factor > 0.5 ? upper.name : lower.name;
      return { r, g, b, name: nearestName, rgbStr: `rgb(${r}, ${g}, ${b})` };
    }

    function updateRegulatorUI() {
      // Lerp for smooth spring movement
      currentRatio += (targetRatio - currentRatio) * 0.18;

      const trackRect = track.getBoundingClientRect();
      const thumbY = currentRatio * trackRect.height;

      thumb.style.top = `${thumbY}px`;
      tooltip.style.top = `${thumbY}px`;

      const colorData = interpolateColor(currentRatio);
      const percentInt = Math.round(currentRatio * 100);

      // Dynamic CSS variables for glowing elements & adaptive theme
      const rgbColor = colorData.rgbStr;
      const glowColor = `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, 0.65)`;
      const gridLineColor = `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, 0.55)`;
      const gridGlowColor = `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, 0.30)`;
      const gridSoftBg = `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, 0.12)`;

      document.documentElement.style.setProperty('--color-yellow', rgbColor);
      document.documentElement.style.setProperty('--color-yellow-hover', `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, 0.85)`);
      document.documentElement.style.setProperty('--current-color', rgbColor);
      document.documentElement.style.setProperty('--current-glow-color', glowColor);
      document.documentElement.style.setProperty('--current-grid-line', gridLineColor);
      document.documentElement.style.setProperty('--current-grid-glow', gridGlowColor);
      document.documentElement.style.setProperty('--current-grid-bg', gridSoftBg);

      if (tooltipName) tooltipName.textContent = colorData.name;
      if (tooltipValue) tooltipValue.textContent = `${percentInt}%`;

      // Adaptive background subtle tint shift
      document.body.style.backgroundImage = `radial-gradient(circle at 50% 30%, rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, 0.12) 0%, transparent 60%), linear-gradient(135deg, #ecece7 0%, #e1e2dd 50%, #eaeaea 100%)`;

      // Render Particle Canvas
      renderParticles(thumbY);

      requestAnimationFrame(updateRegulatorUI);
    }

    function spawnParticles(thumbY, count = 2) {
      if (!ctx) return;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: 60 + (Math.random() - 0.5) * 20,
          y: thumbY + 30 + (Math.random() - 0.5) * 15,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2 - 0.5,
          size: Math.random() * 5 + 2.5,
          opacity: 1,
          color: document.documentElement.style.getPropertyValue('--current-color') || '#F59E0B'
        });
      }
    }

    function renderParticles(thumbY) {
      if (!ctx) return;
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      if (isDragging && Math.random() < 0.7) {
        spawnParticles(thumbY, 2);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.03;

        if (p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function handleMove(e) {
      if (!isDragging) return;
      const rect = track.getBoundingClientRect();
      const trackHeight = rect.height || 240;
      const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;
      const y = clientY - rect.top;
      targetRatio = Math.max(0, Math.min(1, y / trackHeight));
    }

    function startDrag(e) {
      isDragging = true;
      thumb.classList.add('dragging');
      if (e.type === 'mousedown') {
        e.preventDefault();
      }
      handleMove(e);
    }

    function stopDrag() {
      if (isDragging) {
        isDragging = false;
        thumb.classList.remove('dragging');
      }
    }

    // Attach direct drag start listeners to thumb, track, and outer container
    [thumb, track, trackOuter].forEach(el => {
      if (el) {
        el.addEventListener('mousedown', startDrag);
        el.addEventListener('touchstart', startDrag, { passive: true });
      }
    });

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', stopDrag);

    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', stopDrag);
    window.addEventListener('touchcancel', stopDrag);

    // Start UI Loop
    requestAnimationFrame(updateRegulatorUI);
  }

  /* --------------------------------------------------------------------------
     7. MOUSE PARALLAX EFFECT FOR HERO DOODLES
     -------------------------------------------------------------------------- */
  const doodles = document.querySelectorAll('.doodle-item, .camera-doodle-wrapper');
  const heroSection = document.getElementById('hero');

  if (heroSection && window.innerWidth > 768) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      doodles.forEach(doodle => {
        const speed = parseFloat(doodle.getAttribute('data-speed')) || 1;
        const x = (clientX - centerX) * speed * 0.02;
        const y = (clientY - centerY) * speed * 0.02;
        doodle.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. MACOS DOCK 3-ICON HARDWARE-ACCELERATED ZERO-LAG ENGINE
     -------------------------------------------------------------------------- */
  const dockPanel = document.querySelector('.dock-panel');
  const dockItems = document.querySelectorAll('.dock-item');
  const maxScale = 1.35;
  const distance = 120;

  if (dockPanel && dockItems.length > 0) {
    let mouseX = Infinity;
    let animFrameId = null;

    function updateDockScale() {
      dockItems.forEach(item => {
        if (mouseX === Infinity) {
          item.style.transform = `scale3d(1, 1, 1)`;
          return;
        }

        const rect = item.getBoundingClientRect();
        const itemCenterX = rect.left + rect.width / 2;
        const dist = Math.abs(mouseX - itemCenterX);

        if (dist < distance) {
          const factor = Math.cos((dist / distance) * (Math.PI / 2));
          const scale = 1 + (maxScale - 1) * factor;
          item.style.transform = `scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, 1)`;
        } else {
          item.style.transform = `scale3d(1, 1, 1)`;
        }
      });
      animFrameId = null;
    }

    dockPanel.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(updateDockScale);
      }
    });

    dockPanel.addEventListener('mouseleave', () => {
      mouseX = Infinity;
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(updateDockScale);
      }
    });

    dockItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetHref = item.getAttribute('data-href');
        if (targetHref) {
          const targetId = targetHref.startsWith('#') ? targetHref.slice(1) : targetHref;
          if (targetId === 'hero') {
            if (window.lenis) {
              window.lenis.scrollTo(0, { duration: 1.2 });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } else {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              if (window.lenis) {
                window.lenis.scrollTo(targetEl, { offset: 0, duration: 1.2 });
              } else {
                targetEl.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     9. DYNAMIC RAPID SCROLL COUNTER ENGINE (Triggers Fast Every Scroll)
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounterFast(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 600; // Super fast 600ms rapid count-up
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentVal = Math.floor(progress * target);

      const formattedVal = (target < 10 && currentVal < 10) ? `0${currentVal}` : `${currentVal}`;
      el.textContent = `${formattedVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        const finalVal = (target < 10) ? `0${target}` : `${target}`;
        el.textContent = `${finalVal}${suffix}`;
      }
    }

    requestAnimationFrame(updateNumber);
  }

  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounterFast(entry.target);
        }
      });
    }, { threshold: 0.2 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
  }

  /* --------------------------------------------------------------------------
     10. PERSON CARD (Stationary Display)
     -------------------------------------------------------------------------- */
  // Card remains completely still as requested

  /* --------------------------------------------------------------------------
     12. MIMO 3D ROBOT AI CHATBOT INTERACTIVE CONTROLLER
     -------------------------------------------------------------------------- */
  const mimoTrigger = document.getElementById('mimo-chatbot-trigger');
  const mimoModal = document.getElementById('mimo-chatbot-modal');
  const mimoCloseBtn = document.getElementById('mimo-close-btn');
  const mimoForm = document.getElementById('mimo-chat-form');
  const mimoInput = document.getElementById('mimo-input-field');
  const mimoMessagesBody = document.getElementById('mimo-messages-body');
  const mimoQuickPills = document.getElementById('mimo-quick-pills');

  if (mimoTrigger && mimoModal) {
    // Isolate wheel and touch events so Lenis and page scroll never hijack chat scrolling
    const stopScrollHijack = (e) => {
      e.stopPropagation();
    };
    mimoModal.addEventListener('wheel', stopScrollHijack, { passive: true });
    mimoModal.addEventListener('touchmove', stopScrollHijack, { passive: true });
    if (mimoMessagesBody) {
      mimoMessagesBody.addEventListener('wheel', stopScrollHijack, { passive: true });
      mimoMessagesBody.addEventListener('touchmove', stopScrollHijack, { passive: true });
    }

    // Toggle Chat Modal
    mimoTrigger.addEventListener('click', () => {
      mimoModal.classList.toggle('hidden');
      if (!mimoModal.classList.contains('hidden')) {
        mimoInput?.focus();
        setTimeout(() => {
          if (mimoMessagesBody) {
            mimoMessagesBody.scrollTop = mimoMessagesBody.scrollHeight;
          }
        }, 120);
      }
    });

    mimoCloseBtn?.addEventListener('click', () => {
      mimoModal.classList.add('hidden');
    });

    // Helper: Add message bubble with interactive buttons & reactions
    function addMimoMessage(htmlContent, sender = 'bot', actionButtons = []) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `mimo-msg ${sender === 'bot' ? 'bot-msg' : 'user-msg'}`;
      
      const avatarHtml = sender === 'bot' ? '<div class="msg-avatar-icon">🤖</div>' : '<div class="msg-avatar-icon">👤</div>';
      
      let actionsHtml = '';
      if (actionButtons && actionButtons.length > 0) {
        actionsHtml = `<div class="mimo-inline-actions">` + 
          actionButtons.map(btn => `<button type="button" class="mimo-action-chip" data-action="${btn.action}" data-val="${btn.val || ''}">${btn.label}</button>`).join('') +
          `</div>`;
      }

      let reactionsHtml = '';
      if (sender === 'bot') {
        reactionsHtml = `
          <div class="mimo-reactions-bar">
            <button type="button" class="mimo-reaction-btn" data-emoji="😂" title="Laugh">😂 <span class="rx-count">0</span></button>
            <button type="button" class="mimo-reaction-btn" data-emoji="🔥" title="Fire">🔥 <span class="rx-count">0</span></button>
            <button type="button" class="mimo-reaction-btn" data-emoji="❤️" title="Love">❤️ <span class="rx-count">0</span></button>
          </div>
        `;
      }

      msgDiv.innerHTML = `${avatarHtml}<div class="msg-bubble"><p>${htmlContent}</p>${actionsHtml}${reactionsHtml}</div>`;

      mimoMessagesBody.appendChild(msgDiv);
      requestAnimationFrame(() => {
        mimoMessagesBody.scrollTop = mimoMessagesBody.scrollHeight;
      });
    }

    // Helper: Show bot typing indicator
    function showTypingIndicator(callback) {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'mimo-msg bot-msg typing-msg';
      typingDiv.innerHTML = `<div class="msg-avatar-icon">🤖</div><div class="msg-bubble"><p><em>Mimo is cooking up a reply... 💭</em></p></div>`;
      mimoMessagesBody.appendChild(typingDiv);
      requestAnimationFrame(() => {
        mimoMessagesBody.scrollTop = mimoMessagesBody.scrollHeight;
      });

      setTimeout(() => {
        typingDiv.remove();
        callback();
      }, 500);
    }

    // Sarcastic Roasts Pool
    const MIMO_ROASTS = [
      "Srinjoyee spent 3 hours deciding between two shades of charcoal grey that look identical to every human with normal 20/20 vision. Meanwhile, you're chatting with a yellow robot on the internet instead of finishing your work. We are both running on questionable life choices. 😭🔥",
      "Her Git commit history goes from <em>'Initial microservices architecture commit'</em> at 11 AM to <em>'PLEASE JUST WORK BRO I BEG YOU I WILL NEVER COMMIT TO MAIN AGAIN'</em> at 3:45 AM. Pure software engineering perfectionism. 💅",
      "Srinjoyee has 6 hackathon wins, 4 years of UI/UX craft, and still refreshes the browser 15 times to see if 1px margin-top actually changed. Don't worry, we don't judge. 🤡",
      "You want a roast? You've scrolled all the way through this portfolio without hiring Srinjoyee or sending a message. That's a bigger bug than an unclosed &lt;div&gt; tag in production! 💥"
    ];

    // Dev Excuses Pool
    const DEV_EXCUSES = [
      "🐛 <em>'It works completely fine on my machine. Maybe your browser is emotionally unstable?'</em>",
      "🐛 <em>'That's not a bug. It's an undocumented surprise feature with spicy behavior!'</em>",
      "🐛 <em>'A cosmic solar flare definitely flipped a bit in the server cache right when you clicked that.'</em>",
      "🐛 <em>'The AI hallucinated that requirement, I just wrote the unit tests!'</em>",
      "🐛 <em>'Somebody pushed directly to main on a Friday at 5:59 PM and immediately slammed their laptop shut.'</em>"
    ];

    // Helper: Clear Chat
    function clearMimoChat() {
      mimoMessagesBody.innerHTML = `
        <div class="mimo-msg bot-msg">
          <div class="msg-avatar-icon">🤖</div>
          <div class="msg-bubble">
            <p>🧹 <em>*Poof!*</em> Chat history wiped clean. Slate reset! What do you wanna check out now, friend?</p>
            <div class="mimo-inline-actions">
              <button type="button" class="mimo-action-chip" data-action="query" data-val="projects">🚀 Projects</button>
              <button type="button" class="mimo-action-chip" data-action="query" data-val="roast">🔥 Roast Srinjoyee</button>
              <button type="button" class="mimo-action-chip" data-action="query" data-val="excuse">🎲 Dev Excuse</button>
              <button type="button" class="mimo-action-chip" data-action="query" data-val="gossip">☕ Dev Tea</button>
            </div>
            <div class="mimo-reactions-bar">
              <button type="button" class="mimo-reaction-btn" data-emoji="😂" title="Laugh">😂 <span class="rx-count">0</span></button>
              <button type="button" class="mimo-reaction-btn" data-emoji="🔥" title="Fire">🔥 <span class="rx-count">0</span></button>
              <button type="button" class="mimo-reaction-btn" data-emoji="❤️" title="Love">❤️ <span class="rx-count">0</span></button>
            </div>
          </div>
        </div>
      `;
    }

    // Bot Response Logic
    function handleQuery(queryText) {
      const q = queryText.toLowerCase().trim();
      let reply = "";
      let actions = [];

      if (q.includes('work') || q.includes('project') || q.includes('build')) {
        reply = "Oh, you want to see actual code and engineering? Thank goodness, I thought you were gonna ask me to write a poem about cryptocurrency. 😂<br><br>Srinjoyee builds heavy-duty full-stack & edge AI systems that solve real problems (zero generic todo-app filler):<br>• 🛰️ <strong>Nobodristhi:</strong> Drone AI saving humans during floods<br>• 🩺 <strong>Vani:</strong> Audio tele-triage streaming live vitals<br>• 🔥 <strong>Agnivaarak:</strong> Edge fire surveillance engine<br>• ⚡ <strong>NexVyapaar:</strong> Offline retail POS for local stores<br>• ♻️ <strong>Punarchakra:</strong> Circular economy AI e-waste classifier<br>• 🔐 <strong>Anchor:</strong> Vector knowledge memory vault";
        actions = [
          { label: '🚀 Jump to Projects Deck', action: 'navigate', val: 'projects' },
          { label: '🔥 Roast Srinjoyee', action: 'query', val: 'roast' },
          { label: '🛠️ Actual Skills', action: 'query', val: 'skills' }
        ];
        showTypingIndicator(() => {
          addMimoMessage(reply, 'bot', actions);
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        });
        return;
      }

      if (q.includes('roast')) {
        const roast = MIMO_ROASTS[Math.floor(Math.random() * MIMO_ROASTS.length)];
        reply = roast;
        actions = [
          { label: '🔥 Roast Again', action: 'query', val: 'roast' },
          { label: '☕ Spill Dev Tea', action: 'query', val: 'gossip' },
          { label: '🎲 Dev Excuse', action: 'query', val: 'excuse' }
        ];
        showTypingIndicator(() => {
          addMimoMessage(reply, 'bot', actions);
        });
        return;
      }

      if (q.includes('excuse') || q.includes('bug')) {
        const excuse = DEV_EXCUSES[Math.floor(Math.random() * DEV_EXCUSES.length)];
        reply = `<strong>OFFICIAL DEVELOPER EXCUSE GENERATOR:</strong><br><br>${excuse}`;
        actions = [
          { label: '🔄 Another Excuse', action: 'query', val: 'excuse' },
          { label: '☕ Dev Tea', action: 'query', val: 'gossip' },
          { label: '🚀 Show Projects', action: 'query', val: 'projects' }
        ];
        showTypingIndicator(() => {
          addMimoMessage(reply, 'bot', actions);
        });
        return;
      }

      if (q.includes('tea') || q.includes('gossip') || q.includes('secret')) {
        reply = "<strong>CONFIDENTIAL DEV TEA ☕:</strong><br><br>1. Half of Srinjoyee's code comments are literally just <em>'DO NOT TOUCH THIS OR THE WHOLE UNIVERSE BREAKS'</em>.<br>2. She drinks so much coffee her blood type is probably Espresso Positive.<br>3. Zero jQuery was harmed in building this site. Pure modern JavaScript, GSAP & React elegance.";
        actions = [
          { label: '🔥 Roast Her', action: 'query', val: 'roast' },
          { label: '🛠️ Actual Skills', action: 'query', val: 'skills' },
          { label: '📩 Hire Her Now', action: 'query', val: 'hire' }
        ];
        showTypingIndicator(() => {
          addMimoMessage(reply, 'bot', actions);
        });
        return;
      }

      if (q.includes('coin') || q.includes('flip')) {
        const isHeads = Math.random() > 0.3;
        reply = `Flipping quantum decision coin... 🪙<br><br>Result: <strong>${isHeads ? 'HEADS! 🎉' : 'TAILS! 🎯'}</strong><br>The universe has spoken: You must hire Srinjoyee immediately.<br><em>(Note: Even if it landed on edge, company protocol dictates you still hire her. I don't make the rules).</em>`;
        actions = [
          { label: '🪙 Flip Again', action: 'query', val: 'coin' },
          { label: '📩 Hire Her Now', action: 'query', val: 'hire' },
          { label: '🚀 Show Projects', action: 'query', val: 'projects' }
        ];
        showTypingIndicator(() => {
          addMimoMessage(reply, 'bot', actions);
        });
        return;
      }

      if (q.includes('skill') || q.includes('tool') || q.includes('stack')) {
        reply = "Here's what Srinjoyee brings to the table (besides relentless energy and caffeine):<br>• <strong>Frontend:</strong> React, Three.js, WebGL, GSAP, Tailwind & Vanilla CSS (can center a &lt;div&gt; with eyes closed).<br>• <strong>Backend & AI:</strong> Python, Node, PyTorch, Edge AI, FastAPI.<br>• <strong>Databases:</strong> PostgreSQL, Redis, Vector Embeddings.<br>• <strong>Soft Skills:</strong> Explaining to clients why 'just making the logo bigger' won't double their conversion rate. 🎯";
        actions = [
          { label: '🚀 See Featured Builds', action: 'query', val: 'projects' },
          { label: '📩 Let\'s Talk', action: 'query', val: 'hire' }
        ];
        showTypingIndicator(() => {
          addMimoMessage(reply, 'bot', actions);
        });
        return;
      }

      if (q.includes('hire') || q.includes('contact') || q.includes('mail') || q.includes('freelance') || q.includes('job')) {
        reply = "10/10 engineers and startup founders recommend hiring Srinjoyee before she gets poached by Big Tech. 🤝<br><br>She specializes in full-stack platforms, high-performance interactive UI/UX, and AI applications.<br><br>Drop an email at: <strong>hello@srinjoyee.dev</strong>";
        actions = [
          { label: '📋 Copy Email', action: 'copy', val: 'hello@srinjoyee.dev' },
          { label: '⬇️ Scroll to Contact Form', action: 'navigate', val: 'contact' }
        ];
        showTypingIndicator(() => {
          addMimoMessage(reply, 'bot', actions);
        });
        return;
      }

      if (q.includes('about') || q.includes('yourself') || q.includes('who') || q.includes('experience')) {
        reply = "Srinjoyee is a multidisciplinary visual technologist & software developer who loves building products that look insanely gorgeous and perform at lightning speed. ⚡<br><br>When she isn't coding, she's designing, participating in national hackathons, or training me (Mimo) to be less sarcastic. <em>Clearly that last part isn't going well.</em> 😉";
        actions = [
          { label: '👀 Check About Section', action: 'navigate', val: 'about' },
          { label: '🔥 Roast Her', action: 'query', val: 'roast' },
          { label: '🚀 Projects', action: 'query', val: 'projects' }
        ];
        showTypingIndicator(() => {
          addMimoMessage(reply, 'bot', actions);
        });
        return;
      }

      if (q.includes('clear') || q.includes('clean') || q.includes('reset')) {
        clearMimoChat();
        return;
      }

      // Default Sarcastic Fallback
      reply = `Beep boop! 🤖 My neural pathways didn't compute <em>"${queryText}"</em>. But hey, don't leave me hanging! Try clicking one of the buttons below to see projects, get a sarcastic roast, or flip a coin! ✨`;
      actions = [
        { label: '🚀 Projects', action: 'query', val: 'projects' },
        { label: '🔥 Roast Srinjoyee', action: 'query', val: 'roast' },
        { label: '🎲 Dev Excuse', action: 'query', val: 'excuse' },
        { label: '☕ Dev Tea', action: 'query', val: 'gossip' }
      ];
      showTypingIndicator(() => {
        addMimoMessage(reply, 'bot', actions);
      });
    }

    // Form Submission
    mimoForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = mimoInput.value.trim();
      if (!text) return;

      addMimoMessage(text, 'user');
      mimoInput.value = '';
      handleQuery(text);
    });

    // Quick Pill Buttons
    mimoQuickPills?.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-pill-btn');
      if (btn) {
        const query = btn.getAttribute('data-query');
        addMimoMessage(btn.textContent.trim(), 'user');
        handleQuery(query);
      }
    });

    // Click handler for Inline Reactions & Action Chips inside Mimo messages
    mimoMessagesBody.addEventListener('click', (e) => {
      // 1. Reaction button click
      const rxBtn = e.target.closest('.mimo-reaction-btn');
      if (rxBtn) {
        const countSpan = rxBtn.querySelector('.rx-count');
        if (countSpan) {
          const count = parseInt(countSpan.textContent || '0', 10);
          countSpan.textContent = count + 1;
          rxBtn.classList.add('reacted');
        }
        return;
      }

      // 2. Action chip click
      const actionBtn = e.target.closest('.mimo-action-chip');
      if (actionBtn) {
        const action = actionBtn.getAttribute('data-action');
        const val = actionBtn.getAttribute('data-val');
        if (action === 'navigate') {
          const target = document.getElementById(val);
          target?.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'query') {
          addMimoMessage(actionBtn.textContent.trim(), 'user');
          handleQuery(val);
        } else if (action === 'copy') {
          navigator.clipboard?.writeText(val).catch(() => {});
          const original = actionBtn.textContent;
          actionBtn.textContent = '✅ Email Copied!';
          setTimeout(() => {
            actionBtn.textContent = original;
          }, 2500);
        } else if (action === 'clear') {
          clearMimoChat();
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     13. MONOCHROMATIC CLAY TERMINAL INTERACTIVE CLI CONTROLLER
     -------------------------------------------------------------------------- */
  const clayTerminalInput = document.getElementById('clay-terminal-input');
  const clayTerminalOutput = document.getElementById('clay-terminal-output');
  const runClayBtn = document.getElementById('run-clay-cmd-btn');

  if (clayTerminalInput && clayTerminalOutput) {
    const TERMINAL_ROASTS = [
      "🔥 SYSTEM ROAST: You have 52 browser tabs open, 4 of which are StackOverflow answers from 2018. Your posture right now looks like a boiled shrimp. Sit up straight!",
      "🔥 SYSTEM ROAST: You've spent the last 5 minutes testing random commands in a website terminal instead of doing what you opened your laptop for. We see you.",
      "🔥 SYSTEM ROAST: Your internet ping has more emotional baggage than a junior dev pushing directly to production on Friday at 5:59 PM."
    ];

    const TERMINAL_JOKES = [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🍺",
      "Why do Java developers wear glasses? Because they don't C#! 👓",
      "There are 10 types of people in the world: those who understand binary, and those who don't! 🤖",
      "A QA engineer walks into a bar. Runs into a bar. Crawls into a bar. Orders a beer. Orders 0 beers. Orders 999999999 beers. Orders a lizard. Orders -1 beers. A real customer walks in and asks where the bathroom is. The bar crashes and burns."
    ];

    function executeClayCommand(commandStr) {
      const cmd = commandStr.trim().toLowerCase();
      if (!cmd) return;

      // Append command prompt line
      const promptLine = document.createElement('div');
      promptLine.className = 'term-line prompt-line';
      promptLine.innerHTML = `<span class="term-prompt">srinjoyee@porto-cli ~$</span> <span class="typed-cmd">${commandStr}</span>`;
      clayTerminalOutput.appendChild(promptLine);

      // Response container
      const respLine = document.createElement('div');
      respLine.className = 'term-line output-block';

      switch (cmd) {
        case 'help':
          respLine.innerHTML = `
            <p><strong class="term-yellow">⌨️ CLI COMMANDS (Run while pretending to be busy):</strong></p>
            <p>&nbsp;&nbsp;<strong class="term-green">about</strong>    - Who made this & why they need sleep</p>
            <p>&nbsp;&nbsp;<strong class="term-green">skills</strong>   - Actual skills (yes, includes git push --force)</p>
            <p>&nbsp;&nbsp;<strong class="term-green">projects</strong> - Proof that caffeine produces software</p>
            <p>&nbsp;&nbsp;<strong class="term-green">roast</strong>    - Brutal roast of your browser & life choices 🔥</p>
            <p>&nbsp;&nbsp;<strong class="term-green">sudo</strong>     - High privilege access (or so you thought)</p>
            <p>&nbsp;&nbsp;<strong class="term-green">contact</strong>  - Job offers, funding, or funny memes</p>
            <p>&nbsp;&nbsp;<strong class="term-green">hack</strong>     - Simulate NASA breach (FBI don't look) 💻</p>
            <p>&nbsp;&nbsp;<strong class="term-green">coffee</strong>   - Liquid sanity booster ☕</p>
            <p>&nbsp;&nbsp;<strong class="term-green">joke</strong>     - Developer humor to distract from bugs 🎭</p>
            <p>&nbsp;&nbsp;<strong class="term-green">tea</strong>      - Confidential dev gossip & behind-the-scenes</p>
            <p>&nbsp;&nbsp;<strong class="term-green">clear</strong>    - Wipe away the evidence 🧹</p>
          `;
          break;

        case 'about':
        case 'bio':
          respLine.innerHTML = `
            <p>👋 <strong class="term-yellow">SRINJOYEE DEY // HUMAN SPECIFICATION:</strong></p>
            <p>• Role: Full-Stack Engineer, AI Architect & Visual Technologist.</p>
            <p>• Motto: <em>"If it works on my machine, we pack my laptop in a crate and ship it to AWS."</em></p>
            <p>• Daily Routine: Writing clean code, winning national hackathons, and debugging CSS flexbox at 3 AM.</p>
            <p>• Warning: Highly allergic to bad typography, bloated npm packages, and unnecessary meetings that could have been an email.</p>
          `;
          break;

        case 'skills':
          respLine.innerHTML = `
            <p>⚡ <strong class="term-yellow">ACTUAL TECHNICAL ARSENAL:</strong></p>
            <p>&nbsp;&nbsp;[FRONTEND]     React, Three.js, GSAP, WebGL (Can center a &lt;div&gt; with both eyes closed).</p>
            <p>&nbsp;&nbsp;[AI & BACKEND] Python, PyTorch, Edge AI, Node.js, FastAPI (Models that don't hallucinate your grandma's cookie recipe).</p>
            <p>&nbsp;&nbsp;[DATABASE]     PostgreSQL, Redis, Vector Embeddings (Remembers data better than you remember your passwords).</p>
            <p>&nbsp;&nbsp;[SOFT SKILL]   Explaining to stakeholders why an 'easy 5-minute button tweak' requires re-architecting the backend.</p>
          `;
          break;

        case 'projects':
        case 'works':
          respLine.innerHTML = `
            <p>🚀 <strong class="term-yellow">FEATURED BUILDS (Real software, zero todo-app filler):</strong></p>
            <p> 1. 🛰️ <strong class="term-green">Nobodristhi:</strong> AI aerial vision for disaster triage & flood rescues.</p>
            <p> 2. 🩺 <strong class="term-green">Vani:</strong> Audio-first patient vitals triage system for critical care.</p>
            <p> 3. 🔥 <strong class="term-green">Agnivaarak:</strong> Edge surveillance spotting fires before marshmallows burn.</p>
            <p> 4. ⚡ <strong class="term-green">NexVyapaar:</strong> Offline-first POS for Indian retail (smarter than SAP).</p>
            <p> 5. ♻️ <strong class="term-green">Punarchakra:</strong> Circular economy AI classifier (Earth thanks us).</p>
            <p> 6. 🔐 <strong class="term-green">Anchor:</strong> High-dimensional vector memory vault tighter than Fort Knox.</p>
            <p><span class="term-yellow">▶ Navigating directly to Projects showcase deck...</span></p>
          `;
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          break;

        case 'roast':
          const roast = TERMINAL_ROASTS[Math.floor(Math.random() * TERMINAL_ROASTS.length)];
          respLine.innerHTML = `<p>${roast}</p>`;
          break;

        case 'sudo':
          respLine.innerHTML = `
            <p class="term-red">🚫 [PERMISSION DENIED] User is not in the sudoers file.</p>
            <p class="term-muted">This incident has been logged and reported to Santa Claus 🎅. Your browser history is currently being judged.</p>
          `;
          break;

        case 'contact':
          respLine.innerHTML = `
            <p>📩 <strong class="term-yellow">REACH OUT TO SRINJOYEE:</strong></p>
            <p>• Email: <span class="term-green">hello@srinjoyee.dev</span></p>
            <p>• Direct: Scroll to the contact form below or reach out via LinkedIn!</p>
            <p>• Pro Tip: Mentioning coffee or cool tech ideas increases reply speed by 250%.</p>
            <p><span class="term-green">▶ Scrolling to contact form...</span></p>
          `;
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          break;

        case 'joke':
          const randomJoke = TERMINAL_JOKES[Math.floor(Math.random() * TERMINAL_JOKES.length)];
          respLine.innerHTML = `<p>😂 <strong class="term-yellow">DEV JOKE:</strong> ${randomJoke}</p>`;
          break;

        case 'resume':
          respLine.innerHTML = `
            <p>📄 <strong class="term-yellow">SRINJOYEE RESUME:</strong></p>
            <p> Full-Stack AI Engineer & Creative Developer. Proven hackathon winner, scalable backend architect, and UI specialist.</p>
            <p> 📥 <span class="term-green">Ready to interview? Scroll to Contact section or email hello@srinjoyee.dev!</span></p>
          `;
          break;

        case 'tea':
        case 'gossip':
          respLine.innerHTML = `
            <p>☕ <strong class="term-yellow">CONFIDENTIAL DEV TEA:</strong></p>
            <p>• Srinjoyee once debugged an issue for 6 hours only to realize the server was running on port 3001 instead of 3000.</p>
            <p>• Half her code comments are just 'PLEASE DONT TOUCH OR REALITY COLLAPSES'.</p>
            <p>• Zero jQuery was harmed in building this site. Pure modern JavaScript & CSS.</p>
          `;
          break;

        case 'hack':
          respLine.innerHTML = `
            <p class="term-green">INITIALIZING ROOT PROTOCOL OVERRIDE...</p>
            <p class="term-green">[████████████████████] 100% SECURITY PURGED</p>
            <p class="term-highlight">░▒▓█ CONGRATULATIONS: You just hacked your own time. █▓▒░</p>
            <p class="term-muted">Now scroll down and hire Srinjoyee before your next release deadline hits.</p>
          `;
          break;

        case 'coffee':
          respLine.innerHTML = `
            <p class="term-yellow">
               (  )   (   )  )<br>
                ) (   )  (  (<br>
              (____)____)____)<br>
              \\              /<br>
               \\  COFFEE    /<br>
                \\_________/
            </p>
            <p class="term-green">☕ Caffeine level boosted to 100%! Ready to compile, ship, and conquer!</p>
          `;
          break;

        case 'clear':
          clayTerminalOutput.innerHTML = `
            <div class="term-line sys-welcome">
              <span class="term-green">LIVE_TERMINAL</span>
            </div>
            <div class="term-line">
              <span class="term-muted">--------------------------------------------------------------------------</span>
            </div>
            <div class="term-line">
              <span>$ Terminal wiped clean. Type <strong class="term-yellow">'help'</strong> or click chips below!</span>
            </div>
          `;
          clayTerminalInput.value = '';
          return;

        default:
          respLine.innerHTML = `<p class="term-muted">zsh: command not found: "${commandStr}". Did you mean <span class="term-yellow">'help'</span>? Or did your cat step on the keyboard again? 🐱</p>`;
          break;
      }

      clayTerminalOutput.appendChild(respLine);
      clayTerminalOutput.scrollTop = clayTerminalOutput.scrollHeight;
      clayTerminalInput.value = '';
    }

    // Input Keydown listener (Enter key)
    clayTerminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeClayCommand(clayTerminalInput.value);
      }
    });

    runClayBtn?.addEventListener('click', () => {
      executeClayCommand(clayTerminalInput.value);
    });

    // Quick Command Buttons via Event Delegation
    document.addEventListener('click', (e) => {
      const tag = e.target.closest('.clay-tag-btn');
      if (tag) {
        const cmd = tag.getAttribute('data-cmd');
        if (cmd) {
          clayTerminalInput.value = cmd;
          executeClayCommand(cmd);
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     14. SCRAPBOOK PERSONA EMPTY IMAGE SLOTS (Upload & Drag-and-Drop)
     -------------------------------------------------------------------------- */
  const scrapbookSlots = document.querySelectorAll('.scrapbook-empty-image-slot');
  scrapbookSlots.forEach((slot) => {
    const fileInput = slot.querySelector('.scrapbook-file-picker');
    const previewImg = slot.querySelector('.scrapbook-slot-img');
    const placeholder = slot.querySelector('.empty-slot-placeholder') || slot.querySelector('.plant-art-svg-box');

    if (!fileInput || !previewImg) return;

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImg.src = event.target.result;
          previewImg.style.display = 'block';
          if (placeholder) placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });

    // Drag and drop support
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      slot.style.borderColor = '#FFBD12';
    });
    slot.addEventListener('dragleave', () => {
      slot.style.borderColor = '';
    });
    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImg.src = event.target.result;
          previewImg.style.display = 'block';
          if (placeholder) placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
  });
});

/* ==========================================================================
   EDITORIAL SHOWCASE (OVERVIEW & COMPETENCIES) IMAGE SLOTS & CONTROLS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const editorialSlots = [
    {
      key: 'overview',
      slotEl: document.getElementById('slot-overview'),
      inputEl: document.getElementById('upload-overview-img'),
      previewEl: document.getElementById('img-overview-preview'),
      placeholderEl: document.getElementById('placeholder-overview'),
      controlsEl: document.getElementById('controls-overview')
    },
    {
      key: 'competencies',
      slotEl: document.getElementById('slot-competencies'),
      inputEl: document.getElementById('upload-competencies-img'),
      previewEl: document.getElementById('img-competencies-preview'),
      placeholderEl: document.getElementById('placeholder-competencies'),
      controlsEl: document.getElementById('controls-competencies')
    }
  ];

  function setSlotImage(slotObj, dataUrl) {
    if (!slotObj.previewEl || !slotObj.placeholderEl) return;
    slotObj.previewEl.src = dataUrl;
    slotObj.previewEl.style.display = 'block';
    slotObj.placeholderEl.style.display = 'none';
    if (slotObj.controlsEl) slotObj.controlsEl.style.display = 'flex';
    try {
      localStorage.setItem(`editorial_slot_${slotObj.key}`, dataUrl);
    } catch (err) {
      console.warn('LocalStorage quota exceeded or unavailable:', err);
    }
  }

  window.removeSlotImage = function(slotKey) {
    const slotObj = editorialSlots.find(s => s.key === slotKey);
    if (!slotObj) return;
    if (slotObj.previewEl) {
      slotObj.previewEl.src = '';
      slotObj.previewEl.style.display = 'none';
    }
    if (slotObj.placeholderEl) {
      slotObj.placeholderEl.style.display = 'flex';
    }
    if (slotObj.controlsEl) {
      slotObj.controlsEl.style.display = 'none';
    }
    if (slotObj.inputEl) {
      slotObj.inputEl.value = '';
    }
    try {
      localStorage.removeItem(`editorial_slot_${slotKey}`);
    } catch (err) {}
  };

  editorialSlots.forEach(slot => {
    if (!slot.slotEl || !slot.inputEl) return;

    // Restore saved images from localStorage if any
    try {
      const saved = localStorage.getItem(`editorial_slot_${slot.key}`);
      if (saved) {
        setSlotImage(slot, saved);
      }
    } catch (err) {}

    // File input change
    slot.inputEl.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setSlotImage(slot, event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });

    // Drag and Drop
    slot.slotEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      slot.slotEl.classList.add('drag-over');
    });

    slot.slotEl.addEventListener('dragleave', () => {
      slot.slotEl.classList.remove('drag-over');
    });

    slot.slotEl.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.slotEl.classList.remove('drag-over');
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setSlotImage(slot, event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // Action buttons: Expand & Zoom
  const btnExpand = document.getElementById('btn-editorial-expand');
  const btnZoom = document.getElementById('btn-editorial-zoom');
  const compVisual = document.querySelector('.slot-competencies-stage');

  if (btnZoom && compVisual) {
    let zoomed = false;
    btnZoom.addEventListener('click', () => {
      zoomed = !zoomed;
      compVisual.style.transform = zoomed ? 'scale(1.05)' : '';
      compVisual.style.boxShadow = zoomed ? '0 25px 50px rgba(190, 43, 38, 0.25)' : '';
      btnZoom.style.background = zoomed ? '#be2b26' : '';
      btnZoom.style.color = zoomed ? '#ffffff' : '';
    });
  }

  if (btnExpand) {
    btnExpand.addEventListener('click', () => {
      const targetSec = document.getElementById('editorial-overview');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetSec.style.transition = 'transform 0.3s ease';
        targetSec.style.transform = 'scale(1.01)';
        setTimeout(() => {
          targetSec.style.transform = '';
        }, 400);
      }
    });
  }

  /* --------------------------------------------------------------------------
     MOTION DESIGNER SECTION TOGGLE CONTROLLER
     -------------------------------------------------------------------------- */
  const btnToggleMotion = document.getElementById('btn-toggle-motion-designer');
  const btnCloseMotion = document.getElementById('btn-close-motion-designer');
  const scrapbookSection = document.getElementById('scrapbook');
  const motionLauncher = document.getElementById('motion-designer-launcher');
  const navPersonaLink = document.querySelector('a[href="#scrapbook"]');

  function openMotionDesigner(andScroll = true) {
    if (!scrapbookSection) return;
    scrapbookSection.style.display = 'block';
    scrapbookSection.classList.remove('scrapbook-hidden');
    scrapbookSection.classList.add('scrapbook-revealed');
    
    if (btnToggleMotion) {
      btnToggleMotion.classList.add('active');
      btnToggleMotion.setAttribute('aria-expanded', 'true');
      const label = btnToggleMotion.querySelector('.btn-toggle-label');
      const icon = btnToggleMotion.querySelector('.btn-toggle-icon i');
      if (label) label.textContent = 'Hide Motion Designer';
      if (icon) icon.className = 'fa-solid fa-eye-slash';
    }

    if (andScroll) {
      setTimeout(() => {
        scrapbookSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  function closeMotionDesigner(scrollBack = true) {
    if (!scrapbookSection) return;
    scrapbookSection.style.display = 'none';
    scrapbookSection.classList.add('scrapbook-hidden');
    scrapbookSection.classList.remove('scrapbook-revealed');

    if (btnToggleMotion) {
      btnToggleMotion.classList.remove('active');
      btnToggleMotion.setAttribute('aria-expanded', 'false');
      const label = btnToggleMotion.querySelector('.btn-toggle-label');
      const icon = btnToggleMotion.querySelector('.btn-toggle-icon i');
      if (label) label.textContent = 'Show Motion Designer';
      if (icon) icon.className = 'fa-solid fa-eye';
    }

    if (scrollBack && motionLauncher) {
      motionLauncher.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  if (btnToggleMotion) {
    btnToggleMotion.addEventListener('click', () => {
      const isExpanded = btnToggleMotion.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMotionDesigner(true);
      } else {
        openMotionDesigner(true);
      }
    });
  }

  if (btnCloseMotion) {
    btnCloseMotion.addEventListener('click', () => {
      closeMotionDesigner(true);
    });
  }

  // If user clicks the "Persona" navbar link, auto-open the section and scroll to it
  if (navPersonaLink) {
    navPersonaLink.addEventListener('click', (e) => {
      e.preventDefault();
      openMotionDesigner(true);
    });
  }

  // Interactive ID Badge Toggle (Drop / Fold 3D Lanyard)
  const navIdBadgeToggle = document.getElementById('nav-id-badge-toggle');
  if (navIdBadgeToggle) {
    navIdBadgeToggle.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('toggle-lanyard'));
    });
  }
});

/* ==========================================================================
   PLAYFUL TECH CONSOLE & BOUNCY TILES CONTROLLER (Exact Reference)
   ========================================================================== */
(function initCanvasTechController() {
  let audioCtx = null;
  function playBubblePop(freq = 520, type = 'sine') {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Audio not supported or blocked, fail silently
    }
  }

  function init() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const tiles = document.querySelectorAll('.canvas-app-tile');
    const readyLabel = document.getElementById('inspectorReadyLabel');
    const statusText = document.getElementById('inspectorStatusText');

    if (!tiles.length) return;

    let selectedTile = null;

    // Filter Buttons
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        playBubblePop(600);
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        tiles.forEach(tile => {
          const cat = tile.getAttribute('data-cat');
          if (filter === 'all' || cat === filter) {
            tile.classList.remove('is-dimmed');
            tile.style.animation = 'none';
            void tile.offsetWidth;
            tile.style.animation = '';
          } else {
            tile.classList.add('is-dimmed');
            tile.classList.remove('is-selected');
          }
        });
      });
    });

    // Hover & Click Interactions
    tiles.forEach(tile => {
      const techName = tile.getAttribute('data-tech') || 'Technology';
      const techDesc = tile.getAttribute('data-desc') || 'Explore the tools behind my projects.';

      tile.addEventListener('mouseenter', () => {
        playBubblePop(500 + Math.random() * 160);
        if (!selectedTile) {
          if (readyLabel) readyLabel.textContent = techName.toUpperCase();
          if (statusText) statusText.innerHTML = `<strong style="color: #111111">${techName}:</strong> ${techDesc}`;
        }
      });

      tile.addEventListener('mouseleave', () => {
        if (!selectedTile) {
          if (readyLabel) readyLabel.textContent = 'READY';
          if (statusText) statusText.textContent = 'Hover to preview • Click to inspect';
        }
      });

      tile.addEventListener('click', () => {
        playBubblePop(720, 'triangle');
        if (selectedTile === tile) {
          tile.classList.remove('is-selected');
          selectedTile = null;
          if (readyLabel) readyLabel.textContent = 'READY';
          if (statusText) statusText.textContent = 'Hover to preview • Click to inspect';
        } else {
          tiles.forEach(t => t.classList.remove('is-selected'));
          tile.classList.add('is-selected');
          selectedTile = tile;
          if (readyLabel) readyLabel.textContent = 'LOCKED • ' + techName.toUpperCase();
          if (statusText) statusText.innerHTML = `<strong style="color: #111111">${techName}:</strong> ${techDesc}`;
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* ==========================================================================
   JOURNEY TIMELINE INTERACTION & SCROLL ENGINE
   Scroll-driven progressive spine fill, reveal animations, and active markers
   ========================================================================== */
(function initJourneyTimelineEngine() {
  function setupTimeline() {
    const timelineSection = document.getElementById('experience');
    const spineFill = document.getElementById('timelineSpineFill');
    const milestoneRows = document.querySelectorAll('.timeline-milestone-row');

    if (!timelineSection || !spineFill || milestoneRows.length === 0) return;

    // 1. Reveal observer using IntersectionObserver
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    });

    milestoneRows.forEach(row => revealObserver.observe(row));

    // 2. Performant Scroll Handler for Spine Fill & Active State
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateTimelineSpine();
          ticking = false;
        });
        ticking = true;
      }
    }

    function updateTimelineSpine() {
      const rect = timelineSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startOffset = windowHeight * 0.45;
      const totalDist = rect.height - 100;
      const currentScroll = startOffset - rect.top;

      let progress = 0;
      if (currentScroll > 0) {
        progress = Math.min(100, Math.max(0, (currentScroll / totalDist) * 100));
      }

      spineFill.style.height = progress + '%';

      // Active Milestone Detection
      let closestRow = null;
      let closestDist = Infinity;
      const viewportCenter = windowHeight * 0.45;

      milestoneRows.forEach(row => {
        const rowRect = row.getBoundingClientRect();
        const rowCenter = rowRect.top + 60;
        const dist = Math.abs(viewportCenter - rowCenter);

        if (dist < closestDist && rowRect.top < windowHeight * 0.82 && rowRect.bottom > windowHeight * 0.18) {
          closestDist = dist;
          closestRow = row;
        }
      });

      milestoneRows.forEach(row => {
        if (row === closestRow) {
          row.classList.add('is-active');
        } else {
          row.classList.remove('is-active');
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    
    setTimeout(updateTimelineSpine, 300);

    // 3. Smooth Jump Bar Links
    const jumpLinks = document.querySelectorAll('.journey-jump-pill');
    jumpLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const yOffset = -90;
            const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTimeline);
  } else {
    setupTimeline();
  }

  /* ==========================================================================
     VANI-STYLE FROSTED GLASS SHUTTER CONTROLLER
     Exact replication of scroll-driven curtain reveal from https://vani-bice.vercel.app
     - Early lift completion guarantees the shutter never gets stuck over cards or content
     - Synced directly with Lenis smooth scroll engine & RAF ticker
     - Interactive pull pill with smooth hover & glide-to-reveal
     ========================================================================== */
  function setupVaniShutters() {
    const shutterConfigs = [];

    const activeShutters = [];

    shutterConfigs.forEach(cfg => {
      const shutter = document.getElementById(cfg.shutterId);
      const target = document.getElementById(cfg.targetId);
      if (!shutter || !target) return;

      const handle = shutter.querySelector('.vani-shutter-handle');
      if (handle) {
        handle.addEventListener('click', (e) => {
          e.stopPropagation();
          if (window.lenis) {
            window.lenis.scrollTo(target, { offset: 0, duration: 1.0 });
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }

      activeShutters.push({ shutter, target });
    });

    if (!activeShutters.length) return;

    let ticking = false;

    function updateShutters() {
      ticking = false;
      const vh = window.innerHeight || document.documentElement.clientHeight;

      for (let i = 0; i < activeShutters.length; i++) {
        const { shutter, target } = activeShutters[i];
        const rect = target.getBoundingClientRect();

        // Shutter begins rolling up as soon as target enters the bottom of the screen (rect.top === vh),
        // and completes 100% of its lift 40px BEFORE the section reaches top (rect.top <= 40px)!
        // This guarantees it is completely lifted off and hidden before ScrollTrigger pins #projects!
        const startPoint = vh;
        const endPoint = 40;
        const revealRange = startPoint - endPoint;
        const distanceScrolled = startPoint - rect.top;

        // 1. Below viewport: completely covered at 0%
        if (distanceScrolled <= 0) {
          shutter.style.transform = 'translate3d(0, 0%, 0)';
          shutter.style.webkitTransform = 'translate3d(0, 0%, 0)';
          shutter.style.opacity = '1';
          shutter.style.visibility = 'visible';
          shutter.style.pointerEvents = 'none';
          continue;
        }

        // 2. Beyond reveal point: shutter is completely lifted off-screen and hidden
        if (distanceScrolled >= revealRange || rect.top <= endPoint) {
          shutter.style.transform = 'translate3d(0, -100%, 0)';
          shutter.style.webkitTransform = 'translate3d(0, -100%, 0)';
          shutter.style.opacity = '0';
          shutter.style.visibility = 'hidden';
          shutter.style.pointerEvents = 'none';
          continue;
        }

        // 3. In transit: smooth scroll-driven lift
        const progress = Math.max(0, Math.min(1, distanceScrolled / revealRange));
        const translateY = -(progress * 100);

        shutter.style.visibility = 'visible';
        shutter.style.pointerEvents = 'none';
        shutter.style.transform = `translate3d(0, ${translateY.toFixed(2)}%, 0)`;
        shutter.style.webkitTransform = `translate3d(0, ${translateY.toFixed(2)}%, 0)`;

        // Soft opacity transition near the very end
        if (progress > 0.8) {
          const fade = 1 - (progress - 0.8) / 0.2;
          shutter.style.opacity = Math.max(0, fade).toFixed(3);
        } else {
          shutter.style.opacity = '1';
        }
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateShutters);
      }
    }

    // Connect with Lenis smooth scroll or native scroll fallback
    if (window.lenis) {
      window.lenis.on('scroll', onScroll);
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('resize', onScroll, { passive: true });
    updateShutters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupVaniShutters);
  } else {
    setupVaniShutters();
  }
})();

