// SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation)
// SPDX-License-Identifier: Apache-2.0
import { createApp } from 'vue'
import P5 from 'p5'
import App from './App.vue'
import './style.css'
const instances = new Set()
const capture = new URLSearchParams(location.search).has('capture')
const createCanvas = P5.prototype.createCanvas
P5.prototype.createCanvas = function (...args) {
  const result = createCanvas.apply(this, args)
  instances.add(this)
  if (capture) this.noLoop()
  return result
}
window.setMotionPaused = paused => {
  for (const p of instances) {
    if (paused) p.noLoop()
    else if (!matchMedia('(prefers-reduced-motion: reduce)').matches) p.loop()
  }
}
// Optional deterministic capture mode. Original source files stay unchanged.
if (capture) {
  window.__motionTime = 0
  window.__motionInstances = instances
  P5.prototype.millis = function () { return window.__motionTime }
  window.renderMotionAt = async (ms) => {
    window.__motionTime = ms
    for (const p of instances) { p.frameCount = Math.round(ms * 60 / 1000); await p.redraw() }
  }
}
createApp(App).mount('#app')
