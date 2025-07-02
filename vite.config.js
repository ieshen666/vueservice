import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 代理所有以 /api 开头的请求
      '/api': {
        target: 'http://10.1.162.167:8001', // 你的 OpenStack Keystone 地址
        changeOrigin: true, // 修改请求头中的 Host 为目标地址
        rewrite: (path) => path.replace(/^\/api/, ''), // 移除 /api 前缀
        // 可选：添加必要的请求头（如 OpenStack 需要）
        headers: {
          'Content-Type': 'application/json',
        },
      }
    }
  }
})