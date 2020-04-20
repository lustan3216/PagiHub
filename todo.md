component name 都才是最後要顯示的，因為會有例外最外層 tag 是 button 但名字是 drawer

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

### Project

<ol>
<li>自動更新或不自動更新</li>  
<li>要顯示該 component 引用了哪些 component</li>
<li>是組建的要變成點兩下進入該 component 編輯</li>
<li>要做個按鈕 可以選取組建後變成組建</li>  
<li>組建一改 全部都要改，但有被修過的參數不用改</li>
<li>nodes tree 裡面可以拖拉</li>
<li>node tree, project 編輯時不要關起來</li>
</ol>

### Data Base

<ol>
<li>每一段時間草稿要儲存到 server, 修改過後 3 秒後送出，要算出跟 server 版本的 diff 在送出，如果途中有出錯就直接送整個 tree 改掉</li>
<li>component 要用 ulid ?</li>
<li>debounce 送出更新區塊</li>  
<li>根本就不用有formgenerator, 讓submit reset直接去選誰是他管的就好了</li>
<li>form 要可慮可不可以lazyload 不然驗證會有問題</li>
<li>可以控制的層，做一個單個gridItem的component控制，可以隱藏但不能刪除</li>
</ol>

### Functionality

<ol>
<li>考慮拖移的 grid item 可不可以直接 merge 進去 layout</li>
<li>這裏應該要改成從 object node 裡面，且存在 object node style block 是不是跟 class block 功能合併</li>  
<li>轉跳要做成局部轉跳/ 轉跳時componentSet時，要考慮tree，如果是一樣的話就只更新不一樣的地方，但如果是一樣的componentSet的話，照理來說vue自己已經幫我處理了，應該不會重新渲染吧？！</li>
<li>rootlayer 可以新增一個Fix層，可以向navbar一樣position fixed</li>
<li>vue-awesome-swiper</li>  
<li>google map</li>  
<li>icon</li>
<li>setting 區塊做個按鈕，可直接選到上一層組建</li>
<li>組建</li>
</ol>

### Style

<ol>
<li>css 要做 overflow</li>
<li>color 快捷設定, 思考顏色可不可以變成 component, 這樣就也可以分享</li>
<li>Style區塊顯示正在編輯哪個</li>
<li>style 要改成針對組建改 style 而不是外誆，外誆可以改 griditem</li>
<li>style 區塊做個按鈕，可直接選到上一層組建</li>
<li>class / hover / click</li>  
<li>svg</li>
<li>對齊</li>
<li>text-shadow</li>
<li>font align</li>
<li>font family/ 用font picker做但要google帳號</li>
<li>每個template要定義可以編輯的style，只顯示那些，當多選時只用重疊的</li>
<li>寬高要disable，逼他們用layout</li>
</ol>

### Setting

<ol>
<li>這裏應該要改成從 object node 裡面，且存在 object node style block 是不是跟 class block 功能合併</li>
<li>每個 button 都可以點了 連結到 componentSet / tooltip / link</li>
<li>uploader image / svg / video, consider how to compress</li>
<li>grid item 不能調寬，layout 可以, 要思考怎麼讓 gridLayout 可以固定寬</li>
<li>node 可以拖拉到 setting style panel 上就可編輯，也可以拖拉到 空的 GridItem 上, 拖到 grid layout 上就新增</li>
<li>layout 可以每個局部都 設定</li>
<li>button 做成點了可以轉跳 componentSet 或是打開dialog or drawer or popover</li>
<li>grid item and layout 在不同尺寸要可以控制隱藏</li>
</ol>

### Last

<ol>
<li>iframe 要可以自動 resize，且可內船 data or 外傳，而且是reactive的，可以互動</li>
<li>每個project都有全局設定，字型包，顏色，自行試試看能不能用functal變成組建</li>
<li>sidebarRight設定要被技術</li>
<li>Sidebar可以分別被猜拆來</li>
<li>scss code 的東西做成 variable 可以是輸入匡</li>
<li>中英文字體</li>
<li>每個grid item tooltip</li>
<li>PWA</li>  
<li>動畫</li>
</ol>
