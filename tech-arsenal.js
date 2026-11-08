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
      glow: 'rgba(56, 126, 184, 0.75)',
      svg: `<svg viewBox="0 0 128 128" class="tech-logo-svg"><path fill="#387EB8" d="M63.5 12.8c-26.6 0-25 11.5-25 11.5l.03 11.9h25.4v3.6H28.4S12 37.9 12 64.7c0 26.7 14.3 25.8 14.3 25.8h8.5v-12s-.5-14.3 14-14.3h24.1s13.5.2 13.5-13.2V26.3s1.7-13.5-22.9-13.5zm-13.7 7.7a3.8 3.8 0 1 1 0 7.7 3.8 3.8 0 0 1 0-7.7z"/><path fill="#FFE873" d="M64.5 115.2c26.6 0 25-11.5 25-11.5l-.03-11.9H64.07v-3.6h35.53s16.4 1.9 16.4-24.9c0-26.7-14.3-25.8-14.3-25.8h-8.5v12s.5 14.3-14 14.3H55.1s-13.5-.2-13.5 13.2v24.7s-1.7 13.5 22.9 13.5zm13.7-7.7a3.8 3.8 0 1 1 0-7.7 3.8 3.8 0 0 1 0 7.7z"/></svg>`
    },
    {
      name: 'PyTorch',
      glow: 'rgba(238, 76, 44, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#EE4C2C" d="M13.5 2.1a1 1 0 0 0-1.5.2L10.3 4.5l2.4 2.4 1.5-1.8a1 1 0 0 0-.7-3zM19 12a7 7 0 1 1-13-3.6l1.5 1.5A5 5 0 1 0 17 12h2z"/><circle cx="16" cy="6" r="1.5" fill="#EE4C2C"/></svg>`
    },
    {
      name: 'React',
      glow: 'rgba(0, 216, 255, 0.75)',
      svg: `<svg viewBox="0 0 115.3 100" class="tech-logo-svg"><ellipse cx="57.65" cy="50" rx="16.5" ry="46" transform="rotate(30 57.65 50)" stroke="#00D8FF" stroke-width="6" fill="none"/><ellipse cx="57.65" cy="50" rx="16.5" ry="46" transform="rotate(90 57.65 50)" stroke="#00D8FF" stroke-width="6" fill="none"/><ellipse cx="57.65" cy="50" rx="16.5" ry="46" transform="rotate(150 57.65 50)" stroke="#00D8FF" stroke-width="6" fill="none"/><circle cx="57.65" cy="50" r="9.5" fill="#00D8FF"/></svg>`
    },
    {
      name: 'Next.js',
      glow: 'rgba(24, 24, 27, 0.65)',
      svg: `<svg viewBox="0 0 180 180" class="tech-logo-svg"><circle cx="90" cy="90" r="88" fill="#000000"/><path fill="#ffffff" fill-rule="evenodd" clip-rule="evenodd" d="M126.56 131.53L69.84 54.4H54.4v71.2h12.56V72.09l50.05 64.91c3.2-1.75 6.22-3.8 9.01-6.13l.54-.34zM113.6 54.4h12V108h-12V54.4z"/></svg>`
    },
    {
      name: 'TypeScript',
      glow: 'rgba(49, 120, 198, 0.75)',
      svg: `<svg viewBox="0 0 128 128" class="tech-logo-svg"><rect width="128" height="128" rx="20" fill="#3178C6"/><path fill="#ffffff" d="M69.6 54.3v10.5h16.5V111H99V64.8h16.5V54.3H69.6zm-47.1 23h12.4c3.4 0 6.1-.8 8-2.5 2-1.7 3-4.3 3-7.8s-1-6.1-3-7.8c-2-1.7-4.7-2.5-8-2.5H12.5V111h10v-33.7zm0-10.4h11.7c1.3 0 2.4.4 3.1 1.1.7.7 1.1 1.9 1.1 3.5s-.4 2.8-1.1 3.5c-.7.7-1.8 1.1-3.1 1.1H22.5V66.9z"/></svg>`
    },
    {
      name: 'Node.js',
      glow: 'rgba(83, 160, 68, 0.75)',
      svg: `<svg viewBox="0 0 128 128" class="tech-logo-svg"><path fill="#53A044" d="M64 8.7L14.4 37.3v57.4L64 123.3l49.6-28.6V37.3L64 8.7zm0 18.2l34.4 19.8-13.8 8-20.6-11.9-20.6 11.9-13.8-8L64 26.9zm-38 31.8l13.8 8v23.8l-13.8-8V58.7zm24.2 39.8V74.7L64 82.7v23.8l-13.8-8zm27.6 0V74.7L64 66.8l13.8-8v39.7zm13.8-16V58.7l13.8-8v23.8l-13.8 8z"/></svg>`
    },
    {
      name: 'Docker',
      glow: 'rgba(36, 150, 237, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#2496ED" d="M13.98 11.08h1.72V9.36h-1.72v1.72zm-2.06 0h1.72V9.36h-1.72v1.72zm-2.07 0h1.72V9.36H9.85v1.72zm-2.07 0h1.72V9.36H7.78v1.72zm-2.07 0h1.72V9.36H5.71v1.72zm6.2-2.07h1.72V7.29h-1.72v1.72zm-2.07 0h1.72V7.29H9.85v1.72zm-2.07 0h1.72V7.29H7.78v1.72zm4.14-2.07h1.72V5.22h-1.72v1.72zM23.9 11.4c-.45-.33-1.42-.42-2.18-.08-.18-.83-.71-1.55-1.57-2.03l-.43-.24-.26.42c-.52.83-.68 1.9-.47 2.89-.3.17-.69.29-1.16.34H1.3c-.63 0-1.18.42-1.28 1.04-.7 4.19 1.48 7.37 6.46 7.37 5.6 0 9.77-2.86 11.75-8.24.8.06 1.83.02 2.76-.73.35-.29.62-.64.83-1.03l.36-.68-.28-.06z"/></svg>`
    },
    {
      name: 'AWS',
      glow: 'rgba(255, 153, 0, 0.75)',
      svg: `<svg viewBox="0 0 128 128" class="tech-logo-svg"><path fill="#232F3E" d="M41.7 54.5c0-4.6 2.7-7.4 8.7-7.4 4.3 0 7.8 1.4 10.3 3.5l4-7.4c-3.6-2.9-8.7-4.6-15.1-4.6-11.8 0-18.7 6.7-18.7 16.7 0 17.5 24.3 11.2 24.3 20.3 0 5-3.3 7.8-9.9 7.8-5.7 0-10.4-2.1-13.4-5.3l-4.4 7.6c4.3 4.1 10.8 6.4 18.2 6.4 13.5 0 20.4-7.2 20.4-17.6 0-18.3-24.4-11.9-24.4-20z"/><path fill="#FF9900" d="M109.8 91.5c-15.4 11.3-37.8 17.4-57.1 17.4-27.1 0-51.5-10.1-69.9-26.9-1.5-1.3-.2-3.1 1.6-2.1 18.2 10.5 40.5 16.8 63.6 16.8 17.1 0 36.9-4.7 51.5-13.7 2.2-1.4 4.1 1.1 1.7 2.6l8.6 5.9z"/><path fill="#FF9900" d="M114.7 82.2c-.8-1.1-5.4-.5-11.4.2-1.9.2-2.2-1.2-.5-2.4 11-7.8 13.8-6.1 14.8-4.9 1 1.2-.3 4.2-6.6 17.1-1 2.1-2.4 1.7-2.1-.6.7-6 4.6-8.9 5.8-9.4z"/></svg>`
    },
    {
      name: 'Google Cloud',
      glow: 'rgba(66, 133, 244, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#EA4335" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/><path fill="#4285F4" d="M19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/></svg>`
    },
    {
      name: 'MongoDB',
      glow: 'rgba(71, 162, 72, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#47A248" d="M12 0s-3.7 4.2-3.7 9.8c0 4.1 2.4 7.6 3.7 9.4 1.3-1.8 3.7-5.3 3.7-9.4C15.7 4.2 12 0 12 0zm0 18.5c-.3 0-.5.2-.5.5v4.5c0 .3.2.5.5.5s.5-.2.5-.5V19c0-.3-.2-.5-.5-.5z"/></svg>`
    },
    {
      name: 'LangChain',
      glow: 'rgba(5, 150, 105, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#059669" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5v-3l4-2.5-4-2.5v-3l7 4.5-7 6.5zm-2-9v3L7 13l4 2.5v3l-7-4.5 7-6.5z"/></svg>`
    },
    {
      name: 'FastAPI',
      glow: 'rgba(0, 150, 136, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#009688" d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm-.9 4.8h3.3l-3.6 7.2h3.3L7.5 19.2l1.8-6h-3l4.8-8.4z"/></svg>`
    }
  ];

  const ROW_2_LOGOS = [
    {
      name: 'TensorFlow',
      glow: 'rgba(255, 111, 0, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#FF6F00" d="M12 2L3 7.2v9.6l3.5-2V9.6l5.5-3.2v14.4l3.5 2V8.4l5.5 3.2v5.2l3.5 2V7.2L12 2z"/></svg>`
    },
    {
      name: 'JavaScript',
      glow: 'rgba(247, 223, 30, 0.75)',
      svg: `<svg viewBox="0 0 128 128" class="tech-logo-svg"><rect width="128" height="128" rx="20" fill="#F7DF1E"/><path fill="#000000" d="M67.3 103.2c3.5 5.8 8.1 10.1 16.3 10.1 6.8 0 11.2-3.4 11.2-8.1 0-5.6-4.5-7.7-12-10.9l-4.1-1.8c-11.8-5-19.6-11.3-19.6-25.1 0-13.6 10.3-24 26.5-24 11.5 0 19.7 4.1 25.1 13.9l-11.6 7.4c-2.7-4.8-5.8-6.9-12.7-6.9-5.7 0-9.7 3.5-9.7 7.7 0 5.2 3.8 7.3 11 10.4l4.1 1.8c14.2 6.1 20.8 12.1 20.8 25.8 0 14.8-11.6 24.8-29.4 24.8-16.4 0-26.6-8.2-31.5-19.7l12.6-7.4zm-42.5 1.5c2.6 4.3 5.4 7.9 10.9 7.9 5.5 0 9-2.3 9-11.2V54.4h15v47c0 17.5-10.3 25.4-24.8 25.4-13.2 0-20.9-6.9-24.8-15.3l14.7-8.8z"/></svg>`
    },
    {
      name: 'Java',
      glow: 'rgba(237, 139, 0, 0.75)',
      svg: `<svg viewBox="0 0 128 128" class="tech-logo-svg"><path fill="#5382A1" d="M46.7 96.1c-10.2 1.4-18.7.6-18.7.6s4.1 3.5 13.5 4.3c12.2 1.1 25.7.8 38.6-.8 11.8-1.5 25.3-4.7 25.3-4.7s-5.6 2.4-16.6 4c-13.2 1.9-28.7 2.1-42.1.6zm22-38.3c4.8 5.7-4 11.2-4 11.2s11.5-6.2 6.5-14.8c-4.4-7.6-13.6-11.6-8.7-22.9 0 0-14.7 12.6 6.2 26.5z"/><path fill="#ED8B00" d="M57.6 71.9c-8.9 11-1.3 17.6-1.3 17.6s6.1-4.7-1.1-10.8c-6.1-5.1-5.1-9.9 2.4-17.6 0 0-11 4.7 0 10.8zm39.1 29.8c-16.1 4.2-48.4 4.8-68.9-.3-5.2-1.3-9-2.7-9-2.7s2.5 2 8.7 3.5c20.3 4.9 52.8 4.3 69.2-.5z"/></svg>`
    },
    {
      name: 'Tailwind CSS',
      glow: 'rgba(56, 189, 248, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#38BDF8" d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/></svg>`
    },
    {
      name: 'OpenCV',
      glow: 'rgba(92, 62, 232, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><circle cx="12" cy="7" r="4.5" fill="#EE4C2C"/><circle cx="6.5" cy="16.5" r="4.5" fill="#10B981"/><circle cx="17.5" cy="16.5" r="4.5" fill="#3B82F6"/></svg>`
    },
    {
      name: 'Unity',
      glow: 'rgba(34, 44, 55, 0.65)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#222C37" d="M12 2.2L3.8 6.9v9.4L12 21.8l8.2-5.5V6.9L12 2.2zm0 2.8l5.8 3.3-2.6 1.5L12 8.1 8.8 9.8l-2.6-1.5L12 5zm-6 4.9l2.6 1.5v3.5L5.4 16.5V9.9zm7.2 9.2l-5.8-3.3 2.6-1.5 3.2 1.7 3.2-1.7 2.6 1.5-5.8 3.3zm5.4-4.1l-3.2-1.8v-3.5l2.6-1.5 0 6.8h.6z"/></svg>`
    },
    {
      name: 'Blender',
      glow: 'rgba(245, 121, 42, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#EA7600" d="M12.5 7.5L8.2 3.2a1 1 0 0 0-1.4 1.4l3.5 3.5-3.5 3.5a1 1 0 0 0 1.4 1.4l4.3-4.3a1 1 0 0 0 0-1.2z"/><path fill="#F5792A" d="M13.2 9.8a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 7.5a2.5 2.5 0 1 1 2.5-2.5 2.5 2.5 0 0 1-2.5 2.5z"/><circle cx="13.2" cy="14.8" r="1.5" fill="#265787"/></svg>`
    },
    {
      name: 'GitHub',
      glow: 'rgba(36, 41, 46, 0.65)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#24292E" fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>`
    },
    {
      name: 'PostgreSQL',
      glow: 'rgba(65, 105, 225, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#336791" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.5 0-4-1.5-4-3.5s1.5-3.5 4-3.5 4 1.5 4 3.5-1.5 3.5-4 3.5z"/></svg>`
    },
    {
      name: 'NumPy',
      glow: 'rgba(77, 171, 207, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#4DABCF" d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.8 3.8L12 11.8 5.2 8 12 4.2zM5 9.5l6 3.4v7L5 16.5v-7zm8 10.4v-7l6-3.4v7l-6 3.4z"/></svg>`
    },
    {
      name: 'Pandas',
      glow: 'rgba(231, 4, 136, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><rect x="5" y="4" width="4" height="16" rx="2" fill="#150458"/><rect x="11" y="8" width="4" height="12" rx="2" fill="#E70488"/><rect x="17" y="12" width="4" height="8" rx="2" fill="#FFD43B"/></svg>`
    },
    {
      name: 'C++',
      glow: 'rgba(0, 89, 156, 0.75)',
      svg: `<svg viewBox="0 0 24 24" class="tech-logo-svg"><path fill="#00599C" d="M12 2L2 7.8v8.4L12 22l10-5.8V7.8L12 2zm-1.5 13.5c-2.5 0-4-1.6-4-3.5s1.5-3.5 4-3.5c1.8 0 3 1 3.5 2.2l-1.8.8c-.3-.7-1-1.2-1.7-1.2-1.2 0-2 .9-2 1.7s.8 1.7 2 1.7c.7 0 1.4-.5 1.7-1.2l1.8.8c-.5 1.2-1.7 2.2-3.5 2.2zm6.5-2.5h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1zm3 0h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1z"/></svg>`
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
      el.innerHTML = logo.svg;

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
