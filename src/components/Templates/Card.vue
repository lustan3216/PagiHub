<template>
  <el-card :style="innerStyles">
    <grid-generator v-bind="innerChildren[0]" class="h-100" />
  </el-card>
</template>

<script>
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import GridGenerator from './GridGenerator'

export default {
  name: 'Card',
  components: {
    GridGenerator
  },
  mixins: [childrenMixin, commonMixin]
}
</script>

<style lang="scss" scoped>
.edit-area {
  height: 100%;
}
::v-deep.el-card {
  height: 94%;
  width: 94%;
  margin-left: calc(3% - 2px);
  margin-top: calc(3% - 2px);
  & > .el-card__body {
    padding: 0;
    height: 100%;
  }
}
</style>
