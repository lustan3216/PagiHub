<template>
  <el-divider
    v-bind="innerProps"
    :style="innerStyles"
    class="divider"
  />
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import { Divider } from 'element-ui'

export default {
  name: 'Divider',
  components: {
    ElDivider: Divider
  },
  mixins: [nodeMixin],
  data() {
    return {
      isHover: false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
  position: absolute;
  top: 50%;
}
.el-divider--vertical {
  position: absolute;
  height: 100%;
  left: 50%;
}
</style>
