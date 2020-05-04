<template>
  <four-attrs
    v-model="innerValue"
    attr="borderColor"
  >
    <template #button>
      <el-button
        circle
        icon="el-icon-rank"
      />
    </template>

    <template #default="{ value }">
      <el-col
        v-if="value.isUniq"
        :span="5"
        class="flex"
      >
        <el-button
          type="text"
          icon="el-icon-rank"
        />
        <el-color-picker
          v-model="value.all"
          show-alpha
        />
      </el-col>

      <template v-else>
        <el-col
          :span="4"
          class="flex"
        >
          <el-button
            type="text"
            icon="el-icon-top"
          />
          <el-color-picker
            v-model="value.four.first"
            show-alpha
          />
        </el-col>
        <el-col
          :span="4"
          class="flex"
        >
          <el-button
            type="text"
            icon="el-icon-bottom"
          />
          <el-color-picker
            v-model="value.four.third"
            show-alpha
          />
        </el-col>
        <el-col
          :span="4"
          class="flex"
        >
          <el-button
            type="text"
            icon="el-icon-back"
          />
          <el-color-picker
            v-model="value.four.fourth"
            show-alpha
          />
        </el-col>
        <el-col
          :span="4"
          class="flex"
        >
          <el-button
            type="text"
            icon="el-icon-right"
          />
          <el-color-picker
            v-model="value.four.second"
            show-alpha
          />
        </el-col>
      </template>
    </template>
  </four-attrs>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import FourAttrs from './Common/FourAttrs'

export default {
  name: 'BorderColor',
  components: {
    SelectUnit,
    FourAttrs
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      innerValue: this.value.split(/ (?=r)/)
    }
  },
  watch: {
    innerValue(borderColor) {
      this.$emit('change', { borderColor })
    }
  }
}
</script>
