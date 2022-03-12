import doRules from './lib.js'

const suffixes = [
  null,
  {
    y: 'ily'
  },
  {
    ly: 'ly',//unchanged
    ic: 'ically'
  },
  {
    ial: 'ially',
    ual: 'ually',
    tle: 'tly',
    ble: 'bly',
    ple: 'ply',
    ary: 'arily',
  },
  {},
  {},
  {},
]

const exceptions = {
  full: 'fully',
}

// a lot of adjectives *don't really* have a adverb
// 'roomy' -> 'roomily'
// but here, conjugate what it would be, if it made sense to
const toAdverb = function (str) {
  if (exceptions.hasOwnProperty(str)) {
    return exceptions[str]
  }
  let res = doRules(str, suffixes)
  if (res) {
    return res
  }
  return str + 'ly'
}
export default toAdverb
// console.log(toAdverb('unsightly'))