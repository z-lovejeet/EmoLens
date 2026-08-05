'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { BodyModel } from './BodyModel';
import { CameraController } from './CameraController';
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

export function BodyScene() {
  return (
    <div className={styles.container}>
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{
          position: [0, 0.8, 5.0],
          fov: 35,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = 3; // ACESFilmicToneMapping
          gl.toneMappingExposure = 1.0;
        }}
      >
        {/* Scene background */}
        <color attach="background" args={['#0a0a0f']} />

        {/* Lighting rig from 3D Design Bible */}
        <ambientLight intensity={0.15} color="#ffffff" />
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.2}
          color="#faf0e6"
        />
        <directionalLight
          position={[-2, 3, -1]}
          intensity={0.4}
          color="#e6f0fa"
        />
        <directionalLight
          position={[0, 2, -4]}
          intensity={0.6}
          color="#ffecd2"
        />

        {/* Environment IBL */}
        <Environment preset="apartment" environmentIntensity={0.3} />

        {/* Camera animation controller */}
        <CameraController />

        {/* Body model with suspense */}
        <Suspense fallback={<SceneLoading />}>
          <BodyModel />
        </Suspense>

        {/* Post-processing */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            intensity={0.8}
            mipmapBlur
          />
          <Vignette
            offset={0.3}
            darkness={0.4}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
