<template>
  <div >
    <el-divider
      v-bind="innerProps"
      class="divider"
    />
  </div>
</template>

<script>
import propsMixin from '@/components/Templates/mixins/props'

export default {
  name: 'Divider',
  mixins: [propsMixin],
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
