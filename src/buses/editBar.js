import Vue from 'vue'
import { bus } from '../main'

export const store = Vue.observable({ currentIds: [] })

export function isEditBarVisible(id) {
  return store.currentIds.includes(id)
}

export function openEditBarById(ids = []) {
  ids = Array.toArray(ids)
  if (ids.join() === store.currentIds.join()) {
    closeEditBar()
  } else {
    store.currentIds = ids
  }
}

function closeEditBar() {
  store.currentIds = []
}

const KEY_CLOSE = 'editBarClose'

export function emitCloseEditBar() {
  bus.$emit(KEY_CLOSE)
}

const KEY_EDIT_BAR_FUNCTION = 'editBarFunction'

export function emitEditBarFn(id, { type, childId }) {
  closeEditBar()
  bus.$emit(`${KEY_EDIT_BAR_FUNCTION}:${id}`, { type, childId })
}

export function onEditBarFn(id, fn) {
  bus.$on(`${KEY_EDIT_BAR_FUNCTION}:${id}`, fn)
}
