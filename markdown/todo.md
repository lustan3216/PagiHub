MVP

1. style 能用
2. component 能連結
3. componentset 引用都正常
4. 可外連 不用 domain 沒關係

### Functionality

<ol>
5<li>優惠style setting 渲染</li>
5<li>grid item, auto hieght 有 bug</li>
5<li>style sketch 一模一樣</li>
5<li>bring to front, bring forward, send to back, 至前，至後, style 永遠再layer最底層</li>
5<li>texteditor 操作方式 跟notion一樣 </li>
5<li>image 可以直接拉近畫面裡面</li>
5<li>project's favicon and SEO can be edited in the project modal</li>
5<li>多選修改</li>
5<li>sreen size changer</li>
5<li>grid layout could choose Full view height</li>
5<li>copy/paste between tabs</li>
5<li>照片,svg 也要是公開分享的嗎？？？？ 如果想刪除的怎麼辦，偏向不要，但還是會被複製走</li>
5<li>grid item 要可以比例伸展, grid item 的比例放大 要放哪</li> 
5<li>rootlayer 可以新增一個Fix層，可以向navbar一樣position fixed / fixed container</li> 
3<li>有假死狀態可以做 剪下貼上</li>
5<li>每個 component set 都可以組建合併得按鈕  / or 選版本 / 跟隨proejct裡面的變動，只是不同project的因為沒有主動更新所以也不會主動變動</li>
2<li>自己的project有引用的，有修改的都可以直接儲存了，因為不會引響到其他專案</li>
5<li>search panel</li>
10<li>每個 button 都可以點了 連結到 componentSet / link / 需用state 的結構去做 click hover active 等等切換componentSet，這個要去另一個版操作，向XD的prototype</li>
2<li>componentSet 裡面的compopentSet 分離，不要隨著源頭跟動</li>
20<li>可瀏覽 production版本</li>
</ol>

### Style

<ol>
1<li>font align</li>
1<li>最基礎 10個左右，font family</li>
<li>icon 可以上傳svg tag，下載也是直接下載tag，用dangurous叉叉叉插入，要過濾script，這樣可以變色條診或是用interact做調整</li>
2<li>uploader image / svg, consider how to compress</li>
3<li>svg 可在texteditor選，且用innertexteditor編輯</li>
2<li>select-unit可以用拉的</li>
3<li>寬高要disable，逼他們用layout / 需要顯示寬高，跟 max-width / height</li>
</ol>

### Setting

<ol>
<li>Grid layout 不用有control layer，style 可以append在自己身上，但heihgt width trnasform等等不能動</li>
3<li>grid item 要可以控制 xl lg 什麼時候可以hidden</li>
5<li>把grid layout的margin 要換到style上</li>
5<li>grid item 考慮要不要都autoHeight, 考慮寬變時，高也要自適應</li>
4<li>grid item 不能調寬，layout 可以, 要思考怎麼讓 gridGenerator 可以固定寬</li> ? style 做個設計，要不要固定寬高，要的話，
</ol>

### Last

<ol>
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
<li>暫時form 先不做</li>
<li>SEO / sitemap / like一定高分一上才產</li>
<li>like</li>
<li>fork</li>
<li>aws 要做安全機制</li>
<li>active / click / hover / showing 的狀態註冊到改成全局，當該個component作用時，可引響全局的組建，參考XD，然後要做成array，之後可以做成timeline</li>
<li>only one device can login</li>
<li>grid layout 在拉的時候案control of shift可以所比例</li>
<li>time line/ steps/ transfer / cascader / map </li>
<li>sidebarRight設定要被記住</li>
<li>Sidebar可以分別被猜拆來</li>
<li>text-shadow</li>
<li>font family/ 用font picker做但要google帳號</li>
<li>input 可以控制 grid item顯示</li>
<li>options看能不能都存成integer</li>
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
