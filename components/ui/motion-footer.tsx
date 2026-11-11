"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  
  --background: #ECECE7;
  --foreground: #222428;
  --primary: #FFBD12;
  --secondary: #35383F;
  --muted-foreground: #5C6069;
  --border: rgba(34, 36, 40, 0.15);
  --destructive: #ff4d4d;

  /* Dynamic Variables using standard shadcn/tailwind v4 tokens */
  --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent);
  
  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in oklch, var(--destructive) 50%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in oklch, var(--destructive) 80%, transparent)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

/* Theme-adaptive Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    color-mix(in oklch, var(--primary) 15%, transparent) 0%, 
    color-mix(in oklch, var(--secondary) 15%, transparent) 40%, 
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 10%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, var(--foreground) 15%, transparent));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE (Zero Dependency)
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

export const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        let cachedRect: DOMRect | null = null;
        let rectDirty = true;

        const markDirty = () => {
          rectDirty = true;
        };

        const handleMouseEnter = () => {
          cachedRect = element.getBoundingClientRect();
          rectDirty = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
          if (rectDirty || !cachedRect) {
            cachedRect = element.getBoundingClientRect();
            rectDirty = false;
          }
          const h = cachedRect.width / 2;
          const w = cachedRect.height / 2;
          const x = e.clientX - cachedRect.left - h;
          const y = e.clientY - cachedRect.top - w;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
            overwrite: "auto",
          });
        };

        const handleMouseLeave = () => {
          cachedRect = null;
          rectDirty = true;
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
            overwrite: "auto",
          });
        };

        element.addEventListener("mouseenter", handleMouseEnter, { passive: true });
        element.addEventListener("mousemove", handleMouseMove as any, { passive: true });
        element.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("scroll", markDirty, { passive: true });
        window.addEventListener("resize", markDirty, { passive: true });

        return () => {
          element.removeEventListener("mouseenter", handleMouseEnter);
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
          window.removeEventListener("scroll", markDirty);
          window.removeEventListener("resize", markDirty);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    const ComponentAny = Component as any;

    return (
      <ComponentAny
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </ComponentAny>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
const DefaultMarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>Engineering Intelligent Systems</span> <span style={{ color: "var(--primary)" }}>✦</span>
    <span>Full-Stack &amp; AI Logic</span> <span style={{ color: "var(--foreground)", opacity: 0.6 }}>✦</span>
    <span>Offline-First Solutions</span> <span style={{ color: "var(--primary)" }}>✦</span>
    <span>Hackathon Winner &amp; Speaker</span> <span style={{ color: "var(--foreground)", opacity: 0.6 }}>✦</span>
    <span>Design Meets Code</span> <span style={{ color: "var(--primary)" }}>✦</span>
  </div>
);

export interface CinematicFooterProps {
  giantText?: string;
  heading?: string;
  brandName?: string;
  copyrightText?: string;
  className?: string;
}

export function CinematicFooter({
  giantText = "SRINJOYEE",
  heading = "Ready to build something iconic?",
  brandName = "Srinjoyee",
  copyrightText = "© 2026 Srinjoyee Dey. All rights reserved.",
  className,
}: CinematicFooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    // React strict mode compatible GSAP context cleanup
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* 
        The "Curtain Reveal" Wrapper:
        It sits in standard flow. Because it has clip-path, its contents
        are ONLY visible within its bounding box. 
      */}
      <div
        ref={wrapperRef}
        className={cn("relative h-screen w-full", className)}
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        {/* The actual footer stays fixed to the viewport underneath everything */}
        <footer
          className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden cinematic-footer-wrapper"
          style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
        >
          
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
          >
            {giantText}
          </div>

          {/* 1. Diagonal Sleek Marquee (Top of footer) */}
          <div
            className="absolute top-12 left-0 w-full overflow-hidden border-y py-4 z-10 -rotate-2 scale-110 shadow-2xl backdrop-blur-md"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "color-mix(in oklch, var(--background) 70%, transparent)",
            }}
          >
            <div
              className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.3em] uppercase"
              style={{ color: "var(--muted-foreground)" }}
            >
              <DefaultMarqueeItem />
              <DefaultMarqueeItem />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-20 w-full max-w-5xl mx-auto">
            <h2
              ref={headingRef}
              className="text-5xl md:text-8xl font-black footer-text-glow tracking-tighter mb-12 text-center"
            >
              {heading}
            </h2>

            {/* Interactive Magnetic Pills Layout */}
            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              {/* Primary Connect Actions */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton
                  as="a"
                  href="https://www.linkedin.com/in/srinjoyee-dey/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill px-10 py-5 rounded-full font-bold text-sm md:text-base flex items-center gap-3 group"
                >
                  <svg className="w-6 h-6 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.95 0-1.72.78-1.72 1.73s.77 1.73 1.72 1.73 1.73-.78 1.73-1.73-.78-1.73-1.73-1.73Z" />
                  </svg>
                  Connect on LinkedIn
                </MagneticButton>
                
                <MagneticButton
                  as="a"
                  href="https://github.com/SrinjoyeeDey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill px-10 py-5 rounded-full font-bold text-sm md:text-base flex items-center gap-3 group"
                >
                  <svg className="w-6 h-6 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                  </svg>
                  Explore GitHub
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href="mailto:deysrinjoyee28@gmail.com"
                  className="footer-glass-pill px-10 py-5 rounded-full font-bold text-sm md:text-base flex items-center gap-3 group"
                >
                  <svg className="w-6 h-6 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  Send Email
                </MagneticButton>
              </div>

              {/* Secondary Navigation Pills */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2">
                <MagneticButton
                  as="a"
                  href="images/Srinjoyee_Dey_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill px-6 py-3 rounded-full font-medium text-xs md:text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Resume PDF
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="https://twitter.com/SrinjoyeeDey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill px-6 py-3 rounded-full font-medium text-xs md:text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Twitter / X
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="https://srinjoyeedey.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill px-6 py-3 rounded-full font-medium text-xs md:text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Substack Newsletter
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Copyright */}
            <div
              className="text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1"
              style={{ color: "var(--muted-foreground)" }}
            >
              {copyrightText}
            </div>

            {/* "Made with Love" Badge */}
            <div
              className="footer-glass-pill px-6 py-3 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="text-[10px] md:text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Crafted with
              </span>
              <span className="animate-footer-heartbeat text-sm md:text-base" style={{ color: "var(--destructive)" }}>
                ❤
              </span>
              <span
                className="text-[10px] md:text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                by
              </span>
              <span className="font-black text-xs md:text-sm tracking-normal ml-1" style={{ color: "var(--foreground)" }}>
                {brandName}
              </span>
            </div>

            {/* Back to top */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center group order-3"
              style={{ color: "var(--muted-foreground)" }}
              aria-label="Back to Top"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </MagneticButton>

          </div>
        </footer>
      </div>
    </>
  );
}

export default CinematicFooter;

