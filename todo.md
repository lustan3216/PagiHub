### Functionality

<ol>  
<li>componentSet id 會很長，所有tree 裡面的id改成uniq_id, 用get function 解決</li>

<li>rootlayer 可以新增一個Fix層，可以向navbar一樣position fixed / fixed container</li> 
<li>試試看能不能解決 drawer的layout</li>
<li>有假死狀態可以做 剪下貼上</li>
<li>color 做成global and by project</li>
<li>製作style component 跟componentset一樣</li>
<li>多個copy的時候有問題，且多選複製時</li>
<li>touchable and visbilty 有bug / 把值做進去 node tree裡面，這樣儲存時也可以存到，下次方便編輯</li>
<li>text editor 選取壞掉 todo list也不見</li>
<li>visiblity lock 的時候不要被選到</li>
<li>自己的project有引用的，偶修改的都可以直接儲存了，因為不會引響到其他專案</li>
<li>每個 component set 都可以組建合併得按鈕  / or 選版本 / 跟隨proejct裡面的變動，只是不同project的因為沒有主動更新所以也不會主動變動</li>
<li>可reset master設定 or style</li>
<li>create componentSet consider to allow select multi nodes</li>
<li>form id 自己產</li>
</ol>

### Style

<ol>
<li>icon 可以上傳svg tag，下載也是直接下載tag，用dangurous叉叉叉插入，要過濾script，這樣可以變色條診或是用interact做調整</li>
<li>uploader image / svg, consider how to compress</li>
<li>select-unit可以用拉的</li>
<li>寬高要disable，逼他們用layout</li>
<li>需要顯示寬高，跟 max-width / height</li>
<li>svg 可在texteditor選，且用innertexteditor編輯</li>
<li>font align</li>
<li>最基礎 10個左右，font family</li>
<li>改寫color picker，把color format做進去，到時候還要做快捷進去</li>
<li>background color 用grediant做， 等 color picker在做</li>
<li>form-item 需要指定el編輯</li>
<li>form item 會卡到lazy load 要處理 / 可計算哪些有formitem的就取消lazload</li>
https://bhch.github.io/posts/2019/03/adding-rotation-handles-in-interact-js/
https://codepen.io/taye/pen/wrrxKb
</ol>

### Setting

<ol>
<li>layout 放大縮小時，要用滑鼠為準放大，縮放後，item拉動也壞的</li>
<li>Grid layout 不用有control layer，style 可以append在自己身上，但heihgt width trnasform等等不能動</li>
<li>grid item 要可以控制 xl lg 什麼時候可以hidden</li>
<li>grid 的地方都換成 layer，考慮可以直接把grid layout拿掉</li>
<li>把grid layout的margin 要換到style上</li>
<li>grid item 考慮要不要都autoHeight, 考慮寬變時，高也要自適應</li>
<li>grid item 不能調寬，layout 可以, 要思考怎麼讓 gridGenerator 可以固定寬</li>
<li>style多選時，可撈出 重複的選項編輯</li>
<li>active / click / hover / showing 的狀態註冊到改成全局，當該個component作用時，可引響全局的組建，參考XD，然後要做成array，之後可以做成timeline</li>
<li>每個 button 都可以點了 連結到 componentSet / link / 需用state 的結構去做 click hover active 等等切換componentSet，這個要去另一個版操作，向XD的prototype</li>
</ol>



### Last

<ol>
<li>only one device can login</li>
<li>grid layout 在拉的時候案control of shift可以所比例</li>
<li>鍵盤也可以控制 上下左右小孩 </li>
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
</ol>


付費功能 {
embed iframe
iframe 要可以自動 resize，且可內船 data or 外傳，而且是reactive的，可以互動
anaylistic daily data
host in own domain,
allow to upload video or audio
payment
擴充字體 / webfontloader
聊天室
下單 可參考wix
form submit amount 1000, can be deleted,
connect to google sheet 
forum
organiztaion
broadcast
}

user needs to bring some users to open functions
