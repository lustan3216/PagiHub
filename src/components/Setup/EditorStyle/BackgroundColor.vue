<template>
  <div>
    <el-divider content-position="left">
      FILL
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

      <el-col :span="16">
        <color-picker
          :key="selectedComponentIds.join()"
          v-model="backgroundImage"
          gradient
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ColorPicker from '@/components/Components/ColorPicker'
import forNode from '@/components/Setup/EditorStyle/mixins/forNode'

export default {
  name: 'BackgroundColor',
  mixins: [forNode('backgroundColor'), forNode('backgroundImage')],
  components: {
    ColorPicker
  },
  computed: {
    ...mapState('app', ['selectedComponentIds'])
  }
}
</script>

<style scoped lang="scss"></style>
