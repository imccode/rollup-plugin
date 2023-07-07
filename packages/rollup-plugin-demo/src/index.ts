import { rollup } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import pkg from '../package.json'
import { dataToEsm } from '@rollup/pluginutils'
import { compileAsync, compileStringAsync } from 'sass'

export default async () => {
  const bundle = await rollup({
    input: 'test/example1/index.ts',
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript(),
      (() => {
        const codes = new Set()
        return {
          name: 'demo',
          options(options) {
            if (typeof options.input === 'string') {
              options.input = { main: options.input }
            }
            const a = dataToEsm(
              {
                a: '123',
                b() {
                  console.log('b')
                }
              },
              {
                preferConst: true,
                objectShorthand: true,
                namedExports: true
              }
            )
            return options
          },
          async transform(code, id) {
            if (/\.(sass|scss)$/i.test(id)) {
              try {
                const result = await compileStringAsync(code, {
                  sourceMap: true
                })
                codes.add(result.css)
                // this.emitFile({
                //   type: 'asset',
                //   fileName: 'style.css',
                //   source: result.css
                // })
              } catch (error) {
                this.error(error)
              }
              return ''
            }
            return code
          }
        }
      })()
    ]
  })

  const { output } = await bundle.generate({})
  console.log(output)

  bundle.write({
    dir: 'dist',
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
    assetFileNames: '[name].ss'
  })
}
