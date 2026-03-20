// ─── BACKGROUND FBM ATMOSPHERIC SHADER ──────────────────────────────────────
// Creates the breathing void — #05050A with subtle electric-blue FBM variation
// and a barely-perceptible lighter horizon

export const BG_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

export const BG_FRAG = `
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),           hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float amplitude = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; i++) {
    v += amplitude * noise(p);
    p = rot * p * 2.1 + vec2(3.7, 8.1);
    amplitude *= 0.48;
  }
  return v;
}

void main() {
  vec2 uv = vUv;

  // FBM noise for atmospheric variation
  vec2 p = uv * 2.8 + vec2(uTime * 0.00045, uTime * 0.00028);
  float n = fbm(p);
  float n2 = fbm(p + vec2(3.4, 1.8) + uTime * 0.00018);

  // Base void color: #05050A — near-black with violet-blue undertone
  vec3 voidColor = vec3(0.0196, 0.0196, 0.0392); // #05050A
  vec3 accentColor = vec3(0.184, 0.494, 1.0);     // #2F7EFF

  // Subtle blue FBM cloud layer
  vec3 color = voidColor + accentColor * (n * n2) * 0.016;

  // Pre-dawn horizon: slightly lighter at the vertical center
  float horizonGlow = 1.0 - abs(uv.y - 0.42) * 1.6;
  horizonGlow = clamp(horizonGlow, 0.0, 1.0);
  horizonGlow = pow(horizonGlow, 3.0);
  color += vec3(0.0025, 0.003, 0.007) * horizonGlow;

  // Subtle vignette to reinforce depth
  vec2 center = uv - 0.5;
  float vignette = 1.0 - dot(center, center) * 0.55;
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
`

// ─── HOLOGRAPHIC PLANE SHADER ─────────────────────────────────────────────────
// Additive blending — glows blue, softly pulsing opacity
// Used for site plan, dashboard, process flow planes

export const HOLO_VERT = `
uniform float uTime;
varying vec2 vUv;
varying float vPulse;

void main() {
  vUv = uv;
  // Gentle vertex displacement — hologram flicker
  float flicker = sin(uTime * 3.2 + position.y * 2.1) * 0.0008;
  vec3 pos = position + normal * flicker;
  vPulse = 0.5 + 0.5 * sin(uTime * 0.9);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

export const HOLO_FRAG = `
uniform float uTime;
uniform sampler2D uTexture;
uniform float uOpacity;
varying vec2 vUv;
varying float vPulse;

void main() {
  vec4 tex = texture2D(uTexture, vUv);

  // Scanline effect — very subtle
  float scanline = sin(vUv.y * 120.0 + uTime * 0.8) * 0.5 + 0.5;
  scanline = 0.92 + scanline * 0.08;

  // Edge fade
  float edgeFade = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 3.0);
  edgeFade *= 1.0 - pow(abs(vUv.y - 0.5) * 2.0, 3.0);
  edgeFade = clamp(edgeFade, 0.0, 1.0);

  // Pulse opacity
  float pulse = 0.88 + vPulse * 0.12;

  float alpha = tex.a * uOpacity * scanline * edgeFade * pulse;
  vec3 color = vec3(0.184, 0.494, 1.0) * tex.rgb; // Tint to #2F7EFF

  gl_FragColor = vec4(color, alpha);
}
`

// ─── STRUCTURAL ANALYSIS PULSE SHADER ────────────────────────────────────────
// Used on LineSegments tracing the load paths through the structural frame
// A brightness wave travels along each line from top to bottom

export const PULSE_LINE_VERT = `
attribute float aPhase;
uniform float uTime;
varying float vBrightness;

void main() {
  // Phase travels top to bottom: 0 at top, 1 at bottom of stud
  float wave = sin(aPhase * 3.14159 - uTime * 0.85 + aPhase * 6.28);
  wave = max(0.0, wave);
  vBrightness = wave;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const PULSE_LINE_FRAG = `
uniform float uBaseOpacity;
varying float vBrightness;

void main() {
  float opacity = uBaseOpacity + vBrightness * 0.14;
  gl_FragColor = vec4(0.184, 0.494, 1.0, opacity); // #2F7EFF
}
`

// ─── PARTICLE SHADER ──────────────────────────────────────────────────────────
// Atmospheric motes — tiny glowing dots drifting through the frame

export const PARTICLE_VERT = `
attribute float aSize;
attribute float aOpacity;
uniform float uTime;
varying float vOpacity;

void main() {
  vOpacity = aOpacity;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (300.0 / -mvPos.z);
  gl_Position = projectionMatrix * mvPos;
}
`

export const PARTICLE_FRAG = `
varying float vOpacity;

void main() {
  // Circular soft point
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  float alpha = smoothstep(0.5, 0.0, dist);
  gl_FragColor = vec4(0.184, 0.494, 1.0, alpha * vOpacity);
}
`

// ─── FLOOR GRID PULSE SHADER ─────────────────────────────────────────────────
// A radial pulse wave travels outward from center along the control joint grid

export const FLOOR_GRID_VERT = `
attribute vec3 aCenter;
uniform float uTime;
uniform vec3 uCameraPos;
varying float vPulse;

void main() {
  // Distance from camera projection on floor
  float dist = length(position.xz - uCameraPos.xz);

  // Pulse wave: travels outward at 8-second intervals
  float cycleTime = mod(uTime * 0.125, 1.0); // 8s cycle
  float waveDist = cycleTime * 120.0; // travels 120 units in 8s
  float wave = 1.0 - abs(dist - waveDist) / 12.0;
  wave = clamp(wave, 0.0, 1.0);
  wave = pow(wave, 2.0);

  vPulse = wave;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const FLOOR_GRID_FRAG = `
uniform float uBaseOpacity;
varying float vPulse;

void main() {
  float opacity = uBaseOpacity + vPulse * 0.08;
  gl_FragColor = vec4(0.074, 0.078, 0.122, opacity); // #131420
}
`
