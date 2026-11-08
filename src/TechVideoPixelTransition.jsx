import React, { useState, useEffect, useRef } from 'react';
import PixelTransition from './PixelTransition';

const SLIDES = [
  {
    type: 'video',
    src: 'images/tech-preview-cropped.mp4',
    alt: 'Srinjoyee Tech Video',
    duration: 16000 // Video plays for a longer duration (16s)
  },
  {
    type: 'image',
    src: 'images/tech-slide-spotlight.jpg',
    alt: 'Srinjoyee Dey - Building & Creative Tech',
    duration: 5500
  },
  {
    type: 'image',
    src: 'images/tech-slide-presentation.jpg',
    alt: 'Srinjoyee Dey - Presentation & Research',
    duration: 5500
  },
  {
    type: 'image',
    src: 'images/tech-slide-hacktropica.jpg',
    alt: 'Srinjoyee Dey - Hacktropica Aura Zone',
    duration: 5500
  }
];

export function TechVideoPixelTransition() {
  const [active, setActive] = useState(false);
  const [firstIndex, setFirstIndex] = useState(0);
  const [secondIndex, setSecondIndex] = useState(1);
  const currentSlideIndexRef = useRef(0);
  const activeRef = useRef(false);
  const videoRef = useRef(null);

  // Keep ref synchronized with active state
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Keep video playing reliably
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }, []);

  // Multi-slide automatic sequential transition timer
  useEffect(() => {
    let timer = null;

    const scheduleNextTransition = () => {
      const currentIdx = currentSlideIndexRef.current;
      const currentDuration = SLIDES[currentIdx].duration;

      timer = setTimeout(() => {
        const nextIdx = (currentIdx + 1) % SLIDES.length;
        currentSlideIndexRef.current = nextIdx;

        if (!activeRef.current) {
          // Currently showing firstContent, so secondContent must be nextIdx
          setSecondIndex(nextIdx);
          setActive(true);
          // Once transition settles, prep the next slide in firstContent
          setTimeout(() => {
            setFirstIndex((nextIdx + 1) % SLIDES.length);
          }, 900);
        } else {
          // Currently showing secondContent, so firstContent must be nextIdx
          setFirstIndex(nextIdx);
          setActive(false);
          // Once transition settles, prep the next slide in secondContent
          setTimeout(() => {
            setSecondIndex((nextIdx + 1) % SLIDES.length);
          }, 900);
        }

        // Schedule next transition in the cycle
        scheduleNextTransition();
      }, currentDuration);
    };

    scheduleNextTransition();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const renderContent = (slide) => {
    if (!slide) return null;
    if (slide.type === 'video') {
      return (
        <video
          ref={videoRef}
          src={slide.src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            borderRadius: '20px'
          }}
        />
      );
    }
    return (
      <img
        src={slide.src}
        alt={slide.alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          borderRadius: '20px'
        }}
      />
    );
  };

  return (
    <PixelTransition
      firstContent={renderContent(SLIDES[firstIndex])}
      secondContent={renderContent(SLIDES[secondIndex])}
      active={active}
      trigger="hover"
      gridSize={12}
      pixelColor="#FFBD12"
      mosaic={0.35}
      pattern="dither"
      pixelAnimation="pop"
      pixelShape="square"
      animationStepDuration={0.45}
      randomness={0.25}
      aspectRatio="16 / 9"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '20px'
      }}
    />
  );
}

export default TechVideoPixelTransition;
