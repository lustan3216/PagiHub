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
page interactions can’t be copied

PM 直接做完，可以設計師接著做
避風港機制 三振條款

塗層越高越上面，狂狂在底層，ｐａｎｅｌ node 要可以點直接選到
選擇 shift 要一次、上下選很多

2. 每個 componentSet 可以設定自己的 route，發布後別人可以通過 route 連到該 componentSet

3. Q 右側 style, setting 的面板要拆開嗎
   A (拆開) 用快捷鍵解決

4. 當畫布中 component 選中時，怎麼提示使用者接下來的操作，有複製，刪除，隱藏，鎖住，可以拖拉元件等，可再剪下貼上，怎麼提示會比較好，需要 node 名字嗎

5. 每個 component 的操作及說明改怎麼統一顯示，譬如 texteditor 操作有點豐富，很多快捷鍵以及指令的說明, 打 markdown 是方便的嗎

6. Button 這個組建有個功能是，當點選後可指定畫布中的某個 compoennt 替換成另一個 component，這個功能需要介面

7. 右邊那塊 style, setting 只需要優化排版和 UI，我自己會再補上 overflow, gradient color, text align, 這裡滿多功能壞掉，目前還不會去修

9) 使用者可上傳 image, svg 。照片可以在 image component 內選用，svg 可在 text editor 裡面選用

10) 右邊設定哪裡可以改進

11) 右上的 node 需要顯示嗎

12) 會希望怎麼選擇到 選不到的 node

13) 要怎麼知道可以 copy / paste / delete / 或跨 component copy

14) 需要點兩下才能操作，怎麼讓使用人知道

15) 怎麼選擇 component 選擇，因為一個 layout 只能一個 component, 可以直接 layout 點了出現選單嗎，modal or sidebar

16) 為什麼會需要 asset management

17) 選到你要的 layout 可能要多次，編筐編筐

18) webflow, blocsapp 有 form 嗎

19) 如果想要只編輯 component 怎麼辦
