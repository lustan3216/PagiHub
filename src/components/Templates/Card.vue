<template>
  <div class="h-100 flex-center">
    <el-card
      v-bind="innerProps"
      :style="innerStyles"
    >
      <grid-layout-inner
        :id="id"
        :inner-props="innerProps"
      />
    </el-card>
  </div>
</template>

<script>
import { Card } from 'element-ui'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import GridLayoutInner from './GridLayoutInner'
import { defaultSetting } from '../Setup/EditorSetting/SettingCard'

export default {
  defaultSetting,
  name: 'Card',
  components: {
    GridLayoutInner,
    ElCard: Card
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
