<template>
  <div/>
</template>

<script>
export default {
  name: 'Spacer',
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
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
