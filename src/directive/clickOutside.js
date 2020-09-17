import Vue from 'vue'
import { on } from 'element-ui/src/utils/dom'

const nodeList = []
const ctx = '@@clickoutsideContext'

let startClick
let seed = 0

!Vue.prototype.$isServer &&
  on(document, 'mousedown', e => {
    startClick = e
  })

!Vue.prototype.$isServer &&
  on(document, 'mouseup', e => {
    nodeList.forEach(node => node[ctx].documentHandler(e, startClick))
  })

function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    if (
      !vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target)))
    ) {
      return
    }

    if (
      binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]
    ) {
      vnode.context[el[ctx].methodName](mouseup)
    }
    else {
      el[ctx].bindingFn && el[ctx].bindingFn(mouseup)
    }
  }
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  bind(el, binding, vnode) {
    if (binding.value) {
      init(el, binding, vnode)
    }
  },

  update(el, binding, vnode) {
    if (binding.value) {
      if (el[ctx] && findIndex(el) > -1) {
        el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
        el[ctx].methodName = binding.expression
        el[ctx].bindingFn = binding.value
      }
      else {
        init(el, binding, vnode)
      }
    }
  },

  unbind: cleanEvent
}

function init(el, binding, vnode) {
  nodeList.push(el)
  const id = seed++

  el[ctx] = {
    id,
    documentHandler: createDocumentHandler(el, binding, vnode),
    methodName: binding.expression,
    bindingFn: binding.value
  }
}

function findIndex(el) {
  return nodeList.findIndex(node => node[ctx].id === el[ctx] && el[ctx].id)
}

function cleanEvent(el) {
  const index = el[ctx] && findIndex(el)
  if (index > -1) {
    nodeList.splice(index, 1)
    delete el[ctx]
  }
}
