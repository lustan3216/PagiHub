import {
  ID,
  PARENT_ID,
  MASTER_ID,
  CHILDREN,
  COMPONENT_SET_ID
} from '../const'
import { toArray, traversal } from './tool'
import { ulid } from 'ulid'
import { isComponent, isComponentSet } from '@/utils/node'

export function appendIdNested(nodes, { parentId, componentSetId } = {}) {
  if (parentId) {
    toArray(nodes).forEach(node => (node[PARENT_ID] = parentId))
  }

  traversal(nodes, (node, parentNode) => {
    if (isComponentSet(node)) {
      node[MASTER_ID] = node[ID]
      node[ID] = ulid()

      appendIdNested(node[CHILDREN], {
        parentId: node[ID],
        componentSetId: node[ID]
      })
      return false
    }

    const component = isComponent(node)
    if (component) {
      if (componentSetId) {
        node[COMPONENT_SET_ID] = componentSetId
      } else {
        // 代表是沒有componentSet當頭的component
        node[ID] = ulid()

        if (parentNode) {
          node[PARENT_ID] = parentNode[ID]
        }
      }
    }
  })
}
// 1. example來的，就不要傳componentId,才知道component的id要換掉
// 2. 複製一般component，就不要傳componentId,才知道component的id要換掉
// 3. searchPanel引用來的, 可能是自己的可能是別人的
// 4. 根據 3情況 又複製的
// 5. style component找masterId
// 6. id 要考慮componentsMap會不會重複
// 7. form 裡面或是link做連結，被複製時不可以亂掉
// example = [
//   {
//     kind: 'component',
//     children: [
//       {
//         kind: 'componentSet',
//         children: [
//           {
//             kind: 'component'
//           }
//         ]
//       }
//     ]
//   },
// ]
