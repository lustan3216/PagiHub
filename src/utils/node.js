import store from '../store'
import { allEqual, cloneJson } from './tool'
import { capitalize } from './string'
import {
  NODE_TYPE,
  NODE_TYPE_STRING,
  KIND,
  LABEL,
  LAYERS,
  GRID_ITEM
} from '@/const'

export function findFirstCommonParentTree(ids) {
  // familyPaths = [
  //   [1,2,3,4,5]
  //   [1,4,5,6,7,8]
  //   [1,8,9]
  // ]
  let familyPaths = ids.map(id => [
    ...store.getters['component/parentPath'](id),
    store.state.component.componentsMap[id]
  ])

  familyPaths = cloneJson(familyPaths)

  const maxXLength = Math.max(...familyPaths.map(path => path.length))

  let x = 0
  for (x; x < maxXLength; x++) {
    const sameYIds = familyPaths.map(path => path[x].id)
    if (!allEqual(sameYIds)) {
      break
    }
  }
  // 假如 index 1 開始都不一樣，所以都一樣的index 就是 x--
  const commonTree = familyPaths[0][x - 1]

  familyPaths.forEach(path => {
    path.slice(x).reduce((tree, node) => {
      if (tree.children) {
        tree.children.push(node)
      } else {
        tree.children = [node]
      }
      return node
    }, commonTree)
  })

  return commonTree
}

export function getNode(id, isExample) {
  if (isExample) {
    return store.state.example.basicExamplesMap[id]
  } else {
    return store.state.component.componentsMap[id]
  }
}

export function traversalAncestorAndSelf(_node, fn = () => {}) {
  const findPath = node => {
    const { parentNode } = node
    if (!parentNode) {
      return
    }

    const stop = fn(parentNode)
    if (!stop) {
      findPath(node)
    }
  }

  const stop = fn(_node)
  if (!stop) {
    findPath(_node)
  }
}

const cache = {}
export function shortTagName(node) {
  const tag = node[LABEL] || node.tag
  if (cache[tag]) {
    return cache[tag]
  }

  const splitTag = tag.split('-')
  if (splitTag[1] === 'generator') {
    cache[tag] = splitTag[0]
  } else if (splitTag[0] === 'form') {
    cache[tag] = splitTag[1]
  } else {
    cache[tag] = tag
  }
  cache[tag] = capitalize(cache[tag]).replace('-', '')
  return cache[tag]
}

export function traversalChildren(nodeId, fn) {
  const { children = [] } = store.state.component.componentsMap[nodeId]
  children.forEach(child => {
    fn(child)
    traversalChildren(child.id, fn)
  })
}

export function isLayers(node) {
  return node.tag === LAYERS
}

export function isGridItem(node) {
  return node.tag === GRID_ITEM
}

export function isProject(node) {
  return node.kind === NODE_TYPE.PROJECT
}

export function isComponent(node) {
  return node[KIND] === NODE_TYPE.COMPONENT
}

export function isFolder(node) {
  return node[KIND] === NODE_TYPE.FOLDER
}

export function isComponentSet(node) {
  return node[KIND] === NODE_TYPE.COMPONENT_SET
}

export function typeString(node) {
  return NODE_TYPE_STRING[node[KIND]]
}

let index = 1
const indexMap = {}
export function shortId(id) {
  if (indexMap[id]) {
    return indexMap[id]
  } else {
    indexMap[id] = index
    index++
    return indexMap[id]
  }
}
