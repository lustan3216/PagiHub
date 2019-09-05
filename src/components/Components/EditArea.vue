<template>
  <draggable
    :value="children"
    handle=".wrapper-handler"
    class="edit-area"
    group="editableArea"
    @input="updated"
  >
    <template v-for="(child, index) in children">
      <div
        :key="child.i"
        class="wrapper"
        @mouseover="isHover = true"
        @mouseleave="isHover = false"
      >
        <edit-bar
          :visible="isHover"
          @copy="copy(index)"
          @remove="remove(index)"
        />
    
        <component
          :is="child.tag"
          :key="child.i"
          :children="child.children"
        />
      </div>
    </template>
  </draggable>
</template>

<script>
import clone from 'clone'
import importTemplates from '../../mixins/importTemplates'
import EditBar from '../Components/EditBar'
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
      cloned.i = null
      this.children.splice(index, 0, cloned)
      this.updated(this.children)
    },
    remove(index) {
      this.children.splice(index, 1)
      this.updated(this.children)
    },
    updated(value) {
      value.forEach(node => appendId(node))
      this.$emit('update:children', value)
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
