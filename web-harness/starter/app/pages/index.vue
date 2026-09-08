<script setup lang="ts">
useSeoMeta({
  title: 'OSF website starter',
  description: 'A working example composed from the Open Science Foundation website design system.',
})
</script>

<template>
  <div class="container-main space-y-80 py-80 lg:space-y-100 lg:py-120">
    <header class="max-w-800">
      <h1 class="text-4xl text-black">Build with the OSF design system</h1>
    </header>
    <section class="max-w-800 space-y-30">
      <SectionIntro eyebrow="The starting point" headline="A shared design language">
        <p>This starter uses the Open Science Foundation (OSF) website's typography, spacing and component patterns.</p>
      </SectionIntro>
      <NuxtLink to="/guide/" :class="CTA_CLASS">Read the guide</NuxtLink>
    </section>
    <section class="max-w-800 space-y-24">
      <h2 class="text-3xl text-black">Compose your pages</h2>
      <p class="text-1xl text-gray">Replace the example copy with your project content. Reuse the admitted components and check each page at desktop and mobile widths.</p>
      <div class="flex flex-wrap gap-8">
        <Tag variant="outline">Open research</Tag>
        <Tag variant="outline">Shared methods</Tag>
      </div>
    </section>
  </div>
</template>
