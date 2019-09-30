import { bus } from '../main'

const KEY = 'visibleChange'

export function emitVisibleChange(id, { visible }) {
  bus.$emit(`${KEY}:${id}`, {
    visible
  })
}

export function onVisibleChange(id, fn) {
  bus.$on(`${KEY}:${id}`, fn)
}
