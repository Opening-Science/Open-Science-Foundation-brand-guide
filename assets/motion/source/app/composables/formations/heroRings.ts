/**
 * Hero concentric-rings formation.
 *
 * Port of the inline `Qe` class inside the hero sketch component (`jt`) in
 * reference/sketches/sketches-pretty.js. Geometrically identical to the
 * values "Openness" rings (counts 14/20/20, radii 90/180/280, spin speeds
 * 0.5/1/1) but on an 8000 ms cycle with phase weights [1, 16], and it scales
 * its own radii by the engine's canvas scale factor (the hero engine runs
 * with `scalePositions: false`, base size 600, square canvas fit).
 */
import type { Formation, FormationFactory } from '../useP5Formation'

/** `x` — particles per ring. */
const RING_COUNTS = [14, 20, 20] as const
/** `b` — target radius per ring (multiplied by the canvas scale). */
const RING_RADII = [90, 180, 280] as const
/** `w` — phase-2 spin speed multiplier per ring. */
const RING_SPEEDS = [0.5, 1, 1] as const
/** `E` — relative durations of phase 1 (grow) and phase 2 (spin). */
const PHASE_WEIGHTS = [1, 16] as const
/** Tilt returned by `Qe.getTilt()`. */
const TILT = 0.4
/** Cycle duration (`8e3` in `_phaseInfo`; matches the hero engine's idle time). */
const CYCLE_MS = 8e3
/** `O` — total particle count (14 + 20 + 20). */
export const HERO_RINGS_COUNT = RING_COUNTS.reduce((sum, n) => sum + n, 0)

export const createHeroRingsFormation: FormationFactory = (p, getScale): Formation => {
  let startMs = -1

  function smoothstep(t: number): number {
    return t * t * (3 - 2 * t)
  }

  function ringOf(index: number): { ring: number; i: number } {
    let offset = 0
    for (let ring = 0; ring < RING_COUNTS.length; ring++) {
      if (index < offset + (RING_COUNTS[ring] ?? 0)) return { ring, i: index - offset }
      offset += RING_COUNTS[ring] ?? 0
    }
    const last = RING_COUNTS.length - 1
    return { ring: last, i: index - (HERO_RINGS_COUNT - (RING_COUNTS[last] ?? 0)) }
  }

  function phaseInfo() {
    const total = PHASE_WEIGHTS.reduce((sum, w) => sum + w, 0)
    const dur1 = (CYCLE_MS * (PHASE_WEIGHTS[0] ?? 0)) / total
    const dur2 = (CYCLE_MS * (PHASE_WEIGHTS[1] ?? 0)) / total
    return { dur1, dur2, p2Start: dur1, durPerRing: dur1 / RING_COUNTS.length }
  }

  return {
    get count() {
      return HERO_RINGS_COUNT
    },
    getTilt() {
      return TILT
    },
    activate() {
      startMs = -1
    },
    getPos(index) {
      if (startMs < 0) startMs = p.millis()
      if (index >= HERO_RINGS_COUNT) return { x: 0, y: 0, z: 0 }
      const scale = getScale()
      const { ring, i } = ringOf(index)
      const ringCount = RING_COUNTS[ring] ?? 1
      const angle = (i / ringCount) * p.TWO_PI
      const { durPerRing, dur2, p2Start } = phaseInfo()
      const elapsed = p.millis() - startMs
      const innerRadius = ring === 0 ? 0 : (RING_RADII[ring - 1] ?? 0) * scale
      const grow = smoothstep(p.constrain((elapsed - ring * durPerRing) / durPerRing, 0, 1))
      const radius = p.lerp(innerRadius, (RING_RADII[ring] ?? 0) * scale, grow)
      let x = radius * p.cos(angle)
      let y = radius * p.sin(angle)
      let z = 0
      const spin = (p.max(0, elapsed - p2Start) / dur2) * p.TWO_PI * (RING_SPEEDS[ring] ?? 0)
      if (ring === 0) {
        const nx = x * p.cos(spin) - y * p.sin(spin)
        const ny = x * p.sin(spin) + y * p.cos(spin)
        x = nx
        y = ny
      } else if (ring === 1) {
        const ny = y * p.cos(spin) - z * p.sin(spin)
        const nz = y * p.sin(spin) + z * p.cos(spin)
        y = ny
        z = nz
      } else {
        const nx = x * p.cos(spin) + z * p.sin(spin)
        const nz = -x * p.sin(spin) + z * p.cos(spin)
        x = nx
        z = nz
      }
      return { x, y, z }
    },
    getVisibility(index) {
      if (startMs < 0 || index >= HERO_RINGS_COUNT) return 0
      const { ring } = ringOf(index)
      const { durPerRing } = phaseInfo()
      return p.millis() - startMs >= ring * durPerRing ? 1 : 0
    },
  }
}
