<template>
  <div>
    <el-divider content-position="left">POSITION</el-divider>

    <el-checkbox
      v-model="isStack"
      :key="isStack"
    >
      <span class="font-12">
        Bounce away when two blocks colliding if both enable
      </span>
    </el-checkbox>

    <el-checkbox
      v-if="isStack"
      v-model="verticalCompact"
      :disabled="canNotVerticalCompact"
      class="m-t-10"
      style="margin-bottom: 25px;"
    >
      <span class="font-12">Stick To Top</span>
    </el-checkbox>

    <el-checkbox
      v-else
      v-model="fixed"
      class="m-t-10"
      style="margin-bottom: 25px;"
    >
      <span class="font-12">Fix position when scrolling</span>
    </el-checkbox>
  </div>
</template>

<script>
import { Tooltip } from 'element-ui'
import { mapActions, mapGetters } from 'vuex'
import { getValueByPath } from '@/utils/tool'
import { STYLES } from '@/const'
import { vmGet } from '@/utils/vmMap'
import { arrayLast } from '@/utils/array'

export default {
  name: 'Stack',
  components: {
    ElTooltip: Tooltip
  },
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    canNotVerticalCompact() {
      return this.selectedComponentNodes.find(node => {
        return getValueByPath(node, [STYLES, 'layout', 'stack']) === undefined
      })
    },
    isStack: {
      get() {
        const lastNode = arrayLast(this.selectedComponentNodes)
        if (lastNode) {
          return getValueByPath(lastNode, [STYLES, 'layout', 'stack'])
        }
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.record({
            path: [node.id, STYLES, 'layout', 'stack'],
            value: value || undefined
          })

          this.record({
            path: [node.id, STYLES, 'layout', 'position'],
            value: undefined
          })
        })
      }
    },
    verticalCompact: {
      get() {
        const lastNode = arrayLast(this.selectedComponentNodes)
        if (lastNode) {
          return (
            getValueByPath(lastNode, [STYLES, 'layout', 'position']) ===
            'verticalCompact'
          )
        }
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.record({
            path: [node.id, STYLES, 'layout', 'position'],
            value: value ? 'verticalCompact' : undefined
          })
        })
      }
    },
    fixed: {
      get() {
        const lastNode = arrayLast(this.selectedComponentNodes)
        if (lastNode) {
          return (
            getValueByPath(lastNode, [STYLES, 'layout', 'position']) === 'fixed'
          )
        }
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.record({
            path: [node.id, STYLES, 'layout', 'position'],
            value: value ? 'fixed' : undefined
          })
        })
      }
    }
  },
  methods: {
    ...mapActions('node', ['record'])
  }
}
</script>

<style scoped lang="scss">
.isStack,
.isStack:hover,
.isStack:focus {
  background: $color-active;
  color: white !important;
}

::v-deep.el-checkbox {
  display: flex;
  .el-checkbox__input {
    margin-top: 4px;
  }
  .el-checkbox__label {
    white-space: normal;
  }
}
</style>
