<template>
  <el-alert
    :closable="closeable"
    class="tip"
    type="warning"
  >
    <div class="align-center">
      <div
        class="m-r-15 el-button el-button--primary el-button--mini"
        style="padding: 5px 10px;"
      >
        TIP
      </div>
    </div>
    <div class="content align-center">
      <span class="gray-font">
        <slot />
      </span>
    </div>
  </el-alert>
</template>

<script>
import { Alert } from 'element-ui'
export default {
  name: 'Tip',
  components: {
    ElAlert: Alert
  },
  props: {
    closeable: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.tip {
  background: #f9f8f8;
  padding: 7px 15px;
  border-radius: 10px;
}
.content {
  font-size: 13px;
}
::v-deep.el-alert .el-alert__description {
  margin: 0;
  display: flex;
}
</style>
