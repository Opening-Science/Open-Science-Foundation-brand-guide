/**
 * 3×3×3 cube-grid formation — the "Reproducibility" values sketch.
 *
 * Port of `Tt` in reference/sketches/sketches-pretty.js (constants `Ct`, `Et`,
 * `ue`, `G`, `Ee`, `oe`, `Oe`). 27 particles unfold from the center into a
 * cube lattice axis by axis (x, then y, then z — one phase each), the tilt
 * eases in from 0 to 0.4 during the z phase, and the whole grid rotates about
 * the y axis with frameCount.
 */
import type { Formation, FormationFactory } from '../useP5Formation'

/** `Ct` — y-axis tilt eased in after the x/y phases. */
const TILT = 0.4
/** `Et` — y-axis rotation speed per frame. */
const ROTATION_SPEED = 0.007
/** `ue` — total cycle duration the phase weights divide. */
const CYCLE_MS = 4e3
/** `G` — grid radius in cells (1 → 3 cells per axis). */
const GRID_RADIUS = 1
/** `Ee` — grid spacing between adjacent cells. */
const GRID_SPACING = 250
/** `oe` — relative durations: x unfold, y unfold, z unfold (+ tilt), rest. */
const PHASE_WEIGHTS = [1, 1, 1, 3] as const
/** `Oe` — total particle count ((2 * G + 1)^3 = 27). */
export const CUBE_GRID_COUNT = (2 * GRID_RADIUS + 1) ** 3

export const createCubeGridFormation: FormationFactory = (p): Formation => {
  let startMs = -1
  let cachedFrame = -1
  const xExtents: number[] = new Array(GRID_RADIUS + 1).fill(0)
  const yExtents: number[] = new Array(GRID_RADIUS + 1).fill(0)
  const zExtents: number[] = new Array(GRID_RADIUS + 1).fill(0)

  function smoothstep(t: number): number {
    return t * t * (3 - 2 * t)
  }

  function totalWeight(): number {
    return PHASE_WEIGHTS.reduce((sum, w) => sum + w, 0)
  }

  function updateExtents(elapsed: number): void {
    const total = totalWeight()
    const durX = (CYCLE_MS * (PHASE_WEIGHTS[0] ?? 0)) / total
    const durY = (CYCLE_MS * (PHASE_WEIGHTS[1] ?? 0)) / total
    const durZ = (CYCLE_MS * (PHASE_WEIGHTS[2] ?? 0)) / total
    const elapsedY = p.max(0, elapsed - durX)
    const elapsedZ = p.max(0, elapsed - durX - durY)
    const stepX = durX / (GRID_RADIUS + 1)
    const stepY = durY / (GRID_RADIUS + 1)
    const stepZ = durZ / (GRID_RADIUS + 1)
    let acc = 0
    xExtents[0] = 0
    for (let i = 1; i <= GRID_RADIUS; i++) {
      acc = p.lerp(
        acc,
        i * GRID_SPACING,
        smoothstep(p.min(1, p.max(0, elapsed - stepX * i) / stepX)),
      )
      xExtents[i] = acc
    }
    acc = 0
    yExtents[0] = 0
    for (let i = 1; i <= GRID_RADIUS; i++) {
      acc = p.lerp(
        acc,
        i * GRID_SPACING,
        smoothstep(p.min(1, p.max(0, elapsedY - stepY * i) / stepY)),
      )
      yExtents[i] = acc
    }
    acc = 0
    zExtents[0] = 0
    for (let i = 1; i <= GRID_RADIUS; i++) {
      acc = p.lerp(
        acc,
        i * GRID_SPACING,
        smoothstep(p.min(1, p.max(0, elapsedZ - stepZ * i) / stepZ)),
      )
      zExtents[i] = acc
    }
  }

  return {
    get count() {
      return CUBE_GRID_COUNT
    },
    getTilt() {
      if (startMs < 0) return 0
      const elapsed = p.millis() - startMs
      const total = totalWeight()
      const tiltStart = (CYCLE_MS * ((PHASE_WEIGHTS[0] ?? 0) + (PHASE_WEIGHTS[1] ?? 0))) / total
      if (elapsed < tiltStart) return 0
      const tiltDur = (CYCLE_MS * (PHASE_WEIGHTS[2] ?? 0)) / total / (GRID_RADIUS + 1)
      return p.lerp(0, TILT, smoothstep(p.min(1, (elapsed - tiltStart) / tiltDur)))
    },
    activate() {
      startMs = -1
      cachedFrame = -1
    },
    getPos(index, frameCount) {
      if (startMs < 0) startMs = p.millis()
      if (frameCount !== cachedFrame) {
        updateExtents(p.millis() - startMs)
        cachedFrame = frameCount
      }
      const side = 2 * GRID_RADIUS + 1
      const layer = side * side
      const i = index % CUBE_GRID_COUNT
      const zi = Math.floor(i / layer)
      const yi = Math.floor((i % layer) / side)
      const xi = i % side
      // Index 0 is the center, then alternating -1/+1 steps outward.
      const xStep = Math.ceil(xi / 2)
      const xSign = xi === 0 ? 0 : xi % 2 === 1 ? -1 : 1
      const yStep = Math.ceil(yi / 2)
      const ySign = yi === 0 ? 0 : yi % 2 === 1 ? -1 : 1
      const zStep = Math.ceil(zi / 2)
      const zSign = zi === 0 ? 0 : zi % 2 === 1 ? -1 : 1
      const x = xSign * (xExtents[xStep] ?? 0)
      const y = ySign * (yExtents[yStep] ?? 0)
      const z = zSign * (zExtents[zStep] ?? 0)
      const rot = frameCount * ROTATION_SPEED
      return {
        x: x * p.cos(rot) - z * p.sin(rot),
        y,
        z: x * p.sin(rot) + z * p.cos(rot),
      }
    },
  }
}
