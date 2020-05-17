import localforage from 'localforage'
import { NODE_TYPE } from '@/const'
import { objectHasAnyKey } from '@/utils/tool'
import { projectIds } from '@/utils/keyId'

export function createComponents(components) {
  const id = projectIds.generateId()
  componentSet.id = id
  localforage.setItem(id, components)
  return {
    componentSet,
    components
  }
}
