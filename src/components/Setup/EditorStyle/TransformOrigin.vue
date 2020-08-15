<template>
  <div>
    <el-row
      type="flex"
      align="middle"
    >
      <el-col
        :span="8"
        :offset="4"
      >
        <span class="title">Origin X</span>
      </el-col>

      <el-col :span="12">
        <select-unit
          :units="['%', 'px']"
          v-model="originArray[0]"
          :min="0"
          :max="100"
          :step="1"
        />
      </el-col>
    </el-row>

    <el-row
      type="flex"
      align="middle"
    >
      <el-col
        :span="8"
        :offset="4"
      >
        <span class="title">Origin Y</span>
      </el-col>

      <el-col :span="12">
        <select-unit
          :units="['%', 'px']"
          v-model="originArray[1]"
          :min="0"
          :max="100"
          :step="1"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import forNodeMixin from './mixins/forNode'
import { arrayLast, arrayUniq } from '@/utils/tool'
import { Divider } from 'element-ui'

export default {
  name: 'TransformOrigin',
  mixins: [forNodeMixin('transformOrigin')],
  components: {
    SelectUnit,
    ElDivider: Divider
  },
  data() {
    return {
      originArray: []
    }
  },
  computed: {
    transformOrigin() {
      return arrayLast(this.allValues) || '50% 50%'
    }
  },
  watch: {
    transformOrigin() {
      this.departOriginToArray()
    },
    originArray: {
      handler(originArray) {
        const [x = '50%', y = '50%'] = originArray
        let transformOrigin
        if (x === y && x === '50%') {
          transformOrigin = undefined
        } else if (x === y) {
          transformOrigin = x
        } else {
          transformOrigin = `${x} ${y}`
        }

        this.assignStyles({ transformOrigin })
      },
      deep: true
    }
  },
  created() {
    this.departOriginToArray()
  },
  methods: {
    departOriginToArray() {
      if (this.transformOrigin) {
        this.originArray = this.transformOrigin.split(' ')
      }
    }
  }
}
</script>
