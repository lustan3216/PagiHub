import store from '../store'
import { toArray } from './array'
import { getValueByPath, isUndefined } from './tool'
import { humanize } from './string'
import listToTree from './listToTree'
import { gridGenerator } from '../templateJson/basic'
import {
  NODE_TYPE,
  LABEL,
  LAYERS,
  GRID_GENERATOR_ITEM,
  POLYMORPHISM,
  GRID_GENERATOR,
  CAROUSEL,
  SOFT_DELETE
} from '@/const'
import { vmGet } from '@/utils/vmMap'

export function wrapByGrid(nodesMap, ids) {
  const childrenArray = []

  ids.forEach(id => {
    const node = nodesMap[id]

    traversalAncestorAndSelf(node, node => {
      const pureNode = cloneJsonWithoutChildren(node)

      if (isGridItem(node)) {
        delete pureNode.parentId
        childrenArray.push(pureNode)
        return false
      }
      else if (node.id === id) {
        traversalSelfAndChildren(node, node => {
          const pureNode = cloneJsonWithoutChildren(node)
          childrenArray.push(pureNode)
        })
      }
      else {
        childrenArray.push(pureNode)
      }
    })
  })

  return gridGenerator({
    children: listToTree(childrenArray).tree
  })
}

export function cloneJsonWithoutChildren(tree) {
  const string = JSON.stringify(tree, function(key, value) {
    if (value && value['children']) {
      const { children, ...newObject } = value
      return newObject
    }
    return value
  })

  return JSON.parse(string)
}

export function sortByZIndex(children, asc = true) {
  children = Array.from(children)

  const getZIndex = node => {
    const vm = vmGet(node.id)
    return getValueByPath(vm, ['innerStyles', 'layout', 'zIndex'])
  }
  if (asc) {
    return children.sort((a, b) => getZIndex(a) - getZIndex(b))
  }
  else {
    return children.sort((a, b) => getZIndex(b) - getZIndex(a))
  }
}

export function getNode(id) {
  if (id) {
    return store.state.node.nodesMap[id]
  }
}

export function getClosetGrimItem(id) {
  const node = getNode(id)
  if (isGridItem(node)) {
    return node
  }
  else if (node) {
    return getClosetGrimItem(node.parentId)
  }
}

export function isNodeExist(id) {
  const node = store.state.node.nodesMap[id]
  return node && !node[SOFT_DELETE]
}

export function traversalAncestorAndSelf(node, fn) {
  if (!fn) {
    return
  }

  const go = fn(node)
  if (node.parentNode && (go || isUndefined(go))) {
    traversalAncestorAndSelf(node.parentNode, fn)
  }
}

export function traversalAncestor(node, fn) {
  if (!fn || !node.parentNode) {
    return
  }

  const go = fn(node.parentNode)
  if (go || isUndefined(go)) {
    traversalAncestorAndSelf(node.parentNode, fn)
  }
}

export function traversalSelfAndChildren(nodes = [], fn, parentNode) {
  if (!fn) {
    return
  }

  toArray(nodes).forEach(node => {
    const go = fn(node, parentNode)

    if (go || isUndefined(go)) {
      traversalSelfAndChildren(node.children, fn, node)
    }
  })
}

export function traversalChildren(node, fn) {
  if (!fn || !node) {
    return
  }

  const { children = [] } = node
  children.forEach(child => {
    const go = fn(child)

    if (go || isUndefined(go)) {
      traversalChildren(child, fn)
    }
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

  cache[tag] = humanize(cache[tag]).replace('-', '')

  return cache[tag]
}

export function closestGridItem(node, fn) {
  function find(node) {
    if (isGridItem(node)) {
      fn && fn(node)
      return node
    }
    else {
      if (node && node.parentNode) {
        return find(node.parentNode)
      }
    }
  }

  return find(node)
}

export function isOverlapComponent(node) {
  return [LAYERS].includes(node.tag)
}

export function isGridItem(node) {
  if (node) {
    return node.tag === GRID_GENERATOR_ITEM
  }
}

export function isCarousel(node) {
  if (node) {
    return node.tag === CAROUSEL
  }
}

export function isGrid(node) {
  if (node) {
    return node.tag === GRID_GENERATOR && !isSlider(node)
  }
}

export function isSlider(node) {
  if (node) {
    return node[POLYMORPHISM] === 'slider'
  }
}

export function isTextEditor(node) {
  if (node) {
    return node.tag === 'text-editor'
  }
}

export function isParagraph(node) {
  if (node) {
    return node[POLYMORPHISM] === 'paragraph'
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
