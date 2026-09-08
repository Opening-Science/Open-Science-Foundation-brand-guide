// SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation)
// SPDX-License-Identifier: Apache-2.0
// Additional, deliberately bounded policy checks alongside the upstream scanner.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const flag = process.argv.indexOf('--root')
const root = flag < 0 ? resolve(dirname(fileURLToPath(import.meta.url)), '..') : resolve(process.argv[flag + 1])
const main = join(root, 'app/assets/css/main.css')
if (!existsSync(main)) throw new Error('Missing canonical app/assets/css/main.css')
const theme = readFileSync(main, 'utf8')
if (!/@theme\s*\{/.test(theme) || !/--color-[\w-]+\s*:/.test(theme)) throw new Error('Missing canonical theme or palette')
const radii = new Set([...theme.matchAll(/--radius-([\w-]+)\s*:/g)].map(m => m[1]))
const allow = JSON.parse(readFileSync(join(root, 'design/allowlist.json'), 'utf8'))
const allowed = new Set((allow.classes ?? []).map(x => x.value))
const errors = []
const clean = text => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '')
const report = (file, message) => errors.push(`${relative(root, file)}: ${message}`)
function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const path = join(dir, e.name)
    if (e.isSymbolicLink()) { report(path, 'Source symlinks are not supported'); return [] }
    return e.isDirectory() ? walk(path) : /\.(vue|css|ts|tsx)$/.test(path) ? [path] : []
  })
}
function checkCSS(file, css) {
  // The canonical stylesheet preserves production base rules verbatim. Its
  // distribution hash is verified separately; editing it requires review.
  if (file === main) return
  for (const m of clean(css).matchAll(/([\w-]+)\s*:\s*([^;{}]+)(?:;|(?=\}))/g)) {
    const property = m[1].toLowerCase(), value = m[2].trim()
    const geometry = /^(?:min-|max-)?(?:width|height)$/.test(property)
    const dimensional = geometry || /^(?:font-size|line-height|letter-spacing|word-spacing|text-indent|text-underline-offset|border(?:-[\w]+)?-(?:width|radius)|border-radius|margin(?:-[\w]+)?|padding(?:-[\w]+)?|(?:row-|column-)?gap)$/.test(property)
    if (dimensional && /(?:\d|\.\d)(?:px|r?em|vh|vw|vmin|vmax|ch|ex|pt|cm|mm|in)\b/i.test(value)) {
      report(file, `Raw CSS dimension in ${property}: ${value}; use a token`)
    }
    if (dimensional && !geometry && /\d%/.test(value)) report(file, `Raw CSS percentage in ${property}: ${value}`)
    if (property === 'line-height' && /^(?:\d*\.)?\d+$/.test(value) && Number(value) !== 0) report(file, `Raw line-height: ${value}`)
    if (property === 'font-family' && !/^(?:var\(--font-[\w-]+\)|inherit)$/.test(value)) report(file, `Unadmitted font family: ${value}`)
    if (property === 'box-shadow' && value !== 'none') report(file, 'The OSF theme defines no shadow tokens')
  }
}
for (const file of walk(join(root, 'app'))) {
  if (relative(root, file).replaceAll('\\', '/').startsWith('app/pages/_lab/')) continue
  const source = clean(readFileSync(file, 'utf8'))
  if (file.endsWith('.css')) checkCSS(file, source)
  else {
    for (const style of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) checkCSS(file, style[1])
    // Static class tokens, including Vue script recipes. As with the upstream
    // scanner, dynamically assembled classes require rendered verification.
    const withoutLineComments = source.replace(/(^|\n)\s*\/\/[^\n]*/g, '$1')
    for (const m of withoutLineComments.matchAll(/\brounded(?:-[\w]+)*\b/g)) {
      const token = m[0]
      const suffix = token.replace(/^rounded(?:-(?:t|r|b|l|s|e|tl|tr|bl|br|ss|se|es|ee))?(?:-|$)/, '')
      if (['full', 'none'].includes(suffix) || radii.has(suffix) || allowed.has(token)) continue
      // Arbitrary utilities are handled by the upstream allowlist scanner.
      if (withoutLineComments[m.index + token.length] === '-' && withoutLineComments[m.index + token.length + 1] === '[') continue
      report(file, `Radius outside @theme: ${token}`)
    }
    if (/\b(?:text|bg|border|ring|fill|stroke)-red\b/.test(withoutLineComments)) report(file, 'The red token is reserved for OpenTwin, outside this OSF starter')
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log('design-policy: clean (CSS dimensions, font families, radii, shadows and scoped red)')
