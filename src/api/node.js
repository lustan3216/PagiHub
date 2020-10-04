import localforage from 'localforage'
import { isArray, toArray } from '@/utils/array'
import { queryString } from '@/utils/url'
import { API } from 'aws-amplify'

export function getProjects() {
  return API.get('jwt', '/projects', {})
}

export function getProject({ id }) {
  return API.get('jwt', `/projects/${id}`, {})
}

export function createProject({ label, description, tags }) {
  return API.post('jwt', `/projects`, {
    body: { label, description, tags }
  })
}

export function patchProject({ id, label, description, tags, inheritMap }) {
  return API.patch('jwt', `/projects/${id}`, {
    body: { label, description, tags, inheritMap }
  })
}

export function deleteProject({ id }) {
  return API.del('jwt', `/projects/${id}`, {})
}

export function getComponentSets({ parentId }) {
  const _queryString = queryString({ parentId })
  return API.get('jwt', `/component-sets?${_queryString}`, {})
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
  return API.get('jwt', `/component-sets/search?${_queryString}`, {})
}

export function getComponentSetChildren({ id }) {
  return API.get('jwt', `/component-sets/${id}/children`, {})
}

export function getComponentSetPublicChildren({ userLabel, projectLabel, componentSetLabel }) {
  const _queryString = queryString({ userLabel, projectLabel, componentSetLabel })
  return API.get('jwt', `/public?${_queryString}`, {})
}

export function publishComponentSet({ id, tree, description }) {
  return API.post('jwt', `/component-sets/${id}/publish`, {
    body: { tree, description }
  })
}

export function deleteComponentSet({ id }) {
  return API.del('jwt', `/component-sets/${id}`, {})
}

export function patchComponentSetChildren({
  componentSetId,
  deltas,
  action,
  tree
}) {
  return API.patch('jwt', `/component-sets/${componentSetId}/children`, {
    body: { deltas, action, tree }
  })
}

export function patchComponentSet({
  id,
  label,
  description,
  tags,
  isPrivate,
  breakpointsMap
}) {
  if (id) {
    return API.patch('jwt', `/component-sets/${id}`, {
      body: { label, description, tags, breakpointsMap, isPrivate }
    })
  }
}

export function createComponentSet({
  description,
  label,
  tags,
  children,
  parentId,
  projectLabel,
  breakpointsMap, isPrivate
}) {
  return API.post('jwt', `/component-sets`, {
    body: {
      parentId,
      description,
      label,
      tags,
      projectLabel,
      isPrivate,
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
