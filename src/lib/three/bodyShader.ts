import * as THREE from 'three';

// ── Premium Body Shader ──
// Subsurface scattering, Fresnel rim glow, specular highlights, breathing pulse.
// This gives a luminous, semi-translucent porcelain/crystal look.

export const bodyVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  varying float vFresnel;
  varying vec2 vUv;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    vUv = uv;

    // Fresnel — glow at silhouette edges
    float NdotV = max(dot(vNormal, vViewDir), 0.0);
    vFresnel = pow(1.0 - NdotV, 3.0);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const bodyFragmentShader = /* glsl */ `
  uniform vec3 uBaseColor;
  uniform vec3 uGlowColor;
  uniform float uTime;
  uniform float uHovered;
  uniform float uSelected;
  uniform float uCompleted;
  uniform vec3 uIntensityColor;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  varying float vFresnel;
  varying vec2 vUv;

  // Simplex-inspired noise for organic variation
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    // ── Multi-light diffuse rig ──
    vec3 key   = normalize(vec3(3.0, 5.0, 4.0));
    vec3 fill  = normalize(vec3(-2.0, 3.0, -1.0));
    vec3 rim   = normalize(vec3(0.0, 2.0, -4.0));
    vec3 below = normalize(vec3(0.0, -1.5, 2.0));

    float dKey  = max(dot(vNormal, key), 0.0);
    float dFill = max(dot(vNormal, fill), 0.0);
    float dRim  = max(dot(vNormal, rim), 0.0);
    float dBelow = max(dot(vNormal, below), 0.0);

    // Wrapped diffuse for softer shadows (SSS approximation)
    float wrapKey  = max((dot(vNormal, key) + 0.3) / 1.3, 0.0);
    float wrapFill = max((dot(vNormal, fill) + 0.3) / 1.3, 0.0);

    float lighting = 0.22                   // ambient base
                   + wrapKey * 0.45         // soft key
                   + wrapFill * 0.2         // soft fill
                   + dRim * 0.15            // back rim
                   + dBelow * 0.08;         // subtle uplighting

    // ── Y-gradient for visual depth ──
    float yFactor = smoothstep(-0.2, 1.9, vWorldPos.y);
    vec3 baseColor = mix(uBaseColor * 0.82, uBaseColor * 1.08, yFactor);

    // ── Subsurface Scattering (fake) ──
    // Light bleeding through thin parts
    float sssKey  = pow(max(dot(-vNormal, key), 0.0), 2.5) * 0.18;
    float sssFill = pow(max(dot(-vNormal, fill), 0.0), 3.0) * 0.08;
    vec3 sssColor = uGlowColor * (sssKey + sssFill);

    // ── Fresnel rim glow ──
    float rimBase   = 0.08;
    float rimHover  = uHovered * 0.7;
    float rimSelect = uSelected * 0.55;
    float rimTotal  = rimBase + rimHover + rimSelect;
    vec3 fresnelGlow = mix(uGlowColor, vec3(1.0), 0.2) * vFresnel * rimTotal;

    // ── Specular highlights (Blinn-Phong) ──
    vec3 halfKey = normalize(key + vViewDir);
    float specKey = pow(max(dot(vNormal, halfKey), 0.0), 48.0);
    vec3 halfFill = normalize(fill + vViewDir);
    float specFill = pow(max(dot(vNormal, halfFill), 0.0), 32.0);
    vec3 specular = vec3(1.0) * (specKey * 0.35 + specFill * 0.12);

    // ── Breathing pulse ──
    float pulse = sin(uTime * 1.0) * 0.02 + 1.0;

    // ── Completed zone: intensity color inner glow ──
    float completedPulse = sin(uTime * 1.5) * 0.08 + 0.92;
    vec3 completedGlow = uIntensityColor * uCompleted * 0.4 * completedPulse;

    // ── Selected zone: pulsing active glow ──
    float selectPulse = sin(uTime * 2.2) * 0.15 + 0.85;
    vec3 selectedGlow = uGlowColor * uSelected * 0.5 * selectPulse;

    // ── Hover: subtle color shift ──
    vec3 hoverTint = uGlowColor * uHovered * 0.08;

    // ── Organic noise variation ──
    float noise = hash(vWorldPos * 8.0) * 0.03 - 0.015;

    // ── Final composition ──
    vec3 color = baseColor * lighting * pulse;
    color += sssColor;
    color += fresnelGlow;
    color += specular;
    color += completedGlow;
    color += selectedGlow;
    color += hoverTint;
    color += noise;

    // Tone mapping (filmic curve)
    color = color / (color + vec3(1.0));

    float alpha = uOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * Creates a fresh set of uniforms for one BodyZone instance.
 * Each zone needs its own uniforms object.
 */
export function createBodyUniforms() {
  return {
    uBaseColor:      { value: new THREE.Color('#ddd5cd') },
    uGlowColor:      { value: new THREE.Color('#8ecae6') },
    uTime:           { value: 0 },
    uHovered:        { value: 0 },
    uSelected:       { value: 0 },
    uCompleted:      { value: 0 },
    uIntensityColor: { value: new THREE.Color('#88d4ab') },
    uOpacity:        { value: 0.92 },
  };
}
