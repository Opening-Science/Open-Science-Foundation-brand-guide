<script setup lang="ts">
/**
 * Generic p5 formation canvas.
 *
 * Renders the container div the engine mounts its canvas into. Mirrors the
 * sketch wrapper components in reference/sketches/sketches-pretty.js
 * (`wt`/`At`/`Mt`/`zt`: `<div class="absolute inset-0" aria-hidden="true">`,
 * and the hero `jt`, which uses its own wrapper classes — override via
 * `wrapperClass`). SSR-safe by construction: the div renders on the server,
 * p5 is dynamically imported inside onMounted (client only), exactly like the
 * original components.
 *
 * Usage: `<SketchCanvas v-bind="heroFormation" />` or
 * `<SketchCanvas v-bind="valuesFormations[value.animationKey]" />`
 * with the configs exported from `~/composables/formations`.
 */
import { ref } from 'vue'
import { useP5Formation, type FormationFactory } from '~/composables/useP5Formation'

const props = withDefaults(
  defineProps<{
    formation: FormationFactory
    totalCircles: number
    circleSize?: number
    startPausing?: boolean
    idleMs?: number
    baseSize?: number
    fit?: 'cover' | 'contain-square'
    scalePositions?: boolean
    reducedMotion?: 'static' | 'none'
    /** Classes for the container div. Default matches the values sketches. */
    wrapperClass?: string
  }>(),
  {
    wrapperClass: 'absolute inset-0',
  },
)

const containerRef = ref<HTMLElement | null>(null)

useP5Formation({
  containerRef,
  totalCircles: props.totalCircles,
  createFormation: props.formation,
  startPausing: props.startPausing,
  circleSize: props.circleSize,
  idleMs: props.idleMs,
  baseSize: props.baseSize,
  fit: props.fit,
  scalePositions: props.scalePositions,
  reducedMotion: props.reducedMotion,
})
</script>

<template>
  <div ref="containerRef" :class="wrapperClass" aria-hidden="true" />
</template>
