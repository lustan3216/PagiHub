import Vue from 'vue'
import { bus } from '../main'

const KEY = 'editBar'

export const store = Vue.observable({ currentId: null })

export function emitOpenEditBar(id, { types = ['new', 'remove', 'copy', 'setting'] } = {}) {
  bus.$emit(KEY, { id, types })
}

export function onOpenEditBar(fn) {
  bus.$on(KEY, fn)
}

const KEY_CLOSE = 'editBarClose'

export function emitCloseEditBar() {
  bus.$emit(KEY_CLOSE)
}

export function onCloseEditBar(fn) {
  bus.$on(KEY_CLOSE, fn)
}

const KEY_EDIT_BAR_FUNCTION = 'editBarFunction'

export function emitEditBarFn(id, { type, childId }) {
  bus.$emit(`${KEY_EDIT_BAR_FUNCTION}:${id}`, { type, childId })
}

export function onEditBarFn(id, fn) {
  bus.$on(`${KEY_EDIT_BAR_FUNCTION}:${id}`, fn)
}
