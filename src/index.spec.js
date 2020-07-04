import execa from 'execa'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { endent } from '@dword-design/functions'

export default {
  'sass import': () => withLocalTmpDir(async () => {
    await outputFiles({
      'depcheck.config.js': endent`
        const sassParser = require('../src')

        module.exports = {
          parsers: {
            '*.scss': sassParser,
          },
        }
      `,
      'node_modules/bar': {
        'dist/index.scss': '',
        'package.json': endent`
          {
            "main": "dist/index.scss"
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
