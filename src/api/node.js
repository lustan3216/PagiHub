import store from '@/store'
import localforage from 'localforage'
import { cloneJson, toArray } from '@/utils/tool'
import { API } from 'aws-amplify'
import axios from 'axios'

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
  return API.get('staging', `/component-sets/${id}/children`, {})
}

export function patchComponentSet(id, body) {
  return API.patch('staging', `/component-sets/${id}`, { body })
}

export function deleteComponentSet(id) {
  return API.del('staging', `/component-sets/${id}`, {})
}

export function patchComponentSetChildren(deltas, action) {
  return API.patch(
    'staging',
    `/component-sets/${store.state.component.editingComponentSetId}/children`,
    {
      body: { deltas, action }
    }
  )
}

export function createComponentSet(
  projectId,
  { description, label, tags, children }
) {
  // const componentSetId = nodeIds.generateProjectId()
  // 這裡children是要處理 假如componentSet是用selected component創造的
  // const children = componentSet[CHILDREN]

  // componentSet[ID] = componentSetId
  return API.post('staging', `/projects/${projectId}/component-sets`, {
    body: {
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
