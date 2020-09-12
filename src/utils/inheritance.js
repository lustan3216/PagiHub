import { getValueByPath, isUndefined, setValueByPath } from '@/utils/tool'
import { objectHasAnyKey } from '@/utils/object'

export function isMasterParent(node) {
  if (node) {
    return node.inheritance && node.inheritance.isMasterParent
  }
}

export function isInstance(node) {
  if (node) {
    return node.inheritance && node.inheritance.masterId
  }
}

export function isInstanceParent(node) {
  if (node) {
    return node.inheritance && node.inheritance.isInstanceParent
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

const PATH = ['deletedInheritance', 'masterId']
export function getDeletedMasterId(node) {
  if (node) {
    return getValueByPath(node, PATH)
  }
}

export function setMasterId(node, id) {
  if (node) {
    setValueByPath(node, MASTER_ID_PATH, getMasterId(node) || id)
  }
}

export function isMasterHasAnyInstance(node) {
  const inheritMap = getValueByPath(
    node.projectNode.inheritMap,
    node.id
  )

  return objectHasAnyKey(inheritMap)
}

