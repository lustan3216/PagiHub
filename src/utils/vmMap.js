import store from '../store'
import { CAN_NEW_ITEM } from '../const'
import { isGridItem, traversalAncestorAndSelf } from '@/utils/node'

const vmMap = {}

export default vmMap
if (process.env.NODE_ENV !== 'production') {
  window.vmMap = vmMap
}

export function vmGet(id, isExample = false) {
  return vmMap[isExample ? `example-${id}` : id]
}

export function vmAppend(vm) {
  vmMap[vm.isExample ? `example-${vm.id}` : vm.id] = vm
}

export function vmRemove(vm) {
  delete vmMap[vm.isExample ? `example-${vm.id}` : vm.id]
}

export function vmCreateEmptyItem(node) {
  // layers, grid-generator, carousel, form-generator
  // can new layer-item, grid-item, carousel-item, form-item
  if (node[CAN_NEW_ITEM]) {
    vmGet(node.id).createEmptyItem()
  }
  else {
    traversalAncestorAndSelf(node, node => {
      if (isGridItem(node)) {
        store.commit('app/SET', { copyComponentIds: [node.id] })
        const { children, inheritance, ...emptyGridItem } = node
        vmGet(node.parentId).addNodeToParent(emptyGridItem)
        return false
      }
    })
  }
}

export async function vmPasteNodes() {
  // the component should get from tmpComponentsMap to prevent data modified after copy or cross browser
  const { tmpComponentsMap } = store.state.node
  const { copyComponentIds } = store.state.app

  if (copyComponentIds.length === 1) {
    const node = tmpComponentsMap[copyComponentIds[0]]

    if (isGridItem(node)) {
      vmPasteNode(node)
    }
    else {
      vmPasteInside(node)
    }
  }
  else if (copyComponentIds.length > 1) {
    copyComponentIds.forEach(id => vmPasteNode(tmpComponentsMap[id]))
  }
}

export function vmPasteInside(theOneCopyNode) {
  const { nodesMap } = store.state.node
  const { selectedComponentIds } = store.state.app

  selectedComponentIds.forEach(selectedId => {
    const selectedNode = nodesMap[selectedId]
    if (theOneCopyNode.id === selectedId) {
      vmPasteNode(theOneCopyNode)
    }
    else if (theOneCopyNode && !isGridItem(theOneCopyNode)) {
      if (isGridItem(selectedNode)) {
        vmAddNodeToParent(selectedId, theOneCopyNode)
      }
      else {
        vmRemoveNode(selectedNode)
        vmAddNodeToParent(selectedNode.parentId, theOneCopyNode)
      }
    }
  })
}

export function vmPasteNode(node) {
  const { parentId, parentNode } = node

  if (parentNode[CAN_NEW_ITEM]) {
    // if parentNode can new item, it means the node is one of layer-item, grid-item, carousel-item, form-item
    vmAddNodeToParent(parentId, node)
  }
  else {
    // if parentNode can not new item, it means the node is a child of layer-item, grid-item, carousel-item, form-item
    const grandParentId = parentNode.parentId
    vmAddNodeToParent(grandParentId, node.parentNode)
  }
}

export function vmRemoveNode(node) {
  vmGet(node.parentId).removeNodeFromParent(node)
}

export function vmAddNodeToParent(id, nodes) {
  vmGet(id).addNodeToParent(nodes)
}

export function vmBecomeMaster(node) {
  vmGet(node.id).becomeMaster()
}
