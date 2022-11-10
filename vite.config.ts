import { defineConfig } from 'vite'
import { dirname, join, relative } from 'node:path'

const __dirname = dirname(import.meta.url)
const srcPath = 'src'
const absoluteOptionsPath = join(__dirname, srcPath)
const buildPath = relative(absoluteOptionsPath, join(__dirname, 'build'));
const publicPath = relative(absoluteOptionsPath, join(__dirname, 'static'));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return ({
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    },
    root: srcPath,
    build: {
      rollupOptions: {
        input: {
          content: join(srcPath, 'content/content.ts')
        },
        output: {
          entryFileNames: ({ name }) => {
            if (name === 'content') {
              return '[name].js'
            }

            return 'assets/[name]-[hash].js'
          }
        }
      },
      outDir: buildPath,
      emptyOutDir: true,
      sourcemap: mode === 'development' ? 'inline' : undefined
    },
    publicDir: publicPath,
  })
})
