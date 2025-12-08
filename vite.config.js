import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`[Vite 配置] 创建目录：${dirPath}`)
  }
}

export default defineConfig(({ mode }) => {
  // 正确加载对应环境的环境变量
  const env = loadEnv(mode, process.cwd())
  const isDevelopment = mode === 'development'
  const isProduction = mode === 'production'

  const outputDir = path.resolve(__dirname, '../../Icent_LowCode/lowcode/static/lowcode_designer/assets')
  ensureDirExists(outputDir)

  return {
    plugins: [
      vue() // 移除错误的 isCustomElement 配置
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@assets': path.resolve(__dirname, 'src/assets')
      },
      extensions: ['.vue', '.js', '.jsx', '.json']
    },

    // 开发环境使用相对根路径，避免资源路径异常
    base: isDevelopment 
      ? '/'  
      : '/static/lowcode_designer/assets/',

    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT || 5173,
      open: false,
      cors: true,
      watch: {
        // 可选：通过环境变量控制轮询，默认关闭
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
      lib: isProduction ? {
        entry: path.resolve(__dirname, 'src/main.js'),
        name: 'LowcodeDesigner',
        fileName: (format) => `lowcode-designer.${format}.js`,
        formats: ['es', 'umd']
      } : undefined,

      outDir: outputDir,
      emptyOutDir: isProduction,
      assetsDir: '',
      chunkSizeWarningLimit: 1500,
      manifest: true,
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.warn']
        },
        format: {
          comments: false
        }
      } : {},
      sourcemap: isDevelopment,
      target: 'es2020',
      rollupOptions: {
        // 生产环境外部化核心依赖，开发环境不外部化
        external: isProduction ? ['vue', 'element-plus', '@element-plus/icons-vue'] : [],
        output: {
          globals: isProduction ? {
            vue: 'Vue',
            'element-plus': 'ElementPlus',
            '@element-plus/icons-vue': 'ElementPlusIconsVue'
          } : {},
          // 核心修改：仅开发环境启用 manualChunks，生产环境（lib模式）移除
          ...(isDevelopment ? {
            manualChunks: (id) => {
              if (id.includes('node_modules')) {
                const packageName = id.toString().split('node_modules/')[1].split('/')[0]
                if (packageName.includes('element-plus')) {
                  return 'element-plus-vendor'
                }
                return 'vendor'
              }
            }
          } : {}),
          assetFileNames: '[name].[hash].[ext]',
          chunkFileNames: '[name].[hash].js',
          entryFileNames: '[name].[hash].js'
        },
        onwarn: (warning, warn) => {
          if (warning.code === 'CIRCULAR_DEPENDENCY') {
            return
          }
          warn(warning)
        }
      }
    },

    css: {
      devSourcemap: isDevelopment,
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/variables.scss";'
        }
      },
      postcss: {
        plugins: []
      }
    },

    // 预构建核心依赖，移除强制预构建
    optimizeDeps: {
      include: ['vue', 'element-plus', '@element-plus/icons-vue'],
      exclude: []
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