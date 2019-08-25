<template>
  <grid-layout
    :layout="children"
    :row-height="30"
    :margin="[10, 10]"
    :responsive="isEditable"
    :is-draggable="isEditable"
    :is-resizable="isEditable"
    :use-css-transforms="false"
    @layout-updated="layoutUpdatedEvent"
  >
    <grid-item
      v-for="(item, index) in children"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      :key="item.i"
      drag-ignore-from="a, button, form, input, p, span, h1, h2, h3, h4, h5, h6"
      @mouseover.native="currentHover = item.i"
      @mouseleave.native="currentHover = null"
    >
      <transition name="fade">
        <div
          v-if="currentHover === item.i"
          class="functions">
          <el-button
            type="text"
            @click="copy(index)">
            <v-icon name="copy" />
          </el-button>

          <el-button
            type="text"
            @click="remove(index)">
            <v-icon name="trash-alt" />
          </el-button>
        </div>
      </transition>
{{ item.i }}
      <edit-area :node="$observableVNode.children[index]"/>
    </grid-item>
  </grid-layout>
</template>

<script>
import clone from 'clone'
import VueGridLayout from 'vue-grid-layout'
import importTemplates from '../../mixins/importTemplates'
import isMixin from '../../mixins/is'
import { removeDeepKey } from '../../utils/keyId'
import EditArea from '../EditArea'

export default {
  name: 'GridGenerator',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    EditArea
  },
  mixins: [importTemplates, isMixin],
  data() {
    return {
      currentHover: null
    }
  },
  computed: {
    children: {
      get() {
        return (
          (this.$observableVNode.children &&
            this.$observableVNode.children.map(({ _data: { props: { x, y, w, h }}, data: { key }}) => ({
              x,
              y,
              w,
              h,
              i: key
            }))) ||
          []
        )
      }
    }
  },
  watch: {
    children(value) {
      if (!value.length) {
        let parentChildren
        if (this.$parentVNode.tag === 'wrapper') {
          if (this.$parentVNode.data.props.$parentVNode) {
            parentChildren = this.$parentVNode.data.props.$parentVNode.children
          } else {
            parentChildren = this.$observable.content
          }
        } else {
          parentChildren = this.$parentVNode.children
        }

        const index = parentChildren.indexOf(this.$observableVNode)
        parentChildren.splice(index, 1)
      }
    }
  },
  methods: {
    layoutUpdatedEvent(value){
      const tree = value.reduce(function(all, obj) {
        all[obj.i] = obj
        return all
      }, {})

      this.$observableVNode.children.forEach(function(child) {
        const data = tree[child.data.key]
        Object.assign(child._data.props, data)
      })
    },
    copy(index) {
      const cloned = clone(this.$observableVNode.children[index])
      delete cloned._data.props.i
      removeDeepKey(cloned)
      this.$observableVNode.children.splice(index, 0, cloned)
    },
    remove(index) {
      this.$observableVNode.children.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.vue-grid-item {
  position: relative;
}
.functions {
  top: -5px;
  right: 10px;
  position: absolute;
}
</style>
