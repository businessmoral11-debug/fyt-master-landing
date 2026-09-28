import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  // Normally '/wp-content/react-home/' for the WordPress-embedded production
  // site — every asset URL gets that prefix baked in at build time. A
  // standalone Vercel deployment at a root domain (e.g. a preview/testing
  // URL) needs this to be '/' instead, or the browser requests assets at a
  // path that doesn't exist there and gets a 404 → SPA-rewrite → HTML
  // instead of JS. Set VITE_BASE_PATH=/ in that Vercel project's
  // Environment Variables to override it — the WordPress embed is
  // unaffected since it doesn't set that variable.
  base: process.env.VITE_BASE_PATH || '/wp-content/react-home/',
  
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
    process.env.ANALYZE === 'true' &&
      visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true, template: 'treemap' }),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) return 'three-vendor'
        },
      },
    },
  },

  server: {
    allowedHosts: ['.trycloudflare.com'],
  },
})
