/**
 * MUCHINEKO CONCEPT DESIGN - INTERACTIVE PHONE CLI & GAME ENGINE
 * Inspired by Japanese Concept Design Sheet (むちねこ)
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initMuchineko);

  function initMuchineko() {
    const screen = document.getElementById('muchinekoScreen');
    if (!screen) return;

    // Elements
    const cat = document.getElementById('muchiCat');
    const hudWeightFill = document.getElementById('hudWeightFill');
    const hudWeightVal = document.getElementById('hudWeightVal');
    const hudKibbleCount = document.getElementById('hudKibbleCount');
    const cliOverlay = document.getElementById('muchiCliOverlay');
    const cliOutput = document.getElementById('muchiCliOutput');
    const cliInput = document.getElementById('muchiCliInput');
    const cliSend = document.getElementById('muchiCliSend');
    const btnModeGame = document.getElementById('btnModeGame');
    const btnModeSplit = document.getElementById('btnModeSplit');
    const btnModeTerminal = document.getElementById('btnModeTerminal');
    const pauseBtn = document.getElementById('hudPauseBtn');
    const audioToggle = document.getElementById('muchiAudioToggle');

    // State
    let currentWeight = 42; // percentage
    let kibbleCount = 18;
    let currentCatState = 'normal'; // 'light', 'normal', 'heavy'
    let currentAction = 'idle'; // 'idle', 'run', 'jump', 'fall'
    let currentMode = 'game'; // 'game', 'split', 'terminal'
    let isPaused = false;
    let audioEnabled = true;

    // Audio SFX using Web Audio API (zero external dependencies)
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function playTone(freq, type, duration, vol = 0.15) {
      if (!audioEnabled) return;
      try {
        if (!audioCtx) audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        // audio muted or restricted
      }
    }

    function soundJump() {
      if (!audioEnabled) return;
      playTone(320, 'sine', 0.25, 0.2);
      setTimeout(() => playTone(540, 'sine', 0.2, 0.15), 60);
    }

    function soundChomp() {
      if (!audioEnabled) return;
      playTone(440, 'triangle', 0.12, 0.25);
      setTimeout(() => playTone(300, 'sine', 0.15, 0.2), 80);
    }

    function soundClick() {
      playTone(600, 'square', 0.05, 0.08);
    }

    function soundError() {
      playTone(180, 'sawtooth', 0.25, 0.2);
    }

    // Update Weight & Gauges
    function setWeight(newWeight) {
      currentWeight = Math.max(0, Math.min(100, newWeight));
      if (hudWeightFill) hudWeightFill.style.width = currentWeight + '%';
      if (hudWeightVal) hudWeightVal.textContent = Math.round(currentWeight) + '%';

      // Update cat shape based on weight
      if (currentWeight < 25) {
        setCatState('light', false);
      } else if (currentWeight > 65) {
        setCatState('heavy', false);
      } else {
        setCatState('normal', false);
      }
    }

    // Set Cat State: light (10kg), normal (18kg), heavy (32kg)
    function setCatState(state, updateWeightValue = true) {
      currentCatState = state;
      if (cat) {
        cat.classList.remove('state-light', 'state-normal', 'state-heavy');
        cat.classList.add('state-' + state);
      }

      // Update active pill in bottom specs
      document.querySelectorAll('.state-stage-card').forEach(btn => {
        if (btn.getAttribute('data-state') === state) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      if (updateWeightValue) {
        if (state === 'light') setWeight(15);
        else if (state === 'normal') setWeight(42);
        else if (state === 'heavy') setWeight(85);
      }
    }

    // Cat Actions: run, jump, fall, idle
    function triggerAction(actionName) {
      if (isPaused) togglePause();
      currentAction = actionName;

      if (!cat) return;
      cat.classList.remove('anim-run', 'anim-jump', 'anim-fall');

      // Trigger reflow for clean re-animation
      void cat.offsetWidth;

      if (actionName === 'jump') {
        cat.classList.add('anim-jump');
        soundJump();
        spawnFloatingEffect('JUMP! 🐾');
        setTimeout(() => {
          if (currentAction === 'jump') {
            cat.classList.remove('anim-jump');
            currentAction = 'idle';
          }
        }, 1200);
      } else if (actionName === 'run') {
        cat.classList.add('anim-run');
        soundClick();
        spawnFloatingEffect('DASH! 💨');
        setTimeout(() => {
          if (currentAction === 'run') {
            cat.classList.remove('anim-run');
            currentAction = 'idle';
          }
        }, 2200);
      } else if (actionName === 'fall') {
        cat.classList.add('anim-fall');
        playTone(220, 'sawtooth', 0.35, 0.2);
        spawnFloatingEffect('OOMPH! 💥');
        setTimeout(() => {
          if (currentAction === 'fall') {
            cat.classList.remove('anim-fall');
            currentAction = 'idle';
          }
        }, 1400);
      }

      // Highlight corresponding bottom system button
      document.querySelectorAll('.system-action-card').forEach(btn => {
        if (btn.getAttribute('data-action') === actionName) {
          btn.classList.add('pulse');
          setTimeout(() => btn.classList.remove('pulse'), 600);
        }
      });
    }

    // Feed Cat
    function feedCat(type = 'kibble') {
      soundChomp();
      kibbleCount++;
      if (hudKibbleCount) hudKibbleCount.textContent = '× ' + kibbleCount;

      const increment = type === 'can' ? 12 : 5;
      setWeight(currentWeight + increment);

      spawnFloatingEffect(type === 'can' ? 'DELICIOUS! 🐟 (+12%)' : 'CRUNCH! 🍪 (+5%)');

      // Happy cat wiggle
      if (cat) {
        cat.classList.add('anim-chomp');
        setTimeout(() => cat.classList.remove('anim-chomp'), 600);
      }
    }

    // Floating text FX over the cat
    function spawnFloatingEffect(text) {
      const container = document.querySelector('.muchi-effects-layer');
      if (!container) return;
      const el = document.createElement('div');
      el.className = 'muchi-float-text';
      el.textContent = text;
      container.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }

    // Mode Switching
    function setMode(mode) {
      currentMode = mode;
      [btnModeGame, btnModeSplit, btnModeTerminal].forEach(btn => {
        if (btn) btn.classList.remove('active');
      });

      if (screen) {
        screen.classList.remove('mode-game', 'mode-split', 'mode-terminal');
        screen.classList.add('mode-' + mode);
      }

      if (mode === 'game') {
        if (btnModeGame) btnModeGame.classList.add('active');
        if (cliOverlay) cliOverlay.style.display = 'none';
      } else if (mode === 'split') {
        if (btnModeSplit) btnModeSplit.classList.add('active');
        if (cliOverlay) {
          cliOverlay.style.display = 'flex';
          cliOverlay.classList.remove('fullscreen');
        }
        if (cliInput) cliInput.focus();
      } else if (mode === 'terminal') {
        if (btnModeTerminal) btnModeTerminal.classList.add('active');
        if (cliOverlay) {
          cliOverlay.style.display = 'flex';
          cliOverlay.classList.add('fullscreen');
        }
        if (cliInput) cliInput.focus();
      }
    }

    function togglePause() {
      isPaused = !isPaused;
      if (pauseBtn) {
        pauseBtn.textContent = isPaused ? '▶' : '||';
        pauseBtn.classList.toggle('paused', isPaused);
      }
      if (screen) screen.classList.toggle('game-paused', isPaused);
      soundClick();
    }

    // Output line to CLI
    function logToCli(text, type = '') {
      if (!cliOutput) return;
      const row = document.createElement('div');
      row.className = 'cli-row ' + (type ? 'text-' + type : '');
      row.innerHTML = text;
      cliOutput.appendChild(row);
      cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    // Interactive CLI Command Processor
    function handleCliCommand(cmdRaw) {
      const cmd = (cmdRaw || '').trim().toLowerCase();
      if (!cmd) return;

      logToCli(`<span class="prompt-sym">muchineko@city:~$</span> ${escapeHtml(cmd)}`, 'cmd');

      const parts = cmd.split(/\s+/);
      const action = parts[0];

      switch (action) {
        case 'help':
          logToCli(`
<div class="cli-help-grid">
  <div><strong class="highlight-cyan">jump</strong> / <strong class="highlight-cyan">j</strong> - Cat leaps over rooftop gap</div>
  <div><strong class="highlight-cyan">run</strong> / <strong class="highlight-cyan">r</strong> - Start high-speed sprint</div>
  <div><strong class="highlight-cyan">fall</strong> - Cat lands heavy on rooftop</div>
  <div><strong class="highlight-cyan">feed</strong> / <strong class="highlight-cyan">f</strong> - Feed dry kibble treats (+5% wt)</div>
  <div><strong class="highlight-cyan">can</strong> - Feed gourmet fish can (+12% wt)</div>
  <div><strong class="highlight-cyan">heavy</strong> / <strong class="highlight-cyan">fat</strong> - Set cat to 32kg heavy form</div>
  <div><strong class="highlight-cyan">slim</strong> / <strong class="highlight-cyan">light</strong> - Set cat to 10kg agile form</div>
  <div><strong class="highlight-cyan">normal</strong> - Reset cat to 18kg standard form</div>
  <div><strong class="highlight-cyan">weight [0-100]</strong> - Set weight gauge directly</div>
  <div><strong class="highlight-cyan">stats</strong> - Display cat telemetry & calories</div>
  <div><strong class="highlight-cyan">mode [game|split|term]</strong> - Change screen display layout</div>
  <div><strong class="highlight-cyan">about</strong> - Creator bio & creative engineering info</div>
  <div><strong class="highlight-cyan">skills</strong> - Technical frameworks & 3D stack</div>
  <div><strong class="highlight-cyan">clear</strong> - Clear console log</div>
</div>`, 'info');
          break;

        case 'jump':
        case 'j':
          triggerAction('jump');
          logToCli(`Cat leapt across the rooftop vents! (Jump height: 184px, Velocity: 14 m/s)`, 'success');
          break;

        case 'run':
        case 'r':
          triggerAction('run');
          logToCli(`Cat is running along the Bauhaus ledge! 💨`, 'success');
          break;

        case 'fall':
          triggerAction('fall');
          logToCli(`Cat landed with a soft, chubby thump. 🐾`, 'success');
          break;

        case 'feed':
        case 'f':
          feedCat('kibble');
          logToCli(`Ate crunchy kibble (カリカリ). Weight now: ${Math.round(currentWeight)}%. 🍪`, 'success');
          break;

        case 'can':
        case 'c':
          feedCat('can');
          logToCli(`Ate tuna can (ねこ缶)! High protein boost! Weight now: ${Math.round(currentWeight)}%. 🐟`, 'success');
          break;

        case 'heavy':
        case 'fat':
        case 'chubby':
          setCatState('heavy');
          logToCli(`Cat state transitioned to: <strong>重い (HEAVY / 32kg)</strong>. Maximum chubbiness achieved!`, 'success');
          break;

        case 'slim':
        case 'light':
        case 'lean':
          setCatState('light');
          logToCli(`Cat state transitioned to: <strong>軽い (LIGHT / 10kg)</strong>. Maximum jump velocity ready.`, 'success');
          break;

        case 'normal':
        case 'reset':
          setCatState('normal');
          logToCli(`Cat state returned to: <strong>ふつう (NORMAL / 18kg)</strong>.`, 'success');
          break;

        case 'weight':
          if (parts[1] && !isNaN(parts[1])) {
            const val = parseInt(parts[1], 10);
            setWeight(val);
            logToCli(`Weight gauge calibrated to ${val}%.`, 'success');
          } else {
            logToCli(`Usage: weight [0-100] (current: ${Math.round(currentWeight)}%)`, 'dim');
          }
          break;

        case 'stats':
          logToCli(`
<strong>むちねこ SYSTEM TELEMETRY:</strong>
• Name: Calico Muchineko (むちねこ)
• Current Weight: ${Math.round(currentWeight)}% (${currentCatState.toUpperCase()})
• Treats Collected: ${kibbleCount} units
• Location: Neo-Tokyo Rooftop Sector-07
• Jump Arc Capacity: ${currentWeight > 70 ? 'Low (Too Chubby!)' : 'High (Aerodynamic)'}
• Tagline: 食べたい。でも、飛べなくなる。`, 'info');
          break;

        case 'mode':
          if (parts[1] === 'game') setMode('game');
          else if (parts[1] === 'split') setMode('split');
          else if (parts[1] === 'term' || parts[1] === 'terminal') setMode('terminal');
          else logToCli(`Usage: mode [game | split | terminal]`, 'dim');
          break;

        case 'about':
          logToCli(`
<strong>SRINJOYEE DEY</strong> // Creative Technologist & Game Developer
Building tactile interactive systems, 3D character engines, and AI agents.
"Turning bold, playful ideas into things people can actually touch and control."`, 'info');
          break;

        case 'skills':
          logToCli(`
<strong>CORE STACK:</strong>
• 3D & Graphics: Three.js, WebGL, Blender, GLTF Pipelines
• Front-End: JavaScript (ES6+), React, Tailwind, Next.js
• AI & Systems: Python, PyTorch, Autonomous Agent Orchestration, OpenCV`, 'info');
          break;

        case 'clear':
        case 'cls':
          if (cliOutput) cliOutput.innerHTML = '';
          break;

        default:
          soundError();
          logToCli(`Command not recognized: '<span class="highlight-red">${escapeHtml(cmd)}</span>'. Type <strong class="highlight-cyan">'help'</strong> for commands list.`, 'error');
          break;
      }
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // Attach Event Listeners
    if (cliSend && cliInput) {
      cliSend.addEventListener('click', () => {
        const val = cliInput.value;
        cliInput.value = '';
        handleCliCommand(val);
      });

      cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = cliInput.value;
          cliInput.value = '';
          handleCliCommand(val);
        }
      });
    }

    // Quick Command Chips
    document.querySelectorAll('.cli-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          soundClick();
          handleCliCommand(cmd);
        }
      });
    });

    // Top HUD Mode Buttons
    if (btnModeGame) btnModeGame.addEventListener('click', () => setMode('game'));
    if (btnModeSplit) btnModeSplit.addEventListener('click', () => setMode('split'));
    if (btnModeTerminal) btnModeTerminal.addEventListener('click', () => setMode('terminal'));
    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);

    // Click on the cat inside phone triggers a jump!
    if (cat) {
      cat.addEventListener('click', () => triggerAction('jump'));
    }

    // Bottom Specs Interactivity:
    // 1. SYSTEM Actions (Run, Jump, Fall)
    document.querySelectorAll('.system-action-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        if (action) triggerAction(action);
      });
    });

    // 2. CAT STATE (Light, Normal, Heavy)
    document.querySelectorAll('.state-stage-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const st = btn.getAttribute('data-state');
        if (st) {
          soundClick();
          setCatState(st);
          logToCli(`Switched cat form to: <strong>${st}</strong>`, 'info');
        }
      });
    });

    // 3. ITEMS (Kibble, Can)
    document.querySelectorAll('.item-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.getAttribute('data-item');
        feedCat(item);
      });
    });

    // 4. Color Swatches Copy
    document.querySelectorAll('.swatch-item').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const hex = swatch.getAttribute('data-hex');
        if (hex && navigator.clipboard) {
          navigator.clipboard.writeText(hex).then(() => {
            soundClick();
            spawnFloatingEffect(`COPIED ${hex}! 🎨`);
          });
        }
      });
    });

    // Initial setup
    setWeight(42);
    setCatState('normal', false);
    // Default to split mode so user immediately sees both the cat runner and the interactive CLI!
    setMode('split');
  }
})();
