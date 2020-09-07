import { ID, PARENT_ID, MASTER_ID } from '../const'
import { toArray } from './array'
import { ulid } from 'ulid'
import { isComponent, traversalSelfAndChildren } from '@/utils/node'

export function appendIds(nodes, parentId, fn) {
  if (parentId) {
    toArray(nodes).forEach(node => (node[PARENT_ID] = parentId))
  }

  traversalSelfAndChildren(nodes, (node, parentNode) => {
    if (isComponent(node)) {
      fn && fn(node)
      node[ID] = ulid()

      if (parentNode) {
        node[PARENT_ID] = parentNode[ID]
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
//     kind: 'node',
//     children: [
//       {
//         kind: 'nodeSet',
//         children: [
//           {
//             kind: 'node'
//           }
//         ]
//       }
//     ]
//   },
// ]

// 1. design between design 清除 masterId
// 2. page to design 清除 masterId
// 3. design to page 建立 masterId
// 4. page to page 不動～
