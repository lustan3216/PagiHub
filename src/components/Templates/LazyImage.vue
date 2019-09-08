<template>
  <el-image
    :src="url"
    :fit="fit"
    style="width: 100%; min-height: 60%;"
  />
</template>

<script>
export default {
  name: 'LazyImage',
  props: {
    url: {
      type: String,
      default() {
        return `https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg`
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
