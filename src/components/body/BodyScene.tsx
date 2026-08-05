'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { HumanBody } from './HumanBody';
import { CameraController } from './CameraController';
import { BodyParticles, GroundGlow } from './BodyParticles';
import { useCheckinStore } from '@/lib/store/checkinStore';
import styles from './BodyScene.module.css';

function SceneLoading() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color="#8ecae6"
        emissive="#8ecae6"
        emissiveIntensity={0.5}
        wireframe
      />
    </mesh>
  );
}

function SceneContent() {
  const isZoomed = useCheckinStore((s) => s.isZoomed);

  return (
    <>
      {/* Deep dark background */}
      <color attach="background" args={['#06060c']} />
      <fog attach="fog" args={['#06060c', 6, 12]} />

      {/* Orbit controls — only when not zoomed */}
      <OrbitControls
        makeDefault
        enabled={!isZoomed}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        rotateSpeed={0.4}
        dampingFactor={0.06}
        enableDamping
        target={[0, 0.88, 0]}
      />

      {/* ── Premium 5-Light Studio Rig ── */}
      {/* Key light — warm, strong, from upper-right */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.6}
        color="#faf0e6"
      />
      {/* Fill light — cool, softer, from left */}
      <directionalLight
        position={[-2.5, 3, -1]}
        intensity={0.5}
        color="#c8dff5"
      />
      {/* Rim/Back light — warm accent from behind */}
      <directionalLight
        position={[0, 2.5, -5]}
        intensity={0.7}
        color="#ffecd2"
      />
      {/* Under light — subtle uplighting for drama */}
      <directionalLight
        position={[0, -2, 3]}
        intensity={0.12}
        color="#8ecae6"
      />
      {/* Ambient — very low to keep contrast */}
      <ambientLight intensity={0.08} color="#ffffff" />

      {/* Environment map for reflections */}
      <Environment preset="apartment" environmentIntensity={0.25} />

      {/* Camera animation controller */}
      <CameraController />

      {/* Floating energy particles */}
      <BodyParticles />

      {/* Ground glow */}
      <GroundGlow />

      {/* Body model */}
      <Suspense fallback={<SceneLoading />}>
        <HumanBody />
      </Suspense>

      {/* ── Post-Processing Stack ── */}
      <EffectComposer>
        {/* Bloom — makes rim glow and particles luminous */}
        <Bloom
          luminanceThreshold={0.4}
          luminanceSmoothing={0.8}
          intensity={1.2}
          mipmapBlur
        />
        {/* Chromatic Aberration — subtle lens effect at edges */}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0008, 0.0008)}
          radialModulation={true}
          modulationOffset={0.5}
        />
        {/* Vignette — darkens edges for cinematic framing */}
        <Vignette
          offset={0.25}
          darkness={0.5}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

export function BodyScene() {
  return (
    <div className={styles.container}>
      <Canvas
        frameloop="always"
        dpr={[1, 2]}
        camera={{
          position: [0, 0.8, 4.2],
          fov: 40,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
