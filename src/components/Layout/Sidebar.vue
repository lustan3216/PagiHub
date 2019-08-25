<template>
  <el-aside class="sidebar">
    <el-row>
      <el-col
        :span="6"
        :offset="18">
        <el-button
          type="text"
          @click="closeSidebar">
          <v-icon name="times" />
        </el-button>
      </el-col>
    </el-row>
    <slot />
  </el-aside>
</template>

<script>
import { closeSidebar } from '../../observable/methods'
import RenderNode from '../RenderNode'

export default {
  name: 'SidebarSettings',
  components: {
    RenderNode
  },
  computed: {
    currentNode() {
      return this.$observable.nodeForSetting
    }
  },
  methods: {
    closeSidebar,
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

::v-deep {
  .el-menu {
    border-right: none;
  }
  .el-submenu .el-menu-item {
    height: inherit;
  }
}
.sidebar {
  background-color: #fff;
  box-shadow: 2px 0px 5px 0 rgba(32, 48, 60, 0.05);
}
</style>
