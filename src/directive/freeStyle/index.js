import { generateStyleBlock } from './parser'

export const FREE_STYLE = '@@FREE_STYLE'
window[FREE_STYLE] = window[FREE_STYLE] || {}

const fn = function(element, binding, vnode) {
  if (binding.value) {
    vnode.context.$nextTick(function() {
      generateStyleBlock(vnode.context._uid, element, binding.value.trim())
    })
  } else {
    const el = window[FREE_STYLE][vnode.context._uid]

    if (el) {
      el.remove()
    }
  }
}

const directive = {
  bind: fn,
  update: fn,
  unbind: fn
}
export default directive
