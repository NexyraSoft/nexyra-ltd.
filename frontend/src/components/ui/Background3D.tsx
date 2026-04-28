import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Reduced node count: 50 nodes instead of 100 eliminates 75% of frame work.
// O(n²) worst case drops from 4,950 pairs/frame → 1,225 pairs/frame,
// and connection checks are throttled to every 6 frames (~10 Hz).
const NODE_COUNT = 50;
const CONNECTION_LIMIT = 4; // max distance for a connection
const CONNECTION_CHECK_INTERVAL = 6; // frames between topology recalculations

const NeuralNetwork = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const { mouse } = useThree();

  const positions = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const velocities = useMemo(() => {
    const v = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      v[i * 3]     = (Math.random() - 0.5) * 0.01;
      v[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      v[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return v;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scrollY = window.scrollY;
    const geometry = pointsRef.current.geometry;
    const positionsAttr = geometry.attributes.position;

    for (let i = 0; i < NODE_COUNT; i++) {
      positionsAttr.array[i * 3]     += velocities[i * 3]     + Math.sin(t * 0.5 + i) * 0.002;
      positionsAttr.array[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(t * 0.5 + i) * 0.002;
      positionsAttr.array[i * 3 + 2] += velocities[i * 3 + 2];

      // Bounce back
      if (Math.abs(positionsAttr.array[i * 3])     > 10) velocities[i * 3]     *= -1;
      if (Math.abs(positionsAttr.array[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
      if (Math.abs(positionsAttr.array[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -1;
    }

    positionsAttr.needsUpdate = true;

    // Follow mouse subtly
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, mouse.x * 0.2, 0.1);
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, -mouse.y * 0.2, 0.1);

    // Parallax scroll
    pointsRef.current.position.y = scrollY * -0.002;
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#5a0f1c"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Throttled line connections — rechecked every CONNECTION_CHECK_INTERVAL frames */}
      <Lines positions={positions} />
    </group>
  );
};

const Lines = ({ positions }: { positions: Float32Array }) => {
  const lineRef = useRef<THREE.LineSegments>(null!);
  const frameCount = useRef(0);

  // Pre-allocate max possible line buffer: NODE_COUNT*(NODE_COUNT-1)/2 pairs × 2 endpoints × 3 coords
  const linePositions = useMemo(
    () => new Float32Array(NODE_COUNT * (NODE_COUNT - 1) * 3),
    [],
  );

  useFrame(() => {
    if (!lineRef.current) return;

    frameCount.current++;

    // Only rebuild connection topology every N frames — positions still track node movement
    // because the points share the same Float32Array reference via NeuralNetwork's useFrame.
    if (frameCount.current % CONNECTION_CHECK_INTERVAL !== 0) return;

    let vertexIndex = 0;
    const limitSq = CONNECTION_LIMIT * CONNECTION_LIMIT; // avoid sqrt per pair

    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = positions[i * 3]     - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz; // skip Math.sqrt

        if (distSq < limitSq) {
          linePositions[vertexIndex++] = positions[i * 3];
          linePositions[vertexIndex++] = positions[i * 3 + 1];
          linePositions[vertexIndex++] = positions[i * 3 + 2];
          linePositions[vertexIndex++] = positions[j * 3];
          linePositions[vertexIndex++] = positions[j * 3 + 1];
          linePositions[vertexIndex++] = positions[j * 3 + 2];
        }
      }
    }

    lineRef.current.geometry.attributes.position.array.set(linePositions);
    lineRef.current.geometry.attributes.position.needsUpdate = true;
    lineRef.current.geometry.setDrawRange(0, vertexIndex / 3);
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={linePositions.length / 3}
          array={linePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#5a0f1c" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
};

const Background3D = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Delay mounting until preloader is almost finished
    // to prevent heavy WebGL initialization from lagging startup
    const timer = setTimeout(() => setMounted(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 -z-10 bg-[#ffffff] pointer-events-none" />;
  }

  return (
    <div className="fixed inset-0 -z-10 bg-[#ffffff] pointer-events-none overflow-hidden">
      <Canvas dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
        <ambientLight intensity={0.5} />
        <NeuralNetwork />
      </Canvas>
      {/* Subtle vignettes and overlays to make it look premium */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-white/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/40" />
    </div>
  );
};

export default Background3D;
