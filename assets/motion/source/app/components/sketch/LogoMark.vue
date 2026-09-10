<script setup lang="ts">
/**
 * Header/footer logo mark + wordmark.
 *
 * Faithful port of the logo component (`pk`) in
 * reference/sketches/entry-pretty.js. This is NOT the shared 3D formation
 * engine: it is a self-contained 2D p5 sketch on a fixed 40×40 canvas.
 *
 * Behavior (all constants verbatim from the source):
 * - 9 dots (diameter 8.5, black fill, white stroke 1.6) cycle through three
 *   formations: DIAMOND (8 dots, radiusX 12 / radiusY 8.5, stepping 90°
 *   every 2000 ms with a double-pow ease), CIRCLE (9 dots, radius 11) and
 *   RADIAL (9 dots, radius 14.5, 3 rays); CIRCLE/RADIAL slowly rotate at
 *   0.01 rad/frame.
 * - State machine HOLD → GATHERING (200 ms, ease-in pow 2, to center) →
 *   SPREADING (300 ms, ease-out pow 3, to next formation) → HOLD. On hover
 *   it gathers immediately, then advances a formation every 2000 ms; when the
 *   pointer leaves it returns to the DIAMOND formation.
 * - A canvas-clip trick redraws the first/last dots inside the first dot's
 *   outline so the chain visually closes.
 * - prefers-reduced-motion: the sketch is not created; a static SVG of the
 *   logo is rendered instead.
 *
 * Wrapper classes (canvas shrunk responsively via origin-top-left scale) are
 * verbatim from the reference DOM.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type p5 from 'p5'

interface LogoDot {
  x: number
  y: number
  snapX: number
  snapY: number
}

interface LogoFormation {
  mode: 'DIAMOND' | 'CIRCLE' | 'RADIAL'
  numCircles: number
  radius?: number
  radiusX?: number
  radiusY?: number
  numRays?: number
}

const CANVAS_SIZE = 40
const CENTER = 20
const DOT_RADIUS = 4.25
const DOT_DIAMETER = 8.5
const STROKE_WEIGHT = 1.6
const ROTATION_PER_FRAME = 0.01
/** `D` — diamond 90° step interval. */
const DIAMOND_STEP_MS = 2e3
/** `K = D * 4` — full diamond rotation cycle. */
const DIAMOND_CYCLE_MS = DIAMOND_STEP_MS * 4
/** Hovered: advance to the next formation after this hold time. */
const HOVER_HOLD_MS = 2e3
const GATHER_MS = 200
const GATHER_POW = 2
const SPREAD_MS = 300
const SPREAD_POW = 3

/** `S` — the three dot formations, cycled on hover. */
const FORMATIONS: LogoFormation[] = [
  { mode: 'DIAMOND', numCircles: 8, radiusX: 12, radiusY: 8.5 },
  { mode: 'CIRCLE', numCircles: 9, radius: 11 },
  { mode: 'RADIAL', numCircles: 9, radius: 14.5, numRays: 3 },
]

const hostRef = ref<HTMLElement | null>(null)
const prefersReduced = ref(false)
let instance: p5 | null = null
let disposed = false

// Shared mutable hover state, read by the sketch each frame (as in the source).
const hover = { isHovered: false, triggerGather: false }

function onMouseEnter(): void {
  hover.isHovered = true
  hover.triggerGather = true
}

function onMouseLeave(): void {
  hover.isHovered = false
}

onMounted(async () => {
  prefersReduced.value =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced.value) return
  const host = hostRef.value
  if (!host) return
  const { default: P5 } = await import('p5')
  if (disposed) return

  instance = new P5((p: p5) => {
    const maxCircles = Math.max(...FORMATIONS.map((f) => f.numCircles))
    const dots: LogoDot[] = Array.from({ length: maxCircles }, () => ({
      x: CENTER,
      y: CENTER,
      snapX: CENTER,
      snapY: CENTER,
    }))
    let formationIndex = 0
    let phase: 'HOLD' | 'GATHERING' | 'SPREADING' = 'HOLD'
    let phaseStartMs = 0
    let holdStartMs = 0
    let rotation = 0
    let diamondClockMs = 0
    let lastMs = 0

    /** `M` — symmetric double-pow ease-in-out. */
    function easeInOutPow(t: number, e: number): number {
      return t < 0.5 ? 0.5 * Math.pow(2 * t, e) : 1 - 0.5 * Math.pow(2 * (1 - t), e)
    }

    function snapshotAll(): void {
      for (const dot of dots) {
        dot.snapX = dot.x
        dot.snapY = dot.y
      }
    }

    /** `z` — target position of dot `index` in the current formation. */
    function dotTarget(index: number): { x: number; y: number } {
      const formation = FORMATIONS[formationIndex]
      if (!formation || index >= formation.numCircles) return { x: CENTER, y: CENTER }
      if (
        formation.mode === 'DIAMOND' &&
        formation.radiusX !== undefined &&
        formation.radiusY !== undefined
      ) {
        const directions: [number, number][] = [
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0],
        ]
        const t = ((((index / formation.numCircles) * 4) % 4) + 4) % 4
        const edge = Math.floor(t) % 4
        const frac = t - Math.floor(t)
        const eased = frac * 0.8 + frac * frac * (3 - 2 * frac) * 0.2
        const from = directions[edge]!
        const to = directions[(edge + 1) % 4]!
        const dx = from[0] + (to[0] - from[0]) * eased
        const dy = from[1] + (to[1] - from[1]) * eased
        const clock = diamondClockMs % DIAMOND_CYCLE_MS
        const stepProgress = (clock % DIAMOND_STEP_MS) / DIAMOND_STEP_MS
        const angle =
          (Math.floor(clock / DIAMOND_STEP_MS) + easeInOutPow(stepProgress, 3)) * (Math.PI / 2)
        // Note: radiusY scales x and radiusX scales y — verbatim from the source.
        return {
          x: CENTER + (dx * Math.cos(angle) - dy * Math.sin(angle)) * formation.radiusY,
          y: CENTER + (dx * Math.sin(angle) + dy * Math.cos(angle)) * formation.radiusX,
        }
      }
      if (formation.mode === 'CIRCLE' && formation.radius !== undefined) {
        const angle = ((Math.PI * 2) / formation.numCircles) * index + rotation
        return {
          x: CENTER + Math.cos(angle) * formation.radius,
          y: CENTER + Math.sin(angle) * formation.radius,
        }
      }
      if (
        formation.mode === 'RADIAL' &&
        formation.radius !== undefined &&
        formation.numRays !== undefined
      ) {
        const ray = index % formation.numRays
        const angle = ((Math.PI * 2) / formation.numRays) * ray + rotation
        const step = Math.floor(index / formation.numRays)
        const stepsPerRay = Math.ceil(formation.numCircles / formation.numRays)
        const dist = stepsPerRay > 1 ? (step / (stepsPerRay - 1)) * formation.radius : 0
        return { x: CENTER + Math.cos(angle) * dist, y: CENTER + Math.sin(angle) * dist }
      }
      return { x: CENTER, y: CENTER }
    }

    /**
     * `ne` — redraw the last and second dots clipped inside the first dot's
     * outline so the dot chain reads as closed when they overlap.
     */
    function drawJoint(first: LogoDot, last: LogoDot, second: LogoDot): void {
      const dx = last.x - first.x
      const dy = last.y - first.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist >= 2 * DOT_RADIUS || dist <= 0) return
      const ctx = p.drawingContext as CanvasRenderingContext2D
      function drawDot(dot: LogoDot): void {
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = '#000000'
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = STROKE_WEIGHT
        ctx.stroke()
      }
      ctx.save()
      ctx.beginPath()
      ctx.arc(first.x, first.y, DOT_RADIUS + STROKE_WEIGHT / 2, 0, Math.PI * 2)
      ctx.clip()
      drawDot(last)
      drawDot(first)
      drawDot(second)
      ctx.restore()
    }

    p.setup = () => {
      p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2))
      p.createCanvas(CANVAS_SIZE, CANVAS_SIZE).parent(host!)
      for (let i = 0; i < maxCircles; i++) {
        const target = dotTarget(i)
        const dot = dots[i]!
        dot.x = target.x
        dot.y = target.y
        dot.snapX = target.x
        dot.snapY = target.y
      }
      holdStartMs = p.millis()
      phaseStartMs = p.millis()
      lastMs = p.millis()
    }

    p.draw = () => {
      p.clear()
      const now = p.millis()
      const phaseElapsed = now - phaseStartMs
      const delta = now - lastMs
      lastMs = now
      rotation += ROTATION_PER_FRAME
      diamondClockMs += delta
      if (phase === 'HOLD') {
        for (let i = 0; i < maxCircles; i++) {
          const target = dotTarget(i)
          const dot = dots[i]!
          dot.x = target.x
          dot.y = target.y
        }
        if (
          hover.triggerGather ||
          (hover.isHovered && now - holdStartMs > HOVER_HOLD_MS) ||
          (!hover.isHovered && formationIndex !== 0)
        ) {
          hover.triggerGather = false
          snapshotAll()
          phase = 'GATHERING'
          phaseStartMs = now
        }
      } else if (phase === 'GATHERING') {
        const t = Math.pow(Math.min(1, phaseElapsed / GATHER_MS), GATHER_POW)
        for (const dot of dots) {
          dot.x = dot.snapX + (CENTER - dot.snapX) * t
          dot.y = dot.snapY + (CENTER - dot.snapY) * t
        }
        if (phaseElapsed >= GATHER_MS) {
          formationIndex = hover.isHovered ? (formationIndex + 1) % FORMATIONS.length : 0
          for (const dot of dots) {
            dot.snapX = CENTER
            dot.snapY = CENTER
          }
          phase = 'SPREADING'
          phaseStartMs = now
        }
      } else if (phase === 'SPREADING') {
        const t = 1 - Math.pow(1 - Math.min(1, phaseElapsed / SPREAD_MS), SPREAD_POW)
        for (let i = 0; i < maxCircles; i++) {
          const target = dotTarget(i)
          const dot = dots[i]!
          dot.x = dot.snapX + (target.x - dot.snapX) * t
          dot.y = dot.snapY + (target.y - dot.snapY) * t
        }
        if (phaseElapsed >= SPREAD_MS) {
          phase = 'HOLD'
          holdStartMs = now
        }
      }
      const visibleCount = (FORMATIONS[formationIndex] ?? FORMATIONS[0]!).numCircles
      p.stroke(255, 255, 255)
      p.strokeWeight(STROKE_WEIGHT)
      p.fill(0, 0, 0)
      for (let i = 0; i < visibleCount; i++) {
        const dot = dots[i]!
        p.circle(dot.x, dot.y, DOT_DIAMETER)
      }
      const last = dots[visibleCount - 1]
      if (dots[0] && dots[1] && last) drawJoint(dots[0], last, dots[1])
    }
  })
})

onBeforeUnmount(() => {
  disposed = true
  instance?.remove()
  instance = null
})
</script>

<template>
  <div class="flex items-center gap-4" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <svg
      v-if="prefersReduced"
      class="h-[26px] w-auto shrink-0 md:h-[30px] lg:h-[33px]"
      viewBox="0 0 29 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M13.9064 23.3809C13.9064 20.8498 15.9583 18.7979 18.4894 18.7979C21.0205 18.7979 23.0724 20.8498 23.0724 23.3809C23.0724 25.912 21.0205 27.9639 18.4894 27.9639C15.9583 27.9639 13.9064 25.912 13.9064 23.3809Z"
        fill="black"
        stroke="white"
        stroke-width="1.22983"
      />
      <path
        d="M9.5558 29.3616C9.5558 26.8305 11.6077 24.7786 14.1388 24.7786C16.6699 24.7786 18.7218 26.8305 18.7218 29.3616C18.7218 31.8927 16.6699 33.9446 14.1388 33.9446C11.6077 33.9446 9.5558 31.8927 9.5558 29.3616Z"
        fill="black"
        stroke="white"
        stroke-width="1.22983"
      />
      <path
        d="M5.15468 23.3295C5.15468 20.7984 7.20656 18.7465 9.73768 18.7465C12.2688 18.7465 14.3207 20.7984 14.3207 23.3295C14.3207 25.8607 12.2688 27.9125 9.73768 27.9125C7.20656 27.9125 5.15468 25.8607 5.15468 23.3295Z"
        fill="black"
        stroke="white"
        stroke-width="1.22983"
      />
      <path
        d="M0.614884 17.1613C0.614884 14.6302 2.66676 12.5783 5.19788 12.5783C7.729 12.5783 9.78088 14.6302 9.78088 17.1613C9.78088 19.6924 7.729 21.7443 5.19788 21.7443C2.66676 21.7443 0.614883 19.6924 0.614884 17.1613Z"
        fill="black"
        stroke="white"
        stroke-width="1.22983"
      />
      <path
        d="M4.9662 11.1796C4.9662 8.64851 7.01808 6.59663 9.5492 6.59663C12.0803 6.59663 14.1322 8.64851 14.1322 11.1796C14.1322 13.7108 12.0803 15.7626 9.5492 15.7626C7.01808 15.7626 4.9662 13.7108 4.9662 11.1796Z"
        fill="black"
        stroke="white"
        stroke-width="1.22983"
      />
      <path
        d="M9.31679 5.19788C9.31679 2.66676 11.3687 0.614883 13.8998 0.614883C16.4309 0.614883 18.4828 2.66676 18.4828 5.19788C18.4828 7.729 16.4309 9.78088 13.8998 9.78088C11.3687 9.78088 9.31679 7.729 9.31679 5.19788Z"
        fill="black"
        stroke="white"
        stroke-width="1.22983"
      />
      <path
        d="M13.8566 11.368C13.8566 8.83687 15.9085 6.78499 18.4396 6.78499C20.9707 6.78499 23.0226 8.83687 23.0226 11.368C23.0226 13.8991 20.9707 15.951 18.4396 15.951C15.9085 15.951 13.8566 13.8991 13.8566 11.368Z"
        fill="black"
        stroke="white"
        stroke-width="1.22983"
      />
      <path
        d="M18.2572 17.401C18.2572 14.8699 20.3091 12.818 22.8402 12.818C25.3713 12.818 27.4232 14.8699 27.4232 17.401C27.4232 19.9321 25.3713 21.984 22.8402 21.984C20.3091 21.984 18.2572 19.9321 18.2572 17.401Z"
        fill="black"
        stroke="white"
        stroke-width="1.22983"
      />
      <path
        d="M22.0543 27.1111C22.9447 26.286 23.5502 25.1459 23.6826 23.8433C23.9712 21.0029 21.9026 18.4663 19.0622 18.1776C17.7595 18.0452 16.5208 18.4089 15.5334 19.1152L18.7938 23.1131L22.0543 27.1111Z"
        fill="black"
      />
      <path
        d="M21.6519 26.7039C22.444 25.97 22.9826 24.9558 23.1004 23.7971C23.3571 21.2703 21.517 19.0139 18.9903 18.7571C17.8315 18.6393 16.7296 18.9628 15.8513 19.5912"
        stroke="white"
        stroke-width="1.22983"
      />
    </svg>
    <div
      v-else
      class="h-[33px] w-[33px] shrink-0 overflow-hidden md:h-[37px] md:w-[37px] lg:h-[40px] lg:w-[40px]"
    >
      <div
        ref="hostRef"
        class="h-[40px] w-[40px] origin-top-left scale-[0.825] md:scale-[0.925] lg:scale-100"
        aria-hidden="true"
      />
    </div>
    <span
      class="flex flex-col text-[16px] leading-none font-medium md:text-[18px] lg:text-[19.24px]"
      aria-hidden="true"
    >
      <span class="text-black">Open Science</span>
      <span class="text-cream-dark">Foundation</span>
    </span>
  </div>
</template>
