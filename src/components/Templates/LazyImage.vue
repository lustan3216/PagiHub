<template>
  <el-image
    :src="url"
    :fit="fit"
    :style="innerStyles"
    class="wh-100" />
</template>

<script>
import commonMixin from '../../mixins/common'

export default {
  name: 'LazyImage',
  mixins: [commonMixin],
  props: {
    url: {
      type: String,
      default() {
        return `https://placeimg.com/1320/840/any`
      }
    },
    fit: {
      type: String,
      default: 'cover'
    }
  }
}
</script>

<style lang="scss" scoped></style>
