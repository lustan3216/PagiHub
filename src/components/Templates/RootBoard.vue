<template>
  <browser-window>
    <div class="edit-area">
      <edit-area :children.sync="innerChildren"/>
    </div>
  </browser-window>
</template>

<script>
import EditArea from '../Components/EditArea'
import childrenMixin from '../../mixins/children'
import BrowserWindow from '../BrowserWindow'

export default {
  name: 'RootBoard',
  components: {
    EditArea,
    BrowserWindow
  },
  mixins: [childrenMixin]
}
</script>

<style lang="scss" scoped>
.edit-area{
  height: 100%;
}
</style>
