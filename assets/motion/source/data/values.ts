// Content extracted EXACTLY from the original site
// (mirror/_nuxt/CgELFgRX.js `values` object / reference/dom/home.html).

export type ValueAnimationKey =
  | 'openness'
  | 'transparency'
  | 'collaboration'
  | 'reproducibility'

export interface ValueKeyword {
  heading: string
  description: string
  animationKey: ValueAnimationKey
}



export const values: ValueKeyword[] = [
  {
    heading: 'Openness',
    description: 'Making knowledge accessible to all.',
    animationKey: 'openness',
  },
  {
    heading: 'Transparency',
    description: 'Sharing the work and processes, not just the result.',
    animationKey: 'transparency',
  },
  {
    heading: 'Collaboration',
    description: 'Pooling minds, data, and momentum on shared infrastructure.',
    animationKey: 'collaboration',
  },
  {
    heading: 'Reproducibility',
    description: 'Building on the solid tree of knowledge together.',
    animationKey: 'reproducibility',
  },
]
