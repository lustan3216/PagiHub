<template>
  <div>
    <el-divider content-position="left">STACK MODE</el-divider>

    <el-checkbox
      v-model="isStack"
      :key="isStack"
    >
      <span class="font-12">
        Bounce to below when colliding with another stack element
      </span>
    </el-checkbox>
  </div>
</template>

<script>
import { Tooltip } from 'element-ui'
import { mapActions, mapGetters } from 'vuex'
import { getValueByPath } from '@/utils/tool'
import { STYLES } from '@/const'
import { arrayLast } from '@/utils/array'

export default {
  name: 'Stack',
  components: {
    ElTooltip: Tooltip
  },
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    isStack: {
      get() {
        const lastNode = arrayLast(this.selectedComponentNodes)
        if (lastNode) {
          return getValueByPath(lastNode, [STYLES, 'layout', 'stack'])
        }
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.debounceRecord({
            path: [node.id, STYLES, 'layout', 'stack'],
            value: value || undefined
          })

          this.debounceRecord({
            path: [node.id, STYLES, 'layout', 'position'],
            value: undefined
          })
        })
      }
    }
  },
  methods: {
    ...mapActions('node', ['debounceRecord'])
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
