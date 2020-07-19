import localforage from 'localforage'
import { CHILDREN, ID, NODE_TYPE, PARENT_ID } from '@/const'
import {
  objectHasAnyKey,
  nestedToLinerObject,
  cloneJson,
  traversal
} from '@/utils/tool'
import { nodeIds } from '@/utils/nodeId'
import { API } from 'aws-amplify'

// const _initTemplate = () => ({
//   type: NODE_TYPE.PROJECT,
//   name: 'Playground',
//   description: 'Playground'
// })

export function getProjects() {
  return API.get('staging', '/projects', {})
}

export function getProject(id) {
  return API.get('staging', `/projects/${id}`, {})
}

export function createProject(body) {
  return API.post('staging', `/projects`, { body })
}

export function patchProject(id, body) {
  return API.patch('staging', `/projects/${id}`, { body })
}

export function deleteProject(id) {
  return API.del('staging', `/projects/${id}`, {})
}

// export function getProject() {
//   return localforage.getItem('project').then((data) => {
//     if (data && objectHasAnyKey(data)) {
//       return data
//     } else {
//       const initTemplate = _initTemplate()
//       nodeIds.appendIdNested(initTemplate)
//       return nestedToLinerObject(initTemplate)
//     }
//   })
// }

export function getComponentSets(projectId) {
  // return localforage.getItem(id)
  return API.get('staging', `/projects/${projectId}/component-sets`, {})
}

export function getComponentSet(id) {
  return localforage.getItem(id)
}

export function createComponentSet(projectId, componentSet) {
  componentSet = cloneJson(componentSet)
  // const componentSetId = nodeIds.generateProjectId()
  // 這裡children是要處理 假如componentSet是用selected component創造的
  // const children = componentSet[CHILDREN]

  // componentSet[ID] = componentSetId
  componentSet.w = 200
  componentSet.h = 100

  return API.post('staging', `/projects/${projectId}/component-sets`, {
    body: componentSet
  })
  // if (children.length) {
  //   componentSet.w = children[0].w
  //   componentSet.h = children[0].h
  //   nodeIds.appendIdNested(children, componentSetId)
  //   componentSet.children[0][PARENT_ID] = componentSetId
  // }
  //
  // const array = []
  // traversal(componentSet, node => {
  //   const { children, ...newNode } = node
  //   array.push(newNode)
  // })
  // localforage.setItem(componentSetId, array)

  // return Promise.resolve(componentSet)
}

// update

export function updateComponentSet() {
  return localforage.getItem('project').then(data => {
    return data || {}
  })
}
