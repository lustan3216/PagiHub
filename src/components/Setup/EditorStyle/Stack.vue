<template>
  <div>
    <el-divider content-position="left">STACK MODE</el-divider>

    <el-checkbox
      v-model="isStack"
      :key="isStack"
    >
      <span
        class="font-12"
      >Bounce away when two blocks colliding if both enable.</span>
    </el-checkbox>
  </div>
</template>

<script>
import { Tooltip } from 'element-ui'
import { mapActions, mapGetters } from 'vuex'
import { getValueByPath } from '@/utils/tool'
import { STYLES } from '@/const'
import { vmGet } from '@/utils/vmMap'
import { closestGridItem } from '@/utils/node'
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
          return getValueByPath(vmGet(lastNode.id), [
            'innerStyles',
            'layout',
            'stack'
          ])
        }
      },
      set() {
        this.selectedComponentNodes.forEach(node => {
          this.record({
            path: [node.id, STYLES, 'layout', 'stack'],
            value: this.isStack ? undefined : true
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
