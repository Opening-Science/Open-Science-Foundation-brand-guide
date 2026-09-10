// SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation)
// SPDX-License-Identifier: Apache-2.0
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: { alias: { '~': fileURLToPath(new URL('./source/app', import.meta.url)) } },
})
