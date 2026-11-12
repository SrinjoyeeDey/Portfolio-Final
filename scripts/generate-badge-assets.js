const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const imagesDir = path.join(__dirname, '..', 'images');
const portraitPath = path.join(imagesDir, 'srinjoyee-about-portrait.png');

let portraitBase64 = '';
if (fs.existsSync(portraitPath)) {
  const buf = fs.readFileSync(portraitPath);
  portraitBase64 = `data:image/png;base64,${buf.toString('base64')}`;
}

// 1. CARD FRONT SVG (1024 x 1618)
const cardFrontSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1618" width="1024" height="1618">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181A20"/>
      <stop offset="40%" stop-color="#121316"/>
      <stop offset="100%" stop-color="#0B0C0E"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE082"/>
      <stop offset="50%" stop-color="#FFBD12"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="yellowBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFBD12"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="holoShimmer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B6B" stop-opacity="0.15"/>
      <stop offset="30%" stop-color="#FFE66D" stop-opacity="0.2"/>
      <stop offset="60%" stop-color="#4ECDC4" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#1A535C" stop-opacity="0.1"/>
    </linearGradient>
    <pattern id="dotGrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="#FFFFFF" fill-opacity="0.06"/>
    </pattern>
    <pattern id="diagLines" x="0" y="0" width="20" height="20" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="20" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.04"/>
    </pattern>
    <clipPath id="avatarClip">
      <circle cx="512" cy="620" r="230"/>
    </clipPath>
  </defs>

  <!-- Background Base -->
  <rect width="1024" height="1618" fill="url(#bgGrad)"/>
  <rect width="1024" height="1618" fill="url(#dotGrid)"/>
  <rect width="1024" height="1618" fill="url(#diagLines)"/>
  <rect width="1024" height="1618" fill="url(#holoShimmer)"/>

  <!-- Outer Technical Border -->
  <rect x="28" y="28" width="968" height="1562" rx="36" fill="none" stroke="#FFBD12" stroke-width="3" stroke-opacity="0.5"/>
  <rect x="42" y="42" width="940" height="1534" rx="26" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.12"/>

  <!-- Top Slot Indicator (Lanyard clip cutout area) -->
  <rect x="432" y="42" width="160" height="20" rx="10" fill="#0B0C0E" stroke="#FFBD12" stroke-width="2" stroke-opacity="0.6"/>

  <!-- Corner Crosshairs -->
  <path d="M 56 70 L 80 70 M 68 58 L 68 82" stroke="#FFBD12" stroke-width="2"/>
  <path d="M 968 70 L 944 70 M 956 58 L 956 82" stroke="#FFBD12" stroke-width="2"/>
  <path d="M 56 1548 L 80 1548 M 68 1536 L 68 1560" stroke="#FFBD12" stroke-width="2"/>
  <path d="M 968 1548 L 944 1548 M 956 1536 L 956 1560" stroke="#FFBD12" stroke-width="2"/>

  <!-- TOP HEADER BANNER -->
  <g transform="translate(64, 100)">
    <!-- Yellow Header Box -->
    <rect width="896" height="88" rx="16" fill="url(#yellowBar)"/>
    <text x="448" y="44" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="28" fill="#111215" text-anchor="middle" letter-spacing="4">
      ★ SMART INDIA HACKATHON 2024 ★
    </text>
    <text x="448" y="70" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="16" fill="#111215" text-anchor="middle" letter-spacing="3" opacity="0.85">
      MINISTRY OF EDUCATION &amp; AICTE // NATIONAL FINALS
    </text>
  </g>

  <!-- CHAMPION BADGE RIBBON -->
  <g transform="translate(64, 216)">
    <!-- Dark Pill -->
    <rect width="896" height="56" rx="28" fill="#1D2027" stroke="#FFBD12" stroke-width="1.5"/>
    <circle cx="48" cy="28" r="14" fill="#FFBD12"/>
    <text x="48" y="34" font-family="system-ui" font-size="16" font-weight="900" fill="#111215" text-anchor="middle">🏆</text>
    <text x="80" y="35" font-family="'JetBrains Mono', monospace" font-size="20" font-weight="800" fill="#FFBD12" letter-spacing="2">
      RANK #1 NATIONWIDE
    </text>
    <text x="848" y="35" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="700" fill="#E2E8F0" text-anchor="end" letter-spacing="1">
      50,000+ TEAMS
    </text>
  </g>

  <!-- CIRCULAR PORTRAIT FRAME WITH GLOW -->
  <g transform="translate(0, 0)">
    <!-- Outer Glow Rings -->
    <circle cx="512" cy="620" r="248" fill="none" stroke="#FFBD12" stroke-width="3" stroke-dasharray="12 8" stroke-opacity="0.6"/>
    <circle cx="512" cy="620" r="238" fill="#1F232B" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.15"/>
    
    <!-- Image Cutout -->
    <g clip-path="url(#avatarClip)">
      <rect x="272" y="380" width="480" height="480" fill="#2A2E39"/>
      ${portraitBase64 ? `<image href="${portraitBase64}" x="252" y="340" width="520" height="520" preserveAspectRatio="xMidYMid slice"/>` : ''}
    </g>

    <!-- Front Glow Ring Edge -->
    <circle cx="512" cy="620" r="230" fill="none" stroke="url(#goldGrad)" stroke-width="6"/>

    <!-- Floating Trophy Pill Stamp on Portrait -->
    <g transform="translate(340, 830)">
      <rect width="344" height="48" rx="24" fill="#111215" stroke="#FFBD12" stroke-width="2.5"/>
      <text x="172" y="31" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="18" fill="#FFBD12" text-anchor="middle" letter-spacing="2">
        ★ 1ST PRIZE WINNER ★
      </text>
    </g>
  </g>

  <!-- ATTENDEE IDENTITY SECTION -->
  <g transform="translate(64, 930)">
    <!-- Attendee Label -->
    <text x="448" y="0" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="700" fill="#94A3B8" text-anchor="middle" letter-spacing="5">
      // AUTHORIZED CHAMPION PASS
    </text>

    <!-- Main Name -->
    <text x="448" y="70" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
      SRINJOYEE DEY
    </text>

    <!-- Yellow Accent Line Under Name -->
    <rect x="298" y="94" width="300" height="6" rx="3" fill="url(#goldGrad)"/>

    <!-- Role / Title -->
    <text x="448" y="145" font-family="'JetBrains Mono', monospace" font-weight="800" font-size="24" fill="#FFBD12" text-anchor="middle" letter-spacing="3">
      LEAD AI ENGINEER &amp; FULL-STACK
    </text>
    <text x="448" y="180" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="600" font-size="18" fill="#94A3B8" text-anchor="middle" letter-spacing="1">
      Creative Technologist • GenAI • Computer Vision
    </text>
  </g>

  <!-- DATA TELEMETRY CHIPS -->
  <g transform="translate(80, 1170)">
    <!-- Chip 1: Division -->
    <g transform="translate(0, 0)">
      <rect width="260" height="74" rx="14" fill="#16181F" stroke="#333846" stroke-width="1.5"/>
      <text x="24" y="28" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#64748B" letter-spacing="1">DIVISION</text>
      <text x="24" y="54" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#FFFFFF">AI &amp; VISION</text>
    </g>

    <!-- Chip 2: Pass ID -->
    <g transform="translate(302, 0)">
      <rect width="260" height="74" rx="14" fill="#16181F" stroke="#333846" stroke-width="1.5"/>
      <text x="24" y="28" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#64748B" letter-spacing="1">BADGE NO.</text>
      <text x="24" y="54" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#FFBD12">SIH-2024-SD01</text>
    </g>

    <!-- Chip 3: Access Level -->
    <g transform="translate(604, 0)">
      <rect width="260" height="74" rx="14" fill="#16181F" stroke="#333846" stroke-width="1.5"/>
      <text x="24" y="28" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#64748B" letter-spacing="1">ACCESS LEVEL</text>
      <text x="24" y="54" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#10B981">ALL ACCESS VIP</text>
    </g>
  </g>

  <!-- BOTTOM SECURITY / BARCODE STRIP -->
  <g transform="translate(80, 1290)">
    <rect width="864" height="230" rx="20" fill="#111317" stroke="#262B37" stroke-width="1.5"/>

    <!-- Microchip Graphic (Left) -->
    <g transform="translate(40, 45)">
      <rect width="90" height="74" rx="12" fill="url(#goldGrad)" stroke="#B45309" stroke-width="2"/>
      <rect x="25" y="18" width="40" height="38" rx="6" fill="#181A20" stroke="#FFBD12" stroke-width="1.5"/>
      <!-- Chip pins -->
      <line x1="10" y1="26" x2="25" y2="26" stroke="#181A20" stroke-width="3"/>
      <line x1="10" y1="37" x2="25" y2="37" stroke="#181A20" stroke-width="3"/>
      <line x1="10" y1="48" x2="25" y2="48" stroke="#181A20" stroke-width="3"/>
      <line x1="65" y1="26" x2="80" y2="26" stroke="#181A20" stroke-width="3"/>
      <line x1="65" y1="37" x2="80" y2="37" stroke="#181A20" stroke-width="3"/>
      <line x1="65" y1="48" x2="80" y2="48" stroke="#181A20" stroke-width="3"/>
      <text x="45" y="104" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#94A3B8" text-anchor="middle">SECURE CHIP</text>
    </g>

    <!-- Barcode Bars (Center) -->
    <g transform="translate(180, 45)">
      ${Array.from({ length: 48 }).map((_, i) => {
        const x = i * 11;
        const w = (i % 3 === 0 || i % 7 === 0) ? 6 : (i % 2 === 0 ? 3 : 2);
        return `<rect x="${x}" y="0" width="${w}" height="70" fill="#FFFFFF" fill-opacity="${(i % 5 === 0) ? 0.95 : 0.75}"/>`;
      }).join('\n      ')}
      <text x="260" y="96" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#94A3B8" text-anchor="middle" letter-spacing="4">
        ★ SIH-2024-WINNER-NATIONAL-01 ★
      </text>
    </g>

    <!-- Holographic Seal (Right) -->
    <g transform="translate(730, 40)">
      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#goldGrad)" stroke-width="2.5"/>
      <circle cx="50" cy="50" r="34" fill="#FFBD12" fill-opacity="0.1" stroke="#FFBD12" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="50" y="44" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="12" fill="#FFBD12" text-anchor="middle">GOVT OF</text>
      <text x="50" y="60" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="12" fill="#FFBD12" text-anchor="middle">INDIA</text>
      <text x="50" y="74" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#10B981" text-anchor="middle">VERIFIED</text>
    </g>

    <!-- Bottom Footer Note -->
    <text x="432" y="185" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="2">
      DOUBLE CLICK BADGE TO FLIP ↺ // DRAG &amp; TOSS WITH THREE.JS PHYSICS
    </text>
  </g>
</svg>`;

// 2. CARD BACK SVG (1024 x 1618)
const cardBackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1618" width="1024" height="1618">
  <defs>
    <linearGradient id="bgGradBack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14161C"/>
      <stop offset="50%" stop-color="#0E0F12"/>
      <stop offset="100%" stop-color="#08090A"/>
    </linearGradient>
    <linearGradient id="goldGradBack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE082"/>
      <stop offset="50%" stop-color="#FFBD12"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <pattern id="dotGridBack" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="#FFFFFF" fill-opacity="0.05"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="1024" height="1618" fill="url(#bgGradBack)"/>
  <rect width="1024" height="1618" fill="url(#dotGridBack)"/>

  <!-- Outer Technical Border -->
  <rect x="28" y="28" width="968" height="1562" rx="36" fill="none" stroke="#FFBD12" stroke-width="2.5" stroke-opacity="0.4"/>
  <rect x="42" y="42" width="940" height="1534" rx="26" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.1"/>

  <!-- Top Slot Indicator -->
  <rect x="432" y="42" width="160" height="20" rx="10" fill="#0B0C0E" stroke="#FFBD12" stroke-width="2" stroke-opacity="0.6"/>

  <!-- MAGNETIC STRIPE -->
  <rect x="28" y="110" width="968" height="130" fill="#080809"/>
  <rect x="28" y="115" width="968" height="4" fill="#FFBD12" fill-opacity="0.3"/>
  <rect x="28" y="231" width="968" height="4" fill="#FFBD12" fill-opacity="0.3"/>
  <text x="512" y="180" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#4B5563" text-anchor="middle" letter-spacing="8">
    ★★ SMART INDIA HACKATHON 2024 ENCRYPTED PASS DATA ★★
  </text>

  <!-- OFFICIAL RECORD SECTION -->
  <g transform="translate(70, 290)">
    <rect width="884" height="360" rx="20" fill="#15171F" stroke="#2C3240" stroke-width="1.5"/>

    <text x="40" y="50" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#FFBD12" letter-spacing="3">
      // VERIFIED HACKATHON RECORD
    </text>

    <text x="40" y="90" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF">
      Smart India Hackathon 2024 — Grand Finale
    </text>

    <text x="40" y="130" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="600" font-size="18" fill="#94A3B8">
      Organized by Ministry of Education's Innovation Cell &amp; AICTE, Govt. of India.
    </text>

    <!-- Stat Grid Inside Box -->
    <g transform="translate(40, 165)">
      <rect width="240" height="90" rx="12" fill="#0F1015" stroke="#252A36"/>
      <text x="20" y="32" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#64748B">RESULT</text>
      <text x="20" y="68" font-family="'JetBrains Mono', monospace" font-size="24" font-weight="900" fill="#FFBD12">1ST PRIZE 🏆</text>
    </g>

    <g transform="translate(310, 165)">
      <rect width="240" height="90" rx="12" fill="#0F1015" stroke="#252A36"/>
      <text x="20" y="32" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#64748B">SPRINT DURATION</text>
      <text x="20" y="68" font-family="'JetBrains Mono', monospace" font-size="24" font-weight="900" fill="#10B981">36 HOURS ⚡</text>
    </g>

    <g transform="translate(580, 165)">
      <rect width="260" height="90" rx="12" fill="#0F1015" stroke="#252A36"/>
      <text x="20" y="32" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#64748B">FIELD</text>
      <text x="20" y="68" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="900" fill="#38BDF8">ASSISTIVE AI</text>
    </g>

    <!-- Problem Statement Quote -->
    <text x="40" y="300" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="#CBD5E1">
      "Built an edge AI computer-vision accessibility solution empowering real-time assistance."
    </text>
  </g>

  <!-- TECH STACK & COMPETENCY PILLS -->
  <g transform="translate(70, 700)">
    <text x="10" y="0" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="700" fill="#FFBD12" letter-spacing="3">
      // CORE ENGINEERING ARSENAL
    </text>

    <!-- Pills Grid -->
    <g transform="translate(0, 30)">
      ${[
        { name: 'PyTorch / TorchVision', bg: '#1E2330', color: '#EE4C2C' },
        { name: 'Computer Vision &amp; YOLO', bg: '#1E2330', color: '#10B981' },
        { name: 'FastAPI Backend', bg: '#1E2330', color: '#009688' },
        { name: 'React 19 &amp; Next.js', bg: '#1E2330', color: '#61DAFB' },
        { name: 'Three.js &amp; WebGL', bg: '#1E2330', color: '#F59E0B' },
        { name: 'Edge AI &amp; Jetson', bg: '#1E2330', color: '#76B900' },
      ].map((p, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = col * 450;
        const y = row * 64;
        return `
        <g transform="translate(${x}, ${y})">
          <rect width="430" height="52" rx="12" fill="${p.bg}" stroke="#2D3342" stroke-width="1.5"/>
          <circle cx="28" cy="26" r="6" fill="${p.color}"/>
          <text x="48" y="33" font-family="'JetBrains Mono', monospace" font-size="17" font-weight="700" fill="#FFFFFF">${p.name}</text>
        </g>`;
      }).join('\n')}
    </g>
  </g>

  <!-- QR CODE & VERIFICATION BOX -->
  <g transform="translate(70, 960)">
    <rect width="884" height="280" rx="20" fill="#13151D" stroke="#252A36" stroke-width="1.5"/>

    <!-- QR Code Pattern Graphic (Left) -->
    <g transform="translate(40, 40)">
      <rect width="200" height="200" rx="12" fill="#FFBD12"/>
      <!-- QR Blocks -->
      <rect x="16" y="16" width="54" height="54" fill="#111215"/>
      <rect x="25" y="25" width="36" height="36" fill="#FFBD12"/>
      <rect x="33" y="33" width="20" height="20" fill="#111215"/>

      <rect x="130" y="16" width="54" height="54" fill="#111215"/>
      <rect x="139" y="25" width="36" height="36" fill="#FFBD12"/>
      <rect x="147" y="33" width="20" height="20" fill="#111215"/>

      <rect x="16" y="130" width="54" height="54" fill="#111215"/>
      <rect x="25" y="139" width="36" height="36" fill="#FFBD12"/>
      <rect x="33" y="147" width="20" height="20" fill="#111215"/>

      <!-- Random QR dots -->
      <rect x="85" y="20" width="16" height="16" fill="#111215"/>
      <rect x="85" y="50" width="25" height="16" fill="#111215"/>
      <rect x="20" y="85" width="16" height="25" fill="#111215"/>
      <rect x="55" y="85" width="25" height="16" fill="#111215"/>
      <rect x="95" y="90" width="35" height="35" fill="#111215"/>
      <rect x="140" y="85" width="40" height="16" fill="#111215"/>
      <rect x="85" y="140" width="16" height="40" fill="#111215"/>
      <rect x="120" y="140" width="25" height="25" fill="#111215"/>
      <rect x="155" y="130" width="25" height="45" fill="#111215"/>
    </g>

    <!-- QR Right Details -->
    <g transform="translate(280, 50)">
      <text x="0" y="24" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF">
        SCAN TO VERIFY CREDENTIALS
      </text>
      <text x="0" y="58" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="600" fill="#94A3B8">
        Official verification record on GitHub &amp; MoE Portal.
      </text>
      <text x="0" y="90" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#FFBD12">
        URL: github.com/SrinjoyeeDey
      </text>

      <!-- Security Stamp -->
      <g transform="translate(0, 120)">
        <rect width="240" height="36" rx="18" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="1.5"/>
        <text x="120" y="23" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="800" fill="#10B981" text-anchor="middle" letter-spacing="2">
          ✓ CRYPTOGRAPHICALLY SIGNED
        </text>
      </g>
    </g>
  </g>

  <!-- BOTTOM SIGN-OFF & SOCIAL FOOTER -->
  <g transform="translate(70, 1300)">
    <rect width="884" height="230" rx="20" fill="#111317" stroke="#262B37" stroke-width="1.5"/>

    <text x="442" y="50" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
      "CODE. CREATE. CONNECT."
    </text>

    <text x="442" y="85" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="600" fill="#94A3B8" text-anchor="middle">
      deysrinjoyee04@gmail.com • Kolkata, India • 2026 Edition
    </text>

    <!-- Social Chips -->
    <g transform="translate(180, 120)">
      <rect width="150" height="42" rx="10" fill="#1E2330" stroke="#374151"/>
      <text x="75" y="27" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">GITHUB ↗</text>
    </g>

    <g transform="translate(360, 120)">
      <rect width="150" height="42" rx="10" fill="#1E2330" stroke="#374151"/>
      <text x="75" y="27" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">LINKEDIN ↗</text>
    </g>

    <g transform="translate(540, 120)">
      <rect width="150" height="42" rx="10" fill="#FFBD12"/>
      <text x="75" y="27" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800" fill="#111215" text-anchor="middle">PORTFOLIO ★</text>
    </g>

    <text x="442" y="195" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="2">
      DOUBLE CLICK TO FLIP FRONT ↺ // PULL ROPE TO SWING
    </text>
  </g>
</svg>`;

// 3. CARD BAND / STRAP SVG (192 x 768)
const cardBandSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 768" width="192" height="768">
  <defs>
    <linearGradient id="strapBg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0E0F12"/>
      <stop offset="15%" stop-color="#181A22"/>
      <stop offset="50%" stop-color="#1E212B"/>
      <stop offset="85%" stop-color="#181A22"/>
      <stop offset="100%" stop-color="#0E0F12"/>
    </linearGradient>
  </defs>

  <!-- Strap Base -->
  <rect width="192" height="768" fill="url(#strapBg)"/>

  <!-- Left and Right Stitched Gold Borders -->
  <line x1="16" y1="0" x2="16" y2="768" stroke="#FFBD12" stroke-width="3" stroke-dasharray="8 6" stroke-opacity="0.8"/>
  <line x1="176" y1="0" x2="176" y2="768" stroke="#FFBD12" stroke-width="3" stroke-dasharray="8 6" stroke-opacity="0.8"/>

  <!-- Center Repeating Text (Vertical) -->
  <g transform="translate(96, 0)">
    ${Array.from({ length: 4 }).map((_, i) => {
      const y = i * 192;
      return `
      <g transform="translate(0, ${y})">
        <text x="0" y="30" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="16" fill="#FFBD12" text-anchor="middle" letter-spacing="4">
          ★ SIH '24 WINNER ★
        </text>
        <text x="0" y="65" font-family="'JetBrains Mono', monospace" font-weight="800" font-size="13" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">
          SRINJOYEE DEY
        </text>
        <text x="0" y="98" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11" fill="#94A3B8" text-anchor="middle" letter-spacing="2">
          RANK #1 NATIONWIDE
        </text>
        <circle cx="0" cy="130" r="4" fill="#FFBD12"/>
        <line x1="-30" y1="130" x2="30" y2="130" stroke="#FFBD12" stroke-width="1.5" stroke-opacity="0.4"/>
      </g>`;
    }).join('\n')}
  </g>
</svg>`;

// Write SVGs
const frontSvgPath = path.join(imagesDir, 'card-front.svg');
const backSvgPath = path.join(imagesDir, 'card-back.svg');
const bandSvgPath = path.join(imagesDir, 'card-band.svg');

fs.writeFileSync(frontSvgPath, cardFrontSvg);
fs.writeFileSync(backSvgPath, cardBackSvg);
fs.writeFileSync(bandSvgPath, cardBandSvg);

console.log('SVGs written successfully. Now converting to PNG with sips...');

const frontPngPath = path.join(imagesDir, 'card-front.png');
const backPngPath = path.join(imagesDir, 'card-back.png');
const bandPngPath = path.join(imagesDir, 'card-band.png');

execSync(`sips -s format png "${frontSvgPath}" --out "${frontPngPath}"`);
execSync(`sips -s format png "${backSvgPath}" --out "${backPngPath}"`);
execSync(`sips -s format png "${bandSvgPath}" --out "${bandPngPath}"`);

console.log('Done! Assets generated:');
console.log(frontPngPath);
console.log(backPngPath);
console.log(bandPngPath);
