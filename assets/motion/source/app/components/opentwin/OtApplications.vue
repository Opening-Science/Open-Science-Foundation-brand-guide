<script setup lang="ts">
// OpenTwin "Implementations" — status-tagged application cards. Folded from
// the OpenTwin repo SectionApplications.vue.
import OtEyebrow from './OtEyebrow.vue'
import { applications, type ApplicationStatus } from '~~/data/opentwin'

const statusLabel = (s: ApplicationStatus) => {
  switch (s) {
    case 'active':
      return 'Active'
    case 'upcoming':
      return 'Coming soon'
    case 'placeholder':
      return 'To be added'
  }
}

const statusColor = (s: ApplicationStatus) => {
  switch (s) {
    case 'active':
      return 'text-red'
    case 'upcoming':
      return 'text-cream-darker'
    case 'placeholder':
      // cream-darker, not cream-dark: the status is real text and cream-dark
      // sits at 1.6:1 on this ground (review C20, 2026-08-31).
      return 'text-cream-darker'
  }
}
</script>

<template>
  <section :id="applications.id" class="container-main">
    <div class="space-y-40 lg:space-y-60">
      <div class="space-y-24 lg:max-w-800">
        <OtEyebrow>{{ applications.eyebrow }}</OtEyebrow>
        <h2 class="text-3xl text-black lg:text-4xl">{{ applications.title }}</h2>
        <p class="text-xl text-cream-darker">{{ applications.intro }}</p>
      </div>

      <ul class="grid grid-cols-1 gap-30 lg:grid-cols-3">
        <li
          v-for="app in applications.items"
          :key="app.title"
          class="flex flex-col gap-20 rounded-2xl border border-cream bg-cream p-30 transition-colors hover:border-cream-dark lg:aspect-[4/5] lg:p-40"
        >
          <p class="font-mono text-sm font-bold tracking-[2%] uppercase" :class="statusColor(app.status)">
            {{ statusLabel(app.status) }}
          </p>
          <h3 class="text-2xl text-black lg:text-3xl">{{ app.title }}</h3>
          <p class="flex-1 text-xl text-cream-darker">{{ app.body }}</p>
          <a
            v-if="app.url"
            :href="app.url"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono text-base font-light text-black transition-colors hover:text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
          >
            ↗ Visit project
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
