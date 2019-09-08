<template>
  <el-image
    :src="url"
    :fit="fit"
    class="wh-100" />
</template>

<script>
export default {
  name: 'LazyImage',
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
