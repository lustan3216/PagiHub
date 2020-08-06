import store from '../store'
import { CAN_NEW_ITEM, CHILDREN, GRID_ITEM, TAG } from '../const'
import { isGridItem } from '@/utils/node'
import jsonHistory from '@/store/jsonHistory'
import localforage from 'localforage'
import { twoArrayEqual } from '@/utils/tool'

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

export async function vmPasteNodes() {
  // the component should get from tmpComponentsMap to prevent data modified after copy or cross browser
  const { tmpComponentsMap } = store.state.component
  const { copyComponentIds } = store.state.app

  jsonHistory.recordsMerge(() => {
    if (copyComponentIds.length === 1) {
      const node = tmpComponentsMap[copyComponentIds[0]]

      if (isGridItem(node)) {
        vmPasteNode(node)
      } else {
        vmPasteInside(node)
      }
    } else if (copyComponentIds.length > 1) {
      copyComponentIds.forEach(id => vmPasteNode(tmpComponentsMap[id]))
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
        vmAddNodesToParentAndRecord(selectedId, theOneCopyNode)
      } else {
        const stopNodeId = vmRemoveNode(selectedNode)
        vmAddNodesToParentAndRecord(stopNodeId, theOneCopyNode)
      }
    }
  })
}

export function vmPasteNode(node) {
  const { parentId, parentNode } = node

  if (parentNode[CAN_NEW_ITEM]) {
    // if parentNode can new item, it means the node is one of layer-item, grid-item, carousel-item, form-item
    vmAddNodesToParentAndRecord(parentId, node)
  } else {
    // if parentNode can not new item, it means the node is a child of layer-item, grid-item, carousel-item, form-item
    const grandParentId = parentNode.parentId
    vmAddNodesToParentAndRecord(grandParentId, node.parentNode)
  }
}

export function vmRemoveNode(node) {
  const stopNodeId = vm(node.parentId)._remove(node)
  return stopNodeId
}

export function vmAddNodesToParentAndRecord(id, nodes) {
  vm(id)._addNodesToParentAndRecord(nodes)
}
