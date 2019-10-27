import { bus } from '../main'

const KEY = 'currentSidebar'

export function openSidebar(is, { id } = {}) {
  bus.$emit(KEY, { is, id })
}

export function closeSidebar() {
  bus.$emit(KEY, { is: null })
}

export function onSidebar(fn) {
  bus.$on(KEY, fn)
}
