import { bus } from '../main'

const KEY = 'editBar'

export function emitCloseEditBar() {
  bus.$emit(KEY)
}

export function onCloseEditBar(fn) {
  bus.$on(KEY, fn)
}
