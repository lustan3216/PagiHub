<template>
  <el-image
    v-bind="innerSettings('basic')"
    :style="innerStyles"
    class="wh-100" />
</template>

<script>
import commonMixin from '../../mixins/common'
import settings from '../../settings/image'

export default {
  settingsTemplate: settings(),
  name: 'FlexImage',
  mixins: [commonMixin]
}
</script>

<style lang="scss" scoped></style>
