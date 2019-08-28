<template>
  <div
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
      :is="tag"
      :children="innerChildren"
      @updated="updateTree"/>
  </div>
</template>

<script>
import clone from 'clone'
import importTemplates from '../mixins/importTemplates'
import EditBar from './Components/EditBar'

export default {
  name: 'Wrapper',
  components: { EditBar },
  mixins: [importTemplates],
  props: {
    tag: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    children: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isHover: false,
      innerData: clone(this.data),
      innerChildren: clone(this.children)
    }
  },
  watch: {
    innerChildren(value) {
      console.log(value)
    }
  },
  methods: {
    updateTree() {},
    copy() {
      this.$emit('copy', this)
      // const cloned = clone(this.$observableVNode)
      // removeDeepKey(cloned)
      // this.parent.splice(this.index, 0, cloned)
    },
    remove() {
      this.$emit('remove', this)
      // this.parent.splice(this.index, 1)
    },
    settings() {
      // this.$observable.nodeForSetting = this.$children[0]
      // openSettingsSidebar()
    },
    setContent(value) {
      this.innerChildren = value
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  position: relative;
  padding: 15px;
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
