// SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation)
// SPDX-License-Identifier: Apache-2.0
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
const scripts = resolve(dirname(fileURLToPath(import.meta.url)), '../scripts')
function fixture(t, source) {
  const root = mkdtempSync(join(tmpdir(), 'osf-policy-test-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  for (const path of ['app/assets/css', 'app/pages', 'app/components', 'design/components']) mkdirSync(join(root, path), { recursive: true })
  writeFileSync(join(root, 'app/assets/css/main.css'), '@theme {\n--color-black: #1d1d1d;\n--font-body: "Selecta", sans-serif;\n--text-base: 1rem;\n--radius-xl: 0.75rem;\n}\n')
  writeFileSync(join(root, 'design/allowlist.json'), JSON.stringify({ classes: [], cssValues: [] }))
  writeFileSync(join(root, 'app/pages/index.vue'), source)
  return root
}
function run(name, root) {
  return spawnSync(process.execPath, [join(scripts, name), '--root', root], { encoding: 'utf8' })
}
const rejects = [
  ['arbitrary size', '<template><h1 class="text-[123px]">Title</h1></template>', 'design-check.mjs'],
  ['default palette', '<template><h1 class="text-red-500">Title</h1></template>', 'design-check.mjs'],
  ['CSS font size', '<template><h1>Title</h1></template><style>h1 {font-size:123px;}</style>', 'design-policy.mjs'],
  ['CSS padding', '<template><h1>Title</h1></template><style>h1 {padding:1.5rem;}</style>', 'design-policy.mjs'],
  ['CSS line height', '<template><h1>Title</h1></template><style>h1 {line-height:1.7;}</style>', 'design-policy.mjs'],
  ['unadmitted radius', '<template><h1 class="rounded-3xl">Title</h1></template>', 'design-policy.mjs'],
  ['variant radius', '<template><h1 class="md:hover:rounded-t-3xl">Title</h1></template>', 'design-policy.mjs'],
  ['font family', '<template><h1>Title</h1></template><style>h1 {font-family:serif;}</style>', 'design-policy.mjs'],
  ['shadow', '<template><h1>Title</h1></template><style>h1 {box-shadow:1px 1px black;}</style>', 'design-policy.mjs'],
  ['lab link', '<template><a href="/_lab/variant">Lab</a></template>', 'design-check.mjs'],
]
for (const [name, source, script] of rejects) {
  test(`rejects ${name}`, t => {
    const r = run(script, fixture(t, source))
    assert.equal(r.status, 1, r.stdout + r.stderr)
  })
}
test('accepts token CSS and admitted radii', t => {
  const root = fixture(t, '<template><h1 class="text-base text-black rounded-xl">Title</h1></template><style>h1 {font-size:var(--text-base);padding:calc(var(--spacing) * 30);}</style>')
  for (const script of ['design-check.mjs', 'design-policy.mjs']) {
    const r = run(script, root); assert.equal(r.status, 0, r.stderr)
  }
})
test('rejects a component without a spec', t => {
  const root = fixture(t, '<template><h1>Title</h1></template>')
  writeFileSync(join(root, 'app/components/Unapproved.vue'), '<template><div /></template>')
  const r = run('design-check.mjs', root)
  assert.equal(r.status, 1); assert.match(r.stderr, /component without a spec/)
})
test('rejects a stale exception', t => {
  const root = fixture(t, '<template><h1>Title</h1></template>')
  writeFileSync(join(root, 'design/allowlist.json'), JSON.stringify({ classes: [{ value: 'text-[123px]', reason: 'Unused example' }] }))
  const r = run('design-check.mjs', root)
  assert.equal(r.status, 1); assert.match(r.stderr, /no longer used/)
})
for (const [name, html, expected] of [
  ['one h1 and main', '<main><h1>Title</h1></main>', 0],
  ['duplicate h1', '<main><h1>First</h1><h1>Second</h1></main>', 1],
  ['missing main', '<h1>Title</h1>', 1],
  ['lab leak', '<main><h1>Title</h1><a href="/_lab/example">Lab</a></main>', 1],
]) {
  test(`rendered guard: ${name}`, t => {
    const root = fixture(t, '')
    writeFileSync(join(root, 'index.html'), html)
    const r = spawnSync(process.execPath, [join(scripts, 'output-check.mjs'), root], { encoding: 'utf8' })
    assert.equal(r.status, expected, r.stderr)
  })
}
