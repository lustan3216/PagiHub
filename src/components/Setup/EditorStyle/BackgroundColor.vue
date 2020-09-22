<template>
  <div>
    <el-divider content-position="left">
      BACKGROUND
    </el-divider>

    <el-row
      type="flex"
      align="middle"
    >
      <el-col
        :span="8"
        class="title"
      >
        Color
      </el-col>
      <el-col :span="16">
        <color-picker v-model="backgroundColor" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ColorPicker from '@/vendor/element-ui/color-picker'
import forNode from '@/components/Setup/EditorStyle/mixins/forNode'

export default {
  name: 'BackgroundColor',
  mixins: [forNode('backgroundColor')],
  components: {
    ColorPicker
  }
}
</script>

<style scoped lang="scss"></style>
