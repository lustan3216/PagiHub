import { bus } from '../main'

const KEY = 'gridItemResize'

export function emitResize(id, ...args) {
  bus.$emit(`${KEY}:${id}`, {
    i: args[0][0],
    newH: args[0][1],
    newW: args[0][2],
    newHPx: args[0][3],
    newWPx: args[0][4]
  })
}

export function onResize(id, fn) {
  bus.$on(`${KEY}:${id}`, fn)
}
