import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Cpu,
  Zap,
  Activity,
  Code2,
  Smartphone,
  Globe,
  Palette,
  Database,
  ShieldCheck,
  BrainCircuit,
  Cloud
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Points,
  PointMaterial,
  Ring,
  Sphere,
  PerspectiveCamera,
  Line,
  Html,
  Text,
  MeshTransmissionMaterial,
  Environment
} from "@react-three/drei";
import * as THREE from "three";
import { Logo } from "../ui/Logo";
import { SERVICES } from "../../constants/siteData";

interface HeroProps {
  onGetStartedClick: () => void;
}

const SPECIALTIES = [
  { name: "Custom Software", icon: Code2 },
  { name: "Web Application", icon: Globe },
  { name: "Mobile Development", icon: Smartphone },
  { name: "UI/UX Design", icon: Palette },
  { name: "AI & ML", icon: BrainCircuit },
  { name: "Cloud Solutions", icon: Cloud },
  { name: "Cybersecurity", icon: ShieldCheck },
  { name: "Backend Systems", icon: Database },
];

const TICKER_REPEAT_COUNT = 3;

const ExpertiseTicker = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ pointerId: number | null; startX: number; startOffset: number }>({
    pointerId: null,
    startX: 0,
    startOffset: 0,
  });
  const autoScrollFrameRef = useRef<number | null>(null);
  const segmentWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const tickerItems = useMemo(
    () =>
      Array.from({ length: TICKER_REPEAT_COUNT }, (_, copyIndex) =>
        SPECIALTIES.map((item, itemIndex) => ({
          ...item,
          key: `${copyIndex}-${itemIndex}-${item.name}`,
        })),
      ).flat(),
    [],
  );

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;

    if (!container || !track) {
      return;
    }

    const applyOffset = () => {
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    };

    const normalizeOffset = () => {
      const segmentWidth = segmentWidthRef.current;

      if (segmentWidth) {
        while (offsetRef.current <= -segmentWidth * 2) {
          offsetRef.current += segmentWidth;
        }

        while (offsetRef.current >= 0) {
          offsetRef.current -= segmentWidth;
        }
      }

      applyOffset();
    };

    const measure = () => {
      segmentWidthRef.current = track.scrollWidth / TICKER_REPEAT_COUNT;
      offsetRef.current = -segmentWidthRef.current;
      applyOffset();
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    resizeObserver.observe(container);
    resizeObserver.observe(track);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const step = () => {
      if (!isDragging && !isHovered && trackRef.current) {
        offsetRef.current -= 0.45;
        const segmentWidth = segmentWidthRef.current;

        if (segmentWidth && offsetRef.current <= -segmentWidth * 2) {
          offsetRef.current += segmentWidth;
        }

        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      autoScrollFrameRef.current = window.requestAnimationFrame(step);
    };

    autoScrollFrameRef.current = window.requestAnimationFrame(step);

    return () => {
      if (autoScrollFrameRef.current !== null) {
        window.cancelAnimationFrame(autoScrollFrameRef.current);
      }
    };
  }, [isDragging, isHovered]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetRef.current,
    };

    containerRef.current.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStateRef.current.pointerId !== event.pointerId || !trackRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStateRef.current.startX;
    offsetRef.current = dragStateRef.current.startOffset + deltaX;

    const segmentWidth = segmentWidthRef.current;
    if (segmentWidth) {
      while (offsetRef.current <= -segmentWidth * 2) {
        offsetRef.current += segmentWidth;
        dragStateRef.current.startOffset += segmentWidth;
      }

      while (offsetRef.current >= 0) {
        offsetRef.current -= segmentWidth;
        dragStateRef.current.startOffset -= segmentWidth;
      }
    }

    trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    containerRef.current?.releasePointerCapture(event.pointerId);
    dragStateRef.current.pointerId = null;
    setIsDragging(false);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = containerRef.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    setCursorPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={(event) => {
        if (isDragging) {
          handlePointerUp(event);
        }
        setIsHovered(false);
      }}
      onMouseEnter={(event) => {
        setIsHovered(true);
        handleMouseMove(event);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      style={{ touchAction: "pan-x" }}
      aria-label="Expertise specialties ticker"
    >
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
      <div
        className={`pointer-events-none absolute z-20 transition-opacity duration-150 ${isHovered ? "opacity-100" : "opacity-0"}`}
        style={{
          left: `${cursorPosition.x + 14}px`,
          top: `${cursorPosition.y - 28}px`,
          transform: "translate3d(0,0,0)",
        }}
      >
        <div className="rounded-full border border-maroon-800/15 bg-white/92 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-maroon-900 shadow-sm backdrop-blur-sm">
          Drag
        </div>
      </div>

      <div ref={trackRef} className="flex w-max gap-12 items-center py-4 whitespace-nowrap pr-12 will-change-transform">
        {tickerItems.map((item) => (
          <div key={item.key} className="flex items-center gap-4 group/item cursor-default">
            <div className="relative">
              <div className="absolute -inset-2 bg-maroon-800/0 rounded-xl group-hover/item:bg-maroon-800/5 transition-all duration-300" />
              <div className="relative p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-maroon-800 group-hover/item:bg-maroon-800 group-hover/item:text-white group-hover/item:scale-110 group-hover/item:shadow-lg group-hover/item:shadow-maroon-800/20 transition-all duration-300">
                <item.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-slate-800 tracking-tight group-hover/item:text-maroon-800 transition-colors">
                {item.name}
              </span>
              <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
                Nexyra Specialized
              </span>
            </div>

            <div className="ml-4 w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/item:bg-maroon-800/20 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================
   🎓 Services Orbit
 ========================= */
const ServicesOrbit = ({
  onServiceClick,
  isVisible,
}: {
  onServiceClick: (slug: string) => void;
  isVisible: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const revealProgressRef = useRef(0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const targetProgress = isVisible ? 1 : 0;
    revealProgressRef.current = THREE.MathUtils.lerp(revealProgressRef.current, targetProgress, 0.08);

    if (groupRef.current) {
      const revealScale = 0.82 + revealProgressRef.current * 0.18;
      groupRef.current.scale.setScalar(revealScale);
      groupRef.current.position.y = (1 - revealProgressRef.current) * -0.7;
      groupRef.current.rotation.y = t * 0.12;
      groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.1;
    }
  });

  // Calculate icons positions once
  const icons = useMemo(() => {
    return SERVICES.map((service, i) => {
      const phi = Math.acos(-1 + (2 * i) / SERVICES.length);
      const theta = Math.sqrt(SERVICES.length * Math.PI) * phi;
      const radius = 6.4;

      return {
        ...service,
        pos: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ] as [number, number, number]
      };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* Subtle Outer Shell indicating the "Ball" shape */}
      <mesh>
        <sphereGeometry args={[7.2, 32, 24]} />
        <meshBasicMaterial color="#7a1a2a" wireframe transparent opacity={0.02} />
      </mesh>

      {icons.map((service, i) => {
        const Icon = service.icon;

        return (
          <group key={service.slug} position={service.pos}>
            <Html
              distanceFactor={8}
              position={[0, 0, 0]}
              center
            >
              <motion.div
                initial={false}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  scale: isVisible ? 1 : 0.72,
                  y: isVisible ? 0 : 18,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="relative group/icon pointer-events-none select-none">
                  <div className="absolute -inset-2 bg-maroon-800/10 rounded-full blur-md opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                  <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-maroon-950">
                    <Icon className="w-5 h-5 md:w-7 md:h-7" />
                  </div>
                </div>
                <button
                  onClick={() => onServiceClick(service.slug)}
                  className="px-2.5 py-1 bg-slate-900/90 hover:bg-maroon-900 backdrop-blur-md rounded-md border border-white/10 shadow-lg transition-all transform active:scale-95 pointer-events-auto cursor-pointer group/btn"
                >
                  <p className="text-[7px] md:text-[9px] font-bold text-white uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5">
                    {service.title}
                    <ArrowUpRight className="w-2 h-2 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </p>
                </button>
              </motion.div>
            </Html>

            {/* Connection line to center - Pulsing */}
            <Line
              points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(-service.pos[0], -service.pos[1], -service.pos[2])]}
              color="#7a1a2a"
              lineWidth={0.5}
              transparent
              opacity={0.15}
            />
          </group>
        );
      })}

      {/* Decorative Network Connections between random icons to enhance sphere form */}
      {icons.slice(0, 8).map((icon, i) => {
        const nextIcon = icons[(i + 3) % icons.length];
        return (
          <Line
            key={i}
            points={[new THREE.Vector3(...icon.pos), new THREE.Vector3(...nextIcon.pos)]}
            color="#7a1a2a"
            lineWidth={0.2}
            transparent
            opacity={0.04}
          />
        );
      })}
    </group>
  );
};

/* =========================
   📦 Software Icon Core
========================= */
const SoftwareIconCore = () => {
  const techRef = useRef<THREE.Group>(null!);
  const innerCoreRef = useRef<THREE.Group>(null!);
  const codeLinesRef = useRef<THREE.Group>(null!);

  // Create "Code" particles
  const codeParts = useMemo(() => {
    return Array.from({ length: 25 }).map(() => ({
      pos: [
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      ],
      size: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 1.5 + 0.8
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (techRef.current) {
      techRef.current.rotation.y = t * 0.35;
      techRef.current.rotation.z = Math.sin(t * 0.2) * 0.2;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.7;
      innerCoreRef.current.rotation.x = t * 0.4;
      innerCoreRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
    }

    // Animate code particles
    if (codeLinesRef.current) {
      codeLinesRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(t * codeParts[i].speed) * 0.006;
        child.rotation.z = t * 0.15;
      });
    }
  });

  return (
    <group scale={[1.15, 1.15, 1.15]}>
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
        {/* PHYSICAL BALL GLASS SHELL - HIGH REALISM (Double Layer) */}
        <mesh>
          <sphereGeometry args={[4.5, 64, 64]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            thickness={2}
            chromaticAberration={0.15}
            anisotropy={0.5}
            distortion={0.3}
            distortionScale={0.5}
            temporalDistortion={0.1}
            clearcoat={1}
            attenuationDistance={1}
            attenuationColor="#7a1a2a"
            color="#ffffff"
            transparent
            opacity={0.9}
            roughness={0}
            metalness={0.05}
          />
        </mesh>

        {/* INNER REFRACTION LAYER */}
        <mesh scale={0.96}>
          <sphereGeometry args={[4.5, 32, 24]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.5}
            chromaticAberration={0.02}
            distortion={0.1}
            color="#ffeef0"
            opacity={0.3}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 12]} />
          <meshBasicMaterial
            color="#7a1a2a"
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
            map={new THREE.TextureLoader().load('https://raw.githubusercontent.com/pmndrs/drei-assets/master/light-halo.png')}
          />
        </mesh>

        {/* SECONDARY GLOWING SHELL */}
        <mesh>
          <sphereGeometry args={[4.55, 32, 24]} />
          <meshBasicMaterial color="#7a1a2a" wireframe transparent opacity={0.02} />
        </mesh>

        <group ref={techRef}>
          {/* DIGITAL PROCESSOR CORE */}
          <group>
            {/* The "Chip" Body */}
            <mesh>
              <boxGeometry args={[1.6, 1.6, 0.4]} />
              <meshStandardMaterial
                color="#0a0002"
                roughness={0.1}
                metalness={1}
                emissive="#7a1a2a"
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* Chip Traces / Details */}
            {Array.from({ length: 8 }).map((_, i) => (
              <group key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
                <mesh position={[0.9, 0, 0]}>
                  <boxGeometry args={[0.2, 0.05, 0.1]} />
                  <meshStandardMaterial color="#7a1a2a" emissive="#ff3355" emissiveIntensity={2} />
                </mesh>
              </group>
            ))}

            {/* Glowing Core Heart */}
            <mesh position={[0, 0, 0.21]}>
              <planeGeometry args={[0.8, 0.8]} />
              <meshBasicMaterial color="#ff3355" transparent opacity={0.8} />
            </mesh>
          </group>

          {/* LAYERED DATA RINGS */}
          <group ref={innerCoreRef}>
            {/* Horizontal Data Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2.5, 0.05, 16, 100]} />
              <meshStandardMaterial color="#7a1a2a" metalness={1} roughness={0} transparent opacity={0.6} />
            </mesh>

            {/* Inner Glowing Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.8, 0.02, 16, 100]} />
              <meshBasicMaterial color="#ff3355" transparent opacity={0.4} />
            </mesh>

            {/* Vertical Spinning Frames */}
            {[0, Math.PI / 2].map((rot, i) => (
              <mesh key={i} rotation={[0, rot, 0]}>
                <torusGeometry args={[3.2, 0.02, 4, 4]} />
                <meshStandardMaterial color="#7a1a2a" metalness={1} roughness={0.2} transparent opacity={0.3} />
              </mesh>
            ))}
          </group>

          {/* FLOATING DATA BLOCKS */}
          <group ref={codeLinesRef}>
            {codeParts.map((item, i) => (
              <mesh key={i} position={item.pos as [number, number, number]}>
                <boxGeometry args={[item.size * 0.4, item.size * 0.4, 0.05]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#7a1a2a"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            ))}
          </group>
        </group>

        {/* CENTER LOGO & GLOW */}
        <group position={[0, 0, 0]}>
          <mesh>
            <circleGeometry args={[1.5, 32]} />
            <meshBasicMaterial color="#7a1a2a" transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
          <Html transform distanceFactor={2.5} className="pointer-events-none select-none">
            <div className="flex items-center justify-center w-36 h-36 opacity-100 filter drop-shadow-[0_0_30px_rgba(122,26,42,0.8)]">
              <Logo className="w-full h-full text-maroon-800" />
            </div>
          </Html>
        </group>
      </Float>
    </group>
  );
};

const OrbitingRing = ({ index }: { index: number }) => {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * (0.2 + index * 0.1);
    ref.current.rotation.y = t * (0.1 + index * 0.05);
  });

  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2 + index * 0.4, 0.02, 16, 100]} />
        <meshBasicMaterial color="#7a1a2a" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

/* =========================
   🔵 HUD Digital Base
========================= */
const HudBase = () => {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = -t * 0.2;
  });

  return (
    <group position={[0, -3.5, 0]} rotation={[-Math.PI / 2.2, 0, 0]}>
      {/* Rotating HUD Rings */}
      <group ref={ref}>
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i} position={[0, 0.05 * (i + 1), 0]}>
            <ringGeometry args={[2.5 + i * 0.3, 2.52 + i * 0.3, 64]} />
            <meshBasicMaterial
              color="#5a0f1c"
              transparent
              opacity={0.3 - i * 0.06}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Connection Streams (Pulsing Lines) */}
      <ConnectionLines />
    </group>
  );
};

const ConnectionLines = () => {
  const lineCount = 8;
  const points = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const x = Math.cos(angle) * 1.5;
      const z = Math.sin(angle) * 1.5;
      pairs.push([
        new THREE.Vector3(x, 0, z),
        new THREE.Vector3(x * 0.5, 3.5, z * 0.5) // Connect towards brain position
      ]);
    }
    return pairs;
  }, []);

  return (
    <group position={[0, 0.2, 0]}>
      {points.map((p, i) => (
        <Line
          key={i}
          points={p}
          color="#7a1a2a"
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      ))}
    </group>
  );
};

/* =========================
   ✨ Ambient Particles
========================= */
const ParticleCloud = () => {
  const count = 400;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.03;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.05;

    // Subtle pulse
    const s = 1 + Math.sin(t * 0.5) * 0.05;
    ref.current.scale.set(s, s, s);
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#7a1a2a"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

/* =========================
   🌐 3D Scene Wrapper
========================= */
const ScienceScene = ({ onServiceClick }: { onServiceClick: (slug: string) => void }) => {
  const [zoom, setZoom] = React.useState(14);
  const [fov, setFov] = React.useState(45);
  const [yOffset, setYOffset] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Delay mounting heavy WebGL to guarantee a smooth preloader experience
    const timer = setTimeout(() => setMounted(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setZoom(55); // Move camera further back for mobile
        setFov(45);
        setYOffset(0);
      } else if (window.innerWidth < 1024) {
        setZoom(42);
        setFov(45);
        setYOffset(0);
      } else {
        setZoom(30);
        setFov(40);
        setYOffset(0);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-full relative">
      {mounted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="absolute inset-0">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, zoom], fov: fov }}>
            <PerspectiveCamera makeDefault position={[0, yOffset, zoom]} fov={fov} rotation={[-Math.PI / 16, 0, 0]} />

            {/* Lights */}
            <ambientLight intensity={0.5} />
            <Environment preset="city" />
            <pointLight position={[10, 10, 10]} color="#7a1a2a" intensity={3} />
            <pointLight position={[-10, -5, 5]} color="#5a0f1c" intensity={2} />
            <spotLight
              position={[0, 15, 0]}
              intensity={5}
              penumbra={1}
              angle={0.5}
              color="#ffedef"
            />

            <SoftwareIconCore />
            <ServicesOrbit onServiceClick={onServiceClick} isVisible={mounted} />
            <HudBase />
            <ParticleCloud />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
              rotateSpeed={0.5}
            />
          </Canvas>
        </motion.div>
      )}
    </div>
  );
};

/* =========================
   🎯 MAIN HERO COMPONENT
========================= */
export const Hero = ({ onGetStartedClick }: HeroProps) => {
  const [selectedService, setSelectedService] = React.useState<string | null>(null);

  const serviceDetails = useMemo(() => {
    if (!selectedService) return null;
    return SERVICES.find(s => s.slug === selectedService);
  }, [selectedService]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 pb-8 lg:pt-20 lg:pb-0 overflow-hidden bg-white"
    >
      {/* Service Details Modal */}
      {serviceDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedService(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-white shadow-2xl overflow-hidden"
          >
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-maroon-800/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-maroon-800/10 rounded-full -ml-16 -mb-16 blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-maroon-800 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-maroon-800/20 shrink-0">
                  <serviceDetails.icon className="w-6 h-6 md:w-9 md:h-9" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-950 tracking-tight leading-tight">{serviceDetails.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-maroon-800">NexyraSoft Solutions</span>
                </div>
              </div>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8">
                {serviceDetails.description}
              </p>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-wider"
                >
                  Close
                </button>
                <div className="flex gap-2">
                  <div className="w-8 h-1.5 rounded-full bg-maroon-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-maroon-800/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-maroon-800/20" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Background Glows removed for full white appearance */}

      <div className="container mx-auto px-6 relative z-10 flex flex-col justify-center gap-4 md:gap-6 lg:gap-0">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-4 lg:gap-8 items-center">

          {/* LEFT: TEXT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left flex flex-col justify-center order-1 mt-8 lg:mt-0"
          >
            <div className="flex flex-col gap-2">
              <h1 className="mb-3 text-[2rem] sm:text-[2.5rem] md:text-[3.2rem] lg:text-[4.1rem] xl:text-[5rem] font-display font-bold tracking-[-0.04em] leading-[0.95] text-maroon-950">
                <span className="block">Let&apos;s step into the</span>
                <span className="block bg-gradient-to-r from-maroon-950 via-maroon-800 to-maroon-600 bg-clip-text text-transparent">
                  advanced world
                </span>
                <span className="mt-1 block text-maroon-900">
                  with{" "}
                  <span className="relative inline-flex items-center">
                    <span className="absolute inset-x-1 bottom-1 h-3 rounded-full bg-maroon-200/70 blur-sm" />
                    <span className="relative text-maroon-800">NexyraSoft</span>
                  </span>
                </span>
              </h1>
            </div>

            <p className="text-[10px] sm:text-[11px] md:text-xs text-black mb-6 mt-4 max-w-md leading-relaxed font-medium">
              Transforming Ideas into Powerful Digital Experiences. We build smart, scalable, and impactful solutions for the next generation of businesses.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button
                onClick={onGetStartedClick}
                className="group relative z-20 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-slate-900 text-white text-[10px] sm:text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-maroon-900 transition-all shadow-xl shadow-slate-900/10"
              >
                Get Started
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT: 3D CANVAS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[450px] sm:h-[600px] md:h-[700px] lg:h-[750px] xl:h-[850px] w-full order-2 lg:order-2 lg:mt-0"
          >
            <div className="relative w-full h-full flex items-center justify-center -mx-4 sm:mx-0">
              {/* Decorative Glow removed for full white appearance */}
              <ScienceScene onServiceClick={(slug) => setSelectedService(slug)} />
            </div>
          </motion.div>
        </div>

        {/* BOTTOM: SPECIALIZED IN TICKER - ENHANCED DESIGN */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 lg:mt-0 relative"
        >
          {/* Decorative Top Border Bridge */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-maroon-800/10 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-maroon-800/20" />

          <div className="flex flex-col lg:flex-row items-center gap-8 py-10">
            {/* Enhanced Label */}
            <div className="shrink-0 relative group">
              <div className="absolute -inset-1 bg-maroon-800/5 rounded-full blur-sm group-hover:bg-maroon-800/10 transition-all" />
              <div className="relative flex items-center gap-3 px-5 py-2.5 rounded-full border border-maroon-800/10 bg-white/50 backdrop-blur-md shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-maroon-950">Expertise</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-maroon-800 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-maroon-800/30 animate-pulse delay-75" />
                </div>
              </div>
            </div>

            <div className="w-full relative group/ticker">
              <ExpertiseTicker />
            </div>
          </div>

          {/* Decorative Bottom Shadow */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-maroon-800/5 to-transparent blur-sm" />
        </motion.div>
      </div>
    </section>
  );
};
