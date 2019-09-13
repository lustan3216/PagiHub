import Vue from 'vue'
import { bus } from '../main'

const KEY_OPEN = 'editOpenBar'
const KEY_CLOSE = 'editCloseBar'

let lastOpenId

export const store = Vue.observable({ currentId: null })

export function emitOpenEditBar(id) {
  store.currentId = id
  bus.$emit(`${KEY_CLOSE}:${lastOpenId}`)
  bus.$emit(`${KEY_OPEN}:${id}`)
  lastOpenId = id
}

export function onOpenEditBar(_this, callback) {
  const id = _this.children[_this.index].id

  bus.$on(`${KEY_CLOSE}:${id}`, () => {
    _this.visible = false
  })
  bus.$on(`${KEY_OPEN}:${id}`, () => {
    _this.visible = true
    callback()
  })
}
