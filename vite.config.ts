import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    include: [
      '@workday/canvas-kit-react',
      '@workday/canvas-kit-react/button',
      '@workday/canvas-kit-react/card',
      '@workday/canvas-kit-react/text',
      '@workday/canvas-kit-react/text-input',
      '@workday/canvas-kit-react/select',
      '@workday/canvas-kit-react/table',
      '@workday/canvas-kit-react/banner',
      '@workday/canvas-kit-react/toast',
      '@workday/canvas-kit-react/tabs',
      '@workday/canvas-kit-react/icon',
      '@workday/canvas-kit-react/breadcrumbs',
      '@workday/canvas-kit-react/checkbox',
      '@workday/canvas-kit-react/radio',
      '@workday/canvas-kit-react/switch',
      '@workday/canvas-kit-react/text-area',
      '@workday/canvas-kit-react/tooltip',
      '@workday/canvas-kit-react/menu',
      '@workday/canvas-kit-react/pagination',
      '@workday/canvas-kit-react/form-field',
      '@workday/canvas-kit-preview-react',
      '@workday/canvas-kit-react-fonts',
      '@workday/canvas-tokens-web'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'canvas-kit': [
            '@workday/canvas-kit-react',
            '@workday/canvas-kit-preview-react'
          ],
          'canvas-icons': [
            '@workday/canvas-system-icons-web',
            '@workday/canvas-accent-icons-web',
            '@workday/canvas-applet-icons-web'
          ],
          'vendor': ['react', 'react-dom', 'axios']
        }
      }
    }
  }
})