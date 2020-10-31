<template>
  <grid-generator-item :id="id">
    <iframe
      :style="innerStyles.html"
      v-bind="innerProps"
      width="100%"
      height="100%"
      frameborder="0"
      allowtransparency="true"
    />
  </grid-generator-item>
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import { defaultSetting } from '../Setup/EditorSetting/SettingIframer'
import GridGeneratorItem from '@/components/Templates/GridGeneratorItem'

export default {
  defaultSetting,
  name: 'Iframer',
  components: {
    GridGeneratorItem
  },
  mixins: [nodeMixin]
}
</script>

<style lang="scss" scoped></style>
