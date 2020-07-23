1. style 能用
2. component 能連結
3. componentset 引用都正常
4. 可外連 不用 domain 沒關係

### Functionality

<ol>
5<li>rootlayer 可以新增一個Fix層，可以向navbar一樣position fixed / fixed container</li> 
3<li>有假死狀態可以做 剪下貼上</li>
5<li>每個 component set 都可以組建合併得按鈕  / or 選版本 / 跟隨proejct裡面的變動，只是不同project的因為沒有主動更新所以也不會主動變動</li>
2<li>自己的project有引用的，有修改的都可以直接儲存了，因為不會引響到其他專案</li>
5<li>search panel</li>
10<li>每個 button 都可以點了 連結到 componentSet / link / 需用state 的結構去做 click hover active 等等切換componentSet，這個要去另一個版操作，向XD的prototype</li>
5<li>瀏覽器資源，手機版只能預覽，預覽要修正bug</li>
2<li>componentSet 裡面的compopentSet 分離，不要隨著源頭跟動</li>
20<li>可瀏覽 production版本</li>
</ol>

### Style

<ol>
1<li>overflow</li>
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
<li>SEO首頁</li>
<li>怎麼讓使用者更好選上下node</li>
<li>試試看能不能解決 drawer的layout</li>
<li>background color 用grediant做， 等 color picker在做</li>
<li>node tree moving</li>
<li>description 用 editor</li>
<li>form-item 需要指定el編輯</li>
<li>暫時form 先不做</li>
<li>SEO / sitemap / like一定高分一上才產</li></li>
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
</ol>

付費功能 {
私人專案
且可內船 data or 外傳，而且是 reactive 的，可以互動
anaylistic daily data
host in own domain,
擴充字體 / webfontloader
form submit amount 1000, can be deleted,
connect to google sheet
可上傳影音
多國語言
可以有預覽版本，分享給別人看，並且可以下 comment
}

payment / 下單 可參考 wix
售價 參考 netflex 用多人收錢策略
user needs to bring some users to open functions

my advantage

1. can publish as a web, even has a domain
2. component can be Any design
3. the components are public to share to anyone, which means users can reuse or restyle any component
4. great RWD experience

step functions
event bridge
sub/pub/
queue
sns / sqs
vpn
kafka

componentID 都一樣不用變
masterId 記在 componentSet 就好
每個 component 都要有 componentSetId
form 裡面的設定的抓 componentSetId +componentId 如果有 master 就抓 masterId + componentId
masterId 只要記得上一個複製的源頭就可以
