<template>
  <div>
    <span class="el-dropdown">Margin</span>

    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="3">
        <el-button
          circle

          icon="el-icon-rank"
          @click.stop="isAll = !isAll"
        />
      </el-col>

      <el-col
        v-if="isAll"
        :span="10"
      >
        <select-unit
          :value.sync="computedStyle.margin"
          icon="el-icon-rank"
        />
      </el-col>

      <template v-else>

        <el-col :span="10">
          <select-unit
            :value.sync="computedStyle.marginTop"
            icon="el-icon-top"
          />
        </el-col>

        <el-col :span="10">
          <select-unit
            :value.sync="computedStyle.marginBottom"
            icon="el-icon-bottom"
          />
        </el-col>

        <el-col
          :span="10"
          :offset="3"
        >
          <select-unit
            :value.sync="computedStyle.marginLeft"
            icon="el-icon-back"
          />
        </el-col>

        <el-col :span="10">
          <select-unit
            :value.sync="computedStyle.marginRight"
            icon="el-icon-right"
          />
        </el-col>
      </template>

    </el-row>

  </div>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'

export default {
  name: 'Corner',
  components: {
    SelectUnit
  },
  props: {
    computedStyle: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAll: true
    }
  }
}
</script>
