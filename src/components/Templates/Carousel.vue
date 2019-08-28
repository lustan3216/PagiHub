<template>
  <el-carousel style="height:100%">
    <el-carousel-item
      v-for="(child, index) in innerChildren"
      :key="index"
      class="w-100">
  
      <edit-area :children.sync="child.children"/>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import childrenMixin from '../../mixins/children'
export default {
  name: 'Carousel',
  mixins: [childrenMixin]
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
