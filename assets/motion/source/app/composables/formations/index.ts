/**
 * Formation manifest.
 *
 * Mapping (ground truth: `Rt` in reference/sketches/sketches-pretty.js and the
 * component wiring around it):
 *
 * - HERO section     → `heroFormation` (heroRings): the inline hero sketch `jt`
 *                      — rings on an 8000 ms cycle, circle size 12, square
 *                      canvas of min(w, h), base size 600, formation scales its
 *                      own radii (`scalePositions: false`), and under
 *                      prefers-reduced-motion the sketch is not created at all.
 * - VALUES carousel  → `valuesFormations` keyed by each value's `animationKey`
 *                      (`Rt = { transparency, openness, collaboration, reproducibility }`):
 *                        openness        → rings      (`St`, 54 particles)
 *                        transparency    → sphere     (`It`, 60 particles)
 *                        collaboration   → torusKnot  (`vt`, 30 particles, startPausing: true)
 *                        reproducibility → cubeGrid   (`Tt`, 27 particles)
 *                      All values sketches use the shared engine defaults
 *                      (4000 ms cycle, circle size 14, cover fit).
 * - HEADER/FOOTER logo → NOT engine-based. The 40×40 logo mark is a separate
 *                      self-contained 2D sketch (DIAMOND/CIRCLE/RADIAL dot
 *                      formations with hover cycling) ported directly inside
 *                      `app/components/sketch/LogoMark.vue`.
 *
 * Each config spreads onto `<SketchCanvas v-bind="config" />`.
 */
import type { FormationFactory } from '../useP5Formation'
import { createTorusKnotFormation, TORUS_KNOT_COUNT } from './torusKnot'
import { createRingsFormation, RINGS_COUNT } from './rings'
import { createSphereFormation, SPHERE_COUNT } from './sphere'
import { createCubeGridFormation, CUBE_GRID_COUNT } from './cubeGrid'
import { createHeroRingsFormation, HERO_RINGS_COUNT } from './heroRings'

export { createTorusKnotFormation, TORUS_KNOT_COUNT } from './torusKnot'
export { createRingsFormation, RINGS_COUNT } from './rings'
export { createSphereFormation, SPHERE_COUNT } from './sphere'
export { createCubeGridFormation, CUBE_GRID_COUNT } from './cubeGrid'
export { createHeroRingsFormation, HERO_RINGS_COUNT } from './heroRings'

/** Props bundle for `<SketchCanvas>`; spread with `v-bind`. */
export interface SketchFormationConfig {
  formation: FormationFactory
  totalCircles: number
  startPausing?: boolean
  circleSize?: number
  idleMs?: number
  baseSize?: number
  fit?: 'cover' | 'contain-square'
  scalePositions?: boolean
  reducedMotion?: 'static' | 'none'
}

export type ValueAnimationKey = 'openness' | 'transparency' | 'collaboration' | 'reproducibility'

/** Values-carousel sketches, keyed by `animationKey` (mirrors `Rt`). */
export const valuesFormations: Record<ValueAnimationKey, SketchFormationConfig> = {
  openness: {
    formation: createRingsFormation,
    totalCircles: RINGS_COUNT,
  },
  transparency: {
    formation: createSphereFormation,
    totalCircles: SPHERE_COUNT,
  },
  collaboration: {
    formation: createTorusKnotFormation,
    totalCircles: TORUS_KNOT_COUNT,
    startPausing: true,
  },
  reproducibility: {
    formation: createCubeGridFormation,
    totalCircles: CUBE_GRID_COUNT,
  },
}

/**
 * Hero-section sketch (inline `jt` variant of the engine).
 *
 * The hero renders its canvas inside a flex-centered wrapper instead of the
 * default `absolute inset-0` — pass the reference DOM's classes:
 * `<SketchCanvas v-bind="heroFormation" wrapper-class="flex aspect-square w-8/12 items-center justify-center self-center lg:order-2 lg:w-5/12 lg:self-stretch" />`
 */
export const heroFormation: SketchFormationConfig = {
  formation: createHeroRingsFormation,
  totalCircles: HERO_RINGS_COUNT,
  circleSize: 12,
  idleMs: 8e3,
  baseSize: 600,
  fit: 'contain-square',
  scalePositions: false,
  reducedMotion: 'none',
}
