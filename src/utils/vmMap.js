import store from '../store'
import { CAN_NEW_ITEM } from '../const'
import { isGridItem, traversalAncestorAndSelf, wrapByGrid } from '@/utils/node'
import { arrayEquals } from '@/utils/array'

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
        const { children, inheritance, styles, ...emptyGridItem } = node
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
  const { selectedComponentIds } = store.state.app

  const shouldDuplicate = arrayEquals(selectedComponentIds, copyComponentIds)

  if (copyComponentIds.length === 1) {
    const node = tmpComponentsMap[copyComponentIds[0]]
    vmPasteInside(node)
  }
  else if (copyComponentIds.length > 1 && shouldDuplicate) {
    copyComponentIds.forEach(id => vmAddNode(tmpComponentsMap[id]))
  }
  else if (copyComponentIds.length > 1) {
    const nodeTree = wrapByGrid(tmpComponentsMap, copyComponentIds)
    vmPasteInside(nodeTree)
  }
}

export function vmPasteInside(sourceNode) {
  if (!sourceNode) {
    return
  }

  const { nodesMap } = store.state.node
  const { selectedComponentIds } = store.state.app

  selectedComponentIds.forEach(targetId => {
    const targetNode = nodesMap[targetId]
    if (sourceNode.id === targetId) {
      vmAddNode(sourceNode)
    }
    else if (isGridItem(sourceNode)) {
      if (isGridItem(targetNode)) {
        vmAddNodeToParent(targetId, sourceNode)
      }
      else {
        vmRemoveNode(targetNode)
        vmAddNodeToParent(targetNode.parentId, sourceNode)
      }
    }
    else {
      if (isGridItem(targetNode)) {
        vmCleanChildren(targetNode)
        vmAddNodeToParent(targetId, sourceNode)
      }
      else {
        vmRemoveNode(targetNode)
        vmAddNodeToParent(targetNode.parentId, sourceNode)
      }
    }
  })
}

export function vmCleanChildren(node) {
  node.children.forEach(child => vmRemoveNode(child))
}

export function vmAddNode(node) {
  if (!node) {
    return
  }

  const { parentId, parentNode } = node

  if (parentNode[CAN_NEW_ITEM]) {
    // if parentNode can new item, it means the node is one of layer-item, grid-item, carousel-item, form-item
    vmAddNodeToParent(parentId, node)
  }
  else {
    vmAddNode(parentNode)
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
