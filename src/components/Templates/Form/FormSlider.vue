<template>
  <form-item
    v-model="api"
    :rule="innerRule"
    :option="option"
    :class="{ vertical }"
  />
</template>

<script>
import commonMixin from '../../../mixins/common'
import formItemMixin from '../../../mixins/formItem'
import { defaultSetting } from '../../../settings/formItem/formSlider'

export default {
  defaultSetting,
  type: 'slider',
  name: 'FormSlider',
  mixins: [commonMixin, formItemMixin],
  computed: {
    vertical() {
      return this.innerRule[0].props.vertical
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.vertical {
  height: 100%;

  .el-slider,
  .el-form-item__content,
  .el-form-item,
  .el-col,
  .el-row,
  .el-form {
    height: 100%;
  }

  .el-slider {
    height: calc(100% - 20px) !important;
    margin-top: 10px;
  }
}
</style>
