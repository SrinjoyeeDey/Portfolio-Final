import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Single Film Card Component
 * Styled identically to the cinematic slideshow cards on portfolio.subha03.me
 */
function FilmCard({ src, desc, blur = false, priority = false, interactive = false }) {
  const [isActive, setIsActive] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 });

  let filterValue = blur ? 'blur(2px) ' : '';
  if (!(interactive && isActive)) {
    filterValue += 'grayscale(100%)';
  }
  if (!filterValue.trim()) {
    filterValue = 'none';
  }

  const handleMouseMove = (e) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      className="film-card"
      onClick={() => interactive && setIsActive((prev) => !prev)}
      onMouseEnter={() => interactive && setIsActive(true)}
      onMouseLeave={() => interactive && setIsActive(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        flexShrink: 0,
        overflow: 'hidden',
        border: '3px solid #FFFFFF',
        boxShadow: isActive
          ? '0 20px 40px -10px rgba(34, 36, 40, 0.24), 0 0 0 2px #FFBD12'
          : '0 12px 30px -8px rgba(34, 36, 40, 0.14), 0 0 0 1px rgba(34, 36, 40, 0.08)',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        pointerEvents: interactive ? 'auto' : 'none',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease',
        transform: isActive ? 'scale(1.04) rotate(-0.5deg)' : 'scale(1)'
      }}
    >
      <img
        src={src}
        alt={desc || 'Cinematic snapshot'}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: filterValue,
          transition: 'filter 0.5s ease'
        }}
      />

      {/* Soft studio bottom gradient overlay, fades out on hover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 60%, rgba(34, 36, 40, 0.65) 100%)',
          pointerEvents: 'none',
          opacity: isActive ? 0 : 0.45,
          transition: 'opacity 0.5s ease'
        }}
      />

      {/* Floating playful tooltip pill for interactive track */}
      {interactive && desc && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            x: springX,
            y: springY,
            opacity: isActive ? 1 : 0,
            scale: isActive ? 1 : 0.8,
            pointerEvents: 'none',
            zIndex: 30
          }}
        >
          <div
            style={{
              transform: 'translate(-50%, -150%)',
              backgroundColor: '#222428',
              color: '#FFFFFF',
              padding: '7px 16px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              border: '2px solid #FFBD12',
              boxShadow: '0 8px 24px rgba(34, 36, 40, 0.25)',
              fontFamily: "'Space Grotesk', system-ui, sans-serif"
            }}
          >
            {desc}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Single Horizontal Infinite Film Track Row
 */
function FilmTrack({
  images,
  duration,
  reverse = false,
  scale = 1,
  top = '0%',
  opacity = 1,
  blur = false,
  zIndex = 0,
  interactive = false
}) {
  const shouldReduceMotion = useReducedMotion();
  // Duplicate images for continuous seamless looping
  const duplicated = [...images, ...images];

  return (
    <div
      className={`film-track film-track-${zIndex} ${interactive ? 'film-track-interactive' : ''}`}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: top,
        transform: `scale(${scale})`,
        opacity: opacity,
        zIndex: zIndex,
        pointerEvents: interactive ? 'auto' : 'none',
        display: 'flex'
      }}
    >
      <motion.div
        className="film-track-row"
        style={{
          display: 'flex',
          width: 'max-content',
          willChange: 'transform'
        }}
        animate={{
          x: shouldReduceMotion ? '0%' : reverse ? ['-50%', '0%'] : ['0%', '-50%']
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: duration
        }}
      >
        {duplicated.map((item, idx) => {
          const src = typeof item === 'string' ? item : item.src;
          const desc = typeof item === 'string' ? undefined : item.desc;
          return (
            <FilmCard
              key={`${src}-${idx}`}
              src={src}
              desc={desc}
              blur={blur}
              priority={idx < 4}
              interactive={interactive}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

/**
 * Main CinematicFilmReel Component
 * Recreates the exact multi-track film strip from portfolio.subha03.me
 */
export default function CinematicFilmReel({
  track1Images,
  track2Images,
  track3Images,
  portraitSrc = 'images/srinjoyee-about-portrait.png'
}) {
  return (
    <div
      className="hero-slideshow-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        overflow: 'hidden',
        backgroundColor: '#ECECE7',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Background Subtle Dot Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(34, 36, 40, 0.08) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          zIndex: 0
        }}
      />

      {/* 3D Tilted Film Tracks Container */}
      <div
        className="film-tracks-container"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transformOrigin: 'center'
        }}
      >
        {/* Track 1: Top ambient background row (scale: 0.85, opacity: 0.45, blur, forward) */}
        <FilmTrack
          images={track1Images}
          duration={32}
          reverse={false}
          scale={0.85}
          top="-5%"
          opacity={0.45}
          blur={true}
          zIndex={1}
          interactive={false}
        />

        {/* Track 2: Center main interactive row (scale: 1, opacity: 0.98, vibrant on hover, reverse) */}
        <FilmTrack
          images={track2Images}
          duration={55}
          reverse={true}
          scale={1}
          top="35%"
          opacity={0.98}
          blur={false}
          zIndex={2}
          interactive={true}
        />

        {/* Track 3: Bottom ambient foreground row (scale: 1.15, opacity: 0.55, blur, fast forward) */}
        <FilmTrack
          images={track3Images}
          duration={18}
          reverse={false}
          scale={1.15}
          top="72%"
          opacity={0.55}
          blur={true}
          zIndex={3}
          interactive={false}
        />
      </div>

      {/* Vignette Overlay for smooth outer edge fade */}
      <div
        className="hero-slideshow-vignette"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 15,
          background: 'radial-gradient(ellipse at center, transparent 45%, rgba(236, 236, 231, 0.75) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Edge Blend Fade into previous section */}
      <div
        className="hero-slideshow-top-fade"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 15,
          background: 'linear-gradient(to bottom, rgba(236, 236, 231, 1) 0%, transparent 18%)',
          pointerEvents: 'none'
        }}
      />

      {/* Bottom Edge Blend Fade into next section */}
      <div
        className="hero-slideshow-bottom-fade"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 15,
          background: 'linear-gradient(to top, rgba(236, 236, 231, 1) 0%, transparent 22%)',
          pointerEvents: 'none'
        }}
      />

      {/* Developer Cinematic Portrait Cutout at Bottom-Left */}
      {portraitSrc && (
        <div
          className="hero-portrait-cutout"
          style={{
            position: 'absolute',
            left: 'clamp(2%, 5vw, 8%)',
            bottom: 0,
            zIndex: 20,
            pointerEvents: 'none',
            transformOrigin: 'bottom left'
          }}
        >
          <img
            src={portraitSrc}
            alt="Srinjoyee Dey Cinematic Portrait"
            className="hero-portrait-image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'left bottom',
              filter: 'drop-shadow(0 16px 32px rgba(34, 36, 40, 0.22))'
            }}
          />
        </div>
      )}

      {/* Ground Fade Overlay in front of portrait */}
      <div
        className="hero-slideshow-ground-fade"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 25,
          background: 'linear-gradient(to top, rgba(236, 236, 231, 0.75) 0%, transparent 16%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
