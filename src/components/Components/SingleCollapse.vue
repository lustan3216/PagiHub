<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item
      :title="title"
      name="1"
    >
      <template v-if="activeNames">
        <slot />
      </template>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { Collapse, CollapseItem } from 'element-ui'

export default {
  name: 'SingleCollapse',
  components: {
    ElCollapse: Collapse,
    ElCollapseItem: CollapseItem
  },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeNames: null
    }
  }
}
</script>

<style scoped lang="scss">
.el-collapse {
  border: none;
}
::v-deep {
  .el-collapse-item__header {
    font-size: 12px;
    border-bottom: none;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>
