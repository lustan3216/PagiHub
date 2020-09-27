import localforage from 'localforage'
import { isArray, toArray } from '@/utils/array'
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

export function patchProject({ id, label, description, tags, inheritMap }) {
  return API.patch('staging', `/projects/${id}`, {
    body: { label, description, tags, inheritMap }
  })
}

export function deleteProject({ id }) {
  return API.del('staging', `/projects/${id}`, {})
}

export function getComponentSets({ parentId }) {
  const _queryString = queryString({ parentId })
  return API.get('staging', `/component-sets?${_queryString}`, {})
}

export function searchComponentSets({
  from,
  size,
  text,
  tags,
  except,
  isPublic
}) {
  const _queryString = queryString({
    from,
    size,
    text,
    tags: toArray(tags),
    except: toArray(except),
    isPublic
  })
  return API.get('staging', `/component-sets/search?${_queryString}`, {})
}

export function getComponentSetChildren({ id }) {
  return API.get('staging', `/component-sets/${id}/children`, {})
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

export function patchComponentSet({
  id,
  label,
  description,
  tags,
  breakpointsMap
}) {
  if (id) {
    return API.patch('staging', `/component-sets/${id}`, {
      body: { label, description, tags, breakpointsMap }
    })
  }
}

export function createComponentSet({
  description,
  label,
  tags,
  children,
  parentId,
  breakpointsMap
}) {
  return API.post('staging', `/component-sets`, {
    body: {
      parentId,
      description,
      label,
      tags,
      children: toArray(children),
      breakpointsMap
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
