<template>
  <el-tooltip
    effect="light"
    content="My space"
    placement="bottom"
  >
    <el-button
      v-shortkey="['meta', 'd']"
      type="text"
      icon="el-icon-lollipop"
      @shortkey.native="visible = true"
      @click="visible = true"
    >
      <el-dialog
        :visible.sync="visible"
        append-to-body
        destory-on-close
      >
        <div style="min-height: 300px">
          <SliderPoints
            v-model="asd"
            :min="320"
            :max="1920"
            :step="10"
            vertical
            height="300px"
            size="mini"
          />
        </div>
      </el-dialog>
    </el-button>
  </el-tooltip>
</template>

<script>
import DialogInteracted from '@/components/Components/DialogInteracted'
import SliderPoints from '@/components/Components/SliderPoints'

export default {
  name: 'MySpace',
  components: {
    DialogInteracted,
    SliderPoints
  },
  data() {
    return {
      visible: false,
      asd: [320, 580, 770, 990, 1200]
    }
  }
}
</script>
<style scoped lang="scss">
.slider {
  position: absolute;
  width: 95%;
}
</style>
