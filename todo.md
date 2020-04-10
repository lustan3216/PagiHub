componentSet 旁邊可以 選版本號

每個組件都是一串 JSON，且要分版本，引用時給類似 github 名字以及版本號
該專案的 component 更新時，只會自動更新該專案內的 component

其他專案的不會更新，除非手動選取更新，fork 的版本會等於複製時的版本，fork 版本更新會從當下版本號更新

有更新版本就顯示 icon

一個 project 裡面可以有很多 component
一個 project 可以有很多 folder
每個 component 有版本

一個 project 下得 版本會自動更新

跨 project 的話就不行

component 刪除的話，其他 component 的飲用怎麼辦

copy 出去的 component，在樹裡面要怎麼引用，需不需要把樹複製進去，改了的話怎麼跟原本的設定一樣
樹照理來說也要跟著進去，只是拿設定的時候 先拿組建的再拿自已改的
每個版本照理來說只是不同的設定

組建只能編輯，不能再新增刪除組建，除非改頭 或在複製一個出去

1. component set 可以用拖拉的 進去編輯區

2. 考慮拖移的 grid item 可不可以直接 merge 進去

3. 自動更新或不自動更新

4. 要顯示該 component 引用了哪些 component

5. 要做個按鈕 可以選取組建後變成組建

6. 是組建的要變成點兩下進入該 component 編輯

7. 這裏應該要改成從 object node 裡面，且存在 object node
   style block 是不是跟 class block 功能合併
8. scss code 的東西做成 variable 可以是輸入匡

9. video player to plyr

10. element-ui carousel to swiper

11 css 要做 overflow

12 點兩下進入編輯模式，ocmpoennt 考慮要不要進入另一個工作區

14. color 快捷設定

15. 上傳檔案

18 style 要改成針對組建改 style 而不是外誆，外誆可以改 griditem，可以在 style 區塊做個按鈕，可直接選到 grid item

19. 每一段時間草稿要儲存到 server, 修改過後 3 秒後送出，要算出跟 server 版本的 diff 在送出，如果途中有出錯就直接送整個 tree 改掉

20 component 要用 ulid ?

21 每個 grid item 都可以點了 連結到 componentSet / tooltip / link

23. class / hover

24. 中英文字體

25. vue-awesome-swiper

26. google map

27. svg

28. uploader image / svg

29. 對齊

32 顏色可以設定快捷

34. 組建一改 全部都要改，但有被修過的參數不用改

35. debounce 送出更新區塊

36. iframe 要可以自動 resize，且可內船 data or 外傳

37. PWA
