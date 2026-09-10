/**
 * Torus-knot formation — the "Collaboration" values sketch.
 *
 * Port of `vt` in reference/sketches/sketches-pretty.js (constants `yt`, `Ne`,
 * `be`, `Ge`, `Se`, `qe`, `Ae`). 30 particles ride a (1,5) torus knot that
 * spins continuously about the y axis with frameCount.
 */
import type { Formation, FormationFactory } from '../useP5Formation'

/** `be` — particle count. */
export const TORUS_KNOT_COUNT = 30
/** `yt` — y-axis tilt. */
const TILT = 0.4
/** `Ne` — rotation speed per frame (both along the knot and about the y axis). */
const ROTATION_SPEED = 0.007
/** `Ge` — major radius. */
const MAJOR_RADIUS = 200
/** `Se` — tube radius. */
const TUBE_RADIUS = 200
/** `qe` — knot winding p. */
const KNOT_P = 1
/** `Ae` — knot winding q. */
const KNOT_Q = 5

export const createTorusKnotFormation: FormationFactory = (p): Formation => {
  return {
    get count() {
      return TORUS_KNOT_COUNT
    },
    getTilt() {
      return TILT
    },
    activate() {},
    getPos(index, frameCount) {
      const t =
        ((index % TORUS_KNOT_COUNT) / TORUS_KNOT_COUNT) * p.TWO_PI + frameCount * ROTATION_SPEED
      const x = p.cos(KNOT_P * t) * (MAJOR_RADIUS + TUBE_RADIUS * p.cos(KNOT_Q * t))
      const y = p.sin(KNOT_P * t) * (MAJOR_RADIUS + TUBE_RADIUS * p.cos(KNOT_Q * t))
      const z = TUBE_RADIUS * p.sin(KNOT_Q * t)
      const rot = frameCount * ROTATION_SPEED
      return {
        x: x * p.cos(rot) - z * p.sin(rot),
        y,
        z: x * p.sin(rot) + z * p.cos(rot),
      }
    },
  }
}
