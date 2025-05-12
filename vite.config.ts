import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
   base: './',
  plugins: [vue()],
  build: {
    outDir: 'dist',
    target: 'esnext'
  },  
  server: {
    host: '0.0.0.0', 
    port: 3000,      
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') 
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,  
      }
    }
  },

})

