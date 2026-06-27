import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Random particle generator within a sphere shell
function generatePoints(count = 250, radius = 2.0) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = radius * (0.8 + Math.random() * 0.4); // shell thickness
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function FloatingGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  
  const mouse = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [positions] = useState(() => generatePoints(220, 2.0));

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 768) {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Base rotation
    const baseRotationSpeed = 0.04;
    groupRef.current.rotation.y += delta * baseRotationSpeed;
    groupRef.current.rotation.x += delta * (baseRotationSpeed * 0.5);

    if (!isMobile) {
      // Smoothly lerp towards mouse position
      const targetRotationY = mouse.current.x * 0.35;
      const targetRotationX = mouse.current.y * 0.35;
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, groupRef.current.rotation.y + targetRotationY * 0.1, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, groupRef.current.rotation.x + targetRotationX * 0.1, 0.08);
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner Wireframe Sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.1, 2]} />
        <meshBasicMaterial 
          color="#e7b464" 
          wireframe 
          transparent 
          opacity={0.16} 
        />
      </mesh>
      
      {/* Outer Wireframe Sphere */}
      <mesh scale={[1.25, 1.25, 1.25]}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshBasicMaterial 
          color="#4e8f7a" 
          wireframe 
          transparent 
          opacity={0.07} 
        />
      </mesh>

      {/* Glow Particles */}
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#e7b464"
          size={0.038}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#17211f]" aria-hidden="true">
      {/* Modern gradient ambient glows */}
      <div className="absolute right-[-10%] top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-[#e7b464]/8 blur-[100px]" />
      <div className="absolute left-[5%] top-1/4 h-[24rem] w-[24rem] rounded-full bg-[#4e8f7a]/6 blur-[120px]" />
      
      {/* 3D Canvas */}
      <div className="absolute right-0 top-0 h-full w-full opacity-65 md:w-1/2">
        <Canvas camera={{ position: [0, 0, 3.2], fov: 60 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <FloatingGlobe />
        </Canvas>
      </div>
    </div>
  );
}
