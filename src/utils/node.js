import Vue from 'vue'

export function parseNode(h, child) {
  if (typeof child === 'string') {
    return Vue.prototype._v(child)
  }

  const { tag, data, children } = child
  return h(tag, { ...data }, parseNodeChildren(h, children))
}

export function parseNodeChildren (h, children = []) {
  return children.map(child => parseNode(h, child))
}
