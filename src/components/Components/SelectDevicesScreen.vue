<template>
  <el-dropdown
    split-button
    size="small"
    @command="canvasWidthChange"
  >

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="option in options"
        :key="option"
        :command="option"
      >
        {{ option }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'SelectDevicesScreen',
  data() {
    const options = [
      'Custom',
      '1920px Computer',
      '1200px Computer',
      '996px  Computer',
      '768px  Tablet',
      '320px  Mobile'
    ]

    return {
      current: options[0],
      options
    }
  }
}
</script>

<style scoped lang="scss">

</style>
