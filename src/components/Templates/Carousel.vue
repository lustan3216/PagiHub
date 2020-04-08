<template>
  <el-carousel
    v-if="innerChildren.length"
    ref="carousel"
    :style="innerStyles"
    :autoplay="false"
    trigger="click"
    class="wh-100"
  >
    <el-carousel-item
      v-for="child in innerChildren"
      :ref="child.id"
      :key="child.id"
      @click.stop.native="click(child.id)"
      @mouseleave="mouseLeave"
    >
      <grid-generator
        :id="child.id"
        class="h-100"
      />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { Carousel, CarouselItem } from 'element-ui'
import childrenMixin from '../../mixins/children'
import nodeMixin from '../../mixins/node'
import GridGenerator from './GridGenerator'

export default {
  name: 'Carousel',
  components: {
    ElCarousel: Carousel,
    ElCarouselItem: CarouselItem,
    GridGenerator
  },
  mixins: [childrenMixin, nodeMixin],
  methods: {
    mouseLeave() {
      // this.isEditableId = null
    },
    click(id) {
      // this.isEditableId = id
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-carousel__container {
  height: 100%;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
