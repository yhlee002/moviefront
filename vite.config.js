import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 80,
    // proxy: {
    //   '/api': {
    //     target: `http://10.0.3.80:8080/api`,
    //     changeOrigin: true,
    //   }
    // }
  },
  plugins: [
    vue(),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    // alias: require('./alias.config.js').webpack,
    extensions: ['.js', '.vue']
  }
})
