import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'

export default defineConfig(function(configEnv) {
  var mode = configEnv.mode
  var env = loadEnv(mode, process.cwd(), '')
  var VITE_PUBLIC_PATH = env.VITE_PUBLIC_PATH || './'
  var VITE_NGINX_PATH = env.VITE_NGINX_PATH || '/factory/v1'
  var VITE_BASE_API = env.VITE_BASE_API || 'https://192.168.102.22:8301'
  
  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      host: true,
      port: 8080,
      strictPort: false,
      open: true,
      proxy: {
        [VITE_NGINX_PATH]: {
          target: VITE_BASE_API,
          changeOrigin: true,
          secure: false,
          rewrite: function(pathStr) {
            return pathStr.replace(new RegExp('^' + VITE_NGINX_PATH), '')
          }
        }
      },
      cors: true
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            element: ['element-plus', '@element-plus/icons-vue']
          },
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: function(assetInfo) {
            var info = assetInfo.name.split('.')
            var ext = info[info.length - 1]
            if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              return 'static/fonts/[name]-[hash].[ext]'
            }
            if (/\.css$/i.test(assetInfo.name)) {
              return 'static/css/[name]-[hash].[ext]'
            }
            return 'static/[name]-[hash].[ext]'
          }
        }
      },
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2048
    },
    esbuild: mode === 'development' ? undefined : {
      pure: ['console.log'],
      drop: ['debugger'],
      legalComments: 'none'
    },
    plugins: [
      vue(),
      {
        name: 'copy-appmanifest',
        closeBundle: function() {
          if (process.env.NODE_ENV === 'production') {
            var manifestPath = path.join(__dirname, 'AppManifest.json')
            return fs.readFile(manifestPath, 'utf-8').then(function(content) {
              var config = JSON.parse(content)
              config.versionCode = config.versionCode + 1
              var updatedContent = JSON.stringify(config, null, 2)
              return Promise.all([
                fs.writeFile(manifestPath, updatedContent),
                fs.writeFile(path.join(__dirname, 'dist', 'AppManifest.json'), updatedContent)
              ])
            })
          }
        }
      }
    ]
  }
})
