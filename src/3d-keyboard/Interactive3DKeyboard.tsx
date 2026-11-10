import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
} from "@react-three/drei";
import * as THREE from "three";
import { SKILLS_GRID, type SkillIcon } from "./skills";

const COLS = 5;
const ROWS = 3;
const KEYCAP_SIZE = 0.4;
const KEYCAP_HEIGHT = 0.28;
const KEYCAP_TOP_SCALE = 0.78;
const COL_SPACING = 0.42;
const ROW_SPACING = 0.42;
const BASE_WIDTH = 2.4;
const BASE_DEPTH = 1.4;
const BASE_HEIGHT = 0.26;
const ICON_PLANE_SIZE = KEYCAP_SIZE * KEYCAP_TOP_SCALE * 0.78;
const PRESS_DEPTH = 0.15;

function makeRoundedRectShape(
  width: number,
  depth: number,
  cornerRadius: number
): THREE.Shape {
  const shape = new THREE.Shape();
  const w = width / 2;
  const d = depth / 2;
  const r = Math.min(cornerRadius, w, d);
  shape.moveTo(-w + r, -d);
  shape.lineTo(w - r, -d);
  shape.quadraticCurveTo(w, -d, w, -d + r);
  shape.lineTo(w, d - r);
  shape.quadraticCurveTo(w, d, w - r, d);
  shape.lineTo(-w + r, d);
  shape.quadraticCurveTo(-w, d, -w, d - r);
  shape.lineTo(-w, -d + r);
  shape.quadraticCurveTo(-w, -d, -w + r, -d);
  return shape;
}

function createExtrudedBox(
  width: number,
  depth: number,
  height: number,
  cornerRadius: number,
  bevelSize: number,
  topScale = 1
): THREE.BufferGeometry {
  const shape = makeRoundedRectShape(width, depth, cornerRadius);
  const extrudeDepth = Math.max(0.001, height - 2 * bevelSize);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: extrudeDepth,
    bevelEnabled: bevelSize > 0,
    bevelThickness: bevelSize,
    bevelSize: bevelSize,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 12,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -height / 2 + bevelSize, 0);

  if (topScale !== 1) {
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = (y + height / 2) / height;
      const factor = THREE.MathUtils.lerp(1, topScale, t);
      pos.setX(i, pos.getX(i) * factor);
      pos.setZ(i, pos.getZ(i) * factor);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  }
  return geometry;
}

function makeIconTexture(
  svgPath: string,
  color: string,
  size = 256
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, size, size);
  const iconTargetSize = Math.round(size * 0.62);
  const scale = iconTargetSize / 24;
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(scale, scale);
  ctx.translate(-12, -12);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(svgPath));
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

// Mechanical Switch Sound Synthesis & Playback
let audioCtx: AudioContext | null = null;
let audioUnlockInstalled = false;

function installAudioUnlock() {
  if (audioUnlockInstalled || typeof window === "undefined") return;
  audioUnlockInstalled = true;
  const unlock = () => {
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: false });
  window.addEventListener("keydown", unlock, { once: false });
  window.addEventListener("touchstart", unlock, { once: false });
}

const KEY_SOUND_URLS = [
  "sounds/switch_press.mp3",
  "sounds/switch_release.mp3",
] as const;
const keySoundBuffers: (AudioBuffer | null)[] = [null, null];
let keySoundsLoading: Promise<void> | null = null;

function loadKeySounds(ctx: AudioContext): Promise<void> {
  if (keySoundsLoading) return keySoundsLoading;
  keySoundsLoading = Promise.all(
    KEY_SOUND_URLS.map((url, i) =>
      fetch(url)
        .then((r) => r.arrayBuffer())
        .then((buf) => ctx.decodeAudioData(buf))
        .then((decoded) => {
          keySoundBuffers[i] = decoded;
        })
        .catch(() => {})
    )
  ).then(() => undefined);
  return keySoundsLoading;
}

function playKeyClick(seed = 0) {
  if (typeof window === "undefined") return;
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      audioCtx = new Ctor();
      installAudioUnlock();
    }
    const ctx = audioCtx;

    const trigger = () => {
      const available = keySoundBuffers.filter((b): b is AudioBuffer => b !== null);
      if (available.length > 0) {
        const buffer = available[Math.floor(Math.random() * available.length)];
        const detune = 1 + (((seed * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.08;
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.playbackRate.value = detune;
        const gain = ctx.createGain();
        gain.gain.value = 0.65;
        src.connect(gain);
        gain.connect(ctx.destination);
        src.start();
      } else if (typeof window !== "undefined" && (window as any).PortoSound?.playClick) {
        (window as any).PortoSound.playClick(true);
      } else {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(260 + (seed % 5) * 20, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.04);
        g.gain.setValueAtTime(0.5, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.045);
      }
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(() => trigger()).catch(() => {});
    } else {
      if (keySoundBuffers.some((b) => b !== null)) {
        trigger();
      } else {
        loadKeySounds(ctx).then(trigger).catch(trigger);
      }
    }
  } catch {
    // Fail silently without breaking 3D rendering
  }
}

function Keycap({
  geometry,
  position,
  icon,
  onHoverChange,
  onPress,
  hovered,
  accent,
  isMobile,
}: {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  icon: SkillIcon;
  onHoverChange: (hovered: boolean) => void;
  onPress?: () => void;
  hovered: boolean;
  accent: string;
  isMobile: boolean;
}) {
  const pressRef = useRef<THREE.Group>(null);
  const pressY = useRef(0);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const iconTexture = useMemo(
    () => makeIconTexture(icon.path, `#${icon.hex}`),
    [icon.path, icon.hex]
  );

  const whiteColor = useMemo(() => new THREE.Color("#ffffff"), []);
  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);
  const bodyTint = useMemo(() => {
    const c = new THREE.Color(accent);
    c.lerp(whiteColor, 0.25);
    return c;
  }, [accent, whiteColor]);

  useEffect(() => {
    return () => iconTexture.dispose();
  }, [iconTexture]);

  useFrame(() => {
    if (!pressRef.current) return;
    const target = hovered ? -PRESS_DEPTH : 0;
    pressY.current = THREE.MathUtils.lerp(pressY.current, target, 0.24);
    pressRef.current.position.y = pressY.current;

    if (matRef.current) {
      const targetIntensity = hovered ? 0.95 : 0.3;
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        matRef.current.emissiveIntensity,
        targetIntensity,
        0.18
      );
      matRef.current.emissive.copy(whiteColor).lerp(accentColor, hovered ? 1 : 0);
      matRef.current.color.copy(whiteColor).lerp(bodyTint, hovered ? 0.6 : 0);
    }
  });

  const handleOver = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onHoverChange(true);
    },
    [onHoverChange]
  );
  const handleOut = useCallback(() => onHoverChange(false), [onHoverChange]);

  const handleDown = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onHoverChange(true);
      onPress?.();
    },
    [onHoverChange, onPress]
  );
  const handleUp = useCallback(() => onHoverChange(false), [onHoverChange]);

  const iconY = KEYCAP_HEIGHT / 2 + 0.0015;

  return (
    <group position={position}>
      <group ref={pressRef}>
        <mesh
          geometry={geometry}
          onPointerOver={isMobile ? undefined : handleOver}
          onPointerOut={isMobile ? undefined : handleOut}
          onPointerDown={handleDown}
          onPointerUp={handleUp}
          onPointerCancel={handleUp}
        >
          <meshPhysicalMaterial
            ref={matRef}
            color="#ffffff"
            transmission={0}
            roughness={0.32}
            clearcoat={isMobile ? 0 : 0.5}
            clearcoatRoughness={0.18}
            metalness={0}
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh
          position={[0, iconY, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1 / 1.22, 1, 1]}
          raycast={() => null}
        >
          <planeGeometry args={[ICON_PLANE_SIZE, ICON_PLANE_SIZE]} />
          <meshBasicMaterial
            map={iconTexture}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function KeyboardModel({
  palette,
  pointerOffset,
  isMobile,
}: {
  palette: { keyboardBase: string; accent: string };
  pointerOffset: { x: number; y: number };
  isMobile: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    if (hoveredKey) {
      const [row, col] = hoveredKey.split("-").map(Number);
      playKeyClick(row * COLS + col);
    }
  }, [hoveredKey]);

  useEffect(() => {
    if (ref.current) ref.current.rotation.order = "YXZ";
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;

    // Tilted completely towards the user so all key surfaces and tech logos are fully visible
    const basePitch = isMobile ? 0.46 : 0.44;
    const baseYaw = 0.0;
    const baseRoll = 0.0;

    const targetPitch = basePitch - pointerOffset.y * 0.045;
    const targetYaw = baseYaw + pointerOffset.x * 0.06;

    // Perfectly level horizontally with subtle natural breathing
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      targetYaw,
      0.08
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      targetPitch + Math.sin(t * 0.8) * 0.008,
      0.08
    );
    ref.current.rotation.z = baseRoll;
    ref.current.position.y = Math.sin(t * 0.7) * 0.015;
  });

  const keycapGeom = useMemo(
    () =>
      createExtrudedBox(
        KEYCAP_SIZE,
        KEYCAP_SIZE,
        KEYCAP_HEIGHT,
        0.05,
        0.012,
        KEYCAP_TOP_SCALE
      ),
    []
  );
  const baseGeom = useMemo(
    () => createExtrudedBox(BASE_WIDTH, BASE_DEPTH, BASE_HEIGHT, 0.12, 0.02, 1),
    []
  );

  useEffect(() => {
    return () => {
      keycapGeom.dispose();
      baseGeom.dispose();
    };
  }, [keycapGeom, baseGeom]);

  const keycapY = BASE_HEIGHT / 2 + KEYCAP_HEIGHT / 2 + 0.005;
  const keycaps = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = (col - (COLS - 1) / 2) * COL_SPACING;
      const z = (row - (ROWS - 1) / 2) * ROW_SPACING;
      const id = `${row}-${col}`;
      const icon = SKILLS_GRID[row][col];
      keycaps.push(
        <Keycap
          key={id}
          geometry={keycapGeom}
          position={[x, keycapY, z]}
          icon={icon}
          hovered={hoveredKey === id}
          accent={palette.accent}
          isMobile={isMobile}
          onHoverChange={(h) =>
            setHoveredKey((prev) => (h ? id : prev === id ? null : prev))
          }
          onPress={() => playKeyClick(row * COLS + col)}
        />
      );
    }
  }

  const widthFactor = 1.22; // Increase overall horizontal width by ~22% while keeping height and depth intact
  const mobileScale = 0.94; // Elegantly scaled down on mobile so entire keyboard is visible
  return (
    <group 
      scale={isMobile ? [mobileScale * widthFactor, mobileScale, mobileScale] : [1.48 * widthFactor, 1.48, 1.48]} 
      position={[0, isMobile ? -0.02 : -0.05, 0]}
    >
      <group ref={ref}>
        <mesh geometry={baseGeom}>
          <meshStandardMaterial
            color={palette.keyboardBase}
            roughness={0.58}
            metalness={0.05}
          />
        </mesh>
        {keycaps}
      </group>
    </group>
  );
}

export default function Interactive3DKeyboard() {
  const [siteColor, setSiteColor] = useState<string>(() => {
    if (typeof window !== "undefined") {
      if ((window as any).__portfolioCurrentColor) {
        return (window as any).__portfolioCurrentColor;
      }
      try {
        const rootColor = getComputedStyle(document.documentElement).getPropertyValue("--current-color").trim();
        if (rootColor) return rootColor;
      } catch {}
    }
    return "rgb(245, 158, 11)";
  });

  const palette = useMemo(() => ({
    keyboardBase: siteColor,
    accent: siteColor,
  }), [siteColor]);

  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleColorChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.color) {
        setSiteColor(detail.color);
      }
    };
    window.addEventListener("site-color-change", handleColorChange);

    try {
      const rootColor = getComputedStyle(document.documentElement).getPropertyValue("--current-color").trim();
      if (rootColor) setSiteColor(rootColor);
    } catch {}

    return () => {
      window.removeEventListener("site-color-change", handleColorChange);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setPointerOffset({
      x: THREE.MathUtils.clamp(x, -1, 1),
      y: THREE.MathUtils.clamp(y, -1, 1),
    });
  };

  const handlePointerLeave = () => {
    setPointerOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "clamp(240px, 30vh, 320px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
        borderRadius: "20px",
        background: "transparent",
      }}
    >
      {/* R3F 3D Canvas */}
      <Canvas
        camera={
          isMobile
            ? { position: [0, 1.58, 4.35], fov: 33 }
            : { position: [0, 1.45, 3.95], fov: 33 }
        }
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%", cursor: "grab" }}
      >
        <Environment resolution={128} environmentIntensity={0.25}>
          <Lightformer
            intensity={1.1}
            color="#ffffff"
            position={[0, 6, -4]}
            scale={[12, 6, 1]}
          />
          <Lightformer
            intensity={0.7}
            color="#ffffff"
            position={[-6, 2, 2]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[6, 4, 1]}
          />
          <Lightformer
            intensity={0.5}
            color="#ffffff"
            position={[6, 3, 1]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[6, 4, 1]}
          />
        </Environment>

        <ambientLight intensity={0.4} />
        <directionalLight position={[-4, 7, 3]} intensity={2.4} />
        <hemisphereLight intensity={0.35} color="#eaf2fb" groundColor="#0a1428" />

        <KeyboardModel
          palette={palette}
          pointerOffset={pointerOffset}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}

