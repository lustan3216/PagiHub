keyId maangement
projectId including: Project, Folder, componentSet
componentId component

每個組件都是一串 JSON，且要分版本，引用時給類似 github 名字以及版本號
該專案的 component 更新時，只會自動更新該專案內的 component
其他專案的不會更新，除非手動選取更新，fork 的版本會等於複製時的版本，fork 版本更新會從當下版本號更新
每個版本可以附上 List 敘述，
有更新版本就顯示 icon

一個 project 裡面可以有很多 component
一個 project 可以有很多 folder
每個 component 有版本

一個 project 下得 版本會自動更新

跨 project 的話就不行

project / folder / component

component 刪除的話，其他 component 的飲用怎麼辦

1. 可以改名
2. 每個節點可以有敘述
3. 自動更新或不自動更新

每個 component 是一個 jsonStorer

要顯示該 component 引用了哪些 component

要做個按鈕 可以選取組建後變成組建

是組建的要變成點兩下進入該 component 編輯

2. 這裏應該要改成從 object node 裡面，且存在 object node
   style block 是不是跟 class block 功能合併

3. video player to plyr

4. element-ui carousel to swiper

5. component 區快

6. 上傳檔案

11 css 要做 overflow

12 點兩下進入編輯模式，ocmpoennt 考慮要不要進入另一個工作區

13. treenode 點了可以 import scrollIntoView from 'element-ui/src/utils/scroll-into-view'

14. color 快捷設定

15. scss code 的東西做成 variable 可以是輸入匡

16. v-observe-visibility="visibilityChanged" 要優化 載入速度

17. root layers 要可以新增

18 style 要改成針對組建改 style 而不是外誆，外誆可以改 griditem，可以在 style 區塊做個按鈕，可直接選到 grid item

19. 每一段時間草稿要儲存到 server, 修改過後 3 秒後送出，要算出跟 server 版本的 diff 在送出，如果途中有出錯就直接送整個 tree 改掉

20 component 要用 uuid

21
