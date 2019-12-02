<template>
  <el-image v-bind="innerProps" :style="innerStyles" class="wh-100" />
</template>

<script>
import commonMixin from '../../mixins/common'
import { defaultSetting } from '../../settings/flexImage'

export default {
  defaultSetting,
  name: 'FlexImage',
  mixins: [commonMixin]
}
</script>

<style lang="scss" scoped></style>
