import { spawn } from 'child-process-promise'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { endent } from '@dword-design/functions'

export default () => withLocalTmpDir(__dirname, async () => {
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
      'package.json': JSON.stringify({ main: 'index.css' }),
    },
    'package.json': JSON.stringify({
      dependencies: {
        'bar': '^1.0.0',
      },
    }),
    'src/index.scss': '@import \'~bar\';',
  })
  await spawn('depcheck', ['--config', './depcheck.config.js', '.'])
})
