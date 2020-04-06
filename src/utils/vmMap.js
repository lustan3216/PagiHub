import store from '../store'
export const vmMap = {}

export function vm(id) {
  return vmMap[id]
}

export function vmAppend(vm) {
  vmMap[vm.id] = vm
}

export function vmRemove(vm) {
  delete vmMap[vm.id]
}

export function getComputedStyle(id) {
  return window.getComputedStyle($element(id))
}

export function getPlanStyle(id) {
  return $element(id).getAttribute('style')
}

export function $element(id) {
  return vm(id).$el
}

export function assignStyles(id, styles) {
  vm(id).assignStyles(styles)
}

export function vmCreateItem({ id }) {
  // layers, grid-generator, carousel, form-generator
  // can new layer-item, grid-item, carousel-item, form-item
  vm(id).create()
}

export function vmCopyNode(node) {
  // other kind of templates

  // the convention is, if the parent is a node can new, then it must be
  const { id, parentId } = node
  const parentNode = store.state.draft.nodesMap[parentId]

  if (parentNode.canNewItem) {
    // if parentNode can new item, it means the node is one of layer-item, grid-item, carousel-item, form-item
    vm(parentId).copy(id)
  } else {
    // if parentNode can not new item, it means the node is a child of layer-item, grid-item, carousel-item, form-item
    const grandParentId = parentNode.parentId
    vm(grandParentId).copy(parentId)
  }
}

export function vmRemoveNode({ id, parentId }) {
  vm(parentId).remove(id)
}
