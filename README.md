注意事項
1. 一切更新都直接透過vm更新組件，再由組建watch值更新vuex
2. vuex 只是記錄值而已，因為效能因素，不使用getter等方式返回給component，grid-layout會重新渲染
3. 更新方式，組建的值第一次都從vuex拿並且放進data裡，在對data watch更新

所以有
innerChildren
innerProps
innerValue
innerSetting
innerStyle

這樣做是為了阻斷 vuex 跟component的循環，永遠都是組建更新之後去vuex更新資料即可
