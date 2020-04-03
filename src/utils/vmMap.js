import store from '../store'
export const vmMap = {}

window.vmMap = vmMap

export function vmAppend(vm) {
  vmMap[vm.id] = vm
}

export function vmRemove(vm) {
  delete vmMap[vm.id]
}

export function getComputedStyle(id) {
  return window.getComputedStyle(vmMap[id].$el)
}

export function getPlanStyle(id) {
  return vmMap[id].$el.getAttribute('style')
}

export function assignStyles(id, styles) {
  vmMap[id].assignStyles(styles)
}

export function vmNewNode({ id }) {
  // layers, grid-generator, carousel, form-generator
  // can new layer-item, grid-item, carousel-item, form-item
  vmMap[id].new()
}

export function vmCopyNode(node) {
  // other kind of templates

  // the convention is, if the parent is a node can new, then it must be
  const { id, parentId } = node
  const parentNode = store.state.nodes.nodesMap[parentId]
  if (parentNode.canNewItem) {
    // if parentNode can new item, it means the node is one of layer-item, grid-item, carousel-item, form-item
    vmMap[parentId].copy(id)
  } else {
    // if parentNode can not new item, it means the node is a child of layer-item, grid-item, carousel-item, form-item
    const grandParentId = parentNode.parentId
    vmMap[grandParentId].copy(parentId)
  }
}

export function vmRemoveNode({ id, parentId }) {
  vmMap[parentId].remove(id)
}
