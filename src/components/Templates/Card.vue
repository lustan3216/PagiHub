<template>
  <div class="card-wrapper flex-center">
    <el-card
      v-bind="innerProps.card"
      :style="innerStyles"
    >
      <grid-generator-inner
        :id="id"
        :inner-props="innerProps.grid"
      />
    </el-card>
  </div>
</template>

<script>
import { Card } from 'element-ui'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import gridGeneratorInner from './GridGeneratorInner'
import { defaultSetting } from '../Setup/EditorSetting/SettingCard'

export default {
  defaultSetting,
  name: 'Card',
  components: {
    gridGeneratorInner,
    ElCard: Card
  },
  mixins: [nodeMixin, childrenMixin]
}
</script>

<style lang="scss" scoped>
::v-deep.el-card {
  height: 100%;
  width: 100%;
  & > .el-card__body {
    padding: 0;
    height: 100%;
    overflow: auto;
  }
}
.card-wrapper {
  padding: 15px;
  box-sizing: border-box;
  height: 100%;
}
</style>
