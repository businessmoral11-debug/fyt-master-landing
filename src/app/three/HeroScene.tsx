import { memo, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

const ASTEROIDS_ENABLED = false;

const ASTEROID_MODEL_URLS = {
  rock1: "/models/moon-rock-01/moon_rock_01_1k.gltf",
  rock2: "/models/moon-rock-02/moon_rock_02_1k.gltf",
  rock2Hi: "/models/moon-rock-02/moon_rock_02_2k.gltf",
  rock3: "/models/moon-rock-03/moon_rock_03_1k.gltf",
  rock5Hi: "/models/moon-rock-05/moon_rock_05_2k.gltf",
} as const;
const ROCK2_DISPLACEMENT_URL = "/models/moon-rock-02/textures/moon_rock_02_disp_2k.jpg";
const ROCK5_DISPLACEMENT_URL = "/models/moon-rock-05/textures/moon_rock_05_disp_2k.jpg";

if (ASTEROIDS_ENABLED) {
  useGLTF.preload(ASTEROID_MODEL_URLS.rock1);
  useGLTF.preload(ASTEROID_MODEL_URLS.rock2);
  useGLTF.preload(ASTEROID_MODEL_URLS.rock2Hi);
  useGLTF.preload(ASTEROID_MODEL_URLS.rock3);
  useGLTF.preload(ASTEROID_MODEL_URLS.rock5Hi);
  useTexture.preload(ROCK2_DISPLACEMENT_URL);
  useTexture.preload(ROCK5_DISPLACEMENT_URL);
}

interface AsteroidSpec {
  key: string;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  scaleAxes?: [number, number, number];
  rotationSpeed: number;
  floatAmplitudeY: number;
  /** Seconds for one full vertical float cycle. */
  floatPeriod: number;
  driftAmplitudeX: number;
  driftPeriod: number;
  phaseOffset: number;
  colorTint: number;
  roughnessJitter: number;
  displacementMap?: THREE.Texture;
  displacementScale?: number;
  displacementBias?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function inHeroTextZone(x: number, y: number): boolean {
  return Math.abs(x) < 3.6 && y > -2.4 && y < 3.8;
}

function inHeroTextZoneScaled(x: number, y: number, z: number): boolean {
  const distance = 8 - z;
  const scale = Math.max(1, distance / 12);
  return Math.abs(x) < 3.6 * scale && y > -2.4 * scale && y < 3.8 * scale;
}

function Asteroid({ spec }: { spec: AsteroidSpec }) {
  const material = useMemo(() => {
    const m = spec.material.clone() as THREE.MeshStandardMaterial;
    m.color.multiplyScalar(spec.colorTint);
    if (typeof m.roughness === "number") {
      m.roughness = THREE.MathUtils.clamp(m.roughness + spec.roughnessJitter, 0.35, 1);
    }
    if (spec.displacementMap) {
      m.displacementMap = spec.displacementMap;
      m.displacementScale = spec.displacementScale ?? 0.02;
      m.displacementBias = spec.displacementBias ?? -(spec.displacementScale ?? 0.02) / 2;
    }
    m.needsUpdate = true;
    return m;
  }, [spec.material, spec.colorTint, spec.roughnessJitter, spec.displacementMap, spec.displacementScale, spec.displacementBias]);

  useEffect(() => () => material.dispose(), [material]);

  const rotAxis = useMemo(() => new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(), []);
  const ref = useRef<THREE.Mesh>(null);
  const basePos = spec.position;

  useFrame(({ clock }, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotateOnAxis(rotAxis, spec.rotationSpeed * delta);
    const t = clock.getElapsedTime();
    const floatPhase = (t / spec.floatPeriod) * Math.PI * 2 + spec.phaseOffset;
    const driftPhase = (t / spec.driftPeriod) * Math.PI * 2 + spec.phaseOffset * 1.3;
    mesh.position.set(
      basePos[0] + Math.sin(driftPhase) * spec.driftAmplitudeX,
      basePos[1] + Math.sin(floatPhase) * spec.floatAmplitudeY,
      basePos[2],
    );
  });

  return (
    <mesh
      ref={ref}
      geometry={spec.geometry}
      material={material}
      position={spec.position}
      rotation={spec.rotation}
      scale={
        spec.scaleAxes
          ? [spec.scale * spec.scaleAxes[0], spec.scale * spec.scaleAxes[1], spec.scale * spec.scaleAxes[2]]
          : spec.scale
      }
      castShadow={spec.castShadow ?? true}
      receiveShadow={spec.receiveShadow ?? true}
    />
  );
}

interface ScatterPoolEntry {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
}
interface ScatterOptions {
  count: number;
  pool: ScatterPoolEntry[];
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number];
  scaleRange: [number, number];
  floatAmpRange: [number, number];
  floatPeriodRange: [number, number];
  driftAmpRange: [number, number];
  driftPeriodRange: [number, number];
  rotationSpeedRange: [number, number];
  keyPrefix: string;
  edgeBias?: boolean;
}
function buildScatterSpecs(opts: ScatterOptions): AsteroidSpec[] {
  const specs: AsteroidSpec[] = [];
  let attempts = 0;
  while (specs.length < opts.count && attempts < opts.count * 40) {
    attempts++;
    let x = randRange(opts.xRange[0], opts.xRange[1]);
    let y = randRange(opts.yRange[0], opts.yRange[1]);
    if (opts.edgeBias) {
      const edgeX = randRange(opts.xRange[0], opts.xRange[1]);
      const edgeY = randRange(opts.yRange[0], opts.yRange[1]);
      x = Math.abs(edgeX) > Math.abs(x) ? edgeX : x;
      y = Math.abs(edgeY) > Math.abs(y) ? edgeY : y;
    }
    const z = randRange(opts.zRange[0], opts.zRange[1]);
    if (inHeroTextZoneScaled(x, y, z)) continue;
    const pick = opts.pool[Math.floor(Math.random() * opts.pool.length)];
    specs.push({
      key: `${opts.keyPrefix}-${specs.length}`,
      geometry: pick.geometry,
      material: pick.material,
      position: [x, y, z],
      rotation: [randRange(0, Math.PI * 2), randRange(0, Math.PI * 2), randRange(0, Math.PI * 2)],
      scale: randRange(opts.scaleRange[0], opts.scaleRange[1]),
      scaleAxes: [randRange(0.82, 1.22), randRange(0.82, 1.22), randRange(0.82, 1.22)],
      rotationSpeed: randRange(opts.rotationSpeedRange[0], opts.rotationSpeedRange[1]),
      floatAmplitudeY: randRange(opts.floatAmpRange[0], opts.floatAmpRange[1]),
      floatPeriod: randRange(opts.floatPeriodRange[0], opts.floatPeriodRange[1]),
      driftAmplitudeX: randRange(opts.driftAmpRange[0], opts.driftAmpRange[1]),
      driftPeriod: randRange(opts.driftPeriodRange[0], opts.driftPeriodRange[1]),
      phaseOffset: randRange(0, Math.PI * 2),
      colorTint: randRange(0.85, 1.08),
      roughnessJitter: randRange(-0.04, 0.04),
      castShadow: false,
      receiveShadow: false,
    });
  }
  return specs;
}

const MICRO_COUNT = 170;

function MicroAsteroids({ geometry, material }: { geometry: THREE.BufferGeometry; material: THREE.Material }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const builtRef = useRef(false);

  const instMaterial = useMemo(() => {
    const m = (material as THREE.MeshStandardMaterial).clone();
    if (typeof m.roughness === "number") m.roughness = THREE.MathUtils.clamp(m.roughness + 0.05, 0.4, 1);
    m.needsUpdate = true;
    return m;
  }, [material]);

  useEffect(() => () => instMaterial.dispose(), [instMaterial]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (mesh && !builtRef.current) {
      builtRef.current = true;
      const dummy = new THREE.Object3D();
      for (let i = 0; i < MICRO_COUNT; i++) {
        let x = 0;
        let y = 0;
        do {
          x = randRange(-12, 12);
          y = randRange(-6.8, 6.8);
        } while (inHeroTextZone(x, y));
        dummy.position.set(x, y, randRange(-17, -30));
        dummy.rotation.set(randRange(0, Math.PI * 2), randRange(0, Math.PI * 2), randRange(0, Math.PI * 2));
        const base = randRange(0.3, 1.05);
        dummy.scale.set(base * randRange(0.8, 1.2), base * randRange(0.8, 1.2), base * randRange(0.8, 1.2));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.frustumCulled = false;
    }
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.position.x = Math.sin(t * 0.015) * 0.5;
      groupRef.current.rotation.z = t * 0.0018;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[geometry, instMaterial, MICRO_COUNT]} castShadow={false} receiveShadow={false} />
    </group>
  );
}

function AsteroidField() {
  const rock1 = useGLTF(ASTEROID_MODEL_URLS.rock1);
  const rock2 = useGLTF(ASTEROID_MODEL_URLS.rock2);
  const rock2Hi = useGLTF(ASTEROID_MODEL_URLS.rock2Hi);
  const rock3 = useGLTF(ASTEROID_MODEL_URLS.rock3);
  const rock5Hi = useGLTF(ASTEROID_MODEL_URLS.rock5Hi);
  const rock2Displacement = useTexture(ROCK2_DISPLACEMENT_URL);
  const rock5Displacement = useTexture(ROCK5_DISPLACEMENT_URL);

  useEffect(() => {
    rock2Displacement.colorSpace = THREE.NoColorSpace;
    rock2Displacement.needsUpdate = true;
    rock5Displacement.colorSpace = THREE.NoColorSpace;
    rock5Displacement.needsUpdate = true;
  }, [rock2Displacement, rock5Displacement]);

  const rock1LOD0 = rock1.nodes["moon_rock_01_LOD0"] as THREE.Mesh;
  const rock1LOD2 = (rock1.nodes["moon_rock_01_LOD2"] as THREE.Mesh) ?? rock1LOD0;
  const rock1LOD3 = (rock1.nodes["moon_rock_01_LOD3"] as THREE.Mesh) ?? rock1LOD0;
  const rock2Mesh = rock2.nodes["moon_rock_02_LOD0"] as THREE.Mesh;
  const rock2HiMesh = rock2Hi.nodes["moon_rock_02_LOD0"] as THREE.Mesh;
  const rock3Mesh = rock3.nodes["moon_rock_03_LOD0"] as THREE.Mesh;
  const rock5HiLOD0 = rock5Hi.nodes["moon_rock_05_LOD0"] as THREE.Mesh;

  const specs = useMemo<AsteroidSpec[]>(
    () => [
      {
        key: "large-left",
        geometry: rock5HiLOD0.geometry,
        material: rock5HiLOD0.material,
        position: [-6.3, -2.9, -3.5],
        rotation: [0.6, 2.1, -0.3],
        scale: 33.0,
        rotationSpeed: 0.0022,
        floatAmplitudeY: 0.08,
        floatPeriod: 13,
        driftAmplitudeX: 0.018,
        driftPeriod: 29,
        phaseOffset: 0,
        colorTint: 1.02,
        roughnessJitter: -0.01,
        displacementMap: rock5Displacement,
        displacementScale: 0.007,
      },
      {
        key: "large-right",
        geometry: rock2HiMesh.geometry,
        material: rock2HiMesh.material,
        position: [6.1, -3.1, -3.3],
        rotation: [0.3, -0.6, 0.15],
        scale: 16.5,
        rotationSpeed: 0.0024,
        floatAmplitudeY: 0.095,
        floatPeriod: 15,
        driftAmplitudeX: 0.018,
        driftPeriod: 26,
        phaseOffset: Math.PI,
        colorTint: 0.94,
        roughnessJitter: 0.02,
        displacementMap: rock2Displacement,
        displacementScale: 0.018,
      },
      {
        key: "small-top-left",
        geometry: rock3Mesh.geometry,
        material: rock3Mesh.material,
        position: [-4.2, 3.0, -4.0],
        rotation: [0.6, 1.2, 0.3],
        scale: 3.51,
        rotationSpeed: 0.0048,
        floatAmplitudeY: 0.07,
        floatPeriod: 14,
        driftAmplitudeX: 0.03,
        driftPeriod: 19,
        phaseOffset: 0.8,
        colorTint: 1,
        roughnessJitter: 0,
      },
      {
        key: "small-top-right",
        geometry: rock1LOD2.geometry,
        material: rock1LOD0.material,
        position: [4.6, 2.9, -4.3],
        rotation: [2.1, 0.4, 1.6],
        scale: 3.04,
        rotationSpeed: 0.0055,
        floatAmplitudeY: 0.08,
        floatPeriod: 16,
        driftAmplitudeX: 0.034,
        driftPeriod: 21,
        phaseOffset: 2.6,
        colorTint: 0.95,
        roughnessJitter: 0.03,
      },
      {
        key: "small-lower-left",
        geometry: rock2Mesh.geometry,
        material: rock2Mesh.material,
        position: [-2.3, -3.0, -4.6],
        rotation: [0.9, 3.0, 0.5],
        scale: 2.46,
        rotationSpeed: 0.0052,
        floatAmplitudeY: 0.065,
        floatPeriod: 12.5,
        driftAmplitudeX: 0.026,
        driftPeriod: 17,
        phaseOffset: 4.4,
        colorTint: 1.05,
        roughnessJitter: -0.02,
      },
      {
        key: "small-lower-right",
        geometry: rock1LOD3.geometry,
        material: rock1LOD0.material,
        position: [2.6, -3.1, -4.8],
        rotation: [1.7, 2.0, 2.4],
        scale: 2.11,
        rotationSpeed: 0.006,
        floatAmplitudeY: 0.085,
        floatPeriod: 15.5,
        driftAmplitudeX: 0.032,
        driftPeriod: 22,
        phaseOffset: 5.9,
        colorTint: 0.98,
        roughnessJitter: 0.02,
      },
    ],
    [rock5HiLOD0, rock5Displacement, rock2HiMesh, rock2Displacement, rock3Mesh, rock1LOD2, rock1LOD0, rock2Mesh, rock1LOD3],
  );

  const mediumPool = useMemo<ScatterPoolEntry[]>(
    () => [
      { geometry: rock1LOD0.geometry, material: rock1LOD0.material },
      { geometry: rock2Mesh.geometry, material: rock2Mesh.material },
      { geometry: rock3Mesh.geometry, material: rock3Mesh.material },
    ],
    [rock1LOD0, rock2Mesh, rock3Mesh],
  );
  const mediumSpecs = useMemo(
    () =>
      buildScatterSpecs({
        count: 14,
        pool: mediumPool,
        xRange: [-9.5, 9.5],
        yRange: [-5.8, 5.8],
        zRange: [-6, -9.5],
        scaleRange: [1.1, 2.0],
        floatAmpRange: [0.05, 0.09],
        floatPeriodRange: [11, 18],
        driftAmpRange: [0.02, 0.035],
        driftPeriodRange: [18, 28],
        rotationSpeedRange: [0.002, 0.005],
        keyPrefix: "medium",
        edgeBias: true,
      }),
    [mediumPool],
  );

  const smallPool = useMemo<ScatterPoolEntry[]>(
    () => [
      { geometry: rock1LOD2.geometry, material: rock1LOD0.material },
      { geometry: rock1LOD3.geometry, material: rock1LOD0.material },
      { geometry: rock2Mesh.geometry, material: rock2Mesh.material },
      { geometry: rock3Mesh.geometry, material: rock3Mesh.material },
    ],
    [rock1LOD2, rock1LOD3, rock1LOD0, rock2Mesh, rock3Mesh],
  );
  const smallSpecs = useMemo(
    () =>
      buildScatterSpecs({
        count: 58,
        pool: smallPool,
        xRange: [-11.5, 11.5],
        yRange: [-6.8, 6.8],
        zRange: [-9, -15],
        scaleRange: [0.5, 1.1],
        floatAmpRange: [0.04, 0.08],
        floatPeriodRange: [10, 17],
        driftAmpRange: [0.015, 0.03],
        driftPeriodRange: [15, 24],
        rotationSpeedRange: [0.003, 0.007],
        keyPrefix: "small",
        edgeBias: true,
      }),
    [smallPool],
  );

  return (
    <>
      {specs.map((spec) => (
        <Asteroid key={spec.key} spec={spec} />
      ))}
      {mediumSpecs.map((spec) => (
        <Asteroid key={spec.key} spec={spec} />
      ))}
      {smallSpecs.map((spec) => (
        <Asteroid key={spec.key} spec={spec} />
      ))}
      <MicroAsteroids geometry={rock1LOD3.geometry} material={rock1LOD0.material} />
    </>
  );
}

const STAR_VERTEX_SHADER = /* glsl */ `
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
const STAR_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    if (dot(centered, centered) > 0.25) discard;
    gl_FragColor = vec4(vColor * vTwinkle, 1.0);
  }
`;

interface StarLayerProps {
  /** World-space Z depth (negative = further from camera). */
  depth: number;
  count: number;
  /** Point sizes in CSS px for the three size buckets (~90% / ~9% / ~1%). */
  baseSize: number;
  midSize: number;
  brightSize: number;
  /** Target apparent drift speed in CSS px/sec, left → right. */
  speedPxPerSec: number;
}

interface StarLayerData {
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  width: number;
  speed: number;
}

function StarLayer({ depth, count, baseSize, midSize, brightSize, speedPxPerSec }: StarLayerProps) {
  const group = useRef<THREE.Group>(null);
  const tileA = useRef<THREE.Points>(null);
  const tileB = useRef<THREE.Points>(null);
  const dataRef = useRef<StarLayerData | null>(null);

  useFrame((state, delta) => {
    if (!dataRef.current) {
      const { camera, viewport, size, gl } = state;
      const vp = viewport.getCurrentViewport(camera, [0, 0, depth]);
      const width = vp.width * 1.35;
      const height = vp.height * 1.35;
      const pxPerUnit = size.width / vp.width;
      const speed = speedPxPerSec / pxPerUnit;

      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const twinklePhases = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * width;
        positions[i * 3 + 1] = (Math.random() - 0.5) * height;
        positions[i * 3 + 2] = depth + (Math.random() - 0.5) * 2;

        const colorRoll = Math.random();
        let r = 0.95, g = 0.96, b = 1.0;
        if (colorRoll < 0.05) {
          r = 0.75; g = 0.83; b = 1.0;
        } else if (colorRoll < 0.08) {
          r = 1.0; g = 0.92; b = 0.76;
        }
        colors[i * 3 + 0] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;

        const sizeRoll = Math.random();
        sizes[i] = sizeRoll < 0.01 ? brightSize : sizeRoll < 0.1 ? midSize : baseSize;

        twinklePhases[i] = Math.random();
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("aTwinklePhase", new THREE.BufferAttribute(twinklePhases, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: { uPixelRatio: { value: gl.getPixelRatio() }, uTime: { value: 0 } },
        vertexShader: STAR_VERTEX_SHADER,
        fragmentShader: STAR_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
      });

      dataRef.current = { geometry, material, width, speed };
      if (tileA.current) {
        tileA.current.geometry = geometry;
        tileA.current.material = material;
      }
      if (tileB.current) {
        tileB.current.geometry = geometry;
        tileB.current.material = material;
        tileB.current.position.x = width;
      }
    }

    const data = dataRef.current;
    const g = group.current;
    if (!data || !g) return;
    g.position.x = (g.position.x + data.speed * delta) % data.width;
    data.material.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  useEffect(() => {
    return () => {
      dataRef.current?.geometry.dispose();
      dataRef.current?.material.dispose();
    };
  }, []);

  return (
    <group ref={group}>
      <points ref={tileA} />
      <points ref={tileB} />
    </group>
  );
}
const MemoStarLayer = memo(StarLayer);

function Starfield() {
  return (
    <>
      <MemoStarLayer depth={-40} count={2200} baseSize={1.0} midSize={1.4} brightSize={1.8} speedPxPerSec={0.5} />
      <MemoStarLayer depth={-25} count={900} baseSize={1.2} midSize={1.7} brightSize={2.3} speedPxPerSec={0.8} />
      <MemoStarLayer depth={-15} count={220} baseSize={1.6} midSize={2.1} brightSize={3.0} speedPxPerSec={1.2} />
    </>
  );
}
const MemoStarfield = memo(Starfield);


const AURORA_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const AURORA_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uSpeed;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv - 0.5;
    float t = uTime * uSpeed;
    vec2 c1 = vec2(sin(t * 0.7) * 0.18, cos(t * 0.5) * 0.12);
    vec2 c2 = vec2(sin(t * 0.42 + 2.1) * 0.22, cos(t * 0.6 + 1.3) * 0.16);
    float d1 = length(uv - c1);
    float d2 = length(uv - c2);
    float band = smoothstep(0.5, 0.0, d1) * 0.65 + smoothstep(0.42, 0.0, d2) * 0.55;
    gl_FragColor = vec4(uColor, band * uOpacity);
  }
`;

interface AuroraData {
  geometry: THREE.PlaneGeometry;
  material: THREE.ShaderMaterial;
}

function Aurora({
  position,
  scale,
  scaleX,
  scaleY,
  rotationZ,
  color,
  opacity,
  speed,
}: {
  position: [number, number, number];
  /** Uniform fallback when scaleX/scaleY are omitted. */
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  /** Radians — tilts the elongated band diagonally across the frame. */
  rotationZ?: number;
  color: string;
  opacity: number;
  speed: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const dataRef = useRef<AuroraData | null>(null);

  useFrame(({ clock }) => {
    if (!dataRef.current) {
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: opacity },
          uSpeed: { value: speed },
        },
        vertexShader: AURORA_VERTEX_SHADER,
        fragmentShader: AURORA_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      dataRef.current = { geometry, material };
      if (mesh.current) {
        mesh.current.geometry = geometry;
        mesh.current.material = material;
      }
    }
    dataRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
  });

  useEffect(() => {
    return () => {
      dataRef.current?.geometry.dispose();
      dataRef.current?.material.dispose();
    };
  }, []);

  return (
    <mesh
      ref={mesh}
      position={position}
      scale={[scaleX ?? scale ?? 1, scaleY ?? scale ?? 1, 1]}
      rotation={[0, 0, rotationZ ?? 0]}
    />
  );
}
const MemoAurora = memo(Aurora);

function createRadialGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(210,225,255,1)");
  gradient.addColorStop(0.35, "rgba(130,175,255,0.55)");
  gradient.addColorStop(1, "rgba(60,120,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface CenterGlowData {
  texture: THREE.CanvasTexture;
  roundMaterial: THREE.SpriteMaterial;
  shaftMaterial: THREE.SpriteMaterial;
}

function CenterGlow({ position }: { position: [number, number, number] }) {
  const round = useRef<THREE.Sprite>(null);
  const shaft = useRef<THREE.Sprite>(null);
  const dataRef = useRef<CenterGlowData | null>(null);

  useFrame(({ clock }) => {
    if (!dataRef.current) {
      const texture = createRadialGlowTexture();
      const roundMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.16 });
      const shaftMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.07 });
      dataRef.current = { texture, roundMaterial, shaftMaterial };
      if (round.current) round.current.material = roundMaterial;
      if (shaft.current) shaft.current.material = shaftMaterial;
    }
    const t = clock.getElapsedTime();
    const breathe = 0.85 + Math.sin(t * 0.15) * 0.15;
    dataRef.current.roundMaterial.opacity = 0.16 * breathe;
    dataRef.current.shaftMaterial.opacity = 0.07 * breathe;
  });

  useEffect(() => {
    return () => {
      dataRef.current?.texture.dispose();
      dataRef.current?.roundMaterial.dispose();
      dataRef.current?.shaftMaterial.dispose();
    };
  }, []);

  return (
    <group position={position}>
      <sprite ref={round} scale={[5, 5, 1]} />
      <sprite ref={shaft} scale={[2.2, 8, 1]} />
    </group>
  );
}

const RADAR_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const RADAR_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float angle = atan(uv.y, uv.x);
    float trail = angle > 0.0 ? 0.0 : clamp(1.0 + angle / (3.14159265 * 0.35), 0.0, 1.0);
    float radial = smoothstep(0.5, 0.08, dist);
    float edge = smoothstep(0.05, 0.0, abs(angle)) * 1.6;
    gl_FragColor = vec4(uColor, (trail + edge) * radial * uOpacity);
  }
`;
const RADAR_PERIOD_S = 18;

interface RadarData {
  geometry: THREE.PlaneGeometry;
  material: THREE.ShaderMaterial;
}

function RadarSweep({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  const dataRef = useRef<RadarData | null>(null);

  useFrame(({ clock }) => {
    if (!dataRef.current) {
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color("#6fa8ff") }, uOpacity: { value: 0.22 } },
        vertexShader: RADAR_VERTEX_SHADER,
        fragmentShader: RADAR_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      dataRef.current = { geometry, material };
      if (mesh.current) {
        mesh.current.geometry = geometry;
        mesh.current.material = material;
      }
    }
    if (mesh.current) {
      mesh.current.rotation.z = -(clock.getElapsedTime() / RADAR_PERIOD_S) * Math.PI * 2;
    }
  });

  useEffect(() => {
    return () => {
      dataRef.current?.geometry.dispose();
      dataRef.current?.material.dispose();
    };
  }, []);

  return <mesh ref={mesh} position={position} scale={11} />;
}

const DUST_VERTEX_SHADER = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vSeed;
  void main() {
    vec3 pos = position;
    pos.x += sin(uTime * 0.05 + aSeed * 6.2831) * 0.7;
    pos.y += cos(uTime * 0.04 + aSeed * 3.14159) * 0.5;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (1.0 + aSeed * 7.0) * uPixelRatio;
    vSeed = aSeed;
  }
`;
const DUST_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float shape = smoothstep(0.5, 0.0, d);
    float twinkle = 0.55 + 0.45 * sin(uTime * 0.15 + vSeed * 12.0);
    gl_FragColor = vec4(0.75, 0.85, 1.0, shape * twinkle * 0.06);
  }
`;
const DUST_COUNT = 64;

interface DustData {
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
}

function Dust() {
  const points = useRef<THREE.Points>(null);
  const dataRef = useRef<DustData | null>(null);

  useFrame(({ clock, gl }) => {
    if (!dataRef.current) {
      const positions = new Float32Array(DUST_COUNT * 3);
      const seeds = new Float32Array(DUST_COUNT);
      for (let i = 0; i < DUST_COUNT; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = -2 - Math.random() * 6;
        seeds[i] = Math.random();
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      const material = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: gl.getPixelRatio() } },
        vertexShader: DUST_VERTEX_SHADER,
        fragmentShader: DUST_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
      });
      dataRef.current = { geometry, material };
      if (points.current) {
        points.current.geometry = geometry;
        points.current.material = material;
      }
    }
    dataRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
  });

  useEffect(() => {
    return () => {
      dataRef.current?.geometry.dispose();
      dataRef.current?.material.dispose();
    };
  }, []);

  return <points ref={points} />;
}

function Rig({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  useFrame(({ camera, clock }: RootState) => {
    const t = clock.getElapsedTime();
    const driftX = Math.sin(t * 0.03) * 0.06 + Math.sin(t * 0.011) * 0.03;
    const driftY = Math.cos(t * 0.024) * 0.04 + Math.cos(t * 0.009) * 0.025;
    const targetX = mouse.current.x * 0.22 + driftX;
    const targetY = mouse.current.y * 0.14 + driftY;
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, -4);
  });
  return null;
}

export default function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => setActive(!!entries[0]?.isIntersecting), {
      rootMargin: "200px 0px 200px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0 }}>
    <Canvas
      shadows={ASTEROIDS_ENABLED}
      frameloop={active ? "always" : "demand"}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 8], fov: 50 }}
      onCreated={({ gl }) => {
        // Without this, a lost WebGL context leaves the canvas permanently
        // black — the browser only attempts to restore a context whose loss
        // event was preventDefault()'d.
        const canvasEl = gl.domElement;
        canvasEl.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
        canvasEl.addEventListener("webglcontextrestored", () => gl.forceContextRestore?.(), false);
      }}
    >
      <ambientLight intensity={0.13} color="#2b4270" />
      <hemisphereLight args={["#fff3e2", "#141c34", 0.16]} />
      <directionalLight
        position={[6, 5, 6]}
        intensity={1.45}
        color="#fff3e2"
        castShadow={ASTEROIDS_ENABLED}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-8, -1, -1]} intensity={0.42} color="#3b82f6" />
      <pointLight position={[8, -1, -1]} intensity={0.4} color="#4d7fe0" />

      <MemoStarfield />

      <MemoAurora position={[0, 2.2, -14]} scaleX={17} scaleY={9} rotationZ={0.55} color="#5b8fff" opacity={0.11} speed={1} />
      <MemoAurora position={[-3, -0.5, -20]} scaleX={27} scaleY={13} rotationZ={0.5} color="#4d7fe0" opacity={0.065} speed={0.6} />
      <MemoAurora position={[4.2, -2.6, -24]} scaleX={23} scaleY={11} rotationZ={0.6} color="#6f9cff" opacity={0.05} speed={0.5} />

      <CenterGlow position={[0, -1.8, -3]} />

      <Dust />

      {ASTEROIDS_ENABLED && (
        <Suspense fallback={null}>
          <AsteroidField />
        </Suspense>
      )}
      <Rig mouse={mouse} />
    </Canvas>
    </div>
  );
}
