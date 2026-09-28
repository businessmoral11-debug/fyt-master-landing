import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from "motion/react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";
import { NOISE_BG } from "@/app/ambient";
import { WORLD_MAP_CONTINENTS_PATH } from "@/app/data/worldMapContinents";
import { WORLD_MAP_VIEW_WIDTH, WORLD_MAP_VIEW_HEIGHT } from "@/app/data/worldMapProjection";
import { parseCountUpSegments, renderCountUp } from "@/app/motion/countUp";
import {
  GLOBE_HOTSPOTS,
  GLOBE_ROUTES,
  GLOBE_MARKER_COLOR,
  GLOBE_ARC_COLOR,
  GLOBE_ATMOSPHERE_COLOR,
  GLOBE_OCEAN_COLOR,
  GLOBE_LAND_COLOR,
  GLOBE_ROUTE_COLOR,
  GLOBE_AUTOROTATE_SPEED,
  GLOBE_MARKER_PULSE_PERIOD_S,
  GLOBE_MARKER_UPDATE_INTERVAL_MS,
  GLOBE_LABEL_COUNT_MIN,
  GLOBE_LABEL_COUNT_MAX,
  GLOBE_LABEL_CYCLE_MIN_MS,
  GLOBE_LABEL_CYCLE_MAX_MS,
  GLOBE_ROUTE_ACTIVE_MIN,
  GLOBE_ROUTE_ACTIVE_MAX,
  GLOBE_ROUTE_CYCLE_MS,
  GLOBE_ARC_DASH_ANIMATE_MS,
  resolveTraderCount,
  type GlobeHotspot,
} from "@/app/data/globeConfig";
import { fetchGlobeStats } from "@/app/api/globeStatsApi";
import { isLowPowerDevice } from "@/app/three/perf";

const GLOBE_PERF_ENABLED =
  import.meta.env.DEV || (typeof location !== "undefined" && new URLSearchParams(location.search).has("globePerf"));

const GLOBE_RADIUS = 100;
function latLonToVec3(lat: number, lon: number, relAltitude = 0): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((90 - lon) * Math.PI) / 180;
  const r = GLOBE_RADIUS * (1 + relAltitude);
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(r * sinPhi * Math.cos(theta), r * Math.cos(phi), r * sinPhi * Math.sin(theta));
}

const GLOBE_COASTLINE_STROKE_ENABLED = false;
const GLOBE_VIGNETTE_ENABLED = false;

function createFlatEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = WORLD_MAP_VIEW_WIDTH;
  canvas.height = WORLD_MAP_VIEW_HEIGHT;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = GLOBE_OCEAN_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const landPath = new Path2D(WORLD_MAP_CONTINENTS_PATH);
  ctx.fillStyle = GLOBE_LAND_COLOR;
  ctx.fill(landPath, "evenodd");

  if (GLOBE_COASTLINE_STROKE_ENABLED) {
    ctx.strokeStyle = GLOBE_ROUTE_COLOR;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.stroke(landPath);
    ctx.globalAlpha = 1;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const ORBIT_LINE_CONFIGS = [
  { radius: GLOBE_RADIUS * 1.28, tube: 0.1, tilt: 0.1, opacity: 0.16, speed: 0.035 },
  { radius: GLOBE_RADIUS * 1.4, tube: 0.08, tilt: -0.16, opacity: 0.12, speed: -0.026 },
  { radius: GLOBE_RADIUS * 1.52, tube: 0.07, tilt: 0.2, opacity: 0.09, speed: 0.018 },
];

function OrbitLines() {
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  useFrame((_, delta) => {
    ORBIT_LINE_CONFIGS.forEach((cfg, i) => {
      const mesh = refs.current[i];
      if (mesh) mesh.rotation.z += delta * cfg.speed;
    });
  });
  return (
    <>
      {ORBIT_LINE_CONFIGS.map((cfg, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} rotation={[cfg.tilt, 0.3 * i, 0]}>
          <torusGeometry args={[cfg.radius, cfg.tube, 8, 128]} />
          <meshBasicMaterial color={GLOBE_ROUTE_COLOR} transparent opacity={cfg.opacity} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

const GLOBE_STAR_VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aTwinklePhase;
  uniform float uPixelRatio;
  uniform float uTime;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vColor = aColor;
    vTwinkle = 0.82 + 0.18 * sin(uTime * 0.6 + aTwinklePhase * 6.2831853);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * uPixelRatio;
  }
`;
const GLOBE_STAR_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    if (dot(centered, centered) > 0.25) discard;
    gl_FragColor = vec4(vColor * vTwinkle, 1.0);
  }
`;

function StarDust() {
  const ref = useRef<THREE.Points>(null);
  const material = useMemo(() => {
    const count = typeof window !== "undefined" && window.innerWidth < 768 ? 700 : 1400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinklePhases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = GLOBE_RADIUS * (1.7 + Math.random() * 2.1);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const colorRoll = Math.random();
      let cr = 0.95, cg = 0.96, cb = 1.0;
      if (colorRoll < 0.05) {
        cr = 0.75; cg = 0.83; cb = 1.0;
      } else if (colorRoll < 0.08) {
        cr = 1.0; cg = 0.92; cb = 0.76;
      }
      colors[i * 3] = cr;
      colors[i * 3 + 1] = cg;
      colors[i * 3 + 2] = cb;

      const sizeRoll = Math.random();
      sizes[i] = sizeRoll < 0.01 ? 2.4 : sizeRoll < 0.1 ? 1.7 : 1.1;
      twinklePhases[i] = Math.random();
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geom.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geom.setAttribute("aTwinklePhase", new THREE.BufferAttribute(twinklePhases, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { uPixelRatio: { value: 1 }, uTime: { value: 0 } },
      vertexShader: GLOBE_STAR_VERTEX_SHADER,
      fragmentShader: GLOBE_STAR_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
    });

    return { geom, mat };
  }, []);

  useEffect(() => {
    return () => {
      material.geom.dispose();
      material.mat.dispose();
    };
  }, [material]);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.004;
    material.mat.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    material.mat.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return <points ref={ref} geometry={material.geom} material={material.mat} />;
}

interface HoverInfo {
  hotspot: GlobeHotspot;
  traders: number;
}

function EarthGlobe({
  onReady,
  onHover,
  active,
  liveStats,
}: {
  onReady: () => void;
  onHover: (info: HoverInfo | null) => void;
  active: boolean;
  liveStats: ReadonlyMap<string, number>;
}) {
  const globe = useMemo(() => {
    if (GLOBE_PERF_ENABLED) performance.mark("globe:texture-start");
    const earthTexture = createFlatEarthTexture();
    if (GLOBE_PERF_ENABLED) {
      performance.mark("globe:texture-end");
      try {
        performance.measure("Globe: texture creation (2D canvas draw)", "globe:texture-start", "globe:texture-end");
      } catch {
      }
    }
    const material = new THREE.MeshLambertMaterial({ map: earthTexture });
    if (GLOBE_PERF_ENABLED) performance.mark("globe:geometry-start");
    const g = new ThreeGlobe()
      .globeMaterial(material)
      .showAtmosphere(true)
      .atmosphereColor(GLOBE_ATMOSPHERE_COLOR)
      .atmosphereAltitude(0.06)
      .pointsData(GLOBE_HOTSPOTS)
      .pointLat((d: GlobeHotspot) => d.lat)
      .pointLng((d: GlobeHotspot) => d.lon)
      .pointColor(() => GLOBE_MARKER_COLOR)
      .pointAltitude(0.008)
      .pointRadius(0.45)
      .pointsMerge(false)
      .pointsTransitionDuration(GLOBE_MARKER_UPDATE_INTERVAL_MS)
      .arcsData([])
      .arcColor(() => GLOBE_ARC_COLOR)
      .arcAltitude(0.28)
      .arcStroke(0.35)
      .arcDashLength(0.4)
      .arcDashGap(2.2)
      .arcDashInitialGap(() => Math.random() * 5)
      .arcDashAnimateTime(GLOBE_ARC_DASH_ANIMATE_MS)
      .arcsTransitionDuration(700);
    if (GLOBE_PERF_ENABLED) {
      performance.mark("globe:geometry-end");
      try {
        performance.measure("Globe: geometry generation (ThreeGlobe + points setup)", "globe:geometry-start", "globe:geometry-end");
      } catch {
      }
    }
    g.onGlobeReady(() => {
      if (GLOBE_PERF_ENABLED) {
        performance.mark("globe:ready");
        try {
          performance.measure("Globe: canvas created -> ready (first render, post-precompile)", "globe:canvas-created", "globe:ready");
          if (performance.getEntriesByName("globe:init-trigger").length) {
            performance.measure("Globe: TOTAL (scroll-trigger -> fully ready)", "globe:init-trigger", "globe:ready");
          }
          console.info(
            "[globe perf]",
            performance
              .getEntriesByType("measure")
              .filter((e) => e.name.startsWith("Globe:"))
              .map((e) => `${e.name}: ${e.duration.toFixed(1)}ms`),
          );
        } catch {
        }
      }
      onReady();
    });
    return g;
  }, []);

  useEffect(() => {
    return () => globe._destructor();
  }, [globe]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      const t = performance.now() / 1000;
      const data = GLOBE_HOTSPOTS.map((h, i) => {
        const phase = (i / GLOBE_HOTSPOTS.length) * Math.PI * 2;
        const pulse = 0.5 + 0.5 * Math.sin((t / GLOBE_MARKER_PULSE_PERIOD_S) * Math.PI * 2 + phase);
        return { ...h, radius: 0.4 + pulse * 0.22 };
      });
      globe.pointRadius((d: GlobeHotspot & { radius: number }) => d.radius).pointsData(data);
    }, GLOBE_MARKER_UPDATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [globe, active]);

  useEffect(() => {
    if (!active) return;
    let isFirstCycle = true;
    function cycle() {
      if (GLOBE_PERF_ENABLED && isFirstCycle) performance.mark("globe:arc-gen-start");
      const count = GLOBE_ROUTE_ACTIVE_MIN + Math.floor(Math.random() * (GLOBE_ROUTE_ACTIVE_MAX - GLOBE_ROUTE_ACTIVE_MIN + 1));
      const shuffled = [...GLOBE_ROUTES].sort(() => Math.random() - 0.5).slice(0, count);
      const arcs = shuffled.map((r) => {
        const from = GLOBE_HOTSPOTS.find((h) => h.country === r.from)!;
        const to = GLOBE_HOTSPOTS.find((h) => h.country === r.to)!;
        return { startLat: from.lat, startLng: from.lon, endLat: to.lat, endLng: to.lon };
      });
      globe
        .arcStartLat((d: { startLat: number }) => d.startLat)
        .arcStartLng((d: { startLng: number }) => d.startLng)
        .arcEndLat((d: { endLat: number }) => d.endLat)
        .arcEndLng((d: { endLng: number }) => d.endLng)
        .arcsData(arcs);
      if (GLOBE_PERF_ENABLED && isFirstCycle) {
        performance.mark("globe:arc-gen-end");
        try {
          performance.measure("Globe: arc generation (first cycle)", "globe:arc-gen-start", "globe:arc-gen-end");
        } catch {
        }
        isFirstCycle = false;
      }
    }
    cycle();
    const id = setInterval(cycle, GLOBE_ROUTE_CYCLE_MS);
    return () => clearInterval(id);
  }, [globe, active]);

  return (
    <>
      <primitive object={globe} />
      <OrbitLines />
      <StarDust />
      {GLOBE_HOTSPOTS.map((h) => (
        <mesh
          key={h.country}
          position={latLonToVec3(h.lat, h.lon, 0.02)}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover({ hotspot: h, traders: resolveTraderCount(h, liveStats) });
          }}
          onPointerOut={() => onHover(null)}
        >
          <sphereGeometry args={[3.2, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthTest={false} />
        </mesh>
      ))}
    </>
  );
}

function LeaderLine({ hotspot }: { hotspot: GlobeHotspot }) {
  const start = useMemo(() => latLonToVec3(hotspot.lat, hotspot.lon, 0.015), [hotspot]);
  const end = useMemo(() => latLonToVec3(hotspot.lat, hotspot.lon, 0.2), [hotspot]);
  const packetRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const baseGlowRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<any>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    const t = (Math.sin(elapsed * 1.1 + hotspot.lat) + 1) / 2;
    if (packetRef.current) packetRef.current.position.lerpVectors(start, end, t);
    if (haloRef.current) {
      haloRef.current.position.lerpVectors(start, end, t);
      const haloPulse = 0.85 + Math.sin(elapsed * 4 + hotspot.lat) * 0.15;
      haloRef.current.scale.setScalar(haloPulse);
    }
    if (baseGlowRef.current) {
      const basePulse = 0.75 + Math.sin(elapsed * 1.6 + hotspot.lon) * 0.25;
      baseGlowRef.current.scale.setScalar(basePulse);
    }
    if (lineRef.current?.material) lineRef.current.material.opacity = 0.3 + Math.sin(elapsed * 1.1 + hotspot.lat) * 0.12;
  });

  return (
    <>
      <Line ref={lineRef} points={[start, end]} color={GLOBE_ROUTE_COLOR} transparent opacity={0.4} lineWidth={1} />
      {/* Soft pulsing glow where the ray leaves the globe's surface. */}
      <mesh ref={baseGlowRef} position={start}>
        <sphereGeometry args={[2.4, 10, 10]} />
        <meshBasicMaterial color={GLOBE_ROUTE_COLOR} transparent opacity={0.28} depthTest={false} />
      </mesh>
      {/* Traveling packet: bright core + a larger soft halo trailing it. */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[2.6, 10, 10]} />
        <meshBasicMaterial color={GLOBE_ROUTE_COLOR} transparent opacity={0.22} depthTest={false} />
      </mesh>
      <mesh ref={packetRef}>
        <sphereGeometry args={[1.3, 8, 8]} />
        <meshBasicMaterial color={GLOBE_ROUTE_COLOR} transparent opacity={0.95} depthTest={false} />
      </mesh>
    </>
  );
}

function TraderCountText({ value, prefersReducedMotion }: { value: number; prefersReducedMotion: boolean | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const text = value.toLocaleString();
  const segments = useMemo(() => parseCountUpSegments(text), [text]);
  const progress = useMotionValue(0);
  const spring = useSpring(progress, { stiffness: 90, damping: 18, mass: 1 });

  useEffect(() => {
    if (!ref.current) return;
    ref.current.textContent = prefersReducedMotion ? text : renderCountUp(segments, 0);
    if (!prefersReducedMotion) progress.set(1);
  }, [prefersReducedMotion, segments, text]);

  useMotionValueEvent(spring, "change", (v) => {
    if (prefersReducedMotion || !ref.current) return;
    ref.current.textContent = renderCountUp(segments, v);
  });

  return <span ref={ref}>{text}</span>;
}

function angularDistanceDeg(a: GlobeHotspot, b: GlobeHotspot): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const phi1 = toRad(a.lat);
  const phi2 = toRad(b.lat);
  const dLon = toRad(b.lon - a.lon);
  const cosD = Math.sin(phi1) * Math.sin(phi2) + Math.cos(phi1) * Math.cos(phi2) * Math.cos(dLon);
  return (Math.acos(Math.min(1, Math.max(-1, cosD))) * 180) / Math.PI;
}

function pickSpreadHotspots(count: number): GlobeHotspot[] {
  const pool = [...GLOBE_HOTSPOTS];
  const first = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
  const chosen = [first];
  while (chosen.length < count && pool.length) {
    let bestIndex = 0;
    let bestScore = -1;
    pool.forEach((candidate, i) => {
      const minDist = Math.min(...chosen.map((c) => angularDistanceDeg(c, candidate)));
      if (minDist > bestScore) {
        bestScore = minDist;
        bestIndex = i;
      }
    });
    chosen.push(pool.splice(bestIndex, 1)[0]);
  }
  return chosen;
}

interface VisibleLabel {
  key: number;
  hotspot: GlobeHotspot;
  traders: number;
}
let nextLabelKey = 0;

function FloatingLabels({
  prefersReducedMotion,
  active,
  liveStats,
}: {
  prefersReducedMotion: boolean | null;
  active: boolean;
  liveStats: ReadonlyMap<string, number>;
}) {
  const [labels, setLabels] = useState<VisibleLabel[]>([]);

  useEffect(() => {
    if (!active) return;
    function cycle() {
      const count = GLOBE_LABEL_COUNT_MIN + Math.floor(Math.random() * (GLOBE_LABEL_COUNT_MAX - GLOBE_LABEL_COUNT_MIN + 1));
      const spread = pickSpreadHotspots(count);
      setLabels(spread.map((h) => ({ key: nextLabelKey++, hotspot: h, traders: resolveTraderCount(h, liveStats) })));
    }
    cycle();
    let timer: ReturnType<typeof setTimeout>;
    function schedule() {
      const delay = GLOBE_LABEL_CYCLE_MIN_MS + Math.random() * (GLOBE_LABEL_CYCLE_MAX_MS - GLOBE_LABEL_CYCLE_MIN_MS);
      timer = setTimeout(() => {
        cycle();
        schedule();
      }, delay);
    }
    schedule();
    return () => clearTimeout(timer);
  }, [active, liveStats]);

  if (prefersReducedMotion) return null;

  return (
    <>
      {labels.map((label) => (
        <group key={label.key}>
          <LeaderLine hotspot={label.hotspot} />
          <Html position={latLonToVec3(label.hotspot.lat, label.hotspot.lon, 0.22)} center occlude distanceFactor={95}>
            <AnimatePresence>
              <div className="globe-card-float">
                <motion.div
                  className="flex flex-col gap-[6px] rounded-[14px]"
                  style={{
                    width: "clamp(184px, 22vw, 224px)",
                    padding: "20px",
                    background: "rgba(10,18,32,0.55)",
                    border: "1px solid rgba(77,163,255,0.28)",
                    boxShadow: "0 12px 28px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
                    backdropFilter: "blur(16px) saturate(140%)",
                  }}
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <span className="text-[18px] font-semibold text-white leading-tight">
                    {label.hotspot.flag} {label.hotspot.country}
                  </span>
                  <span className="text-[32px] font-bold text-white leading-none tracking-[-0.02em]">
                    <TraderCountText value={label.traders} prefersReducedMotion={prefersReducedMotion} />
                  </span>
                  <span className="text-[13px] font-medium text-[#7CC8FF] leading-none">Active Traders</span>
                </motion.div>
              </div>
            </AnimatePresence>
          </Html>
        </group>
      ))}
    </>
  );
}

function HoverTooltip({ info }: { info: HoverInfo | null }) {
  if (!info) return null;
  return (
    <Html position={latLonToVec3(info.hotspot.lat, info.hotspot.lon, 0.05)} center occlude distanceFactor={95}>
      <motion.div
        className="flex flex-col gap-[2px] px-[14px] py-[10px] rounded-[12px] whitespace-nowrap pointer-events-none"
        style={{
          background: "rgba(10,18,32,0.68)",
          border: "1px solid rgba(77,163,255,0.28)",
          boxShadow: "0 8px 24px -8px rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px) saturate(140%)",
          transform: "translateY(-140%)",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <span className="text-[13px] font-semibold text-white">
          {info.hotspot.flag} {info.hotspot.country}
        </span>
        <span className="text-[12px] font-medium text-[#7CC8FF]">{info.traders.toLocaleString()} Active Traders</span>
      </motion.div>
    </Html>
  );
}

function GlobePrecompile({ onDone }: { onDone: () => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    if (GLOBE_PERF_ENABLED) performance.mark("globe:shader-compile-start");
    gl.compile(scene, camera);
    if (GLOBE_PERF_ENABLED) {
      performance.mark("globe:shader-compile-end");
      try {
        performance.measure("Globe: shader compile (forced via renderer.compile)", "globe:shader-compile-start", "globe:shader-compile-end");
      } catch {
      }
    }

    if (GLOBE_PERF_ENABLED) performance.mark("globe:texture-upload-start");
    scene.traverse((obj: any) => {
      const material = obj.material;
      if (!material) return;
      const materials = Array.isArray(material) ? material : [material];
      for (const mat of materials) {
        if (mat?.map instanceof THREE.Texture) gl.initTexture(mat.map);
      }
    });
    if (GLOBE_PERF_ENABLED) {
      performance.mark("globe:texture-upload-end");
      try {
        performance.measure("Globe: texture upload to GPU", "globe:texture-upload-start", "globe:texture-upload-end");
      } catch {
      }
    }

    gl.render(scene, camera);
    onDone();
  }, []);
  return null;
}

export function TradingGlobe({ onReady, active = true }: { onReady?: () => void; active?: boolean } = {}) {
  const prefersReducedMotion = useReducedMotion();
  const [globeReady, setGlobeReady] = useState(false);
  const [precompiled, setPrecompiled] = useState(false);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const fullyReady = globeReady && precompiled;

  const [lowPower] = useState(() => isLowPowerDevice());
  const [liveStats, setLiveStats] = useState<ReadonlyMap<string, number>>(() => new Map());
  useEffect(() => {
    let cancelled = false;
    fetchGlobeStats()
      .then((stats) => {
        if (!cancelled) setLiveStats(stats);
      })
      .catch(() => {
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (fullyReady) onReady?.();
  }, [fullyReady]);

  return (
    <div className="relative w-full rounded-[20px] overflow-visible" style={{ border: "1px solid rgba(77,163,255,0.15)", boxShadow: "0 24px 60px -28px rgba(0,0,0,0.6)" }}>
      <div className="rounded-[20px] overflow-visible aspect-[2/1] min-h-[280px] sm:min-h-0 relative w-full bg-[#05070d]">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: NOISE_BG }} />
        </div>

        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: fullyReady ? 1 : 0 }} transition={{ duration: 0.6 }}>
          {GLOBE_VIGNETTE_ENABLED && (
            <div
              className="absolute inset-0 pointer-events-none z-10"
              aria-hidden="true"
              style={{ background: "radial-gradient(ellipse 75% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }}
            />
          )}
          <Canvas
            flat
            // R3F's <Canvas> wraps itself in its own internal div with
            // overflow:hidden baked into its default inline styles — a
            // separate element from the divs around it, so changing THEIR
            // overflow (done in the outer wrapper below) doesn't reach it.
            // This is what was still clipping the country cards even after
            // that fix. Overriding it here reaches the actual boundary.
            style={{ overflow: "visible" }}
            camera={{ position: [0, 0, 300], fov: 42 }}
            dpr={[1, lowPower ? 1.15 : typeof window !== "undefined" && window.innerWidth < 768 ? 1.5 : 1.75]}
            gl={{ antialias: !lowPower, alpha: true, powerPreference: "high-performance" }}
            frameloop={active ? "always" : "demand"}
            onCreated={({ gl }) => {
              if (GLOBE_PERF_ENABLED) performance.mark("globe:canvas-created");
              // Without this, a lost WebGL context (which a fast/heavy
              // scroll can trigger on some iPhones) leaves the canvas
              // permanently black — the browser only attempts to restore a
              // context whose loss event was preventDefault()'d.
              const canvasEl = gl.domElement;
              canvasEl.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
              canvasEl.addEventListener("webglcontextrestored", () => gl.forceContextRestore?.(), false);
            }}
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[120, 80, 140]} intensity={0.55} color="#ffffff" />
            <EarthGlobe onReady={() => setGlobeReady(true)} onHover={setHover} active={active} liveStats={liveStats} />
            <FloatingLabels prefersReducedMotion={prefersReducedMotion} active={active} liveStats={liveStats} />
            <HoverTooltip info={hover} />
            {!prefersReducedMotion && (
              <OrbitControls
                enabled={active}
                enableZoom={false}
                enablePan={false}
                enableRotate
                enableDamping
                dampingFactor={0.08}
                rotateSpeed={0.45}
                autoRotate={active}
                autoRotateSpeed={GLOBE_AUTOROTATE_SPEED}
                minPolarAngle={Math.PI * 0.28}
                maxPolarAngle={Math.PI * 0.72}
              />
            )}
            <GlobePrecompile onDone={() => setPrecompiled(true)} />
          </Canvas>
        </motion.div>
      </div>
    </div>
  );
}
