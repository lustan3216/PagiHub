<template>
  <el-carousel
    ref="carousel"
    :style="innerStyles"
    trigger="click"
    class="wh-100">
    <el-carousel-item
      v-for="child in innerChildren"
      v-if="child.visible !== false"
      :ref="child.id"
      :key="child.id"
      :name="child.id.toString()"
      :style="child.styles"
      class="w-100"
      @click.native.stop="emitOpenEditBar(child.id)"
    >
      <grid-generator
        v-if="isEditable"
        :id="child.id"
      />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { emitOpenEditBar } from '../../buses/editBar'
import { onVisibleChange } from '../../buses/visibility'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import EditBar from '../Components/EditBar'
import GridGenerator from './GridGenerator'

export default {
  name: 'Carousel',
  components: {
    GridGenerator,
    EditBar
  },
  mixins: [childrenMixin, commonMixin],
  props: {
    isEditable: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    innerChildren() {
      this.onVisibleChange()
    }
  },
  mounted() {
    this.onVisibleChange()
  },
  methods: {
    emitOpenEditBar,
    onVisibleChange() {
      this.innerChildren.forEach(child => {
        onVisibleChange(child.id, ({ visible }) => {
          // 沒有註冊在data裡面，所以直接set
          this.$set(child, 'visible', visible)
        })
      })
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
