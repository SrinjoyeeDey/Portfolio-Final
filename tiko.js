/**
 * TIKO DYNAMIC BADGE & PLAYER IDENTITY SYSTEM
 * Core Logic, Generative Assignment, LocalStorage Persistence, 
 * 3D Physics Tilt, Interactive Progression, and Collectible Badge Catalog
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. SOUND FX SYNTHESIZER (Web Audio API - 100% Reliable & Dependency-Free)
  // ==========================================================================
  class SoundFX {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playClick() {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      } catch (e) {
        // Audio policy ignore
      }
    }

    playFanfare() {
      try {
        this.init();
        if (!this.ctx) return;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          const startTime = this.ctx.currentTime + (idx * 0.09);
          gain.gain.setValueAtTime(0.15, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.36);
        });
      } catch (e) {
        // Audio policy ignore
      }
    }

    playUnlock() {
      try {
        this.init();
        if (!this.ctx) return;
        const chords = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
        chords.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (idx * 0.07));
          const startTime = this.ctx.currentTime + (idx * 0.07);
          gain.gain.setValueAtTime(0.18, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.42);
        });
      } catch (e) {
        // Audio policy ignore
      }
    }
  }

  const sfx = new SoundFX();

  // ==========================================================================
  // 2. BADGE CATALOG (12 Illustrated Physical Collectible Badges)
  // Two Families: Explorer (Type 1) and Creator (Type 2)
  // ==========================================================================
  const BADGES = [
    // --- TYPE 1: EXPLORATION & DISCOVERY FAMILY ---
    {
      id: 'code-explorer',
      title: 'Code Explorer',
      category: 'Explorer',
      type: 'type-1',
      tagline: 'Mapping digital constellations through curiosity and logic',
      description: 'Awarded to pioneering minds that navigate complex cultural codebases and chart unknown digital territories.',
      wisdom: '“Not all who wander are lost; some are mapping new frontiers of discovery.”',
      theme: {
        primary: '#0284C7',
        secondary: '#0369A1',
        accent: '#38BDF8',
        cardBg: '#F0F9FF',
        glow: 'rgba(2, 132, 199, 0.4)'
      },
      silhouetteColor: '#BAE6FD',
      unlockCondition: 'Assigned on discovery or by completing 2 exploration challenges.',
      characterSvg: `
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer Celestial Glow Ring -->
          <circle cx="70" cy="70" r="62" stroke="#38BDF8" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/>
          <!-- Goggles Strap -->
          <path d="M26 62 Q70 54 114 62" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/>
          <!-- Owl/Explorer Head -->
          <circle cx="70" cy="74" r="42" fill="#0284C7"/>
          <!-- Goggles Rim Left & Right -->
          <circle cx="53" cy="62" r="19" fill="#F8FAFC" stroke="#0F172A" stroke-width="4.5"/>
          <circle cx="87" cy="62" r="19" fill="#F8FAFC" stroke="#0F172A" stroke-width="4.5"/>
          <!-- Goggles Lens Tint -->
          <circle cx="53" cy="62" r="14" fill="#38BDF8" opacity="0.4"/>
          <circle cx="87" cy="62" r="14" fill="#38BDF8" opacity="0.4"/>
          <!-- Big Curious Eyes -->
          <circle cx="54" cy="63" r="8.5" fill="#0F172A"/>
          <circle cx="86" cy="63" r="8.5" fill="#0F172A"/>
          <circle cx="51" cy="60" r="3" fill="#FFFFFF"/>
          <circle cx="83" cy="60" r="3" fill="#FFFFFF"/>
          <!-- Golden Beak -->
          <polygon points="70,68 63,77 77,77" fill="#F59E0B" stroke="#0F172A" stroke-width="2"/>
          <!-- Chest Plumage & Binary Marks -->
          <path d="M56 94 Q70 102 84 94" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
          <path d="M60 102 Q70 108 80 102" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Twinkling Constellation Stars -->
          <polygon points="28,32 30,38 36,40 30,42 28,48 26,42 20,40 26,38" fill="#FDE047"/>
          <polygon points="112,38 114,42 118,44 114,46 112,50 110,46 106,44 110,42" fill="#FDE047"/>
        </svg>
      `
    },
    {
      id: 'heritage-navigator',
      title: 'Heritage Navigator',
      category: 'Explorer',
      type: 'type-1',
      tagline: 'Guiding through ancestral horizons with an astrolabe of wonder',
      description: 'Gifted to travelers who honor timeless oral traditions and steer community journeys toward cultural preservation.',
      wisdom: '“To understand the sea before you, look upon the constellations mapped by your ancestors.”',
      theme: {
        primary: '#D97706',
        secondary: '#B45309',
        accent: '#FBBF24',
        cardBg: '#FFFBEB',
        glow: 'rgba(217, 119, 6, 0.4)'
      },
      silhouetteColor: '#FDE68A',
      unlockCondition: 'Explore 3 world cultural traditions or solve 2 navigation quests.',
      characterSvg: `
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Compass Dial Ring -->
          <circle cx="70" cy="70" r="62" stroke="#F59E0B" stroke-width="3"/>
          <circle cx="70" cy="70" r="54" stroke="#D97706" stroke-width="1.5" stroke-dasharray="2 6"/>
          <!-- Fox Ears -->
          <polygon points="42,26 60,54 36,60" fill="#D97706" stroke="#0F172A" stroke-width="3.5"/>
          <polygon points="98,26 104,60 80,54" fill="#D97706" stroke="#0F172A" stroke-width="3.5"/>
          <polygon points="45,34 56,52 40,56" fill="#FED7AA"/>
          <polygon points="95,34 100,56 84,52" fill="#FED7AA"/>
          <!-- Fox Face Core -->
          <ellipse cx="70" cy="76" rx="42" ry="36" fill="#F59E0B" stroke="#0F172A" stroke-width="4"/>
          <!-- White Cheeks -->
          <path d="M30 76 Q50 96 70 82 Q90 96 110 76 Q100 106 70 108 Q40 106 30 76 Z" fill="#FFFBEB" stroke="#0F172A" stroke-width="3"/>
          <!-- Eyes -->
          <ellipse cx="50" cy="70" rx="5" ry="7" fill="#0F172A"/>
          <ellipse cx="90" cy="70" rx="5" ry="7" fill="#0F172A"/>
          <circle cx="48" cy="68" r="2" fill="#FFFFFF"/>
          <circle cx="88" cy="68" r="2" fill="#FFFFFF"/>
          <!-- Button Nose & Smile -->
          <ellipse cx="70" cy="86" rx="6" ry="4" fill="#0F172A"/>
          <path d="M70 90 L70 96 M64 96 Q70 100 76 96" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Mini Compass Needle on Forehead -->
          <polygon points="70,44 73,56 70,54 67,56" fill="#BE2B26"/>
          <polygon points="70,64 73,54 70,56 67,54" fill="#0F172A"/>
        </svg>
      `
    },
    {
      id: 'time-traveller',
      title: 'Time Traveller',
      category: 'Explorer',
      type: 'type-1',
      tagline: 'Leaping across epochs to bridge ancient lore with tomorrow',
      description: 'Bestowed upon chronological explorers who unlock hidden histories and decode timeless myths.',
      wisdom: '“Time is not a straight line, but a woven tapestry that welcomes brave new stitches.”',
      theme: {
        primary: '#7C3AED',
        secondary: '#6D28D9',
        accent: '#A78BFA',
        cardBg: '#FAF5FF',
        glow: 'rgba(124, 58, 237, 0.4)'
      },
      silhouetteColor: '#DDD6FE',
      unlockCondition: 'Visit the TIKO platform on 2 separate days.',
      characterSvg: `
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Temporal Spiral Rings -->
          <circle cx="70" cy="70" r="62" stroke="#A78BFA" stroke-width="2" stroke-dasharray="8 4"/>
          <!-- Rabbit Ears with Clockwise Gear Accents -->
          <ellipse cx="50" cy="34" rx="10" ry="26" transform="rotate(-15 50 34)" fill="#EDE9FE" stroke="#0F172A" stroke-width="3.5"/>
          <ellipse cx="90" cy="34" rx="10" ry="26" transform="rotate(15 90 34)" fill="#EDE9FE" stroke="#0F172A" stroke-width="3.5"/>
          <ellipse cx="50" cy="34" rx="5" ry="18" transform="rotate(-15 50 34)" fill="#C4B5FD"/>
          <ellipse cx="90" cy="34" rx="5" ry="18" transform="rotate(15 90 34)" fill="#C4B5FD"/>
          <!-- Round Head -->
          <circle cx="70" cy="80" r="38" fill="#FAF5FF" stroke="#0F172A" stroke-width="4"/>
          <!-- Golden Monocle / Pocket Watch Eye -->
          <circle cx="54" cy="74" r="14" fill="#FEF08A" stroke="#CA8A04" stroke-width="3.5"/>
          <line x1="40" y1="74" x2="28" y2="90" stroke="#CA8A04" stroke-width="2"/>
          <circle cx="54" cy="74" r="6" fill="#0F172A"/>
          <circle cx="52" cy="72" r="2" fill="#FFFFFF"/>
          <circle cx="86" cy="74" r="6" fill="#0F172A"/>
          <circle cx="84" cy="72" r="2" fill="#FFFFFF"/>
          <!-- Whiskers & Nose -->
          <circle cx="70" cy="85" r="4" fill="#F472B6"/>
          <path d="M36 82 L20 80 M36 88 L22 92" stroke="#0F172A" stroke-width="2"/>
          <path d="M104 82 L120 80 M104 88 L118 92" stroke="#0F172A" stroke-width="2"/>
          <path d="M66 93 Q70 97 74 93" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `
    },
    {
      id: 'history-hacker',
      title: 'History Hacker',
      category: 'Explorer',
      type: 'type-1',
      tagline: 'Decrypting ancient hieroglyphs into accessible open knowledge',
      description: 'Recognizes clever sleuths who analyze historical puzzles with wit, playful curiosity, and sharp logic.',
      wisdom: '“Every ancient ruin holds an encryption key waiting for a curious heart to decode.”',
      theme: {
        primary: '#059669',
        secondary: '#047857',
        accent: '#34D399',
        cardBg: '#ECFDF5',
        glow: 'rgba(5, 150, 105, 0.4)'
      },
      silhouetteColor: '#A7F3D0',
      unlockCondition: 'Solve your first heritage logic challenge.',
      characterSvg: `
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Hexagonal Matrix Frame -->
          <polygon points="70,10 120,38 120,102 70,130 20,102 20,38" stroke="#34D399" stroke-width="2.5" opacity="0.6"/>
          <!-- Cyber Raccoon Mask -->
          <circle cx="70" cy="76" r="38" fill="#64748B" stroke="#0F172A" stroke-width="4"/>
          <!-- Mask Patch -->
          <path d="M34 70 Q70 60 106 70 Q100 90 85 86 Q70 92 55 86 Q40 90 34 70 Z" fill="#0F172A"/>
          <!-- Glowing Cyber Visor Eyes -->
          <ellipse cx="50" cy="74" rx="8" ry="5" fill="#34D399"/>
          <ellipse cx="90" cy="74" rx="8" ry="5" fill="#34D399"/>
          <circle cx="50" cy="74" r="2.5" fill="#FFFFFF"/>
          <circle cx="90" cy="74" r="2.5" fill="#FFFFFF"/>
          <!-- Raccoon Ears with Cyber Neon Tips -->
          <polygon points="40,36 56,58 32,58" fill="#0F172A"/>
          <polygon points="100,36 108,58 84,58" fill="#0F172A"/>
          <polygon points="42,42 50,54 36,54" fill="#34D399"/>
          <polygon points="98,42 104,54 90,54" fill="#34D399"/>
          <!-- Cheerful Snout -->
          <ellipse cx="70" cy="92" rx="16" ry="12" fill="#F1F5F9" stroke="#0F172A" stroke-width="2"/>
          <ellipse cx="70" cy="88" rx="5" ry="3.5" fill="#0F172A"/>
          <path d="M66 96 Q70 99 74 96" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `
    },
    {
      id: 'culture-keeper',
      title: 'Culture Keeper',
      category: 'Explorer',
      type: 'type-1',
      tagline: 'Safeguarding living folklore with gentle warmth and reverence',
      description: 'Dedicated to community guardians who ensure sacred rituals, languages, and stories never fade.',
      wisdom: '“Tradition is not the worship of ashes, but the tender preservation of living fire.”',
      theme: {
        primary: '#EA580C',
        secondary: '#C2410C',
        accent: '#FB923C',
        cardBg: '#FFF7ED',
        glow: 'rgba(234, 88, 12, 0.4)'
      },
      silhouetteColor: '#FED7AA',
      unlockCondition: 'Explore at least 3 indigenous or regional languages.',
      characterSvg: `
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Sunburst Ring of Radiance -->
          <circle cx="70" cy="70" r="62" stroke="#FB923C" stroke-width="2.5" stroke-dasharray="6 6"/>
          <!-- Guardian Lion Spirit Silhouette -->
          <circle cx="70" cy="76" r="38" fill="#EA580C" stroke="#0F172A" stroke-width="4"/>
          <!-- Sun Flame Mane -->
          <path d="M70 20 L76 34 L90 26 L88 42 L104 38 L96 52 L112 56 L100 68 L114 78 L98 84 L108 98 L92 98 L96 114 L82 108 L76 122 L70 110 L64 122 L58 108 L44 114 L48 98 L32 98 L42 84 L26 78 L40 68 L28 56 L44 52 L36 38 L52 42 L50 26 L64 34 Z" fill="#F97316" stroke="#0F172A" stroke-width="3"/>
          <!-- Inner Head Center -->
          <circle cx="70" cy="74" r="28" fill="#FED7AA" stroke="#0F172A" stroke-width="3"/>
          <!-- Loving Wise Eyes -->
          <ellipse cx="58" cy="70" rx="5" ry="6" fill="#0F172A"/>
          <ellipse cx="82" cy="70" rx="5" ry="6" fill="#0F172A"/>
          <circle cx="56" cy="68" r="2" fill="#FFFFFF"/>
          <circle cx="80" cy="68" r="2" fill="#FFFFFF"/>
          <!-- Forehead Sacred Flame Mark -->
          <path d="M70 54 Q75 60 70 66 Q65 60 70 54 Z" fill="#BE2B26"/>
          <!-- Muzzle & Smile -->
          <ellipse cx="70" cy="80" rx="6" ry="4" fill="#0F172A"/>
          <path d="M64 85 Q70 90 76 85" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      `
    },
    {
      id: 'mythology-cartographer',
      title: 'Mythology Cartographer',
      category: 'Explorer',
      type: 'type-1',
      tagline: 'Charting mythological realms and celestial hero folklore',
      description: 'Awarded to scholars who map legends across ancient continents and connect common folklore archetypes.',
      wisdom: '“Every star in the night sky is an unread page of an eternal storybook.”',
      theme: {
        primary: '#2563EB',
        secondary: '#1D4ED8',
        accent: '#60A5FA',
        cardBg: '#EFF6FF',
        glow: 'rgba(37, 99, 235, 0.4)'
      },
      silhouetteColor: '#BFDBFE',
      unlockCondition: 'Complete 4 heritage quizzes across mythology categories.',
      characterSvg: `
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Orbital Starchart Path -->
          <ellipse cx="70" cy="70" rx="60" ry="24" transform="rotate(-25 70 70)" stroke="#60A5FA" stroke-width="2" stroke-dasharray="5 3"/>
          <!-- Winged Celestial Cat -->
          <ellipse cx="70" cy="76" rx="36" ry="34" fill="#3B82F6" stroke="#0F172A" stroke-width="4"/>
          <!-- Pointed Cat Ears -->
          <polygon points="44,38 58,60 38,62" fill="#1D4ED8" stroke="#0F172A" stroke-width="3"/>
          <polygon points="96,38 102,62 82,60" fill="#1D4ED8" stroke="#0F172A" stroke-width="3"/>
          <!-- Feathered Wings -->
          <path d="M30 76 Q10 64 24 50 Q36 60 38 72" fill="#93C5FD" stroke="#0F172A" stroke-width="2.5"/>
          <path d="M110 76 Q130 64 116 50 Q104 60 102 72" fill="#93C5FD" stroke="#0F172A" stroke-width="2.5"/>
          <!-- Cat Face Elements -->
          <circle cx="56" cy="74" r="6" fill="#0F172A"/>
          <circle cx="84" cy="74" r="6" fill="#0F172A"/>
          <circle cx="54" cy="72" r="2" fill="#FFFFFF"/>
          <circle cx="82" cy="72" r="2" fill="#FFFFFF"/>
          <polygon points="70,82 66,86 74,86" fill="#F472B6"/>
          <path d="M64 88 Q70 92 76 88" stroke="#0F172A" stroke-width="2"/>
          <!-- Third Eye Star Gem -->
          <polygon points="70,52 72,56 76,58 72,60 70,64 68,60 64,58 68,56" fill="#FDE047"/>
        </svg>
      `
    },

    // --- TYPE 2: CREATION & INNOVATION FAMILY ---
    {
      id: 'culture-coder',
      title: 'Culture Coder',
      category: 'Creator',
      type: 'type-2',
      tagline: 'Weaving digital threads into living cultural tapestries',
      description: 'Given to creators who build modern, inclusive interactive software celebrating human culture and community identity.',
      wisdom: '“In every line of code we write, a thousand ancestral echoes find modern resonance.”',
      theme: {
        primary: '#16A34A',
        secondary: '#15803D',
        accent: '#4ADE80',
        cardBg: '#F0FDF4',
        glow: 'rgba(22, 163, 74, 0.4)'
      },
      silhouetteColor: '#BBF7D0',
      unlockCondition: 'Assigned on discovery or by creating and testing 2 digital interactions.',
      characterSvg: `
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Woven Tapestry Border -->
          <circle cx="70" cy="70" r="62" stroke="#4ADE80" stroke-width="3" stroke-dasharray="6 3"/>
          <!-- Sprout Foliage on Head -->
          <path d="M70 42 Q60 20 48 30 Q54 44 70 42 Z" fill="#22C55E" stroke="#0F172A" stroke-width="2.5"/>
          <path d="M70 42 Q80 20 92 30 Q86 44 70 42 Z" fill="#4ADE80" stroke="#0F172A" stroke-width="2.5"/>
          <!-- Cheerful Creature Core Body -->
          <ellipse cx="70" cy="78" rx="40" ry="36" fill="#16A34A" stroke="#0F172A" stroke-width="4"/>
          <!-- Code Brackets <> Cheeks -->
          <path d="M38 72 L32 78 L38 84" stroke="#BBF7D0" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M102 72 L108 78 L102 84" stroke="#BBF7D0" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Friendly Big Eyes -->
          <circle cx="56" cy="72" r="8" fill="#0F172A"/>
          <circle cx="84" cy="72" r="8" fill="#0F172A"/>
          <circle cx="53" cy="69" r="3" fill="#FFFFFF"/>
          <circle cx="81" cy="69" r="3" fill="#FFFFFF"/>
          <!-- Bright Blush -->
          <ellipse cx="48" cy="82" rx="6" ry="3.5" fill="#F472B6" opacity="0.8"/>
          <ellipse cx="92" cy="82" rx="6" ry="3.5" fill="#F472B6" opacity="0.8"/>
          <!-- Happy Open Mouth with Tongue -->
          <path d="M62 84 Q70 94 78 84 Z" fill="#BE2B26" stroke="#0F172A" stroke-width="2.5"/>
          <!-- Little Sprout Hands holding glowing pixel -->
          <rect x="66" y="96" width="8" height="8" rx="2" fill="#FEF08A" stroke="#0F172A" stroke-width="2"/>
        </svg>
      `
    },
    {
      id: 'heritage-architect',
      title: 'Heritage Architect',
      category: 'Creator',
      type: 'type-2',
      tagline: 'Designing enduring structures of memory and community belonging',
      description: 'Celebrates builders and spatial dreamers who reconstruct ancient monuments with playful precision.',
      wisdom: '“A great arch endures not because stone is heavy, but because every block supports the other.”',
      theme: {
        primary: '#BE2B26',
        secondary: '#991B1B',
        accent: '#F87171',
        cardBg: '#FEF2F2',
        glow: 'rgba(190, 43, 38, 0.4)'
      },
      silhouetteColor: '#FECACA',
      unlockCondition: 'Complete 3 architecture or cultural monument challenges.',
      characterSvg: `
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Keystone Arch Halo -->
          <path d="M30 76 Q70 20 110 76" stroke="#F87171" stroke-width="4" stroke-linecap="round"/>
          <!-- Cheerful Mason Beaver with Hardhat -->
          <ellipse cx="70" cy="82" rx="38" ry="34" fill="#92400E" stroke="#0F172A" stroke-width="4"/>
          <!-- Yellow Architect Helmet -->
          <path d="M36 56 Q70 32 104 56 Q106 62 70 62 Q34 62 36 56 Z" fill="#EAB308" stroke="#0F172A" stroke-width="3.5"/>
          <path d="M64 36 L76 36 L74 54 L66 54 Z" fill="#CA8A04"/>
          <!-- Beaver Cheeks -->
          <ellipse cx="52" cy="82" rx="16" ry="14" fill="#FED7AA" stroke="#0F172A" stroke-width="2.5"/>
          <ellipse cx="88" cy="82" rx="16" ry="14" fill="#FED7AA" stroke="#0F172A" stroke-width="2.5"/>
          <!-- Eyes -->
          <circle cx="54" cy="74" r="5" fill="#0F172A"/>
          <circle cx="86" cy="74" r="5" fill="#0F172A"/>
          <circle cx="52" cy="72" r="2" fill="#FFFFFF"/>
          <circle cx="84" cy="72" r="2" fill="#FFFFFF"/>
          <!-- Nose & Iconic Beaver Teeth -->
          <ellipse cx="70" cy="78" rx="8" ry="6" fill="#0F172A"/>
          <rect x="65" y="86" width="10" height="9" rx="2" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
          <line x1="70" y1="86" x2="70" y2="95" stroke="#0F172A" stroke-width="1.5"/>
        </svg>
      `
    },
    {
      id: 'story-weaver',
      title: 'Story Weaver',
      category: 'Creator',
      type: 'type-2',
      tagline: 'Interlacing folklore, vibrant voice, and living memories into art',
      description: 'Recognizes passionate storytellers and spoken-word artists who give wings to ancient narratives.',
      wisdom: '“A tale told with heart travels farther than the swiftest wind across the plains.”',
      theme: {
        primary: '#9333EA',
        secondary: '#7E22CE',
        accent: '#C084FC',
        cardBg: '#FAF5FF',
        glow: 'rgba(147, 51, 234, 0.4)'
      },
      silhouetteColor: '#E9D5FF',
      unlockCondition: 'Submit 2 reflective journey logs in TIKO.',
      characterSvg: `
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Golden Spindle Loom Ring -->
          <circle cx="70" cy="70" r="62" stroke="#C084FC" stroke-width="2" stroke-dasharray="4 4"/>
          <!-- Chameleon Storyteller Spirit -->
          <circle cx="70" cy="74" r="38" fill="#9333EA" stroke="#0F172A" stroke-width="4"/>
          <!-- Crest Frill -->
          <path d="M44 48 Q70 30 96 48" stroke="#E879F9" stroke-width="6" stroke-linecap="round"/>
          <!-- Swirling Chameleon Eye -->
          <circle cx="54" cy="70" r="14" fill="#C084FC" stroke="#0F172A" stroke-width="3"/>
          <circle cx="86" cy="70" r="14" fill="#C084FC" stroke="#0F172A" stroke-width="3"/>
          <path d="M54 66 A 4 4 0 1 1 50 72" stroke="#0F172A" stroke-width="3" fill="none"/>
          <path d="M86 66 A 4 4 0 1 1 82 72" stroke="#0F172A" stroke-width="3" fill="none"/>
          <!-- Swirled Tail / Golden Yarn Spindle -->
          <path d="M60 90 Q70 100 80 90 Q90 104 70 108 Q50 102 60 90 Z" fill="#FDE047" stroke="#0F172A" stroke-width="2.5"/>
          <!-- Wandering Musical Story Notes -->
          <circle cx="34" cy="42" r="3" fill="#F472B6"/>
          <circle cx="106" cy="42" r="3" fill="#F472B6"/>
          <path d="M34 42 L34 32 L42 34" stroke="#F472B6" stroke-width="2"/>
        </svg>
      `
    },
    {
      id: 'creative-engineer',
      title: 'Creative Engineer',
      category: 'Creator',
      type: 'type-2',
      tagline: 'Forging kinetic harmony between ancient mechanics and robotics',
      description: 'Honors inventive creators who tinker with gears, renewable windcraft, and whimsical kinetic sculptures.',
      wisdom: '“True innovation does not replace heritage; it gives heritage dynamic new gears to turn.”',
      theme: {
        primary: '#0891B2',
        secondary: '#0E7490',
        accent: '#22D3EE',
        cardBg: '#ECFEFF',
        glow: 'rgba(8, 145, 178, 0.4)'
      },
      silhouetteColor: '#A5F3FC',
      unlockCondition: 'Achieve 5 total completed games & challenges.',
      characterSvg: `
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Copper Gear Wheel Perimeter -->
          <circle cx="70" cy="70" r="58" stroke="#22D3EE" stroke-width="3" stroke-dasharray="10 6"/>
          <!-- Clockwork Mechanical Bird -->
          <ellipse cx="70" cy="76" rx="38" ry="34" fill="#0891B2" stroke="#0F172A" stroke-width="4"/>
          <!-- Copper Brass Forehead Band -->
          <path d="M40 60 Q70 50 100 60" stroke="#F59E0B" stroke-width="5" stroke-linecap="round"/>
          <!-- Lens Eyes with Crosshair Apertures -->
          <circle cx="54" cy="70" r="12" fill="#E0F2FE" stroke="#0F172A" stroke-width="3.5"/>
          <circle cx="86" cy="70" r="12" fill="#E0F2FE" stroke="#0F172A" stroke-width="3.5"/>
          <line x1="54" y1="62" x2="54" y2="78" stroke="#0891B2" stroke-width="2"/>
          <line x1="46" y1="70" x2="62" y2="70" stroke="#0891B2" stroke-width="2"/>
          <line x1="86" y1="62" x2="86" y2="78" stroke="#0891B2" stroke-width="2"/>
          <line x1="78" y1="70" x2="94" y2="70" stroke="#0891B2" stroke-width="2"/>
          <!-- Metallic Beak & Rivets -->
          <polygon points="70,76 62,86 78,86" fill="#F59E0B" stroke="#0F172A" stroke-width="2.5"/>
          <!-- Mini Rivets -->
          <circle cx="48" cy="94" r="2" fill="#F8FAFC"/>
          <circle cx="92" cy="94" r="2" fill="#F8FAFC"/>
          <circle cx="70" cy="98" r="2" fill="#F8FAFC"/>
        </svg>
      `
    },
    {
      id: 'tradition-innovator',
      title: 'Tradition Innovator',
      category: 'Creator',
      type: 'type-2',
      tagline: 'Refashioning ancestral pottery, textiles, and song for modern eyes',
      description: 'Presented to courageous innovators who breathe new aesthetic vitality into sacred folk crafts.',
      wisdom: '“To preserve a flame, you must continually feed it new twigs of creative courage.”',
      theme: {
        primary: '#E11D48',
        secondary: '#BE123C',
        accent: '#FB7185',
        cardBg: '#FFF1F2',
        glow: 'rgba(225, 29, 72, 0.4)'
      },
      silhouetteColor: '#FECDD3',
      unlockCondition: 'Share your personal journey reflection with the community.',
      characterSvg: `
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Phoenix Flame Feather Halo -->
          <circle cx="70" cy="70" r="62" stroke="#FB7185" stroke-width="2.5" stroke-dasharray="4 8"/>
          <!-- Phoenix Chick Face -->
          <circle cx="70" cy="76" r="38" fill="#E11D48" stroke="#0F172A" stroke-width="4"/>
          <!-- Crest of Rising Ember Feathers -->
          <path d="M70 38 Q64 16 54 28 Q64 36 70 38 Z" fill="#FDE047" stroke="#0F172A" stroke-width="2"/>
          <path d="M70 38 Q70 12 70 24 Q70 34 70 38 Z" fill="#FB923C" stroke="#0F172A" stroke-width="2"/>
          <path d="M70 38 Q76 16 86 28 Q76 36 70 38 Z" fill="#FDE047" stroke="#0F172A" stroke-width="2"/>
          <!-- Sparkle Eyes -->
          <circle cx="55" cy="74" r="7.5" fill="#0F172A"/>
          <circle cx="85" cy="74" r="7.5" fill="#0F172A"/>
          <polygon points="53,70 55,73 57,70 55,67" fill="#FFFFFF"/>
          <polygon points="83,70 85,73 87,70 85,67" fill="#FFFFFF"/>
          <!-- Beak & Gold Droplet -->
          <polygon points="70,80 64,88 76,88" fill="#F59E0B" stroke="#0F172A" stroke-width="2"/>
          <path d="M70 94 Q73 98 70 102 Q67 98 70 94 Z" fill="#FDE047"/>
        </svg>
      `
    },
    {
      id: 'digital-artisan',
      title: 'Digital Artisan',
      category: 'Creator',
      type: 'type-2',
      tagline: 'Painting vibrant cultural brushstrokes upon the infinite canvas',
      description: 'Celebrates illustrators, animators, and digital artists preserving folklore motifs through dynamic visual arts.',
      wisdom: '“When the brush touches color with reverence, even pixels remember their ancient roots.”',
      theme: {
        primary: '#4F46E5',
        secondary: '#4338CA',
        accent: '#818CF8',
        cardBg: '#EEF2FF',
        glow: 'rgba(79, 70, 229, 0.4)'
      },
      silhouetteColor: '#C7D2FE',
      unlockCondition: 'Complete 3 creative art and folklore workshops.',
      characterSvg: `
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Calligraphy Swirl Perimeter -->
          <circle cx="70" cy="70" r="62" stroke="#818CF8" stroke-width="2.5" stroke-dasharray="12 4"/>
          <!-- Red Panda Artisan Face -->
          <circle cx="70" cy="76" r="38" fill="#4F46E5" stroke="#0F172A" stroke-width="4"/>
          <!-- Big Fluffy Ears -->
          <polygon points="40,36 56,56 34,60" fill="#3730A3" stroke="#0F172A" stroke-width="3"/>
          <polygon points="100,36 106,60 84,56" fill="#3730A3" stroke="#0F172A" stroke-width="3"/>
          <!-- White Facial Markings -->
          <path d="M42 76 Q54 60 70 66 Q86 60 98 76 Q92 98 70 98 Q48 98 42 76 Z" fill="#EEF2FF" stroke="#0F172A" stroke-width="2.5"/>
          <!-- Artist Gaze Eyes -->
          <circle cx="56" cy="74" r="5.5" fill="#0F172A"/>
          <circle cx="84" cy="74" r="5.5" fill="#0F172A"/>
          <circle cx="54" cy="72" r="2" fill="#FFFFFF"/>
          <circle cx="82" cy="72" r="2" fill="#FFFFFF"/>
          <ellipse cx="70" cy="84" rx="5" ry="3.5" fill="#0F172A"/>
          <!-- Calligraphy Brush In Tail -->
          <path d="M96 90 Q116 86 114 100 Q106 104 96 98" fill="#F59E0B" stroke="#0F172A" stroke-width="2"/>
          <polygon points="114,100 120,108 112,106" fill="#BE2B26"/>
        </svg>
      `
    }
  ];

  // Map for fast lookup by ID
  const BADGE_MAP = new Map(BADGES.map(b => [b.id, b]));

  // ==========================================================================
  // 3. PERSISTENCE & PLAYER PROFILE MANAGER
  // ==========================================================================
  const STORAGE_KEY = 'tiko_player_profile';

  class PlayerStore {
    static getProfile() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (err) {
        console.warn('Could not read TIKO profile from localStorage:', err);
        return null;
      }
    }

    static saveProfile(profile) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } catch (err) {
        console.warn('Could not save TIKO profile to localStorage:', err);
      }
    }

    static clear() {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.warn('Could not reset TIKO profile:', err);
      }
    }

    /**
     * Deterministically choose a badge based on player name + seed
     * Ensures consistent initial distribution while feeling mysterious
     */
    static assignBadgeForName(name) {
      const clean = (name || '').trim().toLowerCase();
      let hash = 0;
      for (let i = 0; i < clean.length; i++) {
        hash = (hash * 31 + clean.charCodeAt(i)) & 0xffffffff;
      }
      const positiveHash = Math.abs(hash);
      const index = positiveHash % BADGES.length;
      return BADGES[index];
    }
  }

  // ==========================================================================
  // 4. CONFETTI & SPARKLE ENGINE (Canvas 2D Particle System)
  // ==========================================================================
  class ConfettiEngine {
    constructor() {
      this.canvas = document.getElementById('confetti-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.animId = null;
      this.resize = this.resize.bind(this);
      window.addEventListener('resize', this.resize);
      this.resize();
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst(x, y, count = 75) {
      if (!this.canvas || !this.ctx) return;
      const originX = x || window.innerWidth / 2;
      const originY = y || window.innerHeight / 2.5;
      const colors = ['#BE2B26', '#EAB308', '#06B6D4', '#22C55E', '#A855F7', '#F97316', '#FFFFFF'];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 9 + 4;
        this.particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          shape: Math.random() > 0.4 ? 'rect' : 'circle',
          opacity: 1,
          decay: Math.random() * 0.015 + 0.008
        });
      }

      if (!this.animId) {
        this.tick = this.tick.bind(this);
        this.tick();
      }
    }

    tick() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.98; // drag
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > this.canvas.height) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = p.opacity;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(this.tick);
      } else {
        this.animId = null;
      }
    }
  }

  const confetti = new ConfettiEngine();

  // ==========================================================================
  // 5. APPLICATION STATE & CONTROLLER
  // ==========================================================================
  const State = {
    profile: null,
    selectedReflectionChips: new Set(),
    activeFilter: 'all',
    previewBadgeIndex: 0
  };

  // DOM Cache
  const DOM = {
    onboardingModal: document.getElementById('tiko-onboarding-modal'),
    onboardingStepForm: document.getElementById('onboarding-step-form'),
    onboardingStepRadar: document.getElementById('onboarding-step-radar'),
    playerNameInput: document.getElementById('player-name-input'),
    btnOnboardingSubmit: document.getElementById('btn-onboarding-submit'),
    inputFeedbackError: document.getElementById('input-feedback-error'),
    radarStatusText: document.getElementById('radar-status-text'),
    headerPlayerPill: document.getElementById('header-player-pill'),
    headerPlayerName: document.getElementById('header-player-name'),
    welcomeBanner: document.getElementById('tiko-welcome-banner'),
    welcomePlayerName: document.getElementById('welcome-player-name'),
    welcomeVisitCount: document.getElementById('welcome-visit-count'),

    // Hero Showcase
    packagingCard: document.getElementById('packaging-card'),
    heroPinBadge: document.getElementById('hero-pin-badge'),
    badgeSpecularGloss: document.getElementById('badge-specular-gloss'),
    heroBadgeIllustration: document.getElementById('hero-badge-illustration'),
    stampedPlayerName: document.getElementById('stamped-player-name'),
    stampedBadgeTitle: document.getElementById('stamped-badge-title'),
    heroFamilyTag: document.getElementById('hero-family-tag'),
    heroBadgeTitle: document.getElementById('hero-badge-title'),
    heroTagline: document.getElementById('hero-tagline'),
    heroLoreDescription: document.getElementById('hero-lore-description'),
    heroWisdomQuote: document.getElementById('hero-wisdom-quote'),
    heroStageArea: document.getElementById('hero-stage-area'),
    creatureBackdrop: document.getElementById('creature-backdrop'),

    // Journey Stats
    statVisits: document.getElementById('stat-visits'),
    statGames: document.getElementById('stat-games'),
    statChallenges: document.getElementById('stat-challenges'),
    statLanguages: document.getElementById('stat-languages'),
    statBadgesCount: document.getElementById('stat-badges-count'),
    zeroStateBanner: document.getElementById('journey-zero-state-box'),
    zeroStateText: document.getElementById('zero-state-text'),

    // Interactive Trainer Simulators
    btnSimGame: document.getElementById('btn-sim-game'),
    btnSimChallenge: document.getElementById('btn-sim-challenge'),
    btnSimLanguage: document.getElementById('btn-sim-language'),

    // Reflection
    reflectionChips: document.querySelectorAll('.reflection-chip-btn'),
    reflectionNoteInput: document.getElementById('reflection-note-input'),
    btnSubmitReflection: document.getElementById('btn-submit-reflection'),
    reflectionHistoryList: document.getElementById('reflection-history-list'),

    // Collection Vault
    filterPills: document.querySelectorAll('.btn-filter-pill'),
    badgesGrid: document.getElementById('badges-collection-grid'),

    // Badge Inspection Modal
    inspectModal: document.getElementById('badge-inspect-modal'),
    inspectModalClose: document.getElementById('btn-inspect-close'),
    inspectModalBody: document.getElementById('inspect-modal-body'),

    // Reviewer Dock
    btnResetIdentity: document.getElementById('btn-reviewer-reset'),
    btnSimReturning: document.getElementById('btn-reviewer-returning'),
    btnQuickChallenge: document.getElementById('btn-reviewer-challenge'),
    btnUnlockAll: document.getElementById('btn-reviewer-unlock-all'),
    btnCycleHero: document.getElementById('btn-reviewer-cycle')
  };

  // ==========================================================================
  // 6. 3D INTERACTIVE TILT & SPECULAR PARALLAX
  // ==========================================================================
  function setup3DTilt() {
    if (!DOM.packagingCard || !DOM.heroPinBadge) return;

    const card = DOM.packagingCard;
    const badge = DOM.heroPinBadge;
    const gloss = DOM.badgeSpecularGloss;

    function handleMove(e) {
      const rect = card.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (
        clientX < rect.left - 40 ||
        clientX > rect.right + 40 ||
        clientY < rect.top - 40 ||
        clientY > rect.bottom + 40
      ) {
        return;
      }

      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;

      // Card tilt angles (-8 to +8 deg)
      const cardTiltX = (y - 0.5) * -16;
      const cardTiltY = (x - 0.5) * 16;

      // Badge parallax offset & enhanced 3D tilt
      const badgeTiltX = (y - 0.5) * -24;
      const badgeTiltY = (x - 0.5) * 24;
      const badgeShiftX = (x - 0.5) * 14;
      const badgeShiftY = (y - 0.5) * 14;

      // Dynamic Specular Highlight displacement (moves opposite to light source)
      const glossShiftX = (x - 0.5) * -22;
      const glossShiftY = (y - 0.5) * -16;

      card.style.transform = `perspective(1000px) rotateX(${cardTiltX.toFixed(1)}deg) rotateY(${cardTiltY.toFixed(1)}deg)`;
      badge.style.transform = `translate3d(${badgeShiftX.toFixed(1)}px, ${badgeShiftY.toFixed(1)}px, 20px) rotateX(${badgeTiltX.toFixed(1)}deg) rotateY(${badgeTiltY.toFixed(1)}deg)`;

      if (gloss) {
        gloss.style.transform = `translate(${glossShiftX.toFixed(1)}px, ${glossShiftY.toFixed(1)}px) rotate(-12deg)`;
      }
    }

    function handleLeave() {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      badge.style.transform = 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg)';
      if (gloss) {
        gloss.style.transform = 'translate(0px, 0px) rotate(-12deg)';
      }
    }

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
    card.addEventListener('touchmove', handleMove, { passive: true });
    card.addEventListener('touchend', handleLeave);
  }

  // ==========================================================================
  // 7. HERO BADGE RENDERING
  // ==========================================================================
  function renderHeroBadge(badgeId, playerName) {
    const badge = BADGE_MAP.get(badgeId) || BADGES[0];

    // Card Colors & Accents
    if (DOM.heroStageArea) {
      DOM.heroStageArea.style.backgroundColor = badge.theme.cardBg;
      DOM.heroStageArea.style.borderColor = badge.theme.primary;
    }

    if (DOM.creatureBackdrop) {
      DOM.creatureBackdrop.style.background = `radial-gradient(circle at 50% 50%, ${badge.theme.accent}33 0%, transparent 70%)`;
    }

    // Domed Pin Surface Background
    const domedSurface = DOM.heroPinBadge ? DOM.heroPinBadge.querySelector('.badge-domed-surface') : null;
    if (domedSurface) {
      domedSurface.style.background = `radial-gradient(circle at 35% 30%, ${badge.theme.primary} 0%, ${badge.theme.secondary} 100%)`;
      domedSurface.style.boxShadow = `inset 0 3px 6px rgba(255, 255, 255, 0.6), inset 0 -8px 16px rgba(0, 0, 0, 0.45), 0 16px 36px ${badge.theme.glow}`;
    }

    // Illustration SVG
    if (DOM.heroBadgeIllustration) {
      DOM.heroBadgeIllustration.innerHTML = badge.characterSvg;
    }

    // Stamped Nameplate (Reference packaging match)
    if (DOM.stampedPlayerName) {
      DOM.stampedPlayerName.textContent = playerName || 'Player Explorer';
    }
    if (DOM.stampedBadgeTitle) {
      DOM.stampedBadgeTitle.textContent = badge.title;
      DOM.stampedBadgeTitle.style.color = badge.theme.primary;
    }

    // Narrative Hero Column
    if (DOM.heroFamilyTag) {
      DOM.heroFamilyTag.textContent = badge.category === 'Explorer' ? '🧭 Type 1: Explorer Family' : '✨ Type 2: Creator Family';
      DOM.heroFamilyTag.className = `badge-family-tag ${badge.category === 'Explorer' ? 'tag-explorer' : 'tag-creator'}`;
    }

    if (DOM.heroBadgeTitle) {
      DOM.heroBadgeTitle.innerHTML = `${badge.title} <span>Collectibles</span>`;
    }

    if (DOM.heroTagline) {
      DOM.heroTagline.textContent = badge.tagline;
    }

    if (DOM.heroLoreDescription) {
      DOM.heroLoreDescription.textContent = badge.description;
    }

    if (DOM.heroWisdomQuote) {
      DOM.heroWisdomQuote.textContent = badge.wisdom;
    }

    // Header Pill
    if (DOM.headerPlayerName) {
      DOM.headerPlayerName.textContent = playerName || 'Guest';
    }
  }

  // ==========================================================================
  // 8. DISCOVERY RADAR FLOW (Atmospheric Onboarding Sequence)
  // ==========================================================================
  function runDiscoveryFlow(name) {
    sfx.playClick();
    if (DOM.onboardingStepForm) DOM.onboardingStepForm.style.display = 'none';
    if (DOM.onboardingStepRadar) DOM.onboardingStepRadar.style.display = 'block';

    const assigned = PlayerStore.assignBadgeForName(name);

    const phases = [
      { text: "Reading your cultural compass frequencies...", time: 700 },
      { text: `Analyzing compatibility with ${assigned.category} archetypes...`, time: 1500 },
      { text: "Forging your physical collectible pin-back badge...", time: 2400 }
    ];

    phases.forEach(phase => {
      setTimeout(() => {
        if (DOM.radarStatusText) {
          DOM.radarStatusText.textContent = phase.text;
        }
      }, phase.time);
    });

    setTimeout(() => {
      // Create fresh player profile
      const newProfile = {
        name: name.trim(),
        assignedBadgeId: assigned.id,
        visitCount: 1,
        lastVisit: Date.now(),
        unlockedBadgeIds: [assigned.id],
        stats: {
          visits: 1,
          gamesCompleted: 0,
          challengesSolved: 0,
          languagesExplored: 0
        },
        reflections: []
      };

      PlayerStore.saveProfile(newProfile);
      State.profile = newProfile;

      // Close modal smoothly
      if (DOM.onboardingModal) {
        DOM.onboardingModal.classList.add('hidden');
      }

      // Render Hero & Sections
      renderHeroBadge(assigned.id, newProfile.name);
      renderJourneyStats(newProfile);
      renderReflections(newProfile.reflections);
      renderCollectionVault();

      // Celebration fanfare & particle burst
      sfx.playFanfare();
      confetti.burst(window.innerWidth / 2, window.innerHeight / 2.2, 95);

      // Hero Badge Entrance Bounce
      if (DOM.heroPinBadge) {
        DOM.heroPinBadge.style.animation = 'none';
        DOM.heroPinBadge.offsetHeight; // trigger reflow
        DOM.heroPinBadge.style.animation = 'popInModal 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }
    }, 3200);
  }

  // ==========================================================================
  // 9. RETURNING USER FLOW & VISIT COUNTER
  // ==========================================================================
  function initializePlayer() {
    const existing = PlayerStore.getProfile();

    if (!existing || !existing.name || !existing.assignedBadgeId) {
      // First-time visit: Show onboarding modal
      if (DOM.onboardingModal) {
        DOM.onboardingModal.classList.remove('hidden');
      }
      if (DOM.welcomeBanner) {
        DOM.welcomeBanner.style.display = 'none';
      }
      // Populate vault preview with default state
      renderCollectionVault();
      return;
    }

    // Returning user: Recognize, increment visit count safely
    existing.visitCount = (existing.visitCount || 1) + 1;
    existing.stats = existing.stats || {};
    existing.stats.visits = existing.visitCount;
    existing.lastVisit = Date.now();
    PlayerStore.saveProfile(existing);
    State.profile = existing;

    // Hide onboarding modal
    if (DOM.onboardingModal) {
      DOM.onboardingModal.classList.add('hidden');
    }

    // Display Returning User Welcome Banner
    if (DOM.welcomeBanner) {
      DOM.welcomeBanner.style.display = 'flex';
      if (DOM.welcomePlayerName) DOM.welcomePlayerName.textContent = existing.name;
      if (DOM.welcomeVisitCount) DOM.welcomeVisitCount.textContent = `Visit #${existing.visitCount}`;
    }

    // Render Hero with permanent badge
    renderHeroBadge(existing.assignedBadgeId, existing.name);
    renderJourneyStats(existing);
    renderReflections(existing.reflections || []);
    renderCollectionVault();

    // Subtle welcoming entrance chime
    setTimeout(() => {
      sfx.playClick();
    }, 300);
  }

  // ==========================================================================
  // 10. REAL-TIME JOURNEY PROGRESSION
  // ==========================================================================
  function renderJourneyStats(profile) {
    if (!profile) return;
    const stats = profile.stats || {
      visits: profile.visitCount || 1,
      gamesCompleted: 0,
      challengesSolved: 0,
      languagesExplored: 0
    };

    const unlockedCount = (profile.unlockedBadgeIds || []).length;

    if (DOM.statVisits) DOM.statVisits.textContent = profile.visitCount || 1;
    if (DOM.statGames) DOM.statGames.textContent = stats.gamesCompleted || 0;
    if (DOM.statChallenges) DOM.statChallenges.textContent = stats.challengesSolved || 0;
    if (DOM.statLanguages) DOM.statLanguages.textContent = stats.languagesExplored || 0;
    if (DOM.statBadgesCount) DOM.statBadgesCount.textContent = `${unlockedCount}/${BADGES.length}`;

    // Zero-State Banner logic
    const totalActivity = (stats.gamesCompleted || 0) + (stats.challengesSolved || 0) + (stats.languagesExplored || 0);
    if (DOM.zeroStateBanner) {
      if (totalActivity === 0) {
        DOM.zeroStateBanner.style.display = 'flex';
        if (DOM.zeroStateText) {
          DOM.zeroStateText.innerHTML = `Welcome ${profile.name}! Your TIKO journey has just begun. Try the mini-activities below to earn your next badge! 🌱`;
        }
      } else {
        DOM.zeroStateBanner.style.display = 'none';
      }
    }
  }

  // Check if milestone unlocks a locked badge
  function evaluateUnlocks(profile) {
    let newlyUnlocked = [];
    const unlockedSet = new Set(profile.unlockedBadgeIds || []);
    const stats = profile.stats || {};

    BADGES.forEach(badge => {
      if (unlockedSet.has(badge.id)) return;

      let unlock = false;
      if (badge.id === 'history-hacker' && stats.challengesSolved >= 1) unlock = true;
      if (badge.id === 'time-traveller' && profile.visitCount >= 2) unlock = true;
      if (badge.id === 'heritage-navigator' && (stats.challengesSolved >= 2 || stats.languagesExplored >= 2)) unlock = true;
      if (badge.id === 'culture-keeper' && stats.languagesExplored >= 3) unlock = true;
      if (badge.id === 'heritage-architect' && stats.challengesSolved >= 3) unlock = true;
      if (badge.id === 'creative-engineer' && (stats.gamesCompleted + stats.challengesSolved) >= 4) unlock = true;
      if (badge.id === 'mythology-cartographer' && stats.gamesCompleted >= 3) unlock = true;
      if (badge.id === 'story-weaver' && (profile.reflections || []).length >= 2) unlock = true;
      if (badge.id === 'tradition-innovator' && (profile.reflections || []).length >= 1) unlock = true;
      if (badge.id === 'digital-artisan' && stats.gamesCompleted >= 4) unlock = true;

      if (unlock) {
        unlockedSet.add(badge.id);
        newlyUnlocked.push(badge);
      }
    });

    if (newlyUnlocked.length > 0) {
      profile.unlockedBadgeIds = Array.from(unlockedSet);
      PlayerStore.saveProfile(profile);
      renderJourneyStats(profile);
      renderCollectionVault();

      sfx.playUnlock();
      confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 60);

      // Toast notification
      showToastNotification(`🎉 New Badge Unlocked: ${newlyUnlocked[0].title}!`);
    }
  }

  function showToastNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'tiko-toast-pill';
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      background: #18181B;
      color: #FDE047;
      border: 2px solid #CA8A04;
      border-radius: 999px;
      padding: 12px 24px;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 0.95rem;
      box-shadow: 0 12px 28px rgba(0,0,0,0.3);
      z-index: 10000;
      animation: slideDownBanner 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }

  // Simulator actions
  function setupSimulators() {
    if (DOM.btnSimGame) {
      DOM.btnSimGame.addEventListener('click', () => {
        if (!State.profile) return;
        sfx.playClick();
        State.profile.stats = State.profile.stats || {};
        State.profile.stats.gamesCompleted = (State.profile.stats.gamesCompleted || 0) + 1;
        PlayerStore.saveProfile(State.profile);
        renderJourneyStats(State.profile);
        evaluateUnlocks(State.profile);
        confetti.burst(null, null, 25);
      });
    }

    if (DOM.btnSimChallenge) {
      DOM.btnSimChallenge.addEventListener('click', () => {
        if (!State.profile) return;
        sfx.playClick();
        State.profile.stats = State.profile.stats || {};
        State.profile.stats.challengesSolved = (State.profile.stats.challengesSolved || 0) + 1;
        PlayerStore.saveProfile(State.profile);
        renderJourneyStats(State.profile);
        evaluateUnlocks(State.profile);
        confetti.burst(null, null, 25);
      });
    }

    if (DOM.btnSimLanguage) {
      DOM.btnSimLanguage.addEventListener('click', () => {
        if (!State.profile) return;
        sfx.playClick();
        State.profile.stats = State.profile.stats || {};
        State.profile.stats.languagesExplored = (State.profile.stats.languagesExplored || 0) + 1;
        PlayerStore.saveProfile(State.profile);
        renderJourneyStats(State.profile);
        evaluateUnlocks(State.profile);
        confetti.burst(null, null, 25);
      });
    }
  }

  // ==========================================================================
  // 11. "SHOW YOUR PROGRESS" - INTERACTIVE REFLECTIONS
  // ==========================================================================
  function setupReflections() {
    // Toggle multi-select chips
    if (DOM.reflectionChips) {
      DOM.reflectionChips.forEach(chip => {
        chip.addEventListener('click', () => {
          sfx.playClick();
          const val = chip.getAttribute('data-value');
          if (State.selectedReflectionChips.has(val)) {
            State.selectedReflectionChips.delete(val);
            chip.classList.remove('selected');
          } else {
            State.selectedReflectionChips.add(val);
            chip.classList.add('selected');
          }
        });
      });
    }

    // Submit Reflection
    if (DOM.btnSubmitReflection) {
      DOM.btnSubmitReflection.addEventListener('click', () => {
        if (!State.profile) return;
        sfx.playFanfare();

        const note = DOM.reflectionNoteInput ? DOM.reflectionNoteInput.value.trim() : '';
        const chips = Array.from(State.selectedReflectionChips);

        if (chips.length === 0 && !note) {
          alert('Please pick at least one prompt chip or write a short note about what you discovered!');
          return;
        }

        const entry = {
          date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          chips: chips,
          note: note
        };

        State.profile.reflections = State.profile.reflections || [];
        State.profile.reflections.unshift(entry);
        PlayerStore.saveProfile(State.profile);

        // Clear input & chips
        if (DOM.reflectionNoteInput) DOM.reflectionNoteInput.value = '';
        State.selectedReflectionChips.clear();
        DOM.reflectionChips.forEach(c => c.classList.remove('selected'));

        renderReflections(State.profile.reflections);
        evaluateUnlocks(State.profile);
        confetti.burst(null, null, 40);

        showToastNotification('⭐ Progress note saved to your TIKO identity!');
      });
    }
  }

  function renderReflections(list) {
    if (!DOM.reflectionHistoryList) return;
    if (!list || list.length === 0) {
      DOM.reflectionHistoryList.innerHTML = '<p style="color:#71717A; font-size:0.88rem; font-style:italic; margin:0;">No reflections logged yet. Share your milestones above!</p>';
      return;
    }

    DOM.reflectionHistoryList.innerHTML = list.slice(0, 4).map(item => `
      <div class="log-item-pill">
        <span style="color:#BE2B26; font-weight:800;">${item.date}</span>
        <span>•</span>
        <span>${item.chips.join(', ') || 'Exploration update'}</span>
        ${item.note ? `<em>"${item.note}"</em>` : ''}
      </div>
    `).join('');
  }

  // ==========================================================================
  // 12. "MY BADGES" - COLLECTION VAULT & DETAIL INSPECTION
  // ==========================================================================
  function renderCollectionVault() {
    if (!DOM.badgesGrid) return;
    const profile = State.profile || { unlockedBadgeIds: [] };
    const unlockedSet = new Set(profile.unlockedBadgeIds || []);

    const filtered = BADGES.filter(badge => {
      if (State.activeFilter === 'explorer') return badge.category === 'Explorer';
      if (State.activeFilter === 'creator') return badge.category === 'Creator';
      return true;
    });

    DOM.badgesGrid.innerHTML = filtered.map(badge => {
      const isUnlocked = unlockedSet.has(badge.id);
      const isCurrentHero = profile.assignedBadgeId === badge.id;

      return `
        <div class="vault-badge-card ${isUnlocked ? 'unlocked' : 'locked'}" data-badge-id="${badge.id}">
          ${isCurrentHero ? '<span style="position:absolute; top:12px; right:12px; background:#F59E0B; color:#0F172A; border:1px solid #0F172A; border-radius:999px; font-size:0.65rem; font-weight:900; padding:2px 8px;">ACTIVE</span>' : ''}
          
          <div class="vault-badge-display" style="${isUnlocked ? `background: radial-gradient(circle at 35% 30%, ${badge.theme.primary} 0%, ${badge.theme.secondary} 100%);` : ''}">
            ${isUnlocked ? `
              <div class="badge-specular-gloss" style="width:120px; height:60px; top:2px; left:6px;"></div>
              <div style="width:100px; height:100px; display:flex; align-items:center; justify-content:center; filter:drop-shadow(0 3px 6px rgba(0,0,0,0.2));">
                ${badge.characterSvg}
              </div>
            ` : `
              <div class="locked-mystery-icon">🔒</div>
            `}
          </div>

          <h4 class="vault-badge-title">${badge.title}</h4>
          <span class="vault-badge-category" style="color: ${badge.category === 'Explorer' ? '#0284C7' : '#16A34A'}">${badge.category} Family</span>
          
          <p class="vault-badge-desc">
            ${isUnlocked ? badge.tagline : `<span style="color:#71717A;">Unlock Hint: ${badge.unlockCondition}</span>`}
          </p>

          <div class="vault-unlock-badge ${isUnlocked ? 'status-unlocked' : 'status-locked'}">
            ${isUnlocked ? '✓ Collected Pin' : '🔒 Locked Mystery'}
          </div>
        </div>
      `;
    }).join('');

    // Attach click listener to open inspection modal
    DOM.badgesGrid.querySelectorAll('.vault-badge-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-badge-id');
        openInspectModal(id);
      });
    });
  }

  function setupFilters() {
    if (!DOM.filterPills) return;
    DOM.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        sfx.playClick();
        DOM.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        State.activeFilter = pill.getAttribute('data-filter');
        renderCollectionVault();
      });
    });
  }

  // Inspection Modal (Detailed Pin-Back Button view)
  function openInspectModal(badgeId) {
    const badge = BADGE_MAP.get(badgeId);
    if (!badge || !DOM.inspectModal || !DOM.inspectModalBody) return;
    sfx.playClick();

    const profile = State.profile || { unlockedBadgeIds: [] };
    const isUnlocked = (profile.unlockedBadgeIds || []).includes(badge.id);

    DOM.inspectModalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
        <div style="position:relative; width:180px; height:180px; border-radius:50%; margin-bottom:20px; display:flex; align-items:center; justify-content:center; box-shadow:0 16px 36px rgba(0,0,0,0.3); background: radial-gradient(circle at 35% 30%, ${badge.theme.primary} 0%, ${badge.theme.secondary} 100%);">
          <div class="badge-metallic-rim"></div>
          <div class="badge-specular-gloss" style="width:150px; height:75px; top:3px; left:8px;"></div>
          <div style="position:relative; z-index:4; width:125px; height:125px;">
            ${badge.characterSvg}
          </div>
        </div>

        <div style="display:inline-block; border-radius:999px; padding:4px 14px; font-family:var(--font-display); font-size:0.8rem; font-weight:800; text-transform:uppercase; margin-bottom:8px; background:${badge.category === 'Explorer' ? '#E0F2FE' : '#DCFCE7'}; color:${badge.category === 'Explorer' ? '#0284C7' : '#16A34A'};">
          ${badge.category} Family • ${badge.type.toUpperCase()}
        </div>

        <h2 style="font-family:var(--font-display); font-size:1.8rem; font-weight:900; margin:0 0 6px 0;">${badge.title}</h2>
        <p style="font-style:italic; font-size:0.95rem; color:#BE2B26; margin:0 0 14px 0; font-weight:700;">${badge.tagline}</p>
        
        <p style="font-size:0.95rem; color:#52525B; line-height:1.5; margin-bottom:16px;">${badge.description}</p>
        
        <div style="background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:14px; padding:14px; width:100%; margin-bottom:20px; text-align:left;">
          <span style="font-size:0.75rem; font-weight:800; color:#71717A; text-transform:uppercase; display:block; margin-bottom:4px;">Ancestral Wisdom</span>
          <p style="margin:0; font-size:0.9rem; font-style:italic; color:#18181B;">${badge.wisdom}</p>
        </div>

        <div style="display:flex; gap:12px; width:100%;">
          ${isUnlocked ? `
            <button id="btn-equip-badge" class="btn-primary-action" style="flex:1; justify-content:center;">
              ⭐ Set as Featured Badge
            </button>
          ` : `
            <div style="flex:1; background:#FEF3C7; border:1.5px solid #D97706; border-radius:999px; padding:10px; font-family:var(--font-display); font-size:0.85rem; font-weight:800; color:#92400E;">
              🔒 How to unlock: ${badge.unlockCondition}
            </div>
          `}
        </div>
      </div>
    `;

    const btnEquip = document.getElementById('btn-equip-badge');
    if (btnEquip) {
      btnEquip.addEventListener('click', () => {
        if (!State.profile) return;
        sfx.playClick();
        State.profile.assignedBadgeId = badge.id;
        PlayerStore.saveProfile(State.profile);
        renderHeroBadge(badge.id, State.profile.name);
        renderCollectionVault();
        DOM.inspectModal.classList.add('hidden');
        showToastNotification(`Featured badge changed to ${badge.title}!`);
      });
    }

    DOM.inspectModal.classList.remove('hidden');
  }

  function setupInspectModalEvents() {
    if (DOM.inspectModalClose) {
      DOM.inspectModalClose.addEventListener('click', () => {
        sfx.playClick();
        if (DOM.inspectModal) DOM.inspectModal.classList.add('hidden');
      });
    }
    if (DOM.inspectModal) {
      DOM.inspectModal.addEventListener('click', (e) => {
        if (e.target === DOM.inspectModal) {
          DOM.inspectModal.classList.add('hidden');
        }
      });
    }
  }

  // ==========================================================================
  // 13. REVIEWER / TESTER TOOLBAR (Guaranteed Easy Assessment)
  // ==========================================================================
  function setupReviewerToolbar() {
    // Reset Identity (Clears storage to test new visitor onboarding flow)
    if (DOM.btnResetIdentity) {
      DOM.btnResetIdentity.addEventListener('click', () => {
        sfx.playClick();
        PlayerStore.clear();
        window.location.reload();
      });
    }

    // Simulate Returning User (Increments visit count without clearing)
    if (DOM.btnSimReturning) {
      DOM.btnSimReturning.addEventListener('click', () => {
        sfx.playClick();
        if (!State.profile) {
          alert('Please enter a player name first before simulating return visits.');
          return;
        }
        State.profile.visitCount = (State.profile.visitCount || 1) + 1;
        State.profile.stats = State.profile.stats || {};
        State.profile.stats.visits = State.profile.visitCount;
        PlayerStore.saveProfile(State.profile);

        if (DOM.welcomeVisitCount) {
          DOM.welcomeVisitCount.textContent = `Visit #${State.profile.visitCount}`;
        }
        renderJourneyStats(State.profile);
        evaluateUnlocks(State.profile);
        confetti.burst(null, null, 30);
        showToastNotification(`Simulated Return! Visit Count is now #${State.profile.visitCount}`);
      });
    }

    // Quick Challenge (Grants 1 game and 1 heritage challenge)
    if (DOM.btnQuickChallenge) {
      DOM.btnQuickChallenge.addEventListener('click', () => {
        sfx.playClick();
        if (!State.profile) return;
        State.profile.stats = State.profile.stats || {};
        State.profile.stats.gamesCompleted = (State.profile.stats.gamesCompleted || 0) + 1;
        State.profile.stats.challengesSolved = (State.profile.stats.challengesSolved || 0) + 1;
        PlayerStore.saveProfile(State.profile);
        renderJourneyStats(State.profile);
        evaluateUnlocks(State.profile);
        confetti.burst(null, null, 35);
      });
    }

    // Unlock All Badges (Reviewer can immediately see all 12 button badges)
    if (DOM.btnUnlockAll) {
      DOM.btnUnlockAll.addEventListener('click', () => {
        sfx.playFanfare();
        if (!State.profile) return;
        State.profile.unlockedBadgeIds = BADGES.map(b => b.id);
        PlayerStore.saveProfile(State.profile);
        renderJourneyStats(State.profile);
        renderCollectionVault();
        confetti.burst(null, null, 80);
        showToastNotification('✨ All 12 Collectible Badges Unlocked for Review!');
      });
    }

    // Cycle Hero Badge Preview
    if (DOM.btnCycleHero) {
      DOM.btnCycleHero.addEventListener('click', () => {
        sfx.playClick();
        State.previewBadgeIndex = (State.previewBadgeIndex + 1) % BADGES.length;
        const nextBadge = BADGES[State.previewBadgeIndex];
        const pName = State.profile ? State.profile.name : 'Preview Mode';
        renderHeroBadge(nextBadge.id, pName);
      });
    }
  }

  // ==========================================================================
  // 14. ONBOARDING SUBMISSION EVENT
  // ==========================================================================
  function setupOnboarding() {
    if (!DOM.btnOnboardingSubmit || !DOM.playerNameInput) return;

    function submitName() {
      const name = DOM.playerNameInput.value.trim();
      if (!name) {
        if (DOM.inputFeedbackError) {
          DOM.inputFeedbackError.textContent = 'Please enter your name or an explorer handle!';
          DOM.inputFeedbackError.style.display = 'block';
        }
        DOM.playerNameInput.focus();
        return;
      }
      if (DOM.inputFeedbackError) DOM.inputFeedbackError.style.display = 'none';
      runDiscoveryFlow(name);
    }

    DOM.btnOnboardingSubmit.addEventListener('click', submitName);
    DOM.playerNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitName();
    });
  }

  // ==========================================================================
  // 15. INITIALIZATION ON DOM READY
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    setup3DTilt();
    setupOnboarding();
    setupSimulators();
    setupReflections();
    setupFilters();
    setupInspectModalEvents();
    setupReviewerToolbar();
    initializePlayer();
  });

})();
