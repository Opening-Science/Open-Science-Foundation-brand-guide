/**
 * p5 particle-formation engine.
 *
 * Port of the engine in `reference/sketches/sketches-pretty.js` (function `we`,
 * lines ~46–246) plus the hero variant embedded in the same chunk (component
 * `jt`). Every constant is copied verbatim from the source; the original
 * minified name is noted next to each one.
 *
 * Lifecycle (state machine, all times in ms):
 *   idle (IDLE_MS) → collapse to center (COLLAPSE_MS, ease-in pow COLLAPSE_POW)
 *   → pause as a single dot (PAUSE_MS) → formation.activate() → expand
 *   (EXPAND_MS, inverse ease-out pow EXPAND_POW) → idle …
 *
 * While idle/expanding, a highlight "wave" travels through the particle
 * indices once per IDLE_MS, lerping each particle color toward the blue
 * highlight color with a smoothstepped falloff of HIGHLIGHT_RADIUS indices.
 * Particles are z-sorted every frame and drawn with a simple perspective
 * projection (PERSPECTIVE_DISTANCE) after a y-axis tilt rotation.
 */
import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import type p5 from 'p5'

/** A 3D point returned by a formation. */
export interface FormationPoint {
  x: number
  y: number
  z: number
}

/**
 * A particle formation. Mirrors the duck-typed objects produced by the
 * formation factories in sketches-pretty.js (`vt`, `St`, `Tt`, `It`, hero `Qe`).
 */
export interface Formation {
  /** Number of particles this formation positions. */
  readonly count: number
  /** Current y-axis tilt (radians) applied before projection. */
  getTilt(): number
  /** Reset internal clocks; called right before expanding out of the pause dot. */
  activate(): void
  /** Position for particle `index` at p5 `frameCount`. */
  getPos(index: number, frameCount: number): FormationPoint
  /** Optional 0..1 visibility (alpha multiplier) for particle `index`. */
  getVisibility?(index: number): number
  /** Optional per-particle base color (lerped toward the highlight color). */
  getBaseColor?(index: number): p5.Color | null
}

/**
 * Formation factory. `getScale` returns the engine's current canvas scale
 * factor — only used by formations that scale their own coordinates
 * (`scalePositions: false`, i.e. the hero rings). All other formations ignore it.
 */
export type FormationFactory = (p: p5, getScale: () => number) => Formation

export interface UseP5FormationOptions {
  containerRef: Ref<HTMLElement | null>
  totalCircles: number
  createFormation: FormationFactory
  /** Start in the paused-dot state instead of laid out in formation. */
  startPausing?: boolean
  /** Unscaled particle diameter. Default DEFAULT_CIRCLE_SIZE (14). */
  circleSize?: number
  /**
   * Idle duration between collapses; also the period of the highlight wave.
   * Default IDLE_MS (4000). The hero sketch uses 8000.
   */
  idleMs?: number
  /** Reference canvas size the scale factor is derived from. Default 1200; hero uses 600. */
  baseSize?: number
  /**
   * 'cover' (default): canvas fills the container, scale = max(w, h) / baseSize.
   * 'contain-square' (hero): square canvas of min(w, h), scale = size / baseSize.
   */
  fit?: 'cover' | 'contain-square'
  /**
   * true (default): engine multiplies formation positions by the scale factor.
   * false (hero): the formation scales its own coordinates via `getScale`.
   */
  scalePositions?: boolean
  /**
   * Behavior under prefers-reduced-motion:
   * 'static' (default, engine `we`): render one frame, then noLoop().
   * 'none' (hero): do not create the sketch at all.
   */
  reducedMotion?: 'static' | 'none'
}

// --- Engine constants (verbatim from sketches-pretty.js) -------------------
/** `me` — reference canvas size the scale factor is derived from. */
export const BASE_CANVAS_SIZE = 1200
/** `ut` — grayscale value of the base/collapsed particle color (black). */
export const BASE_COLOR_GRAY = 0
/** `We` — perspective projection distance. */
export const PERSPECTIVE_DISTANCE = 5e3
/** `xe` — highlight wave color (blue). */
export const HIGHLIGHT_RGB: readonly [number, number, number] = [103, 163, 254]
/** `ht` — highlight wave falloff radius, in particle indices. */
export const HIGHLIGHT_RADIUS = 10
/** `Be` — idle time between collapses; also the highlight wave period. */
export const IDLE_MS = 4e3
/** `pt` — collapse-to-center duration. */
export const COLLAPSE_MS = 200
/** `gt` — pause-as-a-dot duration. */
export const PAUSE_MS = 600
/** `mt` — expand-to-formation duration. */
export const EXPAND_MS = 200
/** `ft` — collapse easing exponent (ease-in pow). */
export const COLLAPSE_POW = 2
/** `bt` — expand easing exponent (inverse ease-out pow). */
export const EXPAND_POW = 3
/** Default unscaled particle diameter (`a = n.circleSize ?? 14`). */
export const DEFAULT_CIRCLE_SIZE = 14

/** Responsive size multiplier (`t()` in the source). */
function responsiveScaleFactor(): number {
  const w = window.innerWidth
  return w < 640 ? 1.8 : w < 1024 ? 1.5 : 1
}

/**
 * Wire a p5 formation sketch into `containerRef`. p5 is dynamically imported
 * on mount (client only); the instance is removed on unmount.
 */
export function useP5Formation(options: UseP5FormationOptions): void {
  let instance: p5 | null = null
  let disposed = false

  const idleMs = options.idleMs ?? IDLE_MS
  const baseSize = options.baseSize ?? BASE_CANVAS_SIZE
  const fit = options.fit ?? 'cover'
  const scalePositions = options.scalePositions ?? true
  const reducedMotion = options.reducedMotion ?? 'static'

  onMounted(async () => {
    const container = options.containerRef.value
    if (!container) return
    const prefersReduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduce && reducedMotion === 'none') return

    const { default: P5 } = await import('p5')
    if (disposed) return
    const circleSize = options.circleSize ?? DEFAULT_CIRCLE_SIZE

    instance = new P5((p: p5) => {
      let scale = 1
      let centerX = baseSize / 2
      let centerY = baseSize / 2
      let formation: Formation
      let particles: Particle[] = []
      let waveIndex = 0
      let lastFrameMs = 0
      let idleStartMs = 0
      let collapsing = false
      let pausing = false
      let expanding = false
      let responsiveScale = 1
      let collapseProgress = 1
      let expandProgress = 1
      let collapseStartMs = -1 / 0
      let pauseStartMs = -1 / 0
      let expandStartMs = -1 / 0
      let baseColor: p5.Color
      let highlightColor: p5.Color

      function easeInPow(t: number, e: number): number {
        return p.pow(t, e)
      }
      function easeOutPow(t: number, e: number): number {
        return 1 - p.pow(1 - t, e)
      }

      class Particle {
        index: number
        x = 0
        y = 0
        z = 0
        snapX = 0
        snapY = 0
        snapZ = 0
        px: number
        py: number
        displaySize: number
        displayZ = 0
        col: p5.Color | null = null

        constructor(index: number) {
          this.index = index
          this.px = centerX
          this.py = centerY
          this.displaySize = circleSize * scale
        }

        snapshot(): void {
          this.snapX = this.x
          this.snapY = this.y
          this.snapZ = this.z
        }

        update(
          targetX: number,
          targetY: number,
          targetZ: number,
          progress: number,
          tilt: number,
          size: number = circleSize * scale,
        ): void {
          this.x = p.lerp(this.snapX, targetX, progress)
          this.y = p.lerp(this.snapY, targetY, progress)
          this.z = p.lerp(this.snapZ, targetZ, progress)
          // y-axis tilt rotation, then perspective projection
          const rotY = this.y * p.cos(tilt) - this.z * p.sin(tilt)
          const rotZ = this.y * p.sin(tilt) + this.z * p.cos(tilt)
          this.displayZ = rotZ
          const perspective = PERSPECTIVE_DISTANCE / (PERSPECTIVE_DISTANCE + rotZ)
          this.px = centerX + this.x * perspective
          this.py = centerY + rotY * perspective
          this.displaySize = size * perspective
        }

        draw(): void {
          p.noStroke()
          if (this.col) p.fill(this.col)
          p.ellipse(this.px, this.py, this.displaySize, this.displaySize)
        }
      }

      function measure(): { w: number; h: number } {
        const cw = container!.clientWidth
        const ch = container!.clientHeight
        if (fit === 'contain-square') {
          const size = Math.min(cw, ch)
          scale = size / baseSize
          centerX = size / 2
          centerY = size / 2
          return { w: size, h: size }
        }
        scale = Math.max(cw, ch) / baseSize
        centerX = cw / 2
        centerY = ch / 2
        return { w: cw, h: ch }
      }

      p.setup = () => {
        const { w, h } = measure()
        responsiveScale = responsiveScaleFactor()
        const canvas = p.createCanvas(w, h)
        canvas.parent(container!)
        canvas.elt.style.background = 'transparent'
        canvas.elt.style.pointerEvents = 'none'
        p.noStroke()
        baseColor = p.color(BASE_COLOR_GRAY)
        highlightColor = p.color(HIGHLIGHT_RGB[0], HIGHLIGHT_RGB[1], HIGHLIGHT_RGB[2])
        formation = options.createFormation(p, () => scale)
        particles = []
        for (let i = 0; i < options.totalCircles; i++) particles.push(new Particle(i))
        if (options.startPausing) {
          for (const particle of particles) particle.snapshot()
          pausing = true
          pauseStartMs = p.millis()
          lastFrameMs = p.millis()
        } else {
          const tilt = formation.getTilt()
          const posScale = scalePositions ? scale : 1
          for (const particle of particles) {
            const pos = formation.getPos(particle.index, 0)
            particle.x = pos.x * posScale
            particle.y = pos.y * posScale
            particle.z = pos.z * posScale
            particle.snapshot()
            particle.update(
              pos.x * posScale,
              pos.y * posScale,
              pos.z * posScale,
              1,
              tilt,
              circleSize * scale * responsiveScale,
            )
          }
          idleStartMs = p.millis()
          lastFrameMs = p.millis()
        }
        if (prefersReduce) p.noLoop()
      }

      p.draw = () => {
        p.clear()
        const now = p.millis()
        const deltaMs = now - lastFrameMs
        lastFrameMs = now
        let tilt = formation.getTilt()
        if (!collapsing && !pausing && !expanding && now - idleStartMs >= idleMs) {
          for (const particle of particles) particle.snapshot()
          collapseStartMs = p.millis()
          collapseProgress = 0
          collapsing = true
          waveIndex = 0
        }
        const size = circleSize * scale * responsiveScale
        const posScale = scalePositions ? scale : 1
        if (collapsing) {
          collapseProgress = p.min(1, (now - collapseStartMs) / COLLAPSE_MS)
          for (const particle of particles) {
            particle.update(0, 0, 0, easeInPow(collapseProgress, COLLAPSE_POW), tilt, size)
          }
          if (collapseProgress >= 1) {
            for (const particle of particles) particle.snapshot()
            collapsing = false
            pausing = true
            pauseStartMs = p.millis()
          }
        } else if (pausing) {
          if (now - pauseStartMs >= PAUSE_MS) {
            formation.activate()
            tilt = formation.getTilt()
            pausing = false
            expanding = true
            expandStartMs = p.millis()
            expandProgress = 0
            waveIndex = 0
          }
        } else if (expanding) {
          expandProgress = p.min(1, (now - expandStartMs) / EXPAND_MS)
          for (const particle of particles) {
            const pos = formation.getPos(particle.index, p.frameCount)
            particle.update(
              pos.x * posScale,
              pos.y * posScale,
              pos.z * posScale,
              easeOutPow(expandProgress, EXPAND_POW),
              tilt,
              size,
            )
          }
          if (expandProgress >= 1) {
            expanding = false
            idleStartMs = now
          }
        } else {
          for (const particle of particles) {
            const pos = formation.getPos(particle.index, p.frameCount)
            particle.update(pos.x * posScale, pos.y * posScale, pos.z * posScale, 1, tilt, size)
          }
        }
        // traveling highlight wave: one full pass through the indices per idleMs
        const count = formation.count
        waveIndex = (waveIndex - (count / idleMs) * deltaMs + count) % count
        for (const particle of particles) {
          if (collapsing || pausing) {
            particle.col = baseColor
            continue
          }
          const wrapped = particle.index % count
          const dist = p.min(p.abs(wrapped - waveIndex), count - p.abs(wrapped - waveIndex))
          let amount = p.max(0, 1 - dist / HIGHLIGHT_RADIUS)
          amount = amount * amount * (3 - 2 * amount)
          const base = formation.getBaseColor ? formation.getBaseColor(particle.index) : null
          particle.col = p.lerpColor(base ?? baseColor, highlightColor, amount)
          const visibility = formation.getVisibility ? formation.getVisibility(particle.index) : 1
          if (visibility < 1) particle.col.setAlpha(visibility * 255)
        }
        particles.sort((a, b) => a.displayZ - b.displayZ)
        for (const particle of particles) particle.draw()
      }

      p.windowResized = () => {
        const { w, h } = measure()
        responsiveScale = responsiveScaleFactor()
        p.resizeCanvas(w, h)
      }
    })
  })

  onBeforeUnmount(() => {
    disposed = true
    instance?.remove()
    instance = null
  })
}
