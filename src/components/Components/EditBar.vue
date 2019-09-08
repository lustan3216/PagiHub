<template>
  <component
    v-popover:popover
    :is="isInlineElement ? 'span' : 'div'"
    class="h-100"
    @mouseover="visible = true"
    @mouseleave="visible = false"
  >
    <el-popover
      ref="popover"
      :value="visible || isHover"
      :placement="isInlineElement ? 'top' : 'right-start'"
      trigger="manual"
    >
      <div
        @mouseover="isHover = true"
        @mouseleave="isHover = false">
        <span>
          {{ children[index].tag }}
        </span>
        <el-button
          type="text"
          class="wrapper-handler">
          <v-icon name="arrows-alt" />
        </el-button>

        <el-button
          type="text"
          @click="copy">
          <v-icon name="copy" />
        </el-button>

        <el-button
          type="text"
          @click="remove">
          <v-icon name="trash-alt" />
        </el-button>

        <el-button
          type="text"
          @click="$emit('setting')">
          <v-icon name="cog" />
        </el-button>
      </div>
    </el-popover>
    <slot />
  </component>
</template>

<script>
import clone from 'clone'
import { appendIds, resetIds } from '../../utils/keyId'

export default {
  name: 'EditBar',
  props: {
    children: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isHover: false,
      visible: false
    }
  },
  computed: {
    isInlineElement() {
      return ['flex-button'].includes(this.children[this.index].tag)
    }
  },
  methods: {
    // 這裡的update也額外會來自於EditArea裡面的變動，因為EditArea會$emit(update:children)上一層的小孩
    // https://vuejs.org/v2/api/#vm-watch ，這裡一定都要clone不然watch裡面新舊值會一樣
    copy() {
      const clonedChildren = clone(this.children)
      const cloned = clone(clonedChildren[this.index])
      resetIds(cloned)

      clonedChildren.splice(this.index + 1, 0, cloned)

      this.$emit('update:children', clonedChildren)
    },
    remove() {
      const clonedChildren = clone(this.children)
      clonedChildren.splice(this.index, 1)

      this.update(clonedChildren)
    },
    update(children) {
      children.forEach((child, index) => {
        // layout could add new Component or re-sort
        appendIds(child)
        child.sortIndex = index
      })

      this.$emit('update:children', children)
    },
    asd() {
      console.log(123)
    }
  }
}
</script>

<style scoped lang="scss">
.functions {
  top: -5px;
  z-index: 100;
  position: absolute;
}
</style>
