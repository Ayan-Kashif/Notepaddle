// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });

// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html', // 👈 THIS IS IMPORTANT
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    minify: 'esbuild',
    target: 'esnext',
    outDir: 'dist',
    cssCodeSplit: true,
  },
})


