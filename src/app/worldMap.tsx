import { useEffect, useRef } from "react";
import { useReducedMotion, useMotionValue, useSpring } from "motion/react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { geoArea, geoEqualEarth, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry, Position } from "geojson";
import landTopology from "world-atlas/land-110m.json";
import { NOISE_BG } from "@/app/ambient";
import { SPRING_CALM } from "@/app/motion/designSystem";
import { WORLD_MAP_HUBS, WORLD_MAP_ROUTES } from "@/app/data/worldMapNetwork";
import {
  hubBreatheDelay,
  WORLD_MAP_HUB_BREATHE_DURATION_S,
  routeActivateDuration,
  routeActivateDelay,
  WORLD_MAP_PARALLAX_MAX_PX,
  WORLD_MAP_PARTICLE_COUNT,
  WORLD_MAP_GLOW_BREATHE_PERIOD_S,
} from "@/app/motion/worldMapMotion";

const WORLD_MAP_WIDTH = 1264;
const WORLD_MAP_HEIGHT = 632;

const LAND_FEATURE_RAW = feature(
  landTopology as unknown as Parameters<typeof feature>[0],
  (landTopology as { objects: { land: unknown } }).objects.land as Parameters<typeof feature>[1],
) as unknown as FeatureCollection<Geometry>;

const MIN_ISLAND_AREA_SR = 0.0004;
const landGeometry = LAND_FEATURE_RAW.features[0].geometry as { type: "MultiPolygon"; coordinates: Position[][][] };
const LAND_FEATURE: FeatureCollection<Geometry> = {
  type: "FeatureCollection",
  features: [
    {
      ...LAND_FEATURE_RAW.features[0],
      geometry: {
        type: "MultiPolygon",
        coordinates: landGeometry.coordinates.filter(
          (polygon) => geoArea({ type: "Polygon", coordinates: polygon }) >= MIN_ISLAND_AREA_SR,
        ),
      },
    },
  ],
};
const WORLD_MAP_PADDING_Y = 6;
const WORLD_MAP_PADDING_X = 26;
const WORLD_MAP_PROJECTION: GeoProjection = geoEqualEarth().fitExtent(
  [
    [WORLD_MAP_PADDING_X, WORLD_MAP_PADDING_Y],
    [WORLD_MAP_WIDTH - WORLD_MAP_PADDING_X, WORLD_MAP_HEIGHT - WORLD_MAP_PADDING_Y],
  ],
  LAND_FEATURE,
);

function projectHub(lon: number, lat: number): [number, number] {
  return WORLD_MAP_PROJECTION([lon, lat]) ?? [0, 0];
}

function arcPath(a: [number, number], b: [number, number]): string {
  const cx = (a[0] + b[0]) / 2;
  const chord = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const bulge = Math.min(64, chord * 0.2);
  const cy = Math.min(a[1], b[1]) - bulge;
  return `M ${a[0]},${a[1]} Q ${cx},${cy} ${b[0]},${b[1]}`;
}

const WORLD_MAP_PARTICLES = Array.from({ length: WORLD_MAP_PARTICLE_COUNT }, (_, i) => ({
  leftPct: 16 + ((i * 41 + 9) % 68),
  topPct: 16 + ((i * 59 + 17) % 68),
  size: 1 + (i % 2),
  duration: 16 + (i % 4) * 3,
  delay: i * 0.8,
}));

let cachedReduceMotion: boolean | null = null;
function prefersReducedMotion(): boolean {
  if (cachedReduceMotion === null) {
    cachedReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return cachedReduceMotion;
}
let cachedFinePointer: boolean | null = null;
function hasFinePointer(): boolean {
  if (cachedFinePointer === null) {
    cachedFinePointer = window.matchMedia("(pointer: fine)").matches;
  }
  return cachedFinePointer;
}

export function WorldMapWidget() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapLayerRef = useRef<HTMLDivElement>(null);
  const px = useSpring(useMotionValue(0), SPRING_CALM);
  const py = useSpring(useMotionValue(0), SPRING_CALM);

  useEffect(() => {
    const unsubX = px.on("change", (v) => mapLayerRef.current?.style.setProperty("--map-parallax-x", `${v}px`));
    const unsubY = py.on("change", (v) => mapLayerRef.current?.style.setProperty("--map-parallax-y", `${v}px`));
    return () => {
      unsubX();
      unsubY();
    };
  }, [px, py]);

  function onMouseMove(e: React.MouseEvent) {
    if (prefersReducedMotion() || !hasFinePointer()) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    px.set(nx * WORLD_MAP_PARALLAX_MAX_PX * 2);
    py.set(ny * WORLD_MAP_PARALLAX_MAX_PX * 2);
  }
  function onMouseLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      className="relative w-full rounded-[20px]"
      style={{ border: "1px solid rgba(94,168,255,0.15)", boxShadow: "0 24px 60px -28px rgba(20,40,90,0.55)" }}
    >
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="rounded-[20px] overflow-hidden aspect-[2/1] min-h-[220px] sm:min-h-0 relative w-full bg-[#08111F]"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg className="absolute inset-0 w-full h-full opacity-[0.05]">
            <defs>
              <pattern id="world-map-grid" width="42" height="42" patternUnits="userSpaceOnUse">
                <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#5ea8ff" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#world-map-grid)" />
          </svg>
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 70% 80% at 50% 45%, rgba(59,130,246,0.09), transparent 65%)",
              animation: reduceMotion ? undefined : `world-map-glow-breathe ${WORLD_MAP_GLOW_BREATHE_PERIOD_S}s ease-in-out infinite`,
            }}
          />
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: NOISE_BG }} />
          {!reduceMotion &&
            WORLD_MAP_PARTICLES.map((p, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-[#7db4ff]"
                style={{
                  left: `${p.leftPct}%`,
                  top: `${p.topPct}%`,
                  width: p.size,
                  height: p.size,
                  opacity: 0.08,
                  animation: `world-map-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
                }}
              />
            ))}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,0.28) 100%)" }} />
        </div>

        <div
          ref={mapLayerRef}
          className="absolute inset-0"
          style={reduceMotion ? undefined : { transform: "translate(var(--map-parallax-x, 0px), var(--map-parallax-y, 0px))" }}
        >
          <ComposableMap
            width={WORLD_MAP_WIDTH}
            height={WORLD_MAP_HEIGHT}
            projection={WORLD_MAP_PROJECTION}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={LAND_FEATURE}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: "#F6F8FF", stroke: "none", outline: "none" },
                      hover: { fill: "#F6F8FF", stroke: "none", outline: "none" },
                      pressed: { fill: "#F6F8FF", stroke: "none", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${WORLD_MAP_WIDTH} ${WORLD_MAP_HEIGHT}`}>
          <defs>
            <filter id="world-map-route-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
            <filter id="world-map-packet-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="world-map-hub-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {WORLD_MAP_ROUTES.map((route, i) => {
            const a = projectHub(WORLD_MAP_HUBS[route.from].lon, WORLD_MAP_HUBS[route.from].lat);
            const b = projectHub(WORLD_MAP_HUBS[route.to].lon, WORLD_MAP_HUBS[route.to].lat);
            const d = arcPath(a, b);
            return (
              <path
                key={`route-${i}`}
                d={d}
                stroke="#57A8FF"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                filter="url(#world-map-route-blur)"
                style={{
                  opacity: reduceMotion ? 0.55 : undefined,
                  animation: reduceMotion
                    ? undefined
                    : `world-map-route-activate ${routeActivateDuration(i, WORLD_MAP_ROUTES.length)}s ease-in-out ${routeActivateDelay(i)} infinite`,
                }}
              />
            );
          })}

          {!reduceMotion &&
            WORLD_MAP_ROUTES.map((route, i) => {
              const a = projectHub(WORLD_MAP_HUBS[route.from].lon, WORLD_MAP_HUBS[route.from].lat);
              const b = projectHub(WORLD_MAP_HUBS[route.to].lon, WORLD_MAP_HUBS[route.to].lat);
              const d = arcPath(a, b);
              const pauseAttrs = route.pauses ? { keyTimes: "0;0.42;0.58;1", keyPoints: "0;0.42;0.42;1", calcMode: "linear" as const } : {};
              return (
                <g key={`packet-${i}`}>
                  <circle r="2.4" fill="#5ea8ff" opacity="0.3">
                    <animateMotion dur={`${route.duration}s`} begin={`${(route.delay + 0.16).toFixed(2)}s`} repeatCount="indefinite" path={d} {...pauseAttrs} />
                  </circle>
                  <circle r="1.8" fill="#8cc4ff" opacity="0.5">
                    <animateMotion dur={`${route.duration}s`} begin={`${(route.delay + 0.08).toFixed(2)}s`} repeatCount="indefinite" path={d} {...pauseAttrs} />
                  </circle>
                  <circle r="2.6" fill="#eaf4ff" filter="url(#world-map-packet-glow)">
                    <animateMotion dur={`${route.duration}s`} begin={`${route.delay.toFixed(2)}s`} repeatCount="indefinite" path={d} {...pauseAttrs} />
                  </circle>
                </g>
              );
            })}

          {WORLD_MAP_HUBS.map((hub, i) => {
            const [x, y] = projectHub(hub.lon, hub.lat);
            return (
              <g key={hub.label}>
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="#5ea8ff"
                  fillOpacity="0.12"
                  style={
                    reduceMotion
                      ? undefined
                      : {
                          transformBox: "fill-box",
                          transformOrigin: "center",
                          animation: `world-map-hub-breathe ${WORLD_MAP_HUB_BREATHE_DURATION_S}s ease-in-out ${hubBreatheDelay(i)} infinite`,
                        }
                  }
                />
                <circle cx={x} cy={y} r="3.5" fill="#5ea8ff" filter="url(#world-map-hub-glow)" />
                <circle cx={x} cy={y} r="1.6" fill="#ffffff" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
