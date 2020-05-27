import localforage from 'localforage'
import { ID, NODE_TYPE } from '@/const'
import { objectHasAnyKey, nestedToLinerObject } from '@/utils/tool'
import { nodeIds } from '@/utils/nodeId'

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
      nodeIds.appendIdNested(initTemplate)
      return nestedToLinerObject(initTemplate)
    }
  })
}

export function createFolder(node) {
  const id = nodeIds.generateProjectId()
  node[ID] = id
  return Promise.resolve(node)
}

export function updateFolder() {
  return localforage.getItem('project').then((data) => {
    return data || {}
  })
}
