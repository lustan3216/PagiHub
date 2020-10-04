<template>
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
</template>

<script>
import { mapState } from 'vuex'
import ColorPicker from '@/components/Components/ColorPicker'
import forNode from '@/components/Setup/EditorStyle/mixins/forNode'

export default {
  name: 'BackgroundGradient',
  mixins: [forNode('backgroundImage')],
  components: {
    ColorPicker
  },
  computed: {
    ...mapState('app', ['selectedComponentIds'])
  }
}
</script>
