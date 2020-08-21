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
import { vmAddNodesToParentAndRecord } from '@/utils/vmMap'

export default {
  name: 'DialogComponentAdd',
  components: {
    ComponentTabs
  },
  props: {
    id: {
      type: String,
      required: true
    },
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
      vmAddNodesToParentAndRecord(this.id, template)
      this.selectedName = template.tag
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.tabs > div > .el-tabs__nav-wrap {
  margin-left: auto;
  margin-right: auto;
}
.dialog,
::v-deep.dialog .el-dialog__header,
::v-deep.dialog .el-dialog__body {
  padding: 0;
}
::v-deep > .el-dialog {
  border-radius: 5px;
}
.component {
  height: 200px;
}
</style>
