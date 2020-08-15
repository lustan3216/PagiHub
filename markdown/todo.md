MVP

1. style 能用
2. component 能連結
3. componentset 引用都正常
4. 可外連 不用 domain 沒關係

### Functionality

https://github.com/pqina/vue-filepond
https://github.com/antonreshetov/vue-unicons

<ol>
layer 往後移，如果下一層沒東西就直接往後下移層，如果有東西就間隔一個跳下一層
5<li>bring to front, bring forward, send to back, 至前，至後, style 永遠再 layer 最底層</li>
style 的checkbox 暫時刪除
position fixed (might be a checkbox) // 如果是這個可能多出 top left
variable vw vh, to fix arboard size
數字大量改變時合成一個 hisotry
5<li>layer grid item(應該無法處理) 想辦法在 project node 拿掉</li>
5<li>sreen size changer</li>
5<li>每個 component set 都可以組建合併得按鈕 / or 選版本</li>
5<li>search panel</li>
10<li>每個 button 都可以點了 連結到 componentSet / link / 需用 state 的結構去做 click hover active 等等切換 componentSet，這個要去另一個版操作，向 XD 的 prototype</li>
20<li>可瀏覽 production 版本</li>
2<li>uploader image, consider how to compress</li>
</ol>

### Last

<ol>
可以 copy 進去 gridlayout
<li>canTo caDelete 這些東西不要記錄在 json上，不然以後有更動的話，沒辦法改道s3裡面所有東西 每個 example 下特殊的key e.x.'sdew' 然後配對設定，寫在單獨檔案裡，類似nodeProperties</li>
5<li>避風港跟三振條款</li>
每個 componentSet 要記錄一個 tools 的 version 不然怕以後更新互有衝突
5<li>會有需要設計的版本管理嗎 ?</li>
5<li>project's favicon and SEO can be edited in the project modal</li>
5<li>seo sitemap page要可以挑選</li>
5<li>image 可以直接拉近畫面裡面</li>
5<li>carousel 可以用 鍵盤控制，動畫的出現</li>
<li>import Sketch</li>
<li>table</li>
<li>assets folder / component folder</li>
<li>can embed iframe</li>
<li>SEO首頁</li>
<li>怎麼讓使用者更好選上下node</li>
<li>試試看能不能解決 drawer的layout</li>
<li>background color 用grediant做， 等 color picker在做</li>
<li>node tree moving</li>
<li>description 用 editor</li>
<li>form-item 需要指定el編輯</li>
<li>SEO / sitemap / like一定高分一上才產</li>
<li>like</li>
<li>fork</li>
<li>aws 要做安全機制</li>
<li>active / click / hover / showing 的狀態註冊到改成全局，當該個component作用時，可引響全局的組建，參考XD，然後要做成array，之後可以做成timeline</li>
<li>only one device can login</li>
<li>grid layout 在拉的時候案control of shift可以所比例</li>
<li>time line/ steps/ transfer / cascader / map </li>
<li>text-shadow</li>
<li>need login when publishing </li>
<li>road map</li>
<li>can create their own vue component</li>
<li>color 做成global and by project</li>
<li>製作style component 跟componentset一樣</li>
<li>copied componentSet可reset master設定 or style</li>
<li>layout 放大縮小時，要用滑鼠為準放大，縮放後，item拉動也壞的</li>
<li>style多選時，可撈出 重複的選項編輯</li>
<li>form item 會卡到lazy load 要處理 / 可計算哪些有formitem的就取消lazload</li>
<li>改寫color picker，把color format做進去，到時候還要做快捷進去</li>
https://bhch.github.io/posts/2019/03/adding-rotation-handles-in-interact-js/
https://codepen.io/taye/pen/wrrxKb
<li>embed iframe,iframe 要可以自動 resize</li>
<li>設計師牆</li>
Better Asset Management https://wishlist.webflow.com/ideas/WEBFLOW-I-1057
Webflow Desktop / Offline Application https://wishlist.webflow.com/ideas/DESIGNER-I-13
</ol>
https://github.com/probil/vue-moveable
