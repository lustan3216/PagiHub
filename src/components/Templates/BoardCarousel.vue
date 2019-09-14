<template>
  <browser-window>
    <edit-area
      :parent-id="id"
      :children.sync="innerChildren"
      class="edit-area"
    />
  </browser-window>
</template>

<script>
import EditArea from '../Components/EditArea'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import BrowserWindow from '../BrowserWindow'

export default {
  name: 'BoardCarousel',
  components: {
    EditArea,
    BrowserWindow
  },
  mixins: [childrenMixin, commonMixin]
}
</script>

<style lang="scss" scoped>
.edit-area {
  @include calc-vh(min-height, '100vh - 135px');
  border: none;
}
</style>
