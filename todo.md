<li>自己的project有引用的，偶修改的都可以直接儲存了，因為不會引響到其他專案</li>
<li>要做個組建合併得按鈕</li>

### Functionality

<ol>
<li>component set複製的id</li>
<li>每個comonent set裡面的id 要分開restore and reset</li>
<li>每一段時間草稿要儲存到 server, 修改過後 3 秒後送出，要算出跟 server 版本的 diff 在送出，如果途中有出錯就直接送整個 tree 改掉</li>
<li>debounce 送出更新區塊</li>  
<li>轉跳要做成局部轉跳/ 轉跳時componentSet時，要考慮tree，如果是一樣的話就只更新不一樣的地方，但如果是一樣的componentSet的話，照理來說vue自己已經幫我處理了，應該不會重新渲染吧？！</li>
<li>rootlayer 可以新增一個Fix層，可以向navbar一樣position fixed</li> 
<li>Grid layout 不用有control layer，style 可以append在自己身上，但heihgt width trnasform等等不能動</li>
<li>grid layout 在拉的時候案control of shift可以所比例</li>
<li>form item 會卡到lazy load 要處理 / 可計算哪些有formitem的就取消lazload</li>
<li>fixed container</li>
<li>試試看能不能解決 drawer的layout</li>
<li>grid item 要可以控制 xl lg 什麼時候可以hidden</li>
<li>grid 的地方都換成 layer</li>
<li>有假死狀態可以做 剪下貼上</li>
<li>鍵盤也可以控制 上下左右小孩 </li>
<li>style可以重複select component一次設定</li>
<li>setting的switch 看能不能換成checkbox</li>
<li>把grid layout的margin 要換到style上</li>
<li>color 做成global and by project</li>
<li>style component 可以抽離 跟專案沒關係</li>
<li>要再做一個區塊專門 開發style</li>
<li>active / click / hover / showing 的狀態註冊到改成全局，當該個component作用時，可引響全局的組建，參考XD，然後要做成array，之後可以做成timeline</li>
<li>邊界拉動的時候，selection要disable</li>
<li>多個copy的時候有問題，且多選複製時</li>
<li>touchable and visbilty 有bug</li>
<li>text editor 選取壞掉 todo list也不見</li>
<li>visiblity lock 的時候不要被選到</li>
<li>放大縮小時，要用滑鼠為準放大，縮放後，item拉動也壞的</li>
</ol>

### Style

<ol>
<li>需要顯示寬高，跟 max-width / height</li>
<li>color 快捷設定,思考顏色可不可以變成 component,這樣就也可以分享</li>
<li>svg</li>
<li>text-shadow</li>
<li>font align</li>
<li>font family/ 用font picker做但要google帳號</li>
<li>每個template要定義可以編輯的style，只顯示那些，當多選時只用重疊的</li>
<li>寬高要disable，逼他們用layout</li>
<li>改謝color picker，把color format做進去，到時候還要做快捷進去</li>
<li>background color 用grediant做， 等 color picker在做</li>
<li>支援對form-item修改</li>
https://bhch.github.io/posts/2019/03/adding-rotation-handles-in-interact-js/
https://codepen.io/taye/pen/wrrxKb
</ol>

### Setting

<ol>
<li>uploader image / svg / video, consider how to compress</li>
<li>grid item 不能調寬，layout 可以, 要思考怎麼讓 gridGenerator 可以固定寬</li>
<li>node 可以拖拉到 setting style panel 上就可編輯，也可以拖拉到 空的 GridItem 上, 拖到 grid layout 上就新增</li>
<li>button 做成點了可以轉跳 componentSet 或是打開dialog or drawer or popover</li>
<li>grid item and layout 在不同尺寸要可以控制隱藏</li>
<li>input 可以控制 grid item顯示</li>
<li>多選時，可撈出 重複的選項編輯</li>
<li>video在他自己裡面控制grid tiem grid item的 autohiehgt</li>
<li>icon 可以上傳svg tag，下載也是直接下載tag，用dangurous叉叉叉插入，要過濾script，這樣可以變色條診或是用interact做調整</li>
<li>grid item 考慮要不要都autoHeight, 考慮寬變時，高也要自適應</li>
</ol>



### Last

<ol>
<li>time line/ steps/ transfer / cascader / map </li>
<li>每個 button 都可以點了 連結到 componentSet / tooltip / link</li>
<li>這裏應該要改成從 object node 裡面，且存在 object node style block 是不是跟 class block 功能合併</li>
<li>iframe 要可以自動 resize，且可內船 data or 外傳，而且是reactive的，可以互動</li>
<li>每個project都有全局設定，字型包，顏色，自行試試看能不能用functal變成組建</li>
<li>sidebarRight設定要被記住</li>
<li>Sidebar可以分別被猜拆來</li>
<li>scss code 的東西做成 variable 可以是輸入匡</li>
<li>中英文字體</li>
<li>style / color / validation / animation 這些考慮是不是可以變成componentSet</li>
<li>options看能不能都存成integer</li>
<li>need login when publishing </li>
<li>road map</li>
</ol>


付費功能 {
embed iframe
iframe data control
private project
anaylistic daily data
host in own domain,
payment
字體 / webfontloader
聊天室
下單 可參考wix
}


nodejs to deal nodes json / dynaodb
golang to graphQl to deal
1. member system ? language / reset password
2. project node / component node / component set
3. create  
4. github CI / CD / Slack / can 
5. golang compression / resource restriction / file dealing
6. production ssr
https://www.serverless.com/examples/aws-node-vue-nuxt-ssr/
https://github.com/tonyfromundefined/nuxt-serverless
