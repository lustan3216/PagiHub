import localforage from 'localforage'
import { toArray } from '@/utils/array'
import { queryString } from '@/utils/url'
import { API } from 'aws-amplify'

export function getProjects() {
  return API.get('staging', '/projects', {})
}

export function getProject({ id }) {
  return API.get('staging', `/projects/${id}`, {})
}

export function createProject({ label, description, tags }) {
  return API.post('staging', `/projects`, {
    body: { label, description, tags }
  })
}

export function patchProject({ id, label, description, tags }) {
  return API.patch('staging', `/projects/${id}`, {
    body: { label, description, tags }
  })
}

export function deleteProject({ id }) {
  return API.del('staging', `/projects/${id}`, {})
}

export function getComponentSets({ parentId }) {
  const _queryString = queryString({ parentId })
  return API.get('staging', `/component-sets?${_queryString}`, {})
}

export function getComponentSetChildren({ id }) {
  return API.get('staging', `/component-sets/${id}/children`, {})
}

export function patchComponentSet({ id, label, description, tags }) {
  return API.patch('staging', `/component-sets/${id}`, {
    body: { label, description, tags }
  })
}

export function publishComponentSet({ id, tree, description }) {
  return API.post('staging', `/component-sets/${id}/publish`, {
    body: { tree, description }
  })
}

export function deleteComponentSet({ id }) {
  return API.del('staging', `/component-sets/${id}`, {})
}

export function patchComponentSetChildren({
  componentSetId,
  deltas,
  action,
  tree
}) {
  return API.patch('staging', `/component-sets/${componentSetId}/children`, {
    body: { deltas, action, tree }
  })
}

export function createComponentSet({
  description,
  label,
  tags,
  children,
  parentId
}) {
  // const componentSetId = nodeIds.generateProjectId()
  // 這裡children是要處理 假如componentSet是用selected component創造的
  // const children = componentSet[CHILDREN]

  // componentSet[ID] = componentSetId
  return API.post('staging', `/component-sets`, {
    body: {
      parentId,
      description,
      label,
      tags,
      children: toArray(children)
    }
  })
  // if (children.length) {
  //   componentSet.w = children[0].w
  //   componentSet.h = children[0].h
  //   nodeIds.appendIdNested(children, componentSetId)
  //   componentSet.children[0][PARENT_ID] = componentSetId
  // }
  //
  // const array = []
  // traversalSelfAndChildren(componentSet, node => {
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
