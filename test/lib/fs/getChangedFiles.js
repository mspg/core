import path from 'path'

import { is } from '@magic/test'

import { getChangedFiles } from '../../../src/lib/fs'

const watchedFiles = {
  [path.join(process.cwd(), 'example', 'public', 'index.html')]: { time: 123 },
  [path.join(process.cwd(), 'example', 'public', 'main.css')]: { time: 123 },
}

const files = watchedFiles

const changedFiles = {
  [path.join(process.cwd(), 'example', 'public', 'index.html')]: { time: 124 },
  [path.join(process.cwd(), 'example', 'public', 'main.css')]: { time: 122 },
}

const expectedFiles = [path.join(process.cwd(), 'example', 'public', 'index.html')]

export default [
  { fn: getChangedFiles({}, {}), expect: is.array, info: 'returns arrays' },
  {
    fn: getChangedFiles(watchedFiles, files),
    expect: is.empty,
    info: 'returns empty array if timestamps are equal',
  },
  {
    fn: getChangedFiles(watchedFiles, changedFiles),
    expect: is.deep.eq(expectedFiles),
    info: 'returns items if time is bigger than in watchedFiles.',
  },
]
