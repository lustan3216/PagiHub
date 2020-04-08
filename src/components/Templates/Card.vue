<template>
  <div class="h-100 flex-center">
    <el-card
      v-bind="innerProps"
      :style="innerStyles"
    >
      <grid-generator :id="id" />
    </el-card>
  </div>
</template>

<script>
import nodeMixin from '../../mixins/node'
import childrenMixin from '../../mixins/children'
import GridGenerator from './GridGenerator'
import { defaultSetting } from '../../settings/card'

export default {
  defaultSetting,
  name: 'Card',
  components: {
    GridGenerator
  },
  mixins: [nodeMixin, childrenMixin]
}
</script>

<style lang="scss" scoped>
::v-deep.el-card {
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  & > .el-card__body {
    padding: 0;
    height: 100%;
  }
}
</style>
