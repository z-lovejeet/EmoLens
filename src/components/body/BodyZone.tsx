'use client';

import { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import gsap from 'gsap';
import { useCheckinStore, type ZoneId, ZONE_LABELS } from '@/lib/store/checkinStore';
import { ZONE_MATERIALS, INTENSITY_COLORS } from '@/lib/three/materials';
import { ZoneBadge } from './ZoneBadge';
import { ZoneLabel } from './ZoneLabel';

interface BodyZoneProps {
  zoneId: ZoneId;
  geometry: THREE.BufferGeometry;
  position?: [number, number, number];
  center: [number, number, number];
}

export function BodyZone({ zoneId, geometry, position, center }: BodyZoneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const fresnelRef = useRef<THREE.ShaderMaterial>(null);
  const glowTween = useRef<gsap.core.Tween | null>(null);

  const { activeZone, hoveredZone, zoneData, selectZone, setHoveredZone } = useCheckinStore();

  const sensations = zoneData[zoneId].sensations;
  const sensationCount = sensations.length;
  const isActive = activeZone === zoneId;
  const isHovered = hoveredZone === zoneId;
  const isCompleted = sensationCount > 0 && activeZone !== zoneId;
  const isAnyZoneActive = activeZone !== null;

  // Compute average intensity for completed zones
  const avgIntensity = useMemo(() => {
    if (sensationCount === 0) return 0;
    const sum = sensations.reduce((acc, s) => acc + s.intensity, 0);
    return Math.round(sum / sensationCount) as 1 | 2 | 3 | 4 | 5;
  }, [sensations, sensationCount]);

  // Determine zone state
  const zoneState = useMemo(() => {
    if (isActive) return 'selected';
    if (isCompleted) return 'completed';
    if (isHovered && !isAnyZoneActive) return 'hovered';
    return 'idle';
  }, [isActive, isCompleted, isHovered, isAnyZoneActive]);

  // Apply material properties based on state
  useFrame(() => {
    if (!materialRef.current) return;
    const mat = materialRef.current;
    const target = ZONE_MATERIALS[zoneState === 'completed' ? 'completed' : zoneState];

    // Lerp material properties for smooth transitions
    mat.color.lerp(target.color, 0.1);
    mat.roughness += (target.roughness - mat.roughness) * 0.1;
    mat.metalness += (target.metalness - mat.metalness) * 0.1;

    if (zoneState === 'completed' && avgIntensity > 0) {
      const intensityColor = INTENSITY_COLORS[avgIntensity] || INTENSITY_COLORS[1];
      mat.emissive.lerp(intensityColor, 0.1);
      mat.emissiveIntensity += (target.emissiveIntensity - mat.emissiveIntensity) * 0.1;
    } else if (zoneState !== 'selected') {
      mat.emissive.lerp(
        'emissive' in target ? target.emissive : new THREE.Color('#000000'),
        0.1
      );
      mat.emissiveIntensity += (
        ('emissiveIntensity' in target ? target.emissiveIntensity : 0) - mat.emissiveIntensity
      ) * 0.1;
    }

    // Fresnel overlay for hover
    if (fresnelRef.current) {
      const targetIntensity = isHovered && !isAnyZoneActive ? 0.6 : 0;
      fresnelRef.current.uniforms.uIntensity.value +=
        (targetIntensity - fresnelRef.current.uniforms.uIntensity.value) * 0.1;
    }
  });

  // Glow pulse for selected zone
  useFrame(() => {
    if (!materialRef.current) return;

    if (isActive && !glowTween.current) {
      glowTween.current = gsap.to(materialRef.current, {
        emissiveIntensity: 0.7,
        duration: 2.0,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        startAt: { emissiveIntensity: 0.4 },
      });
      materialRef.current.emissive.set('#8ecae6');
    } else if (!isActive && glowTween.current) {
      glowTween.current.kill();
      glowTween.current = null;
    }
  });

  const handleClick = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!isAnyZoneActive || isActive) {
      selectZone(zoneId);
    }
  }, [zoneId, isAnyZoneActive, isActive, selectZone]);

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!isAnyZoneActive) {
      setHoveredZone(zoneId);
      document.body.style.cursor = 'pointer';
    }
  }, [zoneId, isAnyZoneActive, setHoveredZone]);

  const handlePointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredZone(null);
    document.body.style.cursor = 'auto';
  }, [setHoveredZone]);

  // Dim non-active zones when a zone is selected
  const opacity = isAnyZoneActive && !isActive ? 0.4 : 1.0;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          ref={materialRef}
          color={ZONE_MATERIALS.idle.color}
          roughness={ZONE_MATERIALS.idle.roughness}
          metalness={ZONE_MATERIALS.idle.metalness}
          emissive={ZONE_MATERIALS.idle.emissive}
          emissiveIntensity={ZONE_MATERIALS.idle.emissiveIntensity}
          transparent={isAnyZoneActive && !isActive}
          opacity={opacity}
        />
      </mesh>

      {/* Fresnel rim glow overlay */}
      <mesh geometry={geometry} position={position ? undefined : undefined}>
        <fresnelMaterial
          ref={fresnelRef}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
          uColor={new THREE.Color('#8ecae6')}
          uIntensity={0}
          uPower={2.5}
        />
      </mesh>

      {/* Badge - sensation count */}
      {sensationCount > 0 && !isActive && (
        <ZoneBadge
          count={sensationCount}
          position={[center[0], center[1] + 0.15, center[2]]}
        />
      )}

      {/* Label on hover */}
      {isHovered && !isAnyZoneActive && (
        <ZoneLabel
          label={ZONE_LABELS[zoneId]}
          position={[center[0], center[1] + 0.2, center[2]]}
        />
      )}
    </group>
  );
}
