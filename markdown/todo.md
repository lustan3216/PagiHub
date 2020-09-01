MVP

1. style 能用
2. component 能連結
3. componentset 引用都正常
4. 可外連 不用 domain 沒關係

### Functionality

https://github.com/pqina/vue-filepond
https://github.com/antonreshetov/vue-unicons
https://github.com/antonreshetov/vue-eva-icons

<ol>
text 要auto height
text / article style inheritance 要分開, button 裡面的要是可以inherit的
快捷跳到前後一個 componentSet
Reset to Master State
style 點名字，可以連結回 master style
softRecord 應該是有問題，因為 record 紀錄的會不一樣
instance 可以直接複製，跟著王 copy 父曾是 master 就直接 copy ，但也要做一個按鈕控制分離，當 copy 進 page record 一個值紀錄此 page 有用該 component

刪除可以刪到底， 會出現加入 component 的按鈕，只能加入 componentet or gird
panel node 會一直被關起來

layer 裡面層級的 css 看要不要要處理，css 要放在哪一個 grid

pages 系統
page 還要做路由

position fixed (might be a checkbox) // 如果是這個可能多出 top left
button 要可以連結路由

5<li>弄個 panel 可以快速顯示 master instance & 顯示切換版本</li>
10<li>每個 button 都可以點了 連結到 page / link / 需用 state 的結構去做 click hover active 等等切換 componentSet，這個要去另一個版操作，向 XD 的 prototype</li>
5<li>layer grid item(應該無法處理) 想辦法在 project node 拿掉</li> 合併 grid item 跟 component 的 style, style 應該有辦法合併獲優先顯示 component 的
5<li>search panel</li>
20<li>可瀏覽 production 版本</li>

<li>need login when publishing </li>

bug: grid 畫面縮小後會壞掉
5<li>sreen size changer</li>
background color
font 的 padding

<li>style 有必要做到device可以區分嗎？</li>
<li>SEO首頁</li>
update children 要做 queue
button click 可指定 componennt 換成別的 set/ 考慮之後有 interaction在弄就好
<li>radius 可加增神奇第二元素</li>
style 可以 checkbox 看 master 的 style 暫時不用做
svg
</ol>

### Last

publish 除了第一版，之後的都要跟前一個版本做比較
grid item 移動時，最外誆 要動畫
folder System
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
