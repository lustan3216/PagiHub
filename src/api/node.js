import store from '@/store'
import localforage from 'localforage'
import { cloneJson } from '@/utils/tool'
import { API } from 'aws-amplify'

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

export function getComponentSets(projectId) {
  return API.get('staging', `/projects/${projectId}/component-sets`, {})
}

export function getComponentSetChildren(id) {
  const userId = store.state.user.id.split('_')[1]
  return fetch(
    `https://d3uga24p04v3ke.cloudfront.net/${userId}/${id}/draft.json`
  )
    .then(x => x.json())
    .catch(_ => [])
}

export function patchComponentSet(id, body) {
  return API.patch('staging', `/component-sets/${id}`, { body })
}

export function deleteComponentSet(id) {
  return API.del('staging', `/component-sets/${id}`, {})
}

export function putComponentSetChildren(deltas, action) {
  return API.put(
    'staging',
    `/projects/${store.state.component.editingProjectId}/children`,
    {
      body: { deltas, action }
    }
  )
}

export function createComponentSet(projectId, componentSet) {
  componentSet = cloneJson(componentSet)
  // const componentSetId = nodeIds.generateProjectId()
  // 這裡children是要處理 假如componentSet是用selected component創造的
  // const children = componentSet[CHILDREN]

  // componentSet[ID] = componentSetId
  componentSet.w = 500
  componentSet.h = 700

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
