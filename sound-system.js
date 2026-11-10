/**
 * ============================================================================
 * PORTO // PREMIER SOUND-DESIGN SYSTEM
 * Procedural Web Audio API sound engine
 * Tactile, glassy, mechanical & cinematic sound textures
 * ============================================================================
 */

(function () {
  'use strict';

  // State
  let audioCtx = null;
  let masterGain = null;
  let noiseBuffer = null;
  let isSoundEnabled = false;
  let lastHoverTime = 0;
  let lastHoverElement = null;
  let lastSoundTime = 0;

  // Volume hierarchy constants (as specified)
  const VOLUMES = {
    hover: 0.12,          // 10–15%
    click: 0.38,          // 35–45%
    clickPrimary: 0.44,   // 35–45% (more depth)
    expand: 0.30,         // 25–35%
    collapse: 0.28,       // 25–35% (reverse sound)
    navigation: 0.28,     // 25–30%
    success: 0.32         // 30–35%
  };

  /**
   * Safe AudioContext initialization & unlocking
   */
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();

      // Master Gain for clean volume control & anti-clipping
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(1.0, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    return audioCtx;
  }

  /**
   * 1-Second Reusable Noise Buffer for Clicks, Whooshes & Transients
   */
  function createNoiseSource(ctx) {
    if (!noiseBuffer) {
      const bufferSize = ctx.sampleRate; // 1 second
      noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // High quality pink/white noise
        data[i] = (Math.random() * 2 - 1) * 0.9;
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    return source;
  }

  /**
   * Rate limiting helper to prevent stacking & rapid-fire audio glitches
   */
  function canPlay(minInterval = 0.04) {
    if (!isSoundEnabled) return false;
    const ctx = getAudioContext();
    if (!ctx) return false;
    const now = ctx.currentTime;
    if (now - lastSoundTime < minInterval) return false;
    lastSoundTime = now;
    return true;
  }

  /* --------------------------------------------------------------------------
     1. HOVER SOUND: Very subtle, short glassy digital tick (10-15% volume)
     -------------------------------------------------------------------------- */
  function playHover() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Strict throttle to prevent rapid machine-gunning across links
    if (now - lastHoverTime < 0.065) return;
    lastHoverTime = now;

    try {
      // High-pitched crystal ping
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3400, now);
      osc.frequency.exponentialRampToValueAtTime(1900, now + 0.022);

      oscGain.gain.setValueAtTime(VOLUMES.hover, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);

      // Micro glassy transient click
      const noise = createNoiseSource(ctx);
      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.setValueAtTime(6800, now);
      hpf.Q.setValueAtTime(1.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(VOLUMES.hover * 0.65, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.007);

      noise.connect(hpf);
      hpf.connect(noiseGain);
      noiseGain.connect(masterGain);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.025);
      noise.start(now);
      noise.stop(now + 0.008);
    } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     2. BUTTON CLICK: Crisp, tactile mechanical click (camera shutter / key thock)
     -------------------------------------------------------------------------- */
  function playClick(isPrimary = false) {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const vol = isPrimary ? VOLUMES.clickPrimary : VOLUMES.click;

    try {
      // 1. Mechanical switch transient (chisel bandpass impulse)
      const noise = createNoiseSource(ctx);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(isPrimary ? 2400 : 3400, now);
      bp.Q.setValueAtTime(3.2, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(vol * 0.9, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + (isPrimary ? 0.016 : 0.012));

      noise.connect(bp);
      bp.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(now);
      noise.stop(now + 0.018);

      // 2. Mechanical body resonance / thock
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = isPrimary ? 'triangle' : 'sine';
      const startFreq = isPrimary ? 175 : 240;
      const endFreq = isPrimary ? 80 : 120;
      const duration = isPrimary ? 0.046 : 0.034;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

      oscGain.gain.setValueAtTime(vol, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration + 0.005);

      // 3. Subtle camera-shutter spring release tick
      const releaseDelay = isPrimary ? 0.026 : 0.020;
      setTimeout(() => {
        if (!isSoundEnabled || !audioCtx) return;
        try {
          const tNow = audioCtx.currentTime;
          const relOsc = audioCtx.createOscillator();
          const relGain = audioCtx.createGain();
          relOsc.type = 'sine';
          relOsc.frequency.setValueAtTime(isPrimary ? 3800 : 4200, tNow);
          relGain.gain.setValueAtTime(vol * 0.22, tNow);
          relGain.gain.exponentialRampToValueAtTime(0.0001, tNow + 0.012);

          relOsc.connect(relGain);
          relGain.connect(masterGain);
          relOsc.start(tNow);
          relOsc.stop(tNow + 0.014);
        } catch (e) {}
      }, Math.round(releaseDelay * 1000));
    } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     3. EXPAND & COLLAPSE: Mechanical sliding sound with soft airy whoosh
     -------------------------------------------------------------------------- */
  function playExpand() {
    if (!canPlay(0.08)) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 0.16;

    try {
      // Airy rising whoosh (bandpass noise sweeping upward)
      const noise = createNoiseSource(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1.8, now);
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + duration * 0.85);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(VOLUMES.expand * 0.8, now + duration * 0.35);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(now);
      noise.stop(now + duration);

      // Smooth mechanical slide tone (upward glide)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + duration * 0.9);

      oscGain.gain.setValueAtTime(VOLUMES.expand * 0.45, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration + 0.01);
    } catch (e) {}
  }

  function playCollapse() {
    if (!canPlay(0.08)) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 0.14;

    try {
      // Reverse airy whoosh (bandpass noise sweeping downward)
      const noise = createNoiseSource(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1.8, now);
      filter.frequency.setValueAtTime(1700, now);
      filter.frequency.exponentialRampToValueAtTime(280, now + duration * 0.9);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(VOLUMES.collapse * 0.75, now + duration * 0.25);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(now);
      noise.stop(now + duration);

      // Mechanical settle tone (downward glide)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + duration);

      oscGain.gain.setValueAtTime(VOLUMES.collapse * 0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration + 0.01);
    } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     4. NAVIGATION / MAJOR TRANSITIONS: Subtle cinematic rising sweep
     -------------------------------------------------------------------------- */
  function playNavSweep() {
    if (!canPlay(0.12)) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 0.32;

    try {
      // Dual detuned oscillators for lush cinematic warmth
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const lp = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(110, now);
      osc1.frequency.exponentialRampToValueAtTime(230, now + duration);
      osc2.frequency.setValueAtTime(110.8, now); // subtle chorus beating
      osc2.frequency.exponentialRampToValueAtTime(231.6, now + duration);

      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(320, now);
      lp.frequency.exponentialRampToValueAtTime(1350, now + duration * 0.85);
      lp.Q.setValueAtTime(2.2, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(VOLUMES.navigation, now + duration * 0.38);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(lp);
      osc2.connect(lp);
      lp.connect(gain);
      gain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.02);
      osc2.stop(now + duration + 0.02);

      // Soft high-frequency atmospheric sweep
      const noise = createNoiseSource(ctx);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(550, now);
      bp.frequency.exponentialRampToValueAtTime(2400, now + duration * 0.75);
      bp.Q.setValueAtTime(1.6, now);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.001, now);
      nGain.gain.linearRampToValueAtTime(VOLUMES.navigation * 0.28, now + duration * 0.3);
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.85);

      noise.connect(bp);
      bp.connect(nGain);
      nGain.connect(masterGain);
      noise.start(now);
      noise.stop(now + duration * 0.86);
    } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     5. SUCCESS ACTIONS: Short, elegant two-note glass chime
     -------------------------------------------------------------------------- */
  function playSuccessChime() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    try {
      // Note 1: E6 (1318.5 Hz)
      playGlassNote(ctx, 1318.5, now, 0.48, VOLUMES.success * 0.85);

      // Note 2: B6 (1975.5 Hz) 88ms later for an elegant rising chime
      playGlassNote(ctx, 1975.5, now + 0.088, 0.65, VOLUMES.success);
    } catch (e) {}
  }

  function playGlassNote(ctx, freq, startTime, duration, volume) {
    // Fundamental crystal tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Inharmonic bell shimmer overtone
    const overtone = ctx.createOscillator();
    const overGain = ctx.createGain();
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2.76, startTime);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    overGain.gain.setValueAtTime(volume * 0.16, startTime);
    overGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.4);

    osc.connect(gain);
    overtone.connect(overGain);
    gain.connect(masterGain);
    overGain.connect(masterGain);

    osc.start(startTime);
    overtone.start(startTime);
    osc.stop(startTime + duration + 0.05);
    overtone.stop(startTime + duration + 0.05);
  }

  /* --------------------------------------------------------------------------
     GLOBAL SOUND ON / OFF TOGGLE CONTROLLER
     -------------------------------------------------------------------------- */
  function setSoundEnabled(enable, triggerFeedback = true) {
    isSoundEnabled = !!enable;
    try {
      localStorage.setItem('porto_sfx_enabled', isSoundEnabled ? 'true' : 'false');
    } catch (e) {}

    const toggleBtn = document.getElementById('sound-toggle-btn');
    const toggleLabel = document.querySelector('.sound-toggle-label');

    if (toggleBtn) {
      if (isSoundEnabled) {
        toggleBtn.classList.add('sound-active');
        toggleBtn.setAttribute('aria-pressed', 'true');
        toggleBtn.setAttribute('title', 'Sound Effects: ON (Click to Mute)');
        if (toggleLabel) toggleLabel.textContent = 'SFX: ON';
      } else {
        toggleBtn.classList.remove('sound-active');
        toggleBtn.setAttribute('aria-pressed', 'false');
        toggleBtn.setAttribute('title', 'Sound Effects: OFF (Click to Enable)');
        if (toggleLabel) toggleLabel.textContent = 'SFX: OFF';
      }
    }

    if (isSoundEnabled && triggerFeedback) {
      // Immediate pleasant auditory confirmation that audio is online
      playSuccessChime();
    }
  }

  function toggleSound() {
    // Explicit user click unlocks AudioContext
    getAudioContext();
    setSoundEnabled(!isSoundEnabled, true);
  }

  /* --------------------------------------------------------------------------
     INTERACTION EVENT BINDINGS
     -------------------------------------------------------------------------- */
  function initEventBindings() {
    // 1. Delegated Hover Listener
    document.addEventListener('mouseover', (e) => {
      if (!isSoundEnabled) return;
      // Ignore touch moves
      if (e.pointerType === 'touch') return;

      // Do NOT play SFX when hovering or focusing writing/typing inputs
      if (e.target.closest('input, textarea, select, [contenteditable="true"], .terminal-input')) return;

      const interactive = e.target.closest(
        'a, button, [role="button"], ' +
        '.term-chip, .project-card, .polaroid-item, .skill-card, ' +
        '.dock-toggle-btn, .interactive-hover-btn, .nav-link, .brand-logo, ' +
        '.mood-pill, .filter-btn, .uplink-icon-btn, .color-dot, .sound-toggle-btn, ' +
        '.clay-cmd-chip, .quick-chip'
      );

      if (interactive && interactive !== lastHoverElement) {
        lastHoverElement = interactive;
        playHover();
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      lastHoverElement = null;
    }, { passive: true });

    // 2. Delegated Click Listener (Distinguishes Regular vs Primary CTAs)
    document.addEventListener('click', (e) => {
      if (!isSoundEnabled) return;

      // Do NOT play SFX on typing/writing fields
      if (e.target.closest('input:not([type="radio"]):not([type="checkbox"]):not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"], .terminal-input')) return;

      const primaryCta = e.target.closest(
        '.btn-pill-dark, #submit-btn, .uplink-submit-btn, [data-sfx="primary"]'
      );
      if (primaryCta) {
        playClick(true);
        return;
      }

      const regularClickable = e.target.closest(
        'button:not(#sound-toggle-btn), [role="button"], .term-chip, ' +
        '.dock-toggle-btn, .filter-btn, .uplink-icon-btn, .color-dot, ' +
        '.quick-chip, .clay-cmd-chip, input[type="radio"], input[type="checkbox"]'
      );
      if (regularClickable) {
        playClick(false);
      }
    }, { passive: true });

    // 3. Navigation Links (Rising Cinematic Sweep)
    document.addEventListener('click', (e) => {
      if (!isSoundEnabled) return;
      const navTarget = e.target.closest('.nav-link, .brand-logo, a[href^="#"]');
      if (navTarget) {
        playNavSweep();
      }
    }, { passive: true });

    // 4. Modal / Drawer / Accordion Expand & Collapse
    // (a) Color Regulator Dock
    const dockBtn = document.getElementById('dock-toggle-btn');
    const dockCard = document.getElementById('side-regulator-dock');
    if (dockBtn && dockCard) {
      dockBtn.addEventListener('click', () => {
        if (!isSoundEnabled) return;
        setTimeout(() => {
          if (dockCard.classList.contains('collapsed')) {
            playCollapse();
          } else {
            playExpand();
          }
        }, 10);
      });
    }

    // (b) Mobile Navigation Hamburger
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    if (hamburgerBtn && navMenu) {
      hamburgerBtn.addEventListener('click', () => {
        if (!isSoundEnabled) return;
        setTimeout(() => {
          if (navMenu.classList.contains('active')) {
            playExpand();
          } else {
            playCollapse();
          }
        }, 10);
      });
    }

    // (c) Project Details Modal & Generic Dialogs
    document.addEventListener('click', (e) => {
      if (!isSoundEnabled) return;
      const modalOpenTrigger = e.target.closest('[data-modal-open], .view-details-btn');
      if (modalOpenTrigger) {
        playExpand();
        return;
      }
      const modalCloseTrigger = e.target.closest('[data-modal-close], .modal-close-btn, #project-modal-close');
      if (modalCloseTrigger) {
        playCollapse();
      }
    }, { passive: true });

    // 5. Successful Actions (Contact Transmission & Terminal Output)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', () => {
        if (!isSoundEnabled) return;
        // The success message shows after network response
        const observer = new MutationObserver(() => {
          const formStatusMsg = document.getElementById('form-status-msg');
          if (formStatusMsg && formStatusMsg.textContent.includes('UPLINK_SUCCESS')) {
            playSuccessChime();
            observer.disconnect();
          }
        });
        const statusEl = document.getElementById('form-status-msg');
        if (statusEl) {
          observer.observe(statusEl, { childList: true, characterData: true, subtree: true });
        }
      });
    }

    // Toggle button click listener
    const toggleBtn = document.getElementById('sound-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSound();
      });
    }
  }

  /**
   * Initialize on DOM Ready
   */
  function init() {
    // Respect requirement: Start disabled until user explicitly enables it
    // Check if user previously enabled it in this browser session
    let savedState = false;
    try {
      savedState = localStorage.getItem('porto_sfx_enabled') === 'true';
    } catch (e) {}

    setSoundEnabled(savedState, false);
    initEventBindings();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  window.PortoSound = {
    enable: () => setSoundEnabled(true, true),
    disable: () => setSoundEnabled(false, false),
    toggle: toggleSound,
    isEnabled: () => isSoundEnabled,
    playHover,
    playClick,
    playExpand,
    playCollapse,
    playNav: playNavSweep,
    playSuccess: playSuccessChime
  };

})();

