import store from '../store'
import { allEqual, cloneJson, isUndefined, toArray } from './tool'
import { humanize } from './string'
import {
  NODE_TYPE,
  LABEL,
  LAYERS,
  GRID_GENERATOR_ITEM,
  POLYMORPHISM,
  GRID_GENERATOR,
  SORT_INDEX
} from '@/const'

export function cloneJsonWithoutChildren(tree) {
  const string = JSON.stringify(tree, function(key, value) {
    if (value['children']) {
      const { children, ...newObject } = value
      return newObject
    }
    return value
  })

  return JSON.parse(string)
}

export function findFirstCommonParentTree(ids) {
  // familyPaths = [
  //   [1,2,3,4,5]
  //   [1,4,5,6,7,8]
  //   [1,8,9]
  // ]
  let familyPaths = ids.map(id => [
    ...store.getters['node/parentPath'](id),
    store.state.node.componentsMap[id]
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
      }
      else {
        tree.children = [node]
      }
      return node
    }, commonTree)
  })

  return commonTree
}

export function sortByIndex(children, asc = true) {
  if (asc) {
    return Array.from(children).sort((a, b) => a[SORT_INDEX] - b[SORT_INDEX])
  }
  else {
    return Array.from(children).sort((a, b) => b[SORT_INDEX] - a[SORT_INDEX])
  }
}

export function getNode(id) {
  return (
    store.state.example.exampleComponentsMap[id] ||
    store.state.node.componentsMap[id]
  )
}

export function traversalAncestorAndSelf(node, fn = () => {}) {
  const findPath = parent => {
    const { parentNode } = parent
    if (!parentNode) {
      return
    }

    const stop = fn(parentNode)
    if (!stop) {
      findPath(parentNode)
    }
  }

  const stop = fn(node)
  if (!stop) {
    findPath(node)
  }
}

export function traversalSelfAndChildren(nodes, fn, parentNode) {
  toArray(nodes).forEach(node => {
    const stop = fn(node, parentNode)

    if (!stop) {
      node.children &&
        node.children.length &&
        traversalSelfAndChildren(node.children, fn, node)
    }
  })
}

export function traversalChildren(node, fn) {
  const { children = [] } = node
  children.forEach(child => {
    fn(child)
    traversalChildren(child, fn)
  })
}

const cache = {}
export function shortTagName(node) {
  if (!node) {
    return
  }

  const tag = node[LABEL] || node[POLYMORPHISM] || node.tag
  if (cache[tag]) {
    return cache[tag]
  }

  const splitTag = tag.split('-')
  if (splitTag[1] === 'generator') {
    cache[tag] = splitTag[0]
  }
  else if (splitTag[0] === 'form') {
    cache[tag] = splitTag[1]
  }
  else {
    cache[tag] = tag
  }
  if (isComponent(node)) {
    cache[tag] = humanize(cache[tag]).replace('-', '')
  }

  return cache[tag]
}

export function closestGridItem(node) {
  function find(node) {
    if (isGridItem(node)) {
      return node
    }
    else {
      return find(node.parentNode)
    }
  }

  return find(node)
}

export function isLayers(node) {
  if (node) {
    return node.tag === LAYERS && isUndefined(node[POLYMORPHISM])
  }
}

export function isOverlapComponent(node) {
  return [LAYERS].includes(node.tag)
}

export function isGridItem(node) {
  if (node) {
    return node.tag === GRID_GENERATOR_ITEM
  }
}

export function isGrid(node) {
  if (node) {
    return node.tag === GRID_GENERATOR
  }
}

export function isProject(node) {
  if (node) {
    return node.tag === NODE_TYPE.PROJECT
  }
}

export function isComponent(node) {
  if (node) {
    return !isComponentSet(node) && !isProject(node) && !isFolder(node)
  }
}

export function isPage(node) {
  if (node) {
    return isComponentSet(node) && node[POLYMORPHISM] === NODE_TYPE.PAGE
  }
}

export function isDesign(node) {
  if (node) {
    return isComponentSet(node) && node[POLYMORPHISM] === NODE_TYPE.DESIGN
  }
}

export function isFolder(node) {
  if (node) {
    return node.tag === NODE_TYPE.FOLDER
  }
}

export function isComponentSet(node) {
  if (node) {
    return node.tag === NODE_TYPE.COMPONENT_SET
  }
}

let index = 1
const indexMap = {}
export function shortId(id) {
  if (indexMap[id]) {
    return indexMap[id]
  }
  else {
    indexMap[id] = index
    index++
    return indexMap[id]
  }
}
// {
//   "Sid": "Update",
//   "Effect": "Allow",
//   "Principal": {
//   "AWS": [
//     "arn:aws:iam::319924209672:role/service-role/componentSetChildren-put-role-ydnj7p44",
//     "arn:aws:iam::319924209672:root",
//     "arn:aws:iam::319924209672:role/service-role/componentSet-put-role-h3txxg2a"
//   ]
// },
//   "Action": [
//   "s3:PutObject",
//   "s3:PutObjectAcl"
// ],
//   "Resource": "arn:aws:s3:::staging.node/*"
// }
