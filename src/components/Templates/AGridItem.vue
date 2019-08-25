<template>
  <item
    :x="$observableVNode._data.props.x"
    :y="$observableVNode._data.props.y"
    :w="$observableVNode._data.props.w"
    :h="$observableVNode._data.props.h"
    :i="key"
    :key="key"
    @mouseover.native="currentHover = key"
    @mouseleave.native="currentHover = null"
  >
    <transition name="fade">
      <div
        v-if="currentHover === key"
        class="functions">
        <el-button
          type="text"
          @click="copy(key)">
          <v-icon name="copy" />
        </el-button>

        <el-button
          type="text"
          @click="remove(key)">
          <v-icon name="trash-alt" />
        </el-button>
      </div>
    </transition>
    <slot />
  </item>
</template>

<script>
import clone from 'clone'
import GridLayout from 'vue-grid-layout'
import importTemplates from '../../mixins/importTemplates'
import RenderNode from '../RenderNode'

export default {
  name: 'AGridItem',
  components: {
    Item: GridLayout.GridItem,
    RenderNode
  },
  mixins: [importTemplates],
  props: {
    responsive: {
      type: Boolean,
      default() {
        return this.$parent.$vnode.tag.includes('Wrapper')
      }
    },
    isDraggable: {
      type: Boolean,
      default() {
        return this.$parent.$vnode.tag.includes('Wrapper')
      }
    },
    isResizable: {
      type: Boolean,
      default() {
        return this.$parent.$vnode.tag.includes('Wrapper')
      }
    }
  },
  data() {
    return {
      currentHover: null
    }
  },
  computed: {
    key() {
      return this.$observableVNode.data.key
    }
  },
  methods: {
    copy() {
      const cloned = clone(this.$observableVNode)
      this.parent.splice(this.index, 0, cloned)
    },
    remove() {
      this.parent.splice(this.index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.vue-grid-item {
  border-radius: 3px;
  border: 1px solid gray;
  position: relative;
}
::v-deep.el-col {
  border: 1px dashed #909399;
  border-collapse: collapse;
}
.el-col {
  min-height: 240px;
}
</style>
