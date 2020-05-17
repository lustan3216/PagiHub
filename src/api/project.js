import localforage from 'localforage'
import { CHILDREN, ID, NODE_TYPE, PARENT_ID } from '@/const'
import { objectHasAnyKey, cloneJson, nestedToLinerObject, traversal } from '@/utils/tool'
import listToTree from '@/utils/listToTree'
import { componentIds, projectIds } from '@/utils/keyId'

const _initTemplate = () => ({
  type: NODE_TYPE.PROJECT,
  name: 'Playground',
  description: 'Playground'
})

export function getProject() {
  return localforage.getItem('project').then((data) => {
    if (data && objectHasAnyKey(data)) {
      return data
    } else {
      const initTemplate = _initTemplate()
      projectIds.appendIdNested(initTemplate)
      return nestedToLinerObject(initTemplate)
    }
  })
}

export function createFolder(node) {
  return Promise.resolve(() => {
    const id = projectIds.generateId()
    node[ID] = id
    return node
  })
}

export function createComponentSet(componentSet) {
  componentSet = cloneJson(componentSet)
  const id = projectIds.generateId()
  const children = componentSet[CHILDREN]

  componentSet[ID] = id
  componentIds.resetNestedIds(children, id)
  componentSet.children[0][PARENT_ID] = id

  const array = []
  traversal(componentSet, node => {
    const { children, ...newNode } = node
    array.push(newNode)
  })
  localforage.setItem(id, array)

  return Promise.resolve(componentSet)
}

export function getComponentSet(id) {
  return localforage.getItem(id)
}

export function updateFolder() {
  return localforage.getItem('project').then((data) => {
    return data || {}
  })
}
