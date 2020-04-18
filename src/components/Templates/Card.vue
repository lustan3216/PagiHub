<template>
  <div class="h-100 flex-center">
    <el-card
      v-bind="innerProps"
      :style="innerStyles"
    >
      <grid-generator-inner
        :id="id"
        :inner-props="innerProps"
      />
    </el-card>
  </div>
</template>

<script>
import nodeMixin from './mixins/node'
import childrenMixin from './mixins/children'
import GridGeneratorInner from './GridGeneratorInner'
import { defaultSetting } from '../Setup/EditorSetting/SettingCard'

export default {
  defaultSetting,
  name: 'Card',
  components: {
    GridGeneratorInner
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
