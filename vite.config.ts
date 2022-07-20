import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'

import path from 'path'

const rootPath = path.resolve(process.cwd())
const srcPath = `${rootPath}/src`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    unocss(),
    Components({
      dts: 'src/typings/components.d.ts',
      dirs: ['src/components'],
      resolvers: [NaiveUiResolver()]
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/typings/vue.d.ts'
    })
  ],
  resolve: {
    alias: {
      '~': rootPath,
      '@': srcPath
    },
    dedupe: ['vue']
  }
})
