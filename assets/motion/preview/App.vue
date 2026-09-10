<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: Apache-2.0 -->
<script setup>
import { ref } from 'vue'
import SketchCanvas from '../source/app/components/sketch/SketchCanvas.vue'
import LogoMark from '../source/app/components/sketch/LogoMark.vue'
import { heroFormation, valuesFormations } from '../source/app/composables/formations'
const items = [{ key: 'hero', name: 'Hero rings', config: heroFormation }, ...Object.entries(valuesFormations).map(([key, config]) => ({ key, name: key[0].toUpperCase()+key.slice(1), config }))]
const paused = ref(false)
function toggle() { paused.value = !paused.value; window.setMotionPaused(paused.value) }
</script>
<template>
  <header><p class="meta">OPEN SCIENCE FOUNDATION / 10 SEPTEMBER 2026</p><h1>Identity in motion.</h1><p>Six original website animations, with their source and motion settings preserved.</p><button type="button" @click="toggle" :aria-pressed="paused">{{ paused ? 'Resume motion' : 'Pause motion' }}</button> <a href="https://github.com/Opening-Science/Open-Science-Foundation-brand-guide">Repository guide</a></header>
  <main>
    <article v-for="item in items" :key="item.key" :id="item.key"><h2>{{ item.name }}</h2><div class="stage"><SketchCanvas v-bind="item.config" wrapper-class="motion-stage" /></div><p class="meta">{{ item.config.totalCircles }} particles · {{ item.config.idleMs || 4000 }} ms idle</p></article>
    <article id="logo"><h2>Interactive logo</h2><div class="stage logo-stage"><LogoMark /></div><p class="meta">Hover the mark to cycle formations</p></article>
  </main>
  <footer><p>The operating system's reduced-motion preference is respected by the original components. The hero is omitted, value sketches stop, and the small mark becomes static. GIF and MP4 exports have no automatic reduced-motion behaviour.</p><p>Source code: MIT. Names, marks and recorded media retain separate rights. No commercial font files are included. The gallery uses installed OSF fonts; a system fallback is for source inspection only.</p></footer>
</template>
