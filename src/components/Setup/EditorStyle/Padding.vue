<template>
  <div>
    <span class="el-dropdown">Padding</span>

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
        <el-form-item>
          <select-unit
            :value.sync="computedStyle.padding"
            icon="el-icon-rank"
          />
        </el-form-item>
      </el-col>

      <template v-else>

        <el-col :span="10">
          <el-form-item class="m-b-10">
            <select-unit
              :value.sync="computedStyle.paddingTop"
              icon="el-icon-top"
            />
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item class="m-b-10">
            <select-unit
              :value.sync="computedStyle.paddingBottom"
              icon="el-icon-bottom"
            />
          </el-form-item>
        </el-col>

        <el-col
          :span="10"
          :offset="3"
        >
          <el-form-item>
            <select-unit
              :value.sync="computedStyle.paddingLeft"
              icon="el-icon-back"
            />
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item>
            <select-unit
              :value.sync="computedStyle.paddingRight"
              icon="el-icon-right"
            />
          </el-form-item>
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

