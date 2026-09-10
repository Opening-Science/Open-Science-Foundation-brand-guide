<script setup lang="ts">
// OpenTwin CTA button, folded from the OpenTwin repo (UiButton.vue).
import { computed } from 'vue'
import type { CtaVariant } from '~~/data/opentwin'

const props = withDefaults(
  defineProps<{
    href: string
    variant?: CtaVariant
    external?: boolean
    size?: 'md' | 'sm'
  }>(),
  {
    variant: 'primary',
    external: false,
    size: 'md',
  },
)

const sizeClasses = computed(() =>
  props.size === 'sm' ? 'px-17 py-8 text-base' : 'px-20 py-10 text-xl',
)

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-cream text-black hover:bg-cream-dark'
    case 'tertiary':
      return 'text-black hover:text-red underline underline-offset-4'
    case 'primary':
    default:
      return 'bg-button text-white hover:bg-button-hover'
  }
})
</script>

<template>
  <a
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="inline-flex cursor-pointer items-center justify-center gap-10 rounded-[9px] font-mono font-light transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
    :class="[variantClasses, sizeClasses]"
  >
    <slot />
  </a>
</template>
