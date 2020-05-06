<template>
  <el-image
    v-free-style="innerStyles"
    v-bind="innerProps"
    class="wh-100"
  >
    <div
      slot="error"
      class="el-image__error"
    >
      {{ innerProps.error }}
    </div>
  </el-image>
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import { defaultSetting } from '../Setup/EditorSetting/SettingFlexImage'
import { Image } from 'element-ui'

export default {
  defaultSetting,
  name: 'FlexImage',
  components: {
    ElImage: Image
  },
  mixins: [nodeMixin]
}
</script>

<style lang="scss" scoped></style>
