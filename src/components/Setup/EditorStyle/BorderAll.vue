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
      {{ isUniq ? 'BORDERS' : 'EACH BORDER' }}
    </el-divider>

    <div
      v-if="isUniq"
      class="flex"
    >
      <border
        v-model="all"
        icon="el-icon-rank"
      />
    </div>

    <div v-else>
      <border
        v-model="borders.borderTop"
        icon="el-icon-top"
      />
      <border
        v-model="borders.borderRight"
        icon="el-icon-right"
      />
      <border
        v-model="borders.borderBottom"
        icon="el-icon-bottom"
      />
      <border
        v-model="borders.borderLeft"
        icon="el-icon-back"
      />
    </div>
  </div>
</template>

<script>
import { Divider } from 'element-ui'
import Border from './Border'
import { arrayUniq, isArray } from '@/utils/tool'

export default {
  name: 'BorderAll',
  components: {
    Border,
    ElDivider: Divider
  },
  props: {
    value: {
      type: Object,
      default: ''
    }
  },
  data() {
    const { border, ...borders }  = this.value
    const isUniq = this.isAllTheSame(borders)

    return {
      all: border,
      borders,
      isUniq
    }
  },
  watch: {
    borders: {
      handler(value) {
        let result
        const values = Object.values(value)
        const isUniq = this.isAllTheSame(value)

        if (isUniq) {
          result = values[0]
          this.$emit('change', { border: result })
        } else {
          this.$emit('change', {
            border: '',
            borderTop: values[0],
            borderRight: values[1],
            borderBottom: values[2],
            borderLeft: values[3]
          })
        }
      },
      deep: true
    },
    all(value) {
      this.$emit('change', { border: value })
    },
    isUniq(value) {
      if (value) {
        this.all = this.borders.borderTop
      } else {
        this.borders.borderTop = this.all
        this.borders.borderRight = this.all
        this.borders.borderBottom = this.all
        this.borders.borderLeft = this.all
      }
    }
  },
  methods: {
    isAllTheSame(four) {
      return arrayUniq(Object.values(four)).length === 1
    }
  }
}
</script>
