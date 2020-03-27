<template>
  <el-dialog
    v-bind="$attrs"
    :visible="true"
    title="提示"
  >
    <slot />
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="close">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'FlexDialog',
  data() {
    return {
      dialogVisible: true
    }
  },
  methods: {
    close() {
      this.dialogVisible = false
    }
  }
}
</script>
