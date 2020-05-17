### Functionality

<ol>
<li>每一段時間草稿要儲存到 server, 修改過後 3 秒後送出，要算出跟 server 版本的 diff 在送出，如果途中有出錯就直接送整個 tree 改掉</li>
<li>component 要用 ulid ?</li>
<li>debounce 送出更新區塊</li>
<li>考慮拖移的 grid item 可不可以直接 merge 進去 layout</li>
<li>這裏應該要改成從 object node 裡面，且存在 object node style block 是不是跟 class block 功能合併</li>  
<li>轉跳要做成局部轉跳/ 轉跳時componentSet時，要考慮tree，如果是一樣的話就只更新不一樣的地方，但如果是一樣的componentSet的話，照理來說vue自己已經幫我處理了，應該不會重新渲染吧？！</li>
<li>rootlayer 可以新增一個Fix層，可以向navbar一樣position fixed</li> 
<li>google map</li>
<li>Grid layout 不用有control layer，style 可以append在自己身上，但heihgt width trnasform等等不能動</li>
<li>grid layout 在拉的時候案control of shift可以所比例</li>
<li>time line/ steps/ transfer / cascader / map </li>
<li>form item 會卡到lazy load 要處理 </li>
<li>form validator</li>
<li>fixed container</li>
<li>試試看能不能解決 drawer的layout</li>
<li>grid item 要可以控制 xl lg 什麼時候可以hidden</li>
<li>grid 的地方都換成 layer</li>
<li>有假死狀態可以做 剪下貼上</li>
<li>鍵盤也可以控制 上下左右小孩 </li>
<li>每一次的小更動 都動到整棵樹了，引響很多地方都要渲染</li>
<li>開個children的 store，key專門存小孩，給component用，直接id當key，且新增刪除直接自己操作，試試看能不能直接把新增刪除修改放進 store</li>
<li>畫布做成外誆9個點，靠近時會出現，只能拉納9點伸縮</li>
<li>style可以重複select component一次設定</li>
<li>setting的switch 看能不能換成checkbox</li>
<li>考慮自動加上transition不然沒人會用</li>
<li>把grid layout的margin 要換到style上</li>
<li>fix position when scrolling</li>
<li>每個人編輯的過程都可以被看到，但不能被修改，</li>
<li>color 做成global and by project</li>
<li>color 做成global and by project</li>
<li>style component 可以抽離 跟專案沒關係</li>
<li>要再做一個區塊專門 開發style</li>
<li>視窗滑動，看要不要改成當有select且可以scallable的時候就scroll or move</li>
<li>active / click / hover / showing 的狀態註冊到改成全局，當該個component作用時，可引響全局的組建，參考XD，然後要做成array，之後可以做成timeline</li>
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

### Bug

<ol>
<li>邊界拉動的時候，selection要disable</li>
<li>多個copy的時候有問題，且多選複製時</li>
<li>touchable and visbilty 有bug</li>
<li>text editor 選取壞掉 todo list也不見</li>
<li>visiblity lock 的時候不要被選到</li>
<li>放大縮小時，要用滑鼠為準放大，縮放後，item拉動也壞的</li>
</ol>

### Last

<ol>
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
<li>dragula free style 放在原本的 node 裡面就可以了</li>
</ol>

UX {
盡量實現讓設計師看到多張圖
setting 考慮需不需要一次修改多個，但或許不用先不做,
組建做成在左列，而不是 dialog，且組建變成用拖拉的，這樣用全局組建也方便,
組建內的 node controller 可以考慮拿掉，在其他地方做得好點優化即可，或快速鍵
webfontloader
}

付費功能 {
embed iframe
iframe data control
private project
anaylistic daily data
work sync, they can edit together
host in own domain,
advance timeline animation
animation 3D
}
