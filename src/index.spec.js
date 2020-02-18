import execa from 'execa'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { endent } from '@dword-design/functions'

export default {
  'css import subpath': () => withLocalTmpDir(async () => {
    await outputFiles({
      'depcheck.config.js': endent`
        const sassParser = require('@dword-design/depcheck-sass-parser')

        module.exports = {
          parsers: {
            '*.scss': sassParser,
          },
        }
      `,
      'node_modules/bar/dist/index.css': '',
      'package.json': endent`
        {
          "dependencies": {
            "bar": "^1.0.0"
          }
        }
      `,
      'src/index.scss': '@import \'~bar/dist/index.css\';',
    })
    await execa.command('depcheck --config depcheck.config.js')
  }),
  'css import': () => withLocalTmpDir(async () => {
    await outputFiles({
      'depcheck.config.js': endent`
        const sassParser = require('@dword-design/depcheck-sass-parser')

        module.exports = {
          parsers: {
            '*.scss': sassParser,
          },
        }
      `,
      'node_modules/bar': {
        'index.css': '',
        'package.json': endent`
          {
            "main": "index.css"
          }
        `,
      },
      'package.json': endent`
        {
          "dependencies": {
            "bar": "^1.0.0"
          }
        }
      `,
      'src/index.scss': '@import \'~bar\';',
    })
    await execa.command('depcheck --config ./depcheck.config.js')
  }),
  'sass import': () => withLocalTmpDir(async () => {
    await outputFiles({
      'depcheck.config.js': endent`
        const sassParser = require('@dword-design/depcheck-sass-parser')

        module.exports = {
          parsers: {
            '*.scss': sassParser,
          },
        }
      `,
      'node_modules/bar': {
        'index.scss': '',
        'package.json': endent`
          {
            "main": "index.scss"
          }
        `,
      },
      'package.json': endent`
        {
          "dependencies": {
            "bar": "^1.0.0"
          }
        }
      `,
      'src/index.scss': '@import \'~bar\';',
    })
    await execa.command('depcheck --config ./depcheck.config.js')
  }),
}
