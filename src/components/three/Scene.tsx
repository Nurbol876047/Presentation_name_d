"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, type ReactNode } from "react";
import {
  AGE_GROUPS,
  FERTILITY,
  MEDIAN_AGE,
  REGION_URBAN,
  EDUCATION_FIELDS,
  LIFE_EXPECTANCY_WORLD,
  PROJECTION,
  RECOMMENDATIONS,
} from "@/data/content";

export type SceneProps = { slide: number };

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const smooth = (dt: number, speed = 6) => 1 - Math.exp(-speed * dt);

/* vivid, non-monochrome palette — no muted navy, no plain platonic solids */
const GOLD = "#FFD23F";
const CYAN = "#00E5FF";
const PINK = "#FF2E9F";
const LIME = "#B6FF3B";
const VIOLET = "#8B5CF6";
const ORANGE = "#FF7A1A";
const PALETTE = [GOLD, CYAN, PINK, LIME, VIOLET, ORANGE];

function useLayout() {
  const { viewport } = useThree();
  const narrow = viewport.width < 7.5;
  return {
    narrow,
    w: viewport.width,
    h: viewport.height,
    right: narrow ? 0 : viewport.width * 0.27,
    left: narrow ? 0 : -viewport.width * 0.27,
  };
}

type AppearProps = {
  children: ReactNode;
  position: [number, number, number];
  scale?: number;
  parallax?: number;
};

function Appear({ children, position, scale = 1, parallax = 0.14 }: AppearProps) {
  const ref = useRef<THREE.Group>(null);
  const cur = useRef({ s: 0, x: position[0], y: position[1], z: position[2] });

  useFrame(({ pointer }, dt) => {
    const g = ref.current;
    if (!g) return;
    const c = cur.current;
    const k = smooth(dt, 5);
    c.s += (scale - c.s) * k;
    c.x += (position[0] - c.x) * k;
    c.y += (position[1] - c.y) * k;
    c.z += (position[2] - c.z) * k;
    g.scale.setScalar(c.s);
    g.position.set(c.x, c.y, c.z);
    g.rotation.x += (-pointer.y * parallax - g.rotation.x) * smooth(dt, 3);
    g.rotation.y += (pointer.x * parallax - g.rotation.y) * smooth(dt, 3);
  });

  return <group ref={ref}>{children}</group>;
}

function Spin({ children, speed = 0.2, axis = "y" }: { children: ReactNode; speed?: number; axis?: "x" | "y" | "z" }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation[axis] += dt * speed;
  });
  return <group ref={ref}>{children}</group>;
}

/** a faceted "gem" spike — two pyramids base-to-base, used instead of plain boxes/cones */
function Gem({ color, glow = 0.6 }: { color: string; glow?: number }) {
  return (
    <mesh>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={glow} roughness={0.25} metalness={0.35} flatShading />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* generic animated 3D bar chart — crystal spikes, not boxes            */
/* ------------------------------------------------------------------ */

type BarDatum = { value: number; color: string; highlight?: boolean };

function BarGroup3D({
  data,
  position,
  scale = 1,
  maxHeight = 2.7,
  gap = 0.5,
  width = 0.46,
}: {
  data: BarDatum[];
  position: [number, number, number];
  scale?: number;
  maxHeight?: number;
  gap?: number;
  width?: number;
}) {
  const maxVal = useMemo(() => Math.max(...data.map((d) => d.value)), [data]);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const cur = useRef<number[]>(data.map(() => 0));
  const totalW = (data.length - 1) * gap;

  useFrame(({ clock }, dt) => {
    const k = smooth(dt, 4.2);
    const t = clock.elapsedTime;
    data.forEach((d, i) => {
      const target = (d.value / maxVal) * maxHeight;
      cur.current[i] += (target - cur.current[i]) * k;
      const m = meshes.current[i];
      if (!m) return;
      const h = Math.max(0.05, cur.current[i]);
      m.scale.set(width, h, width);
      m.position.y = -maxHeight / 2 + h / 2;
      m.rotation.y = t * 0.5 + i;
    });
  });

  return (
    <Appear position={position} scale={scale} parallax={0.08}>
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.22}>
        {data.map((d, i) => (
          <mesh
            key={i}
            ref={(el) => {
              meshes.current[i] = el;
            }}
            position={[i * gap - totalW / 2, -maxHeight / 2, 0]}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={d.color}
              emissive={d.color}
              emissiveIntensity={d.highlight ? 1.1 : 0.55}
              roughness={0.2}
              metalness={0.4}
              flatShading
            />
          </mesh>
        ))}
        <mesh position={[0, -maxHeight / 2 - 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[totalW / 2 + width, totalW / 2 + width * 2.4, 6]} />
          <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.3} transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      </Float>
    </Appear>
  );
}

/* ------------------------------------------------------------------ */
/* age structure — three orbiting crystal knots sized by share          */
/* ------------------------------------------------------------------ */

function AgeTower({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const GAP = 1.05;
  const totalH = (AGE_GROUPS.length - 1) * GAP;
  return (
    <Appear position={position} scale={scale}>
      <Spin speed={0.1}>
        {AGE_GROUPS.map((g, i) => {
          const r = 0.42 + Math.sqrt(g.share / 63) * 0.42;
          const y = i * GAP - totalH / 2;
          return (
            <Float key={g.label} speed={1.1 + i * 0.3} rotationIntensity={0.6} floatIntensity={0.5}>
              <mesh position={[0, y, 0]} rotation={[0.5, 0.3, 0]}>
                <torusKnotGeometry args={[r, r * 0.34, 110, 12, 2, 3]} />
                <meshStandardMaterial color={g.color} emissive={g.color} emissiveIntensity={0.65} roughness={0.2} metalness={0.45} />
              </mesh>
            </Float>
          );
        })}
      </Spin>
    </Appear>
  );
}

/* ------------------------------------------------------------------ */
/* migration flow — particles gliding from an aul to a city             */
/* ------------------------------------------------------------------ */

function MigrationFlow({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const N = 14;
  const particles = useRef<(THREE.Mesh | null)[]>([]);
  const curve = useMemo(
    () => new THREE.QuadraticBezierCurve3(new THREE.Vector3(-1.6, -0.6, 0), new THREE.Vector3(0, 0.95, 0.6), new THREE.Vector3(1.6, 0.3, 0)),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    for (let i = 0; i < N; i++) {
      const m = particles.current[i];
      if (!m) continue;
      const tt = (t * 0.12 + i / N) % 1;
      const p = curve.getPoint(tt);
      m.position.copy(p);
      const s = 0.5 + 0.5 * Math.sin(tt * Math.PI);
      m.scale.setScalar(0.5 + s * 0.7);
      m.rotation.x += 0.04;
      m.rotation.y += 0.03;
    }
  });

  return (
    <Appear position={position} scale={scale} parallax={0.1}>
      {/* aul — a small cluster of gold/pink gems */}
      <group position={[-1.7, -0.75, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[(i - 1) * 0.36, Math.abs(i - 1) * -0.05, 0]} rotation={[0.2, i, 0]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial color={i === 1 ? PINK : GOLD} emissive={i === 1 ? PINK : GOLD} emissiveIntensity={0.65} flatShading />
          </mesh>
        ))}
      </group>
      {/* city — a cluster of tall cyan/violet gem spikes */}
      <group position={[1.7, -0.55, 0]}>
        {[0.5, 0.9, 0.65, 1.15].map((h, i) => (
          <mesh key={i} position={[(i - 1.5) * 0.26, h / 2 - 0.4, 0]} scale={[0.5, h, 0.5]} rotation={[0, i, 0]}>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color={i % 2 ? CYAN : VIOLET} emissive={i % 2 ? CYAN : VIOLET} emissiveIntensity={0.6} flatShading />
          </mesh>
        ))}
      </group>
      {/* flow particles */}
      {Array.from({ length: N }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            particles.current[i] = el;
          }}
        >
          <tetrahedronGeometry args={[0.09, 0]} />
          <meshStandardMaterial color="#ffffff" emissive={LIME} emissiveIntensity={1} flatShading />
        </mesh>
      ))}
    </Appear>
  );
}

/* ------------------------------------------------------------------ */
/* disappearing villages — a grid of gems, some sinking away            */
/* ------------------------------------------------------------------ */

function VillageDissolve({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ROWS = 4;
  const COLS = 5;
  const items = useMemo(
    () =>
      Array.from({ length: ROWS * COLS }, (_, i) => ({
        x: (i % COLS) - (COLS - 1) / 2,
        z: Math.floor(i / COLS) - (ROWS - 1) / 2,
        fade: Math.random() < 0.35,
        phase: Math.random() * Math.PI * 2,
        color: PALETTE[i % PALETTE.length],
      })),
    []
  );
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    items.forEach((it, i) => {
      const m = meshes.current[i];
      const mat = mats.current[i];
      if (!m || !mat) return;
      m.rotation.y = t * 0.4 + it.phase;
      if (it.fade) {
        const cycle = (t * 0.25 + it.phase) % (Math.PI * 2);
        const drop = Math.max(0, Math.sin(cycle));
        m.position.y = -drop * 1.1;
        mat.opacity = 1 - drop;
      }
    });
  });

  return (
    <Appear position={position} scale={scale} parallax={0.08}>
      <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.18}>
        {items.map((it, i) => (
          <mesh
            key={i}
            position={[it.x * 0.55, 0, it.z * 0.55]}
            ref={(el) => {
              meshes.current[i] = el;
            }}
          >
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial
              ref={(el) => {
                mats.current[i] = el;
              }}
              color={it.fade ? PINK : it.color}
              emissive={it.fade ? PINK : it.color}
              emissiveIntensity={0.6}
              flatShading
              transparent
              opacity={1}
            />
          </mesh>
        ))}
      </Float>
    </Appear>
  );
}

/* ------------------------------------------------------------------ */
/* recommendation orbit — six gems circling a twisted crystal core      */
/* ------------------------------------------------------------------ */

function RecommendationOrbit({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const orbs = useRef<(THREE.Mesh | null)[]>([]);
  const rings = useRef<THREE.Group>(null);
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    RECOMMENDATIONS.forEach((_, i) => {
      const m = orbs.current[i];
      if (!m) return;
      const a = t * 0.32 + (i * Math.PI * 2) / RECOMMENDATIONS.length;
      const tilt = ((i % 3) - 1) * 0.45;
      m.position.set(Math.cos(a) * 2.1, Math.sin(a) * Math.sin(tilt) * 2.1 + Math.sin(t + i) * 0.12, Math.sin(a) * Math.cos(tilt) * 2.1);
      m.rotation.x += dt * 0.6;
      m.rotation.y += dt * 0.4;
    });
    if (rings.current) rings.current.rotation.y += dt * 0.1;
  });
  return (
    <Appear position={position} scale={scale}>
      <Spin speed={0.16}>
        <mesh>
          <torusKnotGeometry args={[0.85, 0.3, 140, 16, 2, 5]} />
          <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.75} roughness={0.2} metalness={0.5} />
        </mesh>
      </Spin>
      <group ref={rings}>
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[2.1, 0.012, 8, 140]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.45} />
        </mesh>
      </group>
      {RECOMMENDATIONS.map((r, i) => (
        <mesh
          key={r.n}
          ref={(el) => {
            orbs.current[i] = el;
          }}
        >
          <octahedronGeometry args={[0.26, 0]} />
          <meshStandardMaterial color={r.color} emissive={r.color} emissiveIntensity={0.85} roughness={0.2} metalness={0.35} flatShading />
        </mesh>
      ))}
    </Appear>
  );
}

/* ------------------------------------------------------------------ */
/* hero object for title / closing — a twisted crystal sun               */
/* ------------------------------------------------------------------ */

function Hero({ position, scale = 1, opacity = 1 }: { position: [number, number, number]; scale?: number; opacity?: number }) {
  const rays = useRef<(THREE.Mesh | null)[]>([]);
  const RAY_N = 8;
  const RAY_COLORS = [GOLD, CYAN, PINK, LIME, VIOLET, ORANGE, GOLD, CYAN];
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    for (let i = 0; i < RAY_N; i++) {
      const m = rays.current[i];
      if (!m) continue;
      const a = t * 0.4 + (i * Math.PI * 2) / RAY_N;
      m.position.set(Math.cos(a) * 2.3, Math.sin(a * 0.8) * 0.6, Math.sin(a) * 2.3);
      m.rotation.x += dt * 0.8;
      m.rotation.y += dt * 0.5;
    }
  });
  const o = opacity;
  return (
    <Appear position={position} scale={scale} parallax={0.18}>
      <Spin speed={0.12}>
        <mesh>
          <torusKnotGeometry args={[1, 0.34, 160, 20, 2, 5]} />
          <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.6} roughness={0.25} metalness={0.5} transparent opacity={o} />
        </mesh>
      </Spin>
      {Array.from({ length: RAY_N }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            rays.current[i] = el;
          }}
        >
          <octahedronGeometry args={[0.24, 0]} />
          <meshStandardMaterial color={RAY_COLORS[i]} emissive={RAY_COLORS[i]} emissiveIntensity={0.9} flatShading transparent opacity={o} />
        </mesh>
      ))}
    </Appear>
  );
}

/* ------------------------------------------------------------------ */
/* decorative crystal for photo / text slides                          */
/* ------------------------------------------------------------------ */

function Decorative({ position, scale = 1, opacity = 0.5 }: { position: [number, number, number]; scale?: number; opacity?: number }) {
  return (
    <Appear position={position} scale={scale} parallax={0.1}>
      <Spin speed={0.11}>
        <mesh>
          <torusKnotGeometry args={[1.3, 0.36, 140, 16, 3, 4]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.5} roughness={0.25} metalness={0.4} transparent opacity={opacity} />
        </mesh>
      </Spin>
    </Appear>
  );
}

/* ------------------------------------------------------------------ */
/* ambient decoration — colourful floating gems, no starfield           */
/* ------------------------------------------------------------------ */

function Ambient() {
  const L = useLayout();
  const specs = [
    { x: -0.47, y: 0.44, z: -4, s: 0.32, c: PINK, sp: 1 },
    { x: 0.46, y: -0.42, z: -5, s: 0.4, c: LIME, sp: 1.4 },
    { x: 0.35, y: 0.38, z: -7, s: 0.34, c: VIOLET, sp: 0.8 },
    { x: -0.4, y: -0.36, z: -6, s: 0.28, c: CYAN, sp: 1.2 },
  ];
  return (
    <>
      {specs.map((s, i) => (
        <Float key={i} speed={s.sp} rotationIntensity={1.2} floatIntensity={1.1}>
          <mesh position={[L.w * s.x, L.h * s.y, s.z]}>
            <octahedronGeometry args={[s.s, 0]} />
            <meshStandardMaterial color={s.c} emissive={s.c} emissiveIntensity={0.55} flatShading transparent opacity={0.55} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* slide → object mapping                                              */
/* ------------------------------------------------------------------ */

const FERTILITY_BARS: BarDatum[] = FERTILITY.map((d) => ({ value: d.value, color: d.color, highlight: d.highlight }));
const MEDIAN_AGE_BARS: BarDatum[] = MEDIAN_AGE.map((d) => ({ value: d.value, color: d.color }));
const REGION_BARS: BarDatum[] = REGION_URBAN.map((d) => ({ value: d.value, color: d.kind === "high" ? CYAN : PINK }));
const EDU_BARS: BarDatum[] = EDUCATION_FIELDS.map((d) => ({ value: d.share, color: d.color }));
const LIFE_BARS: BarDatum[] = LIFE_EXPECTANCY_WORLD.map((d) => ({ value: d.value, color: d.color }));
const PROJECTION_BARS: BarDatum[] = PROJECTION.map((d, i) => ({ value: d.value, color: i < 2 ? CYAN : GOLD, highlight: i === 3 }));
const OVERVIEW_BARS: BarDatum[] = [
  { value: 12899438, color: CYAN, highlight: true },
  { value: 7488373, color: GOLD },
];

function SlideObjects({ slide }: SceneProps) {
  const L = useLayout();
  const n = L.narrow;

  switch (slide) {
    case 0:
      return <Hero position={[0, n ? 2.2 : 1.9, -3.5]} scale={n ? 0.8 : 1.25} opacity={0.85} />;
    case 1:
      return <Hero position={[0, 0.2, -8]} scale={1.3} opacity={0.45} />;
    case 2:
      return <BarGroup3D data={OVERVIEW_BARS} position={[L.right * 1.5, n ? L.h * 0.2 : -0.1, -2]} scale={n ? 0.6 : 1} gap={0.7} width={0.5} />;
    case 3:
      return <AgeTower position={[L.right * 1.3, n ? L.h * 0.2 : -0.1, 0]} scale={n ? 0.5 : 0.9} />;
    case 4:
      return <BarGroup3D data={FERTILITY_BARS} position={[L.right * 1.05, n ? L.h * 0.22 : -0.1, 0]} scale={n ? 0.42 : 0.78} />;
    case 5:
      return <BarGroup3D data={MEDIAN_AGE_BARS} position={[L.right * 1.05, n ? L.h * 0.22 : -0.1, 0]} scale={n ? 0.42 : 0.78} gap={0.5} />;
    case 6:
      return <MigrationFlow position={[L.right * 0.95, n ? L.h * 0.2 : -0.1, 0]} scale={n ? 0.55 : 0.95} />;
    case 7:
      return <VillageDissolve position={[L.right * 1.2, n ? L.h * 0.2 : 0, 0]} scale={n ? 0.6 : 1} />;
    case 8:
      return <BarGroup3D data={REGION_BARS} position={[L.right * 1.05, n ? L.h * 0.22 : -0.1, 0]} scale={n ? 0.42 : 0.78} gap={0.5} />;
    case 9:
      return <BarGroup3D data={EDU_BARS} position={[L.right * 1.1, n ? L.h * 0.22 : -0.1, 0]} scale={n ? 0.45 : 0.85} gap={0.55} />;
    case 10:
      return <BarGroup3D data={LIFE_BARS} position={[L.right * 1.1, n ? L.h * 0.22 : -0.1, 0]} scale={n ? 0.45 : 0.85} gap={0.6} />;
    case 11:
    case 12:
      return <Decorative position={[0, 0, -9]} scale={1.6} opacity={0.55} />;
    case 13:
      return <BarGroup3D data={PROJECTION_BARS} position={[L.right * 1.1, n ? L.h * 0.22 : -0.1, 0]} scale={n ? 0.45 : 0.85} gap={0.55} />;
    case 14:
      return <RecommendationOrbit position={[0, n ? 1.6 : 0.4, -3]} scale={n ? 0.7 : 1.1} />;
    default:
      return <Hero position={[L.right * 1.3, 0.6, -10]} scale={1.6} opacity={0.4} />;
  }
}

/* ------------------------------------------------------------------ */
/* Canvas                                                              */
/* ------------------------------------------------------------------ */

export default function Scene({ slide }: SceneProps) {
  return (
    <div className="deck-canvas" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 6]} intensity={2.2} />
        <pointLight position={[-7, -3, 4]} color={CYAN} intensity={70} />
        <pointLight position={[7, 4, -2]} color={PINK} intensity={55} />
        <pointLight position={[0, -6, 3]} color={GOLD} intensity={40} />
        <Ambient />
        <SlideObjects slide={slide} />
      </Canvas>
    </div>
  );
}
