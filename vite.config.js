import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 基础路径配置（空字符串表示根路径，适配 /lowcode-designer 路由）
  base: '',
  server: {
    // 允许通过 127.0.0.1 访问
    host: '0.0.0.0',
    port: 5173,
    // 开启跨域（若对接后端 API 需要）
    cors: true
  },
  build: {
    // 构建优化
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 分包策略，优化打包体积
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  }
})