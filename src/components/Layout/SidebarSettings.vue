<template>
  <sidebar>
    <el-form>
      <el-form-item
        v-for="(value, name) in currentNode.$options.props"
        v-if="value.type"
        :key="name"
        :label="name">
        <el-input
          :value="propsValue(name)"
          @input="onChange(name, $event)" />
      </el-form-item>
    </el-form>
  </sidebar>
</template>

<script>
import RenderNode from '../RenderNode'
import Sidebar from './Sidebar'

export default {
  name: 'SidebarSettings',
  components: {
    RenderNode,
    Sidebar
  },
  computed: {
    currentNode() {
      return this.$observable.nodeForSetting
    }
  },
  methods: {
    propsValue(name) {
      return this.currentNode.$observableVNode._data.props[name]
    },
    onChange(name, value) {
      const type = this.currentNode.$options.props[name].type
      this.$set(this.currentNode.$observableVNode._data.props, name, type(value))
    }
  }
}
</script>

<style scoped lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}
.el-submenu .el-menu-item {
  height: inherit;
}
</style>
