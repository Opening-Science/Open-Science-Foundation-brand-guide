<script setup lang="ts">
// OpenTwin masthead — the page's own identity below the OSF header. The red
// flower mark sits inline with the "OpenTwin" headline (owner-directed
// 2026-07-26: no separate stacked lockup on top; the mark is part of the
// wordmark in the headline). Adapted from the OpenTwin repo SectionHero.vue.
import OtMark from './OtMark.vue'
import { hero } from '~~/data/opentwin'
</script>

<template>
  <section class="container-main">
    <div class="space-y-24 overflow-hidden pt-30 lg:pt-60">
      <p class="font-mono text-sm tracking-[2%] text-cream-darker uppercase">
        A project of the
        <NuxtLink to="/institute/" class="text-black underline transition-colors hover:text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red">
          Open Science Institute
        </NuxtLink>
      </p>

      <div class="flex items-center gap-14 lg:gap-20">
        <OtMark
          variant="duo"
          class="h-44 w-44 shrink-0 text-red sm:h-56 sm:w-56 lg:h-72 lg:w-72"
        />
        <h1 class="text-5xl leading-none text-black sm:text-[4rem] lg:text-[5rem]">
          {{ hero.title }}
        </h1>
      </div>

      <p class="max-w-700 text-3xl text-black">
        Build and validate human digital twins on
        <span class="text-red">open standards</span>
      </p>
      <p class="max-w-700 text-xl text-cream-darker">
        {{ hero.body }}
      </p>
    </div>
  </section>
</template>
