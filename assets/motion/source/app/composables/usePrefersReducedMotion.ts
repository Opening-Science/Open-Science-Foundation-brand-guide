import { onBeforeUnmount, onMounted, readonly, ref, type Ref } from 'vue'

/**
 * Reactive `prefers-reduced-motion: reduce` media query.
 * SSR-safe: always `false` on the server, resolved on mount and kept in
 * sync with media-query changes.
 */
export function usePrefersReducedMotion(): Readonly<Ref<boolean>> {
  const reduced = ref(false)
  let media: MediaQueryList | null = null

  const onChange = (event: MediaQueryListEvent) => {
    reduced.value = event.matches
  }

  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = media.matches
    media.addEventListener('change', onChange)
  })

  onBeforeUnmount(() => {
    media?.removeEventListener('change', onChange)
    media = null
  })

  return readonly(reduced)
}
