<template>
  <component
    :is="hasChildren(node) ? 'el-submenu' : 'el-menu-item'"
    :index="node.id.toString()"
    :key="node.id"
    :class="{ 'is-activated': node.id === activeId }"
    @click.native.stop="$emit('onClick', node.id)"
  >
    <template slot="title">
      <visibility :id="node.id" />
      <el-tooltip :content="content(node)" effect="light" placement="right">
        <el-button type="text">{{ node.tag }} - {{ node.id }}</el-button>
      </el-tooltip>
    </template>

    <nested-menu
      v-for="child in node.children"
      :node="child"
      :key="child.id"
      :active-id="activeId"
      @onClick="$emit('onClick', $event)"
    />
  </component>
</template>

<script>
import Visibility from './Visibility'
export default {
  name: 'NestedMenu',
  components: {
    Visibility
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    activeId: {
      type: Number
    }
  },
  data() {
    return {
      visible: true
    }
  },
  methods: {
    content(node) {
      if (node.tag === 'grid-item') {
        return `${node.x}-${node.y}-${node.w}-${node.h}`
      } else {
        return 'none'
      }
    },
    hasChildren(node) {
      return node.children && node.children.length
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
::v-deep.el-menu-item.is-activated,
::v-deep.el-submenu.is-activated > .el-submenu__title {
  color: #409eff;
}
</style>
