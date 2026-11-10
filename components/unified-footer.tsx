"use client";

import DoodleCrewFooter, { type CrewMember } from "./ui/doodle-crew-footer";
import { MagneticButton } from "./ui/motion-footer";

const UNIFIED_STYLES = `
@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.35; }
  100% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.75; }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(255, 77, 77, 0.4)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 8px rgba(255, 77, 77, 0.7)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 7s ease-in-out infinite alternate;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.unified-footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(255, 189, 18, 0.18) 0%, 
    rgba(34, 36, 40, 0.04) 45%, 
    transparent 70%
  );
}

.unified-glass-pill {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 2px 2px 0px rgba(34, 36, 40, 0.12);
  border: 1.5px solid rgba(34, 36, 40, 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.unified-glass-pill:hover {
  background: #FFFFFF;
  border-color: #222428;
  box-shadow: 4px 4px 0px #222428;
  transform: translateY(-2px);
}

#story-layer-contact,
#unified-footer-root {
  min-height: auto !important;
  height: auto !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: var(--color-bg-light, #ECECE7) !important;
  background-image: none !important;
}

.editorial-footer-stage {
  margin-bottom: 0 !important;
  border-top: none !important;
}

.editorial-footer-stage .dcf,
.editorial-footer-stage .dcf-world {
  background: transparent !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.editorial-footer-stage .dcf-world {
  padding-top: 0 !important;
}
`;

const srinjoyeeCrew: CrewMember[] = [
  { kind: "yeti", letter: 0, seat: "front", offset: -0.28, name: "Bruno", says: "Hungry. Got snacks?" },
  { kind: "bird", letter: 2, seat: "top", offset: 0.05, name: "Pip", says: "Building intelligent agents!" },
  { kind: "mushroom", letter: 4, seat: "front", offset: 0.1, scale: 0.95, name: "Morel", says: "Turning ideas into impact." },
  { kind: "kid", letter: 6, seat: "top", offset: -0.05, name: "Juno", says: "Best seat in the house!" },
  { kind: "ghost", letter: 8, seat: "behind", offset: 0, name: "Boo", says: "Boo! ...sorry. Hi." },
  { kind: "cat", letter: 10, seat: "front", offset: -0.15, name: "Patch", says: "Arr. Nice cursor." },
  { kind: "bird", letter: 12, seat: "top", offset: 0.2, flip: true, name: "Robin", says: "Let's connect!" },
];

export default function UnifiedFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="editorial-footer-stage relative w-full overflow-hidden"
      id="contact"
      aria-label="Editorial Studio &amp; Doodle Crew Footer"
      style={{
        backgroundColor: "var(--color-bg-light, #ECECE7)",
        color: "var(--color-charcoal, #222428)",
        paddingTop: "clamp(32px, 4vh, 48px)",
        paddingBottom: "24px",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: UNIFIED_STYLES }} />

      {/* Top Right: [ BACK TO TOP ] Action */}
      <div className="footer-top-row">
        <MagneticButton
          as="button"
          onClick={scrollToTop}
          className="footer-back-to-top cursor-target"
          data-cursor-label="Top"
          aria-label="Back to Top"
        >
          [ BACK TO TOP ]
        </MagneticButton>
      </div>

      {/* 1. UPPER/FOOTER CONTENT: EDITORIAL BRAND & DIRECT UPLINKS GRID */}
      <div className="footer-main-grid">
        {/* Left Brand & Conversational Socials Column */}
        <div className="footer-brand-column">
          <div className="footer-hero-brand">
            <span className="footer-hero-name">SRINJOYEE</span>
            <span className="highlight-yellow-text footer-hero-last">DEY</span>
            <span className="footer-hero-yellow-dot">.</span>
          </div>

          <p className="footer-conversational-prompt">
            i’m even better in conversation.<br />
            say hi at
          </p>

          <nav className="footer-social-links-bar" aria-label="Social &amp; Direct Uplinks">
            <MagneticButton
              as="a"
              href="https://www.linkedin.com/in/srinjoyee-dey/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target"
              data-cursor-label="LinkedIn"
            >
              LINKEDIN
            </MagneticButton>
            <MagneticButton
              as="a"
              href="https://github.com/SrinjoyeeDey/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target"
              data-cursor-label="GitHub"
            >
              GITHUB
            </MagneticButton>
            <MagneticButton
              as="a"
              href="https://x.com/Srinjoyee__bee"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target"
              data-cursor-label="X (Twitter)"
            >
              X (TWITTER)
            </MagneticButton>
            <MagneticButton
              as="a"
              href="mailto:deysrinjoyee28@gmail.com"
              className="cursor-target"
              data-cursor-label="Email"
            >
              MAIL
            </MagneticButton>
            <MagneticButton
              as="a"
              href="https://srinjoyeedey.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target"
              data-cursor-label="Substack"
            >
              SUBSTACK
            </MagneticButton>
            <MagneticButton
              as="a"
              href="images/Srinjoyee_Dey_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target"
              data-cursor-label="Resume"
            >
              RESUME
            </MagneticButton>
          </nav>
        </div>

        {/* Right Numbered Navigation Index Columns */}
        <nav className="footer-nav-index-grid" aria-label="Footer Quick Navigation">
          <div className="footer-nav-col">
            <a href="#projects" className="footer-nav-item cursor-target" data-cursor-label="Projects">
              <span className="nav-item-title">WORK</span>
              <span className="nav-item-num">01</span>
            </a>
            <a href="#about" className="footer-nav-item cursor-target" data-cursor-label="About">
              <span className="nav-item-title">ABOUT</span>
              <span className="nav-item-num">02</span>
            </a>
            <a href="#experience" className="footer-nav-item cursor-target" data-cursor-label="Experience">
              <span className="nav-item-title">EXPERIENCE</span>
              <span className="nav-item-num">03</span>
            </a>
            <a href="#skills" className="footer-nav-item cursor-target" data-cursor-label="Skills">
              <span className="nav-item-title">SKILLS</span>
              <span className="nav-item-num">04</span>
            </a>
          </div>

          <div className="footer-nav-col">
            <a href="#memory-wall" className="footer-nav-item cursor-target" data-cursor-label="Memories">
              <span className="nav-item-title">MEMORY WALL</span>
              <span className="nav-item-num">05</span>
            </a>
            <a href="#tech-arsenal" className="footer-nav-item cursor-target" data-cursor-label="Tech Stack">
              <span className="nav-item-title">TECH ARSENAL</span>
              <span className="nav-item-num">06</span>
            </a>
            <a href="#contact" className="footer-nav-item cursor-target" data-cursor-label="Contact">
              <span className="nav-item-title">CONTACT</span>
              <span className="nav-item-num">07</span>
            </a>
          </div>
        </nav>
      </div>

      {/* 2. LARGE "SRINJOYEE DEY" TYPOGRAPHY WITH EXISTING ILLUSTRATIONS */}
      <div className="relative w-full mt-2">
        {/* Soft Breathing Ambient Aurora Glow Behind Doodle Characters */}
        <div
          className="unified-footer-aurora absolute left-1/2 top-1/2 h-[340px] w-[80vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full">
          <DoodleCrewFooter
            wordmark="SRINJOYEE DEY"
            crew={srinjoyeeCrew}
            height="auto"
            palette={{ background: "#ECECE7", ink: "#222428", accent: "#FFBD12" }}
            showTop={false}
            showCta={false}
            showBar={false}
            interactive={true}
          />
        </div>
      </div>

      {/* 5. REMAINING FOOTER CONTENT: BOTTOM COLOPHON / CREDITS ROW */}
      <div
        className="footer-colophon-row mt-4 flex flex-wrap items-center justify-between gap-4 pt-5"
        style={{ borderTop: "1.5px solid rgba(34, 36, 40, 0.12)" }}
      >
        <div className="footer-colophon-left flex items-center gap-2 text-xs font-semibold text-charcoal/70">
          <span>HANDMADE WITH</span>
          <span className="emoji-heart">💖</span>
          <span>AND</span>
          <span className="emoji-brain">🧠</span>
          <span>AND</span>
          <span className="emoji-coffee">☕</span>
          <span className="mx-2">•</span>
          <span>© 2026 SRINJOYEE DEY. ALL RIGHTS RESERVED.</span>
        </div>

        {/* Heartbeat Badge */}
        <div className="unified-glass-pill px-4 py-1.5 rounded-full flex items-center gap-2 cursor-default select-none text-xs font-bold text-charcoal/80">
          <span className="text-[10px] tracking-wider uppercase">Crafted with</span>
          <span className="animate-footer-heartbeat text-sm text-[#ff4d4d]">❤</span>
          <span className="text-[10px] tracking-wider uppercase">by</span>
          <span className="font-extrabold text-[#222428]">Srinjoyee</span>
        </div>
      </div>
    </footer>
  );
}
