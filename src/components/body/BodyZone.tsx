'use client';

import { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useCheckinStore, type ZoneId, ZONE_LABELS } from '@/lib/store/checkinStore';
import { INTENSITY_COLORS } from '@/lib/three/materials';
import { bodyVertexShader, bodyFragmentShader, createBodyUniforms } from '@/lib/three/bodyShader';
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
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const wireframeRef = useRef<THREE.MeshBasicMaterial>(null);

  const activeZone = useCheckinStore((s) => s.activeZone);
  const hoveredZone = useCheckinStore((s) => s.hoveredZone);
  const zoneData = useCheckinStore((s) => s.zoneData);
  const selectZone = useCheckinStore((s) => s.selectZone);
  const setHoveredZone = useCheckinStore((s) => s.setHoveredZone);

  const sensations = zoneData[zoneId].sensations;
  const sensationCount = sensations.length;
  const isActive = activeZone === zoneId;
  const isHovered = hoveredZone === zoneId;
  const isCompleted = sensationCount > 0 && activeZone !== zoneId;
  const isAnyZoneActive = activeZone !== null;

  const avgIntensity = useMemo(() => {
    if (sensationCount === 0) return 0;
    const sum = sensations.reduce((acc, s) => acc + s.intensity, 0);
    return Math.round(sum / sensationCount) as 1 | 2 | 3 | 4 | 5;
  }, [sensations, sensationCount]);

  // Each zone gets its own uniforms instance
  const uniforms = useMemo(() => createBodyUniforms(), []);

  // Update shader uniforms every frame
  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;

    u.uTime.value = clock.getElapsedTime();

    // Smooth lerp hover state
    const targetHovered = (isHovered && !isAnyZoneActive) ? 1.0 : 0.0;
    u.uHovered.value += (targetHovered - u.uHovered.value) * 0.1;

    // Smooth lerp selected state
    const targetSelected = isActive ? 1.0 : 0.0;
    u.uSelected.value += (targetSelected - u.uSelected.value) * 0.1;

    // Smooth lerp completed state
    const targetCompleted = isCompleted ? 1.0 : 0.0;
    u.uCompleted.value += (targetCompleted - u.uCompleted.value) * 0.08;

    // Update intensity color for completed zones
    if (isCompleted && avgIntensity > 0) {
      const color = INTENSITY_COLORS[avgIntensity] || INTENSITY_COLORS[1];
      (u.uIntensityColor.value as THREE.Color).lerp(color, 0.08);
    }

    // Dim non-active zones when a zone is selected
    const targetOpacity = (isAnyZoneActive && !isActive) ? 0.2 : 0.92;
    u.uOpacity.value += (targetOpacity - u.uOpacity.value) * 0.08;

    // Wireframe opacity — brighter on hover
    if (wireframeRef.current) {
      const targetWire = (isHovered && !isAnyZoneActive) ? 0.18 : 0.035;
      wireframeRef.current.opacity += (targetWire - wireframeRef.current.opacity) * 0.1;
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

  return (
    <group position={position}>
      {/* Primary body mesh — custom SSS + Fresnel shader */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={bodyVertexShader}
          fragmentShader={bodyFragmentShader}
          transparent
          depthWrite
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Wireframe holographic overlay */}
      <mesh geometry={geometry} scale={[1.003, 1.003, 1.003]}>
        <meshBasicMaterial
          ref={wireframeRef}
          color="#8ecae6"
          wireframe
          transparent
          opacity={0.035}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Sensation count badge */}
      {sensationCount > 0 && !isActive && (
        <ZoneBadge
          count={sensationCount}
          position={[center[0], center[1] + 0.22, center[2] + 0.1]}
        />
      )}

      {/* Zone label on hover */}
      {isHovered && !isAnyZoneActive && (
        <ZoneLabel
          label={ZONE_LABELS[zoneId]}
          position={[center[0], center[1] + 0.28, center[2] + 0.1]}
        />
      )}
    </group>
  );
}
