/**
 * Fibonacci-sphere formation — the "Transparency" values sketch.
 *
 * Port of `It` in reference/sketches/sketches-pretty.js (constants `_t`, `Pt`,
 * `Ke`, `Ot`, `Te`, `ee`, `Me`). 60 particles sit on a golden-angle spiral
 * sphere of radius 280, revealed top-to-bottom during phase 1, then fade out
 * (base color alpha 255 → 0) during phase 2 while the sphere rotates about
 * the y axis.
 */
import type { Formation, FormationFactory } from '../useP5Formation'

/** `ee` — particle count. */
export const SPHERE_COUNT = 60
/** `_t` — y-axis tilt. */
const TILT = 0.4
/** `Pt` — y-axis rotation speed per frame. */
const ROTATION_SPEED = 0.007
/** `Ke` — total cycle duration the phase weights divide. */
const CYCLE_MS = 4e3
/** `Ot` — grayscale value the particles fade from (black). */
const FADE_COLOR_GRAY = 0
/** `Te` — sphere radius. */
const SPHERE_RADIUS = 280
/** `Me` — relative durations: reveal, fade, rest. */
const PHASE_WEIGHTS = [1, 1, 6] as const

export const createSphereFormation: FormationFactory = (p): Formation => {
  let startMs = -1

  function smoothstep(t: number): number {
    return t * t * (3 - 2 * t)
  }

  // Golden-angle (Fibonacci) sphere points.
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const points: { x: number; y: number; z: number }[] = []
  for (let i = 0; i < SPHERE_COUNT; i++) {
    const t = 1 - (2 * i + 1) / SPHERE_COUNT
    const r = Math.sqrt(1 - t * t)
    const a = goldenAngle * i
    points.push({
      x: SPHERE_RADIUS * r * Math.cos(a),
      y: -SPHERE_RADIUS * t,
      z: SPHERE_RADIUS * r * Math.sin(a),
    })
  }
  // Reveal order: sorted by descending y (top of the sphere first on screen).
  const order = [...Array(SPHERE_COUNT).keys()].sort(
    (a, b) => (points[b]?.y ?? 0) - (points[a]?.y ?? 0),
  )

  function phaseInfo() {
    const total = PHASE_WEIGHTS.reduce((sum, w) => sum + w, 0)
    const dur1 = (CYCLE_MS * (PHASE_WEIGHTS[0] ?? 0)) / total
    const dur2 = (CYCLE_MS * (PHASE_WEIGHTS[1] ?? 0)) / total
    return { dur1, dur2, p2Start: dur1 }
  }

  return {
    get count() {
      return SPHERE_COUNT
    },
    getTilt() {
      return TILT
    },
    activate() {
      startMs = -1
    },
    getPos(index, frameCount) {
      if (startMs < 0) startMs = p.millis()
      if (index >= SPHERE_COUNT) return { x: 0, y: 0, z: 0 }
      const point = points[order[index] ?? 0] ?? { x: 0, y: 0, z: 0 }
      const rot = frameCount * ROTATION_SPEED
      return {
        x: point.x * p.cos(rot) - point.z * p.sin(rot),
        y: point.y,
        z: point.x * p.sin(rot) + point.z * p.cos(rot),
      }
    },
    getVisibility(index) {
      if (startMs < 0 || index >= SPHERE_COUNT) return 0
      const { dur1 } = phaseInfo()
      return p.millis() - startMs >= (index / SPHERE_COUNT) * dur1 ? 1 : 0
    },
    getBaseColor() {
      if (startMs < 0) return null
      const elapsed = p.millis() - startMs
      const { dur2, p2Start } = phaseInfo()
      if (elapsed < p2Start) return null
      const fade = smoothstep(p.constrain((elapsed - p2Start) / dur2, 0, 1))
      const col = p.color(FADE_COLOR_GRAY)
      col.setAlpha((1 - fade) * 255)
      return col
    },
  }
}
