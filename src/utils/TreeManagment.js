// timeline, 整個
//   stack 是指每個
// tree 個別樹更新完之後，去diff把diff tree結果記錄下來

// 每個要更新的地方 先算好要刪除新增修改的地方，變成object
// 再用字串表示是修改 '' {12: { style: { asd: 123 }}, 24: { style: { asd: 123 }}}
// 刪除的話用undefined表示
//
// 新增component的地方 id 要重

import deepDiff from 'deep-diff'

class TreeManagement {
  // this is whole time line which combine undo and redo
  // [0, 1, 2, 3], [0 ,1, 2, 3]
  //  undo index    redo index
  constructor(tree) {
    this.mainTree = tree
    this.undo = []
    this.redo = []
  }

  update(updates) {
    updates = Array.toArray(updates)
  }
  // [{}, {}, {}]
  // Branches

  []
}
