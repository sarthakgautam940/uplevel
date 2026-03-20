export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function easeOutBack(t: number, s = 1.4): number {
  return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}
