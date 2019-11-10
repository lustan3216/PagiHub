<template>
  <el-dialog
    v-bind="$attrs"
    :visible="true"
    :before-close="CLOSE_DIALOG"
    title="提示"
  >
    <slot />
    <span slot="footer" class="dialog-footer">
      <el-button @click="CLOSE_DIALOG">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Dialog',
  data() {
    return {
      dialogVisible: true
    }
  },
  methods: {
    ...mapMutations('layout', ['CLOSE_DIALOG'])
  }
}
</script>

<style scoped lang="scss"></style>
