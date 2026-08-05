'use client';

import { useMemo, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGLTF } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useCheckinStore, type ZoneId, ZONE_LABELS } from '@/lib/store/checkinStore';
import { hitToZone, normalizeGLBScene, ZONE_CENTERS } from '@/lib/three/zoneMapping';
import { ZoneLabel } from './ZoneLabel';
import { ZoneBadge } from './ZoneBadge';

const MODEL_PATHS = {
  male: '/models/male-body.glb',
  female: '/models/female-body.glb',
  neutral: '/models/male-body.glb',
} as const;

function createPorcelainMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#c8beb5'),
    roughness: 0.55,
    metalness: 0.02,
    clearcoat: 0.35,
    clearcoatRoughness: 0.35,
    sheen: 0.8,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color('#8ecae6'),
    emissive: new THREE.Color('#1a2a3a'),
    emissiveIntensity: 0.12,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide,
  });
}

function HighlightRing({ center, isSelected }: { center: [number, number, number]; isSelected?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      const t = clock.getElapsedTime();
      const pulse = 0.25 + Math.sin(t * 4) * 0.1;
      mat.opacity = isSelected ? 0.45 : pulse;
    }
  });

  return (
    <mesh ref={meshRef} position={center}>
      <sphereGeometry args={[0.18, 24, 24]} />
      <meshBasicMaterial
        color={isSelected ? '#8ecae6' : '#b8a9c9'}
        transparent
        opacity={0.3}
        wireframe
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function HumanBody() {
  const groupRef = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  const bodyType = useCheckinStore((s) => s.bodyType);
  const activeZone = useCheckinStore((s) => s.activeZone);
  const hoveredZone = useCheckinStore((s) => s.hoveredZone);
  const zoneData = useCheckinStore((s) => s.zoneData);
  const selectZone = useCheckinStore((s) => s.selectZone);
  const setHoveredZone = useCheckinStore((s) => s.setHoveredZone);

  const modelPath = MODEL_PATHS[bodyType || 'male'];
  const { scene } = useGLTF(modelPath);

  // Clone scene and apply material + normalization
  const { preparedScene, scale, offset } = useMemo(() => {
    const cloned = scene.clone(true);
    const material = createPorcelainMaterial();

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = material;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (!mesh.geometry.attributes.normal) {
          mesh.geometry.computeVertexNormals();
        }
      }
    });

    const { scale, offset } = normalizeGLBScene(cloned, 1.75);
    return { preparedScene: cloned, scale, offset };
  }, [scene]);

  // Entrance & float animations
  useEffect(() => {
    if (!groupRef.current || reduced || !bodyType) return;
    groupRef.current.scale.set(0.95, 0.95, 0.95);
    gsap.to(groupRef.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, [reduced, bodyType]);

  useEffect(() => {
    if (!groupRef.current || reduced || !bodyType) return;
    const tween = gsap.to(groupRef.current.position, {
      y: '+=0.03',
      duration: 4.0,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, [reduced, bodyType]);

  // Breathing emissive pulse
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.10 + Math.sin(t * 0.8) * 0.04;
    preparedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        if (mat && mat.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = pulse;
        }
      }
    });
  });

  // Handle Raycasting pointer move & click
  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (activeZone) return; // don't hover when zoomed into a zone

    // Convert hit point to local normalized model coordinates
    const localPoint = e.point.clone();
    if (groupRef.current) {
      groupRef.current.worldToLocal(localPoint);
    }
    // Remove scale & offset transform to get standardized height (0..1.75)
    localPoint.sub(offset).divideScalar(scale);

    const zone = hitToZone(localPoint);
    setHoveredZone(zone);
    document.body.style.cursor = 'pointer';
  }, [activeZone, scale, offset, setHoveredZone]);

  const handlePointerOut = useCallback(() => {
    if (!activeZone) {
      setHoveredZone(null);
      document.body.style.cursor = 'auto';
    }
  }, [activeZone, setHoveredZone]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (activeZone) return;

    const localPoint = e.point.clone();
    if (groupRef.current) {
      groupRef.current.worldToLocal(localPoint);
    }
    localPoint.sub(offset).divideScalar(scale);

    const zone = hitToZone(localPoint);
    selectZone(zone);
  }, [activeZone, scale, offset, selectZone]);

  if (!bodyType) return null;

  const activeZoneCenter = activeZone ? ZONE_CENTERS[activeZone] : null;
  const hoveredZoneCenter = hoveredZone && !activeZone ? ZONE_CENTERS[hoveredZone] : null;

  return (
    <group ref={groupRef}>
      {/* 3D Anatomy Model Mesh with Raycasting Listeners */}
      <primitive
        object={preparedScene}
        scale={[scale, scale, scale]}
        position={[offset.x, offset.y, offset.z]}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* Hover Highlight Ring */}
      {hoveredZoneCenter && (
        <HighlightRing center={hoveredZoneCenter} />
      )}

      {/* Selected Active Highlight Ring */}
      {activeZoneCenter && (
        <HighlightRing center={activeZoneCenter} isSelected />
      )}

      {/* Hover Zone Label */}
      {hoveredZone && !activeZone && (
        <ZoneLabel
          label={ZONE_LABELS[hoveredZone]}
          position={ZONE_CENTERS[hoveredZone]}
        />
      )}

      {/* Sensation Count Badges */}
      {Object.entries(zoneData).map(([zId, data]) => {
        const count = data.sensations.length;
        if (count === 0 || activeZone === zId) return null;
        const center = ZONE_CENTERS[zId as ZoneId];
        return (
          <ZoneBadge
            key={zId}
            count={count}
            position={[center[0], center[1] + 0.08, center[2] + 0.05]}
          />
        );
      })}
    </group>
  );
}

// Preload models
try {
  useGLTF.preload(MODEL_PATHS.male);
  useGLTF.preload(MODEL_PATHS.female);
} catch {
  // Graceful fallback
}
