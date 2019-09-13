<template>
  <el-carousel
    ref="carousel"
    :style="innerStyles"
    trigger="click"
    class="wh-100">
    <el-carousel-item
      v-for="(child, index) in innerChildren"
      :key="child.id"
      :name="child.id.toString()"
      class="w-100"
      @click.native.stop="emitOpenEditBar(child.id)"
    >
      <edit-bar
        :children.sync="innerChildren"
        :index="index"
        new-function
        @onOpen="$refs.carousel.setActiveItem(child.id.toString())"
      />

      <edit-area
        :parent-id="child.id"
        :children="child.children"
        @update:children="updateGrandChildren(index, $event)"
      />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import clone from 'clone'
import { emitOpenEditBar } from '../../buses/editBar'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import EditBar from '../Components/EditBar'
import EditArea from '../Components/EditArea'

export default {
  name: 'Carousel',
  components: {
    EditBar,
    EditArea
  },
  mixins: [childrenMixin, commonMixin],
  props: {
    isEditable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    emitOpenEditBar,
    updateGrandChildren(index, value) {
      // https://vuejs.org/v2/api/#vm-watch ，這裡一定都要clone不然watch裡面新舊值會一樣
      const cloned = clone(this.innerChildren)
      cloned[index].children = value
      this.innerChildren = cloned
    },
    setActiveItem(child) {
      // this.
    }
  }
}
</script>

<style lang="scss" scoped>
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
