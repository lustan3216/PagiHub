import { exampleIds } from '../utils/nodeId'
import basic from './basic'
import formItem from './formItem'
import { traversal } from '@/utils/tool'
import { ID } from '@/const'

const all = [...basic, ...formItem]
exampleIds.appendIdNested(all)

const basicComponentsMap = {}

traversal(all, (node) => {
  const id = node[ID]
  basicComponentsMap[id] = node
})

export {
  basicComponentsMap,
  all
}
