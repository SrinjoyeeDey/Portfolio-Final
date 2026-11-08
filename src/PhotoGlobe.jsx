import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import './PhotoGlobe.css';

/**
 * 3D Interactive Photo Globe
 * Distributes authentic memory photographs onto a 3D Fibonacci sphere.
 * Features:
 * - 3D cursor drag with pointer capture & realistic momentum inertia
 * - Holographic rotating wireframe canvas core
 * - Dynamic depth-of-field scaling, opacity fading, and z-index sorting
 * - Card hover preview tooltip & pause on inspect
 * - Lightbox modal for high-res photo viewing
 * - HUD controls (drag hint, play/pause auto-rotate, reset orientation)
 */
export default function PhotoGlobe({ items = [] }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRefs = useRef([]);

  // Active interaction & lightbox state
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Rotation angles (radians) & velocities
  const rotYRef = useRef(0.2); // Yaw
  const rotXRef = useRef(0.08); // Pitch
  const velXRef = useRef(0);
  const velYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const autoRotateRef = useRef(true);
  const hoveredIndexRef = useRef(null);
  const zoomRef = useRef(1.0);
  const currentZoomRef = useRef(1.0);

  // Keep ref in sync with state for animation loop
  useEffect(() => {
    autoRotateRef.current = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    hoveredIndexRef.current = hoveredIndex;
  }, [hoveredIndex]);

  // Calculate Fibonacci sphere base coordinates for items
  const sphereNodes = useMemo(() => {
    const total = items.length;
    if (!total) return [];

    const nodes = [];
    // Golden angle in radians
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < total; i++) {
      // y evenly spaced from 1 to -1
      const y = 1 - (i / (total - 1 || 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      nodes.push({
        item: items[i],
        baseX: x,
        baseY: y,
        baseZ: z,
        index: i
      });
    }
    return nodes;
  }, [items]);

  // Measure responsive radius based on stage width (Zoomed-in majestic sizing)
  const getRadius = useCallback(() => {
    if (!stageRef.current) return 465;
    const width = stageRef.current.clientWidth;
    if (width < 480) return 240;
    if (width < 768) return 305;
    if (width < 1024) return 385;
    return 465;
  }, []);

  // Main Animation Loop (Runs via requestAnimationFrame)
  useEffect(() => {
    let animId;
    let canvas = canvasRef.current;
    let ctx = canvas ? canvas.getContext('2d') : null;

    // Handle canvas resizing for sharp retina rendering
    const updateCanvasDimensions = () => {
      if (!canvas || !stageRef.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const baseR = getRadius();
      const diameter = (baseR * 1.5 * 2 + 200);
      canvas.width = diameter * dpr;
      canvas.height = diameter * dpr;
      canvas.style.width = `${diameter}px`;
      canvas.style.height = `${diameter}px`;
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);

    const render = () => {
      // 1. Physics & Rotation Updates
      if (isDraggingRef.current) {
        // Dragging actively updates angles via pointermove
      } else {
        // Apply inertia decay
        velXRef.current *= 0.92;
        velYRef.current *= 0.92;

        rotYRef.current += velXRef.current;
        rotXRef.current += velYRef.current;

        // Pitch clamp between -60° and +60° (-1.05 to +1.05 rad)
        rotXRef.current = Math.max(-0.85, Math.min(0.85, rotXRef.current));

        // Auto-rotation kicks in when idle and not hovering a card
        const isQuiet = Math.abs(velXRef.current) < 0.0003 && Math.abs(velYRef.current) < 0.0003;
        if (isQuiet && autoRotateRef.current && hoveredIndexRef.current === null) {
          rotYRef.current += 0.0016;
        }
      }

      // Smooth zoom interpolation
      currentZoomRef.current += (zoomRef.current - currentZoomRef.current) * 0.15;

      const rotY = rotYRef.current;
      const rotX = rotXRef.current;
      const R = getRadius() * currentZoomRef.current;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // 2. Position & Transform Each 3D Card
      sphereNodes.forEach((node, i) => {
        const el = cardRefs.current[i];
        if (!el) return;

        const { baseX, baseY, baseZ } = node;

        // Rotation around X axis (pitch)
        const y1 = baseY * cosX - baseZ * sinX;
        const z1 = baseY * sinX + baseZ * cosX;

        // Rotation around Y axis (yaw)
        const x2 = baseX * cosY + z1 * sinY;
        const z2 = -baseX * sinY + z1 * cosY;
        const y2 = y1;

        // World coordinates centered on stage
        const X = x2 * R;
        const Y = y2 * R;
        const Z = z2 * R;

        // Normalized depth t from 0 (back) to 1 (front)
        const t = (Z + R) / (2 * R);

        // Perspective scale & depth styling (Zoomed-in majestic front scale)
        const isHovered = hoveredIndexRef.current === i;
        const baseScale = 0.72 + 0.52 * t;
        const scale = isHovered ? baseScale * 1.25 : baseScale;
        const opacity = isHovered ? 1.0 : (0.28 + 0.72 * Math.pow(t, 1.3));
        const zIndex = isHovered ? 9999 : Math.round(t * 1000);

        // Billboard transform: translate to 3D projected point with scale
        el.style.transform = `translate3d(${X.toFixed(2)}px, ${Y.toFixed(2)}px, 0px) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = zIndex;
        el.style.filter = isHovered
          ? 'drop-shadow(0 14px 28px rgba(255, 189, 18, 0.45)) brightness(1.08)'
          : `brightness(${(0.65 + 0.35 * t).toFixed(2)}) contrast(${(0.85 + 0.15 * t).toFixed(2)})`;
      });

      // 3. Draw Holographic Wireframe Core Canvas
      if (ctx && canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        const cx = w / 2;
        const cy = h / 2;
        const sphereR = R * 0.94;

        ctx.clearRect(0, 0, w, h);

        // Soft Radial Glow Core
        const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, sphereR);
        coreGlow.addColorStop(0, 'rgba(255, 189, 18, 0.14)');
        coreGlow.addColorStop(0.65, 'rgba(255, 189, 18, 0.03)');
        coreGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
        ctx.fill();

        // Helper to project 3D point to canvas coordinates
        const projectPoint = (x0, y0, z0) => {
          const y1 = y0 * cosX - z0 * sinX;
          const z1 = y0 * sinX + z0 * cosX;
          const x2 = x0 * cosY + z1 * sinY;
          const z2 = -x0 * sinY + z1 * cosY;
          return {
            x: cx + x2 * sphereR,
            y: cy + y1 * sphereR,
            z: z2 * sphereR
          };
        };

        // Draw Latitude Rings (-60°, -30°, 0°, 30°, 60°)
        const latitudes = [-1.05, -0.52, 0, 0.52, 1.05];
        latitudes.forEach(lat => {
          const y0 = Math.sin(lat);
          const rLat = Math.cos(lat);
          const isEquator = lat === 0;

          ctx.beginPath();
          ctx.strokeStyle = isEquator ? 'rgba(255, 189, 18, 0.45)' : 'rgba(26, 28, 32, 0.10)';
          ctx.lineWidth = isEquator ? 1.8 : 1.0;
          if (isEquator) {
            ctx.setLineDash([4, 6]);
          } else {
            ctx.setLineDash([2, 5]);
          }

          const steps = 48;
          let first = true;
          for (let step = 0; step <= steps; step++) {
            const angle = (step / steps) * Math.PI * 2;
            const x0 = Math.cos(angle) * rLat;
            const z0 = Math.sin(angle) * rLat;
            const p = projectPoint(x0, y0, z0);

            if (first) {
              ctx.moveTo(p.x, p.y);
              first = false;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          }
          ctx.stroke();
        });

        // Draw Longitude Meridians (6 arcs)
        const meridians = 6;
        for (let m = 0; m < meridians; m++) {
          const mAngle = (m / meridians) * Math.PI;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(26, 28, 32, 0.08)';
          ctx.lineWidth = 1.0;
          ctx.setLineDash([2, 6]);

          const steps = 40;
          let first = true;
          for (let step = 0; step <= steps; step++) {
            const lat = -Math.PI / 2 + (step / steps) * Math.PI;
            const y0 = Math.sin(lat);
            const rLat = Math.cos(lat);
            const x0 = Math.cos(mAngle) * rLat;
            const z0 = Math.sin(mAngle) * rLat;
            const p = projectPoint(x0, y0, z0);

            if (first) {
              ctx.moveTo(p.x, p.y);
              first = false;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          }
          ctx.stroke();
        }

        // Draw Outer Boundary Ring
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(26, 28, 32, 0.18)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, [sphereNodes, getRadius]);

  // Pointer Event Handlers for 3D Dragging
  const handlePointerDown = useCallback((e) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    velXRef.current = 0;
    velYRef.current = 0;

    if (e.currentTarget && e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {
        // Pointer capture fallback
      }
    }
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;

    if (Math.hypot(dx, dy) > 4) {
      hasMovedRef.current = true;
    }

    // Direct orientation shift
    rotYRef.current += dx * 0.0055;
    rotXRef.current = Math.max(-0.85, Math.min(0.85, rotXRef.current - dy * 0.0055));

    // Save instantaneous velocity for momentum release
    velXRef.current = dx * 0.0035;
    velYRef.current = -dy * 0.0035;

    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback((e) => {
    isDraggingRef.current = false;
    if (e.currentTarget && e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Pointer release fallback
      }
    }
  }, []);

  // Card Click: Open Lightbox Modal (only if not dragging)
  const handleCardClick = useCallback((item, e) => {
    e.stopPropagation();
    if (hasMovedRef.current) return;
    setActiveModalItem(item);
  }, []);

  // HUD Controls
  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating(prev => !prev);
  }, []);

  const handleResetOrientation = useCallback(() => {
    rotXRef.current = 0.08;
    rotYRef.current = 0.2;
    velXRef.current = 0;
    velYRef.current = 0;
    zoomRef.current = 1.0;
  }, []);

  const handleZoomIn = useCallback((e) => {
    e.stopPropagation();
    zoomRef.current = Math.min(1.45, zoomRef.current + 0.15);
  }, []);

  const handleZoomOut = useCallback((e) => {
    e.stopPropagation();
    zoomRef.current = Math.max(0.75, zoomRef.current - 0.15);
  }, []);

  const handleWheel = useCallback((e) => {
    // Zoom in / out smoothly with mouse scroll wheel
    if (Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      const delta = e.deltaY;
      zoomRef.current = Math.max(0.75, Math.min(1.45, zoomRef.current - delta * 0.0015));
    }
  }, []);

  // Keyboard shortcut: Esc to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeModalItem) {
        setActiveModalItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalItem]);

  const hoveredItem = hoveredIndex !== null ? items[hoveredIndex] : null;

  return (
    <div
      ref={stageRef}
      className="photo-globe-stage"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      aria-label="3D Interactive Photo Globe of Memories"
    >
      {/* Central Holographic Wireframe Core Canvas */}
      <canvas ref={canvasRef} className="globe-core-canvas" aria-hidden="true" />

      {/* 3D Viewport Node Mounting Individual Memory Photo Cards */}
      <div className="photo-globe-viewport">
        {sphereNodes.map((node, i) => {
          const item = node.item;
          const imgSrc = item.src || item.image;
          const title = item.title || item.alt || 'Memory Moment';

          return (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="globe-photo-card"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => handleCardClick(item, e)}
              role="button"
              tabIndex={0}
              aria-label={`View ${title}`}
            >
              <div className="globe-card-media">
                <img
                  src={imgSrc}
                  alt={item.alt || title}
                  className="globe-card-img"
                  loading="lazy"
                  draggable={false}
                />
                <div className="globe-card-overlay" />
                <div className="globe-card-badge">{title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Hover Inspection Tooltip */}
      {hoveredItem && (
        <div className="globe-hover-tooltip" aria-live="polite">
          <span className="tooltip-icon">✦</span>
          <span className="tooltip-title">{hoveredItem.title || hoveredItem.alt}</span>
          {hoveredItem.subtitle && (
            <>
              <span className="tooltip-sep">•</span>
              <span className="tooltip-sub">{hoveredItem.subtitle}</span>
            </>
          )}
        </div>
      )}

      {/* Bottom HUD Bar */}
      <div className="globe-hud-bar" onClick={(e) => e.stopPropagation()}>
        <div className="globe-hud-hint">
          <i className="fa-solid fa-arrows-up-down-left-right" />
          <span>DRAG GLOBE TO ROTATE</span>
        </div>
        <button
          type="button"
          className="globe-hud-btn"
          onClick={handleZoomIn}
          title="Zoom in (+)"
        >
          <i className="fa-solid fa-magnifying-glass-plus" />
          <span>Zoom +</span>
        </button>
        <button
          type="button"
          className="globe-hud-btn"
          onClick={handleZoomOut}
          title="Zoom out (-)"
        >
          <i className="fa-solid fa-magnifying-glass-minus" />
          <span>Zoom -</span>
        </button>
        <button
          type="button"
          className="globe-hud-btn"
          onClick={toggleAutoRotate}
          title={isAutoRotating ? 'Pause rotation' : 'Resume auto-rotation'}
        >
          <i className={isAutoRotating ? 'fa-solid fa-pause' : 'fa-solid fa-play'} />
          <span>{isAutoRotating ? 'Pause' : 'Rotate'}</span>
        </button>
        <button
          type="button"
          className="globe-hud-btn"
          onClick={handleResetOrientation}
          title="Reset globe view and zoom"
        >
          <i className="fa-solid fa-rotate-right" />
          <span>Reset</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div
          className="globe-modal-backdrop"
          onClick={() => setActiveModalItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="globe-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="globe-modal-img-wrap">
              <img
                src={activeModalItem.src || activeModalItem.image}
                alt={activeModalItem.alt || activeModalItem.title}
                className="globe-modal-img"
              />
            </div>
            <div className="globe-modal-info">
              <div>
                <h3 className="globe-modal-title">{activeModalItem.title || 'Memory Moment'}</h3>
                <p className="globe-modal-sub">{activeModalItem.subtitle || activeModalItem.alt}</p>
              </div>
              <button
                type="button"
                className="globe-modal-close-btn"
                onClick={() => setActiveModalItem(null)}
                aria-label="Close photo preview"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
