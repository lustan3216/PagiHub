<template>
  <grid-generator-item :id="id">
    <iframe
      v-bind="innerProps"
      width="100%"
      height="100%"
      frameborder="0"
      allowtransparency="true"
    />
  </grid-generator-item>
</template>

<script>
import propsMixin from '@/components/Templates/mixins/props'
import { defaultSetting } from '../Setup/EditorSetting/SettingIframer'
import GridGeneratorItem from '@/components/Templates/GridGeneratorItem'

export default {
  defaultSetting,
  name: 'Iframer',
  components: {
    GridGeneratorItem
  },
  mixins: [propsMixin]
}
</script>

<style lang="scss" scoped></style>
