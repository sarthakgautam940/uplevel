// Global scroll state — updated by Lenis, read by Three.js animation loop
// Using a plain object avoids React re-render overhead in the animation loop

export const scrollState = {
  progress: 0,      // 0→1 across entire page
  velocity: 0,      // pixels/ms
  direction: 0,     // -1 | 0 | 1
  isReady: false,   // true after intro completes
}

// Mouse state for parallax
export const mouseState = {
  x: 0,   // -1→1 normalized
  y: 0,   // -1→1 normalized
  rawX: 0, // pixel
  rawY: 0, // pixel
}

// Intro state
export const introState = {
  complete: false,
  startTime: 0,
}
