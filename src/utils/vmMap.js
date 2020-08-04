import store from '../store'
import { CAN_NEW_ITEM, GRID_ITEM, TAG } from '../const'
import { isGridItem } from '@/utils/node'
import jsonHistory from '@/store/jsonHistory'

const vmMap = {}

export default vmMap
if (process.env.NODE_ENV !== 'production') {
  window.vmMap = vmMap
}

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
  const _vm = vm(id)
  if (!_vm) {
    return {}
  }
  const isForm = /^form/.test(_vm.$options._componentTag)
  let el

  if (isForm) {
    const field = _vm.api.fields()[0]
    el = _vm.api.el(field).$el
  } else {
    el = document.querySelector(`[data-style-id="${id}"]`)
  }

  return window.getComputedStyle(el) || {}
}

export function getPlanStyle(id) {
  return $element(id).getAttribute('style')
}

export function $element(id) {
  const _vm = vm(id)
  return _vm && _vm.$el
}

export function vmCreateEmptyItem({ id }) {
  // layers, grid-generator, carousel, form-generator
  // can new layer-item, grid-item, carousel-item, form-item
  vm(id)._createEmptyItem()
}

export function vmPasteNodes() {
  const { componentsMap } = store.state.component
  const { copyComponentIds } = store.state.app

  jsonHistory.recordsMerge(() => {
    if (copyComponentIds.length === 1) {
      const node = componentsMap[copyComponentIds[0]]
      if (!isGridItem(node)) {
        vmPasteInside(node)
      }
    } else {
      copyComponentIds.forEach(id => vmPasteNode(componentsMap[id]))
    }
  })
}

export function vmPasteInside(theOneCopyNode) {
  const { componentsMap } = store.state.component
  const { selectedComponentIds } = store.state.app

  selectedComponentIds.forEach(selectedId => {
    const selectedNode = componentsMap[selectedId]
    if (theOneCopyNode.id === selectedId) {
      vmPasteNode(theOneCopyNode)
    } else if (theOneCopyNode && !isGridItem(theOneCopyNode)) {
      if (isGridItem(selectedNode)) {
        vm(selectedId)._addNodesToParentAndRecord(theOneCopyNode)
      } else {
        const stopNodeId = vmRemoveNode(selectedNode)
        vm(stopNodeId)._addNodesToParentAndRecord(theOneCopyNode)
      }
    }
  })
}

export function vmPasteNode({ id, parentId }) {
  if (parentId === store.state.component.editingComponentSetId) {
    return
  }

  const parentNode = vmMap[parentId].node

  if (parentNode[CAN_NEW_ITEM]) {
    // if parentNode can new item, it means the node is one of layer-item, grid-item, carousel-item, form-item
    vm(parentId)._copy(id)
  } else {
    // if parentNode can not new item, it means the node is a child of layer-item, grid-item, carousel-item, form-item
    const grandParentId = parentNode.parentId
    vm(grandParentId)._copy(parentId)
  }
}

export function vmRemoveNode({ id, parentId }) {
  const stopNodeId = vm(parentId)._remove(id)
  return stopNodeId
}

export function vmAddNodesToParentAndRecord(id, nodes) {
  vm(id)._addNodesToParentAndRecord(nodes)
}
