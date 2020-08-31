<template>
  <iframe

    v-bind="innerProps"
    width="100%"
    height="100%"
    frameborder="0"
    allowtransparency="true"
  />
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import { defaultSetting } from '../Setup/EditorSetting/SettingIframer'

export default {
  defaultSetting,
  name: 'Iframer',
  mixins: [nodeMixin]
}
</script>

<style lang="scss" scoped></style>
