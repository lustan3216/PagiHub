1.

每個組件都是一串 JSON，且要分版本，引用時給類似 github 名字以及版本號
該專案的 component 更新時，只會自動更新該專案內的 component
其他專案的不會更新，除非手動選取更新，fork 的版本會等於複製時的版本，fork 版本更新會從當下版本號更新
每個版本可以附上 List 敘述，
有更新版本就顯示 icon

2. 這裏應該要改成從 object node 裡面，且存在 object node
   style block 是不是跟 class block 功能合併

3. 組建可以複製 剪下，再用滑鼠點+號

4. video player to plyr

5. element-ui carousel to swiper

```bash

  {
    a: {
      b: {
        c: 1
      }
    }
  }

  'a.b = undefined'  刪除
  'a.b.c = undefined'  刪除
  'a.b.c.d = undefined'  不做事

  'a.b = 2'  更新
  'a.b.c = 2'  更新
  'a.b.c.d = 2'  新增

  {
    a: [1,2,3,4]
  }

  'a[0].a = undefined' 不做事 ?
  'a[0] = undefined' 刪除 要用 diff？
  'a = oldValue newArray [1,2,3] 直接用diff生delta
  'a[0] = newValue break throw // 因為不知道是要換掉還是插入

```

{
1: [1, 3],
a: [{}, { 1: 3 }, x],
b: { c: 5, d: { e: 6 }}
}

7. nodesTree 這些操作按鈕要抽城 component，可以在 draft 裡面點選時浮出來操作

8. carousel 當沒有看到的時候 grid generator 可以 v-if，節省效能

9. component 區快

10. 上傳檔案

11 css要做overflow

12 點兩下進入編輯模式，ocmpoennt考慮要不要進入另一個工作區

13. treenode 點了可以  import scrollIntoView from 'element-ui/src/utils/scroll-into-view' 
