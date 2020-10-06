import store from '@/store'
import { getNode, isNodeExist } from '@/utils/node'
import { getValueByPath, setValueByPath } from '@/utils/tool'
import { objectHasAnyKey } from '@/utils/object'
import { SOFT_DELETE } from '@/const'

export function cleanInherit(node) {
  delete node.inheritance
  return node
}

export function isMasterParent(node) {
  if (node) {
    return (
      node.inheritance && node.inheritance.isMasterParent && isMasterExist(node)
    )
  }
}

export function isMasterExist(node) {
  const masterId = getMasterId(node)
  return isNodeExist(masterId)
}

export function isInstanceParent(node) {
  if (node) {
    return (
      node.inheritance &&
      node.inheritance.isInstanceParent &&
      isMasterExist(node)
    )
  }
}

export function isInstanceChild(node) {
  const masterId = getMasterId(node)
  if (masterId) {
    return isMasterExist(node) && !isInstanceParent(node)
  }
}

export function isInstance(node) {
  const masterId = getMasterId(node)
  if (masterId) {
    return isMasterExist(node)
  }
}

export function canInherit(node) {
  if (node) {
    return isMasterParent(node) || isInstanceParent(node)
  }
}

const MASTER_ID_PATH = ['inheritance', 'masterId']
export function getMasterId(node) {
  if (node) {
    return getValueByPath(node, MASTER_ID_PATH)
  }
}

export function setMasterId(node, id) {
  if (node) {
    setValueByPath(node, MASTER_ID_PATH, getMasterId(node) || id)
  }
}

export function isMasterHasAnyInstance(node) {
  const inheritMap = getValueByPath(node.projectNode.inheritMap, node.id)

  return objectHasAnyKey(inheritMap)
}
