import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

function copyManifest() {
  return {
    name: 'copy-manifest',
    writeBundle() {
      copyFileSync(
        resolve(__dirname, 'manifest.json'),
        resolve(__dirname, 'dist/manifest.json')
      )
    }
  }
}

// Builds the popup React app (ES modules, Vite default processing).
// Background worker and content script are built separately via build-scripts.mjs.
export default defineConfig({
  root: 'src',
  base: './',
  publicDir: resolve(__dirname, 'public'),
  plugins: [react(), copyManifest()],
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
      }
    }
  }
})
