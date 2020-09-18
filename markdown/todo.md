MVP

1. style 能用
2. component 能連結
3. componentset 引用都正常
4. 可外連 不用 domain 沒關係

### Functionality

https://uppy.io/docs/companion/
https://github.com/antonreshetov/vue-unicons
https://github.com/antonreshetov/vue-eva-icons

<ol>
預設是zindex行為
min-hieght, min-width in pixel
icon
button 可以轉跳
看要不要 ricTexteditor 簡化，只剩list,其他的用 titleditor 代替
button linker 的 children 改成可自選
debounce record 的 tree 每個 debounce 紀錄修改了哪些 key, 針對那些 key compare 就好
可設定 breakpoint
重疊時拖拉要 noaction 其他 conainer
刪除可以刪到底， 會出現加入 component 的按鈕，只能加入 componentet or gird
position fixed (might be a checkbox) // 如果是這個可能多出 top left

background color
background image
font 的 padding

grid item 移動時，最外誆 要動畫

<li>radius 可加增神奇第二元素</li>
style reset to master
upload svg, 看能不能svgo filter, 不然以後沒有svg少了很多動畫可以做
</ol>

### Last

<li>style 有必要做到device可以區分嗎？</li>
button click 可指定 componennt 換成別的 set/ 考慮之後有 interaction在弄就好
update children 要做 queue
要找機會刪除 softDelete master
publish 除了第一版，之後的都要跟前一個版本做比較

style 支援 每個 device 可客製化, hover click
fingerprintjs2

<li>embed iframe,iframe 要可以自動 resize</li>
多個node 可以 copy 進去 gridlayout
<li>canTo caDelete 這些東西不要記錄在 json上，不然以後有更動的話，沒辦法改道s3裡面所有東西 每個 example 下特殊的key e.x.'sdew' 然後配對設定，寫在單獨檔案裡，類似nodeProperties</li>
5<li>避風港跟三振條款</li>
每個 componentSet 要記錄一個 tools 的 version 不然怕以後更新互有衝突
5<li>會有需要設計的版本管理嗎 ? // 做個儲存的按鈕，自動存的時候有動畫，自己點的時候可commit類似publish, 但是是給draft的</li>
5<li>project's favicon and SEO can be edited in the project modal</li>
5<li>seo sitemap page要可以挑選</li>
<li>table</li>
<li>assets folder / component folder</li>
<li>試試看能不能解決 drawer的layout</li>
<li>background color 用grediant做， 等 color picker在做</li>
<li>description 用 editor</li>
<li>form-item 需要指定el編輯</li>
<li>SEO / sitemap / like一定高分一上才產</li>
<li>like</li>
<li>fork</li>
<li>aws 要做安全機制</li>
<li>active / click / hover / showing 的狀態註冊到改成全局，當該個component作用時，可引響全局的組建，參考XD，然後要做成array，之後可以做成timeline</li>
<li>only one device can login</li>
<li>time line/ steps/ transfer / cascader / map </li>
<li>text-shadow</li>
<li>road map</li>
<li>color 做成global and by project/ 考慮stype compontny一併實現</li>
<li>copied componentSet可reset master設定 or style</li>
<li>form item 會卡到lazy load 要處理 / 可計算哪些有formitem的就取消lazload</li>
<li>改寫color picker，把color format做進去，到時候還要做快捷進去</li>
<li>設計師牆</li>

https://bhch.github.io/posts/2019/03/adding-rotation-handles-in-interact-js/
https://codepen.io/taye/pen/wrrxKb
Better Asset Management https://wishlist.webflow.com/ideas/WEBFLOW-I-1057
Webflow Desktop / Offline Application https://wishlist.webflow.com/ideas/DESIGNER-I-13

</ol>
https://github.com/probil/vue-moveable

只要碰到 MasterParent 就代表將要複製小孩出去，都下 masterId & instanceParent
master 頭的小孩不用動 不用加任何東西
master 頭裡面可以任意放 instance or master,
小孩裡面不能直接創造 master component

協作 / 觀察 /註釋 Comment
https://medium.com/as-a-product-designer/figma-design-tool-1c6542ae8dc1
