<template>
  <el-button
    :type="button ? '' : 'text'"
    icon="el-icon-circle-plus-outline"
    @click.stop="visible = true"
  >
    <span v-if="button">{{ selectedName || 'Choose Component' }}</span>
    <el-dialog
      ref="dialog"
      :visible.sync="visible"
      class="dialog"
      append-to-body
      top="5vh"
      width="80vw"
      @open="$emit('open')"
      @close="visible = false"
    >
      <component-tabs @choose="addTemplate" />
    </el-dialog>
  </el-button>
</template>

<script>
import ComponentTabs from './ComponentTabs'

export default {
  name: 'ExampleAdd',
  components: {
    ComponentTabs
  },
  props: {
    button: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      selectedName: null
    }
  },
  methods: {
    addTemplate(template) {
      this.$emit('onAdd', template)
      this.selectedName = template.tag
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep.tabs > div > .el-tabs__nav-wrap {
    width: 250px;
    margin-left: auto;
    margin-right: auto;
  }
  ::v-deep.dialog > .el-dialog__header {
    padding: 0;
  }
  .component {
    height: 200px;
  }
</style>
