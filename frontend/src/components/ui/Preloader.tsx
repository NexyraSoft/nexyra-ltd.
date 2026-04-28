import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";
import { Logo } from "./Logo";

const LoadingLogo = () => {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 1.5;
      meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={3} rotationIntensity={1} floatIntensity={1.5}>
        <group scale={[0.8, 0.8, 0.8]}>
          {/* Wireframe box as "3D Logo" structure */}
          <mesh>
            <boxGeometry args={[2.5, 2.5, 2.5]} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
          </mesh>
          <mesh>
            <boxGeometry args={[2.5, 2.5, 2.5]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
          </mesh>
          
          {/* Corner accents */}
          {[
            [1.25, 1.25, 1.25], [-1.25, 1.25, 1.25], [1.25, -1.25, 1.25], [-1.25, -1.25, 1.25],
            [1.25, 1.25, -1.25], [-1.25, 1.25, -1.25], [1.25, -1.25, -1.25], [-1.25, -1.25, -1.25]
          ].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
};

export const Preloader = () => {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    const timer = setTimeout(() => {
      setIsExiting(true);
      document.body.style.overflow = "auto";
    }, 2000); // 2 seconds display

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // 2s + 1s for animation

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={isExiting ? { y: "-100%" } : { y: 0 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.85, 0, 0.15, 1],
        delay: 0.2 // Small stay before slide
      }}
      className="fixed inset-0 z-[1000000] bg-maroon-900 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative w-full h-[300px] flex items-center justify-center">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={40} />
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <LoadingLogo />
        </Canvas>

        {/* Overlay Logo statically to prevent heavy 3D CSS transform calculations every frame */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
            <Logo className="w-full h-full text-white drop-shadow-2xl" />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center mt-4"
      >
        <h1 className="text-white text-5xl md:text-7xl font-sans font-bold tracking-tight">
          NexyraSoft
        </h1>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] mt-4 font-bold">
          The Future of Software
        </p>
      </motion.div>

      {/* Progress Line */}
      <motion.div 
        className="absolute bottom-20 left-1/2 -translateX-1/2 w-32 h-[1px] bg-white/20"
      >
        <motion.div 
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
};
