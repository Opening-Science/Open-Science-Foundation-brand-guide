<template>
  <header>
    <SkipLink />
    <nav class="container-main flex gap-24 py-20 font-mono text-sm" aria-label="Main">
      <NuxtLink to="/" class="text-black hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Home</NuxtLink>
      <NuxtLink to="/guide/" class="text-black hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Guide</NuxtLink>
    </nav>
  </header>
  <main id="main-content" tabindex="-1">
    <NuxtPage />
  </main>
  <footer class="container-main mt-100 pb-40 font-mono text-sm text-gray">
    An example built with the OSF website harness.
  </footer>
</template>
