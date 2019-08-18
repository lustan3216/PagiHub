<template>
  <img
    v-lazy="_url"
    class="w-100" >
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
      return (this.$observableNode && this.$observableNode._data.props.url) || this.url
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
