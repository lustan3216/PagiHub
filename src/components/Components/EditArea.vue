<template>
  <draggable
    :value="children"
    handle=".wrapper-handler"
    class="edit-area"
    group="editableArea"
    @input="updated">
    <template v-for="(child, index) in children">
      <div
        :key="child.id"
        class="wrapper"
        @mouseover="isHover = true"
        @mouseleave="isHover = false">
        <edit-bar
          :visible="isHover"
          @copy="copy(index)"
          @remove="remove(index)" />

        <component
          :ref="index"
          :is="child.tag"
          :key="child.id"
          :id="child.id"
          :parent-id="parentId"
          :children="child.children"
        />
      </div>
    </template>
  </draggable>
</template>

<script>
import clone from 'clone'
import EditBar from '../Components/EditBar'
import importTemplates from '../../mixins/importTemplates'
import { appendId } from '../../utils/keyId'

export default {
  name: 'EditArea',
  components: { EditBar },
  mixins: [importTemplates],
  props: {
    children: {
      type: Array,
      default() {
        return []
      }
    },
    parentId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isHover: false
    }
  },
  methods: {
    copy(index) {
      const cloned = clone(this.children[index])
      cloned.children = this.$refs[index][0].innerChildren
      // TODO to solve nested children problem
      // 為了阻止遞歸的小孩們更新迴圈(效能上問題)，所以innerChildren每次更新到這層就不更新
      // 這樣會導致這層child是原始的，而這裡需要copy最新的innerChildren
      cloned.id = null
      this.children.splice(index + 1, 0, cloned)
      this.updated(this.children)
    },
    remove(index) {
      this.children.splice(index, 1)
      this.updated(this.children)
    },
    updated(children) {
      children.forEach((child, index) => {
        appendId(child)
        child.sortIndex = index
      })
      this.$emit('update:children', children)
    }
  }
}
</script>

<style scoped lang="scss">
.edit-area {
  height: 100%;
}
.wrapper {
  position: relative;
  padding: 15px;
  box-sizing: border-box;
}
.functions {
  top: -35px;
  right: 10px;
  position: absolute;
}
.edit-area {
  min-height: 100px;
}
</style>
