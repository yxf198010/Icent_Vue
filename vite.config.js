//vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

// 动态加载 Monaco（仅示例，实际使用请在组件中调用）
const initMonaco = async () => {
  const monaco = await import('monaco-editor')
  // ...
}

const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`[Vite 配置] 创建目录：${dirPath}`)
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isDevelopment = mode === 'development'
  const isProduction = mode === 'production'

  const outputDir = path.resolve(__dirname, '../../Icent_LowCode/lowcode/static/lowcode_designer')
  ensureDirExists(outputDir)

  return {
    plugins: [vue()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@assets': path.resolve(__dirname, 'src/assets')
      },
      extensions: ['.vue', '.js', '.jsx', '.json']
    },

    base: isDevelopment 
      ? '/'  
      : '/static/lowcode_designer/',

    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT || 5173,
      open: false,
      cors: true,
      watch: {
        usePolling: env.VITE_WATCH_POLLING === 'true',
        interval: 100,
        ignored: ['**/node_modules/**', '**/dist/**']
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api/v1')
        },
        '/static': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false
        }
      },
      https: false
    },

    build: {
      outDir: outputDir,
      emptyOutDir: isProduction, // 仅生产清空
      assetsDir: 'assets',
      chunkSizeWarningLimit: 1500,
      manifest: true,
      ssr: false, // 👈 显式关闭
      sourcemap: false,
      minify: 'esbuild',
      target: 'es2020',

      rollupOptions: {
        // 👇 关键：显式指定入口，确保 manifest 正确生成
        input: path.resolve(__dirname, 'src/main.js'), // 改为字符串,

        output: {
          // 开发环境可启用 manualChunks（当前禁用以简化）
          ...(isDevelopment ? {
            manualChunks: undefined
          } : {}),

          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`
        },

        onwarn: (warning, warn) => {
          if (warning.code === 'CIRCULAR_DEPENDENCY') return
          warn(warning)
        }
      }
    },

    css: {
      devSourcemap: isDevelopment,
      preprocessorOptions: {
        scss: {}
      },
      postcss: {
        plugins: []
      }
    },

    optimizeDeps: {
      include: ['vue', 'element-plus', '@element-plus/icons-vue'],
      exclude: ['monaco-editor'] // 防止预构建导致 OOM
    },

    logLevel: isDevelopment ? 'info' : 'warn',

    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        VITE_API_URL: JSON.stringify(env.VITE_API_URL || 'http://127.0.0.1:8000')
      }
    }
  }
})