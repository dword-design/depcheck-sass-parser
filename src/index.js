import getPackageName from 'get-package-name'
import requirePackageName from 'require-package-name'
import importer from '@dword-design/node-sass-importer'
import sass from 'node-sass'
import { map, uniq, compact, replace } from '@dword-design/functions'
import P from 'path'

export default filePath => {
  const { stats } = sass.renderSync({ file: filePath, importer })

  return stats.includedFiles
    |> map(path => path[0] === '~'
      ? requirePackageName(path.substr(1))
      // fix node-sass incorrect path format for windows
      : getPackageName(path |> replace(/\//g, P.sep)),
    )
    |> compact
    |> uniq
}
