<script setup lang="ts">
useSeoMeta({
  title: 'Using the website starter',
  description: 'How to compose pages and verify them against the admitted OSF website design.',
})
</script>

<template>
  <div class="container-main space-y-80 py-80 lg:space-y-100 lg:py-120">
    <header class="max-w-800">
      <h1 class="text-4xl text-black">Using the website starter</h1>
    </header>
    <section class="max-w-800 space-y-24">
      <h2 class="text-3xl text-black">Start with the content</h2>
      <div class="prose text-1xl text-black">
        <p>Write a page spec that describes its structure and content slots. The existing theme supplies its visual style.</p>
        <p>Read the component specs before choosing a pattern. A new design element goes through the extension workflow.</p>
      </div>
    </section>
    <section class="max-w-800 space-y-24">
      <h2 class="text-3xl text-black">Check the result</h2>
      <p class="text-1xl text-gray">Run the design checks and a static build. Inspect the rendered page at desktop and mobile widths, including focus states and text wrapping.</p>
      <NuxtLink to="/" :class="CTA_CLASS">Back to the example</NuxtLink>
    </section>
  </div>
</template>
