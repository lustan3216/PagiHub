<template>
  <el-carousel height="150px">
    <el-carousel-item
      v-for="item in _items"
      :key="item">
      <h3 class="small">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: 'Carousel',
  props: {
    items: {
      type: Number,
      default: 3
    }
  },
  computed: {
    _items() {
      return this.$observableNode && this.$observableNode._data.props.items || this.items
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
