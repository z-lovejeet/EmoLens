'use client';

import { useMemo, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGLTF } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useCheckinStore, type ZoneId, ZONE_LABELS } from '@/lib/store/checkinStore';
import { hitToZone, normalizeGLBScene, getZoneCenter, ZONE_SPHERE_RADIUS } from '@/lib/three/zoneMapping';
import { ZoneLabel } from './ZoneLabel';
import { ZoneBadge } from './ZoneBadge';

const MODEL_PATHS = {
  male: '/models/male-body.glb',
  female: '/models/female-body.glb',
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

/**
 * Sleek 3D wireframe sphere indicator dynamically sized according to body part / muscle group area.
 */
function HighlightSphere({
  zoneId,
  center,
  isSelected,
}: {
  zoneId: ZoneId;
  center: [number, number, number];
  isSelected?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      const t = clock.getElapsedTime();
      const pulse = isSelected ? 0.55 + Math.sin(t * 4) * 0.15 : 0.35 + Math.sin(t * 3) * 0.1;
      mat.opacity = pulse;
    }
  });

  const baseRadius = ZONE_SPHERE_RADIUS[zoneId] || 0.10;
  const radius = isSelected ? baseRadius * 1.15 : baseRadius;

  return (
    <mesh ref={meshRef} position={center} renderOrder={10}>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshBasicMaterial
        color={isSelected ? '#8ecae6' : '#b8a9c9'}
        transparent
        opacity={0.35}
        wireframe
        depthTest={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function HumanBody() {
  const groupRef = useRef<THREE.Group>(null);
  const lastHitIsRear = useRef<boolean>(false);
  const reduced = useReducedMotion();

  const bodyType = useCheckinStore((s) => s.bodyType);
  const activeZone = useCheckinStore((s) => s.activeZone);
  const activeZoneIsRear = useCheckinStore((s) => s.activeZoneIsRear);
  const hoveredZone = useCheckinStore((s) => s.hoveredZone);
  const zoneData = useCheckinStore((s) => s.zoneData);
  const selectZone = useCheckinStore((s) => s.selectZone);
  const setHoveredZone = useCheckinStore((s) => s.setHoveredZone);

  const modelPath = MODEL_PATHS[bodyType || 'male'];
  const { scene } = useGLTF(modelPath);

  // Clone scene and apply material + standardized normalization directly on transform
  const preparedScene = useMemo(() => {
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

    normalizeGLBScene(cloned, 1.75);
    return cloned;
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

  // Precise front vs rear surface normal classification
  const getIsRearHit = useCallback((e: ThreeEvent<PointerEvent | MouseEvent>): boolean => {
    if (e.face) {
      const worldNormal = e.face.normal.clone().transformDirection(e.object.matrixWorld);
      return worldNormal.z < 0;
    }
    return e.point.z < -0.05;
  }, []);

  // Handle Raycasting pointer move & click using direct world hit coordinates
  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (activeZone) return;

    const isRear = getIsRearHit(e);
    lastHitIsRear.current = isRear;
    const zone = hitToZone(e.point, bodyType);
    setHoveredZone(zone);
    document.body.style.cursor = 'pointer';
  }, [activeZone, bodyType, getIsRearHit, setHoveredZone]);

  const handlePointerOut = useCallback(() => {
    if (!activeZone) {
      setHoveredZone(null);
      document.body.style.cursor = 'auto';
    }
  }, [activeZone, setHoveredZone]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (activeZone) return;

    const isRear = getIsRearHit(e);
    lastHitIsRear.current = isRear;
    const zone = hitToZone(e.point, bodyType);
    selectZone(zone, isRear);
  }, [activeZone, bodyType, getIsRearHit, selectZone]);

  if (!bodyType) return null;

  const activeZoneCenter = activeZone ? getZoneCenter(activeZone, bodyType, activeZoneIsRear) : null;
  const hoveredZoneCenter = hoveredZone && !activeZone ? getZoneCenter(hoveredZone, bodyType, lastHitIsRear.current) : null;

  return (
    <group ref={groupRef}>
      {/* 3D Anatomy Model Mesh with Raycasting Listeners */}
      <primitive
        object={preparedScene}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* Hover Highlight Sphere Circle */}
      {hoveredZone && hoveredZoneCenter && (
        <HighlightSphere zoneId={hoveredZone} center={hoveredZoneCenter} />
      )}

      {/* Selected Active Highlight Sphere Circle */}
      {activeZone && activeZoneCenter && (
        <HighlightSphere zoneId={activeZone} center={activeZoneCenter} isSelected />
      )}

      {/* Hover Zone Label */}
      {hoveredZone && !activeZone && hoveredZoneCenter && (
        <ZoneLabel
          label={ZONE_LABELS[hoveredZone]}
          position={hoveredZoneCenter}
        />
      )}

      {/* Sensation Count Badges */}
      {Object.entries(zoneData).map(([zId, data]) => {
        const count = data.sensations.length;
        if (count === 0 || activeZone === zId) return null;
        const center = getZoneCenter(zId as ZoneId, bodyType);
        return (
          <ZoneBadge
            key={zId}
            count={count}
            position={[center[0], center[1] + 0.08, center[2] + 0.04]}
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
