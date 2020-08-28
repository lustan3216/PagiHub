// why we need to record, because there's a special case which requests componentSet children
// the deleted component can not find rootComponentSetId in componentsMap.

// import store from '@/store'

import { isComponent } from '@/utils/node'

export const rootComponentSetIdMap = {}
export function recordRootComponentSetId(node, componentSetId) {
  if (isComponent(node) && componentSetId) {
    rootComponentSetIdMap[node.id] = componentSetId
  }
}

export function getRootComponentSetId(componentId) {
  return rootComponentSetIdMap[componentId]
}

// let familyTreeIds = []
//
// export const getRootComponentSetId = nodeId => {
//   familyTreeIds.push(nodeId)
//   const { componentsMap, rootComponentSetIds } = store.state.node
//
//   if (rootComponentSetIdMap[nodeId]) {
//     familyTreeIds.forEach(
//       id => (rootComponentSetIdMap[id] = rootComponentSetIdMap[nodeId])
//     )
//     familyTreeIds = []
//     return rootComponentSetIdMap[nodeId]
//   }
//   else {
//     const { parentId } = componentsMap[nodeId]
//     const parentNode = componentsMap[parentId]
//
//     if (rootComponentSetIds.includes(parentNode.id)) {
//       familyTreeIds.forEach(id => (rootComponentSetIdMap[id] = parentNode.id))
//       familyTreeIds = []
//       return parentNode.id
//     }
//     else {
//       familyTreeIds.push(nodeId)
//       return getRootComponentSetId(parentNode.id)
//     }
//   }
// }
//
// export const recordRootComponentSetId = getRootComponentSetId
//
// export const recordRootComponentSetIdByArray = (
//   rootComponentSetId,
//   componentArray
// ) => {
//   componentArray.forEach(
//     ({ id }) => (rootComponentSetIdMap[id] = rootComponentSetId)
//   )
// }
