<template>
  <div>
    <el-divider
      content-position="left"
      class="m-b-20"
    >
      <el-button
        icon="el-icon-plus"
        @click="isUniq = !isUniq"
      />
      {{ isUniq ? 'BORDERS / PADDING' : 'EACH BORDER / PADDING' }}
    </el-divider>

    <div
      v-if="isUniq"
      class="flex"
    >
      <border
        v-model="uniqValue"
        icon="el-icon-rank"
      />
    </div>

    <div v-else>
      <border
        v-model="value.borderTop"
        icon="el-icon-top"
      />
      <border
        v-model="value.borderRight"
        icon="el-icon-right"
      />
      <border
        v-model="value.borderBottom"
        icon="el-icon-bottom"
      />
      <border
        v-model="value.borderLeft"
        icon="el-icon-back"
      />
    </div>
  </div>
</template>

<script>
import { ColorPicker, Divider } from 'element-ui'
import SelectUnit from '@/components/Components/SelectUnit'
import FourAttrs from './Common/FourAttrs'
import Border from './Border'

export default {
  name: 'BorderAll',
  components: {
    SelectUnit,
    FourAttrs,
    ElColorPicker: ColorPicker,
    Border,
    ElDivider: Divider
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    let uniqValue = ''
    if (this.value.borderTop === this.value.borderRight && this.value.borderBottom === this.value.borderLeft) {
      uniqValue = this.value.borderTop
    }

    return {
      isUniq: true,
      innerValue: this.value,
      uniqValue
    }
  },
  watch: {
    innerValue(borderWidth) {
      this.$emit('change', { borderWidth })
    }
  },
  methods: {

  }
}
</script>
