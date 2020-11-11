import { ID, PARENT_ID, MASTER_ID } from '../const'
import { toArray } from './array'
import { ulid } from 'ulid'
import { traversalSelfAndChildren } from '@/utils/node'
import { canInherit, getMasterId, setMasterId } from '@/utils/inheritance'

export function appendIds(
  nodes,
  parentId,
  canSetMasterIdForInstance = false,
  callbacks = {}
) {
  const { instanceBeforeAppend } = callbacks
  const inheritParentIds = []

  if (parentId) {
    toArray(nodes).forEach(node => (node[PARENT_ID] = parentId))
  }

  traversalSelfAndChildren(nodes, (node, parentNode) => {
    // const inheritLoop = inheritParentIds.includes(node.id)
    //
    // if (inheritLoop) {
    //   appendIdsWithoutInherit(node, parentNode.id)
    //   return false
    // }

    // const inheritable = canInherit(node)
    // if (inheritable) {
    //   node.inheritance = {
    //     isInstanceParent: true
    //   }
    //
    //   const masterId = getMasterId(node)
    //   if (masterId) {
    //     inheritParentIds.push(masterId)
    //   }
    //
    //   inheritParentIds.push(node.id)
    //
    //   canSetMasterIdForInstance = true
    // }

    // if (canSetMasterIdForInstance) {
    //   instanceBeforeAppend && instanceBeforeAppend(node)
    //   setMasterId(node, node[ID])
    // }
    // else if (!inheritable) {
    //   delete node.inheritance
    // }

    // set ulid 一定要在 setMasterId 後面
    node[ID] = ulid()

    if (parentNode) {
      node[PARENT_ID] = parentNode[ID]
    }
  })
}

// master 底下新增 新component
// master 底下新增 新component + masterComponent
// instance 底下新增 新component + masterComponent
// instance 底下新增 新component + instanceComponent

export function appendIdsWithoutInherit(nodes, parentId) {
  appendIds(nodes, parentId, node => {
    delete node[MASTER_ID]
    delete node.inheritance
  })
}

// 1. example來的，就不要傳componentId,才知道component的id要換掉
// 2. 複製一般component，就不要傳componentId,才知道component的id要換掉
// 3. searchPanel引用來的, 可能是自己的可能是別人的
// 4. 根據 3情況 又複製的
// 5. style component找masterId
// 6. id 要考慮nodesMap會不會重複
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
