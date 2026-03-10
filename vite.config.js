import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  // 项目基础路径
  base: process.env.NODE_ENV === 'development' ? '/' : './',
  // 构建输出目录
  build: {
    outDir: 'dist',
    // 静态资源目录
    assetsDir: 'static',
    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: {
          'chunk-libs': ['vue']
        }
      }
    }
  },
  // 开发服务器配置
  server: {
    port: process.env.port || process.env.npm_config_port || 8080,
    // 错误和警告显示在浏览器
    overlay: {
      warnings: false,
      errors: true
    },
    // 代理配置
    proxy: {
      [process.env.VUE_APP_NGINX_PATH]: {
        target: process.env.VUE_APP_BASE_API,
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp('^' + process.env.VUE_APP_NGINX_PATH), '')
      }
    }
  },
  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 插件配置
  plugins: [
    vue(),
    // 生产环境下复制并更新 AppManifest.json
    {
      name: 'copy-appmanifest',
      closeBundle() {
        if (process.env.NODE_ENV === 'production') {
          const manifestPath = path.join(__dirname, 'AppManifest.json')
          const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
          const config = JSON.parse(manifestContent)
          config.versionCode += 1
          const updatedContent = JSON.stringify(config, null, 2)
          fs.writeFileSync(manifestPath, updatedContent)
          // 复制到 dist 目录
          const distDir = path.join(__dirname, 'dist')
          if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true })
          }
          const distPath = path.join(distDir, 'AppManifest.json')
          fs.writeFileSync(distPath, updatedContent)
        }
      }
    }
  ]
})