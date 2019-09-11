import { bus } from '../main'

const KEY = 'currentSidebar'

export function openSidebar(is, { id, styles } = {}) {
  bus.$emit(KEY, { is, id, styles })
}

export function closeSidebar() {
  bus.$emit(KEY, { is: null })
}

export function onSidebar(fn) {
  bus.$on(KEY, fn)
}
