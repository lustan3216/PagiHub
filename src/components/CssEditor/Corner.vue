<template>
  <div>
    <span class="el-dropdown">Corner</span>

    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="3">
        <el-button
          circle

          icon="el-icon-full-screen"
          @click.stop="isCornerAll = !isCornerAll"
        />
      </el-col>

      <el-col
        v-if="isCornerAll"
        :span="10"
      >
        <el-form-item>
          <select-unit
            :value.sync="computedStyle.borderTopLeftRadius"
            icon="el-icon-full-screen"
          />
        </el-form-item>
      </el-col>

      <template v-else>
        <el-col :span="10">
          <el-form-item class="m-b-10">
            <select-unit
              :value.sync="computedStyle.borderTopLeftRadius"
              icon="el-icon-top-left"
            />
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item class="m-b-10">
            <select-unit
              :value.sync="computedStyle.borderTopRightRadius"
              icon="el-icon-top-right"
            />
          </el-form-item>
        </el-col>

        <el-col
          :span="10"
          :offset="3"
        >
          <el-form-item>
            <select-unit
              :value.sync="computedStyle.borderBottomLeftRadius"
              icon="el-icon-bottom-left"
            />
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item>
            <select-unit
              :value.sync="computedStyle.borderBottomRightRadius"
              icon="el-icon-bottom-right"
            />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '../Components/SelectUnit'

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
      isCornerAll: true
    }
  }
}
</script>
