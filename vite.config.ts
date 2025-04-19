import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path' // 确保已导入 path 模块

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  build: {
    outDir: 'dist',
    target: 'esnext'
  },  
  server: {
    host: '0.0.0.0',  // 监听所有网络接口
    port: 3000,       // 端口号
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 关键配置
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,  // 启用 Less 的 JavaScript 特性
      }
    }
  },

})

