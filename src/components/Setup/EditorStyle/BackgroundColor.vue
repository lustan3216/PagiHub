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
        <color-picker v-model="backgroundImage" />
      </el-col>
    </el-row>

    <el-row
      type="flex"
      align="middle"
    >
      <el-col
        :span="8"
        class="title"
      >
        Gradient Color
      </el-col>
      <el-col :span="16"/>
    </el-row>
  </div>
</template>

<script>
import ColorPicker from '@/components/Components/ColorPicker'
import ColorPickerGradient from '@/components/Components/ColorPickerGradient'
import forNode from '@/components/Setup/EditorStyle/mixins/forNode'

export default {
  name: 'BackgroundColor',
  mixins: [forNode('backgroundImage')],
  components: {
    ColorPicker,
    ColorPickerGradient
  }
}
</script>

<style scoped lang="scss"></style>
