<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-switch v-model="isAll" active-text="All" inactive-text="Separate" />
    </el-col>

    <template v-if="isAll">
      <el-col :span="24">
        <label>Border</label>
        <div class="vertical-center">
          <input-style
            :value="computedStyle.border"
            :type="['unit', 'border-style', 'color']"
            class="vertical-center"
          />
        </div>
      </el-col>
    </template>

    <template v-else>
      <el-col :span="24">
        <label>BorderTop</label>
        <div class="vertical-center">
          <input-style
            :value="computedStyle.borderTop"
            :type="['unit', 'border-style', 'color']"
            class="vertical-center"
          />
        </div>
      </el-col>

      <el-col :span="24">
        <label>BorderRight</label>
        <div class="vertical-center">
          <input-style
            :value="computedStyle.borderRight"
            :type="['unit', 'border-style', 'color']"
            class="vertical-center"
          />
        </div>
      </el-col>

      <el-col :span="24">
        <label>BorderBottom</label>
        <div class="vertical-center">
          <input-style
            :value="computedStyle.borderBottom"
            :type="['unit', 'border-style', 'color']"
            class="vertical-center"
          />
        </div>
      </el-col>

      <el-col :span="24">
        <label>BorderLeft</label>
        <input-style
          :value="computedStyle.borderLeft"
          :type="['unit', 'border-style', 'color']"
          class="vertical-center"
        />
      </el-col>
    </template>
  </el-row>
</template>

<script>
import InputStyle from './Components/InputStyle'

export default {
  name: 'Border',
  components: {
    InputStyle
  },
  props: ['computedStyle'],
  data() {
    return {
      isAll: true
    }
  }
}
</script>
