import store from '../store'
import { GRID_ITEM, TAG } from '../const'
import { findFirstCommonParentTree } from './node'
export const vmMap = {}

window.vmMap = vmMap

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
  const _vm = vm(id)
  return _vm && _vm.$el
}

export function assignStyles(id, styles) {
  vm(id).assignStyles(styles)
}

export function vmCreateItem({ id }) {
  // layers, grid-generator, carousel, form-generator
  // can new layer-item, grid-item, carousel-item, form-item
  vm(id)._createEmptyItem()
}

export function vmCopyNode(node) {
  // other kind of templates

  // the convention is, if the parent is a node can new, then it must be
  const { id, parentId } = node
  const parentNode = store.state.draft.nodesMap[parentId]

  if (parentNode.canNewItem) {
    // if parentNode can new item, it means the node is one of layer-item, grid-item, carousel-item, form-item
    vm(parentId)._copy(id)
  } else {
    // if parentNode can not new item, it means the node is a child of layer-item, grid-item, carousel-item, form-item
    const grandParentId = parentNode.parentId
    vm(grandParentId)._copy(parentId)
  }
}

export function vmRemoveNode({ id, parentId }) {
  vm(parentId)._remove(id)
}

export function vmAddNodesToParentAndRecord(id, nodes) {
  vm(id)._addNodesToParentAndRecord(nodes)
}

export function vmPasteCopyComponents(id) {
  const nodesMap = store.state.draft.nodesMap
  const copyIds = store.state.app.copyComponentIds
  const onlyOneCopyId = copyIds.length === 1 && copyIds[0]
  const onlyOneCopyNode = onlyOneCopyId ? nodesMap[onlyOneCopyId] : null

  if (onlyOneCopyId === id) {
    vmCopyNode(onlyOneCopyNode)
  } else if (nodesMap[id].tag === GRID_ITEM) {
    if (onlyOneCopyNode && onlyOneCopyNode[TAG] !== GRID_ITEM) {
      vm(id)._addNodesToParentAndRecord(onlyOneCopyNode)
    } else if (copyIds.length > 1) {
      const tree = findFirstCommonParentTree(copyIds)
      vm(id)._addNodesToParentAndRecord(tree)
    }
  }
}

export function isThisTag(id, tag) {
  return vm(id).$options._componentTag === tag
}
