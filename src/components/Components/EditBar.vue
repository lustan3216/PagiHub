<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="functions">
      <span>{{ node.tag }} - {{ node.id }}</span>

      <el-button
        type="text"
        class="drag-handler">
        <v-icon name="arrows-alt" />
      </el-button>

      <el-button
        v-if="newFunction"
        type="text"
        @click="addNew">
        <v-icon name="plus" />
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
        @click="setting">
        <v-icon name="cog" />
      </el-button>
    </div>
  </transition>
</template>

<script>
import clone from 'clone'
import { onOpenEditBar } from '../../buses/editBar'
import { openSidebar } from '../../buses/sidebar'
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
    },
    newFunction: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    node() {
      return this.children[this.index]
    }
  },
  created() {
    onOpenEditBar(this, () => {
      this.$emit('onOpen')
    })
  },
  methods: {
    addNew() {
      const clonedChildren = clone(this.children)
      const { children, style, data, id, ...baseNode } = clonedChildren[this.index]
      const cloned = clone(baseNode)
      resetIds(cloned)

      clonedChildren.splice(this.index + 1, 0, cloned)

      this.$emit('update:children', clonedChildren)
    },
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
    setting() {
      const node = this.children[this.index]
      openSidebar('SidebarSettings', {
        id: node.id,
        styles: node.styles || {}
      })
    }
  }
}
</script>

<style scoped lang="scss">
.functions {
  top: -35px;
  right: 10px;
  z-index: 100;
  position: absolute;
  width: 220px;
}
.outer {
  position: relative;
}
</style>
