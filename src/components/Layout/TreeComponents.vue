<template>
  <div class="p-5">
    <div class="text-center">
      <span class="el-dropdown m-b-5 bold">COMPONENTS</span>
    </div>
  </div>
</template>

<script>
// TODO 每個組件都是一串JSON，且要分版本，引用時給類似github名字以及版本號
// 該專案的component更新時，只會自動更新該專案內的component
// 其他專案的不會更新，除非手動選取更新，fork 的版本會等於複製時的版本，fork版本更新會從當下版本號更新
// 每個版本可以附上List敘述，
// 有更新版本就顯示icon

export default {
  name: 'TreeComponents'
}
</script>
