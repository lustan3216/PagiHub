<template>
  <el-carousel style="height:100%">
    <el-carousel-item
      v-for="(child, index) in innerChildren"
      :key="child.i"
      class="w-100"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
    >
      <edit-bar
        :visible="isHover"
        @copy="copy(index)"
        @remove="remove(index)"
      />
      
      <edit-area :children.sync="child.children"/>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import childrenMixin from '../../mixins/children'
import EditBar from '../Components/EditBar'
import EditArea from '../Components/EditArea'

export default {
  name: 'Carousel',
  components: {
    EditBar,
    EditArea
  },
  mixins: [childrenMixin],
  props: {
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isHover: false
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
