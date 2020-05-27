import localforage from 'localforage'
import { cloneJson, traversal } from '@/utils/tool'
import { nodeIds } from '@/utils/nodeId'
import { CHILDREN, ID, PARENT_ID } from '@/const'

export function createComponentSet(componentSet) {
  componentSet = cloneJson(componentSet)
  const componentSetId = nodeIds.generateProjectId()
  const children = componentSet[CHILDREN]

  componentSet[ID] = componentSetId
  componentSet.w = 200
  componentSet.h = 100

  if (children.length) {
    componentSet.w = children[0].w
    componentSet.h = children[0].h
    nodeIds.appendIdNested(children, componentSetId)
    componentSet.children[0][PARENT_ID] = componentSetId
  }

  const array = []
  traversal(componentSet, node => {
    const { children, ...newNode } = node
    array.push(newNode)
  })
  localforage.setItem(componentSetId, array)

  return Promise.resolve(componentSet)
}

export function getComponentSet(id) {
  return localforage.getItem(id)
}
