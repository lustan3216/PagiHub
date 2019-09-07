<template>
  <el-image
    :src="url"
    :fit="fit"
    style="width: 100px; height: 100px"/>
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
    }
  },
  computed: {
    _url() {
      return this.url
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
