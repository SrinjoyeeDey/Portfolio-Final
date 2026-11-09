/**
 * INTERACTIVE INFINITE LOGO SHOWCASE (TECH STACK SECTION)
 * Recreating the sleek visual reference layout:
 * - Left: Rectangular 16:9 rounded video visualizer card
 * - Right: Two continuous infinite scrolling logo rows in opposite directions
 * - Neutral by default -> Full brand color + glow + smooth scale on hover
 * - Web Audio API soft digital interaction sound upon hover
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. TECHNOLOGY BRAND LOGOS & VIBRANT GLOW DEFINITIONS
  // ---------------------------------------------------------------------------
  const ROW_1_LOGOS = [
    {
      name: 'Python',
      glow: 'rgba(56, 126, 184, 0.85)',
      src: 'tech-logos/python.svg'
    },
    {
      name: 'PyTorch',
      glow: 'rgba(238, 76, 44, 0.85)',
      src: 'tech-logos/pytorch.svg'
    },
    {
      name: 'React',
      glow: 'rgba(0, 216, 255, 0.85)',
      src: 'tech-logos/react.svg'
    },
    {
      name: 'Next.js',
      glow: 'rgba(255, 255, 255, 0.75)',
      src: 'tech-logos/nextjs.svg'
    },
    {
      name: 'TypeScript',
      glow: 'rgba(49, 120, 198, 0.85)',
      src: 'tech-logos/typescript.svg'
    },
    {
      name: 'Node.js',
      glow: 'rgba(83, 160, 68, 0.85)',
      src: 'tech-logos/nodejs.svg'
    },
    {
      name: 'Docker',
      glow: 'rgba(36, 150, 237, 0.85)',
      src: 'tech-logos/docker.svg'
    },
    {
      name: 'AWS',
      glow: 'rgba(255, 153, 0, 0.85)',
      src: 'tech-logos/aws.svg'
    },
    {
      name: 'Google Cloud',
      glow: 'rgba(66, 133, 244, 0.85)',
      src: 'tech-logos/googlecloud.svg'
    },
    {
      name: 'MongoDB',
      glow: 'rgba(71, 162, 72, 0.85)',
      src: 'tech-logos/mongodb.svg'
    },
    {
      name: 'LangChain',
      glow: 'rgba(0, 163, 122, 0.85)',
      src: 'tech-logos/langchain.svg'
    },
    {
      name: 'FastAPI',
      glow: 'rgba(0, 150, 136, 0.85)',
      src: 'tech-logos/fastapi.svg'
    }
  ];

  const ROW_2_LOGOS = [
    {
      name: 'TensorFlow',
      glow: 'rgba(255, 111, 0, 0.85)',
      src: 'tech-logos/tensorflow.svg'
    },
    {
      name: 'JavaScript',
      glow: 'rgba(247, 223, 30, 0.85)',
      src: 'tech-logos/javascript.svg'
    },
    {
      name: 'Java',
      glow: 'rgba(237, 139, 0, 0.85)',
      src: 'tech-logos/java.svg'
    },
    {
      name: 'Tailwind CSS',
      glow: 'rgba(56, 189, 248, 0.85)',
      src: 'tech-logos/tailwindcss.svg'
    },
    {
      name: 'OpenCV',
      glow: 'rgba(255, 42, 68, 0.85)',
      src: 'tech-logos/opencv.svg'
    },
    {
      name: 'Unity',
      glow: 'rgba(255, 255, 255, 0.75)',
      src: 'tech-logos/unity.svg'
    },
    {
      name: 'Blender',
      glow: 'rgba(245, 121, 42, 0.85)',
      src: 'tech-logos/blender.svg'
    },
    {
      name: 'GitHub',
      glow: 'rgba(255, 255, 255, 0.75)',
      src: 'tech-logos/github.svg'
    },
    {
      name: 'PostgreSQL',
      glow: 'rgba(51, 103, 145, 0.85)',
      src: 'tech-logos/postgresql.svg'
    },
    {
      name: 'NumPy',
      glow: 'rgba(77, 171, 207, 0.85)',
      src: 'tech-logos/numpy.svg'
    },
    {
      name: 'Pandas',
      glow: 'rgba(231, 4, 136, 0.85)',
      src: 'tech-logos/pandas.svg'
    },
    {
      name: 'C++',
      glow: 'rgba(0, 89, 156, 0.85)',
      src: 'tech-logos/cplusplus.svg'
    }
  ];

  // ---------------------------------------------------------------------------
  // 2. SOFT DIGITAL TACTILE SOUND SYNTHESIZER (Web Audio API)
  // ---------------------------------------------------------------------------
  let audioContext = null;
  let isSoundMuted = false;

  function initAudio() {
    if (!audioContext) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          audioContext = new AudioCtx();
        }
      } catch (err) {
        console.warn('AudioContext unavailable:', err);
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
  }

  function playLogoChime() {
    if (window.PortoSound) {
      if (window.PortoSound.isEnabled()) {
        window.PortoSound.playHover();
      }
      return;
    }
    if (isSoundMuted) return;
    initAudio();
    if (!audioContext) return;

    try {
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      // Soft high-frequency gentle digital chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1050, now);
      osc.frequency.exponentialRampToValueAtTime(1450, now + 0.038);

      // Low soft volume so it never startles
      gain.gain.setValueAtTime(0.022, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      // Graceful fallback
    }
  }

  // ---------------------------------------------------------------------------
  // 3. SEAMLESS INFINITE DUAL-ROW LOGO MARQUEE POPULATION
  // ---------------------------------------------------------------------------
  function populateLogoMarquee() {
    const track1 = document.getElementById('techLogoTrack1');
    const track2 = document.getElementById('techLogoTrack2');

    if (!track1 || !track2) return;

    // Render an item element
    const createLogoItem = (logo) => {
      const el = document.createElement('div');
      el.className = 'tech-logo-item';
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', logo.name);
      el.style.setProperty('--logo-glow', logo.glow);
      el.innerHTML = `<img src="${logo.src}" alt="${logo.name}" class="tech-logo-svg" loading="lazy" width="64" height="64">`;

      // Play soft chime once upon enter
      el.addEventListener('mouseenter', () => {
        playLogoChime();
      }, { passive: true });

      return el;
    };

    // Duplicate list 3 times so the loop has zero gaps on any screen width
    const fillTrack = (track, list) => {
      track.innerHTML = '';
      const tripleList = [...list, ...list, ...list];
      tripleList.forEach((logo) => {
        track.appendChild(createLogoItem(logo));
      });
    };

    fillTrack(track1, ROW_1_LOGOS);
    fillTrack(track2, ROW_2_LOGOS);
  }

  // ---------------------------------------------------------------------------
  // 4. SOUND TOGGLE BUTTON CONTROLLER
  // ---------------------------------------------------------------------------
  function setupSoundToggle() {
    const btn = document.getElementById('techSoundToggleBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      isSoundMuted = !isSoundMuted;
      if (isSoundMuted) {
        btn.classList.add('sound-muted');
        btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i><span>SFX OFF</span>';
      } else {
        btn.classList.remove('sound-muted');
        btn.innerHTML = '<i class="fa-solid fa-volume-high"></i><span>SFX ON</span>';
        playLogoChime();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 5. RECTANGULAR VIDEO PREVIEW CARD (Continuous Autoplay Loop)
  // ---------------------------------------------------------------------------
  function initTechVideoPlayer() {
    const video = document.getElementById('tech-video-player');
    if (!video) return;

    // Ensure video is muted for reliable cross-browser autoplay
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser requires interaction
          const onFirstInteraction = () => {
            video.play().catch(() => {});
            window.removeEventListener('click', onFirstInteraction);
            window.removeEventListener('scroll', onFirstInteraction);
            window.removeEventListener('touchstart', onFirstInteraction);
          };
          window.addEventListener('click', onFirstInteraction, { once: true });
          window.addEventListener('scroll', onFirstInteraction, { once: true });
          window.addEventListener('touchstart', onFirstInteraction, { once: true });
        });
      }
    };

    tryPlay();

    // Pause playback when scrolled far offscreen to save battery/resources
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(video);
    }
  }

  // ---------------------------------------------------------------------------
  // 6. INITIALIZATION
  // ---------------------------------------------------------------------------
  function initTechShowcase() {
    populateLogoMarquee();
    setupSoundToggle();
    initTechVideoPlayer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTechShowcase);
  } else {
    initTechShowcase();
  }
})();
