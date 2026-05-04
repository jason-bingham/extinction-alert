// Builds the background service worker (ES module) and content script (IIFE)
// as self-contained bundles using Vite's programmatic API.
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

await build({
  configFile: false,
  root,
  plugins: [],
  build: {
    outDir: resolve(root, 'dist'),
    emptyOutDir: false,
    rollupOptions: {
      input: { background: resolve(root, 'src/background/worker.js') },
      output: {
        format: 'es',
        entryFileNames: 'background/worker.js',
        chunkFileNames: 'background/chunks/[name].js',
      }
    }
  }
})

await build({
  configFile: false,
  root,
  plugins: [react()],
  build: {
    outDir: resolve(root, 'dist'),
    emptyOutDir: false,
    rollupOptions: {
      input: { content: resolve(root, 'src/content/index.jsx') },
      output: {
        format: 'iife',
        entryFileNames: 'content/index.js',
        inlineDynamicImports: true,
        name: 'extinctionContent',
      }
    }
  }
})
