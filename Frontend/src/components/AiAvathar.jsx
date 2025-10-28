import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// AI Core - Central glowing sphere matching purple theme
const AICore = ({ isSpeaking }) => {
  const coreRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    if (coreRef.current) {
      // Pulsing animation
      const pulse = isSpeaking ? 1.2 + Math.sin(state.clock.elapsedTime * 8) * 0.2 : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      coreRef.current.scale.set(pulse, pulse, pulse);
      
      // Gentle rotation
      coreRef.current.rotation.y += 0.01;
    }
    
    if (glowRef.current) {
      const glowPulse = isSpeaking ? 1.5 + Math.sin(state.clock.elapsedTime * 6) * 0.3 : 1.2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      glowRef.current.scale.set(glowPulse, glowPulse, glowPulse);
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Main core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={isSpeaking ? "#a78bfa" : "#8b5cf6"}
          emissive={isSpeaking ? "#a78bfa" : "#7c3aed"}
          emissiveIntensity={isSpeaking ? 2 : 1.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// Orbiting Particles - Purple/Pink theme
const OrbitingParticles = ({ isSpeaking }) => {
  const particlesRef = useRef();
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += isSpeaking ? 0.03 : 0.01;
      particlesRef.current.rotation.x += 0.005;
    }
  });

  const particles = [];
  const particleCount = 16;
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 1.5;
    const height = Math.sin(angle * 3) * 0.5;
    const color = i % 2 === 0 ? "#f97316" : "#22c55e";
    
    particles.push(
      <mesh
        key={i}
        position={[
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ]}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
    );
  }

  return <group ref={particlesRef}>{particles}</group>;
};

// Energy Rings - Matching the colorful dots theme
const EnergyRings = ({ isSpeaking }) => {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  
  useFrame((state) => {
    const speed = isSpeaking ? 0.02 : 0.01;
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += speed;
      ring1Ref.current.rotation.y += speed * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += speed;
      ring2Ref.current.rotation.z += speed * 0.5;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += speed;
      ring3Ref.current.rotation.x += speed * 0.5;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.2, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#eab308"
          emissive="#eab308"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.4, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>
    </>
  );
};

// Floating Data Nodes
const DataNodes = ({ isSpeaking }) => {
  const nodesRef = useRef();
  const [time, setTime] = useState(0);
  
  useFrame((state) => {
    if (nodesRef.current) {
      nodesRef.current.rotation.y -= isSpeaking ? 0.015 : 0.005;
    }
    setTime(state.clock.elapsedTime);
  });

  const nodes = [];
  const nodeCount = 8;
  
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const radius = 2;
    
    nodes.push(
      <mesh
        key={i}
        position={[
          Math.cos(angle) * radius,
          Math.sin(time + i) * 0.3,
          Math.sin(angle) * radius
        ]}
        rotation={[time * 0.5 + i, time * 0.3 + i, 0]}
      >
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </mesh>
    );
  }

  return <group ref={nodesRef}>{nodes}</group>;
};

// Pulsing Wave Effect
const PulseWaves = ({ isSpeaking }) => {
  const wave1Ref = useRef();
  const wave2Ref = useRef();
  
  useFrame((state) => {
    if (wave1Ref.current) {
      const scale = 1 + (Math.sin(state.clock.elapsedTime * 2) * 0.3);
      wave1Ref.current.scale.set(scale, scale, scale);
      wave1Ref.current.material.opacity = 0.3 - (scale - 1) * 0.5;
    }
    
    if (wave2Ref.current) {
      const scale = 1 + (Math.sin(state.clock.elapsedTime * 2 + Math.PI) * 0.3);
      wave2Ref.current.scale.set(scale, scale, scale);
      wave2Ref.current.material.opacity = 0.3 - (scale - 1) * 0.5;
    }
  });

  return (
    <>
      <mesh ref={wave1Ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      <mesh ref={wave2Ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#a78bfa"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
    </>
  );
};

// Main 3D Scene Component
const Scene = ({ expression, isSpeaking }) => {
  return (
    <>
      {/* Lighting setup for dark purple theme */}
      <ambientLight intensity={0.2} color="#8b5cf6" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.4}
        color="#a78bfa"
      />
      <pointLight position={[-5, 5, 5]} intensity={1} color="#8b5cf6" />
      <pointLight position={[5, -5, -5]} intensity={0.8} color="#7c3aed" />
      <pointLight position={[0, 0, 5]} intensity={0.6} color="#a78bfa" />
      
      <AICore isSpeaking={isSpeaking} />
      <OrbitingParticles isSpeaking={isSpeaking} />
      <EnergyRings isSpeaking={isSpeaking} />
      <DataNodes isSpeaking={isSpeaking} />
      <PulseWaves isSpeaking={isSpeaking} />
      
      {/* Simple fog for depth */}
      <fog attach="fog" args={['#1e1b4b', 5, 15]} />
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        maxDistance={6}
        minDistance={2.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
};

// Main AI Avatar Component
const AiAvatar = ({ isSpeaking = false, onSpeakingChange }) => {
  const [internalSpeaking, setInternalSpeaking] = useState(false);
  const [expression, setExpression] = useState('neutral');

  // Use internal state if no external control
  const isCurrentlySpeaking = onSpeakingChange ? isSpeaking : internalSpeaking;

  const handleToggle = () => {
    if (onSpeakingChange) {
      onSpeakingChange(!isSpeaking);
    } else {
      setInternalSpeaking(!internalSpeaking);
    }
  };

  return (
    <div className="w-full h-full bg-transparent">
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 relative">
          <React.Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-transparent">
              <div className="text-center">
                <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-3 text-purple-400 text-sm font-medium">Loading AI...</p>
              </div>
            </div>
          }>
            <Canvas
              camera={{ position: [0, 0, 4], fov: 50 }}
              className="w-full h-full"
              gl={{ 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance"
              }}
              style={{ background: 'transparent' }}
            >
              <Scene expression={expression} isSpeaking={isCurrentlySpeaking} />
            </Canvas>
          </React.Suspense>
          
          {/* Status indicator overlay */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-indigo-900 bg-opacity-50 backdrop-blur-sm px-3 py-2 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isCurrentlySpeaking ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
            <div className={`w-2 h-2 rounded-full ${isCurrentlySpeaking ? 'bg-yellow-400 animate-pulse' : 'bg-orange-400'} delay-75`}></div>
            <div className={`w-2 h-2 rounded-full ${isCurrentlySpeaking ? 'bg-red-400 animate-pulse' : 'bg-red-400'} delay-150`}></div>
            <span className="text-white text-xs font-medium ml-2">
              {isCurrentlySpeaking ? 'Speaking' : 'Listening'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAvatar;